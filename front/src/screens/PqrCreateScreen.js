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
import { usePqr } from '../context/PqrContext';
import { PQR_TYPES } from '../services/pqrConstants';

export default function PqrCreateScreen({ navigation }) {
  const { createTicket } = usePqr();
  const [type, setType] = useState('peticion');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!subject.trim()) {
      Alert.alert('Datos incompletos', 'Escribe el asunto de tu solicitud.');
      return;
    }
    if (description.trim().length < 15) {
      Alert.alert('Datos incompletos', 'Describe tu caso con al menos 15 caracteres.');
      return;
    }

    const ticket = createTicket({ type, subject, description });
    Alert.alert(
      'Solicitud enviada',
      'Tu PQR fue radicada. Aparecerá en inicio como esperando respuesta.',
      [{ text: 'OK', onPress: () => navigation.replace('PqrDetail', { ticketId: ticket.id }) }],
    );
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
            <Text style={styles.headerTitle}>Nueva PQR</Text>
            <View style={styles.headerSpacer} />
          </View>
        </SafeAreaView>

        <View style={styles.contentContainer}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.typeRow}>
              {Object.values(PQR_TYPES).map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.typeChip, type === t.id && styles.typeChipActive]}
                  onPress={() => setType(t.id)}
                >
                  <Text style={[styles.typeChipText, type === t.id && styles.typeChipTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Asunto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Solicitud de documentos"
              placeholderTextColor="#999"
              value={subject}
              onChangeText={setSubject}
              maxLength={80}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Cuéntanos tu caso..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={500}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Enviar solicitud</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  headerSpacer: { width: 34 },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 24,
    paddingTop: 28,
  },
  label: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.darkmodeGreenBlack,
    marginBottom: 10,
    marginTop: 8,
  },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  typeChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.mainGreen,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundGreenWhite,
  },
  typeChipActive: { backgroundColor: COLORS.mainGreen },
  typeChipText: { fontSize: 12, fontWeight: '700', color: COLORS.lettersAndIcons },
  typeChipTextActive: { color: COLORS.darkmodeGreenBlack },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.mainGreen,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.darkmodeGreenBlack,
    marginBottom: 8,
  },
  textArea: { minHeight: 120 },
  submitButton: {
    backgroundColor: COLORS.mainGreen,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
    alignSelf: 'center',
    width: '75%',
  },
  submitButtonText: {
    ...TYPOGRAPHY.subtitle,
    fontWeight: '800',
    color: COLORS.darkmodeGreenBlack,
  },
});
