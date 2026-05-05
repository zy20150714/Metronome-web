import React, { useState, useEffect } from 'react';
import About from '../About/About';

interface SystemSettings {
  darkMode: boolean;
}

interface SystemSettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
}

const SystemSettingsContext = React.createContext<SystemSettingsContextType | undefined>(undefined);

export const SystemSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('system-settings');
    return saved ? JSON.parse(saved) : {
      darkMode: false
    };
  });

  useEffect(() => {
    localStorage.setItem('system-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SystemSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

export const useSystemSettings = () => {
  const context = React.useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
};

const SystemSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { settings, updateSettings } = useSystemSettings();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const tutorialSteps = [
    {
      title: '主界面',
      description: '显示当前BPM、拍号和节拍指示器，点击开始按钮播放节拍。'
    },
    {
      title: '参数设置',
      description: '调整小节数、节拍单位、节拍细分和速度等参数。'
    },
    {
      title: '声音设置',
      description: '选择不同的声音类型和调整音量。'
    },
    {
      title: '系统设置',
      description: '设置是否保存调节记录和切换明暗模式。'
    }
  ];

  const musicTheoryData = [
    {
      title: '拍号',
      content: '拍号是表示音乐中每小节的节拍数和节拍单位的符号。例如4/4拍表示每小节有4拍，以四分音符为一拍。'
    },
    {
      title: '节拍细分',
      content: '节拍细分是将一个基本拍分成更小的单位，用于更精确地表示音乐的节奏。包括基本细分（二分、四分、八分、十六分、三十二分）和连音（二连音、三连音、四连音、五连音、六连音、七连音、九连音等）。'
    },
    {
      title: 'BPM',
      content: 'BPM（Beats Per Minute）表示每分钟的节拍数，用于衡量音乐的速度。例如，120 BPM表示每分钟有120个四分音符。'
    },
    {
      title: '重音',
      content: '重音是指在音乐中被强调的节拍，通常是每小节的第一拍。在节拍器中，重音通常用不同的声音或音量来表示。'
    },
    {
      title: '连音',
      content: '连音是将基本音符时值平均分成非2的幂次等份的特殊划分方式。例如三连音（3代2）、五连音（5代4）、七连音（7代4）等，用于创造丰富的节奏变化。'
    }
  ];

  const [showMusicTheory, setShowMusicTheory] = useState(false);

  return (
    <div className="min-h-screen p-4 sm:p-6 animate-fadeIn">
      <div className="max-w-md mx-auto">
        <button
          onClick={onBack}
          className="w-full py-4 font-semibold rounded-2xl shadow-xl mb-8 hover-lift ripple transition-all duration-300 glass hover:bg-white/10"
        >
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-lg">返回主界面</span>
          </div>
        </button>

        <div className="text-center mb-8 animate-fadeIn">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            系统设置
          </h2>
        </div>

        {showTutorial ? (
          <div className="glass rounded-2xl shadow-xl p-6 mb-6 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-white">使用教程</h3>
            <div className="space-y-4">
              {tutorialSteps.map((step, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <h4 className="font-bold text-cyan-400">{index + 1}. {step.title}</h4>
                  <p className="mt-2 text-gray-300">{step.description}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className="mt-8 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-cyan-500/30"
            >
              关闭教程
            </button>
          </div>
        ) : showMusicTheory ? (
          <div className="glass rounded-2xl shadow-xl p-6 mb-6 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-white">乐理知识</h3>
            <div className="space-y-4">
              {musicTheoryData.map((item, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <h4 className="font-bold text-pink-400">{item.title}</h4>
                  <p className="mt-2 text-gray-300">{item.content}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowMusicTheory(false)}
              className="mt-8 w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-pink-500/30"
            >
              关闭乐理知识
            </button>
          </div>
        ) : showAbout ? (
          <About onBack={() => setShowAbout(false)} />
        ) : (
          <div className="space-y-4">
            <div className="glass rounded-2xl shadow-xl p-6 animate-fadeIn">
              <h3 className="text-xl font-semibold mb-6 text-white">显示设置</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">暗黑模式</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => updateSettings({ darkMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-cyan-500"></div>
                </label>
              </div>
              <p className="text-sm mt-3 text-gray-400">切换应用的明暗主题</p>
            </div>

            <button
              onClick={() => setShowTutorial(true)}
              className="w-full py-5 glass rounded-2xl shadow-xl hover-lift transition-all duration-300 hover:bg-white/10"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-lg font-semibold text-gray-300">使用教程</span>
              </div>
            </button>

            <button
              onClick={() => setShowMusicTheory(true)}
              className="w-full py-5 glass rounded-2xl shadow-xl hover-lift transition-all duration-300 hover:bg-white/10"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span className="text-lg font-semibold text-gray-300">乐理知识学习</span>
              </div>
            </button>

            <button
              onClick={() => setShowAbout(true)}
              className="w-full py-5 glass rounded-2xl shadow-xl hover-lift transition-all duration-300 hover:bg-white/10"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg font-semibold text-gray-300">关于</span>
              </div>
            </button>
          </div>
        )}

        <div className="text-center text-sm mt-12 mb-6 text-gray-500">
          <p>© 2026 节拍器应用</p>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
