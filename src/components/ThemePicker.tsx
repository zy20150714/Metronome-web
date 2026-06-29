import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemePicker: React.FC<ThemePickerProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, themes } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getCardShape = (cardStyle: string) => {
    switch (cardStyle) {
      case 'organic':
        return 'rounded-[28px]';
      case 'sharp':
        return 'rounded-lg';
      case 'rounded':
        return 'rounded-xl';
      case 'glass':
      default:
        return 'rounded-2xl';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        style={{ animationDuration: '200ms' }}
      />
      <div
        className="relative w-full max-w-lg mx-4 mb-0 sm:mb-0 animate-slideUp"
        style={{
          backgroundColor: theme.background,
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.4)',
          maxHeight: '85vh',
          overflow: 'hidden',
          animationDuration: '300ms'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: theme.border }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text }}>选择主题</h2>
            <p className="text-sm mt-0.5" style={{ color: theme.textSecondary }}>
              共 {themes.length} 款主题
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: `${theme.text}10` }}
          >
            <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                }}
                className={`p-4 ${getCardShape(t.cardStyle)} transition-all duration-300 text-left relative overflow-hidden active:scale-95`}
                style={{
                  backgroundColor: t.surface,
                  border: theme.id === t.id ? `2px solid ${t.primary}` : `1px solid ${t.border}`,
                  boxShadow: theme.id === t.id ? `0 0 20px ${t.glow}` : 'none'
                }}
              >
                <div
                  className="absolute top-0 right-0 w-16 h-16 opacity-20"
                  style={{
                    background: t.gradient,
                    borderRadius: t.cardStyle === 'organic' ? '0 100% 0 100%' : '0 100% 0 0'
                  }}
                />

                <div className="relative">
                  <div
                    className="w-full h-12 rounded-lg mb-3 flex items-center justify-center"
                    style={{
                      background: t.gradient,
                      borderRadius: t.cardStyle === 'organic' ? '16px' : t.cardStyle === 'sharp' ? '6px' : '10px'
                    }}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="font-semibold text-sm"
                        style={{
                          color: t.text,
                          fontFamily: t.id === 'tech' ? "'Orbitron', monospace" :
                            t.id === 'retro' ? "'Georgia', serif" : "'Inter', sans-serif"
                        }}
                      >
                        {t.name}
                      </h3>
                      <p
                        className="text-xs mt-0.5 line-clamp-1"
                        style={{ color: t.textSecondary }}
                      >
                        {t.description}
                      </p>
                    </div>
                    {theme.id === t.id && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: t.primary }}
                      >
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePicker;
