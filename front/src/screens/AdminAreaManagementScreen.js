import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
  Switch, Alert, TextInput, Modal,
} from 'react-native';
import { Image } from 'expo-image';
// Misma foto por defecto que usa el perfil del residente cuando no subió una propia
const DEFAULT_RESIDENT_AVATAR = 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=200&q=80';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppTheme } from '../theme';
import { useBooking } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import * as areasService from '../services/areasService';
import { api } from '../services/api';

const AREA_IMAGES = {
  Gym:               require('../../assets/Images/gym residencial.jpg'),
  'Zona de Parrilla': require('../../assets/Images/zona de parrilla conjunto.jpg'),
  'Tenis de Mesa':   require('../../assets/Images/tennis de mesa.jpg'),
  'Salón Comunal':   require('../../assets/Images/salon comunal conjunto.jpg'),
};

const DISABLE_OPTIONS = [
  { label: 'Indefinidamente', ms: null },
  { label: '1 día',           ms: 86400000 },
  { label: '3 días',          ms: 86400000 * 3 },
  { label: '1 semana',        ms: 86400000 * 7 },
  { label: '2 semanas',       ms: 86400000 * 14 },
  { label: '1 mes',           ms: 86400000 * 30 },
];

const STATUS_CONFIG = {
  confirmed:        { label: 'Confirmada', color: '#00D09E' },
  pending_approval: { label: 'Pend. Aprobación', color: '#FF9F43' },
  cancelled:        { label: 'Cancelada', color: '#F04C4C' },
};

