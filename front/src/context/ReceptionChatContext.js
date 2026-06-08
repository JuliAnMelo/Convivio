import React, { createContext, useContext, useState, useRef } from 'react';
import { AuthContext } from './AuthContext';

// Avatars matched to each resident's gender (Jhon/Andrés → hombre, María → mujer)
const AVATAR_THREAD_1 = require('../../assets/Images/hombre1.jpg');
const AVATAR_THREAD_2 = require('../../assets/Images/mujer2.jpg');
const AVATAR_THREAD_3 = require('../../assets/Images/hombre3.jpg');

const PRIMARY_THREAD_ID = 'thread-1';

function makeMessage(sender, name, text, minutesAgo = 0) {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sender,
    name,
    text,
    at: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  };
}

// Multi-conversation seed: the guard can talk to many residents, like a Messenger inbox
const INITIAL_THREADS = [
  {
    id: PRIMARY_THREAD_ID,
    residentName: 'Jhon Garcia',
    residentApt: 'Apto 303',
    avatar: AVATAR_THREAD_1,
    unreadCount: 0,
    messages: [
      makeMessage('admin', 'Celador Juan', 'Hola, estoy en linea. En que puedo ayudarte?', 8),
      makeMessage('resident', 'Jhon Garcia', 'Buenas, necesito confirmar el ingreso de una visita.', 6),
    ],
  },
  {
    id: 'thread-2',
    residentName: 'María Torres',
    residentApt: 'Apto 402',
    avatar: AVATAR_THREAD_2,
    unreadCount: 1,
    messages: [
      makeMessage('resident', 'María Torres', 'Hola, ¿llegó un domicilio para mí esta mañana?', 50),
    ],
  },
  {
    id: 'thread-3',
    residentName: 'Andrés Ruiz',
    residentApt: 'Apto 105',
    avatar: AVATAR_THREAD_3,
    unreadCount: 0,
    messages: [
      makeMessage('resident', 'Andrés Ruiz', 'Buenas, dejé mi carro en la zona de visitantes, ¿hay algún problema?', 160),
      makeMessage('admin', 'Celador Juan', 'Todo en orden, Andrés. Gracias por avisar.', 155),
    ],
  },
];

const GUARD_AUTO_REPLIES = [
  'Recibido. Ya estoy validando con recepción.',
  'Listo, en un momento te confirmo la información.',
  'Gracias por avisar, en breve te respondo.',
];
const RESIDENT_AUTO_REPLIES = [
  'Listo, muchas gracias por la ayuda.',
  'Perfecto, quedo atento(a). Gracias.',
  'Entendido, muchas gracias celador.',
];

const ReceptionChatContext = createContext(null);

