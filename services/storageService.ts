import { UserState, GeneratedImage } from '../types';
import { DAILY_CREDITS, FIRST_DAY_CREDITS } from '../constants';

const STORAGE_KEY_USER = 'estampa_magica_user_v1';
const STORAGE_KEY_LIBRARY = 'estampa_magica_library_v1';
const COOKIE_NAME = 'estampa_magica_user_backup';

// Cookie Helpers
const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Strict";
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Simple fingerprint generation
const generateFingerprint = (): string => {
  const navigatorInfo = window.navigator.userAgent + window.navigator.language + screen.width + 'x' + screen.height;
  let hash = 0;
  for (let i = 0; i < navigatorInfo.length; i++) {
    const char = navigatorInfo.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'fp_' + Math.abs(hash).toString(16);
};

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const initializeUser = (): UserState => {
  const storedLS = localStorage.getItem(STORAGE_KEY_USER);
  const storedCookie = getCookie(COOKIE_NAME);
  const currentFingerprint = generateFingerprint();
  const today = getTodayString();

  let user: UserState | null = null;

  // Recovery Logic: Use data from either source. 
  // If both exist, we could prioritize the one with fewer credits (anti-cheat), 
  // but for now we prioritize LocalStorage if available, else Cookie.
  if (storedLS) {
    user = JSON.parse(storedLS);
  } else if (storedCookie) {
    user = JSON.parse(storedCookie);
  }

  if (user) {
    // Anti-cheat: Check fingerprint change
    if (user.fingerprint !== currentFingerprint && !user.isPremium) {
        // Update fingerprint but keep tracking. 
        // In strict mode, we might block here.
        user.fingerprint = currentFingerprint;
    }

    // Daily Reset Logic
    if (user.lastResetDate !== today) {
      // It's a new day
      let newCredits = DAILY_CREDITS;
      
      // If it's still the install day (unlikely if dates differ, but safeguard)
      if (user.installDate === today) {
         newCredits = FIRST_DAY_CREDITS;
      }
      
      user.credits = user.isPremium ? 30 : newCredits;
      user.lastResetDate = today;
    }

    saveUser(user); // Syncs both storages
    return user;
  } else {
    // New User
    const newUser: UserState = {
      credits: FIRST_DAY_CREDITS,
      lastResetDate: today,
      installDate: today,
      totalGenerated: 0,
      isPremium: false,
      fingerprint: currentFingerprint,
      isBlocked: false
    };
    saveUser(newUser);
    return newUser;
  }
};

export const saveUser = (user: UserState) => {
  const str = JSON.stringify(user);
  localStorage.setItem(STORAGE_KEY_USER, str);
  setCookie(COOKIE_NAME, str, 365); // Persist for 1 year
};

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

export const consumeCredit = (): boolean => {
  const user = initializeUser();
  if (user.isBlocked) return false;
  if (user.credits > 0) {
    user.credits -= 1;
    user.totalGenerated += 1;
    saveUser(user);
    return true;
  }
  return false;
};

// Check for incognito/storage availability
export const isStorageAvailable = () => {
    try {
        const x = '__storage_test__';
        localStorage.setItem(x, x);
        localStorage.removeItem(x);
        return true;
    } catch (e) {
        return false;
    }
};