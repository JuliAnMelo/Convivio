import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function EditProfileScreen({ navigation }) {
  const [isConsejo, setIsConsejo] = useState(true);

  return (
    <View style={styles.container}>
      {/* Top Green Background */}
      <SafeAreaView style={styles.headerBackground}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
            source={{ uri: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=200&q=80' }} 
            style={styles.avatar} 
          />
          <View style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={12} color="#FFF" />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.userName}>Jhon Garcia</Text>

          <Text style={styles.sectionTitle}>Datos De Contacto</Text>

          {/* Form Inputs */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput 
              style={styles.input} 
              defaultValue="Jhon Garcia"
              placeholderTextColor={COLORS.lettersAndIcons}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Teléfono</Text>
            <TextInput 
              style={styles.input} 
              defaultValue="000000000"
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.lettersAndIcons}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Correo Electrónico</Text>
            <TextInput 
              style={styles.input} 
              defaultValue="correo@gmail.com"
              keyboardType="email-address"
              placeholderTextColor={COLORS.lettersAndIcons}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Apartamento Nro.</Text>
            <TextInput 
              style={styles.input} 
              defaultValue="105"
              keyboardType="numeric"
              placeholderTextColor={COLORS.lettersAndIcons}
            />
          </View>

          {/* Switch */}
          <View style={styles.switchContainer}>
            <Text style={styles.inputLabel}>¿Hace Parte Del Consejo?</Text>
            <Switch
              trackColor={{ false: "#d3d3d3", true: COLORS.mainGreen }}
              thumbColor={"#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setIsConsejo(!isConsejo)}
              value={isConsejo}
            />
          </View>

          {/* Update Button */}
          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Actualizar Perfil</Text>
          </TouchableOpacity>

          {/* Extra bottom space for custom tab bar */}
          <View style={{ height: 130 }} />
        </ScrollView>
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
    backgroundColor: COLORS.backgroundGreenWhite,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: 10,
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: -60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: COLORS.backgroundGreenWhite,
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
    borderColor: COLORS.backgroundGreenWhite,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    width: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.lettersAndIcons,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.lettersAndIcons,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.lettersAndIcons,
    marginBottom: 5,
  },
  input: {
    backgroundColor: COLORS.lightGreen, // Light green matching the design
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.lettersAndIcons,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: COLORS.mainGreen,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },
  updateButtonText: {
    color: COLORS.lettersAndIcons,
    fontSize: 16,
    fontWeight: '600',
  }
});