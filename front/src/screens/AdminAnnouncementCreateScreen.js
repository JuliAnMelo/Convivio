import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useAppTheme } from '../theme';
import { createAnnouncement } from '../services/bookingService';
import IconVector from '../components/IconVector';

const TAGS = ['Para: Todos', 'Para: Residentes', 'Para: Guardas', 'Urgente'];

// Same grouping residents see when browsing announcements (AnnouncementsScreen) —
// picking one here saves the announcement directly into that section for them.
const CATEGORIES = [
  { key: 'reuniones', label: 'Reuniones' },
  { key: 'eventos',   label: 'Eventos'   },
  { key: 'pagos',     label: 'Pagos'     },
];

// Library the admin can pick from to choose the "vector" assigned to the announcement —
// a mix of Ionicons glyphs and plain emoji characters, rendered the same way via IconVector.
const ICON_LIBRARY = [
  'megaphone-outline', 'calendar-outline', 'cash-outline', 'construct-outline',
  'warning-outline', 'water-outline', 'gift-outline', 'paw-outline',
  'leaf-outline', 'shield-checkmark-outline', 'people-outline', 'home-outline',
  'information-circle-outline', 'trash-outline', 'musical-notes-outline', 'car-outline',
  '📢', '💧', '🎉', '💰', '🛠️', '⚠️', '🔑', '🏠', '🐾', '📅', 'ℹ️', '🧹', '🌿', '🚗', '🛡️', '🎵',
];

const ATTACH_OPTIONS = [
  { key: 'image',    icon: 'image-outline',        label: 'Imagen'    },
  { key: 'video',    icon: 'videocam-outline',      label: 'Video'     },
  { key: 'document', icon: 'document-text-outline', label: 'Documento' },
];

function FileIcon({ mimeType, style }) {
  if (!mimeType) return <Ionicons name="document-outline" size={28} color="#FFF" style={style} />;
  if (mimeType.includes('pdf'))   return <Ionicons name="document-text-outline" size={28} color="#FFF" style={style} />;
  if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('xlsx'))
    return <Ionicons name="grid-outline" size={28} color="#FFF" style={style} />;
  if (mimeType.includes('word') || mimeType.includes('doc'))
    return <Ionicons name="document-outline" size={28} color="#FFF" style={style} />;
  return <Ionicons name="attach-outline" size={28} color="#FFF" style={style} />;
}

export default function AdminAnnouncementCreateScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTag, setSelectedTag] = useState('Para: Todos');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].key);
  const [selectedIcon, setSelectedIcon] = useState(ICON_LIBRARY[0]);
  const [attachment, setAttachment] = useState(null); // { type, uri, name, mimeType }
  const { colors, typography, st, fw, minTarget } = useAppTheme();

  const handlePickAttachment = async (type) => {
    if (type === 'image') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.'); return; }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], allowsEditing: true, quality: 0.85,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        setAttachment({ type: 'image', uri: asset.uri, name: asset.fileName || 'imagen.jpg', mimeType: 'image/jpeg' });
      }
    } else if (type === 'video') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.'); return; }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        setAttachment({ type: 'video', uri: asset.uri, name: asset.fileName || 'video.mp4', mimeType: 'video/mp4' });
      }
    } else {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        const doc = result.assets[0];
        setAttachment({ type: 'document', uri: doc.uri, name: doc.name, mimeType: doc.mimeType || 'application/octet-stream' });
      }
    }
  };

  const handlePublish = () => {
    if (!title.trim()) { Alert.alert('Error', 'El título es obligatorio'); return; }
    createAnnouncement({ title, description, tag: selectedTag, category: selectedCategory, attachment, icon: selectedIcon });
    Alert.alert(
      'Anuncio Publicado',
      'El anuncio fue publicado y ya está visible para todos los residentes.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingTop: 12, marginBottom: 8,
    },
    backButton: {
      padding: 5, minWidth: minTarget, minHeight: minTarget,
      justifyContent: 'center', alignItems: 'center',
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { color: '#FFF', fontSize: st(20), fontWeight: fw('800') },
    headerSpacer: { width: 44 },
    body: {
      flex: 1, backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 35, borderTopRightRadius: 35,
      paddingHorizontal: 24, paddingTop: 28,
    },
    label: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      marginBottom: 6, marginLeft: 15, fontSize: st(13),
    },
    inputContainer: {
      backgroundColor: colors.lightGreen, borderRadius: 20,
      paddingHorizontal: 20, paddingVertical: 12,
      minHeight: minTarget, justifyContent: 'center', marginBottom: 18,
    },
    input: { ...typography.paragraph, color: colors.lettersAndIcons, fontSize: st(15) },
    textArea: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(14), minHeight: 100, textAlignVertical: 'top',
    },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20, paddingLeft: 4 },
    tagBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.lightGreen },
    tagBtnActive: { backgroundColor: colors.mainGreen },
    tagBtnText: { ...typography.paragraph, color: colors.lettersAndIcons, fontSize: st(12) },
    tagBtnTextActive: { color: colors.darkmodeGreenBlack, fontWeight: fw('700') },

    // Icon/emoji library picker — the "vector" assigned to the announcement
    iconLibraryRow: { flexDirection: 'row', gap: 10, paddingVertical: 2, paddingRight: 16, marginBottom: 20 },
    iconOption: {
      width: 48, height: 48, borderRadius: 24,
      backgroundColor: colors.lightGreen,
      justifyContent: 'center', alignItems: 'center',
    },
    iconOptionActive: { backgroundColor: colors.mainGreen },

    // Attachment section
    attachLabel: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      marginBottom: 10, marginLeft: 15, fontSize: st(13),
    },
    attachRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    attachBtn: {
      flex: 1, backgroundColor: colors.lightGreen, borderRadius: 16,
      paddingVertical: 14, alignItems: 'center', gap: 6,
    },
    attachBtnText: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(11), fontWeight: fw('600'),
    },
    attachPreview: {
      backgroundColor: colors.lightGreen, borderRadius: 16,
      marginBottom: 20, overflow: 'hidden',
    },
    attachPreviewHeader: {
      flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10,
    },
    attachIconWrap: {
      width: 44, height: 44, borderRadius: 12,
      justifyContent: 'center', alignItems: 'center',
      backgroundColor: colors.mainGreen,
    },
    attachPreviewName: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(13), fontWeight: fw('600'), flex: 1,
    },
    attachPreviewType: {
      ...typography.paragraph, color: colors.lettersAndIcons,
      fontSize: st(11), opacity: 0.6,
    },
    attachRemoveBtn: { padding: 8 },
    attachImagePreview: { width: '100%', height: 160 },

    publishButton: {
      backgroundColor: colors.mainGreen, borderRadius: 25,
      paddingVertical: 14, alignItems: 'center',
      minHeight: minTarget, justifyContent: 'center',
      marginTop: 4, marginBottom: 24,
    },
    publishButtonText: {
      ...typography.subtitle, color: colors.darkmodeGreenBlack,
      fontWeight: fw('700'), fontSize: st(16),
    },
  }), [colors, typography, st, fw, minTarget]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Nuevo Anuncio</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.body}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Título del Anuncio *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ej: Corte de agua programado"
                placeholderTextColor="rgba(9,48,48,0.4)"
                value={title}
                onChangeText={setTitle}
                maxLength={80}
                autoFocus
              />
            </View>

            <Text style={styles.label}>Descripción</Text>
            <View style={[styles.inputContainer, { minHeight: 120, justifyContent: 'flex-start', paddingVertical: 14 }]}>
              <TextInput
                style={styles.textArea}
                placeholder="Describe el anuncio con más detalle..."
                placeholderTextColor="rgba(9,48,48,0.4)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                maxLength={500}
              />
            </View>

            <Text style={styles.label}>Destinatario</Text>
            <View style={styles.tagsRow}>
              {TAGS.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagBtn, selectedTag === tag && styles.tagBtnActive]}
                  onPress={() => setSelectedTag(tag)}
                >
                  <Text style={[styles.tagBtnText, selectedTag === tag && styles.tagBtnTextActive]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Categoría</Text>
            <View style={styles.tagsRow}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.tagBtn, selectedCategory === cat.key && styles.tagBtnActive]}
                  onPress={() => setSelectedCategory(cat.key)}
                >
                  <Text style={[styles.tagBtnText, selectedCategory === cat.key && styles.tagBtnTextActive]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Ícono del anuncio</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.iconLibraryRow}
            >
              {ICON_LIBRARY.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.iconOption, selectedIcon === opt && styles.iconOptionActive]}
                  onPress={() => setSelectedIcon(opt)}
                  activeOpacity={0.8}
                >
                  <IconVector
                    icon={opt}
                    size={22}
                    color={selectedIcon === opt ? colors.darkmodeGreenBlack : colors.mainGreen}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Attachment */}
            <Text style={styles.attachLabel}>Adjuntar archivo (opcional)</Text>

            {attachment ? (
              <View style={styles.attachPreview}>
                {attachment.type === 'image' && (
                  <Image source={{ uri: attachment.uri }} style={styles.attachImagePreview} contentFit="cover" />
                )}
                <View style={styles.attachPreviewHeader}>
                  <View style={styles.attachIconWrap}>
                    {attachment.type === 'video' ? (
                      <Ionicons name="videocam" size={22} color="#FFF" />
                    ) : (
                      <FileIcon mimeType={attachment.mimeType} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.attachPreviewName} numberOfLines={1}>{attachment.name}</Text>
                    <Text style={styles.attachPreviewType}>{attachment.type.toUpperCase()}</Text>
                  </View>
                  <TouchableOpacity style={styles.attachRemoveBtn} onPress={() => setAttachment(null)}>
                    <Ionicons name="close-circle" size={22} color={colors.errorRed} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.attachRow}>
                {ATTACH_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt.key}
                    style={styles.attachBtn}
                    onPress={() => handlePickAttachment(opt.key)}
                  >
                    <Ionicons name={opt.icon} size={26} color={colors.mainGreen} />
                    <Text style={styles.attachBtnText}>{opt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
              <Text style={styles.publishButtonText}>Publicar Anuncio</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
