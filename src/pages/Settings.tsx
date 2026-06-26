import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { theme } = useTheme();
  const { state } = useMetronome();

  const settings = [
    {
      id: 'time-signature',
      title: '拍号设置',
      description: '设置小节数、节拍单位、节拍细分',
      icon: '🎼',
      path: '/settings/time-signature',
      color: '#8b5cf6',
      current: state.timeSignature,
    },
    {
      id: 'bpm',
      title: '速度设置',
      description: '调整每分钟节拍数',
      icon: '⚡',
      path: '/settings/bpm',
      color: '#3b82f6',
      current: `${state.bpm} BPM`,
    },
  ];

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
            参数设置
          </h1>
          <p style={{ color: theme.textSecondary }}>调整节拍器的参数配置</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {settings.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="p-5 rounded-2xl transition-all hover:scale-105 group"
              style={{ 
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform"
                style={{ 
                  background: `linear-gradient(135deg, ${item.color}20, ${item.color}40)`,
                  border: `1px solid ${item.color}40`,
                }}
              >
                {item.icon}
              </div>
              <h3 className="font-bold mb-1" style={{ color: theme.text }}>
                {item.title}
              </h3>
              <p className="text-xs mb-2 leading-relaxed" style={{ color: theme.textSecondary }}>
                {item.description}
              </p>
              <div 
                className="text-sm font-medium"
                style={{ color: item.color }}
              >
                {item.current}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
