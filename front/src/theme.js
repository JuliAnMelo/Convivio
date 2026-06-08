import { useMemo } from 'react';
import { useAccessibility } from './context/AccessibilityContext';

export const COLORS = {
  darkmodeGreenBlack: 'rgba(3, 19, 20, 1)',
  backgroundDarkmode: 'rgba(5, 34, 36, 1)',
  lettersAndIcons: 'rgba(9, 48, 48, 1)',
  darkmodeGreenBar: 'rgba(14, 62, 62, 1)',
  mainGreen: 'rgba(0, 150, 113, 1)',
  lightGreen: 'rgba(223, 247, 226, 1)',
  backgroundGreenWhite: 'rgba(241, 255, 242, 1)',
  lightBlueButton: 'rgba(108, 181, 253, 1)',
  blueButton: 'rgba(50, 153, 255, 1)',
  oceanBlueButton: 'rgba(0, 104, 255, 1)',
  errorRed: '#F04C4C',
};

export const TYPOGRAPHY = {
  paragraph: { fontSize: 13, fontWeight: '300' }, // Poppins
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.24 }, // Poppins (-0.01em)
  subtitle: { fontSize: 18, fontWeight: '600' }, // Poppins
  subtext: { fontSize: 24, fontWeight: '500' }, // League Spartan
};

export function useAppTheme() {
  const { colors, st, fw, minTarget, shouldAnimate } = useAccessibility();

  const appColors = useMemo(
    () => ({
      darkmodeGreenBlack: colors.text,
      backgroundDarkmode: colors.primaryDark,
      lettersAndIcons: colors.text,
      darkmodeGreenBar: colors.primaryDark,
      mainGreen: colors.primary,
      lightGreen: colors.border,
      backgroundGreenWhite: colors.background,
      lightBlueButton: colors.blue,
      blueButton: colors.blue,
      oceanBlueButton: colors.blue,
      errorRed: colors.danger,
      card: colors.card,
      text: colors.text,
      textSoft: colors.textSoft,
      border: colors.border,
      separator: colors.separator,
    }),
    [colors],
  );

  const typography = useMemo(
    () => ({
      paragraph: { fontSize: st(13), fontWeight: fw('300') },
      title: { fontSize: st(26), fontWeight: fw('700'), letterSpacing: -0.24 },
      subtitle: { fontSize: st(18), fontWeight: fw('600') },
      subtext: { fontSize: st(24), fontWeight: fw('500') },
    }),
    [st, fw],
  );

  return {
    colors: appColors,
    typography,
    st,
    fw,
    minTarget,
    shouldAnimate,
  };
}
