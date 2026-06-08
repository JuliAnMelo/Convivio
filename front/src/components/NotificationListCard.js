import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import IconVector from './IconVector';
import { VideoThumbnail, DocumentThumbnail } from './AttachmentThumbnails';

function NotificationThumbnail({ item, style }) {
  const { attachment } = item;
  let preview = null;
  if (item.image) {
    preview = <Image source={item.image} style={thumbStyles.fill} contentFit="cover" />;
  } else if (attachment?.type === 'video' && attachment?.uri) {
    preview = <VideoThumbnail uri={attachment.uri} style={thumbStyles.fill} />;
  } else if (attachment?.type === 'image' && attachment?.uri) {
    preview = <Image source={{ uri: attachment.uri }} style={thumbStyles.fill} contentFit="cover" />;
  } else if (attachment?.type === 'document') {
    preview = <DocumentThumbnail mimeType={attachment?.mimeType} style={thumbStyles.fill} />;
  }
  if (!preview) return null;
  return (
    <View style={[style, thumbStyles.wrap]}>
      {preview}
      {attachment?.type === 'video' ? (
        <View style={thumbStyles.playOverlay}>
          <Ionicons name="play-circle" size={20} color="#FFF" />
        </View>
      ) : null}
    </View>
  );
}

const thumbStyles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
  fill: { width: '100%', height: '100%' },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

function NotificationIcon({ icon, vectorStyle }) {
  if (icon === 'water') {
    return (
      <Image
        source={require('../../assets/vectors/Vector.svg')}
        style={vectorStyle}
        contentFit="contain"
      />
    );
  }
  if (icon === 'teddy') {
    return (
      <Image
        source={require('../../assets/vectors/teddybear.svg')}
        style={vectorStyle}
        contentFit="contain"
      />
    );
  }
  // Custom vector/emoji chosen by the admin when creating the announcement
  return <IconVector icon={icon} size={22} color="#FFF" />;
}

export default function NotificationListCard({ item, unread, onPress, variant = 'home' }) {
  const { colors, typography, st, fw, shouldAnimate } = useAppTheme();
  const isPqr = item.type === 'pqr';
  const isWaiting = item.pqrStatus === 'esperando';
  const hasThumbnail = !!(
    item.image
    || (item.attachment?.type === 'video' && item.attachment?.uri)
    || (item.attachment?.type === 'image' && item.attachment?.uri)
    || item.attachment?.type === 'document'
  );
  const styles = useMemo(() => StyleSheet.create({
    cardHome: {
      backgroundColor: colors.backgroundGreenWhite,
      padding: 10,
      borderRadius: 20,
      marginBottom: 8,
      position: 'relative',
      overflow: 'hidden',
    },
    cardList: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.lightGreen,
      position: 'relative',
      overflow: 'hidden',
    },
    cardUnread: {},
    inlineDateBadge: {
      fontSize: st(10),
      fontWeight: fw('600'),
      color: colors.textSoft,
      marginTop: 4,
    },
    unreadDot: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.mainGreen,
    },
    unreadDotWithImage: {
      top: 6,
      right: 6,
    },
    cardRow: { flexDirection: 'row', alignItems: 'center' },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    vectorIcon: { width: 24, height: 24, tintColor: '#FFF' },
    textWrap: { flex: 1 },
    thumbnail: {
      width: 52,
      height: 52,
      borderRadius: 10,
      marginLeft: 8,
    },
    title: {
      color: colors.darkmodeGreenBlack,
      ...typography.subtitle,
      fontWeight: fw('800'),
      fontSize: st(13),
      marginVertical: 1,
    },
    subtitle: {
      color: colors.lettersAndIcons,
      ...typography.paragraph,
      fontSize: st(11),
      fontWeight: fw('400'),
    },
    subtitleWaiting: { color: '#C87D0A' },
    subtitleDone: { color: colors.mainGreen },
  }), [colors, typography, st, fw]);

  const cardStyle = variant === 'home' ? styles.cardHome : styles.cardList;

  // Calculamos la antigüedad de la notificación en días
  let ageInDays = 0;
  if (item.createdAt) {
    ageInDays = (new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24);
  } else if (item.month && item.day) {
    const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthIndex = MONTH_NAMES.indexOf(item.month);
    const yr = new Date().getFullYear();
    const d = new Date(yr, monthIndex >= 0 ? monthIndex : 0, item.day, 12, 0, 0);
    ageInDays = (new Date() - d) / (1000 * 60 * 60 * 24);
  }

  // Determinamos el color del ícono según el estado y antigüedad del PQR
  let iconBg = '#FFA07A';
  if (isPqr) {
    if (ageInDays > 15) {
      iconBg = colors.errorRed || '#F04C4C'; // Roja si tiene más de 15 días
    } else if (isWaiting) {
      iconBg = '#C87D0A'; // Amarillo/Naranja si está esperando
    } else {
      iconBg = colors.mainGreen; // Verde si ya se completó o está en revisión
    }
  } else if (item.icon === 'water') {
    iconBg = colors.lightBlueButton;
  } else if (item.icon === 'key') {
    iconBg = colors.oceanBlueButton;
  }

  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!shouldAnimate) {
      pulseAnim.setValue(0);
      return;
    }
    if (unread && variant === 'home') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: false,
          })
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [unread, variant, pulseAnim, shouldAnimate]);

  const animatedStyles = (unread && variant === 'home') ? {
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.9] }),
    shadowRadius: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [4, 14] }),
    elevation: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [4, 14] }),
  } : {};

  return (
    <Animated.View style={animatedStyles}>
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={onPress ? 0.9 : 1}
        disabled={!onPress}
      >
        <View style={styles.cardRow}>
          <View style={[styles.iconWrap, { backgroundColor: iconBg }]}> 
            <NotificationIcon icon={item.icon} vectorStyle={styles.vectorIcon} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.title} numberOfLines={1}>
              {isPqr ? `*PQR* ${item.title}` : item.title}
            </Text>
            {item.subtitle ? (
              <Text
                numberOfLines={1}
                style={[
                  styles.subtitle,
                  isPqr && isWaiting && styles.subtitleWaiting,
                  isPqr && !isWaiting && styles.subtitleDone,
                ]}
              >
                {item.subtitle}
              </Text>
            ) : null}
            <Text style={styles.inlineDateBadge}>
              {item.day} {item.month}
            </Text>
          </View>
          {hasThumbnail ? (
            <NotificationThumbnail item={item} style={styles.thumbnail} />
          ) : null}
        </View>
        {unread ? <View style={[styles.unreadDot, hasThumbnail && styles.unreadDotWithImage]} /> : null}
      </TouchableOpacity>
    </Animated.View>
  );
}
