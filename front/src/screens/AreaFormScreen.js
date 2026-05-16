import React, { useState } from 'react';
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
import { COLORS, TYPOGRAPHY } from '../theme';
import { useBooking } from '../context/BookingContext';
import { formatDateLabel, parseTimeRange } from '../utils/calendar';

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
  const [eventTitle, setEventTitle] = useState('');
  const [people, setPeople] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { start, end } = parseTimeRange(time);
  const dateLabel = formatDateLabel(day, month);

  const handleSubmit = () => {
    if (!eventTitle.trim()) {
      Alert.alert('Datos incompletos', 'Escribe un título para tu reserva.');
      return;
    }
    if (!people.trim() || Number(people) < 1) {
      Alert.alert('Datos incompletos', 'Indica el número de personas para la reserva.');
      return;
    }

    setSubmitting(true);
    submitReservation({
      areaName,
      year,
      monthIndex,
      monthName: month,
      day,
      timeSlot: time,
      eventTitle: eventTitle.trim(),
      people: people.trim(),
      description,
    });

    Alert.alert(
      'Solicitud enviada',
      `Tu solicitud de reserva para ${areaName} fue registrada. Aparecerá en tus anuncios.`,
      [
        {
          text: 'Ver inicio',
          onPress: () => navigation.popToTop(),
        },
      ],
    );
    setSubmitting(false);
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
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Fecha</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>{dateLabel}</Text>
                <Ionicons name="calendar-outline" size={22} color={COLORS.oceanBlueButton} />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Hora</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>
                  Desde {start} Hasta {end}
                </Text>
                <Ionicons name="time-outline" size={22} color={COLORS.oceanBlueButton} />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Título De La Reserva</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Cumpleaños familiar"
                placeholderTextColor="#999"
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
                placeholderTextColor="#999"
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
                placeholderTextColor="#999"
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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.mainGreen },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 10,
    paddingBottom: 12,
  },
  backButton: { padding: 5, marginTop: 2 },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  headerSpacer: { width: 34 },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  fieldGroup: { marginBottom: 22 },
  label: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.darkmodeGreenBlack,
    marginBottom: 10,
  },
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.mainGreen,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.backgroundGreenWhite,
  },
  readOnlyText: {
    ...TYPOGRAPHY.paragraph,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkmodeGreenBlack,
    flex: 1,
    marginRight: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.mainGreen,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.darkmodeGreenBlack,
    backgroundColor: '#FFF',
  },
  textArea: { minHeight: 110, paddingTop: 14 },
  submitButton: {
    backgroundColor: COLORS.mainGreen,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
    alignSelf: 'center',
    width: '75%',
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: {
    ...TYPOGRAPHY.subtitle,
    fontWeight: '800',
    color: COLORS.darkmodeGreenBlack,
    fontSize: 15,
  },
});
