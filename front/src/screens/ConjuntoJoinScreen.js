import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { findConjuntoByCode, requestJoin } from '../services/conjuntoService';

const ROLE_LABELS = {
  residente: 'Residente',
  guarda: 'Guarda de Seguridad',
  administrador: 'Administrador',
};

export default function ConjuntoJoinScreen({ navigation, route }) {
  const { userData, role } = route.params;
  const [code, setCode] = useState('');
  const { colors, typography, st, fw, minTarget } = useAppTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    topSection: {
      flex: 0.25,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    roleBadge: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 5,
      marginBottom: 8,
    },
    roleBadgeText: {
      ...typography.paragraph,
      color: colors.darkmodeGreenBlack,
      fontSize: st(12),
      fontWeight: fw('600'),
    },
    headerText: {
      ...typography.title,
      color: colors.darkmodeGreenBlack,
      fontSize: st(24),
      marginBottom: 4,
    },
    subText: {
      ...typography.paragraph,
      color: colors.darkmodeGreenBlack,
      fontSize: st(13),
      opacity: 0.8,
      textAlign: 'center',
    },
    bottomSection: {
      flex: 0.75,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingHorizontal: 28,
      paddingTop: 36,
      paddingBottom: 32,
    },
    infoCard: {
      backgroundColor: colors.lightGreen,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 24,
      gap: 10,
    },
    infoText: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(12),
      flex: 1,
      lineHeight: 18,
    },
    label: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      marginBottom: 6,
      marginLeft: 15,
      fontSize: st(13),
    },
    inputContainer: {
      backgroundColor: colors.lightGreen,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 12,
      minHeight: minTarget,
      justifyContent: 'center',
      marginBottom: 24,
    },
    input: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontSize: st(22),
      letterSpacing: 6,
      textAlign: 'center',
      fontWeight: fw('700'),
    },
    primaryButton: {
      backgroundColor: colors.mainGreen,
      paddingVertical: 14,
      borderRadius: 25,
      alignItems: 'center',
      minHeight: minTarget,
      justifyContent: 'center',
    },
    primaryButtonText: {
      ...typography.subtitle,
      color: colors.darkmodeGreenBlack,
      fontWeight: fw('700'),
      fontSize: st(16),
    },
    backLink: {
      alignSelf: 'center',
      marginTop: 20,
      minHeight: minTarget,
      justifyContent: 'center',
    },
    backLinkText: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(13),
      textDecorationLine: 'underline',
    },
  }), [colors, typography, st, fw, minTarget]);

  const handleJoin = () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Ingresa el código del conjunto');
      return;
    }
    const conjunto = findConjuntoByCode(code.trim());
    if (!conjunto) {
      Alert.alert('Código incorrecto', 'No se encontró ningún conjunto con ese código. Verifica e intenta de nuevo.');
      return;
    }
    const requestId = requestJoin({ userData, role, conjuntoId: conjunto.id });
    const isInApp = route.params?.mode === 'add' || route.params?.mode === 'homeJoin';
    const targetScreen = isInApp ? 'InAppPendingApproval' : 'PendingApproval';
    navigation.navigate(targetScreen, {
      requestId,
      userData,
      role,
      conjuntoId: conjunto.id,
      conjuntoCode: conjunto.code,
      conjuntoName: conjunto.name,
      mode: route.params?.mode,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.topSection}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{ROLE_LABELS[role] || role}</Text>
          </View>
          <Text style={styles.headerText}>Unirse al Conjunto</Text>
          <Text style={styles.subText}>Ingresa el código que te dio el administrador</Text>
        </View>

        <View style={styles.bottomSection}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={20} color={colors.mainGreen} />
              <Text style={styles.infoText}>
                Una vez enviada tu solicitud, el administrador del conjunto deberá aceptarla para que puedas acceder a la aplicación.
              </Text>
            </View>

            <Text style={styles.label}>Código del Conjunto</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="XXXXXX"
                placeholderTextColor="rgba(9, 48, 48, 0.3)"
                value={code}
                onChangeText={txt => setCode(txt.toUpperCase())}
                autoCapitalize="characters"
                maxLength={8}
                autoFocus
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleJoin}>
              <Text style={styles.primaryButtonText}>Enviar Solicitud</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
              <Text style={styles.backLinkText}>← Volver</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
