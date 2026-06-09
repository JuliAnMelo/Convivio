import Constants from 'expo-constants';

// Detecta automáticamente la IP del servidor según el entorno:
// - Expo Go (dispositivo físico): usa la IP del bundler de Metro
// - Emulador / simulador: usa localhost
// No hay que cambiar nada al clonar el proyecto.
function getApiUrl() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest?.debuggerHost ??
    '';
  const host = hostUri.split(':')[0];
  if (host && host !== 'localhost' && host !== '') {
    return `http://${host}:5000/api`;
  }
  return 'http://localhost:5000/api';
}

export const API_BASE_URL = getApiUrl();

async function request(method, endpoint, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, opts);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  return data;
}

export const api = {
  get: (endpoint) => request('GET', endpoint),
  post: (endpoint, body) => request('POST', endpoint, body),
  put: (endpoint, body) => request('PUT', endpoint, body),
  delete: (endpoint) => request('DELETE', endpoint),
};
