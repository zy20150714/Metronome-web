import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';
import { soundNames } from '../utils/audioUtils';

const Sound: React.FC = () => {
  const { state } = useMetronome();
  const { theme } = useTheme();

  const soundItems = [
    {
      id: 'detail',
      title: '声音详情',
      description: '选择音色并调整音量',
      path: '/sound/detail',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
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
            声音设置
          </h1>
          <p style={{ color: theme.textSecondary }}>选择节拍器的音色和音量</p>
        </div>

        <div className="space-y-4">
          {soundItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="block p-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ 
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.cornerRadius,
                boxShadow: theme.shadow
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${theme.primary}20` }}
                >
                  <div style={{ color: theme.primary }}>
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1" style={{ color: theme.text }}>
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {item.description}
                  </p>
                </div>
                <svg className="w-5 h-5" style={{ color: theme.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div 
          className="mt-6 p-6"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>
                当前音色
              </div>
              <div className="font-semibold text-lg" style={{ color: theme.text }}>
                {soundNames[state.soundType]}
              </div>
            </div>
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${theme.primary}20` }}
            >
              <svg className="w-6 h-6" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sound;
