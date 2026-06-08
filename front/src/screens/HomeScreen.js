import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useNotifications } from '../context/NotificationsContext';
import { AuthContext } from '../context/AuthContext';
import NotificationListCard from '../components/NotificationListCard';
import { useReceptionChat } from '../context/ReceptionChatContext';

const PREVIEW_COUNT = 2;

const STROKE_NORMAL = 'rgba(0, 155, 115, 0.9)';
const STROKE_GUARD  = 'rgba(27, 58, 92, 0.9)';
const SW = 2;
const SHADOW_DIRS = [
  { width: -SW, height: -SW }, { width: SW, height: -SW },
  { width: -SW, height: SW },  { width: SW, height: SW },
  { width: 0,   height: -SW }, { width: 0,  height: SW },
  { width: -SW, height: 0   }, { width: SW, height: 0  },
];

function StrokeText({ children, style, stroke = STROKE_NORMAL }) {
  return (
    <View style={{ alignSelf: 'center' }}>
      {SHADOW_DIRS.map((shadow, i) => (
        <Text key={i} style={[style, {
          position: 'absolute', top: 0, left: 0,
          textShadowColor: stroke,
          textShadowOffset: shadow,
          textShadowRadius: 1,
        }]}>
          {children}
        </Text>
      ))}
      <Text style={style}>{children}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { notifications, markAsRead, isUnread } = useNotifications();
  const { user } = useContext(AuthContext);
  const { triggerWelcomeMessage } = useReceptionChat();
  const { colors, typography, st, fw, minTarget, shouldAnimate } = useAppTheme();
  const greetingStroke = user?.role === 'guarda' ? STROKE_GUARD : STROKE_NORMAL;
  const preview = notifications.slice(0, PREVIEW_COUNT);
  const hasMore = notifications.length > PREVIEW_COUNT;

  useEffect(() => {
    // Don't simulate incoming chat messages until the user actually belongs to a conjunto
    if (user?.conjuntoId) triggerWelcomeMessage(user?.role);
  }, [user?.conjuntoId]);

  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!shouldAnimate) {
      anim1.setValue(0);
      anim2.setValue(0);
      return undefined;
    }
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(anim1, { toValue: 1, duration: 3500, useNativeDriver: true }),
        Animated.timing(anim1, { toValue: 0, duration: 3500, useNativeDriver: true })
      ])
    );
    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(anim2, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(anim2, { toValue: 0, duration: 5000, useNativeDriver: true })
      ])
    );
    loop1.start();
    loop2.start();
    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [anim1, anim2, shouldAnimate]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen, overflow: 'hidden' },
    bgCircle1: {
      position: 'absolute',
      top: -100,
      left: -50,
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: 'rgba(255, 255, 255, 0.14)',
    },
    bgCircle2: {
      position: 'absolute',
      top: 200,
      right: -100,
      width: 400,
      height: 400,
      borderRadius: 200,
      backgroundColor: 'rgba(255, 255, 255, 0.11)',
    },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 140 },
    greeting: { alignItems: 'center', marginTop: 0, marginBottom: 4 },
    greetingText: {
      color: '#FFF',
      ...typography.title,
      fontSize: st(25),
      letterSpacing: 0.3,
    },
    cardImage: {
      width: '100%',
      height: 110,
      marginVertical: 10,
      borderRadius: 20,
      overflow: 'hidden',
    },
    image: { width: '100%', height: '100%' },
    sectionTitle: {
      color: colors.backgroundGreenWhite,
      ...typography.subtitle,
      fontSize: st(20),
      fontWeight: fw('800'),
      marginBottom: 7,
      marginTop: 30,
    },
    previewList: { marginBottom: 2 },
    seeAllButton: {
      alignSelf: 'center',
      paddingVertical: 5,
      paddingHorizontal: 12,
      marginBottom: 5,
      minHeight: minTarget,
      justifyContent: 'center',
    },
    seeAllText: {
      color: colors.backgroundGreenWhite,
      fontSize: st(13),
      fontWeight: fw('700'),
      textDecorationLine: 'underline',
    },
    fixedFooter: {
      position: 'absolute',
      bottom: 70,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    categoriesButton: {
      backgroundColor: colors.oceanBlueButton,
      paddingVertical: 12,
      borderRadius: 30,
      alignItems: 'center',
      width: '60%',
      minHeight: minTarget,
      justifyContent: 'center',
    },
    categoriesButtonText: {
      color: colors.backgroundGreenWhite,
      ...typography.subtitle,
      fontWeight: fw('700'),
    },
    joinBannerLarge: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 24,
      padding: 28,
      alignItems: 'center',
      gap: 12,
      marginTop: 20,
    },
    joinBannerLargeTitle: {
      color: '#FFF',
      ...typography.subtitle,
      fontSize: st(16),
      fontWeight: fw('700'),
      textAlign: 'center',
    },
    joinBannerLargeSub: {
      color: 'rgba(255,255,255,0.7)',
      ...typography.paragraph,
      fontSize: st(13),
      textAlign: 'center',
      lineHeight: 20,
    },
  }), [colors, typography, st, fw, minTarget]);

  const handleJoinConjunto = () => {
    navigation.navigate('InAppConjuntoJoin', {
      mode: 'homeJoin',
      userData: { name: user?.name, email: user?.email, phone: user?.phone, dob: user?.dob },
      role: user?.role,
    });
  };

  const handleNotificationPress = (item) => {
    markAsRead(item.id);
    if (item.type === 'pqr') {
      navigation.navigate('PqrDetail', { ticketId: item.ticketId });
    } else {
      navigation.navigate('AnnouncementDetail', { item });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bgCircle1, {
        transform: [
           { translateX: anim1.interpolate({ inputRange: [0, 1], outputRange: [-70, 100] }) },
           { scale: anim1.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.7] }) }
        ]
      }]} />
      <Animated.View style={[styles.bgCircle2, {
        transform: [
           { translateY: anim2.interpolate({ inputRange: [0, 1], outputRange: [-80, 80] }) },
           { scale: anim2.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1.55] }) },
           { translateX: anim2.interpolate({ inputRange: [0, 1], outputRange: [-35, 35] }) }
        ]
      }]} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.greeting}>
          <StrokeText style={styles.greetingText} stroke={greetingStroke}>{'Hola ' + (user?.name || 'Usuario')}</StrokeText>
          <StrokeText style={styles.greetingText} stroke={greetingStroke}>
            {user?.role === 'guarda' ? 'Guarda de Seguridad' : 'Residente'}
          </StrokeText>
          <StrokeText style={styles.greetingText} stroke={greetingStroke}>{'Apartamento ' + (user?.apt || 'No Asignado')}</StrokeText>
        </View>

        {user?.conjuntoId ? (
          <>
            <TouchableOpacity
              style={styles.cardImage}
              onPress={() => navigation.navigate('ConjuntoInfo')}
              activeOpacity={0.88}
            >
              <Image
                source={require('../../assets/Images/imagen home.png')}
                style={styles.image}
                contentFit="cover"
              />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Ultimos Anuncios:</Text>

            <View style={styles.previewList}>
              {preview.map((item) => (
                <NotificationListCard
                  key={item.id}
                  item={item}
                  unread={isUnread(item)}
                  variant="home"
                  onPress={() => handleNotificationPress(item)}
                />
              ))}
            </View>

            {(hasMore || notifications.length > 0) && (
              <TouchableOpacity
                style={styles.seeAllButton}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Text style={styles.seeAllText}>Ver todas las notificaciones</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <TouchableOpacity style={styles.joinBannerLarge} onPress={handleJoinConjunto} activeOpacity={0.8}>
            <Ionicons name="business-outline" size={40} color="rgba(255,255,255,0.7)" />
            <Text style={styles.joinBannerLargeTitle}>Aún no perteneces a ningún conjunto</Text>
            <Text style={styles.joinBannerLargeSub}>
              Toca aquí para ingresar el código de tu conjunto y ver los anuncios, reservar áreas y más.
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.fixedFooter}>
        <TouchableOpacity
          style={styles.categoriesButton}
          onPress={() => navigation.navigate('Categories')}
        >
          <Text style={styles.categoriesButtonText}>Categorias</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
