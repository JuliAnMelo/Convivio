import React, { createContext, useContext, useState } from 'react';
import { AuthContext } from './AuthContext';

export const FONT_SIZE_OPTIONS = [
  { key: 'pequeño',   label: 'A',  scale: 0.85 },
  { key: 'normal',    label: 'A',  scale: 1.0  },
  { key: 'grande',    label: 'A',  scale: 1.2  },
  { key: 'muy grande',label: 'A',  scale: 1.45 },
];

// Standard app palette
export const NORMAL_COLORS = {
  primary:          'rgba(0, 150, 113, 1)',
  primaryDark:      '#009E77',
  background:       'rgba(241, 255, 242, 1)',
  screenBg:         'rgba(0, 150, 113, 1)',
  card:             '#FFFFFF',
  text:             'rgba(9, 48, 48, 1)',
  textSoft:         '#5C7070',
  border:           'rgba(223, 247, 226, 1)',
  blue:             'rgba(0, 104, 255, 1)',
  danger:           '#FF3B30',
  separator:        '#ECF5EC',
};

// Navy-blue palette shown to guard accounts (role 'guarda')
export const GUARD_COLORS = {
  primary:          'rgba(27, 58, 92, 1)',
  primaryDark:      '#142C46',
  background:       'rgba(235, 242, 250, 1)',
  screenBg:         'rgba(27, 58, 92, 1)',
  card:             '#FFFFFF',
  text:             'rgba(15, 30, 48, 1)',
  textSoft:         '#5C6B7A',
  border:           'rgba(219, 234, 250, 1)',
  blue:             'rgba(0, 104, 255, 1)',
  danger:           '#FF3B30',
  separator:        '#E3ECF7',
};

// WCAG 2.1 AAA contrast ratios ≥ 7:1 against white/black
export const HIGH_CONTRAST_COLORS = {
  primary:          '#004D3A',   // ~14:1 on white
  primaryDark:      '#003028',
  background:       '#F0F0F0',
  screenBg:         '#004D3A',
  card:             '#FFFFFF',
  text:             '#000000',   // 21:1 on white
  textSoft:         '#1A1A1A',   // ~16:1 on white
  border:           '#004D3A',
  blue:             '#001F82',   // ~18:1 on white
  danger:           '#8B0000',   // ~11:1 on white
  separator:        '#004D3A',
};

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // 'normal'
  const [highContrast,  setHighContrast]  = useState(false);
  const [reduceMotion,  setReduceMotion]  = useState(false);
  const [boldText,      setBoldText]      = useState(false);
  const [largeTargets,  setLargeTargets]  = useState(false);

  const option     = FONT_SIZE_OPTIONS[fontSizeIndex];
  const fontScale  = option.scale;
  const isGuard    = user?.role === 'guarda';
  const colors     = highContrast ? HIGH_CONTRAST_COLORS : (isGuard ? GUARD_COLORS : NORMAL_COLORS);

  /** Scale a numeric font size */
  const st = (size) => Math.round(size * fontScale);

  /** Return font weight, bumping +200 when boldText is on */
  const fw = (base = '400') => {
    if (!boldText) return base;
    const n = parseInt(base, 10);
    return String(Math.min(900, (isNaN(n) ? 400 : n) + 200));
  };

  /** Minimum touch-target size (px). WCAG 2.5.5 recommends 44 px; we go 52 for AAA. */
  const minTarget = largeTargets ? 52 : 44;

  return (
    <AccessibilityContext.Provider
      value={{
        fontSizeIndex, setFontSizeIndex,
        fontScale,     fontSizeKey: option.key,
        highContrast,  setHighContrast,
        reduceMotion,  setReduceMotion,
        boldText,      setBoldText,
        largeTargets,  setLargeTargets,
        colors, st, fw, minTarget,
        shouldAnimate: !reduceMotion,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
