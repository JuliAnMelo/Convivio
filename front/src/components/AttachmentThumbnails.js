import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

// Real first-frame preview of a video attachment (paused, no controls — acts as a thumbnail)
export function VideoThumbnail({ uri, style }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.muted = true;
  });
  return (
    <VideoView
      style={style}
      player={player}
      nativeControls={false}
      allowsFullscreen={false}
      contentFit="cover"
    />
  );
}

function docColors(mimeType) {
  const m = (mimeType || '').toLowerCase();
  if (m.includes('pdf')) return { bg: '#FF6B5B', label: 'PDF' };
  if (m.includes('sheet') || m.includes('excel') || m.includes('xlsx')) return { bg: '#3FAE6B', label: 'XLS' };
  if (m.includes('word') || m.includes('doc')) return { bg: '#5B8DEF', label: 'DOC' };
  return { bg: '#FF9F43', label: 'DOC' };
}

// Stylized "document page" preview, since rendering a real PDF page requires a native dependency
export function DocumentThumbnail({ mimeType, style }) {
  const { bg, label } = docColors(mimeType);
  return (
    <View style={[style, docStyles.wrap]}>
      <View style={docStyles.page}>
        <View style={[docStyles.pageLine, { width: '70%' }]} />
        <View style={[docStyles.pageLine, { width: '90%' }]} />
        <View style={[docStyles.pageLine, { width: '55%' }]} />
        <View style={[docStyles.pageBadge, { backgroundColor: bg }]}>
          <Text style={docStyles.pageBadgeText}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const docStyles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E7EEF1',
  },
  page: {
    width: 56,
    height: 72,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingTop: 10,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  pageLine: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D7E1E5',
  },
  pageBadge: {
    position: 'absolute',
    bottom: -6,
    right: -10,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  pageBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
