import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { PQR_STATUS } from '../services/pqrConstants';
import { useAppTheme } from '../theme';

/** Solo texto, sin borde ni fondo */
export default function PqrStatusBadge({ statusId }) {
  const { colors, st, fw } = useAppTheme();
  const status = PQR_STATUS[statusId] || PQR_STATUS.esperando;
  const statusColor = statusId === 'respondido' ? colors.mainGreen : '#C87D0A';
  const styles = useMemo(() => StyleSheet.create({
    label: { fontSize: st(12), fontWeight: fw('700') },
  }), [st, fw]);

  return (
    <Text style={[styles.label, { color: statusColor }]}>{status.label}</Text>
  );
}
