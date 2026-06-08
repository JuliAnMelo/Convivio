import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAccessibility, FONT_SIZE_OPTIONS } from '../context/AccessibilityContext';

/* ─── Small badge showing the WCAG criterion ───────────────────── */
function WcagBadge({ criterion, colors }) {
  return (
    <View style={[styles.badge, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '55' }]}>
      <Text style={[styles.badgeText, { color: colors.primary }]}>{criterion}</Text>
    </View>
  );
}

function SectionHeader({ label, colors, st, fw }) {
  return (
    <Text style={[styles.sectionHeader, { color: colors.primary, fontSize: st(11), fontWeight: fw('700') }]}
      accessibilityRole="header">
      {label.toUpperCase()}
    </Text>
  );
}

function RowSeparator({ colors }) {
  return <View style={[styles.separator, { backgroundColor: colors.separator }]} />;
}

function ToggleRow({ label, sublabel, value, onValueChange, wcag, colors, st, fw, minTarget }) {
  return (
    <View style={[styles.row, { minHeight: minTarget }]} accessibilityRole="none">
      <View style={styles.rowText}>
        <View style={styles.rowTopLine}>
          <Text style={[styles.rowLabel, { color: colors.text, fontSize: st(14), fontWeight: fw('500') }]}>
            {label}
          </Text>
          {wcag && <WcagBadge criterion={wcag} colors={colors} />}
        </View>
        {sublabel ? (
          <Text style={[styles.rowSub, { color: colors.textSoft, fontSize: st(12) }]}>
            {sublabel}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: colors.primary }}
        thumbColor="#FFF"
        accessibilityLabel={label}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      />
    </View>
  );
}

/* ─── Main screen ──────────────────────────────────────────────── */

