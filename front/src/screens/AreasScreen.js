import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';

export default function AreasScreen({ navigation }) {
  const areas = ['Área 1', 'Área 2', 'Área 3', 'Área 4'];
  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Áreas Comunes</Text>
        </View>
        <View style={styles.grid}>
          {areas.map((a) => (
            <TouchableOpacity key={a} style={styles.areaCard} onPress={() => navigation.navigate('AreaCalendar', { areaName: a })}>
              <Text style={styles.areaIcon}>🏠</Text>
              <Text style={styles.areaText}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.mainGreen },
  contentWrap: { flex: 1, backgroundColor: COLORS.backgroundGreenWhite, borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: 40, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  backButton: { position: 'absolute', left: 10, padding: 10 },
  backButtonText: { fontSize: 24, color: COLORS.mainGreen },
  title: { ...TYPOGRAPHY.subtitle, color: COLORS.lettersAndIcons, fontSize: 18, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: 20 },
  areaCard: { width: '28%', backgroundColor: COLORS.lightBlueButton, padding: 16, borderRadius: 16, alignItems: 'center', margin: '2.5%' },
  areaIcon: { fontSize: 28, marginBottom: 10, color: COLORS.backgroundGreenWhite },
  areaText: { ...TYPOGRAPHY.paragraph, fontSize: 12, color: COLORS.lettersAndIcons }
});
