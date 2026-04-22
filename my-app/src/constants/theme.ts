// ProEstoque - Design System Theme
// Paleta inspirada em roxo/violeta moderno com tons neutros escuros

export const colors = {
  // Primárias
  primary: '#7C3AED',         // Roxo principal
  primaryLight: '#9D6BF5',    // Roxo claro (hover/states)
  primaryDark: '#5B21B6',     // Roxo escuro (pressed)
  primarySubtle: '#EDE9FE',   // Roxo bem suave (backgrounds)

  // Secundárias
  secondary: '#06B6D4',       // Ciano
  secondaryLight: '#67E8F9',  // Ciano claro
  secondaryDark: '#0E7490',   // Ciano escuro

  // Neutros
  background: '#F8F7FF',      // Fundo geral levemente lilás
  surface: '#FFFFFF',         // Superfície de cards
  surfaceAlt: '#F3F0FF',      // Superfície alternativa

  // Textos
  textPrimary: '#1E1B4B',     // Texto principal (quase preto)
  textSecondary: '#6B7280',   // Texto secundário (cinza)
  textMuted: '#9CA3AF',       // Texto apagado
  textOnPrimary: '#FFFFFF',   // Texto sobre cor primária

  // Borders
  border: '#E5E7EB',          // Borda padrão
  borderFocus: '#7C3AED',     // Borda ao focar
  borderError: '#EF4444',     // Borda de erro

  // Status
  success: '#10B981',         // Verde sucesso
  successLight: '#D1FAE5',    // Verde suave
  error: '#EF4444',           // Vermelho erro
  errorLight: '#FEE2E2',      // Vermelho suave
  warning: '#F59E0B',         // Amarelo aviso
  warningLight: '#FEF3C7',    // Amarelo suave
  info: '#3B82F6',            // Azul info

  // Overlay / Modal
  overlay: 'rgba(30, 27, 75, 0.5)',
};

export const typography = {
  // Famílias
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },

  // Tamanhos
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 22,
    '2xl': 26,
    '3xl': 32,
    '4xl': 40,
  },

  // Pesos
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },

  // Alturas de linha
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
};

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export default theme;
