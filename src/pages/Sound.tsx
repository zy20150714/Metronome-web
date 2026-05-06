import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';
import { getSoundTypeEmoji } from '../utils/metronomeUtils';
import { audioUtils } from '../utils/audioUtils';

const Sound: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();

  const soundOptions = [
    { value: 'click', name: '点击声', desc: '经典的点击声' },
    { value: 'drum', name: '鼓声', desc: '鼓机节奏声' },
    { value: 'wood', name: '木鱼', desc: '木鱼打击声' },
    { value: 'electronic', name: '电子音', desc: '电子合成音' },
    { value: 'metal', name: '金属音', desc: '金属敲击声' }
  ];

  const handleSoundTypeChange = (type: string) => {
    dispatch({ type: 'SET_SOUND_TYPE', payload: type as any });
  };

  const handleVolumeChange = (type: 'accent' | 'normal', value: number) => {
    dispatch({ type: 'SET_VOLUME', payload: { [type]: value } });
  };

  const handlePreviewAccent = () => {
    audioUtils.playAccent(state.soundType, state.volume.accent);
  };

  const handlePreviewNormal = () => {
    audioUtils.playNormal(state.soundType, state.volume.normal);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-24">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              color: theme.text,
              border: `1px solid ${theme.border}`
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </Link>
        </div>

        <div className="mb-10">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "'Orbitron', monospace", color: theme.text }}
          >
            声音设置
          </h1>
          <p style={{ color: theme.textSecondary }}>选择和调整节拍器声音</p>
        </div>

        <div 
          className="p-6 mb-6"
          style={{ 
            backgroundColor: theme.surface,
            borderRadius: '16px',
            border: `1px solid ${theme.border}`
          }}
        >
          <h2 
            className="text-lg font-semibold mb-6"
            style={{ color: theme.primary }}
          >
            音色选择
          </h2>
          
          <div className="space-y-3">
            {soundOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSoundTypeChange(option.value)}
                className="p-4 rounded-xl transition-all duration-300 flex items-center gap-4 w-full"
                style={{
                  backgroundColor: state.soundType === option.value ? `${theme.primary}22` : `${theme.text}08`,
                  border: state.soundType === option.value ? `1px solid ${theme.primary}` : `1px solid ${theme.border}`
                }}
              >
                <div 
                  className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${theme.text}08` }}
                >
                  {getSoundTypeEmoji(option.value)}
                </div>
                <div className="flex-1 text-left">
                  <div 
                    className="font-semibold"
                    style={{ color: theme.text }}
                  >
                    {option.name}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    {option.desc}
                  </div>
                </div>
                {state.soundType === option.value && (
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div 
          className="p-6 mb-6"
          style={{ 
            backgroundColor: theme.surface,
            borderRadius: '16px',
            border: `1px solid ${theme.border}`
          }}
        >
          <h2 
            className="text-lg font-semibold mb-6"
            style={{ color: theme.primary }}
          >
            音量控制
          </h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label style={{ color: theme.textSecondary, fontSize: '14px' }}>重音音量</label>
                <span 
                  className="font-semibold"
                  style={{ 
                    fontFamily: "'Orbitron', monospace",
                    color: theme.text 
                  }}
                >
                  {state.volume.accent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={state.volume.accent}
                onChange={(e) => handleVolumeChange('accent', parseInt(e.target.value))}
                className="w-full"
                style={{
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: `${theme.text}11`,
                  WebkitAppearance: 'none'
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label style={{ color: theme.textSecondary, fontSize: '14px' }}>普通音音量</label>
                <span 
                  className="font-semibold"
                  style={{ 
                    fontFamily: "'Orbitron', monospace",
                    color: theme.text 
                  }}
                >
                  {state.volume.normal}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={state.volume.normal}
                onChange={(e) => handleVolumeChange('normal', parseInt(e.target.value))}
                className="w-full"
                style={{
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: `${theme.text}11`,
                  WebkitAppearance: 'none'
                }}
              />
            </div>
          </div>
        </div>

        <div 
          className="p-6"
          style={{ 
            backgroundColor: theme.surface,
            borderRadius: '16px',
            border: `1px solid ${theme.border}`
          }}
        >
          <h2 
            className="text-lg font-semibold mb-6"
            style={{ color: theme.primary }}
          >
            声音预览
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handlePreviewAccent}
              className="py-5 rounded-lg font-semibold transition-all duration-300"
              style={{ 
                background: theme.gradient,
                color: '#ffffff'
              }}
            >
              <div className="text-2xl mb-1">🎵</div>
              <div>重音预览</div>
            </button>
            <button
              onClick={handlePreviewNormal}
              className="py-5 rounded-lg font-semibold transition-all duration-300"
              style={{ 
                backgroundColor: `${theme.text}11`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              <div className="text-2xl mb-1">🎶</div>
              <div>普通音预览</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sound;
