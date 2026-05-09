import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';
import { soundTypes, soundNames, audioUtils } from '../utils/audioUtils';
import type { SoundType } from '../types';

const Sound: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();

  const handleSoundSelect = (soundType: SoundType) => {
    dispatch({ type: 'SET_SOUND_TYPE', payload: soundType });
    audioUtils.playSound(soundType, true, false, state.volume.accent);
  };

  const handleVolumeChange = (type: 'accent' | 'normal', value: number) => {
    dispatch({ type: 'SET_VOLUME', payload: { ...state.volume, [type]: value } });
  };

  const handlePreviewAccent = () => {
    audioUtils.playAccent(state.soundType, state.volume.accent);
  };

  const handlePreviewNormal = () => {
    audioUtils.playNormal(state.soundType, state.volume.normal);
  };

  return (
    <div 
      className="min-h-screen p-4 sm:p-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="container mx-auto max-w-lg">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              color: theme.text,
              border: `1px solid ${theme.border}`,
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
            className="text-2xl font-bold mb-1"
            style={{ color: theme.text }}
          >
            声音设置
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: '14px' }}>选择节拍音色并调整音量</p>
        </div>

        <div 
          className="mb-4 p-5 rounded-2xl"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
          }}
        >
          <h2 className="font-semibold mb-4" style={{ color: theme.text }}>音色选择</h2>
          
          <div className="grid grid-cols-5 gap-2 mb-4">
            {soundTypes.map((sound) => (
              <button
                key={sound}
                onClick={() => handleSoundSelect(sound)}
                className={`py-3 px-1 rounded-xl font-medium text-xs transition-all duration-200 flex flex-col items-center ${
                  state.soundType === sound ? 'scale-105' : ''
                }`}
                style={{
                  backgroundColor: state.soundType === sound ? theme.primary : `${theme.primary}15`,
                  color: state.soundType === sound ? '#fff' : theme.text
                }}
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sound === 'click' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                  )}
                  {sound === 'drum' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  )}
                  {sound === 'wood' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                  {sound === 'electronic' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  )}
                  {sound === 'metal' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span className="text-[10px]">{soundNames[sound]}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePreviewAccent}
              className="flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200"
              style={{
                backgroundColor: theme.primary,
                color: '#fff',
                boxShadow: `0 2px 8px ${theme.glow}`
              }}
            >
              重音
            </button>
            <button
              onClick={handlePreviewNormal}
              className="flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200"
              style={{
                backgroundColor: `${theme.primary}15`,
                color: theme.text
              }}
            >
              普通
            </button>
          </div>
        </div>

        <div 
          className="mb-4 p-5 rounded-2xl"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: theme.text }}>重拍音量</h2>
            <span className="text-sm font-medium" style={{ color: theme.primary }}>{state.volume.accent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.volume.accent}
            onChange={(e) => handleVolumeChange('accent', parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${state.volume.accent}%, ${theme.border} ${state.volume.accent}%, ${theme.border} 100%)`
            }}
          />
        </div>

        <div 
          className="p-5 rounded-2xl"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: theme.text }}>普通拍音量</h2>
            <span className="text-sm font-medium" style={{ color: theme.primary }}>{state.volume.normal}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.volume.normal}
            onChange={(e) => handleVolumeChange('normal', parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${state.volume.normal}%, ${theme.border} ${state.volume.normal}%, ${theme.border} 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sound;
