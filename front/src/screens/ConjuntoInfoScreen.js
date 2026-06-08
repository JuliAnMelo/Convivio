import React, { useContext, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { getConjuntoById, updateConjunto } from '../services/conjuntoService';

const ALL_IMAGES = {
  'home':     require('../../assets/Images/imagen home.png'),
  'salon':    require('../../assets/Images/salon comunal conjunto.jpg'),
  'gym':      require('../../assets/Images/gym residencial.jpg'),
  'parrilla': require('../../assets/Images/zona de parrilla conjunto.jpg'),
  'tennis':   require('../../assets/Images/tennis de mesa.jpg'),
};

const INFO_ROWS = [
  { icon: 'location-outline',   key: 'address',  label: 'Dirección'              },
  { icon: 'map-outline',        key: 'city',     label: 'Ciudad'                 },
  { icon: 'call-outline',       key: 'phone',    label: 'Teléfono Administración' },
  { icon: 'mail-outline',       key: 'email',    label: 'Correo'                 },
  { icon: 'time-outline',       key: 'hours',    label: 'Horario de Atención'    },
];

export default function ConjuntoInfoScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { colors, typography, st, fw, minTarget } = useAppTheme();

  const isAdmin = user?.role === 'administrador';
  const conjunto = getConjuntoById(user?.conjuntoId) || {};

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    address: conjunto.address || '',
    city: conjunto.city || '',
    phone: conjunto.phone || '',
    email: conjunto.email || '',
    hours: conjunto.hours || '',
  });

  const handleEditToggle = () => {
    if (!editing) {
      setForm({
        address: conjunto.address || '',
        city: conjunto.city || '',
        phone: conjunto.phone || '',
        email: conjunto.email || '',
        hours: conjunto.hours || '',
      });
    }
    setEditing((prev) => !prev);
  };

  const handleSave = () => {
    updateConjunto(conjunto.id, form);
    setEditing(false);
    Alert.alert('Éxito', 'La información del conjunto fue actualizada.');
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      marginBottom: 0,
    },
    backButton: {
      padding: 5,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerSpacer: { width: 44 },
    heroImageWrap: {
      marginHorizontal: 20,
      marginTop: 12,
      marginBottom: 20,
      borderRadius: 20,
      overflow: 'hidden',
      height: 130,
    },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      backgroundColor: 'rgba(0,0,0,0.35)',
      padding: 14,
    },
    heroName: {
      color: '#FFF',
      ...typography.title,
      fontSize: st(18),
      fontWeight: fw('800'),
    },
    heroCode: {
      color: 'rgba(255,255,255,0.8)',
      ...typography.paragraph,
      fontSize: st(12),
      marginTop: 2,
      letterSpacing: 2,
    },
    body: {
      flex: 1,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      paddingTop: 28,
      paddingHorizontal: 22,
      paddingBottom: 32,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    sectionTitle: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontSize: st(16),
      fontWeight: fw('700'),
    },
    editToggleBtn: {
      padding: 6,
      minWidth: minTarget * 0.8,
      minHeight: minTarget * 0.8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoCard: {
      backgroundColor: colors.lightGreen,
      borderRadius: 20,
      paddingVertical: 6,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    infoRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(9,48,48,0.07)',
    },
    infoIcon: { marginRight: 14 },
    infoTextWrap: { flex: 1 },
    infoLabel: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(11),
      opacity: 0.6,
      marginBottom: 1,
    },
    infoValue: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(14),
      fontWeight: fw('500'),
    },
    infoInput: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(14),
      fontWeight: fw('500'),
      paddingVertical: 2,
      borderBottomWidth: 1,
      borderBottomColor: colors.mainGreen,
    },
    saveButton: {
      backgroundColor: colors.mainGreen,
      borderRadius: 25,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 12,
      minHeight: minTarget,
    },
    saveButtonText: {
      ...typography.subtitle,
      color: colors.darkmodeGreenBlack,
      fontWeight: fw('700'),
      fontSize: st(15),
    },
    manualButton: {
      backgroundColor: colors.mainGreen,
      borderRadius: 25,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginTop: 8,
      minHeight: minTarget,
    },
    manualButtonText: {
      ...typography.subtitle,
      color: colors.darkmodeGreenBlack,
      fontWeight: fw('700'),
      fontSize: st(15),
    },
  }), [colors, typography, st, fw, minTarget]);

  const fallback = {
    address: 'Información no disponible',
    city: 'Bogotá, Colombia',
    phone: 'Sin teléfono registrado',
    email: 'Sin correo registrado',
    hours: 'Sin horario registrado',
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <View style={styles.headerSpacer} />
      </View>

      {/* Hero image with conjunto name overlay */}
      <View style={styles.heroImageWrap}>
        <Image
          source={ALL_IMAGES[conjunto.imageKey] || ALL_IMAGES['home']}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroName}>{conjunto.name || user?.conjuntoName || 'Mi Conjunto'}</Text>
          <Text style={styles.heroCode}>Código: {conjunto.code || user?.conjuntoCode || '------'}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Información del Conjunto</Text>
          {isAdmin && (
            <TouchableOpacity onPress={handleEditToggle} style={styles.editToggleBtn} activeOpacity={0.7}>
              <Ionicons name={editing ? 'close-outline' : 'create-outline'} size={20} color={colors.mainGreen} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoCard}>
          {INFO_ROWS.map((row, idx) => {
            const isLast = idx === INFO_ROWS.length - 1;
            return (
              <View
                key={row.key}
                style={[styles.infoRow, !isLast && styles.infoRowBorder]}
              >
                <Ionicons name={row.icon} size={18} color={colors.mainGreen} style={styles.infoIcon} />
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  {editing ? (
                    <TextInput
                      style={styles.infoInput}
                      value={form[row.key]}
                      onChangeText={(text) => setForm((prev) => ({ ...prev, [row.key]: text }))}
                      placeholder={row.label}
                      placeholderTextColor="rgba(9,48,48,0.4)"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{conjunto[row.key] || fallback[row.key]}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {editing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Ionicons name="checkmark-outline" size={22} color={colors.darkmodeGreenBlack} />
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => navigation.navigate('ManualConvivencia')}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={22} color={colors.darkmodeGreenBlack} />
          <Text style={styles.manualButtonText}>Ver Manual de Convivencia</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
