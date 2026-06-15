import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
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
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bgCircle1: {
      position: 'absolute',
      top: -60,
      left: -40,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.14)',
    },
    bgCircle2: {
      position: 'absolute',
      top: -20,
      right: -60,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: 'rgba(255, 255, 255, 0.11)',
    },
    welcomeText: {
      ...typography.title,
      color: colors.darkmodeGreenBlack,
      fontSize: st(28),
    },
    bottomSection: {
      flex: 0.7,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingHorizontal: 30,
      paddingTop: 50,
      alignItems: 'center',
    },
    formContainer: {
      width: '100%',
      marginBottom: 40,
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
      paddingVertical: 12,
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
    forgotPassword: {
      marginBottom: 15,
    },
    forgotPasswordText: {
      ...typography.paragraph,
      textAlign: 'center',
      fontSize: st(12),
      color: colors.lettersAndIcons,
    },
    secondaryButton: {
      backgroundColor: colors.lightGreen,
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 25,
      minHeight: minTarget,
      justifyContent: 'center',
    },
    secondaryButtonText: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontWeight: fw('700'),
    },
  }), [colors, typography, st, fw, minTarget]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }
    const success = await login(email, password);
    if (!success) {
      Alert.alert('Error', 'Credenciales inválidas. Intenta de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
            { translateY: anim2.interpolate({ inputRange: [0, 1], outputRange: [-40, 40] }) },
            { scale: anim2.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1.55] }) },
            { translateX: anim2.interpolate({ inputRange: [0, 1], outputRange: [-25, 25] }) }
          ]
        }]} />
        <Text style={styles.welcomeText}>Bienvenido a Convivio</Text>
      </View>

      {/* Bottom White Section */}
      <View style={styles.bottomSection}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Usuario o Email:</Text>
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

          <Text style={styles.label}>Contraseña:</Text>
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
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.lettersAndIcons}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Ingresar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Olvidaste la{'\n'}contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.secondaryButtonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}