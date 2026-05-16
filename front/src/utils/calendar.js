export const WEEKDAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/** Mes actual + los siguientes `extraMonths` (por defecto 3 → 4 meses en total) */
export function getUpcomingMonths(extraMonths = 3) {
  const today = new Date();
  const total = extraMonths + 1;
  const months = [];

  for (let i = 0; i < total; i += 1) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push({
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
      name: MONTH_NAMES[date.getMonth()],
    });
  }

  return months;
}

/** Lunes = 0 … Domingo = 6 */
export function getMondayBasedWeekday(year, monthIndex) {
  const day = new Date(year, monthIndex, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Celdas del mes: null = vacío, número = día */
export function buildMonthGrid(year, monthIndex) {
  const leading = getMondayBasedWeekday(year, monthIndex);
  const totalDays = getDaysInMonth(year, monthIndex);
  const cells = [];

  for (let i = 0; i < leading; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

export function formatDateLabel(day, monthName) {
  return `${day} De ${monthName}`;
}

export function parseTimeRange(timeRange) {
  const [start, end] = timeRange.split(' - ').map((s) => s.trim());
  return { start, end };
}
