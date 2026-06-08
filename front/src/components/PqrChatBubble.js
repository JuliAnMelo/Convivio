import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';

const RESIDENT_AVATAR = require('../../assets/Images/residente.jpg');

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
  const { user } = useContext(AuthContext);
  const { colors, st, fw } = useAppTheme();
  // For guards mainGreen renders as dark navy, so resident bubbles need light text instead of dark
  const residentTextColor = user?.role === 'guarda' ? '#FFF' : colors.darkmodeGreenBlack;
  const styles = useMemo(() => StyleSheet.create({
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
    avatarAdmin: { backgroundColor: colors.oceanBlueButton },
    avatarPhoto: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginLeft: 8,
      backgroundColor: colors.lightGreen,
    },
    bubble: {
      maxWidth: '72%',
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    bubbleResident: {
      backgroundColor: colors.mainGreen,
      borderBottomRightRadius: 4,
    },
    bubbleAdmin: {
      backgroundColor: colors.backgroundGreenWhite,
      borderWidth: 1,
      borderColor: colors.lightGreen,
      borderBottomLeftRadius: 4,
    },
    name: {
      fontSize: st(11),
      fontWeight: fw('800'),
      color: colors.oceanBlueButton,
      marginBottom: 4,
    },
    nameResident: { color: residentTextColor },
    subject: {
      fontSize: st(13),
      fontWeight: fw('700'),
      color: colors.darkmodeGreenBlack,
      marginBottom: 4,
    },
    subjectResident: { color: residentTextColor },
    text: {
      fontSize: st(14),
      color: colors.lettersAndIcons,
      lineHeight: st(20),
    },
    textResident: { color: residentTextColor },
    time: {
      fontSize: st(10),
      color: colors.textSoft,
      marginTop: 6,
      alignSelf: 'flex-end',
    },
    timeResident: { color: colors.textSoft },
  }), [colors, st, fw, residentTextColor]);

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

