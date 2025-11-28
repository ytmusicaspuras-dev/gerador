
import { GeneratedImage } from '../types';

const STORAGE_KEY_LIBRARY = 'estampa_magica_library_v1';

export const getLibrary = (): GeneratedImage[] => {
  const stored = localStorage.getItem(STORAGE_KEY_LIBRARY);
  return stored ? JSON.parse(stored) : [];
};

export const saveToLibrary = (image: GeneratedImage) => {
  const lib = getLibrary();
  const newLib = [image, ...lib];
  localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(newLib));
};

export const removeFromLibrary = (id: string) => {
  const lib = getLibrary();
  const newLib = lib.filter(img => img.id !== id);
  localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(newLib));
};

export const toggleFavorite = (id: string) => {
  const lib = getLibrary();
  const newLib = lib.map(img => 
    img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
  );
  localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(newLib));
  return newLib;
};
