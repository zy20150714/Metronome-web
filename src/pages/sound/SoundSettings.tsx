import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../../contexts/MetronomeContext';
import { useTheme } from '../../contexts/ThemeContext';

const SoundSettings: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();

  const soundTypes = [
    { id: 'click', name: '经典点击', icon: '🔊' },
    { id: 'woodblock', name: '木鱼', icon: '🥁' },
    { id: 'hihat', name: '踩镲', icon: '🎛️' },
    { id: 'bell', name: '钟声', icon: '🔔' },
    { id: 'digital', name: '电子音', icon: '💻' },
  ];

  const handleSoundChange = (soundType: any) => {
    dispatch({ type: 'SET_SOUND_TYPE', payload: soundType });
  };

  const handleAccentVolumeChange = (delta: number) => {
    const newValue = Math.max(0, Math.min(100, state.volume.accent + delta));
    dispatch({ type: 'SET_VOLUME', payload: { accent: newValue } });
  };

  const handleNormalVolumeChange = (delta: number) => {
    const newValue = Math.max(0, Math.min(100, state.volume.normal + delta));
    dispatch({ type: 'SET_VOLUME', payload: { normal: newValue } });
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
            🔊 声音设置
          </h1>
          <p style={{ color: theme.textSecondary }}>调整节拍音色和音量</p>
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
            节拍音色
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {soundTypes.map((sound) => (
              <button
                key={sound.id}
                onClick={() => handleSoundChange(sound.id)}
                className={`p-4 rounded-xl text-center transition-all hover:scale-105 ${
                  state.soundType === sound.id ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: state.soundType === sound.id ? theme.primary + '30' : `${theme.primary}10`,
                  border: `2px solid ${state.soundType === sound.id ? theme.primary : theme.border}`,
                }}
              >
                <div className="text-2xl mb-2">{sound.icon}</div>
                <div 
                  className="text-xs font-medium"
                  style={{ color: state.soundType === sound.id ? theme.primary : theme.text }}
                >
                  {sound.name}
                </div>
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
            重音音量
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleAccentVolumeChange(-5)}
              className="w-12 h-12 rounded-full font-bold text-xl transition-all hover:scale-110"
              style={{ 
                backgroundColor: '#ef444415',
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              -
            </button>
            <div 
              className="flex-1 py-4 px-4 rounded-xl text-center text-2xl font-bold"
              style={{ 
                backgroundColor: '#ef444410',
                color: '#ef4444'
              }}
            >
              {state.volume.accent}%
            </div>
            <button
              onClick={() => handleAccentVolumeChange(5)}
              className="w-12 h-12 rounded-full font-bold text-xl transition-all hover:scale-110"
              style={{ 
                backgroundColor: '#ef444415',
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              +
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.volume.accent}
            onChange={(e) => dispatch({ type: 'SET_VOLUME', payload: { accent: parseInt(e.target.value) } })}
            className="w-full mt-4 h-2 rounded-full appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${state.volume.accent}%, ${theme.border} ${state.volume.accent}%, ${theme.border} 100%)`,
            }}
          />
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
            普通音量
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNormalVolumeChange(-5)}
              className="w-12 h-12 rounded-full font-bold text-xl transition-all hover:scale-110"
              style={{ 
                backgroundColor: `${theme.primary}15`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              -
            </button>
            <div 
              className="flex-1 py-4 px-4 rounded-xl text-center text-2xl font-bold"
              style={{ 
                backgroundColor: `${theme.primary}10`,
                color: theme.primary
              }}
            >
              {state.volume.normal}%
            </div>
            <button
              onClick={() => handleNormalVolumeChange(5)}
              className="w-12 h-12 rounded-full font-bold text-xl transition-all hover:scale-110"
              style={{ 
                backgroundColor: `${theme.primary}15`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              +
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.volume.normal}
            onChange={(e) => dispatch({ type: 'SET_VOLUME', payload: { normal: parseInt(e.target.value) } })}
            className="w-full mt-4 h-2 rounded-full appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${state.volume.normal}%, ${theme.border} ${state.volume.normal}%, ${theme.border} 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SoundSettings;
