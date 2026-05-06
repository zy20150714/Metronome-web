import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';
import { soundTypes, soundNames, audioUtils } from '../utils/audioUtils';

const Sound: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();

  const handleSoundSelect = (soundType: string) => {
    dispatch({ type: 'SET_SOUND_TYPE', payload: soundType });
    audioUtils.playSound(soundType, true, false, state.volume.accent);
  };

  const handleVolumeChange = (type: 'accent' | 'normal', value: number) => {
    dispatch({ type: 'SET_VOLUME', payload: { ...state.volume, [type]: value } });
  };

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
            声音设置
          </h1>
          <p style={{ color: theme.textSecondary }}>选择节拍器的音色和音量</p>
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
          <div className="grid grid-cols-2 gap-3">
            {soundTypes.map((sound) => (
              <button
                key={sound}
                onClick={() => handleSoundSelect(sound)}
                className={`p-4 rounded-lg text-left transition-all duration-300 ${
                  state.soundType === sound ? 'scale-102' : 'hover:scale-101'
                }`}
                style={{ 
                  backgroundColor: state.soundType === sound
                    ? `${theme.primary}20`
                    : theme.background,
                  border: `2px solid ${state.soundType === sound ? theme.primary : theme.border}`,
                  borderRadius: theme.cardStyle === 'organic' ? '20px' : theme.cornerRadius
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center"
                  style={{ 
                    background: state.soundType === sound ? theme.gradient : `${theme.primary}15`
                  }}
                >
                  <svg className="w-5 h-5" style={{ color: state.soundType === sound ? '#fff' : theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <span 
                  className="font-semibold"
                  style={{ color: theme.text }}
                >
                  {soundNames[sound]}
                </span>
              </button>
            ))}
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

export default Sound;
