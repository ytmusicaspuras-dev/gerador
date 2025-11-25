export interface GeneratedImage {
  id: string;
  data: string; // base64
  prompt: string;
  presetName: string;
  createdAt: number;
  tags: string[];
}

export interface UserState {
  credits: number;
  lastResetDate: string; // YYYY-MM-DD
  installDate: string; // YYYY-MM-DD
  totalGenerated: number;
  isPremium: boolean;
  fingerprint: string;
  isBlocked: boolean;
}

export interface Preset {
  id: string;
  label: string;
  promptSuffix: string; // The "invisible" part
  icon: string; // FontAwesome class
}

export type View = 'generator' | 'library' | 'profile';