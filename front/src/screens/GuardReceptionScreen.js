import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useReceptionChat } from '../context/ReceptionChatContext';

const FALLBACK_AVATAR = require('../../assets/Images/residente.jpg');

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function MessageBubble({ msg, residentAvatar }) {
  // From guard's POV: resident messages on left, guard messages on right
  const isGuardMsg = msg.sender === 'admin';
  const { colors, typography, st, fw } = useAppTheme();

  const s = useMemo(() => StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: isGuardMsg ? 'flex-end' : 'flex-start',
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    bubble: {
      maxWidth: '74%',
      backgroundColor: isGuardMsg ? colors.mainGreen : colors.lightGreen,
      borderRadius: 18,
      borderBottomRightRadius: isGuardMsg ? 4 : 18,
      borderBottomLeftRadius: isGuardMsg ? 18 : 4,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    senderName: {
      ...typography.paragraph,
      color: isGuardMsg ? '#FFF' : colors.lettersAndIcons,
      fontSize: st(11),
      fontWeight: fw('700'),
      marginBottom: 3,
      opacity: 0.7,
    },
    text: {
      ...typography.paragraph,
      color: isGuardMsg ? '#FFF' : colors.lettersAndIcons,
      fontSize: st(14),
      lineHeight: 20,
    },
    time: {
      ...typography.paragraph,
      color: isGuardMsg ? '#FFF' : colors.lettersAndIcons,
      fontSize: st(10),
      opacity: 0.55,
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    avatarWrap: {
      width: 32, height: 32, borderRadius: 16,
      overflow: 'hidden', marginRight: 8, alignSelf: 'flex-end',
    },
  }), [colors, typography, st, fw, isGuardMsg]);

  return (
    <View style={s.row}>
      {!isGuardMsg && (
        <View style={s.avatarWrap}>
          <Image source={residentAvatar || FALLBACK_AVATAR} style={{ width: 32, height: 32 }} contentFit="cover" />
        </View>
      )}
      <View style={s.bubble}>
        <Text style={s.senderName}>{msg.name}</Text>
        <Text style={s.text}>{msg.text}</Text>
        <Text style={s.time}>{formatTime(msg.at)}</Text>
      </View>
    </View>
  );
}

export default function GuardReceptionScreen({ navigation, route }) {
  const { threads, typingThreadId, sendGuardMessage, setGuardChatIsOpen } = useReceptionChat();
  const { colors, typography, st, fw, minTarget } = useAppTheme();
  const [text, setText] = useState('');
  const scrollRef = useRef(null);

  const threadId = route?.params?.threadId || threads[0]?.id;
  const thread = threads.find((t) => t.id === threadId) || threads[0];
  const messages = thread?.messages || [];
  const isTyping = typingThreadId === threadId;

  useEffect(() => {
    setGuardChatIsOpen(threadId, true);
    return () => setGuardChatIsOpen(threadId, false);
  }, [threadId]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages.length, isTyping]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendGuardMessage(threadId, text);
    setText('');
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingTop: 12, marginBottom: 8,
    },
    backBtn: {
      padding: 5, minWidth: minTarget, minHeight: minTarget,
      justifyContent: 'center', alignItems: 'center',
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { color: '#FFF', fontSize: st(19), fontWeight: fw('800') },
    headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: st(12), marginTop: 2 },
    headerSpacer: { width: 44 },
    chatContainer: {
      flex: 1,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      paddingTop: 16,
    },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 12 },
    typingRow: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 20, paddingVertical: 8, gap: 8,
    },
    typingDot: {
      ...typography.paragraph,
      color: colors.lettersAndIcons, fontSize: st(12), opacity: 0.6,
    },
    inputRow: {
      flexDirection: 'row', alignItems: 'flex-end',
      paddingHorizontal: 16, paddingVertical: 10,
      borderTopWidth: 1, borderTopColor: colors.lightGreen,
      backgroundColor: colors.backgroundGreenWhite,
      gap: 10,
    },
    input: {
      flex: 1,
      backgroundColor: colors.lightGreen,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 10,
      minHeight: minTarget,
      maxHeight: 100,
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(14),
      textAlignVertical: 'top',
    },
    sendBtn: {
      width: 44, height: 44,
      borderRadius: 22,
      backgroundColor: colors.mainGreen,
      justifyContent: 'center', alignItems: 'center',
    },
    sendBtnDisabled: { backgroundColor: colors.lightGreen },
  }), [colors, typography, st, fw, minTarget]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{thread?.residentName || 'Residente'}</Text>
              <Text style={styles.headerSub}>{thread?.residentApt || 'Portería · Recepción'}</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>
        </SafeAreaView>

        <View style={styles.chatContainer}>
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} residentAvatar={thread?.avatar} />
            ))}
            {isTyping && (
              <View style={styles.typingRow}>
                <View style={[styles.sendBtn, { backgroundColor: colors.lightGreen, width: 32, height: 32, borderRadius: 16, overflow: 'hidden' }]}>
                  <Image source={thread?.avatar || FALLBACK_AVATAR} style={{ width: 32, height: 32 }} contentFit="cover" />
                </View>
                <Text style={styles.typingDot}>{(thread?.residentName || 'Residente') + ' está escribiendo...'}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Responder al residente..."
              placeholderTextColor="rgba(9,48,48,0.4)"
              value={text}
              onChangeText={setText}
              multiline
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!text.trim()}
            >
              <Ionicons name="send" size={18} color={text.trim() ? colors.darkmodeGreenBlack : colors.lettersAndIcons} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
