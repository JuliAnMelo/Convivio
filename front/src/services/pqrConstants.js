import { COLORS } from '../theme';

export const PQR_TYPES = {
  peticion: { id: 'peticion', label: 'Petición', icon: 'document-text' },
  queja: { id: 'queja', label: 'Queja', icon: 'chatbubble-ellipses' },
  reclamo: { id: 'reclamo', label: 'Reclamo', icon: 'alert-circle' },
};

/** Solo dos estados visibles para el residente */
export const PQR_STATUS = {
  esperando: {
    id: 'esperando',
    label: 'Esperando respuesta',
    color: '#F5A623',
    bg: 'rgba(245, 166, 35, 0.2)',
  },
  respondido: {
    id: 'respondido',
    label: 'Respondido por administración',
    color: COLORS.mainGreen,
    bg: 'rgba(0, 150, 113, 0.2)',
  },
};

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
