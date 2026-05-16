import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
import { useNotifications } from '../context/NotificationsContext';
import NotificationListCard from '../components/NotificationListCard';

export default function NotificationsScreen({ navigation }) {
  const { notifications, markAsRead, isUnread } = useNotifications();

  const handlePress = (item) => {
    markAsRead(item.id);
    if (item.type === 'pqr') {
      navigation.navigate('PqrDetail', { ticketId: item.ticketId });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.titleScreen}>Todas las notificaciones</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {notifications.length === 0 ? (
            <Text style={styles.empty}>No tienes notificaciones</Text>
          ) : (
            notifications.map((item) => (
              <NotificationListCard
                key={item.id}
                item={item}
                unread={isUnread(item)}
                variant="list"
                onPress={() => handlePress(item)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.mainGreen },
  contentWrap: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreenWhite,
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
  back: { position: 'absolute', left: 10, padding: 10 },
  backText: { fontSize: 24, color: COLORS.mainGreen },
  titleScreen: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.lettersAndIcons,
  },
  list: { paddingBottom: 24 },
  empty: { textAlign: 'center', marginTop: 40, color: COLORS.lettersAndIcons },
});
