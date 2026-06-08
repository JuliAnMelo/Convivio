import React, { useContext, useMemo, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { createConjunto } from '../services/conjuntoService';

export default function ConjuntoSetupScreen({ navigation, route }) {
  // userData is present during first registration; absent in "add" mode (admin already logged in)
  const { userData, role, mode: routeMode } = route.params || {};
  const isAddMode = routeMode === 'add' || !userData;

  const [localMode, setLocalMode] = useState(null); // 'create' | null
  const [conjuntoName, setConjuntoName] = useState('');
  const [address, setAddress] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const { register, addConjunto, user } = useContext(AuthContext);
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
      flex: 0.78,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingHorizontal: 28,
      paddingTop: 36,
      paddingBottom: 32,
    },
    optionCard: {
      backgroundColor: colors.lightGreen,
      borderRadius: 20,
      padding: 22,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: minTarget + 20,
    },
    optionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.mainGreen,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    optionTextContainer: { flex: 1 },
    optionTitle: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontSize: st(16),
      fontWeight: fw('700'),
      marginBottom: 3,
    },
    optionDescription: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(12),
      opacity: 0.7,
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
      marginBottom: 20,
    },
    input: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(15),
    },
    primaryButton: {
      backgroundColor: colors.mainGreen,
      paddingVertical: 14,
      borderRadius: 25,
      alignItems: 'center',
      minHeight: minTarget,
      justifyContent: 'center',
      marginTop: 8,
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
    optionalLabel: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(11),
      marginLeft: 2,
      opacity: 0.55,
    },
    photoPickerBtn: {
      width: '100%',
      height: 130,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 8,
      backgroundColor: colors.lightGreen,
    },
    photoPreview: { width: '100%', height: '100%' },
    photoPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    photoPlaceholderText: {
      ...typography.paragraph,
      color: colors.mainGreen,
      fontSize: st(13),
      fontWeight: fw('600'),
    },
    removePhotoBtn: { alignSelf: 'flex-end', marginBottom: 16 },
    removePhotoText: {
      ...typography.paragraph,
      color: colors.errorRed,
      fontSize: st(12),
      textDecorationLine: 'underline',
    },
  }), [colors, typography, st, fw, minTarget]);

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para elegir la foto del conjunto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleCreate = () => {
    if (!conjuntoName.trim()) {
      Alert.alert('Error', 'Ingresa el nombre del conjunto');
      return;
    }
    const conjunto = createConjunto(conjuntoName.trim(), { address, photoUri });
    if (isAddMode) {
      // Admin already logged in — just add the new conjunto
      addConjunto({ conjuntoId: conjunto.id, conjuntoCode: conjunto.code, conjuntoName: conjunto.name });
      Alert.alert(
        'Conjunto Creado',
        `Código: ${conjunto.code}\n\nComparte este código con residentes y guardas.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Inicio') }]
      );
    } else {
      // First registration
      register({
        ...userData,
        role: 'administrador',
        conjuntoId: conjunto.id,
        conjuntoIds: [conjunto.id],
        conjuntoCode: conjunto.code,
        conjuntoName: conjunto.name,
        apt: 'Administración',
      });
    }
  };

  const handleGoToJoin = () => {
    if (isAddMode) {
      navigation.navigate('InAppConjuntoJoin', { mode: 'add' });
    } else {
      navigation.navigate('ConjuntoJoin', { userData, role: 'administrador' });
    }
  };

  if (localMode === 'create') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.topSection}>
            <Text style={styles.headerText}>Nuevo Conjunto</Text>
            <Text style={styles.subText}>Ingresa el nombre de tu conjunto residencial</Text>
          </View>
          <View style={styles.bottomSection}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Nombre del Conjunto *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Conjunto Los Rosales"
                  placeholderTextColor="rgba(9, 48, 48, 0.4)"
                  value={conjuntoName}
                  onChangeText={setConjuntoName}
                  autoFocus
                />
              </View>

              <Text style={styles.label}>Dirección <Text style={styles.optionalLabel}>(opcional)</Text></Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Calle 45 # 23-67"
                  placeholderTextColor="rgba(9, 48, 48, 0.4)"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <Text style={styles.label}>Foto del Conjunto <Text style={styles.optionalLabel}>(opcional)</Text></Text>
              <TouchableOpacity style={styles.photoPickerBtn} onPress={handlePickPhoto} activeOpacity={0.8}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.photoPreview} contentFit="cover" />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="camera-outline" size={28} color={colors.mainGreen} />
                    <Text style={styles.photoPlaceholderText}>Escoger de la galería</Text>
                  </View>
                )}
              </TouchableOpacity>
              {photoUri && (
                <TouchableOpacity style={styles.removePhotoBtn} onPress={() => setPhotoUri(null)}>
                  <Text style={styles.removePhotoText}>Eliminar foto</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.primaryButton} onPress={handleCreate}>
                <Text style={styles.primaryButtonText}>Crear Conjunto</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backLink} onPress={() => setLocalMode(null)}>
                <Text style={styles.backLinkText}>← Volver</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.headerText}>{isAddMode ? 'Agregar Conjunto' : 'Configurar Conjunto'}</Text>
        <Text style={styles.subText}>¿Deseas crear un nuevo conjunto o unirte a uno existente?</Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.optionCard} onPress={() => setLocalMode('create')} activeOpacity={0.8}>
          <View style={styles.optionIcon}>
            <Ionicons name="add-circle-outline" size={26} color={colors.darkmodeGreenBlack} />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Registrar Conjunto</Text>
            <Text style={styles.optionDescription}>
              Crea un nuevo conjunto y obtén un código para tus residentes
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.lettersAndIcons} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleGoToJoin} activeOpacity={0.8}>
          <View style={styles.optionIcon}>
            <Ionicons name="people-outline" size={26} color={colors.darkmodeGreenBlack} />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Unirse a un Conjunto</Text>
            <Text style={styles.optionDescription}>
              Ingresa el código del conjunto para solicitar acceso como administrador
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.lettersAndIcons} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={styles.backLinkText}>← Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
