import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { subscribe, getPendingRequests, getConjuntoById } from '../services/conjuntoService';
import { useNotifications } from '../context/NotificationsContext';
import { usePqr } from '../context/PqrContext';
import NotificationListCard from '../components/NotificationListCard';

const PREVIEW_COUNT = 2;

const ALL_IMAGES = {
  'home':     require('../../assets/Images/imagen home.png'),
  'salon':    require('../../assets/Images/salon comunal conjunto.jpg'),
  'gym':      require('../../assets/Images/gym residencial.jpg'),
  'parrilla': require('../../assets/Images/zona de parrilla conjunto.jpg'),
  'tennis':   require('../../assets/Images/tennis de mesa.jpg'),
};

const ACTIONS = [
  { key: 'announcements', label: 'Crear\nAnuncio',     screen: 'AdminAnnouncementCreate', svg: require('../../assets/vectors/anuncios1.svg') },
  { key: 'pqr',           label: 'Gestionar\nPQR',     screen: 'AdminPqr',                svg: require('../../assets/vectors/recepcion.svg'), dot: true },
  { key: 'members',       label: 'Miembros\nPendientes', screen: 'AdminMembers',          svg: require('../../assets/vectors/Profile.svg'), badge: true },
  { key: 'areas',         label: 'Áreas\nComunes',     screen: 'Areas',                   svg: require('../../assets/vectors/reserva.svg') },
  { key: 'manual',        label: 'Manual de\nConvivencia', screen: 'ManualConvivencia',   svg: require('../../assets/vectors/manual.svg') },
  { key: 'info',          label: 'Info del\nConjunto', screen: 'ConjuntoInfo',            svg: require('../../assets/vectors/info-conjunto.svg') },
];

