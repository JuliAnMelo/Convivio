import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { getConjuntoById } from '../services/conjuntoService';

const GUARD_AVATAR = require('../../assets/Images/guardia.webp');
const DEFAULT_AVATAR_URI = 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=200&q=80';

export default function ProfileScreen({ navigation }) {
  const { user, logout, leaveConjunto } = useContext(AuthContext);
  const { colors, typography, st, fw, minTarget, shouldAnimate } = useAppTheme();

  const canLeave = !!user?.conjuntoId;

  const handleLeaveConjunto = () => {
    const conjunto = getConjuntoById(user?.conjuntoId);
    const conjuntoName = conjunto?.name || user?.conjuntoName || 'este conjunto';
    Alert.alert(
      'Salir del conjunto',
      `¿Seguro que deseas salir de "${conjuntoName}"? Dejarás de ver sus anuncios, áreas y demás información.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            leaveConjunto(user?.conjuntoId);
            navigation.navigate('Inicio');
          },
        },
      ],
    );
  };

  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!shouldAnimate) {
      anim1.setValue(0);
      anim2.setValue(0);
      return undefined;
    }
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(anim1, { toValue: 1, duration: 3500, useNativeDriver: true }),
        Animated.timing(anim1, { toValue: 0, duration: 3500, useNativeDriver: true })
      ])
    );
    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(anim2, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(anim2, { toValue: 0, duration: 5000, useNativeDriver: true })
      ])
    );
    loop1.start();
    loop2.start();
    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [anim1, anim2, shouldAnimate]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.mainGreen,
    },
    headerBackground: {
      backgroundColor: colors.mainGreen,
      height: 130,
    },
    bgCircle1: {
      position: 'absolute',
      top: -50,
      left: -30,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: 'rgba(255, 255, 255, 0.14)',
    },
    bgCircle2: {
      position: 'absolute',
      top: -10,
      right: -60,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: 'rgba(255, 255, 255, 0.11)',
    },
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
    headerTitle: {
      fontSize: st(20),
      fontWeight: fw('600'),
      color: colors.lettersAndIcons,
    },
    placeholderSpace: {
      width: 34,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      marginTop: 10,
      alignItems: 'center',
    },
    avatarContainer: {
      marginTop: -50,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginBottom: 5,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 4,
      borderColor: colors.card,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 25,
      width: '100%',
    },
    userName: {
      fontSize: st(20),
      fontWeight: fw('700'),
      color: colors.lettersAndIcons,
      textAlign: 'center',
      marginBottom: 20,
    },
    infoBlock: {
      marginBottom: 25,
      paddingHorizontal: 10,
    },
    infoTitle: {
      fontSize: st(13),
      fontWeight: fw('700'),
      color: colors.lettersAndIcons,
      marginBottom: 5,
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: 3,
    },
    infoLabel: {
      fontSize: st(13),
      fontWeight: fw('600'),
      color: colors.lettersAndIcons,
    },
    infoValue: {
      fontSize: st(13),
      fontWeight: fw('400'),
      color: colors.lettersAndIcons,
    },
    menuContainer: {
      paddingHorizontal: 10,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      minHeight: minTarget,
    },
    menuIconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    menuText: {
      fontSize: st(16),
      fontWeight: fw('600'),
      color: colors.lettersAndIcons,
    },
  }), [colors, typography, st, fw, minTarget]);

  const avatarSource = user?.photoUri
    ? { uri: user.photoUri }
    : user?.role === 'guarda'
      ? GUARD_AVATAR
      : { uri: DEFAULT_AVATAR_URI };

  return (
    <View style={styles.container}>
      {/* Top Green Background */}
      <SafeAreaView style={[styles.headerBackground, { overflow: 'hidden' }]}>
        <Animated.View style={[styles.bgCircle1, {
          transform: [
            { translateX: anim1.interpolate({ inputRange: [0, 1], outputRange: [-60, 100] }) },
            { scale: anim1.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.7] }) }
          ]
        }]} />
        <Animated.View style={[styles.bgCircle2, {
          transform: [
            { translateY: anim2.interpolate({ inputRange: [0, 1], outputRange: [-40, 40] }) },
            { scale: anim2.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1.55] }) },
            { translateX: anim2.interpolate({ inputRange: [0, 1], outputRange: [-25, 25] }) }
          ]
        }]} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Inicio')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={styles.placeholderSpace} />
        </View>
      </SafeAreaView>

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={avatarSource}
            style={styles.avatar}
          />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 25, width: '100%' }}>
          <Text style={styles.userName}>{user?.name}</Text>

          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>INFORMACIÓN PARA PORTERIA:</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>APTO.:</Text>
              <Text style={styles.infoValue}> {user?.apt || 'No asignado'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>NOMBRE:</Text>
              <Text style={styles.infoValue}> {user?.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CORREO:</Text>
              <Text style={styles.infoValue}> {user?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>TELEFONO:</Text>
              <Text style={styles.infoValue}> {user?.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>MIEMBRO DE CONSEJO:</Text>
              <Text style={styles.infoValue}> {user?.isConsejo ? 'SÍ' : 'NO'}</Text>
            </View>
          </View>

          {/* Menu Buttons */}
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#77B5FE' }]}>
                <Ionicons name="person-outline" size={20} color="#FFF" />
              </View>
              <Text style={styles.menuText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Settings')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#0054F9' }]}>
                <Ionicons name="settings-outline" size={20} color="#FFF" />
              </View>
              <Text style={styles.menuText}>Configuración</Text>
            </TouchableOpacity>

            {canLeave && (
              <TouchableOpacity style={styles.menuItem} onPress={handleLeaveConjunto}>
                <View style={[styles.menuIconBox, { backgroundColor: colors.errorRed }]}>
                  <Ionicons name="exit-outline" size={20} color="#FFF" />
                </View>
                <Text style={styles.menuText}>Salir del conjunto</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuItem} onPress={logout}>
              <View style={[styles.menuIconBox, { backgroundColor: '#57A3FD' }]}>
                <Ionicons name="log-out-outline" size={20} color="#FFF" />
              </View>
              <Text style={styles.menuText}>Salir</Text>
            </TouchableOpacity>
          </View>

          {/* Extra bottom space for custom tab bar */}
          <View style={{ height: 10 }} />
        </View>
      </View>
    </View>
  );
}