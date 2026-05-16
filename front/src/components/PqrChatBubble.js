import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

const RESIDENT_AVATAR =
  'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=120&q=80';

function formatMessageTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PqrChatBubble({ message }) {
  const isResident = message.sender === 'resident';

  return (
    <View style={[styles.row, isResident ? styles.rowResident : styles.rowAdmin]}>
      {!isResident && (
        <View style={[styles.avatar, styles.avatarAdmin]}>
          <Ionicons name="business" size={20} color="#FFF" />
        </View>
      )}

      <View style={[styles.bubble, isResident ? styles.bubbleResident : styles.bubbleAdmin]}>
        <Text style={[styles.name, isResident && styles.nameResident]}>{message.name}</Text>
        {message.subject ? (
          <Text style={[styles.subject, isResident && styles.subjectResident]}>
            {message.subject}
          </Text>
        ) : null}
        <Text style={[styles.text, isResident && styles.textResident]}>{message.text}</Text>
        <Text style={[styles.time, isResident && styles.timeResident]}>
          {formatMessageTime(message.at)}
        </Text>
      </View>

      {isResident && (
        <Image source={{ uri: RESIDENT_AVATAR }} style={styles.avatarPhoto} contentFit="cover" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  rowResident: { justifyContent: 'flex-end' },
  rowAdmin: { justifyContent: 'flex-start' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarAdmin: { backgroundColor: COLORS.oceanBlueButton },
  avatarPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
    backgroundColor: COLORS.lightGreen,
  },
  bubble: {
    maxWidth: '72%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleResident: {
    backgroundColor: COLORS.mainGreen,
    borderBottomRightRadius: 4,
  },
  bubbleAdmin: {
    backgroundColor: COLORS.backgroundGreenWhite,
    borderWidth: 1,
    borderColor: COLORS.lightGreen,
    borderBottomLeftRadius: 4,
  },
  name: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.oceanBlueButton,
    marginBottom: 4,
  },
  nameResident: { color: COLORS.darkmodeGreenBlack },
  subject: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkmodeGreenBlack,
    marginBottom: 4,
  },
  subjectResident: { color: COLORS.darkmodeGreenBlack },
  text: {
    fontSize: 14,
    color: COLORS.lettersAndIcons,
    lineHeight: 20,
  },
  textResident: { color: COLORS.darkmodeGreenBlack },
  time: {
    fontSize: 10,
    color: '#888',
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  timeResident: { color: 'rgba(3, 19, 20, 0.55)' },
});
