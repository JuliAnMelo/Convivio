import React, { useMemo, useState } from 'react';
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
import { usePqr } from '../context/PqrContext';
import { PQR_TYPES } from '../services/pqrConstants';

export default function PqrCreateScreen({ navigation }) {
  const { createTicket } = usePqr();
  const [type, setType] = useState('peticion');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const { colors, typography, st, fw, minTarget } = useAppTheme();

  const styles = useMemo(() => StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: colors.mainGreen },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 10,
    },
    backButton: {
      padding: 5,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: { fontSize: st(20), fontWeight: fw('700'), color: '#FFF' },
    headerSpacer: { width: 34 },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      padding: 24,
      paddingTop: 28,
    },
    label: {
      ...typography.subtitle,
      fontSize: st(15),
      fontWeight: fw('700'),
      color: colors.darkmodeGreenBlack,
      marginBottom: 10,
      marginTop: 8,
    },
    typeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    typeChip: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.mainGreen,
      alignItems: 'center',
      backgroundColor: colors.backgroundGreenWhite,
      minHeight: minTarget,
      justifyContent: 'center',
    },
    typeChipActive: { backgroundColor: colors.mainGreen },
    typeChipText: { fontSize: st(12), fontWeight: fw('700'), color: colors.lettersAndIcons },
    typeChipTextActive: { color: colors.darkmodeGreenBlack },
    input: {
      borderWidth: 1.5,
      borderColor: colors.mainGreen,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: st(14),
      color: colors.darkmodeGreenBlack,
      marginBottom: 8,
      minHeight: minTarget,
    },
    textArea: { minHeight: 120 },
    submitButton: {
      backgroundColor: colors.mainGreen,
      paddingVertical: 16,
      borderRadius: 28,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 24,
      alignSelf: 'center',
      width: '75%',
      minHeight: minTarget,
      justifyContent: 'center',
    },
    submitButtonText: {
      ...typography.subtitle,
      fontWeight: fw('800'),
      color: colors.darkmodeGreenBlack,
    },
  }), [colors, typography, st, fw, minTarget]);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Datos incompletos', 'Escribe el asunto de tu solicitud.');
      return;
    }
    if (description.trim().length < 15) {
      Alert.alert('Datos incompletos', 'Describe tu caso con al menos 15 caracteres.');
      return;
    }

    setSubmitting(true);
    try {
      await createTicket({ type, subject, description });
      Alert.alert(
        'Solicitud enviada',
        'Tu PQR fue radicada correctamente.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (e) {
      Alert.alert('Error', 'No se pudo enviar la solicitud. Verifica tu conexión.');
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
              placeholderTextColor={colors.textSoft}
              value={subject}
              onChangeText={setSubject}
              maxLength={80}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Cuéntanos tu caso..."
              placeholderTextColor={colors.textSoft}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={500}
            />

            <TouchableOpacity
              style={[styles.submitButton, submitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Enviando...' : 'Enviar solicitud'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
