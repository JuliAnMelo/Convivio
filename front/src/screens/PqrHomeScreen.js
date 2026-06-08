import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { usePqr } from '../context/PqrContext';
import { PQR_TYPES } from '../services/pqrConstants';
import PqrStatusBadge from '../components/PqrStatusBadge';

export default function PqrHomeScreen({ navigation }) {
  const { getTickets } = usePqr();
  const tickets = getTickets();
  const { colors, typography, st, fw, minTarget } = useAppTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
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
    backButton: {
      position: 'absolute',
      left: 10,
      padding: 10,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButtonText: { fontSize: st(24), color: colors.mainGreen },
    title: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontSize: st(20),
      fontWeight: fw('700'),
    },
    newButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.oceanBlueButton,
      paddingVertical: 14,
      borderRadius: 24,
      marginBottom: 16,
      gap: 8,
      minHeight: minTarget,
    },
    newButtonText: {
      color: colors.backgroundGreenWhite,
      ...typography.subtitle,
      fontWeight: fw('700'),
    },
    list: { paddingBottom: 24 },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.lightGreen,
    },
    cardIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.lightBlueButton,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    cardBody: { flex: 1 },
    cardTitle: {
      fontSize: st(15),
      fontWeight: fw('700'),
      color: colors.darkmodeGreenBlack,
      marginBottom: 4,
    },
    cardMeta: {
      fontSize: st(11),
      color: colors.lettersAndIcons,
      marginBottom: 8,
    },
    empty: {
      textAlign: 'center',
      color: colors.lettersAndIcons,
      marginTop: 40,
      ...typography.paragraph,
    },
  }), [colors, typography, st, fw, minTarget]);

  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>PQRs Administración</Text>
        </View>

        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('PqrCreate')}
        >
          <Ionicons name="add-circle" size={22} color={colors.backgroundGreenWhite} />
          <Text style={styles.newButtonText}>Nueva solicitud</Text>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {tickets.length === 0 ? (
            <Text style={styles.empty}>No tienes solicitudes radicadas</Text>
          ) : (
            tickets.map((item) => {
              const type = PQR_TYPES[item.type];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => navigation.navigate('PqrDetail', { ticketId: item.id })}
                  activeOpacity={0.85}
                >
                  <View style={styles.cardIcon}>
                    <Ionicons name={type?.icon || 'document-text'} size={22} color="#FFF" />
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.subject}</Text>
                    <Text style={styles.cardMeta}>
                      {type?.label} · {item.code}
                    </Text>
                    <PqrStatusBadge statusId={item.status} />
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.mainGreen} />
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}
