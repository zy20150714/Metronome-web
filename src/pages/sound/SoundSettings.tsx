import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../../contexts/MetronomeContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAmbientVolume } from '../../hooks/useAmbientVolume';
import { audioUtils } from '../../utils/audioUtils';
import SoundEditor from '../../components/SoundEditor';

const SoundSettings: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();
  const [showEditor, setShowEditor] = useState(false);
  const ambientVolume = useAmbientVolume();

  const soundTypes = [
    { id: 'click', name: '经典点击', icon: '🔊' },
    { id: 'wood', name: '木鱼', icon: '🪵' },
    { id: 'drum', name: '鼓点', icon: '🥁' },
    { id: 'electronic', name: '电子', icon: '💻' },
    { id: 'metal', name: '金属', icon: '🔔' },
    { id: 'custom', name: '自定义', icon: '🎨' },
  ];

  const handleSoundChange = (soundType: string) => {
    dispatch({ type: 'SET_SOUND_TYPE', payload: soundType });
    audioUtils.testSound(soundType as any, true);
  };

  const handleAccentVolumeChange = (delta: number) => {
    const newValue = Math.max(0, Math.min(100, state.volume.accent + delta));
    dispatch({ type: 'SET_VOLUME', payload: { accent: newValue } });
  };

  const handleNormalVolumeChange = (delta: number) => {
    const newValue = Math.max(0, Math.min(100, state.volume.normal + delta));
    dispatch({ type: 'SET_VOLUME', payload: { normal: newValue } });
  };

  const getAmbientLevelColor = () => {
    if (ambientVolume.ambientLevel < 20) return '#22c55e';
    if (ambientVolume.ambientLevel < 50) return '#eab308';
    if (ambientVolume.ambientLevel < 75) return '#f97316';
    return '#ef4444';
  };

  return (
    <div 
      className="min-h-screen p-4 sm:p-6 pb-8"
      style={{ backgroundColor: theme.background }}
    >
      <div className="container mx-auto max-w-lg">
        <div className="mb-6">
          <Link
            to="/sound"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl font-semibold transition-all duration-300 active:scale-95"
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
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : "'Inter', sans-serif", color: theme.text }}
          >
            🔊 声音设置
          </h1>
          <p className="text-sm" style={{ color: theme.textSecondary }}>调整节拍音色和音量</p>
        </div>

        <div 
          className="mb-5 p-5"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <h2 
            className="text-base font-semibold mb-4"
            style={{ color: theme.text }}
          >
            节拍音色
          </h2>
          <div className="grid grid-cols-3 gap-2.5">
            {soundTypes.map((sound) => (
              <button
                key={sound.id}
                onClick={() => {
                  if (sound.id === 'custom') {
                    setShowEditor(true);
                  } else {
                    handleSoundChange(sound.id);
                  }
                }}
                className={`p-3 rounded-xl text-center transition-all duration-200 active:scale-95`}
                style={{
                  backgroundColor: state.soundType === sound.id ? `${theme.primary}20` : `${theme.text}06`,
                  border: `2px solid ${state.soundType === sound.id ? theme.primary : theme.border}`,
                }}
              >
                <div className="text-2xl mb-1.5">{sound.icon}</div>
                <div 
                  className="text-xs font-medium"
                  style={{ color: state.soundType === sound.id ? theme.primary : theme.text }}
                >
                  {sound.name}
                </div>
              </button>
            ))}
          </div>
          {state.soundType === 'custom' && (
            <button
              onClick={() => setShowEditor(true)}
              className="w-full mt-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-98"
              style={{
                background: theme.gradient,
                color: '#fff'
              }}
            >
              ✏️ 编辑自定义音色
            </button>
          )}
        </div>

        <div 
          className="mb-5 p-5"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <h2 
            className="text-base font-semibold mb-4"
            style={{ color: theme.text }}
          >
            重音音量
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => handleAccentVolumeChange(-5)}
              className="w-11 h-11 rounded-full font-bold text-lg transition-all active:scale-90"
              style={{ 
                backgroundColor: '#ef444415',
                color: '#ef4444',
                border: `1px solid #ef444430`
              }}
            >
              −
            </button>
            <div 
              className="flex-1 py-3 px-4 rounded-xl text-center text-xl font-bold"
              style={{ 
                backgroundColor: '#ef444410',
                color: '#ef4444'
              }}
            >
              {state.volume.accent}%
            </div>
            <button
              onClick={() => handleAccentVolumeChange(5)}
              className="w-11 h-11 rounded-full font-bold text-lg transition-all active:scale-90"
              style={{ 
                backgroundColor: '#ef444415',
                color: '#ef4444',
                border: `1px solid #ef444430`
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
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${state.volume.accent}%, ${theme.text}15 ${state.volume.accent}%, ${theme.text}15 100%)`,
            }}
          />
        </div>

        <div 
          className="mb-5 p-5"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <h2 
            className="text-base font-semibold mb-4"
            style={{ color: theme.text }}
          >
            普通音量
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => handleNormalVolumeChange(-5)}
              className="w-11 h-11 rounded-full font-bold text-lg transition-all active:scale-90"
              style={{ 
                backgroundColor: `${theme.primary}15`,
                color: theme.primary,
                border: `1px solid ${theme.primary}30`
              }}
            >
              −
            </button>
            <div 
              className="flex-1 py-3 px-4 rounded-xl text-center text-xl font-bold"
              style={{ 
                backgroundColor: `${theme.primary}10`,
                color: theme.primary
              }}
            >
              {state.volume.normal}%
            </div>
            <button
              onClick={() => handleNormalVolumeChange(5)}
              className="w-11 h-11 rounded-full font-bold text-lg transition-all active:scale-90"
              style={{ 
                backgroundColor: `${theme.primary}15`,
                color: theme.primary,
                border: `1px solid ${theme.primary}30`
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
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${state.volume.normal}%, ${theme.text}15 ${state.volume.normal}%, ${theme.text}15 100%)`,
            }}
          />
        </div>

        <div 
          className="p-5"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold" style={{ color: theme.text }}>
                🎤 环境音量自动调节
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                根据环境噪音自动调整节拍器音量
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ambientVolume.autoAdjust}
                onChange={ambientVolume.toggleAutoAdjust}
                className="sr-only peer"
              />
              <div 
                className="w-12 h-7 rounded-full peer transition-all duration-300"
                style={{ 
                  backgroundColor: ambientVolume.autoAdjust ? theme.primary : `${theme.text}20`,
                }}
              >
                <div 
                  className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow"
                  style={{
                    transform: ambientVolume.autoAdjust ? 'translateX(20px)' : 'translateX(0)'
                  }}
                />
              </div>
            </label>
          </div>

          <div 
            className="p-4 rounded-xl mb-4"
            style={{ backgroundColor: `${theme.text}06` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                环境噪音
              </span>
              <span 
                className="text-sm font-bold"
                style={{ color: getAmbientLevelColor() }}
              >
                {ambientVolume.ambientLevel.toFixed(1)} dB
              </span>
            </div>
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: `${theme.text}15` }}
            >
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, ambientVolume.ambientLevel)}%`,
                  backgroundColor: getAmbientLevelColor()
                }}
              />
            </div>
          </div>

          {!ambientVolume.isListening ? (
            <button
              onClick={ambientVolume.startListening}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all active:scale-98"
              style={{
                background: theme.gradient,
                color: '#fff'
              }}
            >
              🎤 开启麦克风检测
            </button>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                    灵敏度
                  </span>
                  <span className="text-sm font-bold" style={{ color: theme.primary }}>
                    {ambientVolume.sensitivity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={ambientVolume.sensitivity}
                  onChange={(e) => ambientVolume.setSensitivity(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ 
                    background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.secondary} ${(ambientVolume.sensitivity - 10) / 90 * 100}%, ${theme.text}15 ${(ambientVolume.sensitivity - 10) / 90 * 100}%, ${theme.text}15 100%)`,
                  }}
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                    基准音量
                  </span>
                  <span className="text-sm font-bold" style={{ color: theme.primary }}>
                    {ambientVolume.baseVolume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={ambientVolume.baseVolume}
                  onChange={(e) => ambientVolume.setBaseVolume(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ 
                    background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.secondary} ${(ambientVolume.baseVolume - 20) / 80 * 100}%, ${theme.text}15 ${(ambientVolume.baseVolume - 20) / 80 * 100}%, ${theme.text}15 100%)`,
                  }}
                />
              </div>

              <button
                onClick={ambientVolume.stopListening}
                className="w-full py-3 rounded-xl text-sm font-medium transition-all active:scale-98"
                style={{
                  backgroundColor: '#ef444415',
                  color: '#ef4444',
                  border: '1px solid #ef444430'
                }}
              >
                停止检测
              </button>
            </>
          )}

          {ambientVolume.error && (
            <p className="text-xs mt-3 text-center" style={{ color: '#ef4444' }}>
              {ambientVolume.error}
            </p>
          )}
        </div>
      </div>

      <SoundEditor isOpen={showEditor} onClose={() => setShowEditor(false)} />
    </div>
  );
};

export default SoundSettings;
