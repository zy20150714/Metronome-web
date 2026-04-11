import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import { subdivisionConfigs, getSubdivisionConfig } from '../../utils/metronomeUtils';
import type { SubdivisionType } from '../../types';
import { useSystemSettings } from '../ControlPanel/SystemSettings';

const InteractiveControlPanel: React.FC = () => {
  const { state, dispatch } = useMetronome();
  
  const numeratorOptions = Array.from({ length: 16 }, (_, i) => i + 1);
  
  const denominatorOptions = [2, 4, 8, 16];
  
  const [currentNumerator, currentDenominator] = state.timeSignature.split('/').map(Number);
  
  const handleNumeratorChange = (numerator: number) => {
    dispatch({ type: 'SET_TIME_SIGNATURE', payload: `${numerator}/${currentDenominator}` as any });
  };
  
  const handleDenominatorChange = (denominator: number) => {
    dispatch({ type: 'SET_TIME_SIGNATURE', payload: `${currentNumerator}/${denominator}` as any });
  };
  
  const handleSubdivisionChange = (subdivision: SubdivisionType) => {
    dispatch({ type: 'SET_SUBDIVISION', payload: subdivision });
  };
  
  const handleBPMChange = (value: number) => {
    dispatch({ type: 'SET_BPM', payload: value });
  };
  
  const { settings } = useSystemSettings();
  
  const currentSubdivisionConfig = getSubdivisionConfig(state.subdivision);
  
  return (
    <div className={`rounded-2xl p-4 sm:p-6 mb-8 ${settings.darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} shadow-xl`}>
      <h3 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${settings.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>交互调节面板</h3>
      
      <div className="flex flex-col space-y-6 sm:space-y-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className={`rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center ${settings.darkMode ? 'bg-gradient-to-br from-blue-900/80 to-blue-800/80' : 'bg-gradient-to-br from-blue-500/90 to-blue-600/90'}`}>
            <div className={`text-2xl sm:text-3xl font-bold text-white`}>{currentNumerator}</div>
            <div className={`text-2xl sm:text-3xl font-bold text-white`}>{currentDenominator}</div>
          </div>
          
          <div className={`rounded-xl p-3 sm:p-4 flex items-center justify-center ${settings.darkMode ? 'bg-gradient-to-br from-purple-900/80 to-purple-800/80' : 'bg-gradient-to-br from-purple-500/90 to-purple-600/90'}`}>
            <div className={`text-3xl sm:text-4xl text-white`}>
              {currentSubdivisionConfig.symbol}
            </div>
          </div>
          
          <div className={`rounded-xl p-3 sm:p-4 flex items-center justify-center ${settings.darkMode ? 'bg-gradient-to-br from-green-900/80 to-green-800/80' : 'bg-gradient-to-br from-green-500/90 to-green-600/90'}`}>
            <div className={`text-3xl sm:text-4xl font-bold text-white`}>
              {state.bpm}
            </div>
          </div>
        </div>
        
        <div>
          <div className={`text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>小节数</div>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {numeratorOptions.map((num) => (
              <button
                key={`num-${num}`}
                onClick={() => handleNumeratorChange(num)}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg min-w-[40px] sm:min-w-[48px] transition-all duration-300 ${currentNumerator === num ? (settings.darkMode ? 'bg-blue-600 text-white font-bold shadow-blue-900/30' : 'bg-blue-500 text-white font-bold shadow-blue-500/20') : (settings.darkMode ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100')}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <div className={`text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>节拍单位</div>
          <div className="flex gap-2 sm:gap-3">
            {denominatorOptions.map((den) => (
              <button
                key={`den-${den}`}
                onClick={() => handleDenominatorChange(den)}
                className={`flex-1 py-2 sm:py-3 rounded-lg transition-all duration-300 ${currentDenominator === den ? (settings.darkMode ? 'bg-purple-600 text-white font-bold shadow-purple-900/30' : 'bg-purple-500 text-white font-bold shadow-purple-500/20') : (settings.darkMode ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100')}`}
              >
                {den}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <div className={`text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>节拍细分</div>
          <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {subdivisionConfigs.map((config) => (
              <button
                key={`sub-${config.value}`}
                onClick={() => handleSubdivisionChange(config.value)}
                title={config.description}
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-300 flex-shrink-0 flex flex-col items-center gap-1 ${state.subdivision === config.value ? (settings.darkMode ? 'bg-indigo-600 text-white shadow-indigo-900/30' : 'bg-indigo-500 text-white shadow-indigo-500/20') : (settings.darkMode ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100')}`}
              >
                <div className="text-2xl sm:text-3xl">{config.symbol}</div>
                <div className="text-xs">{config.name}</div>
              </button>
            ))}
          </div>
          <div className={`text-xs mt-2 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {currentSubdivisionConfig.description}
          </div>
        </div>
        
        <div>
          <div className={`text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>速度 (BPM)</div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleBPMChange(state.bpm - 1)}
              className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full font-bold text-xl sm:text-2xl transition-all duration-300 ${settings.darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            >
              -
            </button>
            <input
              type="number"
              value={state.bpm}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                let finalValue = value;
                if (value < 30) finalValue = 30;
                if (value > 300) finalValue = 300;
                dispatch({ type: 'SET_BPM', payload: finalValue });
              }}
              min="30"
              max="300"
              className={`flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-lg text-center text-xl sm:text-2xl font-bold border-2 outline-none transition-all duration-300 ${settings.darkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-green-500' : 'bg-white text-gray-800 border-gray-300 focus:border-green-500'}`}
            />
            <button
              onClick={() => handleBPMChange(state.bpm + 1)}
              className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full font-bold text-xl sm:text-2xl transition-all duration-300 ${settings.darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveControlPanel;
