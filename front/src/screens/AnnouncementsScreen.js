import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAppTheme } from '../theme';
import { useBooking } from '../context/BookingContext';
import IconVector from '../components/IconVector';
import { VideoThumbnail, DocumentThumbnail } from '../components/AttachmentThumbnails';

const CATEGORY_ORDER = ['reuniones', 'eventos', 'pagos'];
const CATEGORY_LABELS = {
  reuniones: 'Reuniones',
  eventos: 'Eventos',
  pagos: 'Pagos',
};

function normalizeCategory(value) {
  if (!value) return null;
  const normalized = String(value).toLowerCase();
  if (normalized.includes('reuni')) return 'reuniones';
  if (normalized.includes('evento')) return 'eventos';
  if (normalized.includes('pago')) return 'pagos';
  return null;
}

function resolveCategory(item) {
  const explicit = normalizeCategory(item.category);
  if (explicit) return explicit;

  const text = `${item.title || ''} ${item.subtitle || ''} ${item.tag || ''}`.toLowerCase();
  if (text.includes('reuni') || text.includes('junta') || text.includes('asamblea')) {
    return 'reuniones';
  }
  if (
    text.includes('pago')
    || text.includes('cuota')
    || text.includes('mora')
    || text.includes('factura')
  ) {
    return 'pagos';
  }
  if (
    text.includes('evento')
    || text.includes('fiesta')
    || text.includes('actividad')
    || text.includes('arriendo')
  ) {
    return 'eventos';
  }
  if (item.type === 'reservation') return 'eventos';

  return 'eventos';
}

