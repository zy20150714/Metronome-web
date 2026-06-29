import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { audioUtils } from '../utils/audioUtils';

interface SoundEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const SoundEditor: React.FC<SoundEditorProps> = ({ isOpen, onClose, onSave }) => {
  const { theme } = useTheme();
  const config = audioUtils.getCustomSoundConfig();
  
  const [waveType, setWaveType] = useState<OscillatorType>(config.waveType);
  const [accentFreq, setAccentFreq] = useState(config.accentFrequency);
  const [normalFreq, setNormalFreq] = useState(config.normalFrequency);
  const [duration, setDuration] = useState(config.duration * 1000);

  useEffect(() => {
    if (isOpen) {
      const cfg = audioUtils.getCustomSoundConfig();
      setWaveType(cfg.waveType);
      setAccentFreq(cfg.accentFrequency);
      setNormalFreq(cfg.normalFrequency);
      setDuration(cfg.duration * 1000);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePreview = () => {
    audioUtils.setCustomSoundConfig({
      waveType,
      accentFrequency: accentFreq,
      normalFrequency: normalFreq,
      duration: duration / 1000
    });
    audioUtils.testSound('custom', true);
  };

  const handlePreviewNormal = () => {
    audioUtils.setCustomSoundConfig({
      waveType,
      accentFrequency: accentFreq,
      normalFrequency: normalFreq,
      duration: duration / 1000
    });
    audioUtils.testSound('custom', false);
  };

  const handleSave = () => {
    audioUtils.setCustomSoundConfig({
      waveType,
      accentFrequency: accentFreq,
      normalFrequency: normalFreq,
      duration: duration / 1000
    });
    onSave?.();
    onClose();
  };

  const waveTypes: { value: OscillatorType; label: string }[] = [
    { value: 'sine', label: '正弦波' },
    { value: 'square', label: '方波' },
    { value: 'sawtooth', label: '锯齿波' },
    { value: 'triangle', label: '三角波' },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
      />
      <div
        className="relative w-full max-w-lg mx-4 animate-slideUp"
        style={{
          backgroundColor: theme.background,
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          border: `1px solid ${theme.border}`,
          maxHeight: '90vh',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: theme.border }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text }}>自定义音色</h2>
            <p className="text-sm mt-0.5" style={{ color: theme.textSecondary }}>
              打造你专属的节拍声音
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: `${theme.text}10` }}
          >
            <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="mb-6">
            <label className="text-sm font-medium mb-3 block" style={{ color: theme.text }}>
              波形类型
            </label>
            <div className="grid grid-cols-4 gap-2">
              {waveTypes.map((w) => (
                <button
                  key={w.value}
                  onClick={() => setWaveType(w.value)}
                  className="py-3 px-2 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: waveType === w.value ? theme.primary : `${theme.text}08`,
                    color: waveType === w.value ? '#fff' : theme.text,
                    border: `1px solid ${waveType === w.value ? theme.primary : theme.border}`
                  }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium" style={{ color: theme.text }}>
                重音频率
              </label>
              <span 
                className="text-sm font-bold"
                style={{ color: theme.primary }}
              >
                {accentFreq} Hz
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="4000"
              step="10"
              value={accentFreq}
              onChange={(e) => setAccentFreq(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.secondary} ${(accentFreq - 200) / 3800 * 100}%, ${theme.text}15 ${(accentFreq - 200) / 3800 * 100}%, ${theme.text}15 100%)`
              }}
            />
            <div className="flex justify-between mt-1" style={{ color: theme.textSecondary, fontSize: '10px' }}>
              <span>200 Hz</span>
              <span>4000 Hz</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium" style={{ color: theme.text }}>
                普通频率
              </label>
              <span 
                className="text-sm font-bold"
                style={{ color: theme.secondary }}
              >
                {normalFreq} Hz
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              step="10"
              value={normalFreq}
              onChange={(e) => setNormalFreq(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${theme.secondary} 0%, ${theme.primary} ${(normalFreq - 100) / 2900 * 100}%, ${theme.text}15 ${(normalFreq - 100) / 2900 * 100}%, ${theme.text}15 100%)`
              }}
            />
            <div className="flex justify-between mt-1" style={{ color: theme.textSecondary, fontSize: '10px' }}>
              <span>100 Hz</span>
              <span>3000 Hz</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium" style={{ color: theme.text }}>
                音长
              </label>
              <span 
                className="text-sm font-bold"
                style={{ color: theme.primary }}
              >
                {duration} ms
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.secondary} ${(duration - 10) / 490 * 100}%, ${theme.text}15 ${(duration - 10) / 490 * 100}%, ${theme.text}15 100%)`
              }}
            />
            <div className="flex justify-between mt-1" style={{ color: theme.textSecondary, fontSize: '10px' }}>
              <span>10ms</span>
              <span>500ms</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium mb-3 block" style={{ color: theme.text }}>
              试听
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePreview}
                className="py-4 px-4 rounded-xl font-medium transition-all duration-200 active:scale-95"
                style={{
                  background: theme.gradient,
                  color: '#fff',
                }}
              >
                🎵 试听重音
              </button>
              <button
                onClick={handlePreviewNormal}
                className="py-4 px-4 rounded-xl font-medium transition-all duration-200 active:scale-95"
                style={{
                  backgroundColor: `${theme.primary}15`,
                  color: theme.primary,
                  border: `1px solid ${theme.primary}30`
                }}
              >
                🔔 试听普通
              </button>
            </div>
          </div>

          <div 
            className="p-4 rounded-xl mb-6"
            style={{
              backgroundColor: `${theme.primary}08`,
              border: `1px solid ${theme.primary}20`
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: theme.text }}>小贴士</p>
                <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                  保存后，在声音设置中选择「自定义」音色即可使用你创建的专属音效。
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl font-medium transition-all duration-200"
              style={{
                backgroundColor: `${theme.text}10`,
                color: theme.text,
              }}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-4 rounded-xl font-medium transition-all duration-200"
              style={{
                background: theme.gradient,
                color: '#fff',
              }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundEditor;
