import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert,
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { api } from '../services/api';

export default function ForgotPasswordScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { colors, typography, st, fw, minTarget } = useAppTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    topSection: { flex: 0.28, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    headerText: {
      ...typography.title,
      color: colors.darkmodeGreenBlack,
      fontSize: st(24),
      marginBottom: 6,
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
      flex: 0.72,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingHorizontal: 30,
      paddingTop: 40,
    },
    label: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      marginBottom: 8,
      marginLeft: 15,
      fontSize: st(12),
    },
    inputContainer: {
      backgroundColor: colors.lightGreen,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginBottom: 20,
      minHeight: minTarget,
      justifyContent: 'center',
    },
    input: { ...typography.paragraph, color: colors.lettersAndIcons },
    passwordContainer: {
      backgroundColor: colors.lightGreen,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginBottom: 20,
      minHeight: minTarget,
    },
    passwordInput: { flex: 1, ...typography.paragraph, color: colors.lettersAndIcons },
    eyeIcon: { marginLeft: 10 },
    primaryButton: {
      backgroundColor: colors.mainGreen,
      paddingVertical: 14,
      borderRadius: 25,
      alignItems: 'center',
      marginTop: 6,
      minHeight: minTarget,
      justifyContent: 'center',
    },
    primaryButtonText: {
      ...typography.subtitle,
      color: colors.darkmodeGreenBlack,
      fontWeight: fw('700'),
    },
    backLink: { alignSelf: 'center', marginTop: 20, minHeight: minTarget, justifyContent: 'center' },
    backLinkText: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(13),
      textDecorationLine: 'underline',
    },
  }), [colors, typography, st, fw, minTarget]);

  const handleReset = async () => {
    if (!identifier.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }
    if (password.length < 4) {
      Alert.alert('Error', 'La contraseña debe tener al menos 4 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/auth/reset-password', {
        identifier: identifier.trim(),
        newPassword: password,
      });
      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña fue restablecida. Ya puedes iniciar sesión.',
        [{ text: 'Ingresar', onPress: () => navigation.navigate('Login') }],
      );
    } catch (e) {
      Alert.alert('Error', e.message || 'No se pudo restablecer la contraseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.topSection}>
          <Text style={styles.headerText}>Recuperar Contraseña</Text>
          <Text style={styles.subText}>
            Ingresa tu usuario o correo y define una nueva contraseña.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Usuario o Email:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@ejemplo.com"
                placeholderTextColor={colors.textSoft}
                keyboardType="email-address"
                autoCapitalize="none"
                value={identifier}
                onChangeText={setIdentifier}
              />
            </View>

            <Text style={styles.label}>Nueva Contraseña:</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={colors.textSoft}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.lettersAndIcons} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirmar Contraseña:</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={colors.textSoft}
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, submitting && { opacity: 0.6 }]}
              onPress={handleReset}
              disabled={submitting}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? 'Guardando...' : 'Restablecer Contraseña'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
              <Text style={styles.backLinkText}>← Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
