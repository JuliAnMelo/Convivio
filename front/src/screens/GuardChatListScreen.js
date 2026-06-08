import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useReceptionChat } from '../context/ReceptionChatContext';

function formatPreviewTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

function ConversationRow({ thread, onPress, colors, typography, st, fw }) {
  const lastMessage = thread.messages[thread.messages.length - 1];
  const isFromGuard = lastMessage?.sender === 'admin';
  const preview = lastMessage
    ? `${isFromGuard ? 'Tú: ' : ''}${lastMessage.text}`
    : 'Sin mensajes todavía';
  const hasUnread = (thread.unreadCount || 0) > 0;

  const s = useMemo(() => StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingVertical: 14,
      gap: 12,
    },
    avatarWrap: {
      width: 54,
      height: 54,
      borderRadius: 27,
      overflow: 'hidden',
      backgroundColor: colors.lightGreen,
    },
    avatar: { width: 54, height: 54 },
    body: { flex: 1 },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    name: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(15),
      fontWeight: fw(hasUnread ? '800' : '700'),
    },
    time: {
      ...typography.paragraph,
      color: hasUnread ? colors.mainGreen : colors.textSoft,
      fontSize: st(11),
      fontWeight: fw(hasUnread ? '800' : '500'),
    },
    bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 8 },
    apt: {
      ...typography.paragraph,
      color: colors.textSoft,
      fontSize: st(11),
    },
    preview: {
      ...typography.paragraph,
      flex: 1,
      color: hasUnread ? colors.lettersAndIcons : colors.textSoft,
      fontWeight: fw(hasUnread ? '700' : '400'),
      fontSize: st(13),
    },
    unreadDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.mainGreen,
    },
    separator: {
      height: 1,
      backgroundColor: colors.lightGreen,
      marginLeft: 84,
    },
  }), [colors, typography, st, fw, hasUnread]);

  return (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.7}>
      <View style={s.avatarWrap}>
        <Image source={thread.avatar} style={s.avatar} contentFit="cover" />
      </View>
      <View style={s.body}>
        <View style={s.topRow}>
          <Text style={s.name} numberOfLines={1}>{thread.residentName}</Text>
          <Text style={s.time}>{formatPreviewTime(lastMessage?.at)}</Text>
        </View>
        <View style={s.bottomRow}>
          <Text style={s.apt}>{thread.residentApt}</Text>
          <Text style={s.preview} numberOfLines={1}>{preview}</Text>
          {hasUnread && <View style={s.unreadDot} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function GuardChatListScreen({ navigation }) {
  const { threads } = useReceptionChat();
  const { colors, typography, st, fw, minTarget } = useAppTheme();

  const sortedThreads = useMemo(() => {
    const lastAt = (thread) => {
      const last = thread.messages[thread.messages.length - 1];
      return last ? new Date(last.at).getTime() : 0;
    };
    return [...threads].sort((a, b) => lastAt(b) - lastAt(a));
  }, [threads]);

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
    listContainer: {
      flex: 1,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      paddingTop: 12,
      overflow: 'hidden',
    },
    listContent: { paddingBottom: 24 },
    separator: {
      height: 1,
      backgroundColor: colors.lightGreen,
      marginLeft: 84,
    },
    emptyWrap: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
    emptyTitle: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontSize: st(16),
      fontWeight: fw('700'),
      marginTop: 12,
      textAlign: 'center',
    },
    emptySub: {
      ...typography.paragraph,
      color: colors.textSoft,
      fontSize: st(13),
      marginTop: 4,
      textAlign: 'center',
    },
  }), [colors, typography, st, fw, minTarget]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Comunicación Propietarios</Text>
            <Text style={styles.headerSub}>Conversaciones con residentes</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <View style={styles.listContainer}>
        <FlatList
          data={sortedThreads}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <ConversationRow
              thread={item}
              colors={colors}
              typography={typography}
              st={st}
              fw={fw}
              onPress={() => navigation.navigate('GuardReception', { threadId: item.id })}
            />
          )}
          ListEmptyComponent={(
            <View style={styles.emptyWrap}>
              <Ionicons name="chatbubbles-outline" size={40} color={colors.textSoft} />
              <Text style={styles.emptyTitle}>Sin conversaciones</Text>
              <Text style={styles.emptySub}>Cuando un residente te escriba, aparecerá aquí.</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
