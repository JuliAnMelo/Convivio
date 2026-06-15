import { api } from './api';

export async function fetchMessages(conjuntoId, since = null) {
  const params = `conjuntoId=${encodeURIComponent(conjuntoId)}${since ? `&since=${encodeURIComponent(since)}` : ''}`;
  return api.get(`/chat/messages?${params}`);
}

export async function sendMessage(conjuntoId, senderRole, senderName, text, senderApt = '') {
  return api.post('/chat/messages', { conjuntoId, senderRole, senderName, text, senderApt });
}