export default function AdminConjuntoPanel({ navigation }) {
  const { user } = useContext(AuthContext);
  const { colors, typography, st, fw, minTarget, shouldAnimate } = useAppTheme();
  const [pendingCount, setPendingCount] = useState(0);
  const { notifications, markAsRead, isUnread } = useNotifications();
  const { hasUnansweredTickets } = usePqr();
  const preview = notifications.slice(0, PREVIEW_COUNT);
  const hasMore = notifications.length > PREVIEW_COUNT;

  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!user?.conjuntoId) return;
    const update = () => setPendingCount(getPendingRequests(user.conjuntoId).length);
    update();
    return subscribe(update);
  }, [user?.conjuntoId]);

  useEffect(() => {
    if (!shouldAnimate) { anim1.setValue(0); anim2.setValue(0); return undefined; }
    const loop1 = Animated.loop(Animated.sequence([
      Animated.timing(anim1, { toValue: 1, duration: 3500, useNativeDriver: true }),
      Animated.timing(anim1, { toValue: 0, duration: 3500, useNativeDriver: true }),
    ]));
    const loop2 = Animated.loop(Animated.sequence([
      Animated.timing(anim2, { toValue: 1, duration: 5000, useNativeDriver: true }),
      Animated.timing(anim2, { toValue: 0, duration: 5000, useNativeDriver: true }),
    ]));
    loop1.start(); loop2.start();
    return () => { loop1.stop(); loop2.stop(); };
  }, [shouldAnimate, anim1, anim2]);

  const handleNotificationPress = (item) => {
    markAsRead(item.id);
    if (item.type === 'pqr') {
      navigation.navigate('PqrDetail', { ticketId: item.ticketId });
    } else {
      navigation.navigate('AnnouncementDetail', { item });
    }
  };

  const conjunto = getConjuntoById(user?.conjuntoId);
  const conjuntoImageSrc = conjunto?.photoUri
    ? { uri: conjunto.photoUri }
    : ALL_IMAGES[conjunto?.imageKey] || ALL_IMAGES['home'];

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen, overflow: 'hidden' },
    bgCircle1: {
      position: 'absolute', top: -100, left: -50,
      width: 300, height: 300, borderRadius: 150,
      backgroundColor: 'rgba(255,255,255,0.14)',
    },
    bgCircle2: {
      position: 'absolute', top: 200, right: -100,
      width: 400, height: 400, borderRadius: 200,
      backgroundColor: 'rgba(255,255,255,0.11)',
    },
    scroll: { flex: 1 },
    backRow: { paddingHorizontal: 20, paddingTop: 12 },
    backBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      alignSelf: 'flex-start', minHeight: minTarget,
    },
    backBtnText: {
      ...typography.paragraph,
      color: 'rgba(255,255,255,0.85)', fontSize: st(13),
    },
    topSection: {
      paddingHorizontal: 22, paddingTop: 8, paddingBottom: 16,
    },
    greetingSmall: {
      color: 'rgba(255,255,255,0.75)',
      ...typography.paragraph, fontSize: st(12),
    },
    greetingName: {
      color: '#FFF', ...typography.title,
      fontSize: st(23), fontWeight: fw('700'), marginTop: 2,
    },
    codeRow: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
      marginTop: 12, gap: 10,
    },
    codeText: {
      color: '#FFF', ...typography.title,
      fontSize: st(20), letterSpacing: 4, fontWeight: fw('800'), flex: 1,
    },
    shareHint: {
      color: 'rgba(255,255,255,0.55)',
      ...typography.paragraph, fontSize: st(10),
    },

    // ── Conjunto photo card ──
    photoCard: {
      marginHorizontal: 22, marginBottom: 0,
      borderRadius: 20, overflow: 'hidden', height: 120,
    },
    photoImage: { width: '100%', height: '100%' },
    photoOverlay: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      paddingHorizontal: 14, paddingVertical: 8,
    },
    photoName: {
      color: '#FFF', ...typography.paragraph,
      fontSize: st(13), fontWeight: fw('700'),
    },

    // ── White bottom panel ──
    bottomSection: {
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 35, borderTopRightRadius: 35,
      paddingTop: 28, paddingHorizontal: 16, paddingBottom: 100,
      marginTop: 16,
    },
    sectionTitle: {
      color: colors.lettersAndIcons,
      ...typography.subtitle, fontSize: st(17), fontWeight: fw('700'),
      marginBottom: 16, paddingHorizontal: 4,
    },

    // ── Category-style grid (same as CategoriesScreen) ──
    grid: {
      flexDirection: 'row', flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },
    catWrap: {
      width: '33.3%', alignItems: 'center', marginBottom: 24,
    },
    catButton: {
      width: 75, height: 75, borderRadius: 22,
      alignItems: 'center', justifyContent: 'center', marginBottom: 8,
      backgroundColor: colors.lightBlueButton,
    },
    catButtonActive: { backgroundColor: colors.oceanBlueButton },
    catText: {
      ...typography.paragraph, fontWeight: fw('600'),
      fontSize: st(12), color: colors.lettersAndIcons, textAlign: 'center',
    },
    notifBadge: {
      position: 'absolute', top: 5, right: 5,
      width: 14, height: 14, borderRadius: 7,
      backgroundColor: colors.errorRed,
      borderWidth: 2, borderColor: colors.backgroundGreenWhite,
    },
    notifCount: {
      position: 'absolute', top: -4, right: -4,
      minWidth: 20, height: 20, borderRadius: 10,
      backgroundColor: colors.errorRed,
      justifyContent: 'center', alignItems: 'center',
      paddingHorizontal: 4,
      borderWidth: 2, borderColor: colors.backgroundGreenWhite,
    },
    notifCountText: {
      color: '#FFF', fontSize: st(10), fontWeight: fw('800'),
    },

    // Announcements section
    announcementsSection: {
      marginTop: 24,
    },
    announcementsSectionHeader: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 12, paddingHorizontal: 4,
    },
    announcementsSectionTitle: {
      color: colors.lettersAndIcons,
      ...typography.subtitle, fontSize: st(17), fontWeight: fw('700'),
    },
    seeAllBtn: {
      paddingVertical: 4, paddingHorizontal: 8,
    },
    seeAllText: {
      color: colors.mainGreen,
      ...typography.paragraph, fontSize: st(12), fontWeight: fw('600'),
    },
    emptyAnn: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(13), opacity: 0.5, textAlign: 'center', marginVertical: 16,
    },
  }), [colors, typography, st, fw, minTarget]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bgCircle1, {
        transform: [
          { translateX: anim1.interpolate({ inputRange: [0, 1], outputRange: [-70, 100] }) },
          { scale: anim1.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.7] }) },
        ],
      }]} />
      <Animated.View style={[styles.bgCircle2, {
        transform: [
          { translateY: anim2.interpolate({ inputRange: [0, 1], outputRange: [-80, 80] }) },
          { scale: anim2.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1.55] }) },
          { translateX: anim2.interpolate({ inputRange: [0, 1], outputRange: [-35, 35] }) },
        ],
      }]} />

      <SafeAreaView>
        <View style={styles.backRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Inicio')}>
            <Ionicons name="arrow-back" size={18} color="rgba(255,255,255,0.85)" />
            <Text style={styles.backBtnText}>Mis Conjuntos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header */}
        <View style={styles.topSection}>
          <Text style={styles.greetingSmall}>Panel de Control</Text>
          <Text style={styles.greetingName}>{user?.conjuntoName || 'Conjunto'}</Text>
          <View style={styles.codeRow}>
            <Ionicons name="key-outline" size={18} color="rgba(255,255,255,0.6)" />
            <Text style={styles.codeText}>{user?.conjuntoCode || '------'}</Text>
            <Text style={styles.shareHint}>Código{'\n'}del conjunto</Text>
          </View>
        </View>

        {/* Conjunto photo — same style as resident HomeScreen */}
        <TouchableOpacity
          style={styles.photoCard}
          onPress={() => navigation.navigate('ConjuntoInfo')}
          activeOpacity={0.88}
        >
          <Image source={conjuntoImageSrc} style={styles.photoImage} contentFit="cover" />
          <View style={styles.photoOverlay}>
            <Text style={styles.photoName}>{user?.conjuntoName || 'Mi Conjunto'}</Text>
          </View>
        </TouchableOpacity>

        {/* White section with category buttons */}
        <View style={styles.bottomSection}>
          <Text style={styles.sectionTitle}>Administración</Text>

          <View style={styles.grid}>
            {ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={styles.catWrap}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.8}
              >
                <View style={{ position: 'relative' }}>
                  <View style={styles.catButton}>
                    {action.svg ? (
                      <Image
                        source={action.svg}
                        style={{ width: 36, height: 36, tintColor: '#FFF' }}
                        contentFit="contain"
                      />
                    ) : (
                      <Ionicons name={action.icon} size={34} color="#FFF" />
                    )}
                  </View>
                  {action.badge && pendingCount > 0 && (
                    <View style={styles.notifCount}>
                      <Text style={styles.notifCountText}>{pendingCount}</Text>
                    </View>
                  )}
                  {action.dot && hasUnansweredTickets() && (
                    <View style={styles.notifBadge} />
                  )}
                </View>
                <Text style={styles.catText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Announcements preview — same style as resident HomeScreen */}
          <View style={styles.announcementsSection}>
            <View style={styles.announcementsSectionHeader}>
              <Text style={styles.announcementsSectionTitle}>Últimos Anuncios</Text>
              {hasMore && (
                <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('Announcements')}>
                  <Text style={styles.seeAllText}>Ver todos</Text>
                </TouchableOpacity>
              )}
            </View>

            {preview.length === 0 ? (
              <Text style={styles.emptyAnn}>No hay anuncios aún. Crea uno con el botón de arriba.</Text>
            ) : (
              preview.map((item) => (
                <NotificationListCard
                  key={item.id}
                  item={item}
                  unread={isUnread(item)}
                  variant="home"
                  onPress={() => handleNotificationPress(item)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
