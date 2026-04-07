// ==========================================================
// PROJETO MIDAS — Design Tokens (espelho do tema web)
// Extraídos de: src/styles/theme.css e das páginas .tsx
// ==========================================================

export const Colors = {
  // ── Cores principais da identidade Midas ──────────────────
  wine:        '#4B0012',   // --midas-wine
  wineDeep:    '#1f0208',   // sidebar gradient start
  wineMid:     '#3a0610',   // sidebar gradient mid
  wineDark:    '#130105',   // sidebar gradient end
  wineCard:    '#2a0208',   // dashboard hero gradient start
  wine530:     '#530816',   // dashboard hero gradient mid
  wine220:     '#220206',   // dashboard hero gradient end
  wineButton:  '#8f061d',   // botão principal
  wineRed:     '#ff3554',   // botão gradient start

  gold:        '#FFC107',   // --midas-yellow
  goldDark:    '#FFB300',   // --midas-yellow-dark
  goldLight:   '#ffb84d',   // hero accent
  goldBtn:     '#ffca70',   // botão gold hover

  // ── Superfícies e bordas ───────────────────────────────────
  background:  '#ffffff',
  cardBg:      'rgba(255,255,255,0.92)',
  border:      '#f1d7dc',
  borderLight: '#f3e2e6',
  surfaceLight:'#fff8f9',
  inputBg:     '#f3f3f5',

  // ── Texto ──────────────────────────────────────────────────
  textPrimary:   '#24040a',
  textSecondary: '#7a4f58',
  textMuted:     '#9f5b68',
  textBody:      '#744850',
  textLabel:     '#a55b67',

  // ── Semânticas ─────────────────────────────────────────────
  success:       '#16a34a',
  successBg:     '#d1fae5',
  successText:   '#065f46',
  danger:        '#ef4444',
  dangerBg:      '#fee2e2',
  dangerText:    '#991b1b',
  warning:       '#f59e0b',
  warningBg:     '#fef3c7',
  warningText:   '#92400e',
  info:          '#0ea5e9',
  infoBg:        '#e0f2fe',
  infoText:      '#0369a1',

  // ── Gráficos (Recharts colors espelho) ────────────────────
  chartGreen:    '#16a34a',
  chartRed:      '#ef4444',
  chartWine:     '#8f061d',
  chartAmber:    '#d97706',
  chartTeal:     '#0f766e',

  // ── Branco com opacidades (sidebar / hero) ─────────────────
  white10:  'rgba(255,255,255,0.10)',
  white06:  'rgba(255,255,255,0.06)',
  white55:  'rgba(255,255,255,0.55)',
  white70:  'rgba(255,255,255,0.70)',
  white75:  'rgba(255,255,255,0.75)',
};

export const Gradients = {
  // Fundo da tela de login e sidebar
  heroWine: ['#170105', '#3c0610', '#120104'] as const,
  sidebar:  ['#1f0208', '#3a0610', '#130105'] as const,

  // Card hero do Dashboard
  cardHero: ['#2a0208', '#530816', '#220206'] as const,

  // Botão primário
  btnPrimary: ['#ff3554', '#8f061d'] as const,

  // Fundo do painel de login (lado direito)
  loginPanel: ['rgba(255,255,255,0.96)', 'rgba(255,244,245,0.94)'] as const,
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xl2: 24,
  xl3: 32,
  xl4: 40,
};

export const Radius = {
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  full: 999,
};

export const FontSize = {
  xs:   11,
  sm:   12,
  base: 14,
  md:   16,
  lg:   18,
  xl:   20,
  xl2:  24,
  xl3:  30,
  xl4:  36,
};

export const Shadow = {
  card: {
    shadowColor:   '#730b1f',
    shadowOffset:  { width: 0, height: 12 },
    shadowOpacity: 0.10,
    shadowRadius:  28,
    elevation:     8,
  },
  hero: {
    shadowColor:   '#420410',
    shadowOffset:  { width: 0, height: 20 },
    shadowOpacity: 0.30,
    shadowRadius:  50,
    elevation:     16,
  },
  btn: {
    shadowColor:   '#900a22',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius:  20,
    elevation:     10,
  },
};
