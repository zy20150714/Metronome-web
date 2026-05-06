import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MetronomeProvider, useMetronome } from './contexts/MetronomeContext';
import { SystemSettingsProvider } from './components/ControlPanel/SystemSettings';
import { useMetronomePlayback } from './hooks/useMetronomePlayback';
import { cookieUtils } from './utils/cookieUtils';
import CookieBanner from './components/CookieBanner';

// 页面
import Home from './pages/Home';
import Settings from './pages/Settings';
import Sound from './pages/Sound';
import System from './pages/System';

const SETTINGS_KEY = 'metronome-settings';

const AppContent: React.FC = () => {
  const { state, dispatch } = useMetronome();
  
  // 加载保存的设置
  const loadSettings = useCallback(() => {
    try {
      // 首先检查Cookie同意
      const consent = cookieUtils.getCookie('cookieConsent');
      if (consent !== 'accepted') {
        return;
      }

      // 尝试从localStorage加载
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      }

      // 尝试从cookie加载
      const cookieValue = cookieUtils.getCookie(SETTINGS_KEY);
      if (cookieValue) {
        return JSON.parse(cookieValue);
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return null;
  }, []);

  // 保存设置
  const saveSettings = useCallback((settings: any) => {
    try {
      const consent = cookieUtils.getCookie('cookieConsent');
      if (consent !== 'accepted') {
        return;
      }

      const settingsJson = JSON.stringify(settings);

      // 同时保存到localStorage和cookie
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, settingsJson);
      }

      // 保存到cookie，有效期365天
      cookieUtils.setCookie(SETTINGS_KEY, settingsJson, 365);
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, []);

  // 初始化时加载设置
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

  // 保存设置变化
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
  }, [
    state.bpm,
    state.timeSignature,
    state.subdivision,
    state.soundType,
    state.volume,
    state.isPlaying,
    saveSettings
  ]);

  return (
    <Router>
      <CookieBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sound" element={<Sound />} />
        <Route path="/system" element={<System />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <SystemSettingsProvider>
      <MetronomeProvider>
        <AppContent />
      </MetronomeProvider>
    </SystemSettingsProvider>
  );
};

export default App;
