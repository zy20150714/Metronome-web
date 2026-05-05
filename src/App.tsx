import React, { useState, useEffect, useCallback } from 'react';
import { MetronomeProvider, useMetronome } from './contexts/MetronomeContext';
import { useMetronomePlayback } from './hooks/useMetronomePlayback';
import BeatDisplay from './components/BeatDisplay/BeatDisplay';
import ControlPanel from './components/ControlPanel/ControlPanel';
import InteractiveControlPanel from './components/ControlPanel/InteractiveControlPanel';
import SystemSettings from './components/ControlPanel/SystemSettings';
import { SystemSettingsProvider, useSystemSettings } from './components/ControlPanel/SystemSettings';
import SoundSelector from './components/SoundSelector/SoundSelector';
import About from './components/About/About';
import { cookieUtils } from './utils/cookieUtils';

const SETTINGS_KEY = 'metronome-settings';

const SettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen min-w-full p-4 sm:p-6 animate-fadeIn">
      <div className="max-w-md mx-auto w-full">
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
            参数设置
          </h2>
          <p className="mt-3 text-gray-400">调整节拍器的各项参数</p>
        </div>
        
        <InteractiveControlPanel />
        <SoundSelector />
        
        <div className="text-center text-sm mt-12 mb-6 text-gray-500">
          <p>© 2026 节拍器应用</p>
          <p className="mt-1">专业、精准、可靠</p>
        </div>
      </div>
    </div>
  );
};

const MainPage: React.FC = () => {
  useMetronomePlayback();
  const { state, dispatch } = useMetronome();
  const [showSettings, setShowSettings] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [backButtonAlert, setBackButtonAlert] = useState(false);
  const [lastBackPressed, setLastBackPressed] = useState(0);

  const loadSettings = useCallback(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      }
      
      const cookieValue = cookieUtils.getCookie(SETTINGS_KEY);
      if (cookieValue) {
        return JSON.parse(cookieValue);
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return null;
  }, []);

  const saveSettings = useCallback((settings: { bpm: number; timeSignature: string; subdivision: string; soundType: string; volume: { accent: number; normal: number } }) => {
    try {
      const settingsJson = JSON.stringify(settings);
      
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, settingsJson);
      }
      
      cookieUtils.setCookie(SETTINGS_KEY, settingsJson, 365);
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, []);

  useEffect(() => {
    const saved = loadSettings();
    if (saved) {
      dispatch({ type: 'SET_BPM', payload: saved.bpm });
      dispatch({ type: 'SET_TIME_SIGNATURE', payload: saved.timeSignature });
      dispatch({ type: 'SET_SUBDIVISION', payload: saved.subdivision });
      dispatch({ type: 'SET_SOUND_TYPE', payload: saved.soundType });
      dispatch({ type: 'SET_VOLUME', payload: saved.volume });
    }
  }, [dispatch, loadSettings]);

  useEffect(() => {
    if (!state.isPlaying) {
      saveSettings({
        bpm: state.bpm,
        timeSignature: state.timeSignature,
        subdivision: state.subdivision,
        soundType: state.soundType,
        volume: state.volume,
      });
    }
  }, [state.bpm, state.timeSignature, state.subdivision, state.soundType, state.volume, state.isPlaying, saveSettings]);

  const handleBackButton = useCallback((event: KeyboardEvent) => {
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
  }, [showSettings, showSystemSettings, showAbout, lastBackPressed]);

  useEffect(() => {
    window.addEventListener('keydown', handleBackButton);

    return () => {
      window.removeEventListener('keydown', handleBackButton);
    };
  }, [handleBackButton]);

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
    <div className="min-h-screen min-w-full p-4 sm:p-6 md:p-8 animate-fadeIn">
      <div className="max-w-md mx-auto w-full">
        {backButtonAlert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl z-50 glass animate-fadeIn">
            <p className="text-gray-300">请连续快速两次返回即可退出</p>
          </div>
        )}
        
        <div className="text-center mb-8 sm:mb-10 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 mb-4 shadow-2xl shadow-pink-500/30">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            节拍器
          </h1>
          <p className="mt-3 text-gray-400 text-base sm:text-lg">
            专业的音乐节拍辅助工具
          </p>
        </div>
        
        <BeatDisplay />
        <ControlPanel />
        
        <div className="grid grid-cols-2 gap-4 mb-8 sm:mb-10">
          <button
            onClick={() => setShowSettings(true)}
            className="py-5 sm:py-6 rounded-2xl font-semibold shadow-xl hover-lift ripple transition-all duration-300 glass hover:bg-white/10"
          >
            <div className="flex flex-col items-center gap-2">
              <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-base sm:text-lg text-gray-300">参数设置</span>
            </div>
          </button>
          
          <button
            onClick={() => setShowSystemSettings(true)}
            className="py-5 sm:py-6 rounded-2xl font-semibold shadow-xl hover-lift ripple transition-all duration-300 glass hover:bg-white/10"
          >
            <div className="flex flex-col items-center gap-2">
              <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-base sm:text-lg text-gray-300">系统设置</span>
            </div>
          </button>
        </div>
        
        <div className="text-center text-sm mt-8 mb-6 text-gray-500">
          <p>© 2026 节拍器应用</p>
          <p className="mt-1">专业、精准、可靠</p>
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
