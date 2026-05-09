import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface OnboardingStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const ONBOARDING_KEY = 'hasSeenOnboarding';

const steps: OnboardingStep[] = [
  {
    id: 'play-button',
    target: 'play-button',
    title: '播放控制',
    description: '点击中央按钮开始或暂停节拍',
    position: 'bottom'
  },
  {
    id: 'bpm-slider',
    target: 'bpm-slider',
    title: '速度调节',
    description: '拖动滑块或点击加减按钮调整每分钟节拍数',
    position: 'top'
  },
  {
    id: 'settings-nav',
    target: 'settings-nav',
    title: '参数设置',
    description: '调整拍号、细分等详细参数',
    position: 'right'
  },
  {
    id: 'sound-nav',
    target: 'sound-nav',
    title: '声音设置',
    description: '选择节拍音色并调整音量',
    position: 'right'
  },
  {
    id: 'system-nav',
    target: 'system-nav',
    title: '系统设置',
    description: '管理Cookie和应用设置',
    position: 'right'
  }
];

const Onboarding: React.FC = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem(ONBOARDING_KEY);
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isVisible && steps[currentStep]) {
      const updateTargetRect = () => {
        const targetElement = document.querySelector(`[data-onboard="${steps[currentStep].target}"]`);
        if (targetElement) {
          setTargetRect(targetElement.getBoundingClientRect());
        } else {
          setTargetRect(null);
        }
      };

      updateTargetRect();
      window.addEventListener('resize', updateTargetRect);
      return () => window.removeEventListener('resize', updateTargetRect);
    }
  }, [isVisible, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    sessionStorage.setItem(ONBOARDING_KEY, 'true');
    setIsVisible(false);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      handleNext();
    }
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const getTooltipPosition = () => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const tooltipWidth = 280;
    const tooltipHeight = 160;

    switch (currentStepData.position) {
      case 'top':
        return {
          top: `${targetRect.top - tooltipHeight - 16}px`,
          left: `${targetRect.left + targetRect.width / 2 - tooltipWidth / 2}px`
        };
      case 'bottom':
        return {
          top: `${targetRect.bottom + 16}px`,
          left: `${targetRect.left + targetRect.width / 2 - tooltipWidth / 2}px`
        };
      case 'left':
        return {
          top: `${targetRect.top + targetRect.height / 2 - tooltipHeight / 2}px`,
          left: `${targetRect.left - tooltipWidth - 16}px`
        };
      case 'right':
        return {
          top: `${targetRect.top + targetRect.height / 2 - tooltipHeight / 2}px`,
          left: `${targetRect.right + 16}px`
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  const getArrowPosition = () => {
    if (!targetRect) return {};

    const size = 16;

    switch (currentStepData.position) {
      case 'top':
        return {
          bottom: `-${size}px`,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)'
        };
      case 'bottom':
        return {
          top: `-${size}px`,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)'
        };
      case 'left':
        return {
          right: `-${size}px`,
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)'
        };
      case 'right':
        return {
          left: `-${size}px`,
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)'
        };
      default:
        return {};
    }
  };

  return (
    <div 
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: targetRect 
            ? `inset 0 0 0 4000px rgba(0, 0, 0, 0.5)` 
            : 'none'
        }}
      />

      {targetRect && (
        <div 
          className="absolute pointer-events-none z-[10000]"
          style={{
            top: `${targetRect.top - 4}px`,
            left: `${targetRect.left - 4}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
            borderRadius: '12px',
            border: `2px solid ${theme.primary}`,
            boxShadow: `0 0 0 4px ${theme.primary}30, 0 0 20px ${theme.primary}40`
          }}
        />
      )}

      <div 
        className="absolute z-[10001] w-[280px] p-4 rounded-2xl shadow-2xl"
        style={{ 
          ...getTooltipPosition(),
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`
        }}
      >
        <div 
          className="absolute w-4 h-4 z-10"
          style={{
            ...getArrowPosition(),
            backgroundColor: theme.surface,
            borderLeft: `1px solid ${theme.border}`,
            borderTop: `1px solid ${theme.border}`
          }}
        />

        <div className="mb-3">
          <h3 
            className="text-lg font-bold mb-1"
            style={{ color: theme.text }}
          >
            {currentStepData.title}
          </h3>
          <p 
            className="text-sm leading-relaxed"
            style={{ color: theme.textSecondary }}
          >
            {currentStepData.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: index === currentStep 
                    ? theme.primary 
                    : `${theme.primary}30`
                }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
                style={{ 
                  backgroundColor: `${theme.primary}15`,
                  color: theme.text
                }}
              >
                上一步
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ 
                backgroundColor: theme.primary,
                color: '#fff'
              }}
            >
              {isLastStep ? '完成' : '下一步'}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-[10002] px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
        style={{ 
          backgroundColor: theme.surface,
          color: theme.textSecondary,
          border: `1px solid ${theme.border}`
        }}
      >
        跳过引导
      </button>

      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10002] px-6 py-3 rounded-xl text-center"
        style={{ 
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow
        }}
      >
        <p className="text-sm" style={{ color: theme.textSecondary }}>
          {currentStep + 1} / {steps.length}
        </p>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
          点击任意位置继续
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