export default function AccessibilityScreen({ navigation }) {
  const {
    colors, st, fw, minTarget,
    fontSizeIndex, setFontSizeIndex,
    highContrast,  setHighContrast,
    reduceMotion,  setReduceMotion,
    boldText,      setBoldText,
    largeTargets,  setLargeTargets,
  } = useAccessibility();

  const shared = { colors, st, fw, minTarget };

  // Derive the active conformance level for display
  const activeCount = [highContrast, boldText, reduceMotion, largeTargets].filter(Boolean).length;
  const conformanceLabel =
    activeCount === 0 ? 'Sin adaptaciones activas'
    : activeCount <= 2 ? 'Nivel AA (parcial)'
    : 'Nivel AAA (parcial)';

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
            Accesibilidad
          </Text>
          <View style={{ width: minTarget }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Live preview card */}
        <View
          style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          accessibilityLabel="Vista previa del texto con la configuración actual"
        >
          <Text style={[styles.previewTitle, { color: colors.textSoft, fontSize: st(11) }]}>
            VISTA PREVIA
          </Text>
          <Text style={[styles.previewLarge, { color: colors.text, fontSize: st(22), fontWeight: fw('700') }]}>
            Convivio
          </Text>
          <Text style={[styles.previewBody, { color: colors.text, fontSize: st(14), fontWeight: fw('400') }]}>
            Este texto refleja el tamaño y el peso de fuente seleccionados. El fondo y el texto aplican el contraste activo.
          </Text>
          <Text style={[styles.previewSmall, { color: colors.textSoft, fontSize: st(12) }]}>
            Texto secundario de ejemplo — hora, etiquetas, subtítulos
          </Text>
        </View>

        {/* ── TAMAÑO DE TEXTO (WCAG 1.4.4) ─────────────────── */}
        <SectionHeader label="Tamaño de texto" {...shared} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <WcagBadge criterion="WCAG 1.4.4" colors={colors} />
            <Text style={[styles.rowSub, { color: colors.textSoft, fontSize: st(12), flex: 1, marginLeft: 10 }]}>
              El texto puede aumentarse hasta 200 % sin perder funcionalidad
            </Text>
          </View>
          <RowSeparator colors={colors} />
          <View style={[styles.fontSizeRow, { paddingVertical: 14, paddingHorizontal: 14 }]}>
            {FONT_SIZE_OPTIONS.map((opt, idx) => {
              const active = fontSizeIndex === idx;
              const btnSize = 32 + idx * 8; // visually grows
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.fontBtn,
                    {
                      backgroundColor: active ? colors.primary : colors.background,
                      borderColor: active ? colors.primary : colors.border,
                      minWidth: minTarget,
                      minHeight: minTarget,
                    },
                  ]}
                  onPress={() => setFontSizeIndex(idx)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  accessibilityLabel={`Tamaño ${opt.key}`}
                >
                  <Text
                    style={{
                      fontSize: btnSize * 0.55,
                      fontWeight: active ? '700' : '400',
                      color: active ? '#FFF' : colors.text,
                    }}
                  >
                    A
                  </Text>
                  <Text style={{ fontSize: 10, color: active ? '#FFF' : colors.textSoft, marginTop: 2 }}>
                    {opt.key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── VISIÓN (WCAG 1.4.3 / 1.4.6 / 1.4.4) ─────────── */}
        <SectionHeader label="Visión" {...shared} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ToggleRow
            label="Alto contraste"
            sublabel="Colores con ratio ≥ 7:1 (blanco/negro). Nivel AAA."
            value={highContrast}
            onValueChange={setHighContrast}
            wcag="WCAG 1.4.6"
            {...shared}
          />
          <RowSeparator colors={colors} />
          <ToggleRow
            label="Texto en negrita"
            sublabel="Aumenta el peso de fuente de todos los textos."
            value={boldText}
            onValueChange={setBoldText}
            wcag="WCAG 1.4.4"
            {...shared}
          />
        </View>

        {/* ── MOVIMIENTO (WCAG 2.3.3) ───────────────────────── */}
        <SectionHeader label="Movimiento" {...shared} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ToggleRow
            label="Reducir animaciones"
            sublabel="Elimina transiciones para usuarios con trastornos vestibulares."
            value={reduceMotion}
            onValueChange={setReduceMotion}
            wcag="WCAG 2.3.3"
            {...shared}
          />
        </View>

        {/* ── INTERACCIÓN (WCAG 2.5.5) ─────────────────────── */}
        <SectionHeader label="Interacción" {...shared} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ToggleRow
            label="Áreas táctiles grandes"
            sublabel="Elementos interactivos mínimo de 52 × 52 px. Nivel AAA."
            value={largeTargets}
            onValueChange={setLargeTargets}
            wcag="WCAG 2.5.5"
            {...shared}
          />
        </View>

        {/* ── Nivel de conformidad ──────────────────────────── */}
        <SectionHeader label="Conformidad WCAG 2.1" {...shared} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.row, { paddingVertical: 16 }]}>
            <Ionicons
              name="checkmark-circle"
              size={st(22)}
              color={activeCount > 0 ? colors.primary : colors.textSoft}
              style={{ marginRight: 12 }}
            />
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.text, fontSize: st(14), fontWeight: fw('600') }]}>
                {conformanceLabel}
              </Text>
              <Text style={[styles.rowSub, { color: colors.textSoft, fontSize: st(12) }]}>
                Basado en las opciones activas en esta sesión
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:        { flex: 1 },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14 },
  backBtn:       { justifyContent: 'center', alignItems: 'center' },
  headerTitle:   { color: '#FFF', textAlign: 'center' },
  content:       { flex: 1, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: 4 },
  contentInner:  { padding: 20, paddingTop: 24 },
  sectionHeader: { marginBottom: 8, marginTop: 20, marginLeft: 4, letterSpacing: 0.8 },
  card:          { borderRadius: 18, borderWidth: 1, overflow: 'hidden', marginBottom: 4 },
  row:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
  rowTopLine:    { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  rowText:       { flex: 1 },
  rowLabel:      { },
  rowSub:        { marginTop: 3 },
  separator:     { height: 1, marginLeft: 14 },
  badge:         { borderRadius: 6, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText:     { fontSize: 10, fontWeight: '700' },
  fontSizeRow:   { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  fontBtn:       { alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 10, paddingVertical: 6 },
  previewCard:   { borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 8 },
  previewTitle:  { letterSpacing: 0.8, marginBottom: 8 },
  previewLarge:  { marginBottom: 6 },
  previewBody:   { lineHeight: 22, marginBottom: 6 },
  previewSmall:  { },
});
