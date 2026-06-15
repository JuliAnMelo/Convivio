import React, { useContext, useMemo, useRef, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { getConjuntoById, setRequestApt } from '../services/conjuntoService';

export default function ApartmentNumberScreen({ navigation, route }) {
  const {
    requestId, userData, role, conjuntoId, conjuntoCode, conjuntoName, mode,
  } = route.params;
  const isAddMode = mode === 'add';
  const isHomeJoin = mode === 'homeJoin';

  const { register, addConjunto, updateUser } = useContext(AuthContext);
  const { colors, typography, st, fw, minTarget } = useAppTheme();
  const [apt, setApt] = useState('');
  const [saving, setSaving] = useState(false);
  const isFocused = useIsFocused();
  const inputRef = useRef(null);

  React.useEffect(() => {
    if (!isFocused) return;
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, [isFocused]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    topSection: {
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    iconWrapper: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerText: {
      ...typography.title,
      color: colors.darkmodeGreenBlack,
      fontSize: st(24),
      marginBottom: 4,
      textAlign: 'center',
    },
    subText: {
      ...typography.paragraph,
      color: colors.darkmodeGreenBlack,
      fontSize: st(13),
      opacity: 0.85,
      textAlign: 'center',
    },
    bottomSection: {
      flex: 0.7,
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
      letterSpacing: 4,
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
  }), [colors, typography, st, fw, minTarget]);

  const handleContinue = async () => {
    if (!apt.trim()) {
      Alert.alert('Error', 'Ingresa tu número de apartamento');
      return;
    }
    const aptValue = apt.trim();
    setSaving(true);
    try {
      // Persist the apartment on the join request so the admin can see it.
      try {
        await setRequestApt(requestId, aptValue);
      } catch (e) {
        // non-blocking: the user can still enter the app with their apt set locally
      }

      const conjunto = getConjuntoById(conjuntoId);
      const resolvedCode = conjunto?.code || conjuntoCode;
      const resolvedName = conjunto?.name || conjuntoName;

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
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.topSection}>
          <View style={styles.iconWrapper}>
            <Ionicons name="home-outline" size={42} color="#FFF" />
          </View>
          <Text style={styles.headerText}>¡Solicitud Aprobada!</Text>
          <Text style={styles.subText}>Ya eres parte de {conjuntoName}. Solo falta un dato.</Text>
        </View>

        <View style={styles.bottomSection}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={20} color={colors.mainGreen} />
              <Text style={styles.infoText}>
                Indícanos tu número de apartamento dentro del conjunto para completar tu perfil.
              </Text>
            </View>

            <Text style={styles.label}>Número de Apartamento</Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Ej. 302"
                placeholderTextColor="rgba(9, 48, 48, 0.3)"
                value={apt}
                onChangeText={setApt}
                maxLength={20}
              />
            </View>

            <TouchableOpacity style={[styles.primaryButton, saving && { opacity: 0.6 }]} onPress={handleContinue} disabled={saving}>
              <Text style={styles.primaryButtonText}>{saving ? 'Guardando...' : 'Continuar'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