export default function AnnouncementsScreen({ navigation }) {
  const { getAnnouncements } = useBooking();
  const announcements = getAnnouncements();
  const { colors, typography, st, fw, minTarget, shouldAnimate } = useAppTheme();
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
      top: -60,
      left: -40,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: 'rgba(255, 255, 255, 0.14)',
    },
    bgCircle2: {
      position: 'absolute',
      top: -20,
      right: -70,
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: 'rgba(255, 255, 255, 0.11)',
    },
    contentWrap: {
      flex: 1,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      marginTop: 40,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16,
    },
    back: {
      position: 'absolute',
      left: 10,
      padding: 10,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backText: { fontSize: st(24), color: colors.mainGreen },
    titleScreen: {
      ...typography.subtitle,
      fontSize: st(20),
      fontWeight: fw('800'),
      color: colors.lettersAndIcons,
    },
    list: { paddingBottom: 24 },
    section: { marginBottom: 18 },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    sectionTitle: {
      ...typography.subtitle,
      fontSize: st(16),
      fontWeight: fw('800'),
      color: colors.lettersAndIcons,
      flex: 1,
    },
    sectionBadge: {
      minWidth: 26,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      backgroundColor: colors.mainGreen,
      alignItems: 'center',
    },
    sectionBadgeText: {
      color: '#FFF',
      fontSize: st(12),
      fontWeight: fw('700'),
    },
    sectionEmpty: {
      color: colors.textSoft,
      fontSize: st(12),
      marginBottom: 6,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 18,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.lightGreen,
      marginBottom: 10,
    },
    cardMedia: {
      width: 92,
      height: 92,
      backgroundColor: colors.lightGreen,
    },
    cardImage: { width: '100%', height: '100%' },
    cardFallback: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardFallbackText: {
      color: '#FFF',
      fontSize: st(10),
      fontWeight: fw('700'),
      letterSpacing: 0.8,
      marginTop: 6,
    },
    cardBody: {
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    cardTag: {
      color: colors.oceanBlueButton,
      fontSize: st(11),
      fontWeight: fw('700'),
      marginBottom: 4,
    },
    cardTitle: {
      color: colors.darkmodeGreenBlack,
      fontSize: st(14),
      fontWeight: fw('800'),
      marginBottom: 4,
    },
    cardSubtitle: {
      color: colors.lettersAndIcons,
      fontSize: st(12),
      fontWeight: fw('400'),
    },
    cardMeta: {
      color: colors.textSoft,
      fontSize: st(10),
      fontWeight: fw('600'),
    },
    attachBadge: {
      backgroundColor: colors.mainGreen,
      borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2,
    },
    playOverlay: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      justifyContent: 'center', alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
  }), [colors, typography, st, fw, minTarget]);

  const resolveAccent = (item) => {
    if (item.icon === 'water') return colors.lightBlueButton;
    if (item.icon === 'key') return colors.oceanBlueButton;
    if (item.icon === 'teddy') return '#77B5FE';
    return colors.mainGreen;
  };

  const AttachIcon = ({ attachment }) => {
    if (!attachment) return null;
    const iconMap = { image: 'image-outline', video: 'videocam-outline', document: 'document-text-outline' };
    const icon = iconMap[attachment.type] || 'attach-outline';
    return (
      <View style={styles.attachBadge}>
        <Ionicons name={icon} size={10} color="#FFF" />
      </View>
    );
  };

  const AnnouncementCard = ({ item, sectionLabel, onPress }) => {
    const accent = resolveAccent(item);
    const dateLabel = item.time
      ? `${item.day} ${item.month} · ${item.time}`
      : `${item.day} ${item.month}`;
    const tagLabel = item.tag && item.tag.trim().length > 0 ? item.tag : sectionLabel;

    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.cardMedia}>
          {item.image ? (
            <>
              <Image source={item.image} style={styles.cardImage} contentFit="cover" />
              {item.attachment?.type === 'video' && (
                <View style={styles.playOverlay}>
                  <Ionicons name="play-circle" size={30} color="#FFF" />
                </View>
              )}
            </>
          ) : item.attachment?.type === 'video' && item.attachment?.uri ? (
            <>
              <VideoThumbnail uri={item.attachment.uri} style={styles.cardImage} />
              <View style={styles.playOverlay}>
                <Ionicons name="play-circle" size={30} color="#FFF" />
              </View>
            </>
          ) : item.attachment?.type === 'document' ? (
            <DocumentThumbnail mimeType={item.attachment?.mimeType} style={styles.cardImage} />
          ) : (
            <View style={[styles.cardFallback, { backgroundColor: accent }]}>
              <IconVector icon={item.icon} size={22} color="#FFF" />
              <Text style={styles.cardFallbackText}>ANUNCIO</Text>
            </View>
          )}
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTag} numberOfLines={1}>{tagLabel}</Text>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          {item.subtitle ? (
            <Text style={styles.cardSubtitle} numberOfLines={2}>{item.subtitle}</Text>
          ) : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 }}>
            <Text style={styles.cardMeta}>{dateLabel}</Text>
            <AttachIcon attachment={item.attachment} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const grouped = useMemo(() => {
    const map = { reuniones: [], eventos: [], pagos: [] };
    announcements.forEach((item) => {
      const category = resolveCategory(item);
      map[category] = map[category] || [];
      map[category].push(item);
    });
    return map;
  }, [announcements]);

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
          { translateY: anim2.interpolate({ inputRange: [0, 1], outputRange: [-50, 50] }) },
          { scale: anim2.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1.55] }) },
          { translateX: anim2.interpolate({ inputRange: [0, 1], outputRange: [-35, 35] }) }
        ]
      }]} />

      <View style={styles.contentWrap}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.titleScreen}>Anuncios</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {CATEGORY_ORDER.map((key) => {
            const items = grouped[key] || [];
            const sectionLabel = CATEGORY_LABELS[key];

            return (
              <View key={key} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{sectionLabel}</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>{items.length}</Text>
                  </View>
                </View>

                {items.length === 0 ? (
                  <Text style={styles.sectionEmpty}>No hay anuncios por ahora.</Text>
                ) : (
                  items.map((item) => (
                    <AnnouncementCard
                      key={item.id}
                      item={item}
                      sectionLabel={sectionLabel}
                      onPress={() => navigation.navigate('AnnouncementDetail', { item })}
                    />
                  ))
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
