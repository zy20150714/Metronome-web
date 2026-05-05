import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import { getSoundTypeEmoji } from '../../utils/metronomeUtils';
import { audioUtils } from '../../utils/audioUtils';

const SoundSelector: React.FC = () => {
  const { state, dispatch } = useMetronome();

  const handleSoundTypeChange = (soundType: string) => {
    dispatch({ type: 'SET_SOUND_TYPE', payload: soundType as any });
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

  const soundTypes = [
    { value: 'click', label: '点击声' },
    { value: 'drum', label: '鼓声' },
    { value: 'wood', label: '木鱼' },
    { value: 'electronic', label: '电子音' },
    { value: 'metal', label: '金属音' },
  ];

  return (
    <div className="glass rounded-2xl p-6 shadow-xl animate-fadeIn">
      <h3 className="text-xl font-semibold mb-6 text-white">声音设置</h3>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {soundTypes.map((sound) => (
          <button
            key={sound.value}
            onClick={() => handleSoundTypeChange(sound.value)}
            className={`py-4 rounded-xl font-semibold transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 ${
              state.soundType === sound.value
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span className="text-3xl">{getSoundTypeEmoji(sound.value)}</span>
            <span className="text-xs">{sound.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={handlePreviewAccent}
          className="flex-1 py-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700 shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95"
        >
          预览重音
        </button>
        <button
          onClick={handlePreviewNormal}
          className="flex-1 py-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95"
        >
          预览普通音
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">重音音量</label>
            <span className="text-pink-400 font-semibold">{state.volume.accent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.volume.accent}
            onChange={(e) => handleVolumeChange('accent', parseInt(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">普通音音量</label>
            <span className="text-cyan-400 font-semibold">{state.volume.normal}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.volume.normal}
            onChange={(e) => handleVolumeChange('normal', parseInt(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(SoundSelector);
