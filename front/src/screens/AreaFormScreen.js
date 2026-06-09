import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useBooking } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import { formatDateLabel, parseTimeRange } from '../utils/calendar';
import { areaRequiresApproval } from '../services/areasService';

export default function AreaFormScreen({ navigation, route }) {
  const {
    areaName = 'Área Común',
    day = 15,
    month = 'Noviembre',
    year = 2025,
    monthIndex = 10,
    time = '14:00 - 16:00',
  } = route.params || {};

  const { submitReservation } = useBooking();
  const { user } = useContext(AuthContext);
  const { colors, typography, st, fw, minTarget } = useAppTheme();
  const [eventTitle, setEventTitle] = useState('');
  const [people, setPeople] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const needsApproval = areaRequiresApproval(areaName);

  const { start, end } = parseTimeRange(time);
  const dateLabel = formatDateLabel(day, month);

  const styles = useMemo(() => StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: colors.mainGreen },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: 16,
      marginTop: 10,
      paddingBottom: 12,
    },
    backButton: {
      padding: 5,
      marginTop: 2,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      flex: 1,
      fontSize: st(19),
      fontWeight: fw('700'),
      color: '#FFF',
      textAlign: 'center',
      paddingHorizontal: 8,
    },
    headerSpacer: { width: 34 },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 24,
    },
    fieldGroup: { marginBottom: 22 },
    label: {
      ...typography.subtitle,
      fontSize: st(15),
      fontWeight: fw('700'),
      color: colors.darkmodeGreenBlack,
      marginBottom: 10,
    },
    readOnlyField: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1.5,
      borderColor: colors.mainGreen,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colors.backgroundGreenWhite,
      minHeight: minTarget,
    },
    readOnlyText: {
      ...typography.paragraph,
      fontSize: st(14),
      fontWeight: fw('600'),
      color: colors.darkmodeGreenBlack,
      flex: 1,
      marginRight: 8,
    },
    input: {
      borderWidth: 1.5,
      borderColor: colors.mainGreen,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: st(14),
      color: colors.darkmodeGreenBlack,
      backgroundColor: colors.card,
      minHeight: minTarget,
    },
    textArea: { minHeight: 110, paddingTop: 14 },
    submitButton: {
      backgroundColor: colors.mainGreen,
      paddingVertical: 16,
      borderRadius: 28,
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 24,
      alignSelf: 'center',
      width: '75%',
      minHeight: minTarget,
      justifyContent: 'center',
    },
    submitButtonDisabled: { opacity: 0.6 },
    submitButtonText: {
      ...typography.subtitle,
      fontWeight: fw('800'),
      color: colors.darkmodeGreenBlack,
      fontSize: st(15),
    },
    approvalBanner: {
      backgroundColor: '#FF9F4318',
      borderRadius: 12,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#FF9F4340',
    },
    approvalBannerText: {
      ...typography.paragraph,
      color: '#C0700A',
      fontSize: st(12),
      flex: 1,
      lineHeight: 17,
    },
  }), [colors, typography, st, fw, minTarget]);

  const handleSubmit = async () => {
    if (!eventTitle.trim()) {
      Alert.alert('Datos incompletos', 'Escribe un título para tu reserva.');
      return;
    }
    if (!people.trim() || Number(people) < 1) {
      Alert.alert('Datos incompletos', 'Indica el número de personas para la reserva.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('http://10.0.2.2:5000/api/bookings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          areaName,
          year,
          monthIndex,
          day,
          timeSlot: time,
          eventTitle: eventTitle.trim(),
          people: parseInt(people.trim()),
          description,
          requiresApproval: needsApproval,
          userName: user?.name || ''
        })
      });
      if (!response.ok) throw new Error('Error backend');
      
      const title = needsApproval ? 'Solicitud pendiente' : 'Solicitud enviada';
      const msg = needsApproval
        ? `Tu solicitud para ${areaName} fue enviada al administrador en el backend.`
        : `Tu reserva de ${areaName} fue confirmada en el backend.`;

      Alert.alert(title, msg, [{ text: 'Entendido', onPress: () => navigation.popToTop() }]);
    } catch (e) {
      Alert.alert('Error', 'No se pudo enviar la solicitud. Verifica tu conexión al backend.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={2}>
              Solicitud De Reserva De {areaName}
            </Text>
            <View style={styles.headerSpacer} />
          </View>
        </SafeAreaView>

        <View style={styles.contentContainer}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {needsApproval && (
              <View style={styles.approvalBanner}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#C0700A" />
                <Text style={styles.approvalBannerText}>
                  Esta área requiere aprobación del administrador. Tu reserva quedará pendiente hasta que sea aprobada.
                </Text>
              </View>
            )}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Fecha</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>{dateLabel}</Text>
                <Ionicons name="calendar-outline" size={22} color={colors.oceanBlueButton} />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Hora</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>
                  Desde {start} Hasta {end}
                </Text>
                <Ionicons name="time-outline" size={22} color={colors.oceanBlueButton} />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Título De La Reserva</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Cumpleaños familiar"
                placeholderTextColor={colors.textSoft}
                value={eventTitle}
                onChangeText={setEventTitle}
                maxLength={60}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Número De Personas</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 10"
                placeholderTextColor={colors.textSoft}
                keyboardType="number-pad"
                value={people}
                onChangeText={setPeople}
                maxLength={4}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Descripción Del Evento</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe brevemente el evento..."
                placeholderTextColor={colors.textSoft}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
