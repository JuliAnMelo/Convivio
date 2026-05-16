import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { PQR_STATUS } from '../services/pqrConstants';

/** Solo texto, sin borde ni fondo */
export default function PqrStatusBadge({ statusId }) {
  const status = PQR_STATUS[statusId] || PQR_STATUS.esperando;

  return (
    <Text style={[styles.label, { color: status.color }]}>{status.label}</Text>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '700' },
});
