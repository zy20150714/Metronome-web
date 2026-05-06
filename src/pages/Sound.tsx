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
                  borderRadius: theme.cardStyle === 'organic' ? '20px' : theme.cornerRadius,
                  boxShadow: state.soundType === sound
                    ? `0 4px 16px ${theme.glow}`
                    : 'none'
                }}
              >
                <span className="text-3xl">
                  {sound === 'click' && '👆'}
                  {sound === 'drum' && '🥁'}
                  {sound === 'wood' && '🪵'}
                  {sound === 'electronic' && '🔊'}
                  {sound === 'metal' && '🔔'}
                </span>
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
                borderRadius: theme.cardStyle === 'organic' ? '20px' : theme.cornerRadius,
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
                borderRadius: theme.cardStyle === 'organic' ? '20px' : theme.cornerRadius
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

export default Sound;
