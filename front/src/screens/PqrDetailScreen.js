import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { usePqr } from '../context/PqrContext';
import { useNotifications } from '../context/NotificationsContext';
import { AuthContext } from '../context/AuthContext';
import { PQR_TYPES } from '../services/pqrConstants';
import PqrChatBubble from '../components/PqrChatBubble';

export default function PqrDetailScreen({ navigation, route }) {
  const { getTicketById, getChatMessages, respondToTicket } = usePqr();
  const { markAsRead } = useNotifications();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef(null);
  const ticket = getTicketById(route.params?.ticketId);
  const { colors, typography, st, fw, minTarget } = useAppTheme();
  const [adminReply, setAdminReply] = useState('');
  const [sending, setSending] = useState(false);

  const isAdmin = user?.role === 'administrador';

  useEffect(() => {
    if (ticket) {
      markAsRead(`ann-pqr-${ticket.id}`);
    }
  }, [ticket?.id, markAsRead]);
  const messages = ticket ? getChatMessages(ticket) : [];

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  if (!ticket) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Solicitud no encontrada</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.notFoundLink}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const type = PQR_TYPES[ticket.type];
  const isWaiting = ticket.status === 'esperando';

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
    headerSpacer: { width: 34 },
    chatContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      paddingTop: 16,
    },
    statusText: {
      textAlign: 'center',
      fontSize: st(12),
      fontWeight: fw('700'),
      marginBottom: 12,
      paddingHorizontal: 20,
    },
    statusWaiting: { color: '#C87D0A' },
    statusDone: { color: colors.mainGreen },
    chatScroll: { flex: 1 },
    chatContent: { paddingHorizontal: 16, paddingBottom: 12 },
    hint: {
      textAlign: 'center',
      fontSize: st(12),
      color: colors.textSoft,
      marginTop: 8,
      ...typography.paragraph,
    },
    replyBar: {
      borderTopWidth: 1,
      borderTopColor: colors.lightGreen,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.backgroundGreenWhite,
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 10,
    },
    replyInput: {
      flex: 1,
      backgroundColor: colors.lightGreen,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      minHeight: minTarget,
      maxHeight: 120,
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(14),
      textAlignVertical: 'top',
    },
    sendButton: {
      backgroundColor: colors.mainGreen,
      borderRadius: 22,
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: { backgroundColor: colors.lightGreen },
    notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    notFoundText: { fontSize: st(16), color: colors.textSoft },
    notFoundLink: { marginTop: 12, color: colors.mainGreen, fontWeight: fw('700') },
  }), [colors, typography, st, fw, minTarget]);

  const handleSendReply = () => {
    if (!adminReply.trim()) return;
    setSending(true);
    const ok = respondToTicket(ticket.id, adminReply.trim());
    setSending(false);
    if (ok) {
      setAdminReply('');
    } else {
      Alert.alert('Error', 'No se pudo enviar la respuesta');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.container, { flex: 1 }]}>
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle} numberOfLines={1}>{ticket.subject}</Text>
              <Text style={styles.headerSub}>{type?.label} · {ticket.code}</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>
        </SafeAreaView>

        <View style={styles.chatContainer}>
          <Text style={[styles.statusText, isWaiting ? styles.statusWaiting : styles.statusDone]}>
            {isWaiting ? 'Esperando respuesta' : 'Respondido por administración'}
          </Text>

          <ScrollView
            ref={scrollRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <PqrChatBubble key={msg.id} message={msg} />
            ))}
            {isWaiting && !isAdmin && (
              <Text style={styles.hint}>
                Cuando administración responda, verás el mensaje aquí.
              </Text>
            )}
            {isWaiting && isAdmin && (
              <Text style={styles.hint}>
                Escribe tu respuesta abajo para cerrar esta solicitud.
              </Text>
            )}
          </ScrollView>
        </View>

        {isAdmin && isWaiting && (
          <View style={styles.replyBar}>
            <TextInput
              style={styles.replyInput}
              placeholder="Escribe tu respuesta como administrador..."
              placeholderTextColor="rgba(9,48,48,0.4)"
              value={adminReply}
              onChangeText={setAdminReply}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, (!adminReply.trim() || sending) && styles.sendButtonDisabled]}
              onPress={handleSendReply}
              disabled={!adminReply.trim() || sending}
            >
              <Ionicons name="send" size={18} color={adminReply.trim() ? colors.darkmodeGreenBlack : colors.lettersAndIcons} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
