import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { getConjuntosByIds, subscribe, getNotificationCount } from '../services/conjuntoService';

const ALL_IMAGES = {
  'home':     require('../../assets/Images/imagen home.png'),
  'salon':    require('../../assets/Images/salon comunal conjunto.jpg'),
  'gym':      require('../../assets/Images/gym residencial.jpg'),
  'parrilla': require('../../assets/Images/zona de parrilla conjunto.jpg'),
  'tennis':   require('../../assets/Images/tennis de mesa.jpg'),
};

function ConjuntoCard({ conjunto, notifCount, onPress }) {
  const { colors, typography, st, fw } = useAppTheme();

  const cardStyles = useMemo(() => StyleSheet.create({
    card: {
      width: '100%',
      height: 180,
      borderRadius: 24,
      overflow: 'hidden',
      marginBottom: 16,
    },
    image: { width: '100%', height: '100%' },
    overlay: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: '60%',
      backgroundColor: 'transparent',
      backgroundImage: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
      paddingHorizontal: 16,
      paddingBottom: 14,
      justifyContent: 'flex-end',
    },
    overlayInner: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      paddingHorizontal: 16,
      paddingBottom: 14,
    },
    conjuntoName: {
      color: '#FFF',
      ...typography.subtitle,
      fontSize: st(17),
      fontWeight: fw('800'),
    },
    conjuntoCode: {
      color: 'rgba(255,255,255,0.75)',
      ...typography.paragraph,
      fontSize: st(11),
      letterSpacing: 2,
      marginTop: 2,
    },
    badge: {
      position: 'absolute',
      top: 10,
      right: 10,
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.errorRed,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
      borderWidth: 2,
      borderColor: colors.card,
    },
    badgeText: {
      color: '#FFF',
      fontSize: st(10),
      fontWeight: fw('800'),
    },
    darkOverlay: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      top: 0,
      backgroundColor: 'rgba(0,0,0,0.22)',
    },
    gradientOverlay: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: 100,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
  }), [colors, typography, st, fw]);

  const imgSource = conjunto.photoUri
    ? { uri: conjunto.photoUri }
    : ALL_IMAGES[conjunto.imageKey] || ALL_IMAGES['home'];

  return (
    <TouchableOpacity style={cardStyles.card} onPress={onPress} activeOpacity={0.88}>
      <Image source={imgSource} style={cardStyles.image} contentFit="cover" />
      <View style={cardStyles.darkOverlay} />
      <View style={cardStyles.gradientOverlay} />
      <View style={cardStyles.overlayInner}>
        <Text style={cardStyles.conjuntoName} numberOfLines={1}>{conjunto.name}</Text>
        <Text style={cardStyles.conjuntoCode}>{conjunto.code}</Text>
      </View>
      {notifCount > 0 && (
        <View style={cardStyles.badge}>
          <Text style={cardStyles.badgeText}>{notifCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function AdminHomeScreen({ navigation }) {
  const { user, selectConjunto } = useContext(AuthContext);
  const { colors, typography, st, fw, minTarget, shouldAnimate } = useAppTheme();
  const [, setTick] = useState(0); // re-render on conjuntoService changes

  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return subscribe(() => setTick(t => t + 1));
  }, []);

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

  const conjuntos = getConjuntosByIds(user?.conjuntoIds || []);

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
    topSection: {
      paddingHorizontal: 22,
      paddingTop: 44,
      paddingBottom: 6,
    },
    greetingSmall: {
      color: 'rgba(255,255,255,0.8)',
      ...typography.paragraph,
      fontSize: st(13),
    },
    greetingName: {
      color: '#FFF',
      ...typography.title,
      fontSize: st(25),
      fontWeight: fw('700'),
      marginTop: 2,
      marginBottom: 2,
    },
    roleBadge: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignSelf: 'flex-start',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginBottom: 4,
    },
    roleBadgeText: {
      color: '#FFF',
      ...typography.paragraph,
      fontSize: st(12),
      fontWeight: fw('600'),
    },
    bottomSection: {
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 100,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      color: colors.lettersAndIcons,
      ...typography.subtitle,
      fontSize: st(18),
      fontWeight: fw('700'),
    },
    countText: {
      color: colors.lettersAndIcons,
      ...typography.paragraph,
      fontSize: st(12),
      opacity: 0.5,
    },
    emptyCard: {
      backgroundColor: colors.lightGreen,
      borderRadius: 20,
      padding: 32,
      alignItems: 'center',
    },
    emptyText: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(13),
      textAlign: 'center',
      marginTop: 12,
      opacity: 0.7,
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 80,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.mainGreen,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
  }), [colors, typography, st, fw, minTarget]);

  const handleSelectConjunto = (conjunto) => {
    selectConjunto({
      conjuntoId: conjunto.id,
      conjuntoCode: conjunto.code,
      conjuntoName: conjunto.name,
    });
    navigation.navigate('AdminConjuntoPanel');
  };

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

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} bounces={false}>
        <SafeAreaView>
          <View style={styles.topSection}>
            <Text style={styles.greetingSmall}>Bienvenido</Text>
            <Text style={styles.greetingName}>{user?.name || 'Administrador'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>Administrador</Text>
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.bottomSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Conjuntos</Text>
            <Text style={styles.countText}>{conjuntos.length} conjunto{conjuntos.length !== 1 ? 's' : ''}</Text>
          </View>

          {conjuntos.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="business-outline" size={36} color={colors.mainGreen} />
              <Text style={styles.emptyText}>
                Aún no tienes conjuntos.{'\n'}Toca el botón + para agregar uno.
              </Text>
            </View>
          ) : (
            conjuntos.map((c) => (
              <ConjuntoCard
                key={c.id}
                conjunto={c}
                notifCount={getNotificationCount(c.id)}
                onPress={() => handleSelectConjunto(c)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB: add a new conjunto */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('InAppConjuntoSetup', { mode: 'add' })}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.darkmodeGreenBlack} />
      </TouchableOpacity>
    </View>
  );
}
