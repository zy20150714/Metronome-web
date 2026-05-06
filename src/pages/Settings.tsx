import React from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { subdivisionConfigs } from '../utils/metronomeUtils';

const Settings: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const [numerator, denominator] = state.timeSignature.split('/').map(Number);

  const numeratorOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const denominatorOptions = [2, 4, 8, 16];

  const handleTimeSignatureChange = (newNumerator: number, newDenominator: number) => {
    dispatch({ 
      type: 'SET_TIME_SIGNATURE', 
      payload: `${newNumerator}/${newDenominator}` as any 
    });
  };

  const handleSubdivisionChange = (subdivision: any) => {
    dispatch({ type: 'SET_SUBDIVISION', payload: subdivision });
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
          <h1 className="text-3xl font-bold text-white mb-2 display-font">PARAMETERS</h1>
          <p className="text-gray-400 text-sm tracking-wider">调整节拍器参数设置</p>
        </div>

        {/* 拍号设置 */}
        <div className="card-tech p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6 text-cyan-400">TIME SIGNATURE</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm text-gray-400 mb-3 block">小节数 (Beats)</label>
              <div className="grid grid-cols-4 gap-2">
                {numeratorOptions.map(num => (
                  <button
                    key={num}
                    onClick={() => handleTimeSignatureChange(num, denominator)}
                    className={`py-3 rounded-lg font-semibold transition-all duration-200 ${
                      numerator === num
                        ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-3 block">节拍单位 (Note Value)</label>
              <div className="grid grid-cols-2 gap-2">
                {denominatorOptions.map(den => (
                  <button
                    key={den}
                    onClick={() => handleTimeSignatureChange(numerator, den)}
                    className={`py-3 rounded-lg font-semibold transition-all duration-200 ${
                      denominator === den
                        ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {den}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4 flex items-center justify-center gap-3">
            <span className="text-5xl font-bold text-white display-font">{numerator}</span>
            <div className="w-12 h-0.5 bg-cyan-500" />
            <span className="text-5xl font-bold text-white display-font">{denominator}</span>
          </div>
        </div>

        {/* 细分设置 */}
        <div className="card-tech p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6 text-orange-400">SUBDIVISION</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {subdivisionConfigs.map(config => (
              <button
                key={config.value}
                onClick={() => handleSubdivisionChange(config.value)}
                className={`p-4 rounded-xl transition-all duration-300 text-left ${
                  state.subdivision === config.value
                    ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/40'
                    : 'bg-gray-800 border border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-semibold text-white">{config.name}</span>
                  <span className="text-2xl">{config.symbol}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {config.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 当前设置 */}
        <div className="card-tech p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-400">CURRENT SETTINGS</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">TIME SIGNATURE</div>
              <div className="text-2xl font-bold text-white display-font">{state.timeSignature}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">SUBDIVISION</div>
              <div className="text-2xl font-bold text-white display-font">
                {subdivisionConfigs.find(c => c.value === state.subdivision)?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
