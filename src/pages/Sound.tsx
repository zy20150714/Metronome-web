import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';

const Sound: React.FC = () => {
  const { theme } = useTheme();
  const { state } = useMetronome();

  const soundTypes = [
    { id: 'click', name: '经典点击', icon: '🔊', color: '#3b82f6' },
    { id: 'woodblock', name: '木鱼', icon: '🥁', color: '#8b5cf6' },
    { id: 'hihat', name: '踩镲', icon: '🎛️', color: '#ec4899' },
    { id: 'bell', name: '钟声', icon: '🔔', color: '#f59e0b' },
    { id: 'digital', name: '电子音', icon: '💻', color: '#06b6d4' },
  ];

  const currentSound = soundTypes.find(s => s.id === state.soundType) || soundTypes[0];

  return (
    <div 
      className="min-h-screen p-4 sm:p-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="container mx-auto max-w-lg">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.cornerRadius,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </Link>
        </div>

        <div className="mb-6">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : "'Inter', sans-serif", color: theme.text }}
          >
            声音设置
          </h1>
          <p style={{ color: theme.textSecondary }}>选择节拍音色和调整音量</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/sound/main"
            className="p-5 rounded-2xl transition-all hover:scale-105 group"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform"
              style={{ 
                background: `linear-gradient(135deg, ${currentSound.color}20, ${currentSound.color}40)`,
                border: `1px solid ${currentSound.color}40`,
              }}
            >
              {currentSound.icon}
            </div>
            <h3 className="font-bold mb-1" style={{ color: theme.text }}>
              节拍音色
            </h3>
            <p className="text-xs mb-2 leading-relaxed" style={{ color: theme.textSecondary }}>
              选择不同的节拍声音
            </p>
            <div 
              className="text-sm font-medium"
              style={{ color: currentSound.color }}
            >
              {currentSound.name}
            </div>
          </Link>

          <Link
            to="/sound/main"
            className="p-5 rounded-2xl transition-all hover:scale-105 group"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary}20, ${theme.glow}40)`,
                border: `1px solid ${theme.primary}40`,
              }}
            >
              🔈
            </div>
            <h3 className="font-bold mb-1" style={{ color: theme.text }}>
              音量控制
            </h3>
            <p className="text-xs mb-2 leading-relaxed" style={{ color: theme.textSecondary }}>
              调整重音和普通音量
            </p>
            <div 
              className="text-sm font-medium"
              style={{ color: theme.primary }}
            >
              重音 {state.volume.accent}% · 普通 {state.volume.normal}%
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sound;
