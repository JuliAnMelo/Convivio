import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';
const GUARD_AVATAR = require('../../assets/Images/guardia.webp');
const DEFAULT_AVATAR_URI = 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=200&q=80';
import { api } from '../services/api';

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
      const data = await api.get(`/conjuntos/${user.conjuntoId}/requests`);
      setRequests(data);
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
    cardLocation: {
      ...typography.paragraph,
      color: colors.mainGreen,
      fontSize: st(12),
      fontWeight: fw('700'),
      marginTop: 2,
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
    removeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: '#F04C4C20',
      borderRadius: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: '#F04C4C',
      minHeight: minTarget,
    },
    removeBtnText: {
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
      await api.put(`/conjuntos/requests/${reqId}`, { status });
      fetchRequests();
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar la solicitud.');
    }
  };

  const removeMember = async (reqId) => {
    try {
      await api.delete(`/conjuntos/requests/${reqId}`);
      fetchRequests();
    } catch (e) {
      Alert.alert('Error', 'No se pudo sacar al miembro del conjunto.');
    }
  };

  const handleRemove = (req) => {
    Alert.alert(
      'Sacar del conjunto',
      `¿Seguro que deseas sacar a ${req.userData.name} del conjunto? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sacar', style: 'destructive', onPress: () => removeMember(req.requestId) },
      ]
    );
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
    
    const avatarSource = item.userData?.photoUri
      ? { uri: item.userData.photoUri }
      : item.role === 'guarda'
        ? GUARD_AVATAR
        : { uri: DEFAULT_AVATAR_URI };

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={{ position: 'relative' }}>
            <View style={styles.avatar}>
              <Image
                source={avatarSource}
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
            {(item.userData.torre || item.userData.apt) ? (
              <Text style={styles.cardLocation}>
                {[
                  item.userData.torre ? `Torre ${item.userData.torre}` : null,
                  item.userData.apt ? `Apto ${item.userData.apt}` : null,
                ].filter(Boolean).join(' · ')}
              </Text>
            ) : null}
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

        {item.status !== 'pending' && (
          <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item)}>
            <Ionicons name="person-remove-outline" size={16} color="#F04C4C" />
            <Text style={styles.removeBtnText}>Sacar del conjunto</Text>
          </TouchableOpacity>
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
