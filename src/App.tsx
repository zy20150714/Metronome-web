import React, { useState, useEffect } from 'react';
import { MetronomeProvider, useMetronome } from './contexts/MetronomeContext';
import { useMetronomePlayback } from './hooks/useMetronomePlayback';
import BeatDisplay from './components/BeatDisplay/BeatDisplay';
import ControlPanel from './components/ControlPanel/ControlPanel';
import InteractiveControlPanel from './components/ControlPanel/InteractiveControlPanel';
import SystemSettings from './components/ControlPanel/SystemSettings';
import { SystemSettingsProvider, useSystemSettings } from './components/ControlPanel/SystemSettings';
import SoundSelector from './components/SoundSelector/SoundSelector';
import About from './components/About/About';

const SETTINGS_KEY = 'metronome-settings';

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return null;
};

const saveSettings = (settings: any) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

const SettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { settings } = useSystemSettings();
  
  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} p-4 animate-fadeIn`}>
      <div className="max-w-md mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={onBack}
          className={`w-full py-3 font-semibold rounded-lg shadow-sm mb-6 hover-lift ripple ${settings.darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'}`}
        >
          返回主界面
        </button>
        
        {/* 页面标题 */}
        <div className="text-center mb-6 animate-bounceSoft">
          <h2 className="text-2xl font-bold text-blue-600">参数设置</h2>
        </div>
        
        {/* 交互式控制面板 */}
        <InteractiveControlPanel />
        
        {/* 声音设置 */}
        <SoundSelector />
        
        {/* 页尾 */}
        <div className={`text-center text-xs mt-8 mb-4 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>© 2026 节拍器应用</p>
        </div>
      </div>
    </div>
  );
};

const MainPage: React.FC = () => {
  useMetronomePlayback();
  const { state, dispatch } = useMetronome();
  const { settings } = useSystemSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [backButtonAlert, setBackButtonAlert] = useState(false);
  const [lastBackPressed, setLastBackPressed] = useState(0);

  useEffect(() => {
    const saved = loadSettings();
    if (saved) {
      dispatch({ type: 'SET_BPM', payload: saved.bpm });
      dispatch({ type: 'SET_TIME_SIGNATURE', payload: saved.timeSignature });
      dispatch({ type: 'SET_NOTE_VALUE', payload: saved.noteValue });
      dispatch({ type: 'SET_SOUND_TYPE', payload: saved.soundType });
      dispatch({ type: 'SET_VOLUME', payload: saved.volume });
      dispatch({ type: 'SET_SUBDIVISION', payload: saved.subdivision });
    }
  }, [dispatch]);

  useEffect(() => {
    saveSettings({
      bpm: state.bpm,
      timeSignature: state.timeSignature,
      noteValue: state.noteValue,
      soundType: state.soundType,
      volume: state.volume,
      subdivision: state.subdivision,
    });
  }, [state]);

  useEffect(() => {
    const handleBackButton = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Backspace') {
        event.preventDefault();
        
        if (showAbout || showSystemSettings || showSettings) {
          if (showAbout) {
            setShowAbout(false);
          } else if (showSystemSettings) {
            setShowSystemSettings(false);
          } else if (showSettings) {
            setShowSettings(false);
          }
          return;
        }

        const currentTime = Date.now();
        if (currentTime - lastBackPressed < 2000) {
          setBackButtonAlert(false);
        } else {
          setBackButtonAlert(true);
          setLastBackPressed(currentTime);
          setTimeout(() => {
            setBackButtonAlert(false);
          }, 2000);
        }
      }
    };

    window.addEventListener('keydown', handleBackButton);

    return () => {
      window.removeEventListener('keydown', handleBackButton);
    };
  }, [showSettings, showSystemSettings, showAbout, lastBackPressed]);

  if (showAbout) {
    return (
      <div className="animate-slideIn">
        <About onBack={() => setShowAbout(false)} />
      </div>
    );
  }
  
  if (showSystemSettings) {
    return (
      <div className="animate-slideIn">
        <SystemSettings onBack={() => setShowSystemSettings(false)} />
      </div>
    );
  }
  
  if (showSettings) {
    return (
      <div className="animate-slideIn">
        <SettingsPage onBack={() => setShowSettings(false)} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} p-4 animate-fadeIn`}>
      <div className="max-w-md mx-auto">
        {/* 返回键提示 */}
        {backButtonAlert && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 ${settings.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} animate-fadeIn`}>
            <p>请连续快速两次返回即可退出</p>
          </div>
        )}
        
        {/* 应用标题 */}
        <div className="text-center mb-6 animate-bounceSoft">
          <h1 className="text-3xl font-bold text-blue-600">节拍器</h1>
          <p className={`mt-1 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>专业的节拍辅助工具</p>
        </div>
        
        {/* 节拍显示 */}
        <BeatDisplay />
        
        {/* 控制面板 */}
        <ControlPanel />
        
        {/* 参数设置按钮 */}
        <button
          onClick={() => setShowSettings(true)}
          className={`w-full py-5 rounded-xl font-semibold shadow-lg mb-4 hover-lift ripple transition-all duration-300 ${settings.darkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">⚙️</span>
            <span className="text-lg">参数设置</span>
          </div>
        </button>
        
        {/* 系统设置按钮 */}
        <button
          onClick={() => setShowSystemSettings(true)}
          className={`w-full py-5 rounded-xl font-semibold shadow-lg mb-6 hover-lift ripple transition-all duration-300 ${settings.darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200 hover:from-gray-700 hover:to-gray-600' : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🔧</span>
            <span className="text-lg">系统设置</span>
          </div>
        </button>
        
        {/* 页尾 */}
        <div className={`text-center text-xs mt-8 mb-4 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>© 2026 节拍器应用</p>
        </div>
      </div>
    </div>
  );
};



const App: React.FC = () => {
  return (
    <SystemSettingsProvider>
      <MetronomeProvider>
        <MainPage />
      </MetronomeProvider>
    </SystemSettingsProvider>
  );
};

export default App;