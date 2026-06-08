import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

/* ─── Sub-components ───────────────────────────────────────────── */

function SectionHeader({ label, colors, st, fw }) {
  return (
    <Text
      style={[styles.sectionHeader, { color: colors.primary, fontSize: st(11), fontWeight: fw('700') }]}
      accessibilityRole="header"
    >
      {label.toUpperCase()}
    </Text>
  );
}

function RowSeparator({ colors }) {
  return <View style={[styles.separator, { backgroundColor: colors.separator }]} />;
}

function NavRow({ icon, label, sublabel, onPress, colors, st, fw, minTarget, danger }) {
  const color = danger ? colors.danger : colors.text;
  return (
    <TouchableOpacity
      style={[styles.row, { minHeight: minTarget }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={sublabel}
    >
      {icon && (
        <View style={[styles.iconCircle, { backgroundColor: danger ? colors.danger : colors.primary }]}>
          <Ionicons name={icon} size={16} color="#FFF" />
        </View>
      )}
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color, fontSize: st(14), fontWeight: fw('500') }]}>
          {label}
        </Text>
        {sublabel ? (
          <Text style={[styles.rowSub, { color: colors.textSoft, fontSize: st(12) }]}>
            {sublabel}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={danger ? colors.danger : colors.textSoft} />
    </TouchableOpacity>
  );
}

function ValueRow({ icon, label, value, colors, st, fw, minTarget }) {
  return (
    <View style={[styles.row, { minHeight: minTarget }]}>
      {icon && (
        <View style={[styles.iconCircle, { backgroundColor: colors.textSoft }]}>
          <Ionicons name={icon} size={16} color="#FFF" />
        </View>
      )}
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.text, fontSize: st(14), fontWeight: fw('500') }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.valueText, { color: colors.textSoft, fontSize: st(13) }]}>{value}</Text>
    </View>
  );
}

/* ─── Main Screen ──────────────────────────────────────────────── */

export default function SettingsScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { colors, st, fw, minTarget } = useAccessibility();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
      ],
    );
  };

  const placeholder = (label) =>
    Alert.alert(label, 'Esta función estará disponible próximamente.');

  const shared = { colors, st, fw, minTarget };

  return (
    <View style={[styles.screen, { backgroundColor: colors.screenBg }]}>
      {/* Header */}
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { minWidth: minTarget, minHeight: minTarget }]}
            accessibilityLabel="Volver"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: st(18), fontWeight: fw('700') }]}>
            Configuración
          </Text>
          <View style={{ width: minTarget }} />
        </View>
      </SafeAreaView>

      {/* Content */}
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* CUENTA */}
        <SectionHeader label="Cuenta" {...shared} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <NavRow
            icon="create-outline"
            label="Editar perfil"
            onPress={() => navigation.navigate('EditProfile')}
            {...shared}
          />
          <RowSeparator colors={colors} />
          <NavRow
            icon="lock-closed-outline"
            label="Cambiar contraseña"
            sublabel="Próximamente"
            onPress={() => placeholder('Cambiar contraseña')}
            {...shared}
          />
          <RowSeparator colors={colors} />
          <NavRow
            icon="log-out-outline"
            label="Cerrar sesión"
            onPress={handleLogout}
            danger
            {...shared}
          />
        </View>

        {/* ACCESIBILIDAD */}
        <SectionHeader label="Accesibilidad" {...shared} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <NavRow
            icon="accessibility-outline"
            label="Opciones de accesibilidad"
            sublabel="Texto, contraste, animaciones"
            onPress={() => navigation.navigate('Accessibility')}
            {...shared}
          />
        </View>

        {/* ACERCA DE */}
        <SectionHeader label="Acerca de" {...shared} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ValueRow
            icon="information-circle-outline"
            label="Versión"
            value="1.0.0"
            {...shared}
          />
          <RowSeparator colors={colors} />
          <NavRow
            icon="document-text-outline"
            label="Términos y condiciones"
            onPress={() => placeholder('Términos y condiciones')}
            {...shared}
          />
          <RowSeparator colors={colors} />
          <NavRow
            icon="shield-checkmark-outline"
            label="Política de privacidad"
            onPress={() => placeholder('Política de privacidad')}
            {...shared}
          />
          <RowSeparator colors={colors} />
          <NavRow
            icon="mail-outline"
            label="Enviar comentarios"
            onPress={() => placeholder('Enviar comentarios')}
            {...shared}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1 },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14 },
  backBtn:      { justifyContent: 'center', alignItems: 'center' },
  headerTitle:  { color: '#FFF', textAlign: 'center' },
  content:      { flex: 1, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: 4 },
  contentInner: { padding: 20, paddingTop: 24 },
  sectionHeader:{ marginBottom: 8, marginTop: 20, marginLeft: 4, letterSpacing: 0.8 },
  card:         { borderRadius: 18, borderWidth: 1, overflow: 'hidden', marginBottom: 4 },
  row:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
  iconCircle:   { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowText:      { flex: 1 },
  rowLabel:     { },
  rowSub:       { marginTop: 2 },
  valueText:    { },
  separator:    { height: 1, marginLeft: 58 },
});
