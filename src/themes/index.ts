export interface Theme {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  gradient: string;
  glow: string;
}

export const themes: Theme[] = [
  {
    id: 'tech',
    name: '科技感',
    description: '赛博朋克风格，霓虹发光效果',
    primary: '#ff6b00',
    secondary: '#00d4ff',
    accent: '#ff2d95',
    background: '#0a0a0f',
    surface: 'rgba(15, 15, 22, 0.85)',
    text: '#e0e0e0',
    textSecondary: '#888888',
    border: 'rgba(255, 255, 255, 0.06)',
    gradient: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
    glow: 'rgba(255, 107, 0, 0.4)'
  },
  {
    id: 'minimal',
    name: '简约',
    description: '极简主义，清爽干净',
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#0ea5e9',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: 'rgba(0, 0, 0, 0.1)',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    glow: 'rgba(37, 99, 235, 0.3)'
  },
  {
    id: 'cute',
    name: '可爱',
    description: '粉色系，可爱温馨',
    primary: '#ec4899',
    secondary: '#f472b6',
    accent: '#fbbf24',
    background: '#fff5f5',
    surface: '#ffffff',
    text: '#4c1d4c',
    textSecondary: '#be185d',
    border: 'rgba(236, 72, 153, 0.2)',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
    glow: 'rgba(236, 72, 153, 0.4)'
  },
  {
    id: 'nature',
    name: '自然',
    description: '绿色清新，自然舒适',
    primary: '#22c55e',
    secondary: '#16a34a',
    accent: '#84cc16',
    background: '#f0fdf4',
    surface: '#ffffff',
    text: '#14532d',
    textSecondary: '#166534',
    border: 'rgba(34, 197, 94, 0.2)',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    glow: 'rgba(34, 197, 94, 0.4)'
  },
  {
    id: 'ocean',
    name: '海洋',
    description: '蓝色海洋，宁静深邃',
    primary: '#0ea5e9',
    secondary: '#0284c7',
    accent: '#06b6d4',
    background: '#f0f9ff',
    surface: '#ffffff',
    text: '#0c4a6e',
    textSecondary: '#075985',
    border: 'rgba(14, 165, 233, 0.2)',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    glow: 'rgba(14, 165, 233, 0.4)'
  },
  {
    id: 'sunset',
    name: '日落',
    description: '暖色调，温暖浪漫',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fbbf24',
    background: '#fff7ed',
    surface: '#ffffff',
    text: '#7c2d12',
    textSecondary: '#9a3412',
    border: 'rgba(249, 115, 22, 0.2)',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    glow: 'rgba(249, 115, 22, 0.4)'
  },
  {
    id: 'dark',
    name: '暗黑',
    description: '深色主题，护眼舒适',
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#d946ef',
    background: '#1a1a2e',
    surface: 'rgba(30, 30, 46, 0.85)',
    text: '#e0e0e0',
    textSecondary: '#a1a1aa',
    border: 'rgba(255, 255, 255, 0.08)',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    glow: 'rgba(168, 85, 247, 0.4)'
  },
  {
    id: 'retro',
    name: '复古',
    description: '复古风格，怀旧情怀',
    primary: '#d946ef',
    secondary: '#c026d3',
    accent: '#f43f5e',
    background: '#fef3c7',
    surface: '#ffffff',
    text: '#4c1d4c',
    textSecondary: '#7c3aed',
    border: 'rgba(217, 70, 239, 0.2)',
    gradient: 'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)',
    glow: 'rgba(217, 70, 239, 0.4)'
  }
];

export const getThemeById = (id: string): Theme => {
  return themes.find(t => t.id === id) || themes[0];
};
