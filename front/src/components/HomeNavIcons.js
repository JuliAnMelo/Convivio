import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';

/**
 * Iconos de navegación (Inicio / Perfil) flotantes en la esquina superior
 * derecha del home, sobre el fondo verde. Reemplaza la barra inferior.
 */
export default function HomeNavIcons({ navigation, active = 'Inicio', showHome = true }) {
  const { colors, minTarget } = useAppTheme();
  const insets = useSafeAreaInsets();
  const size = Math.max(40, minTarget);

  const Item = ({ route, iconActive, iconInactive, label }) => {
    const isActive = active === route;
    return (
      <TouchableOpacity
        style={[
          styles.iconButton,
          { width: size, height: size },
          isActive && { backgroundColor: 'rgba(255,255,255,0.25)' },
        ]}
        onPress={() => navigation.navigate(route)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: isActive }}
        activeOpacity={0.8}
      >
        <Ionicons name={isActive ? iconActive : iconInactive} size={24} color="#FFF" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.row, { top: insets.top + 8 }]}>
      {showHome && (
        <Item route="Inicio" iconActive="home" iconInactive="home-outline" label="Inicio" />
      )}
      <Item route="Perfil" iconActive="person" iconInactive="person-outline" label="Perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    right: 14,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
});
