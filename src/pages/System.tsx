import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const System: React.FC = () => {
  const { theme } = useTheme();

  const systemItems = [
    {
      id: 'cookie',
      title: 'Cookie 设置',
      description: '管理Cookie和本地存储',
      path: '/system/cookie',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
            系统设置
          </h1>
          <p style={{ color: theme.textSecondary }}>应用设置和帮助信息</p>
        </div>

        <div className="space-y-4">
          {systemItems.map((item) => (
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
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${theme.primary}20` }}
            >
              <svg className="w-6 h-6" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="font-semibold" style={{ color: theme.text }}>关于应用</span>
              <p className="text-sm" style={{ color: theme.textSecondary }}>节拍器 v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default System;
