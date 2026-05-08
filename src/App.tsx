import React, { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MetronomeProvider, useMetronome } from './contexts/MetronomeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SystemSettingsProvider } from './components/ControlPanel/SystemSettings';
import { cookieUtils } from './utils/cookieUtils';
import CookieBanner from './components/CookieBanner';

import Home from './pages/Home';
import Settings from './pages/Settings';
import TimeSignatureSettings from './pages/settings/TimeSignatureSettings';
import BPMSettings from './pages/settings/BPMSettings';
import Sound from './pages/Sound';
import SoundSettings from './pages/sound/SoundSettings';
import System from './pages/System';
import Themes from './pages/Themes';

const SETTINGS_KEY = 'metronome-settings';

const AppContent: React.FC = () => {
  const { state, dispatch } = useMetronome();
  
  const loadSettings = useCallback(() => {
    try {
      const consent = cookieUtils.getCookie('cookieConsent');
      if (consent !== 'accepted') {
        return;
      }

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

  const saveSettings = useCallback((settings: any) => {
    try {
      const consent = cookieUtils.getCookie('cookieConsent');
      if (consent !== 'accepted') {
        return;
      }

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
    <>
      <CookieBanner />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/time-signature" element={<TimeSignatureSettings />} />
          <Route path="/settings/bpm" element={<BPMSettings />} />
          <Route path="/sound" element={<Sound />} />
          <Route path="/sound/main" element={<SoundSettings />} />
          <Route path="/system" element={<System />} />
          <Route path="/themes" element={<Themes />} />
        </Routes>
      </Router>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SystemSettingsProvider>
        <MetronomeProvider>
          <AppContent />
        </MetronomeProvider>
      </SystemSettingsProvider>
    </ThemeProvider>
  );
};

export default App;
