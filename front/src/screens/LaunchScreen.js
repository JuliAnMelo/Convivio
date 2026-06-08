import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../theme';

export default function LaunchScreen({ navigation }) {
  const { colors, typography, st, fw, minTarget } = useAppTheme();
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundGreenWhite,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    logoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      ...typography.title,
      fontSize: st(48),
      color: colors.mainGreen,
      fontWeight: fw('700'),
    },
    subLogoText: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      marginTop: 10,
    },
    buttonContainer: {
      width: '100%',
      alignItems: 'center',
      paddingBottom: 60,
    },
    primaryButton: {
      backgroundColor: colors.mainGreen,
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 25,
      width: '60%',
      alignItems: 'center',
      marginBottom: 15,
      minHeight: minTarget,
      justifyContent: 'center',
    },
    primaryButtonText: {
      ...typography.subtitle,
      color: colors.backgroundGreenWhite,
      fontWeight: fw('700'),
    },
    secondaryButton: {
      backgroundColor: colors.lightGreen,
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 25,
      width: '60%',
      alignItems: 'center',
      marginBottom: 20,
      minHeight: minTarget,
      justifyContent: 'center',
    },
    secondaryButtonText: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontWeight: fw('700'),
    },
    forgotPassword: {
      marginTop: 10,
      alignItems: 'center',
    },
    forgotPasswordText: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      textAlign: 'center',
      fontSize: st(12),
    },
  }), [colors, typography, st, fw, minTarget]);
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Convivio</Text>
        <Text style={styles.subLogoText}>Tu app de gestión residencial</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.secondaryButtonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Olvidaste la{'\n'}contraseña?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}