export default function AdminAreaManagementScreen({ navigation, route }) {
  const { areaName } = route.params;
  const { colors, typography, st, fw, minTarget } = useAppTheme();
  const { getReservationsForArea, approveReservation, cancelReservation } = useBooking();
  const { user } = useContext(AuthContext);

  const [settings, setSettings] = useState(() => areasService.getAreaSettings(areaName));
  const [reservations, setReservations] = useState([]);
  const [disableModalVisible, setDisableModalVisible] = useState(false);
  const [disableMessage, setDisableMessage] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelMessage, setCancelMessage] = useState('');

  // Subscribe to areasService changes
  useEffect(() => {
    return areasService.subscribe(() => {
      setSettings(areasService.getAreaSettings(areaName));
    });
  }, [areaName]);

  // Fetch directly from backend
  const refreshReservations = async () => {
    try {
      const q = user?.conjuntoId ? `?conjuntoId=${encodeURIComponent(user.conjuntoId)}` : '';
      const data = await api.get(`/bookings/${encodeURIComponent(areaName)}${q}`);
      setReservations(data);
    } catch (e) {
      console.log('Error fetching reservations', e);
    }
  };
  useEffect(() => { refreshReservations(); }, []);

  const isDisabled = areasService.isAreaDisabled(areaName);

  const handleToggleDisable = async () => {
    if (isDisabled) {
      await areasService.enableArea(areaName);
    } else {
      setDisableMessage('');
      setDisableModalVisible(true);
    }
  };

  const handleDisableConfirm = async (option) => {
    setDisableModalVisible(false);
    await areasService.disableArea(areaName, { message: disableMessage, durationMs: option.ms });
  };

  const handleToggleApproval = async (val) => {
    await areasService.setAreaSettings(areaName, { requiresApproval: val });
  };

  const handleEditPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar la foto del área.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled) {
      await areasService.setAreaImage(areaName, result.assets[0].uri);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/bookings/${id}/approve`, {});
      refreshReservations();
    } catch (e) {
      Alert.alert('Error', 'No se pudo aprobar la reserva.');
    }
  };

  const handleCancelStart = (id) => {
    setCancellingId(id);
    setCancelMessage('');
  };

  const handleCancelConfirm = async () => {
    if (!cancelMessage.trim()) {
      Alert.alert('Requerido', 'Escribe un mensaje para notificar al residente.');
      return;
    }
    try {
      await api.post(`/bookings/${cancellingId}/cancel`, { message: cancelMessage.trim() });

      setCancellingId(null);
      setCancelMessage('');
      refreshReservations();
    } catch (e) {
      Alert.alert('Error', 'No se pudo cancelar la reserva.');
    }
  };

  const fallbackImage = AREA_IMAGES[areaName] || AREA_IMAGES['Gym'];
  const photoSrc = settings.photoUri ? { uri: settings.photoUri } : fallbackImage;

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingTop: 12, marginBottom: 8,
    },
    backBtn: {
      minWidth: minTarget, minHeight: minTarget,
      justifyContent: 'center', alignItems: 'center', padding: 5,
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { color: '#FFF', fontSize: st(20), fontWeight: fw('800') },
    headerSpacer: { width: 44 },

    // Photo
    photoWrap: {
      marginHorizontal: 20, marginBottom: 0,
      borderRadius: 20, overflow: 'hidden', height: 150,
    },
    photo: { width: '100%', height: '100%' },
    photoEditBtn: {
      position: 'absolute', bottom: 10, right: 10,
      backgroundColor: colors.mainGreen,
      flexDirection: 'row', alignItems: 'center',
      gap: 6, paddingHorizontal: 12, paddingVertical: 7,
      borderRadius: 20,
    },
    photoEditText: {
      color: colors.darkmodeGreenBlack,
      ...typography.paragraph, fontSize: st(12), fontWeight: fw('700'),
    },

    // Body
    body: {
      flex: 1, backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 35, borderTopRightRadius: 35,
      marginTop: 16, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40,
    },
    section: { marginBottom: 24 },
    sectionTitle: {
      ...typography.subtitle, color: colors.lettersAndIcons,
      fontSize: st(14), fontWeight: fw('700'), marginBottom: 12,
    },
    settingRow: {
      backgroundColor: colors.lightGreen, borderRadius: 16,
      paddingHorizontal: 16, paddingVertical: 14,
      flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    },
    settingIcon: {
      width: 38, height: 38, borderRadius: 12,
      backgroundColor: colors.mainGreen + '22',
      justifyContent: 'center', alignItems: 'center', marginRight: 14,
    },
    settingTextWrap: { flex: 1 },
    settingLabel: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(14), fontWeight: fw('600'),
    },
    settingDesc: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(11), opacity: 0.6, marginTop: 2,
    },
    disabledBanner: {
      backgroundColor: '#F04C4C18', borderRadius: 12,
      padding: 12, marginBottom: 10,
      flexDirection: 'row', alignItems: 'center', gap: 8,
    },
    disabledBannerText: {
      ...typography.paragraph, color: '#C0392B',
      fontSize: st(12), flex: 1,
    },

    // Reservation cards
    resCard: {
      backgroundColor: colors.lightGreen, borderRadius: 16,
      padding: 14, marginBottom: 10,
    },
    resTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
    resAvatar: {
      width: 38, height: 38, borderRadius: 19,
      overflow: 'hidden',
      backgroundColor: colors.mainGreen + '30',
    },
    resAvatarInitials: {
      width: 38, height: 38, borderRadius: 19,
      backgroundColor: colors.mainGreen + '40',
      justifyContent: 'center', alignItems: 'center',
    },
    resAvatarInitialsText: {
      ...typography.subtitle, fontSize: st(15),
      color: colors.mainGreen, fontWeight: fw('700'),
    },
    resTitle: {
      ...typography.subtitle, color: colors.lettersAndIcons,
      fontSize: st(14), fontWeight: fw('700'), flex: 1,
    },
    resBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
    resBadgeText: { color: '#FFF', fontSize: st(11), fontWeight: fw('700') },
    resMeta: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(12), opacity: 0.65, marginBottom: 4,
    },
    resUser: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(12), fontWeight: fw('600'), marginBottom: 8,
    },
    resActions: { flexDirection: 'row', gap: 8 },
    approveBtn: {
      flex: 1, backgroundColor: colors.mainGreen, borderRadius: 12,
      paddingVertical: 9, alignItems: 'center',
    },
    approveBtnText: {
      ...typography.paragraph, color: colors.darkmodeGreenBlack,
      fontSize: st(12), fontWeight: fw('700'),
    },
    cancelBtn: {
      flex: 1, backgroundColor: '#F04C4C20', borderRadius: 12,
      paddingVertical: 9, alignItems: 'center',
      borderWidth: 1, borderColor: '#F04C4C',
    },
    cancelBtnText: {
      ...typography.paragraph, color: '#F04C4C',
      fontSize: st(12), fontWeight: fw('700'),
    },

    // Cancel inline form
    cancelForm: {
      backgroundColor: '#FFF5F5', borderRadius: 12,
      padding: 12, marginTop: 8,
      borderWidth: 1, borderColor: '#F04C4C30',
    },
    cancelInput: {
      backgroundColor: '#FFF', borderRadius: 10,
      borderWidth: 1, borderColor: '#F04C4C50',
      padding: 10, fontSize: st(13), color: colors.lettersAndIcons,
      marginBottom: 8, minHeight: 56, textAlignVertical: 'top',
    },
    cancelConfirmBtn: {
      backgroundColor: '#F04C4C', borderRadius: 10,
      paddingVertical: 9, alignItems: 'center',
    },
    cancelConfirmText: {
      color: '#FFF', fontSize: st(13), fontWeight: fw('700'),
      ...typography.paragraph,
    },
    emptyText: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(13), textAlign: 'center', opacity: 0.5, marginTop: 8,
    },

    // Disable modal
    modalOverlay: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 30, borderTopRightRadius: 30,
      padding: 24, paddingBottom: 40,
    },
    modalTitle: {
      ...typography.subtitle, color: colors.lettersAndIcons,
      fontSize: st(17), fontWeight: fw('800'), marginBottom: 4,
    },
    modalSubtitle: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(12), opacity: 0.6, marginBottom: 16,
    },
    modalInput: {
      backgroundColor: colors.lightGreen, borderRadius: 14,
      paddingHorizontal: 14, paddingVertical: 10,
      fontSize: st(13), color: colors.lettersAndIcons,
      marginBottom: 16,
    },
    modalLabel: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(13), fontWeight: fw('600'), marginBottom: 10,
    },
    modalOption: {
      paddingVertical: 13, paddingHorizontal: 16,
      backgroundColor: colors.lightGreen, borderRadius: 12, marginBottom: 8,
    },
    modalOptionText: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(14),
    },
    modalCancel: {
      alignItems: 'center', paddingVertical: 14, marginTop: 4,
    },
    modalCancelText: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(14), textDecorationLine: 'underline',
    },
  }), [colors, typography, st, fw, minTarget]);

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const formatDisabledUntil = (iso) => {
    if (!iso) return 'Indefinidamente';
    return `Hasta el ${formatDate(iso)}`;
  };

  const activeReservations = reservations.filter(r => r.status !== 'cancelled');
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{areaName}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Photo */}
      <View style={styles.photoWrap}>
        <Image source={photoSrc} style={styles.photo} contentFit="cover" />
        <TouchableOpacity style={styles.photoEditBtn} onPress={handleEditPhoto}>
          <Ionicons name="camera-outline" size={16} color={colors.darkmodeGreenBlack} />
          <Text style={styles.photoEditText}>Cambiar foto</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} bounces={false}>

        {/* Status section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado del Área</Text>

          {isDisabled && (
            <View style={styles.disabledBanner}>
              <Ionicons name="ban-outline" size={18} color="#C0392B" />
              <Text style={styles.disabledBannerText}>
                Área deshabilitada — {formatDisabledUntil(settings.disabledUntil)}
                {settings.disabledMessage ? `\nMensaje: ${settings.disabledMessage}` : ''}
              </Text>
            </View>
          )}

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons name={isDisabled ? 'lock-closed-outline' : 'lock-open-outline'} size={20} color={isDisabled ? '#F04C4C' : colors.mainGreen} />
            </View>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingLabel}>{isDisabled ? 'Área Deshabilitada' : 'Área Habilitada'}</Text>
              <Text style={styles.settingDesc}>{isDisabled ? 'Los residentes no pueden reservar' : 'Los residentes pueden reservar'}</Text>
            </View>
            <Switch
              value={!isDisabled}
              onValueChange={handleToggleDisable}
              trackColor={{ false: '#F04C4C', true: colors.mainGreen }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons name="shield-checkmark-outline" size={20} color={settings.requiresApproval ? colors.mainGreen : colors.lettersAndIcons} />
            </View>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingLabel}>Requiere Aprobación</Text>
              <Text style={styles.settingDesc}>
                {settings.requiresApproval ? 'Las reservas deben ser aprobadas por ti' : 'Las reservas se confirman automáticamente'}
              </Text>
            </View>
            <Switch
              value={settings.requiresApproval}
              onValueChange={handleToggleApproval}
              trackColor={{ false: '#ccc', true: colors.mainGreen }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Active reservations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Reservas Activas ({activeReservations.length})
          </Text>

          {activeReservations.length === 0 ? (
            <Text style={styles.emptyText}>Sin reservas activas</Text>
          ) : (
            activeReservations.map(res => {
              const cfg = STATUS_CONFIG[res.status] || STATUS_CONFIG.confirmed;
              const isCancelling = cancellingId === res.id;
              return (
                <View key={res.id} style={styles.resCard}>
                  <View style={styles.resTop}>
                    {/* User avatar circle with apt badge */}
                    <View style={{ position: 'relative' }}>
                      <View style={styles.resAvatar}>
                        <Image
                          source={{ uri: res.userPhotoUri || DEFAULT_RESIDENT_AVATAR }}
                          style={{ width: 38, height: 38 }}
                          contentFit="cover"
                        />
                      </View>
                    </View>
                    <Text style={[styles.resTitle, { flex: 1 }]} numberOfLines={1}>{res.eventTitle}</Text>
                    <View style={[styles.resBadge, { backgroundColor: cfg.color }]}>
                      <Text style={styles.resBadgeText}>{cfg.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.resMeta}>
                    {res.monthName} {res.day}, {res.year} · {res.timeSlot}
                  </Text>
                  {res.userName ? <Text style={styles.resUser}>{res.userName}</Text> : null}
                  <Text style={styles.resMeta}>{res.people} persona(s)</Text>

                  <View style={styles.resActions}>
                    {res.status === 'pending_approval' && (
                      <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(res.id)}>
                        <Text style={styles.approveBtnText}>✓ Aprobar</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => isCancelling ? setCancellingId(null) : handleCancelStart(res.id)}
                    >
                      <Text style={styles.cancelBtnText}>{isCancelling ? 'Cancelar' : '✕ Cancelar Reserva'}</Text>
                    </TouchableOpacity>
                  </View>

                  {isCancelling && (
                    <View style={styles.cancelForm}>
                      <TextInput
                        style={styles.cancelInput}
                        placeholder="Motivo de cancelación para el residente..."
                        placeholderTextColor="rgba(9,48,48,0.4)"
                        value={cancelMessage}
                        onChangeText={setCancelMessage}
                        multiline
                      />
                      <TouchableOpacity style={styles.cancelConfirmBtn} onPress={handleCancelConfirm}>
                        <Text style={styles.cancelConfirmText}>Confirmar Cancelación</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        {/* Cancelled */}
        {cancelledReservations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historial de Cancelaciones ({cancelledReservations.length})</Text>
            {cancelledReservations.map(res => (
              <View key={res.id} style={[styles.resCard, { opacity: 0.65 }]}>
                <View style={styles.resTop}>
                  <Text style={styles.resTitle} numberOfLines={1}>{res.eventTitle}</Text>
                  <View style={[styles.resBadge, { backgroundColor: '#F04C4C' }]}>
                    <Text style={styles.resBadgeText}>Cancelada</Text>
                  </View>
                </View>
                <Text style={styles.resMeta}>{res.monthName} {res.day} · {res.timeSlot}</Text>
                {res.cancelledMessage ? (
                  <Text style={[styles.resMeta, { fontStyle: 'italic' }]}>"{res.cancelledMessage}"</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Disable duration modal */}
      <Modal
        visible={disableModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDisableModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Deshabilitar Área</Text>
            <Text style={styles.modalSubtitle}>Selecciona por cuánto tiempo estará deshabilitada</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Mensaje para los residentes (opcional)"
              placeholderTextColor="rgba(9,48,48,0.35)"
              value={disableMessage}
              onChangeText={setDisableMessage}
            />

            <Text style={styles.modalLabel}>Duración</Text>

            {DISABLE_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.label}
                style={styles.modalOption}
                onPress={() => handleDisableConfirm(opt)}
              >
                <Text style={styles.modalOptionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.modalCancel} onPress={() => setDisableModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
