// ─── Q-Ruta · Durango · Design Tokens ─────────────────────────────────────
// Paleta cálida inspirada en la arquitectura colonial, Sierra Madre y desierto

export const colors = {
  // Superficies
  background:  '#FBF4E8',   // pergamino cálido
  surface:     '#FFFDF6',   // blanco crema
  surfaceAlt:  '#F5EDD8',   // arena suave
  border:      '#E8D8BB',   // borde arena
  borderSoft:  '#F0E6CE',   // borde muy suave

  // Tipografía
  text: {
    primary:   '#2C1A0E',   // café oscuro
    secondary: '#7A5840',   // café medio
    muted:     '#BFA080',   // arena oscura
    inverse:   '#FFFDF6',   // para fondos oscuros
  },

  // Terracota (acción principal)
  terra: {
    DEFAULT: '#C04E2E',
    light:   '#F2C4AF',
    soft:    '#FDF0EA',
    dark:    '#8C3418',
    glow:    'rgba(192,78,46,0.25)',
  },

  // Dorado (acento secundario)
  gold: {
    DEFAULT: '#C97C12',
    light:   '#F5D08A',
    soft:    '#FEF6E0',
    border:  'rgba(201,124,18,0.3)',
    glow:    'rgba(201,124,18,0.2)',
  },

  // Pino/verde sierra
  pine: {
    DEFAULT: '#3D7355',
    light:   '#A8CBBA',
    soft:    '#EAF4EE',
    border:  'rgba(61,115,85,0.3)',
    glow:    'rgba(61,115,85,0.15)',
  },

  // Cielo azul Durango
  sky: {
    DEFAULT: '#3D82A8',
    light:   '#A8CEE2',
    soft:    '#E8F4FB',
    border:  'rgba(61,130,168,0.3)',
  },

  // Gradientes
  gradients: {
    logo:      'linear-gradient(135deg, #C04E2E, #C97C12)',
    heroCard:  'linear-gradient(145deg, #FFFDF6 0%, #FBF4E8 100%)',
    mapaCard:  'linear-gradient(145deg, #EAF4EE 0%, #D5EDE2 100%)',
    pagoCard:  'linear-gradient(145deg, #FEF6E0 0%, #FAE8BB 100%)',
    ctaBanner: 'linear-gradient(118deg, #C04E2E 0%, #9D3A1F 55%, #7A2C15 100%)',
  },

  // Compatibilidad con código existente (aliases)
  brand: {
    orange:        '#C04E2E',
    orangeGlow:    '#E07050',
    gold:          '#C97C12',
    goldBorder:    '#E8D8BB',
    goldSoft:      'rgba(201,124,18,0.08)',
    goldCardBorder:'rgba(201,124,18,0.3)',
    goldShadow:    'rgba(201,124,18,0.2)',
  },
  green: {
    border: 'rgba(61,115,85,0.3)',
    shadow: 'rgba(61,115,85,0.15)',
  },
  brown: {
    button: '#E8D8BB',
  },
  card: {
    green:      '#3D7355',
    lightGreen: '#EAF4EE',
    red:        '#C04E2E',
    dark:       '#FBF4E8',
  },
}