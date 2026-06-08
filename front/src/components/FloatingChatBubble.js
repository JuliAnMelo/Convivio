import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useReceptionChat } from '../context/ReceptionChatContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { AuthContext } from '../context/AuthContext';

const GUARD_AVATAR    = require('../../assets/Images/guardia.webp');
const RESIDENT_AVATAR = require('../../assets/Images/residente.jpg');
const BUBBLE_SIZE = 64;
const { width: SW, height: SH } = Dimensions.get('window');
const EDGE_MARGIN = 14;
const INITIAL_X = SW - BUBBLE_SIZE - EDGE_MARGIN;
const INITIAL_Y = SH * 0.62;
const DISMISS_MS = 40000;
const DRAG_THRESHOLD = 6;
const DELETE_ZONE_CX = SW / 2;
const DELETE_ZONE_CY = SH - 90;
const DELETE_ZONE_TRIGGER = BUBBLE_SIZE + 24;

export default function FloatingChatBubble({ navigationRef }) {
  const {
    showBubble, lastGuardMessage,
    showGuardBubble, guardUnreadCount, lastResidentMessage,
    openChat, dismissBubble, discardBubble, setGuardChatIsOpen,
  } = useReceptionChat();
  const { user } = useContext(AuthContext);
  const { shouldAnimate } = useAccessibility();

  const isGuard = user?.role === 'guarda';
  // Which trigger drives the bubble
  const shouldShow = isGuard ? showGuardBubble : showBubble;
  const lastMessage = isGuard ? lastResidentMessage : lastGuardMessage;
  const bubbleCount = isGuard ? guardUnreadCount : 1;
  const bubbleAvatar = isGuard ? RESIDENT_AVATAR : GUARD_AVATAR;
  const discardRef = useRef(discardBubble);
  discardRef.current = discardBubble;

  const [previewVisible, setPreviewVisible] = useState(false);
  const snappedToRightRef = useRef(true);
  const panOffsetRef = useRef({ x: INITIAL_X, y: INITIAL_Y });
  const isOverDeleteRef = useRef(false);
  const isDragging = useRef(false);
  const isAnimatingOut = useRef(false);

  const pan = useRef(new Animated.ValueXY({ x: INITIAL_X, y: INITIAL_Y })).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const bubbleScale = useRef(new Animated.Value(0)).current;
  const bubbleOpacity = useRef(new Animated.Value(1)).current;
  const previewOpacity = useRef(new Animated.Value(0)).current;
  const deleteZoneOpacity = useRef(new Animated.Value(0)).current;
  const deleteZoneScale = useRef(new Animated.Value(0.6)).current;
  const deleteZoneHighlight = useRef(new Animated.Value(0)).current;

  const dismissTimer = useRef(null);
  const previewTimer = useRef(null);

  const cancelDismissTimer = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  };
  const cancelPreviewTimer = () => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
  };

  const showDeleteZone = () => {
    Animated.parallel([
      Animated.timing(deleteZoneOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(deleteZoneScale, {
        toValue: 1,
        tension: 80,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideDeleteZone = () => {
    Animated.parallel([
      Animated.timing(deleteZoneOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(deleteZoneScale, { toValue: 0.6, duration: 220, useNativeDriver: true }),
      Animated.timing(deleteZoneHighlight, { toValue: 0, duration: 220, useNativeDriver: false }),
    ]).start();
  };

  const hidePreview = () => {
    Animated.timing(previewOpacity, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start(() => setPreviewVisible(false));
  };

  const showMessagePreview = () => {
    cancelPreviewTimer();
    setPreviewVisible(true);
    previewOpacity.setValue(0);
    Animated.timing(previewOpacity, { toValue: 1, duration: 280, useNativeDriver: true }).start();
    previewTimer.current = setTimeout(hidePreview, 3800);
  };

  const playEnterAnimation = () => {
    isAnimatingOut.current = false;
    pan.stopAnimation();
    pan.setOffset({ x: 0, y: 0 });
    pan.setValue({ x: INITIAL_X, y: INITIAL_Y });
    panOffsetRef.current = { x: INITIAL_X, y: INITIAL_Y };
    snappedToRightRef.current = true;
    bubbleOpacity.setValue(1);
    overlayOpacity.setValue(0);

    if (!shouldAnimate) {
      bubbleScale.setValue(1);
      showMessagePreview();
      return;
    }

    Animated.sequence([
      Animated.timing(overlayOpacity, { toValue: 0.42, duration: 320, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 580, useNativeDriver: true }),
    ]).start();

    bubbleScale.setValue(0);
    Animated.spring(bubbleScale, { toValue: 1, tension: 70, friction: 6, useNativeDriver: true }).start();

    showMessagePreview();
  };

  const playExitAnimation = (onDone) => {
    isAnimatingOut.current = true;
    cancelPreviewTimer();
    previewOpacity.setValue(0);
    setPreviewVisible(false);

    if (!shouldAnimate) {
      isAnimatingOut.current = false;
      onDone?.();
      return;
    }

    const targetX = snappedToRightRef.current
      ? SW + BUBBLE_SIZE + 20
      : -BUBBLE_SIZE - 20;

    Animated.parallel([
      Animated.timing(pan.x, { toValue: targetX, duration: 380, useNativeDriver: false }),
      Animated.timing(bubbleScale, { toValue: 0.6, duration: 380, useNativeDriver: true }),
      Animated.timing(bubbleOpacity, { toValue: 0, duration: 380, useNativeDriver: false }),
    ]).start(() => {
      isAnimatingOut.current = false;
      onDone?.();
    });
  };

  const startDismissTimer = () => {
    cancelDismissTimer();
    dismissTimer.current = setTimeout(() => {
      playExitAnimation(() => dismissBubble());
    }, DISMISS_MS);
  };

  useEffect(() => {
    if (shouldShow) {
      playEnterAnimation();
      startDismissTimer();
    } else if (!isAnimatingOut.current) {
      cancelDismissTimer();
      cancelPreviewTimer();
      bubbleScale.setValue(0);
      bubbleOpacity.setValue(1);
      overlayOpacity.setValue(0);
      previewOpacity.setValue(0);
      setPreviewVisible(false);
    }
    return () => {
      cancelDismissTimer();
      cancelPreviewTimer();
    };
  }, [showBubble]);

  useEffect(() => {
    if (lastMessage?.id) {
      showMessagePreview();
      if (shouldShow) startDismissTimer();
    }
  }, [lastMessage?.id]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > DRAG_THRESHOLD || Math.abs(gs.dy) > DRAG_THRESHOLD,

      onPanResponderGrant: () => {
        pan.stopAnimation();
        isDragging.current = false;
        isOverDeleteRef.current = false;
        panOffsetRef.current = { x: pan.x._value, y: pan.y._value };
        pan.setOffset(panOffsetRef.current);
        pan.setValue({ x: 0, y: 0 });
        showDeleteZone();
      },

      onPanResponderMove: (_, gs) => {
        if (Math.abs(gs.dx) > DRAG_THRESHOLD || Math.abs(gs.dy) > DRAG_THRESHOLD) {
          isDragging.current = true;
        }
        pan.setValue({ x: gs.dx, y: gs.dy });

        // Absolute bubble center
        const cx = panOffsetRef.current.x + gs.dx + BUBBLE_SIZE / 2;
        const cy = panOffsetRef.current.y + gs.dy + BUBBLE_SIZE / 2;
        const dist = Math.sqrt(
          Math.pow(cx - DELETE_ZONE_CX, 2) + Math.pow(cy - DELETE_ZONE_CY, 2)
        );
        const over = dist < DELETE_ZONE_TRIGGER;

        if (over !== isOverDeleteRef.current) {
          isOverDeleteRef.current = over;
          Animated.timing(deleteZoneHighlight, {
            toValue: over ? 1 : 0,
            duration: 150,
            useNativeDriver: false,
          }).start();
          Animated.spring(deleteZoneScale, {
            toValue: over ? 1.25 : 1,
            tension: 120,
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },

      onPanResponderRelease: (_, gs) => {
        hideDeleteZone();

        if (isOverDeleteRef.current) {
          isOverDeleteRef.current = false;
          isAnimatingOut.current = true;
          pan.flattenOffset();
          // Bubble flies into the trash zone
          Animated.parallel([
            Animated.timing(pan.x, {
              toValue: DELETE_ZONE_CX - BUBBLE_SIZE / 2,
              duration: 260,
              useNativeDriver: false,
            }),
            Animated.timing(pan.y, {
              toValue: DELETE_ZONE_CY - BUBBLE_SIZE / 2,
              duration: 260,
              useNativeDriver: false,
            }),
            Animated.spring(bubbleScale, {
              toValue: 0,
              tension: 140,
              friction: 6,
              useNativeDriver: true,
            }),
          ]).start(() => {
            isAnimatingOut.current = false;
            discardRef.current?.();
          });
          return;
        }

        pan.flattenOffset();
        const curX = pan.x._value;
        const curY = pan.y._value;

        const clampedY = Math.max(80, Math.min(SH - BUBBLE_SIZE - 90, curY));
        const isRight = curX + gs.vx * 30 > SW / 2;
        const snapX = isRight ? SW - BUBBLE_SIZE - EDGE_MARGIN : EDGE_MARGIN;
        snappedToRightRef.current = isRight;
        panOffsetRef.current = { x: snapX, y: clampedY };

        Animated.spring(pan, {
          toValue: { x: snapX, y: clampedY },
          tension: 55,
          friction: 7,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handlePress = () => {
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }
    cancelDismissTimer();
    cancelPreviewTimer();
    if (isGuard) {
      const threadId = lastResidentMessage?.threadId;
      if (threadId) {
        setGuardChatIsOpen(threadId, true);
        navigationRef.current?.navigate('GuardReception', { threadId });
      } else {
        navigationRef.current?.navigate('GuardChatList');
      }
    } else {
      openChat();
      navigationRef.current?.navigate('ReceptionChat');
    }
  };

  if (!shouldShow) return null;

  return (
    <>
      {/* Dark background flash */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: '#000', opacity: overlayOpacity, zIndex: 9996 },
        ]}
      />

      {/* Delete zone — bottom center, visible while dragging */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.deleteZoneOuter,
          {
            opacity: deleteZoneOpacity,
            transform: [{ scale: deleteZoneScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.deleteZoneCircle,
            {
              backgroundColor: deleteZoneHighlight.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(70, 70, 70, 0.78)', 'rgba(255, 59, 48, 0.92)'],
              }),
            },
          ]}
        >
          <Ionicons name="trash-outline" size={28} color="#FFF" />
        </Animated.View>
        <Text style={styles.deleteZoneLabel}>Eliminar</Text>
      </Animated.View>

      {/* Floating bubble */}
      <Animated.View
        style={[
          styles.wrapper,
          { transform: pan.getTranslateTransform(), opacity: bubbleOpacity },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Scale wrapper — badge lives here so it's NOT clipped by the avatar's overflow:hidden */}
        <Animated.View style={[styles.scaleWrap, { transform: [{ scale: bubbleScale }] }]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{bubbleCount}</Text>
          </View>

          <TouchableOpacity
            style={styles.bubbleContainer}
            onPress={handlePress}
            activeOpacity={0.88}
          >
            <Image source={bubbleAvatar} style={styles.avatar} contentFit="cover" />
          </TouchableOpacity>
        </Animated.View>

        {/* Speech bubble preview */}
        {previewVisible && lastMessage && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.preview,
              snappedToRightRef.current ? styles.previewOnRight : styles.previewOnLeft,
              { opacity: previewOpacity },
            ]}
          >
            <Text style={styles.previewText} numberOfLines={3}>
              {lastMessage.text}
            </Text>
            <View
              style={[
                styles.arrow,
                snappedToRightRef.current ? styles.arrowRight : styles.arrowLeft,
              ]}
            />
          </Animated.View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 9999,
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    overflow: 'visible',
  },
  scaleWrap: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    overflow: 'visible',
  },
  // Avatar circle — overflow:hidden clips the image to a circle
  bubbleContainer: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  // Badge is a sibling of bubbleContainer inside scaleWrap (no overflow:hidden here)
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFF',
    zIndex: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 13,
  },
  preview: {
    position: 'absolute',
    top: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
    width: 190,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 10,
  },
  previewOnRight: { right: BUBBLE_SIZE + 12 },
  previewOnLeft: { left: BUBBLE_SIZE + 12 },
  previewText: {
    fontSize: 13,
    color: '#1a1a1a',
    lineHeight: 18,
    fontWeight: '500',
  },
  arrow: {
    position: 'absolute',
    top: 18,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  arrowRight: {
    right: -8,
    borderLeftWidth: 9,
    borderLeftColor: '#FFFFFF',
  },
  arrowLeft: {
    left: -8,
    borderRightWidth: 9,
    borderRightColor: '#FFFFFF',
  },
  deleteZoneOuter: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9998,
  },
  deleteZoneCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteZoneLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 7,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
