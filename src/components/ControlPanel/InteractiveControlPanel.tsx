import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import { subdivisionConfigs, getSubdivisionConfig } from '../../utils/metronomeUtils';
import type { SubdivisionType } from '../../types';

const InteractiveControlPanel: React.FC = () => {
  const { state, dispatch } = useMetronome();

  const numeratorOptions = Array.from({ length: 16 }, (_, i) => i + 1);
  const denominatorOptions = [2, 4, 8, 16];
  const [currentNumerator, currentDenominator] = state.timeSignature.split('/').map(Number);
  const currentSubdivisionConfig = getSubdivisionConfig(state.subdivision);

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

  return (
    <div className="glass rounded-2xl p-6 mb-6 shadow-xl animate-fadeIn">
      <h3 className="text-xl font-semibold mb-6 text-white">参数调节</h3>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-xl p-4 flex flex-col items-center justify-center border border-pink-500/30">
          <div className="text-3xl font-bold text-pink-400">{currentNumerator}</div>
          <div className="text-3xl font-bold text-pink-400">{currentDenominator}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl p-4 flex items-center justify-center border border-purple-500/30">
          <div className="text-4xl text-purple-400">{currentSubdivisionConfig.symbol}</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-4 flex items-center justify-center border border-cyan-500/30">
          <div className="text-4xl font-bold text-cyan-400">{state.bpm}</div>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-sm font-medium mb-4 text-gray-300">小节数</div>
        <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
          {numeratorOptions.map((num) => (
            <button
              key={`num-${num}`}
              onClick={() => handleNumeratorChange(num)}
              className={`min-w-[50px] py-3 px-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                currentNumerator === num
                  ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30 scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="text-sm font-medium mb-4 text-gray-300">节拍单位</div>
        <div className="flex gap-3">
          {denominatorOptions.map((den) => (
            <button
              key={`den-${den}`}
              onClick={() => handleDenominatorChange(den)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                currentDenominator === den
                  ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {den}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="text-sm font-medium mb-4 text-gray-300">节拍细分</div>
        <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
          {subdivisionConfigs.map((config) => (
            <button
              key={`sub-${config.value}`}
              onClick={() => handleSubdivisionChange(config.value)}
              title={config.description}
              className={`min-w-[80px] py-4 px-3 rounded-lg transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 ${
                state.subdivision === config.value
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <div className="text-3xl">{config.symbol}</div>
              <div className="text-xs">{config.name}</div>
            </button>
          ))}
        </div>
        <div className="text-xs mt-3 text-gray-400">{currentSubdivisionConfig.description}</div>
      </div>

      <div>
        <div className="text-sm font-medium mb-4 text-gray-300">速度 (BPM)</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleBPMChange(Math.max(30, state.bpm - 1))}
            className="w-14 h-14 rounded-full font-bold text-2xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:scale-110 active:scale-95"
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
            className="flex-1 py-4 px-4 rounded-xl text-center text-3xl font-bold bg-white/5 text-white border border-white/10 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all duration-300"
          />
          <button
            onClick={() => handleBPMChange(Math.min(300, state.bpm + 1))}
            className="w-14 h-14 rounded-full font-bold text-2xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:scale-110 active:scale-95"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveControlPanel;
