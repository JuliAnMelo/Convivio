// Deterministic persona image by index — same person always gets the same face
// Note: only .jpg files are used since Metro bundler doesn't support .jfif or .avif
const PERSONAS = [
  require('../../assets/Images/hombre1.jpg'),
  require('../../assets/Images/hombre3.jpg'),
  require('../../assets/Images/hombre4.jpg'),
  require('../../assets/Images/mujer1.jpg'),
  require('../../assets/Images/mujer2.jpg'),
  require('../../assets/Images/mujer3.jpg'),
  require('../../assets/Images/mujer4.jpg'),
  require('../../assets/Images/residente.jpg'),
];

export function getPersonaImage(index) {
  return PERSONAS[Math.abs(index) % PERSONAS.length];
}

export function hashToIndex(str) {
  if (!str) return 0;
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getPersonaImageByName(name) {
  return getPersonaImage(hashToIndex(name));
}
