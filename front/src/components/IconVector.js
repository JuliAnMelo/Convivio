import React from 'react';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const IONICON_NAME_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

// Older seed announcements stored short enum strings that aren't valid Ionicons glyph names —
// map them to an equivalent glyph so they render through the same generic path.
const LEGACY_ICON_ALIASES = {
  teddy: 'gift-outline',
  cancel: 'close-circle',
  pqr: 'document-text',
};

export function isIoniconName(value) {
  return typeof value === 'string' && IONICON_NAME_RE.test(value);
}

// Renders the "vector" chosen for an announcement: either an Ionicons glyph name or a literal emoji.
export default function IconVector({ icon, size = 22, color = '#FFF' }) {
  const resolved = LEGACY_ICON_ALIASES[icon] || icon;

  if (isIoniconName(resolved)) {
    return <Ionicons name={resolved} size={size} color={color} />;
  }
  if (resolved) {
    return <Text style={{ fontSize: size, lineHeight: size * 1.2 }}>{resolved}</Text>;
  }
  return <Ionicons name="megaphone" size={size} color={color} />;
}
