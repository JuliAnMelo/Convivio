import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useBooking } from '../context/BookingContext';
import { formatDateLabel } from '../utils/calendar';

export default function AreaDetailScreen({ navigation, route }) {
  const {
    areaName = 'Área Común',
    day = 15,
    month = 'Noviembre',
    year = 2025,
    monthIndex = 10,
  } = route.params || {};

  const { getSlotsForDate } = useBooking();
  const { colors, st, fw, minTarget } = useAppTheme();

  const slots = useMemo(
    () => getSlotsForDate(areaName, year, monthIndex, day),
    [areaName, year, monthIndex, day, getSlotsForDate],
  );

  const dateLabel = formatDateLabel(day, month);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 10,
    },
    backButton: {
      padding: 5,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: { flex: 1, fontSize: st(20), fontWeight: fw('700'), color: '#FFF', textAlign: 'center' },
    headerSpacer: { width: 34 },
    imageWrapper: { alignItems: 'center', marginVertical: 16 },
    areaImage: { width: '85%', height: 150, borderRadius: 15 },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      paddingHorizontal: 25,
      paddingTop: 30,
    },
    dateTitle: { fontSize: st(18), fontWeight: fw('700'), color: colors.text, marginBottom: 20 },
    scrollContent: { paddingBottom: 40 },
    slotRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.oceanBlueButton,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    slotInfo: {
      flex: 1,
      borderLeftWidth: 2,
      borderLeftColor: colors.mainGreen,
      paddingLeft: 12,
    },
    slotStatus: { fontSize: st(14), fontWeight: fw('700'), color: colors.darkmodeGreenBlack },
    slotStatusAvailable: { color: colors.oceanBlueButton },
    slotTime: { fontSize: st(13), color: colors.oceanBlueButton, fontWeight: fw('600'), marginTop: 2 },
    actionButton: {
      backgroundColor: colors.mainGreen,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 22,
      minHeight: minTarget,
      justifyContent: 'center',
    },
    actionButtonText: { color: colors.darkmodeGreenBlack, fontSize: st(12), fontWeight: fw('700') },
  }), [colors, st, fw, minTarget]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{areaName}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.imageWrapper}>
          <Image
            source={require('../../assets/Images/imagen home.png')}
            style={styles.areaImage}
            contentFit="cover"
          />
        </View>
      </SafeAreaView>

      <View style={styles.contentContainer}>
        <Text style={styles.dateTitle}>{dateLabel}</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {slots.map((slot) => {
            const isAvailable = slot.status === 'Disponible';
            return (
              <View key={slot.id} style={styles.slotRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="key" size={20} color="#FFF" />
                </View>

                <View style={styles.slotInfo}>
                  <Text style={[styles.slotStatus, isAvailable && styles.slotStatusAvailable]}>
                    {slot.status}
                  </Text>
                  <Text style={styles.slotTime}>{slot.time}</Text>
                </View>

                {isAvailable && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      navigation.navigate('AreaForm', {
                        areaName,
                        day,
                        month,
                        year,
                        monthIndex,
                        time: slot.time,
                      })
                    }
                  >
                    <Text style={styles.actionButtonText}>Me interesa</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
