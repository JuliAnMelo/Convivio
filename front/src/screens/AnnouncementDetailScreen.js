import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useAppTheme } from '../theme';
import IconVector from '../components/IconVector';

function VideoAttachment({ uri, name, style }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });

  return (
    <View style={[style, { overflow: 'hidden', backgroundColor: '#000' }]}>
      <VideoView
        style={{ width: '100%', height: '100%' }}
        player={player}
        nativeControls
        allowsFullscreen
        contentFit="contain"
      />
      {!!name && (
        <View style={videoStyles.label}>
          <Text style={videoStyles.labelText} numberOfLines={1}>{name}</Text>
        </View>
      )}
    </View>
  );
}

const videoStyles = StyleSheet.create({
  label: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: '70%',
  },
  labelText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
});

export default function AnnouncementDetailScreen({ navigation, route }) {
  const { item } = route.params || {};
  const { colors, typography, st, fw, minTarget } = useAppTheme();
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    contentWrap: {
      flex: 1,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      marginTop: 40,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16,
    },
    back: {
      position: 'absolute',
      left: 10,
      padding: 10,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backText: { fontSize: st(24), color: colors.mainGreen },
    titleScreen: {
      ...typography.subtitle,
      fontSize: st(20),
      fontWeight: fw('800'),
      color: colors.lettersAndIcons,
    },
    list: { paddingBottom: 24 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    image: {
      width: '100%',
      height: 150,
      marginBottom: 20,
      backgroundColor: colors.lightGreen,
      borderRadius: 15,
    },
    placeholderImage: {
      width: '100%',
      height: 150,
      marginBottom: 20,
      backgroundColor: colors.lightGreen,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      color: colors.lettersAndIcons,
      opacity: 0.5,
    },
    tag: {
      fontSize: st(14),
      fontWeight: fw('700'),
      color: colors.blueButton,
      marginBottom: 8,
    },
    title: {
      fontSize: st(22),
      fontWeight: fw('700'),
      color: colors.lettersAndIcons,
      marginBottom: 10,
    },
    date: {
      fontSize: st(14),
      color: colors.textSoft,
      marginBottom: 20,
    },
    summaryTitle: {
      fontSize: st(18),
      fontWeight: fw('600'),
      color: colors.darkmodeGreenBlack,
      marginBottom: 10,
    },
    summaryText: {
      fontSize: st(15),
      color: colors.lettersAndIcons,
      lineHeight: st(22),
    },
    empty: { textAlign: 'center', marginTop: 40, color: colors.lettersAndIcons },
  }), [colors, typography, st, fw, minTarget]);

  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.titleScreen}>Detalle del Anuncio</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {item ? (
            <View style={styles.card}>
              {/* Dependiendo del icono o tipo, podemos mostrar una imagen representativa. 
                  (Mencionaste imágenes de "cortes de agua", etc). */}
              {/* Media section */}
              {item.attachment?.type === 'image' || item.image ? (
                <Image
                  source={item.attachment?.type === 'image' ? { uri: item.attachment.uri } : item.image}
                  style={styles.image}
                  contentFit="cover"
                />
              ) : item.attachment?.type === 'video' ? (
                <VideoAttachment
                  uri={item.attachment.uri}
                  name={item.attachment.name}
                  style={[styles.placeholderImage, { height: 200 }]}
                />
              ) : item.attachment?.type === 'document' ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('PdfViewer', {
                    title: item.attachment.name || 'Documento',
                    source: item.attachment.uri,
                  })}
                  style={[styles.placeholderImage, { backgroundColor: '#FF9F4318', borderWidth: 1, borderColor: '#FF9F4350' }]}
                >
                  <Ionicons name="document-text" size={44} color="#FF9F43" />
                  <Text style={[styles.placeholderText, { color: '#FF9F43', marginTop: 8, fontWeight: '700', fontSize: 13, textAlign: 'center', paddingHorizontal: 16 }]} numberOfLines={2}>
                    {item.attachment.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#FF9F43', opacity: 0.6, marginTop: 4 }}>
                    {item.attachment.mimeType?.split('/')[1]?.toUpperCase() || 'DOCUMENTO'}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 4 }}>
                    <Ionicons name="open-outline" size={14} color="#FF9F43" />
                    <Text style={{ fontSize: 12, color: '#FF9F43', fontWeight: '600' }}>Toca para abrir</Text>
                  </View>
                </TouchableOpacity>
              ) : item.icon === 'water' ? (
                <Image
                  source={require('../../assets/Images/cortes de agua.jpg')}
                  style={styles.image}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <IconVector icon={item.icon} size={36} color={colors.mainGreen} />
                </View>
              )}

              <Text style={styles.tag}>{item.tag || 'Anuncio'}</Text>
              <Text style={styles.title}>{item.title}</Text>
              
              <Text style={styles.date}>
                Publicado: {item.month} {item.day} a las {item.time}
              </Text>

              <Text style={styles.summaryTitle}>Resumen:</Text>
              <Text style={styles.summaryText}>
                {item.subtitle || 'Este anuncio no tiene información extendida.'}
                {'\n\n'}
                {/* Puedes conectar item.description si existe en los servicios en el futuro */}
                Para más detalles, ponte en contacto con la administración.
              </Text>
            </View>
          ) : (
            <Text style={styles.empty}>Detalles del anuncio no encontrados</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}