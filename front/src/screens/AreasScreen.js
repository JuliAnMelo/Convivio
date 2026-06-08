import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { subscribe, getAreaImage, isAreaDisabled } from '../services/areasService';

const AREAS = [
  { name: 'Gym',               image: require('../../assets/Images/gym residencial.jpg'),           navName: 'Gym' },
  { name: 'Zona de\nParrilla', image: require('../../assets/Images/zona de parrilla conjunto.jpg'), navName: 'Zona de Parrilla' },
  { name: 'Tenis de\nMesa',   image: require('../../assets/Images/tennis de mesa.jpg'),             navName: 'Tenis de Mesa' },
  { name: 'Salón\nComunal',   image: require('../../assets/Images/salon comunal conjunto.jpg'),     navName: 'Salón Comunal' },
];

export default function AreasScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { colors, typography, st, fw, minTarget, shouldAnimate } = useAppTheme();
  const isAdmin = user?.role === 'administrador';
  const [, setTick] = useState(0);

  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;

  // Re-render when area settings change (disabled status, photos)
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

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
  }, [anim1, anim2, shouldAnimate]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen, overflow: 'hidden' },
    bgCircle1: {
      position: 'absolute', top: -60, left: -40,
      width: 220, height: 220, borderRadius: 110,
      backgroundColor: 'rgba(255,255,255,0.14)',
    },
    bgCircle2: {
      position: 'absolute', top: -20, right: -70,
      width: 280, height: 280, borderRadius: 140,
      backgroundColor: 'rgba(255,255,255,0.11)',
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
    backButton: {
      position: 'absolute', left: 10, padding: 10,
      minWidth: minTarget, minHeight: minTarget,
      justifyContent: 'center', alignItems: 'center',
    },
    backButtonText: { fontSize: st(24), color: colors.mainGreen },
    title: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontSize: st(20),
      fontWeight: fw('700'),
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      marginTop: 20,
    },
    areaWrap: {
      width: '30%',
      alignItems: 'center',
      marginHorizontal: '1.5%',
      marginBottom: 20,
    },
    areaCard: {
      width: 80, height: 80,
      borderRadius: 22,
      overflow: 'hidden',
      backgroundColor: colors.mainGreen,
    },
    areaImage: { width: '100%', height: '100%' },
    disabledOverlay: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'center', alignItems: 'center',
    },
    adminBadge: {
      position: 'absolute', top: 4, right: 4,
      width: 22, height: 22, borderRadius: 11,
      backgroundColor: colors.oceanBlueButton,
      justifyContent: 'center', alignItems: 'center',
    },
    areaText: {
      ...typography.paragraph,
      fontSize: st(12),
      fontWeight: fw('600'),
      color: colors.lettersAndIcons,
      textAlign: 'center',
      marginTop: 6,
    },
    disabledLabel: {
      ...typography.paragraph,
      fontSize: st(10),
      color: '#F04C4C',
      textAlign: 'center',
      marginTop: 2,
    },
  }), [colors, typography, st, fw, minTarget]);

  const handleAreaPress = (area) => {
    if (isAdmin) {
      navigation.navigate('AdminAreaManagement', { areaName: area.navName });
    } else {
      navigation.navigate('AreaCalendar', { areaName: area.navName });
    }
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
          { translateY: anim2.interpolate({ inputRange: [0, 1], outputRange: [-50, 50] }) },
          { scale: anim2.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1.55] }) },
          { translateX: anim2.interpolate({ inputRange: [0, 1], outputRange: [-35, 35] }) },
        ],
      }]} />

      <View style={styles.contentWrap}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Áreas Comunes</Text>
        </View>

        <View style={styles.grid}>
          {AREAS.map((area) => {
            const customUri = getAreaImage(area.navName);
            const disabled = isAreaDisabled(area.navName);
            return (
              <TouchableOpacity
                key={area.navName}
                style={styles.areaWrap}
                onPress={() => handleAreaPress(area)}
                activeOpacity={0.8}
              >
                <View style={styles.areaCard}>
                  <Image
                    source={customUri ? { uri: customUri } : area.image}
                    style={styles.areaImage}
                    contentFit="cover"
                  />
                  {disabled && (
                    <View style={styles.disabledOverlay}>
                      <Ionicons name="ban-outline" size={28} color="#FFF" />
                    </View>
                  )}
                  {isAdmin && (
                    <View style={styles.adminBadge}>
                      <Ionicons name="settings-outline" size={12} color="#FFF" />
                    </View>
                  )}
                </View>
                <Text style={styles.areaText}>{area.name}</Text>
                {disabled && <Text style={styles.disabledLabel}>No disponible</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
