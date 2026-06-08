import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useBooking } from '../context/BookingContext';
import MonthCalendar from '../components/MonthCalendar';
import { isAreaDisabled, getAreaSettings } from '../services/areasService';

export default function AreaCalendarScreen({ navigation, route }) {
  const areaName = route.params?.areaName || 'Área Común';
  const { getCalendarMonths, getUnavailableDaysForMonth } = useBooking();
  const months = getCalendarMonths();

  // Block access if area is disabled
  useEffect(() => {
    if (isAreaDisabled(areaName)) {
      const msg = getAreaSettings(areaName).disabledMessage;
      Alert.alert(
        'Área no disponible',
        msg || 'Esta área está temporalmente deshabilitada por el administrador.',
        [{ text: 'Entendido', onPress: () => navigation.goBack() }]
      );
    }
  }, [areaName]);
  const { colors, st, fw, minTarget } = useAppTheme();
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
    legendContainer: { paddingHorizontal: 40, marginTop: 20, marginBottom: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    legendCircleAvailable: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    legendCircleUnavailable: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.darkmodeGreenBlack,
      marginRight: 10,
    },
    legendText: { color: '#FFF', fontSize: st(12), fontWeight: fw('600') },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      paddingHorizontal: 25,
      paddingTop: 30,
    },
    scrollContent: { paddingBottom: 40 },
  }), [colors, st, fw, minTarget]);

  const handleSelectDay = (year, monthIndex, monthName, day) => {
    navigation.navigate('AreaDetail', {
      areaName,
      day,
      month: monthName,
      year,
      monthIndex,
    });
  };

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

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={styles.legendCircleAvailable}>
              <Ionicons name="close" size={14} color="#666" />
            </View>
            <Text style={styles.legendText}>FECHA DISPONIBLE</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendCircleUnavailable} />
            <Text style={styles.legendText}>FECHA NO DISPONIBLE</Text>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {months.map(({ year, monthIndex, name }) => {
            const unavailable = getUnavailableDaysForMonth(areaName, year, monthIndex);

            return (
              <MonthCalendar
                key={`${year}-${monthIndex}`}
                year={year}
                monthIndex={monthIndex}
                monthName={name}
                unavailableDays={unavailable}
                onSelectDay={(day) => handleSelectDay(year, monthIndex, name, day)}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
