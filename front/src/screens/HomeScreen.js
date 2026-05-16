import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, TYPOGRAPHY } from '../theme';
import { useNotifications } from '../context/NotificationsContext';
import NotificationListCard from '../components/NotificationListCard';

const PREVIEW_COUNT = 3;

export default function HomeScreen({ navigation }) {
  const { notifications, markAsRead, isUnread } = useNotifications();
  const preview = notifications.slice(0, PREVIEW_COUNT);
  const hasMore = notifications.length > PREVIEW_COUNT;

  const handleNotificationPress = (item) => {
    markAsRead(item.id);
    if (item.type === 'pqr') {
      navigation.navigate('PqrDetail', { ticketId: item.ticketId });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>
          <Text style={styles.stroke}>Hola Jhon Garcia</Text>{'\n'}
          <Text style={styles.stroke}>Residente</Text>{'\n'}
          <Text style={styles.stroke}>Apartamento 303</Text>
        </Text>

        <View style={styles.cardImage}>
          <Image
            source={require('../../assets/Images/imagen home.png')}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        <Text style={styles.sectionTitle}>Ultimos Anuncios:</Text>

        <View style={styles.previewList}>
          {preview.map((item) => (
            <NotificationListCard
              key={item.id}
              item={item}
              unread={isUnread(item)}
              variant="home"
              onPress={() => handleNotificationPress(item)}
            />
          ))}
        </View>

        {(hasMore || notifications.length > 0) && (
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.seeAllText}>Ver todas las notificaciones</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footerWrap}>
          <TouchableOpacity
            style={styles.categoriesButton}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={styles.categoriesButtonText}>Categorias</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.mainGreen },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 45, paddingBottom: 100 },
  greeting: { textAlign: 'center', marginTop: 5 },
  stroke: {
    color: '#FFF',
    ...TYPOGRAPHY.title,
    fontSize: 22,
    textShadowColor: 'rgba(3, 91, 71, 0.9)',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 1,
  },
  cardImage: {
    width: '100%',
    height: 125,
    marginVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  sectionTitle: {
    color: COLORS.backgroundGreenWhite,
    ...TYPOGRAPHY.subtitle,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  previewList: { marginBottom: 4 },
  seeAllButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  seeAllText: {
    color: COLORS.backgroundGreenWhite,
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  footerWrap: { marginTop: 12, marginBottom: 8 },
  categoriesButton: {
    backgroundColor: COLORS.oceanBlueButton,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  categoriesButtonText: {
    color: COLORS.backgroundGreenWhite,
    ...TYPOGRAPHY.subtitle,
    fontWeight: '700',
  },
});
