import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: '🎵',
      title: '欢迎使用节拍器',
      description: '专业级节拍训练工具，帮助你掌握精准的节奏感。',
    },
    {
      icon: '⚡',
      title: '精准的节拍调度',
      description: '采用 Web Audio API 精准调度，节拍误差小于 1 毫秒，稳定可靠。',
    },
    {
      icon: '🎨',
      title: '丰富的主题选择',
      description: '8款精美主题自由切换，点击右上角调色板按钮即可更换。',
    },
    {
      icon: '🎤',
      title: '环境音量自动调节',
      description: '开启麦克风检测，节拍器会根据环境噪音自动调节音量大小。',
    },
    {
      icon: '⌨️',
      title: '快捷键操作',
      description: '空格键播放/暂停，方向键调整速度，上下滑动 BPM 数字快速调速。',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
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
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" />
      <div
        className="relative w-full max-w-sm animate-scaleIn"
        style={{
          backgroundColor: theme.background,
          borderRadius: '24px',
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110"
          style={{ backgroundColor: `${theme.text}10` }}
        >
          <svg className="w-4 h-4" style={{ color: theme.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 text-center">
          <div 
            className="text-6xl mb-6 animate-float"
            style={{ animationDuration: '3s' }}
          >
            {step.icon}
          </div>
          
          <h2 
            className="text-xl font-bold mb-3"
            style={{ 
              color: theme.text,
              fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : "'Inter', sans-serif",
            }}
          >
            {step.title}
          </h2>
          
          <p 
            className="text-sm leading-relaxed"
            style={{ color: theme.textSecondary }}
          >
            {step.description}
          </p>

          <div className="flex items-center justify-center gap-2 mt-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === currentStep ? '24px' : '8px',
                  backgroundColor: i === currentStep ? theme.primary : `${theme.text}20`,
                }}
              />
            ))}
          </div>
        </div>

        <div 
          className="p-5 flex gap-3 border-t"
          style={{ borderColor: theme.border }}
        >
          {currentStep > 0 ? (
            <button
              onClick={prevStep}
              className="flex-1 py-3.5 rounded-xl font-medium transition-all active:scale-95"
              style={{
                backgroundColor: `${theme.text}10`,
                color: theme.text,
              }}
            >
              上一步
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl font-medium transition-all active:scale-95"
              style={{
                backgroundColor: `${theme.text}10`,
                color: theme.textSecondary,
              }}
            >
              跳过
            </button>
          )}
          <button
            onClick={nextStep}
            className="flex-1 py-3.5 rounded-xl font-medium transition-all active:scale-95"
            style={{
              background: theme.gradient,
              color: '#fff',
            }}
          >
            {currentStep === steps.length - 1 ? '开始使用' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
