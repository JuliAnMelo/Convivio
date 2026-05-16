import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../theme';
import { usePqr } from '../context/PqrContext';
import { useNotifications } from '../context/NotificationsContext';
import { PQR_TYPES } from '../services/pqrConstants';
import PqrChatBubble from '../components/PqrChatBubble';

export default function PqrDetailScreen({ navigation, route }) {
  const { getTicketById, getChatMessages } = usePqr();
  const { markAsRead } = useNotifications();
  const scrollRef = useRef(null);
  const ticket = getTicketById(route.params?.ticketId);

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

  return (
    <View style={styles.container}>
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
        <Text
          style={[
            styles.statusText,
            isWaiting ? styles.statusWaiting : styles.statusDone,
          ]}
        >
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

          {isWaiting && (
            <Text style={styles.hint}>
              Cuando administración responda, verás el mensaje aquí.
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.mainGreen },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  backButton: { padding: 5 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  headerSpacer: { width: 34 },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 16,
  },
  statusText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  statusWaiting: { color: '#C87D0A' },
  statusDone: { color: COLORS.mainGreen },
  chatScroll: { flex: 1 },
  chatContent: { paddingHorizontal: 16, paddingBottom: 28 },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    ...TYPOGRAPHY.paragraph,
  },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 16, color: '#666' },
  notFoundLink: { marginTop: 12, color: COLORS.mainGreen, fontWeight: '700' },
});
