import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import { getSoundTypeEmoji } from '../../utils/metronomeUtils';
import { audioUtils } from '../../utils/audioUtils';
import { useSystemSettings } from '../ControlPanel/SystemSettings';

const SoundSelector: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { settings } = useSystemSettings();
  
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
    <div className={`rounded-2xl p-4 sm:p-6 mb-8 ${settings.darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} shadow-xl`}>
      <h3 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${settings.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>声音设置</h3>
      
      {/* 声音类型选择 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {soundTypes.map((sound) => (
          <button
            key={sound.value}
            onClick={() => handleSoundTypeChange(sound.value)}
            className={`py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex flex-col items-center ${state.soundType === sound.value ? (settings.darkMode ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-900/30 scale-105' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/20 scale-105') : (settings.darkMode ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100')}`}
          >
            <span className="text-2xl mb-1">{getSoundTypeEmoji(sound.value)}</span>
            <span className="text-xs">{sound.label}</span>
          </button>
        ))}
      </div>
      
      {/* 预览按钮 */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
        <button
          onClick={handlePreviewAccent}
          className={`flex-1 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${settings.darkMode ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800' : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'}`}
        >
          预览重音
        </button>
        <button
          onClick={handlePreviewNormal}
          className={`flex-1 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${settings.darkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'}`}
        >
          预览普通音
        </button>
      </div>
      
      {/* 音量调节 */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>重音音量: {state.volume.accent}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={state.volume.accent}
            onChange={(e) => handleVolumeChange('accent', parseInt(e.target.value))}
            className={`w-full h-3 rounded-lg appearance-none cursor-pointer transition-all duration-300 ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          />
        </div>
        
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>普通音音量: {state.volume.normal}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={state.volume.normal}
            onChange={(e) => handleVolumeChange('normal', parseInt(e.target.value))}
            className={`w-full h-3 rounded-lg appearance-none cursor-pointer transition-all duration-300 ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(SoundSelector);