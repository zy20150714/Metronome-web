import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SystemSettingsProvider, useSystemSettings } from '../components/ControlPanel/SystemSettings';
import { useTheme } from '../contexts/ThemeContext';

const SystemContent: React.FC = () => {
  const { settings, updateSettings } = useSystemSettings();
  const { theme } = useTheme();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showTheory, setShowTheory] = useState(false);

  const tutorialSteps = [
    { title: '主界面', desc: '查看和控制节拍器播放，调整BPM值' },
    { title: '参数设置', desc: '配置拍号、节拍细分等节奏参数' },
    { title: '声音设置', desc: '选择节拍器音色，调整音量大小' },
    { title: '主题选择', desc: '选择喜欢的界面风格和配色' },
    { title: '系统设置', desc: '修改应用偏好和学习使用方法' }
  ];

  const musicTheory = [
    {
      title: '拍号',
      content: '拍号告诉我们每个小节有多少拍，以及以什么音符为一拍。比如4/4拍表示每小节4拍，以四分音符为一拍。'
    },
    {
      title: 'BPM',
      content: 'BPM是每分钟节拍数，代表音乐的速度。数值越大，节奏越快。常用的流行音乐在100-120 BPM左右。'
    },
    {
      title: '重音',
      content: '每小节的第一拍通常会有重音，帮助你把握节奏感。在节拍器中重音会有更响亮的声音。'
    },
    {
      title: '节拍细分',
      content: '细分将基本节拍分割成更小的单位，帮助你练习更复杂的节奏。常见的有八分音符、十六分音符等。'
    }
  ];

  if (showTutorial) {
    return (
      <div className="min-h-screen p-4 sm:p-6 pb-24">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <button
              onClick={() => setShowTutorial(false)}
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
            </button>
          </div>

          <div className="mb-10 text-center">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "'Orbitron', monospace", color: theme.text }}
            >
              使用教程
            </h1>
            <p style={{ color: theme.textSecondary }}>学习如何使用节拍器</p>
          </div>

          <div className="space-y-4">
            {tutorialSteps.map((step, index) => (
              <div 
                key={index}
                className="p-5 rounded-xl"
                style={{ 
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`
                }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
                    style={{ background: theme.gradient }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 
                      className="font-semibold mb-1"
                      style={{ color: theme.text }}
                    >
                      {step.title}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showTheory) {
    return (
      <div className="min-h-screen p-4 sm:p-6 pb-24">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <button
              onClick={() => setShowTheory(false)}
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
            </button>
          </div>

          <div className="mb-10 text-center">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "'Orbitron', monospace", color: theme.text }}
            >
              乐理知识
            </h1>
            <p style={{ color: theme.textSecondary }}>学习基础音乐理论</p>
          </div>

          <div className="space-y-4">
            {musicTheory.map((item, index) => (
              <div 
                key={index}
                className="p-5 rounded-xl"
                style={{ 
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`
                }}
              >
                <h3 
                  className="font-semibold mb-3"
                  style={{ color: theme.primary }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: theme.text }}
                >
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-24">
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

        <div className="mb-10">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "'Orbitron', monospace", color: theme.text }}
          >
            系统设置
          </h1>
          <p style={{ color: theme.textSecondary }}>系统设置和偏好</p>
        </div>

        <div className="space-y-4">
          <div 
            className="p-6 rounded-xl"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 
                  className="font-semibold mb-1"
                  style={{ color: theme.text }}
                >
                  暗黑模式
                </h3>
                <p 
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  深色主题显示
                </p>
              </div>
              <div
                className="relative w-14 h-7 rounded-full cursor-pointer transition-all duration-300"
                style={{ 
                  backgroundColor: settings.darkMode ? theme.primary : `${theme.text}11`
                }}
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              >
                <div
                  className="absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300"
                  style={{ 
                    left: settings.darkMode ? 'calc(100% - 26px)' : '0.5px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowTutorial(true)}
            className="w-full p-6 rounded-xl text-left transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 
                  className="font-semibold mb-1"
                  style={{ color: theme.text }}
                >
                  使用教程
                </h3>
                <p 
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  学习如何使用节拍器
                </p>
              </div>
              <svg className="w-5 h-5" style={{ color: theme.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => setShowTheory(true)}
            className="w-full p-6 rounded-xl text-left transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 
                  className="font-semibold mb-1"
                  style={{ color: theme.text }}
                >
                  乐理知识
                </h3>
                <p 
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  学习基础音乐理论
                </p>
              </div>
              <svg className="w-5 h-5" style={{ color: theme.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <div 
            className="p-6 rounded-xl"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`
            }}
          >
            <h3 
              className="font-semibold mb-4"
              style={{ color: theme.text }}
            >
              关于
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: theme.textSecondary }}>应用名称</span>
                <span style={{ color: theme.text }}>节拍器</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.textSecondary }}>版本</span>
                <span style={{ color: theme.text }}>2.0.0</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.textSecondary }}>技术栈</span>
                <span style={{ color: theme.text }}>React + Vite</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const System: React.FC = () => {
  return (
    <SystemSettingsProvider>
      <SystemContent />
    </SystemSettingsProvider>
  );
};

export default System;