export function ReceptionChatProvider({ children }) {
  const { user } = useContext(AuthContext);
  const hasConjunto = !!user?.conjuntoId;
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [typingThreadId, setTypingThreadId] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [lastGuardMessage, setLastGuardMessage] = useState(null);
  const [lastResidentMessage, setLastResidentMessage] = useState(null);
  const [showGuardBubble, setShowGuardBubble] = useState(false);

  const guardReplyIndexRef = useRef(0);
  const residentReplyIndexRef = useRef(0);
  const chatIsOpenRef = useRef(false);
  const openGuardThreadRef = useRef(null);
  const welcomeSentRef = useRef(false);
  const timersRef = useRef({});

  const getThread = (threadId) => threads.find((t) => t.id === threadId);

  const guardUnreadCount = threads.reduce((sum, t) => sum + (t.unreadCount || 0), 0);

  const clearTimer = (threadId) => {
    if (timersRef.current[threadId]) {
      clearTimeout(timersRef.current[threadId]);
      timersRef.current[threadId] = null;
    }
  };

  const appendMessage = (threadId, message) => {
    setThreads((prev) => prev.map((t) => (
      t.id === threadId ? { ...t, messages: [...t.messages, message] } : t
    )));
  };

  const bumpUnread = (threadId) => {
    setThreads((prev) => prev.map((t) => (
      t.id === threadId ? { ...t, unreadCount: (t.unreadCount || 0) + 1 } : t
    )));
  };

  const addGuardReply = (threadId, text) => {
    const reply = makeMessage('admin', 'Celador Juan', text);
    appendMessage(threadId, reply);
    if (threadId === PRIMARY_THREAD_ID) {
      setLastGuardMessage(reply);
      if (!chatIsOpenRef.current) setShowBubble(true);
    }
  };

  const addResidentReply = (threadId, text) => {
    const thread = getThread(threadId);
    const reply = makeMessage('resident', thread?.residentName || 'Residente', text);
    appendMessage(threadId, reply);
    setLastResidentMessage({ ...reply, threadId });
    if (openGuardThreadRef.current !== threadId) {
      bumpUnread(threadId);
      setShowGuardBubble(true);
    }
  };

  // Called by the resident (the only real test resident maps to the primary thread)
  const sendMessage = (text) => {
    if (!text.trim()) return;
    const trimmed = text.trim();
    const outgoing = makeMessage('resident', 'Residente', trimmed);
    appendMessage(PRIMARY_THREAD_ID, outgoing);
    setLastResidentMessage({ ...outgoing, threadId: PRIMARY_THREAD_ID });

    if (openGuardThreadRef.current !== PRIMARY_THREAD_ID) {
      bumpUnread(PRIMARY_THREAD_ID);
      setShowGuardBubble(true);
    }

    clearTimer(PRIMARY_THREAD_ID);
    setTypingThreadId(PRIMARY_THREAD_ID);
    const replyText = GUARD_AUTO_REPLIES[guardReplyIndexRef.current % GUARD_AUTO_REPLIES.length];
    guardReplyIndexRef.current += 1;
    timersRef.current[PRIMARY_THREAD_ID] = setTimeout(() => {
      setTypingThreadId((prev) => (prev === PRIMARY_THREAD_ID ? null : prev));
      addGuardReply(PRIMARY_THREAD_ID, replyText);
    }, 15000);
  };

  // Called by the guard from a specific conversation in the chat inbox
  const sendGuardMessage = (threadId, text) => {
    if (!text.trim()) return;
    const trimmed = text.trim();
    clearTimer(threadId);
    setTypingThreadId((prev) => (prev === threadId ? null : prev));
    addGuardReply(threadId, trimmed);

    // Mock conversations simulate the resident answering back, so the inbox feels alive
    if (threadId !== PRIMARY_THREAD_ID) {
      setTypingThreadId(threadId);
      const replyText = RESIDENT_AUTO_REPLIES[residentReplyIndexRef.current % RESIDENT_AUTO_REPLIES.length];
      residentReplyIndexRef.current += 1;
      timersRef.current[threadId] = setTimeout(() => {
        setTypingThreadId((prev) => (prev === threadId ? null : prev));
        addResidentReply(threadId, replyText);
      }, 12000);
    }
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

  // Marks a specific conversation as actively viewed by the guard (clears its unread badge)
  const setGuardChatIsOpen = (threadId, isOpen) => {
    openGuardThreadRef.current = isOpen ? threadId : null;
    if (isOpen) {
      setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t)));
      setShowGuardBubble(false);
    }
  };

  const triggerWelcomeMessage = (role) => {
    if (welcomeSentRef.current) return;
    welcomeSentRef.current = true;
    if (role === 'guarda') {
      // Simulate a resident reaching out so the guard's floating chat comes alive too
      setTimeout(() => {
        addResidentReply('thread-2', 'Buenas, ¿me puede confirmar si ya llegó mi encomienda?');
      }, 8000);
    } else {
      setTimeout(() => {
        addGuardReply(PRIMARY_THREAD_ID, 'Señor jhon, le llego un pedido a domicilio');
      }, 8000);
    }
  };

  const primaryThread = getThread(PRIMARY_THREAD_ID);

  return (
    <ReceptionChatContext.Provider
      value={{
        // Resident-facing (always the primary thread) — empty until the user joins a conjunto
        messages: hasConjunto ? (primaryThread?.messages || []) : [],
        isTyping: hasConjunto && typingThreadId === PRIMARY_THREAD_ID,
        showBubble: hasConjunto && showBubble,
        hasUnread: hasConjunto && hasUnread,
        lastGuardMessage,
        sendMessage,
        openChat,
        dismissBubble,
        discardBubble,
        clearUnread,
        setChatIsOpen,
        triggerWelcomeMessage,

        // Guard-facing (Messenger-style inbox across many residents) — same gating
        threads: hasConjunto ? threads : [],
        getThread,
        typingThreadId,
        lastResidentMessage,
        guardUnreadCount: hasConjunto ? guardUnreadCount : 0,
        showGuardBubble: hasConjunto && showGuardBubble,
        sendGuardMessage,
        setGuardChatIsOpen,
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
