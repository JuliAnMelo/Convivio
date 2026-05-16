import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme';
import { WEEKDAY_LABELS, buildMonthGrid } from '../utils/calendar';

export default function MonthCalendar({
  year,
  monthIndex,
  monthName,
  unavailableDays = [],
  onSelectDay,
}) {
  const cells = buildMonthGrid(year, monthIndex);

  return (
    <View style={styles.wrap}>
      <Text style={styles.monthTitle}>{monthName}</Text>

      <View style={styles.daysHeader}>
        {WEEKDAY_LABELS.map((d) => (
          <Text key={d} style={styles.dayOfWeek}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const isUnavailable = unavailableDays.includes(day);

          return (
            <TouchableOpacity
              key={`${monthName}-${day}`}
              style={[styles.dayCell, isUnavailable && styles.dayCellUnavailable]}
              disabled={isUnavailable}
              onPress={() => onSelectDay(day)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayText, isUnavailable && styles.dayTextUnavailable]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 28 },
  monthTitle: { fontSize: 16, color: COLORS.mainGreen, fontWeight: '700', marginBottom: 15 },
  daysHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  dayOfWeek: {
    fontSize: 14,
    color: COLORS.oceanBlueButton,
    fontWeight: 'bold',
    width: '14.28%',
    textAlign: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayCellUnavailable: {
    backgroundColor: COLORS.darkmodeGreenBlack,
    borderRadius: 20,
  },
  dayText: { fontSize: 13, color: '#333', fontWeight: '500' },
  dayTextUnavailable: { color: '#FFF' },
});
