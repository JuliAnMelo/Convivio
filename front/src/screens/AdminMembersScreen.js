import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { getPersonaImageByName } from '../utils/personaImages';

const ROLE_LABELS = {
  residente: 'Residente',
  guarda: 'Guarda',
  administrador: 'Administrador',
};

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', color: '#FF9F43' },
  approved: { label: 'Aprobado', color: '#00D09E' },
  rejected: { label: 'Rechazado', color: '#F04C4C' },
};

export default function AdminMembersScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { colors, typography, st, fw, minTarget } = useAppTheme();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');

  const fetchRequests = async () => {
    if (!user?.conjuntoId) return;
    try {
      const res = await fetch(`http://10.0.2.2:5000/api/conjuntos/${user.conjuntoId}/requests`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {
      console.log('Error fetching requests', e);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user?.conjuntoId]);

  const filtered = requests.filter(r => filter === 'all' || r.status === filter);

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
    headerTitle: {
      color: '#FFF',
      fontSize: st(20),
      fontWeight: fw('800'),
    },
    headerSpacer: { width: 44 },
    body: {
      flex: 1,
      backgroundColor: colors.backgroundGreenWhite,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
    },
    filterRow: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 12,
      gap: 8,
    },
    filterBtn: {
      paddingHorizontal: 16,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: colors.lightGreen,
    },
    filterBtnActive: { backgroundColor: colors.mainGreen },
    filterBtnText: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(12),
      fontWeight: fw('600'),
    },
    filterBtnTextActive: { color: colors.darkmodeGreenBlack },
    list: { paddingHorizontal: 20, paddingBottom: 40 },
    card: {
      backgroundColor: colors.lightGreen,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      overflow: 'hidden',
      marginRight: 12,
    },
    avatarImg: { width: 46, height: 46 },
    aptBadge: {
      position: 'absolute',
      bottom: -2, right: -2,
      backgroundColor: colors.mainGreen,
      borderRadius: 8,
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderWidth: 1.5,
      borderColor: '#FFF',
    },
    aptBadgeText: {
      color: '#FFF',
      fontSize: st(8),
      fontWeight: fw('800'),
    },
    cardInfo: { flex: 1 },
    cardName: {
      ...typography.subtitle,
      color: colors.lettersAndIcons,
      fontSize: st(15),
      fontWeight: fw('700'),
    },
    cardEmail: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(12),
      opacity: 0.7,
    },
    statusBadge: {
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    statusText: {
      ...typography.paragraph,
      fontSize: st(11),
      fontWeight: fw('600'),
      color: '#FFF',
    },
    roleTag: {
      ...typography.paragraph,
      color: colors.lettersAndIcons,
      fontSize: st(12),
      opacity: 0.6,
      marginBottom: 10,
    },
    actionRow: { flexDirection: 'row', gap: 10 },
    approveBtn: {
      flex: 1,
      backgroundColor: colors.mainGreen,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
      minHeight: minTarget,
      justifyContent: 'center',
    },
    rejectBtn: {
      flex: 1,
      backgroundColor: '#F04C4C20',
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#F04C4C',
      minHeight: minTarget,
      justifyContent: 'center',
    },
    approveBtnText: {
      ...typography.paragraph,
      color: colors.darkmodeGreenBlack,
      fontWeight: fw('700'),
      fontSize: st(13),
    },
    rejectBtnText: {
      ...typography.paragraph,
      color: '#F04C4C',
      fontWeight: fw('700'),
      fontSize: st(13),
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

  const updateRequestStatus = async (reqId, status) => {
    try {
      const res = await fetch(`http://10.0.2.2:5000/api/conjuntos/requests/${reqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed');
      fetchRequests();
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar la solicitud.');
    }
  };

  const handleApprove = (req) => {
    Alert.alert(
      'Aprobar Solicitud',
      `¿Aprobar a ${req.userData.name} como ${ROLE_LABELS[req.role]}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Aprobar', onPress: () => updateRequestStatus(req.requestId, 'approved') },
      ]
    );
  };

  const handleReject = (req) => {
    Alert.alert(
      'Rechazar Solicitud',
      `¿Rechazar la solicitud de ${req.userData.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Rechazar', style: 'destructive', onPress: () => updateRequestStatus(req.requestId, 'rejected') },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={{ position: 'relative' }}>
            <View style={styles.avatar}>
              <Image
                source={getPersonaImageByName(item.userData.name)}
                style={styles.avatarImg}
                contentFit="cover"
              />
            </View>
            <View style={styles.aptBadge}>
              <Text style={styles.aptBadgeText}>{item.userData.apt || 'Apto ?'}</Text>
            </View>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{item.userData.name}</Text>
            <Text style={styles.cardEmail}>{item.userData.email}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.color }]}>
            <Text style={styles.statusText}>{statusCfg.label}</Text>
          </View>
        </View>

        <Text style={styles.roleTag}>{ROLE_LABELS[item.role] || item.role}</Text>

        {item.status === 'pending' && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(item)}>
              <Text style={styles.approveBtnText}>✓ Aprobar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item)}>
              <Text style={styles.rejectBtnText}>✕ Rechazar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Miembros del Conjunto</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        <View style={styles.filterRow}>
          {['pending', 'approved', 'all'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>
                {f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Aprobados' : 'Todos'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item.requestId}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {filter === 'pending' ? 'No hay solicitudes pendientes' : 'Sin resultados'}
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
