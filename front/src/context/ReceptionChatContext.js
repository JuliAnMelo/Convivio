import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { fetchMessages, sendMessage as apiSendMessage } from '../services/chatService';

const POLL_INTERVAL_MS = 5000;

const ReceptionChatContext = createContext(null);

export function ReceptionChatProvider({ children }) {
  const { user } = useContext(AuthContext);
  const conjuntoId = user?.conjuntoId;
  const hasConjunto = !!conjuntoId;

  const [messages, setMessages] = useState([]);
  const [showBubble, setShowBubble] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [lastGuardMessage, setLastGuardMessage] = useState(null);
  const [lastResidentMessage, setLastResidentMessage] = useState(null);
  const [showGuardBubble, setShowGuardBubble] = useState(false);

  const chatIsOpenRef = useRef(false);
  const guardChatIsOpenRef = useRef(false);
  const lastTimestampRef = useRef(null);
  const pollRef = useRef(null);
  const prevConjuntoRef = useRef(null);

  const isGuard = user?.role === 'guarda';

  // Etiqueta "Torre X · Apto Y" del usuario actual (residente) para el chat
  const aptLabel = [
    user?.torre ? `Torre ${user.torre}` : null,
    user?.apt && user.apt !== 'Por asignar' ? `Apto ${user.apt}` : null,
  ].filter(Boolean).join(' · ');

  const loadMessages = async (initial = false) => {
    if (!conjuntoId) return;
    try {
      const since = initial ? null : lastTimestampRef.current;
      const data = await fetchMessages(conjuntoId, since);
      if (!data || data.length === 0) return;

      if (initial) {
        setMessages(data);
      } else {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newOnes = data.filter(m => !existingIds.has(m.id));
          if (newOnes.length === 0) return prev;

          newOnes.forEach(msg => {
            if (msg.senderRole === 'guard' && !isGuard) {
              setLastGuardMessage(msg);
              if (!chatIsOpenRef.current) setShowBubble(true);
            } else if (msg.senderRole === 'resident' && isGuard) {
              setLastResidentMessage(msg);
              if (!guardChatIsOpenRef.current) setShowGuardBubble(true);
            }
          });

          return [...prev, ...newOnes];
        });
      }

      lastTimestampRef.current = data[data.length - 1].createdAt;
    } catch (_) {
      // keep existing messages on error
    }
  };

  useEffect(() => {
    if (!conjuntoId) return;

    if (prevConjuntoRef.current !== conjuntoId) {
      prevConjuntoRef.current = conjuntoId;
      setMessages([]);
      lastTimestampRef.current = null;
      setShowBubble(false);
      setShowGuardBubble(false);
      setHasUnread(false);
      loadMessages(true);
    }

    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => loadMessages(false), POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [conjuntoId]);

  const sendMessage = async (text) => {
    if (!text.trim() || !conjuntoId) return;
    try {
      const msg = await apiSendMessage(conjuntoId, 'resident', user?.name || 'Residente', text.trim(), aptLabel);
      setMessages(prev => [...prev, msg]);
      lastTimestampRef.current = msg.createdAt;
    } catch (_) {}
  };

  const sendGuardMessage = async (_threadId, text) => {
    if (!text.trim() || !conjuntoId) return;
    try {
      const msg = await apiSendMessage(conjuntoId, 'guard', user?.name || 'Celador', text.trim());
      setMessages(prev => [...prev, msg]);
      lastTimestampRef.current = msg.createdAt;
    } catch (_) {}
  };

  const openChat = () => {
    setShowBubble(false);
    setHasUnread(false);
  };

  const dismissBubble = () => {
    setShowBubble(false);
    setHasUnread(true);
  };

  const discardBubble = () => setShowBubble(false);
  const clearUnread = () => setHasUnread(false);

  const setChatIsOpen = (value) => {
    chatIsOpenRef.current = value;
    if (value) {
      setShowBubble(false);
      setHasUnread(false);
    }
  };

  const setGuardChatIsOpen = (isOpen) => {
    guardChatIsOpenRef.current = isOpen;
    if (isOpen) setShowGuardBubble(false);
  };

  const triggerWelcomeMessage = () => {};

  const guardUnreadCount = showGuardBubble ? 1 : 0;

  // Guard-facing: threads format (single conjunto thread)
  const threads = hasConjunto ? [{
    id: 'main',
    residentName: 'Residentes',
    residentApt: conjuntoId,
    avatar: null,
    unreadCount: guardUnreadCount,
    messages: messages.map(m => ({
      id: m.id,
      sender: m.senderRole === 'guard' ? 'admin' : 'resident',
      name: m.senderName,
      apt: m.senderApt || '',
      text: m.text,
      at: m.createdAt,
    })),
  }] : [];

  const getThread = (threadId) => threads.find(t => t.id === threadId) || threads[0] || null;

  return (
    <ReceptionChatContext.Provider
      value={{
        messages: hasConjunto ? messages.map(m => ({
          id: m.id,
          sender: m.senderRole === 'guard' ? 'admin' : 'resident',
          name: m.senderName,
          apt: m.senderApt || '',
          text: m.text,
          at: m.createdAt,
        })) : [],
        isTyping: false,
        showBubble: hasConjunto && !isGuard && showBubble,
        hasUnread: hasConjunto && hasUnread,
        lastGuardMessage,
        sendMessage,
        openChat,
        dismissBubble,
        discardBubble,
        clearUnread,
        setChatIsOpen,
        triggerWelcomeMessage,

        threads: hasConjunto && isGuard ? threads : [],
        getThread,
        typingThreadId: null,
        lastResidentMessage,
        guardUnreadCount: hasConjunto && isGuard ? guardUnreadCount : 0,
        showGuardBubble: hasConjunto && isGuard && showGuardBubble,
        sendGuardMessage,
        setGuardChatIsOpen: (threadId, isOpen) => setGuardChatIsOpen(isOpen),
      }}
    >
      {children}
    </ReceptionChatContext.Provider>
  );
}

export function useReceptionChat() {
  const ctx = useContext(ReceptionChatContext);
  if (!ctx) throw new Error('useReceptionChat must be used within ReceptionChatProvider');
  return ctx;
}
