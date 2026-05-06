import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Themes: React.FC = () => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              color: theme.text,
              border: `1px solid ${theme.border}`
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </Link>
        </div>

        <div className="mb-10 text-center">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "'Orbitron', monospace", color: theme.text }}
          >
            选择主题
          </h1>
          <p style={{ color: theme.textSecondary }}>选择你喜欢的界面风格</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="p-4 rounded-xl transition-all duration-300 text-left"
              style={{ 
                backgroundColor: t.surface,
                border: theme.id === t.id ? `2px solid ${t.primary}` : `1px solid ${t.border}`,
                boxShadow: theme.id === t.id ? `0 0 20px ${t.glow}` : 'none'
              }}
            >
              <div 
                className="w-full h-16 rounded-lg mb-3"
                style={{ background: t.gradient }}
              />
              <div className="flex items-center justify-between">
                <div>
                  <h3 
                    className="font-semibold"
                    style={{ color: t.text }}
                  >
                    {t.name}
                  </h3>
                  <p 
                    className="text-xs"
                    style={{ color: t.textSecondary }}
                  >
                    {t.description}
                  </p>
                </div>
                {theme.id === t.id && (
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: t.primary }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Themes;
