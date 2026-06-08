import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useAppTheme } from '../theme';
import { useNotifications } from '../context/NotificationsContext';
import NotificationListCard from '../components/NotificationListCard';

export default function NotificationsScreen({ navigation }) {
  const { notifications, markAsRead, isUnread } = useNotifications();
  const { colors, typography, st, fw, minTarget, shouldAnimate } = useAppTheme();

  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!shouldAnimate) {
      anim1.setValue(0);
      anim2.setValue(0);
      return undefined;
    }
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(anim1, { toValue: 1, duration: 3500, useNativeDriver: true }),
        Animated.timing(anim1, { toValue: 0, duration: 3500, useNativeDriver: true })
      ])
    );
    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(anim2, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(anim2, { toValue: 0, duration: 5000, useNativeDriver: true })
      ])
    );
    loop1.start();
    loop2.start();
    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [anim1, anim2, shouldAnimate]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen, overflow: 'hidden' },
    bgCircle1: {
      position: 'absolute',
      top: -60,
      left: -40,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: 'rgba(255, 255, 255, 0.14)',
    },
    bgCircle2: {
      position: 'absolute',
      top: -20,
      right: -70,
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: 'rgba(255, 255, 255, 0.11)',
    },
    contentWrap: {
      flex: 1,
      backgroundColor: colors.backgroundGreenWhite,
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
    back: {
      position: 'absolute',
      left: 10,
      padding: 10,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backText: { fontSize: st(24), color: colors.mainGreen },
    titleScreen: {
      ...typography.subtitle,
      fontSize: st(20),
      fontWeight: fw('800'),
      color: colors.lettersAndIcons,
    },
    list: { paddingBottom: 24 },
    empty: { textAlign: 'center', marginTop: 40, color: colors.lettersAndIcons },
  }), [colors, typography, st, fw, minTarget]);

  const handlePress = (item) => {
    markAsRead(item.id);
    if (item.type === 'pqr') {
      navigation.navigate('PqrDetail', { ticketId: item.ticketId });
    } else {
      navigation.navigate('AnnouncementDetail', { item });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bgCircle1, {
        transform: [
          { translateX: anim1.interpolate({ inputRange: [0, 1], outputRange: [-70, 100] }) },
          { scale: anim1.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.7] }) }
        ]
      }]} />
      <Animated.View style={[styles.bgCircle2, {
        transform: [
          { translateY: anim2.interpolate({ inputRange: [0, 1], outputRange: [-50, 50] }) },
          { scale: anim2.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1.55] }) },
          { translateX: anim2.interpolate({ inputRange: [0, 1], outputRange: [-35, 35] }) }
        ]
      }]} />
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
