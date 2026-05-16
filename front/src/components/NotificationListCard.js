import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../theme';

function NotificationIcon({ icon }) {
  if (icon === 'water') {
    return (
      <Image
        source={require('../../assets/vectors/Vector.svg')}
        style={styles.vectorIcon}
        contentFit="contain"
      />
    );
  }
  if (icon === 'teddy') {
    return (
      <Image
        source={require('../../assets/vectors/teddybear.svg')}
        style={styles.vectorIcon}
        contentFit="contain"
      />
    );
  }
  if (icon === 'pqr') {
    return <Ionicons name="document-text" size={22} color="#FFF" />;
  }
  return <Ionicons name="key" size={22} color="#FFF" />;
}

export default function NotificationListCard({ item, unread, onPress, variant = 'home' }) {
  const isPqr = item.type === 'pqr';
  const isWaiting = item.pqrStatus === 'esperando';
  const cardStyle = variant === 'home' ? styles.cardHome : styles.cardList;

  return (
    <TouchableOpacity
      style={[cardStyle, unread && styles.cardUnread]}
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      disabled={!onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.month}>{item.month}</Text>
        {unread ? <View style={styles.unreadDot} /> : null}
      </View>

      <View style={styles.cardRow}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: isPqr
                ? isWaiting
                  ? COLORS.lightBlueButton
                  : COLORS.mainGreen
                : item.icon === 'water'
                  ? COLORS.lightBlueButton
                  : item.icon === 'key'
                    ? COLORS.oceanBlueButton
                    : '#FFA07A',
            },
          ]}
        >
          <NotificationIcon icon={item.icon} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.tag}>{item.tag}</Text>
          <Text style={styles.title}>{item.title}</Text>
          {item.subtitle ? (
            <Text
              style={[
                styles.subtitle,
                isPqr && isWaiting && styles.subtitleWaiting,
                isPqr && !isWaiting && styles.subtitleDone,
              ]}
            >
              {item.subtitle}
            </Text>
          ) : null}
          <Text style={styles.date}>
            {item.time} - {item.month} {item.day}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardHome: {
    backgroundColor: COLORS.backgroundGreenWhite,
    padding: 10,
    borderRadius: 20,
    marginBottom: 8,
  },
  cardList: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGreen,
  },
  cardUnread: {
    borderWidth: 1,
    borderColor: 'rgba(245, 166, 35, 0.45)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  month: {
    color: COLORS.darkmodeGreenBlack,
    ...TYPOGRAPHY.title,
    fontWeight: '800',
    fontSize: 18,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5A623',
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vectorIcon: { width: 24, height: 24, tintColor: '#FFF' },
  textWrap: { flex: 1 },
  tag: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.darkmodeGreenBlack,
    fontWeight: '500',
    fontSize: 12,
  },
  title: {
    color: COLORS.darkmodeGreenBlack,
    ...TYPOGRAPHY.subtitle,
    fontWeight: '800',
    fontSize: 13,
    marginVertical: 1,
  },
  subtitle: {
    ...TYPOGRAPHY.paragraph,
    fontWeight: '700',
    fontSize: 11,
    marginBottom: 2,
  },
  subtitleWaiting: { color: '#C87D0A' },
  subtitleDone: { color: COLORS.mainGreen },
  date: {
    color: COLORS.oceanBlueButton,
    ...TYPOGRAPHY.paragraph,
    fontWeight: '700',
    fontSize: 10,
  },
});
