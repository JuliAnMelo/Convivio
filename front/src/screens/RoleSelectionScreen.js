import React, { useContext, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';

const ROLES = [
  {
    key: 'administrador',
    label: 'Administrador',
    description: 'Gestiona el conjunto',
    image: require('../../assets/Images/administrador.webp'),
  },
  {
    key: 'residente',
    label: 'Residente',
    description: 'Vive en el conjunto',
    image: require('../../assets/Images/residente.jpg'),
  },
  {
    key: 'guarda',
    label: 'Guarda',
    description: 'Seguridad del conjunto',
    image: require('../../assets/Images/guardia.webp'),
  },
];

export default function RoleSelectionScreen({ navigation, route }) {
  const { userData } = route.params;
  const { register } = useContext(AuthContext);
  const { colors, typography, st, fw, minTarget } = useAppTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    topSection: {
      flex: 0.22,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    headerText: {
      ...typography.title,
      color: colors.darkmodeGreenBlack,
      fontSize: st(26),
      marginBottom: 4,
    },
    subText: {
      ...typography.paragraph,
      color: colors.darkmodeGreenBlack,
      fontSize: st(14),
      opacity: 0.8,
    },
    bottomSection: {
      flex: 0.78,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingHorizontal: 20,
      paddingTop: 36,
      paddingBottom: 32,
    },
    rolesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    roleCard: {
      flex: 1,
      backgroundColor: colors.lightGreen,
      borderRadius: 24,
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 6,
    },
    roleImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 12,
    },
    roleLabel: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontSize: st(13),
      fontWeight: fw('700'),
      textAlign: 'center',
    },
    roleDescription: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(11),
      textAlign: 'center',
      marginTop: 4,
      opacity: 0.7,
    },
    backLink: {
      alignSelf: 'center',
      marginTop: 28,
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

  const handleRoleSelect = (role) => {
    if (role === 'administrador') {
      navigation.navigate('ConjuntoSetup', { userData, role });
    } else {
      // Resident / guard: register immediately — they join a conjunto from the home screen
      register({
        ...userData,
        role,
        apt: userData.apt || 'Por asignar',
        torre: userData.torre || '',
        conjuntoId: null,
        conjuntoIds: [],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.headerText}>¿Quién eres?</Text>
        <Text style={styles.subText}>Selecciona tu rol en el conjunto</Text>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.rolesContainer}>
          {ROLES.map((roleItem) => (
            <TouchableOpacity
              key={roleItem.key}
              style={styles.roleCard}
              onPress={() => handleRoleSelect(roleItem.key)}
              activeOpacity={0.75}
            >
              <Image
                source={roleItem.image}
                style={styles.roleImage}
                contentFit="cover"
              />
              <Text style={styles.roleLabel}>{roleItem.label}</Text>
              <Text style={styles.roleDescription}>{roleItem.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={styles.backLinkText}>← Volver al registro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
