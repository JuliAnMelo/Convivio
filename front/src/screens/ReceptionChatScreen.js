import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';
import { useReceptionChat } from '../context/ReceptionChatContext';

const GUARD_AVATAR = require('../../assets/Images/guardia.webp');

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export default function ReceptionChatScreen({ navigation }) {
  const { messages, isTyping: typing, sendMessage, setChatIsOpen } = useReceptionChat();
  const { colors, st, fw, minTarget } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const [typingDots, setTypingDots] = useState('');
  const scrollRef = useRef(null);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 8,
      marginBottom: 8,
    },
    backButton: {
      padding: 5,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: {
      color: '#FFF',
      fontSize: st(19),
      fontWeight: fw('800'),
      textAlign: 'center',
    },
    headerSub: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: st(12),
      marginTop: 2,
      fontWeight: fw('600'),
    },
    headerIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: 'rgba(255,255,255,0.18)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    notice: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 10,
    },
    noticeText: {
      color: colors.textSoft,
      fontSize: st(12),
      fontWeight: fw('600'),
      marginLeft: 6,
    },
    chatContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
    },
    chatScroll: { flex: 1 },
    chatContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 16,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 12 + Math.max(insets.bottom, 8),
      borderTopWidth: 1,
      borderTopColor: colors.separator,
      backgroundColor: colors.card,
    },
    input: {
      flex: 1,
      minHeight: 42,
      maxHeight: 110,
      backgroundColor: colors.backgroundGreenWhite,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingTop: 10,
      paddingBottom: 10,
      fontSize: st(13),
      color: colors.lettersAndIcons,
    },
    sendButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: colors.oceanBlueButton,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    sendButtonDisabled: {
      backgroundColor: colors.textSoft,
    },
    bubbleRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 12,
    },
    bubbleRowGuard: { justifyContent: 'flex-start' },
    bubbleRowResident: { justifyContent: 'flex-end' },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 12,
      marginRight: 8,
      backgroundColor: colors.lightGreen,
    },
    selfAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.mainGreen,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    bubble: {
      maxWidth: '72%',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    bubbleGuard: {
      backgroundColor: colors.backgroundGreenWhite,
      borderWidth: 1,
      borderColor: colors.lightGreen,
    },
    bubbleResident: {
      backgroundColor: colors.oceanBlueButton,
    },
    bubbleText: {
      fontSize: st(13),
      color: colors.lettersAndIcons,
      lineHeight: st(18),
    },
    bubbleTextResident: { color: '#FFF' },
    bubbleTime: {
      fontSize: st(10),
      color: colors.textSoft,
      marginTop: 6,
      textAlign: 'right',
    },
    bubbleTimeResident: { color: 'rgba(255,255,255,0.75)' },
    typingText: {
      fontSize: st(12),
      color: colors.textSoft,
    },
  }), [colors, st, fw, minTarget, insets.bottom]);

  const ChatBubble = ({ message }) => {
    const isResident = message.sender === 'resident';

    return (
      <View style={[styles.bubbleRow, isResident ? styles.bubbleRowResident : styles.bubbleRowGuard]}>
        {!isResident && (
          <Image source={GUARD_AVATAR} style={styles.avatar} contentFit="cover" />
        )}
        <View style={[styles.bubble, isResident ? styles.bubbleResident : styles.bubbleGuard]}>
          <Text style={[styles.bubbleText, isResident && styles.bubbleTextResident]}>
            {message.text}
          </Text>
          <Text style={[styles.bubbleTime, isResident && styles.bubbleTimeResident]}>
            {formatTime(message.at)}
          </Text>
        </View>
        {isResident && (
          <View style={styles.selfAvatar}>
            <Ionicons name="person" size={16} color="#FFF" />
          </View>
        )}
      </View>
    );
  };

  const TypingBubble = ({ dots }) => (
    <View style={[styles.bubbleRow, styles.bubbleRowGuard]}>
      <Image source={GUARD_AVATAR} style={styles.avatar} contentFit="cover" />
      <View style={[styles.bubble, styles.bubbleGuard]}>
        <Text style={styles.typingText}>Celador esta escribiendo{dots}</Text>
      </View>
    </View>
  );

  useEffect(() => {
    setChatIsOpen(true);
    return () => setChatIsOpen(false);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  useEffect(() => {
    if (!typing) {
      setTypingDots('');
      return;
    }
    const frames = ['.', '..', '...'];
    let index = 0;
    setTypingDots(frames[index]);
    const id = setInterval(() => {
      index = (index + 1) % frames.length;
      setTypingDots(frames[index]);
    }, 450);
    return () => clearInterval(id);
  }, [typing]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    sendMessage(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Chat con celadores</Text>
          <Text style={styles.headerSub}>{typing ? 'Escribiendo...' : 'En linea'}</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="shield-checkmark" size={18} color="#FFF" />
        </View>
      </View>

      <View style={styles.notice}>
        <Ionicons name="time" size={14} color={colors.textSoft} />
        <Text style={styles.noticeText}>Se espera respuesta pronto de parte de recepción.</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {typing ? <TypingBubble dots={typingDots} /> : null}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.textSoft}
            value={draft}
            onChangeText={setDraft}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!draft.trim()}
          >
            <Ionicons name="send" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
