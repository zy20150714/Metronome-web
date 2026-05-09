import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../../contexts/MetronomeContext';
import { useTheme } from '../../contexts/ThemeContext';
import { soundTypes, soundNames, audioUtils } from '../../utils/audioUtils';
import type { SoundType } from '../../types';

const SoundDetailSettings: React.FC = () => {
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
        <div className="mb-8">
          <Link
            to="/sound"
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
            声音详情
          </h1>
          <p style={{ color: theme.textSecondary }}>选择音色并调整音量</p>
        </div>

        <div
          className="mb-6 p-6"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text }}
          >
            音色选择
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {soundTypes.map((sound) => (
              <button
                key={sound}
                onClick={() => handleSoundSelect(sound)}
                className={`py-4 rounded-xl font-semibold transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 ${
                  state.soundType === sound ? 'scale-105' : ''
                }`}
                style={{
                  backgroundColor: state.soundType === sound
                    ? theme.primary
                    : `${theme.primary}15`,
                  color: state.soundType === sound
                    ? '#fff'
                    : theme.text,
                  borderRadius: theme.cornerRadius,
                  boxShadow: state.soundType === sound
                    ? `0 4px 16px ${theme.glow}`
                    : 'none'
                }}
              >
                <div className="text-2xl">
                  {sound === 'click' && (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  )}
                  {sound === 'drum' && (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  )}
                  {sound === 'wood' && (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                  {sound === 'electronic' && (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {sound === 'metal' && (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <span className="text-xs">{soundNames[sound]}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePreviewAccent}
              className="flex-1 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: theme.gradient,
                color: '#fff',
                borderRadius: theme.cornerRadius,
                boxShadow: `0 4px 16px ${theme.glow}`
              }}
            >
              预览重音
            </button>
            <button
              onClick={handlePreviewNormal}
              className="flex-1 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: `${theme.primary}20`,
                color: theme.text,
                border: `1px solid ${theme.primary}`,
                borderRadius: theme.cornerRadius
              }}
            >
              预览普通音
            </button>
          </div>
        </div>

        <div
          className="mb-6 p-6"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text }}
          >
            重拍音量
          </h2>
          <div className="flex items-center gap-4">
            <span style={{ color: theme.textSecondary, width: '60px' }}>低</span>
            <input
              type="range"
              min="0"
              max="100"
              value={state.volume.accent}
              onChange={(e) => handleVolumeChange('accent', parseInt(e.target.value))}
              className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${state.volume.accent}%, ${theme.border} ${state.volume.accent}%, ${theme.border} 100%)`,
                borderRadius: '15px'
              }}
            />
            <span style={{ color: theme.text, width: '40px', textAlign: 'right' }}>{state.volume.accent}%</span>
          </div>
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
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text }}
          >
            普通拍音量
          </h2>
          <div className="flex items-center gap-4">
            <span style={{ color: theme.textSecondary, width: '60px' }}>低</span>
            <input
              type="range"
              min="0"
              max="100"
              value={state.volume.normal}
              onChange={(e) => handleVolumeChange('normal', parseInt(e.target.value))}
              className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${state.volume.normal}%, ${theme.border} ${state.volume.normal}%, ${theme.border} 100%)`,
                borderRadius: '15px'
              }}
            />
            <span style={{ color: theme.text, width: '40px', textAlign: 'right' }}>{state.volume.normal}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundDetailSettings;
