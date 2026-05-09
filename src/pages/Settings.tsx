import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { theme } = useTheme();

  const settings = [
    {
      id: 'time-signature',
      title: '拍号设置',
      description: '小节数、节拍单位、节拍细分',
      path: '/settings/time-signature',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
    {
      id: 'bpm',
      title: '速度设置',
      description: '调整每分钟节拍数',
      path: '/settings/bpm',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
            参数设置
          </h1>
          <p style={{ color: theme.textSecondary }}>调整节拍器的参数配置</p>
        </div>

        <div className="space-y-4">
          {settings.map((item) => (
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
      </div>
    </div>
  );
};

export default Settings;
