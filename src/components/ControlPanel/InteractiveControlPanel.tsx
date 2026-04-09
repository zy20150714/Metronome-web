import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import { getNoteValueSymbol } from '../../utils/metronomeUtils';
import type { NoteValue } from '../../types';
import { useSystemSettings } from '../ControlPanel/SystemSettings';

const InteractiveControlPanel: React.FC = () => {
  const { state, dispatch } = useMetronome();
  
  const numeratorOptions = Array.from({ length: 16 }, (_, i) => i + 1);
  
  const denominatorOptions = [2, 4, 8, 16];
  
  const noteValueOptions: NoteValue[] = ['whole', 'half', 'quarter', 'eighth', 'sixteenth', 'triplet'];
  
  const [currentNumerator, currentDenominator] = state.timeSignature.split('/').map(Number);
  
  const handleNumeratorChange = (numerator: number) => {
    dispatch({ type: 'SET_TIME_SIGNATURE', payload: `${numerator}/${currentDenominator}` as any });
  };
  
  const handleDenominatorChange = (denominator: number) => {
    dispatch({ type: 'SET_TIME_SIGNATURE', payload: `${currentNumerator}/${denominator}` as any });
  };
  
  const handleNoteValueChange = (noteValue: NoteValue) => {
    dispatch({ type: 'SET_NOTE_VALUE', payload: noteValue });
  };
  
  const handleBPMChange = (value: number) => {
    dispatch({ type: 'SET_BPM', payload: value });
  };
  
  const { settings } = useSystemSettings();
  
  return (
    <div className={`rounded-xl p-6 mb-6 ${settings.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${settings.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>交互调节面板</h3>
      
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center gap-4">
          <div className="bg-blue-500 rounded-lg border-2 border-blue-500 p-4 w-24 h-24 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white">{currentNumerator}</div>
            <div className="text-3xl font-bold text-white">{currentDenominator}</div>
          </div>
          
          <div className="bg-blue-500 rounded-lg border-2 border-blue-500 p-4 w-24 h-24 flex items-center justify-center">
            <div className="text-4xl text-white">
              {getNoteValueSymbol(state.noteValue)}
            </div>
          </div>
          
          <div className={`rounded-lg p-4 flex-1 h-24 flex items-center justify-center ${settings.darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className={`text-5xl font-bold ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>
              {state.bpm}
            </div>
          </div>
        </div>
        
        <div>
          <div className={`text-sm mb-2 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>小节数</div>
          <div className="flex overflow-x-auto gap-2 pb-2">
            {numeratorOptions.map((num) => (
              <button
                key={`num-${num}`}
                onClick={() => handleNumeratorChange(num)}
                className={`px-4 py-2 rounded-lg min-w-[40px] transition-all ${currentNumerator === num ? 'bg-blue-500 text-white font-bold' : settings.darkMode ? 'bg-gray-700 text-gray-100 hover:bg-blue-900' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <div className={`text-sm mb-2 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>单拍音符</div>
          <div className="flex gap-3">
            {denominatorOptions.map((den) => (
              <button
                key={`den-${den}`}
                onClick={() => handleDenominatorChange(den)}
                className={`px-6 py-2 rounded-lg transition-all ${currentDenominator === den ? 'bg-blue-500 text-white font-bold' : settings.darkMode ? 'bg-gray-700 text-gray-100 hover:bg-blue-900' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
              >
                {den}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <div className={`text-sm mb-2 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>时值</div>
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {noteValueOptions.map((nv) => (
              <button
                key={`nv-${nv}`}
                onClick={() => handleNoteValueChange(nv)}
                className={`px-6 py-3 rounded-lg transition-all flex-shrink-0 ${state.noteValue === nv ? 'bg-blue-500 text-white' : settings.darkMode ? 'bg-gray-700 text-gray-100 hover:bg-blue-900' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
              >
                <div className="text-3xl">{getNoteValueSymbol(nv)}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <div className={`text-sm mb-2 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>速度</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleBPMChange(state.bpm - 1)}
              className={`w-12 h-12 rounded-full font-bold text-2xl transition-all ${settings.darkMode ? 'bg-gray-700 text-white hover:bg-blue-900' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
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
              className={`flex-1 px-4 py-3 rounded-lg text-center text-xl font-bold border-2 outline-none ${settings.darkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'}`}
            />
            <button
              onClick={() => handleBPMChange(state.bpm + 1)}
              className={`w-12 h-12 rounded-full font-bold text-2xl transition-all ${settings.darkMode ? 'bg-gray-700 text-white hover:bg-blue-900' : 'bg-white text-gray-800 hover:bg-blue-100'}`}
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