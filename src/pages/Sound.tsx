import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { getSoundTypeEmoji } from '../utils/metronomeUtils';
import { audioUtils } from '../utils/audioUtils';

const Sound: React.FC = () => {
  const { state, dispatch } = useMetronome();

  const soundOptions = [
    { value: 'click', name: 'CLICK', desc: '经典的点击声' },
    { value: 'drum', name: 'DRUM', desc: '鼓机节奏声' },
    { value: 'wood', name: 'WOOD', desc: '木鱼打击声' },
    { value: 'electronic', name: 'ELECTRONIC', desc: '电子合成音' },
    { value: 'metal', name: 'METAL', desc: '金属敲击声' }
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
    <div className="min-h-screen tech-bg grid-bg relative overflow-hidden pb-24">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* 返回导航 */}
        <div className="mb-8">
          <Link
            to="/"
            className="btn-secondary inline-flex items-center gap-3 px-6 py-4 rounded-lg text-gray-300 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </Link>
        </div>

        {/* 标题 */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2 display-font">SOUND</h1>
          <p className="text-gray-400 text-sm tracking-wider">选择和调整节拍器声音</p>
        </div>

        {/* 声音类型 */}
        <div className="card-tech p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6 text-cyan-400">SOUND TYPE</h2>
          
          <div className="grid grid-cols-1 gap-3">
            {soundOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSoundTypeChange(option.value)}
                className={`p-4 rounded-xl transition-all duration-300 flex items-center gap-4 ${
                  state.soundType === option.value
                    ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/40'
                    : 'bg-gray-800 border border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="w-14 h-14 rounded-lg bg-gray-900 flex items-center justify-center text-2xl">
                  {getSoundTypeEmoji(option.value)}
                </div>
                <div className="text-left">
                  <div className="text-lg font-semibold text-white">{option.name}</div>
                  <div className="text-xs text-gray-400">{option.desc}</div>
                </div>
                {state.soundType === option.value && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-orange-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 音量控制 */}
        <div className="card-tech p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6 text-orange-400">VOLUME</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-400">重音 (Accent)</label>
                <span className="text-white font-semibold display-font">{state.volume.accent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={state.volume.accent}
                onChange={(e) => handleVolumeChange('accent', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-400">普通音 (Normal)</label>
                <span className="text-white font-semibold display-font">{state.volume.normal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={state.volume.normal}
                onChange={(e) => handleVolumeChange('normal', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* 预览按钮 */}
        <div className="card-tech p-6">
          <h2 className="text-lg font-semibold mb-6 text-cyan-400">PREVIEW</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handlePreviewAccent}
              className="btn-primary py-5 rounded-lg font-semibold text-white flex flex-col items-center gap-2"
            >
              <span className="text-2xl">🎵</span>
              <span>重音预览</span>
            </button>
            <button
              onClick={handlePreviewNormal}
              className="btn-secondary py-5 rounded-lg font-semibold text-gray-300 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">🎶</span>
              <span>普通音预览</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sound;
