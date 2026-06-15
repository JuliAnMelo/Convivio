import React, { useEffect, useMemo, useRef, useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { checkRequestStatusRemote, getConjuntoById } from '../services/conjuntoService';
import { AuthContext } from '../context/AuthContext';

export default function PendingApprovalScreen({ navigation, route }) {
  const { requestId, userData, role, conjuntoId, conjuntoCode, conjuntoName, mode } = route.params;
  const isAddMode = mode === 'add';
  const isHomeJoin = mode === 'homeJoin';
  const { register, addConjunto, updateUser } = useContext(AuthContext);

  const { colors, typography, st, fw, shouldAnimate } = useAppTheme();
  const [status, setStatus] = useState('pending');

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!shouldAnimate) return undefined;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [shouldAnimate, pulseAnim]);

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      const data = await checkRequestStatusRemote(requestId);
      if (isMounted && data) {
        setStatus(data.status);
      }
    };
    fetchStatus();
    const intervalId = setInterval(fetchStatus, 3000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [requestId]);

  useEffect(() => {
    if (status !== 'approved') return;
    const conjunto = getConjuntoById(conjuntoId);
    const resolvedCode = conjunto?.code || conjuntoCode;
    const resolvedName = conjunto?.name || conjuntoName;

    const aptValue = userData.apt || '';

    if (isAddMode) {
      addConjunto({ conjuntoId, conjuntoCode: resolvedCode, conjuntoName: resolvedName });
      updateUser({ apt: aptValue });
      navigation.navigate('Inicio');
    } else if (isHomeJoin) {
      updateUser({ conjuntoId, conjuntoIds: [conjuntoId], conjuntoCode: resolvedCode, conjuntoName: resolvedName, apt: aptValue });
      navigation.navigate('Inicio');
    } else {
      register({
        ...userData,
        role,
        conjuntoId,
        conjuntoIds: [conjuntoId],
        conjuntoCode: resolvedCode,
        conjuntoName: resolvedName,
        apt: aptValue,
      });
    }
  }, [status]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    iconWrapper: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 28,
    },
    title: {
      ...typography.title,
      color: '#FFF',
      fontSize: st(22),
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      ...typography.paragraph,
      color: 'rgba(255,255,255,0.85)',
      fontSize: st(14),
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 32,
    },
    codeContainer: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 32,
      alignItems: 'center',
      marginBottom: 12,
    },
    codeLabel: {
      ...typography.paragraph,
      color: 'rgba(255,255,255,0.7)',
      fontSize: st(11),
      marginBottom: 4,
    },
    codeText: {
      ...typography.title,
      color: '#FFF',
      fontSize: st(26),
      letterSpacing: 5,
      fontWeight: fw('800'),
    },
    conjuntoName: {
      ...typography.paragraph,
      color: 'rgba(255,255,255,0.7)',
      fontSize: st(12),
      textAlign: 'center',
      marginBottom: 32,
    },
    rejectedCard: {
      backgroundColor: 'rgba(240,76,76,0.2)',
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      marginBottom: 24,
    },
    rejectedText: {
      ...typography.paragraph,
      color: '#FFF',
      fontSize: st(14),
      textAlign: 'center',
      lineHeight: 20,
    },
    backButton: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 32,
      marginTop: 8,
    },
    backButtonText: {
      ...typography.subtitle,
      color: '#FFF',
      fontWeight: fw('700'),
      fontSize: st(15),
    },
  }), [colors, typography, st, fw]);

  if (status === 'rejected') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <Ionicons name="close-circle-outline" size={54} color="#F04C4C" />
          </View>
          <Text style={styles.title}>Solicitud Rechazada</Text>
          <View style={styles.rejectedCard}>
            <Text style={styles.rejectedText}>
              El administrador del conjunto no aceptó tu solicitud. Contacta al administrador para más información.
            </Text>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons name="time-outline" size={54} color="#FFF" />
        </Animated.View>

        <Text style={styles.title}>Esperando Aprobación</Text>
        <Text style={styles.subtitle}>
          Tu solicitud fue enviada al administrador del conjunto. Recibirás acceso una vez que sea aceptada.
        </Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Código del Conjunto</Text>
          <Text style={styles.codeText}>{conjuntoCode}</Text>
        </View>
        <Text style={styles.conjuntoName}>{conjuntoName}</Text>
      </View>
    </SafeAreaView>
  );
}
