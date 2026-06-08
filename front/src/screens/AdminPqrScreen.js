import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { usePqr } from '../context/PqrContext';
import PqrStatusBadge from '../components/PqrStatusBadge';
import { PQR_TYPES } from '../services/pqrConstants';

export default function AdminPqrScreen({ navigation }) {
  const { getTickets } = usePqr();
  const { colors, typography, st, fw, minTarget } = useAppTheme();
  const tickets = getTickets();

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.mainGreen },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      marginBottom: 12,
    },
    backButton: {
      padding: 5,
      minWidth: minTarget,
      minHeight: minTarget,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { color: '#FFF', fontSize: st(20), fontWeight: fw('800') },
    headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: st(12) },
    headerSpacer: { width: 44 },
    body: {
      flex: 1,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      paddingTop: 20,
    },
    list: { paddingHorizontal: 20, paddingBottom: 40 },
    card: {
      backgroundColor: colors.lightGreen,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    cardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    cardCode: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(11),
      opacity: 0.6,
      marginBottom: 2,
    },
    cardTitle: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontSize: st(15),
      fontWeight: fw('700'),
      flex: 1,
      marginRight: 8,
    },
    typeTag: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(11),
      opacity: 0.65,
      marginBottom: 8,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateText: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(11),
      opacity: 0.55,
    },
    respondButton: {
      backgroundColor: colors.mainGreen,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 6,
      minHeight: 32,
      justifyContent: 'center',
    },
    respondButtonText: {
      ...typography.paragraph,
      color: colors.darkmodeGreenBlack,
      fontSize: st(12),
      fontWeight: fw('700'),
    },
    respondedChevron: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    respondedText: {
      ...typography.paragraph,
      color: colors.mainGreen,
      fontSize: st(12),
      fontWeight: fw('600'),
    },
    emptyText: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      textAlign: 'center',
      marginTop: 40,
      fontSize: st(14),
      opacity: 0.6,
    },
  }), [colors, typography, st, fw, minTarget]);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const renderItem = ({ item }) => {
    const type = PQR_TYPES[item.type];
    const isWaiting = item.status === 'esperando';
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PqrDetail', { ticketId: item.id })}
        activeOpacity={0.8}
      >
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardCode}>{item.code}</Text>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.subject}</Text>
          </View>
          <PqrStatusBadge status={item.status} />
        </View>

        <Text style={styles.typeTag}>{type?.label || item.type}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          {isWaiting ? (
            <TouchableOpacity
              style={styles.respondButton}
              onPress={() => navigation.navigate('PqrDetail', { ticketId: item.id })}
            >
              <Text style={styles.respondButtonText}>Responder</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.respondedChevron}>
              <Text style={styles.respondedText}>Ver respuesta</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.mainGreen} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Gestión PQR</Text>
          <Text style={styles.headerSub}>{tickets.length} solicitudes</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        <FlatList
          data={tickets}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay solicitudes PQR</Text>}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
