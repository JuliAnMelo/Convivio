import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../theme';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top Green Background */}
      <SafeAreaView style={styles.headerBackground}>
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
          {/* Using a placeholder Panda image to match the mockup */}
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=200&q=80' }} 
            style={styles.avatar} 
          />
          <View style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={12} color="#FFF" />
          </View>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 25, width: '100%' }}>
          <Text style={styles.userName}>Jhon Garcia</Text>

          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>INFORMACIÓN PARA PORTERIA:</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>APTO.:</Text>
              <Text style={styles.infoValue}> 105</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>NOMBRE:</Text>
              <Text style={styles.infoValue}> Jhon Garcia</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CORREO:</Text>
              <Text style={styles.infoValue}> Correo@Gmail.Com</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>TELEFONO:</Text>
              <Text style={styles.infoValue}> 000000000</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>MIEMBRO DE CONSEJO:</Text>
              <Text style={styles.infoValue}> SÍ</Text>
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

            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIconBox, { backgroundColor: '#0054F9' }]}>
                <Ionicons name="settings-outline" size={20} color="#FFF" />
              </View>
              <Text style={styles.menuText}>Configuración</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainGreen,
  },
  headerBackground: {
    backgroundColor: COLORS.mainGreen,
    height: 130,
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.lettersAndIcons,
  },
  placeholderSpace: {
    width: 34,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: 10,
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: -50, // subido un poco
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 5, // reducido margen inferior
  },
  avatar: {
    width: 100, // reducido un poco
    height: 100, // reducido un poco
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: COLORS.mainGreen,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    width: '100%',
  },
  userName: {
    fontSize: 20, // reducido
    fontWeight: '700',
    color: COLORS.lettersAndIcons,
    textAlign: 'center',
    marginBottom: 20, // reducido
  },
  infoBlock: {
    marginBottom: 25, // reducido
    paddingHorizontal: 10,
  },
  infoTitle: {
    fontSize: 13, // reducido
    fontWeight: '700',
    color: COLORS.lettersAndIcons,
    marginBottom: 5, // reducido
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3, // reducido
  },
  infoLabel: {
    fontSize: 13, // reducido
    fontWeight: '600',
    color: COLORS.lettersAndIcons,
  },
  infoValue: {
    fontSize: 13, // reducido
    fontWeight: '400',
    color: COLORS.lettersAndIcons,
  },
  menuContainer: {
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15, // reducido
  },
  menuIconBox: {
    width: 40, // reducido
    height: 40, // reducido
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // reducido
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.lettersAndIcons,
  }
});