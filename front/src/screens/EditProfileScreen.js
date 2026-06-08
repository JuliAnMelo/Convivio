import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, TextInput, Switch, Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../theme';
import { AuthContext } from '../context/AuthContext';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=200&q=80';
const GUARD_AVATAR = require('../../assets/Images/guardia.webp');

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [apt, setApt] = useState(user?.apt || '');
  const [isConsejo, setIsConsejo] = useState(user?.isConsejo || false);
  const [photoUri, setPhotoUri] = useState(user?.photoUri || null);

  const canChangePhoto = user?.role !== 'guarda';

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar tu foto de perfil.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleUpdate = () => {
    updateUser({ name, phone, email, apt, isConsejo, photoUri });
    Alert.alert('Éxito', 'Perfil actualizado correctamente');
    navigation.goBack();
  };

  const avatarSource = photoUri
    ? { uri: photoUri }
    : user?.role === 'guarda'
      ? GUARD_AVATAR
      : { uri: DEFAULT_AVATAR };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerBackground}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.placeholderSpace} />
        </View>
      </SafeAreaView>

      <View style={styles.contentContainer}>
        {/* Avatar */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={canChangePhoto ? handlePickPhoto : undefined}
          activeOpacity={canChangePhoto ? 0.8 : 1}
        >
          <Image source={avatarSource} style={styles.avatar} contentFit="cover" />
          {canChangePhoto && (
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={12} color="#FFF" />
            </View>
          )}
        </TouchableOpacity>

        {canChangePhoto && (
          <TouchableOpacity onPress={handlePickPhoto} style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Cambiar foto de perfil</Text>
          </TouchableOpacity>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Datos De Contacto</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor={COLORS.lettersAndIcons}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.lettersAndIcons}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={COLORS.lettersAndIcons}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Apartamento Nro.</Text>
            <TextInput
              style={styles.input}
              value={apt}
              onChangeText={setApt}
              keyboardType="numeric"
              placeholderTextColor={COLORS.lettersAndIcons}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.inputLabel}>¿Hace Parte Del Consejo?</Text>
            <Switch
              trackColor={{ false: '#d3d3d3', true: COLORS.mainGreen }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
              onValueChange={(val) => {
                if (val && !user?.isConsejo) {
                  Alert.alert(
                    'Acceso restringido',
                    'La membresía al consejo es asignada exclusivamente por la administración.',
                    [{ text: 'Entendido' }]
                  );
                  return;
                }
                setIsConsejo(val);
              }}
              value={isConsejo}
            />
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Actualizar Perfil</Text>
          </TouchableOpacity>

          <View style={{ height: 130 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.mainGreen },
  headerBackground: { backgroundColor: COLORS.mainGreen, height: 130 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#FFF' },
  placeholderSpace: { width: 34 },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreenWhite,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: 10,
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: -60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: COLORS.backgroundGreenWhite,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: COLORS.mainGreen,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.backgroundGreenWhite,
  },
  changePhotoBtn: { marginBottom: 10 },
  changePhotoText: {
    color: COLORS.mainGreen,
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, width: '100%' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.lettersAndIcons,
    marginBottom: 16,
    marginTop: 4,
  },
  inputContainer: { marginBottom: 15 },
  inputLabel: {
    fontSize: 14, fontWeight: '600',
    color: COLORS.lettersAndIcons, marginBottom: 5,
  },
  input: {
    backgroundColor: COLORS.lightGreen,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.lettersAndIcons,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: COLORS.mainGreen,
    borderRadius: 25,
    paddingVertical: 13,
    alignItems: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },
  updateButtonText: { color: COLORS.darkmodeGreenBlack, fontSize: 16, fontWeight: '700' },
});
