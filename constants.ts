import { Preset } from './types';

export const APP_NAME = "Estampa Mágica";
export const BRAND_COLOR = "#6A0DAD";
export const ICON_URL = "https://imgur.com/PVjo40J.png";

export const DAILY_CREDITS = 20;
export const FIRST_DAY_CREDITS = 3;
export const PREMIUM_PRICE = "R$ 14,90";

export const PRESETS: Preset[] = [
  { id: 'infantil', label: 'Infantil', promptSuffix: 'Estilo aplicado: Infantil, fofo, colorido, traços suaves, vetor, ilustração para crianças.', icon: 'fa-baby' },
  { id: 'floral', label: 'Floral', promptSuffix: 'Estilo aplicado: Floral, botânico, elegante, flores detalhadas, aquarela ou vetor limpo.', icon: 'fa-leaf' },
  { id: 'natal', label: 'Natal', promptSuffix: 'Estilo aplicado: Natalino, festivo, vermelho e verde, elementos de natal, papai noel, renas.', icon: 'fa-tree' },
  { id: 'religioso', label: 'Religioso', promptSuffix: 'Estilo aplicado: Religioso, sereno, luz divina, simbologia sagrada, traços respeitosos.', icon: 'fa-cross' },
  { id: 'afro', label: 'Afro & Inclusão', promptSuffix: 'Estilo aplicado: Afro e Inclusão, representatividade, cores vibrantes, padrões étnicos, orgulho.', icon: 'fa-people-group' },
  { id: 'baby', label: 'Baby / Fraldas', promptSuffix: 'Estilo aplicado: Baby, tons pastéis, muito delicado, para bordado ou estampa de fralda.', icon: 'fa-baby-carriage' },
  { id: 'safari', label: 'Safari', promptSuffix: 'Estilo aplicado: Safari, animais da selva fofos, leão, girafa, tons de rosa e azul, infantil.', icon: 'fa-paw' },
  { id: 'lettering', label: 'Lettering Fem.', promptSuffix: 'Estilo aplicado: Lettering feminino, caligrafia elegante, frases motivacionais, flores ao redor.', icon: 'fa-font' },
  { id: 'santos', label: 'Santos / Católico', promptSuffix: 'Estilo aplicado: Católico, imagem de santo, iconografia clássica, auréola, detalhado.', icon: 'fa-church' },
  { id: 'evangelico', label: 'Evangélico', promptSuffix: 'Estilo aplicado: Evangélico, versículos, leão de judá, cruz vazia, moderno e inspirador.', icon: 'fa-book-bible' },
  { id: 'pano_prato', label: 'Pano de Prato', promptSuffix: 'Estilo aplicado: Pano de Prato, galinhas, frutas, cozinha, estilo rústico e acolhedor.', icon: 'fa-utensils' },
  { id: 'frases', label: 'Frases Curtas', promptSuffix: 'Estilo aplicado: Tipografia criativa, frases curtas, impacto visual, design minimalista.', icon: 'fa-comment' },
];

export const WARNING_MSG_PAYMENT = "⚠️ Se o pagamento do plano não for identificado, seu app será bloqueado automaticamente.";
export const BLOCK_MSG = "⚠️ Detectamos tentativa de reiniciar créditos. Seu acesso gratuito foi bloqueado. Para continuar usando o app, adquira o plano Premium.";