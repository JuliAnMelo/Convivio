import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { useBooking } from '../context/BookingContext';
import MonthCalendar from '../components/MonthCalendar';

export default function AreaCalendarScreen({ navigation, route }) {
  const areaName = route.params?.areaName || 'Área Común';
  const { getCalendarMonths, getUnavailableDaysForMonth } = useBooking();
  const months = getCalendarMonths();

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.mainGreen },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: { padding: 5 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: '#FFF', textAlign: 'center' },
  headerSpacer: { width: 34 },
  legendContainer: { paddingHorizontal: 40, marginTop: 20, marginBottom: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legendCircleAvailable: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  legendCircleUnavailable: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.darkmodeGreenBlack,
    marginRight: 10,
  },
  legendText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  scrollContent: { paddingBottom: 40 },
});
