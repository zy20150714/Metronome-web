import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SystemSettingsProvider, useSystemSettings } from '../components/ControlPanel/SystemSettings';

// 包装组件以便提供上下文
const SystemContent: React.FC = () => {
  const { settings, updateSettings } = useSystemSettings();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showTheory, setShowTheory] = useState(false);

  const tutorialSteps = [
    {
      title: '主界面',
      desc: '查看和控制节拍器播放，调整BPM值'
    },
    {
      title: '参数设置',
      desc: '配置拍号、节拍细分等节奏参数'
    },
    {
      title: '声音设置',
      desc: '选择节拍器音色，调整音量大小'
    },
    {
      title: '系统设置',
      desc: '修改应用偏好和学习使用方法'
    }
  ];

  const musicTheory = [
    {
      title: '拍号 (Time Signature)',
      content: '拍号告诉我们每个小节有多少拍，以及以什么音符为一拍。比如4/4拍表示每小节4拍，以四分音符为一拍。'
    },
    {
      title: 'BPM (Beats Per Minute)',
      content: 'BPM是每分钟节拍数，代表音乐的速度。数值越大，节奏越快。常用的流行音乐在100-120 BPM左右。'
    },
    {
      title: '重音 (Accent)',
      content: '每小节的第一拍通常会有重音，帮助你把握节奏感。在节拍器中重音会有更响亮的声音。'
    },
    {
      title: '节拍细分 (Subdivision)',
      content: '细分将基本节拍分割成更小的单位，帮助你练习更复杂的节奏。常见的有八分音符、十六分音符等。'
    }
  ];

  if (showTutorial) {
    return (
      <div className="min-h-screen tech-bg grid-bg relative overflow-hidden pb-24">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-8">
            <button
              onClick={() => setShowTutorial(false)}
              className="btn-secondary inline-flex items-center gap-3 px-6 py-4 rounded-lg text-gray-300 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </button>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 display-font">TUTORIAL</h1>
            <p className="text-gray-400 text-sm tracking-wider">使用指南</p>
          </div>

          <div className="space-y-4">
            {tutorialSteps.map((step, index) => (
              <div key={index} className="card-tech p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
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
      <div className="min-h-screen tech-bg grid-bg relative overflow-hidden pb-24">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-8">
            <button
              onClick={() => setShowTheory(false)}
              className="btn-secondary inline-flex items-center gap-3 px-6 py-4 rounded-lg text-gray-300 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </button>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 display-font">THEORY</h1>
            <p className="text-gray-400 text-sm tracking-wider">乐理知识</p>
          </div>

          <div className="space-y-4">
            {musicTheory.map((item, index) => (
              <div key={index} className="card-tech p-5">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen tech-bg grid-bg relative overflow-hidden pb-24">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* 返回导航 */}
        <div className="mb-8">
          <Link
            to="/"
            className="btn-secondary inline-flex items-center gap-3 px-6 py-4 rounded-lg text-gray-300 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </Link>
        </div>

        {/* 标题 */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2 display-font">SYSTEM</h1>
          <p className="text-gray-400 text-sm tracking-wider">系统设置和偏好</p>
        </div>

        {/* 设置项 */}
        <div className="space-y-4">
          {/* 暗黑模式 */}
          <div className="card-tech p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">暗黑模式</h3>
                <p className="text-xs text-gray-400">深色主题显示</p>
              </div>
              <div
                className={`toggle-switch ${settings.darkMode ? 'active' : ''}`}
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              />
            </div>
          </div>

          {/* 使用教程 */}
          <button
            onClick={() => setShowTutorial(true)}
            className="card-tech w-full p-6 text-left transition-all duration-300 hover:bg-gray-800/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">使用教程</h3>
                <p className="text-xs text-gray-400">学习如何使用节拍器</p>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* 乐理知识 */}
          <button
            onClick={() => setShowTheory(true)}
            className="card-tech w-full p-6 text-left transition-all duration-300 hover:bg-gray-800/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">乐理知识</h3>
                <p className="text-xs text-gray-400">学习基础音乐理论</p>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* 关于 */}
          <div className="card-tech p-6">
            <h3 className="text-lg font-semibold text-white mb-4">关于</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">应用名称</span>
                <span className="text-white">METRONOME</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">版本</span>
                <span className="text-white">2.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">技术栈</span>
                <span className="text-white">React + Vite</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 主组件
const System: React.FC = () => {
  return (
    <SystemSettingsProvider>
      <SystemContent />
    </SystemSettingsProvider>
  );
};

export default System;
