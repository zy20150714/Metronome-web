import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const System: React.FC = () => {
  const { theme } = useTheme();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMusicTheory, setShowMusicTheory] = useState(false);

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

        <div 
          className="mb-6"
        >
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="w-full p-6 text-left transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.cornerRadius,
              boxShadow: theme.shadow
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: `${theme.primary}20` }}
                >
                  <svg className="w-6 h-6" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="font-semibold" style={{ color: theme.text }}>使用教程</span>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${showTutorial ? 'rotate-180' : ''}`} 
                style={{ color: theme.textSecondary }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {showTutorial && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
                <div className="space-y-4 text-sm" style={{ color: theme.textSecondary }}>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: theme.text }}>1. 设置速度</h3>
                    <p>使用BPM滑块或加减按钮设置节拍器速度，范围20-300 BPM。</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: theme.text }}>2. 选择拍号</h3>
                    <p>在参数设置中选择合适的拍号，支持2/4、3/4、4/4、6/8等常见拍号。</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: theme.text }}>3. 选择音色</h3>
                    <p>在声音设置中选择你喜欢的节拍器音色。</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: theme.text }}>4. 开始播放</h3>
                    <p>点击中央的播放按钮开始，重拍会以不同颜色高亮显示。</p>
                  </div>
                </div>
              </div>
            )}
          </button>
        </div>

        <div 
          className="mb-6"
        >
          <button
            onClick={() => setShowMusicTheory(!showMusicTheory)}
            className="w-full p-6 text-left transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.cornerRadius,
              boxShadow: theme.shadow
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: `${theme.primary}20` }}
                >
                  <svg className="w-6 h-6" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <span className="font-semibold" style={{ color: theme.text }}>乐理知识</span>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${showMusicTheory ? 'rotate-180' : ''}`} 
                style={{ color: theme.textSecondary }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {showMusicTheory && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
                <div className="space-y-4 text-sm" style={{ color: theme.textSecondary }}>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: theme.text }}>什么是BPM？</h3>
                    <p>BPM代表每分钟节拍数（Beats Per Minute），是衡量音乐速度的标准单位。</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: theme.text }}>常见速度标记</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Largo: 40-60 BPM - 缓慢庄重</li>
                      <li>Adagio: 60-80 BPM - 缓慢舒展</li>
                      <li>Andante: 80-100 BPM - 行板</li>
                      <li>Moderato: 100-120 BPM - 中板</li>
                      <li>Allegro: 120-160 BPM - 快速</li>
                      <li>Presto: 160-200+ BPM - 急速</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: theme.text }}>拍号说明</h3>
                    <p>拍号由两个数字组成，上方数字表示每小节的拍数，下方数字表示以几分音符为一拍。例如4/4拍表示每小节4拍，以四分音符为一拍。</p>
                  </div>
                </div>
              </div>
            )}
          </button>
        </div>

        <div 
          className="p-6"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ background: `${theme.primary}20` }}
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
