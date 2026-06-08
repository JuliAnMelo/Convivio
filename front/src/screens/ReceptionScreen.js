import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAppTheme } from '../theme';

const RECEPTION_PHONE = 'tel:+573000000000';
const GUARD_AVATAR = require('../../assets/Images/guardia.webp');

export default function ReceptionScreen({ navigation }) {
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
    card: {
      backgroundColor: colors.card,
      borderRadius: 22,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.lightGreen,
      marginBottom: 16,
    },
    cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    cardText: { flex: 1 },
    cardTitle: {
      color: colors.darkmodeGreenBlack,
      fontSize: st(15),
      fontWeight: fw('800'),
    },
    cardSub: {
      color: colors.lettersAndIcons,
      fontSize: st(12),
      marginTop: 4,
    },
    primaryButton: {
      backgroundColor: colors.oceanBlueButton,
      paddingVertical: 10,
      borderRadius: 14,
      alignItems: 'center',
      minHeight: minTarget,
      justifyContent: 'center',
    },
    primaryButtonText: {
      color: '#FFF',
      fontWeight: fw('700'),
      fontSize: st(13),
    },
    chatHint: {
      backgroundColor: colors.card,
      borderRadius: 22,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.lightGreen,
    },
    chatRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    chatAvatarWrap: {
      width: 54,
      height: 54,
      borderRadius: 18,
      overflow: 'hidden',
      marginRight: 12,
      backgroundColor: colors.lightGreen,
    },
    chatAvatar: { width: '100%', height: '100%' },
    chatTextWrap: { flex: 1 },
    chatTitle: {
      color: colors.darkmodeGreenBlack,
      fontSize: st(14),
      fontWeight: fw('800'),
    },
    chatSub: {
      color: colors.lettersAndIcons,
      fontSize: st(12),
      marginTop: 4,
    },
    chatCtaIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.mainGreen,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    chatCtaRow: {
      marginTop: 10,
      paddingVertical: 8,
      backgroundColor: colors.mainGreen,
      borderRadius: 12,
      alignItems: 'center',
    },
    chatCtaText: {
      color: colors.darkmodeGreenBlack,
      fontSize: st(13),
      fontWeight: fw('700'),
    },
  }), [colors, typography, st, fw, minTarget]);

  const handleCall = async () => {
    try {
      const supported = await Linking.canOpenURL(RECEPTION_PHONE);
      if (!supported) {
        Alert.alert('Llamada no disponible', 'Tu dispositivo no puede realizar llamadas.');
        return;
      }
      await Linking.openURL(RECEPTION_PHONE);
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar la llamada.');
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
          <Text style={styles.titleScreen}>Recepción</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={[styles.iconWrap, { backgroundColor: colors.oceanBlueButton }]}> 
              <Ionicons name="call" size={22} color="#FFF" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Llamar a recepción</Text>
              <Text style={styles.cardSub}>Atención directa del portero</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCall}>
            <Text style={styles.primaryButtonText}>Llamar ahora</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.chatHint}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ReceptionChat')}
        >
          <View style={styles.chatRow}>
            <View style={styles.chatAvatarWrap}>
              <Image source={GUARD_AVATAR} style={styles.chatAvatar} contentFit="cover" />
            </View>
            <View style={styles.chatTextWrap}>
              <Text style={styles.chatTitle}>Habla con un celador</Text>
              <Text style={styles.chatSub} numberOfLines={2}>
                Estamos disponibles para ayudarte en tiempo real.
              </Text>
            </View>
            <View style={styles.chatCtaIcon}>
              <Ionicons name="chatbubble-ellipses" size={16} color="#FFF" />
            </View>
          </View>
          <View style={styles.chatCtaRow}>
            <Text style={styles.chatCtaText}>Iniciar chat en vivo</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
