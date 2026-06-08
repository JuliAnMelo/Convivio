import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    container: {
      flex: 1,
      backgroundColor: colors.mainGreen,
    },
    topSection: {
      flex: 0.15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bgCircle1: {
      position: 'absolute',
      top: -50,
      left: -40,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: 'rgba(255, 255, 255, 0.14)',
    },
    bgCircle2: {
      position: 'absolute',
      top: -20,
      right: -50,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: 'rgba(255, 255, 255, 0.11)',
    },
    headerText: {
      ...typography.title,
      color: colors.darkmodeGreenBlack,
      fontSize: st(24),
    },
    bottomSection: {
      flex: 0.85,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      overflow: 'hidden',
    },
    scrollContent: {
      paddingHorizontal: 30,
      paddingTop: 30,
      paddingBottom: 40,
    },
    inputBlock: {
      marginBottom: 15,
    },
    label: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      marginBottom: 5,
      marginLeft: 15,
      fontSize: st(12),
    },
    inputContainer: {
      backgroundColor: colors.lightGreen,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
      minHeight: minTarget,
      justifyContent: 'center',
    },
    input: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
    },
    passwordContainer: {
      backgroundColor: colors.lightGreen,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      minHeight: minTarget,
    },
    passwordInput: {
      flex: 1,
      ...typography.paragraph,
      color: colors.lettersAndIcons,
    },
    eyeIcon: {
      marginLeft: 10,
    },
    buttonContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 20,
    },
    primaryButton: {
      backgroundColor: colors.mainGreen,
      paddingVertical: 12,
      paddingHorizontal: 50,
      borderRadius: 25,
      marginBottom: 15,
      minHeight: minTarget,
      justifyContent: 'center',
    },
    primaryButtonText: {
      ...typography.subtitle,
      color: colors.darkmodeGreenBlack,
      fontWeight: fw('700'),
    },
    loginLink: {
      alignItems: 'center',
    },
    loginLinkText: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(12),
    },
    loginLinkBold: {
      fontWeight: fw('700'),
      color: colors.blueButton,
    },
  }), [colors, typography, st, fw, minTarget]);

  const handleRegister = () => {
    if (!name || !email || !phone || !dob || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    navigation.navigate('RoleSelection', { userData: { email, name, phone, dob } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Top Green Section */}
        <View style={[styles.topSection, { overflow: 'hidden' }]}>
          <Animated.View style={[styles.bgCircle1, {
            transform: [
              { translateX: anim1.interpolate({ inputRange: [0, 1], outputRange: [-60, 90] }) },
              { scale: anim1.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.7] }) }
            ]
          }]} />
          <Animated.View style={[styles.bgCircle2, {
            transform: [
              { translateY: anim2.interpolate({ inputRange: [0, 1], outputRange: [-30, 30] }) },
              { scale: anim2.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1.55] }) },
              { translateX: anim2.interpolate({ inputRange: [0, 1], outputRange: [-25, 25] }) }
            ]
          }]} />
          <Text style={styles.headerText}>Crear Cuenta</Text>
        </View>

        {/* Bottom White Section */}
        <View style={styles.bottomSection}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.inputBlock}>
              <Text style={styles.label}>Nombre Completo</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@ejemplo.com"
                  placeholderTextColor={colors.textSoft}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Número De Teléfono</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="+123 456 789"
                  placeholderTextColor={colors.textSoft}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Fecha De Nacimiento</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="DD / MM / YYYY"
                  placeholderTextColor={colors.textSoft}
                  value={dob}
                  onChangeText={setDob}
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(9, 48, 48, 0.4)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.lettersAndIcons} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Confirmar Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(9, 48, 48, 0.4)"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.lettersAndIcons} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
                <Text style={styles.primaryButtonText}>Registrarse</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLinkText}>
                  "Ya tienes una cuenta?" <Text style={styles.loginLinkBold}>Ingresar</Text>
                </Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}