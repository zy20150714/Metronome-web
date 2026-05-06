import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useMetronomePlayback } from '../hooks/useMetronomePlayback';

const Home: React.FC = () => {
  useMetronomePlayback();
  const { state, dispatch } = useMetronome();
  const prevBeatRef = useRef(state.currentBeat);

  const totalBeats = parseInt(state.timeSignature.split('/')[0]);

  const handleBPMChange = (value: number) => {
    dispatch({ type: 'SET_BPM', payload: Math.max(30, Math.min(300, value)) });
  };

  const handleTogglePlay = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  useEffect(() => {
    prevBeatRef.current = state.currentBeat;
  }, [state.currentBeat]);

  return (
    <div className="min-h-screen tech-bg grid-bg relative overflow-hidden">
      {/* 扫描线效果 */}
      <div className="scan-line absolute inset-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 display-font">
            METRONOME
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Professional Beat Control
          </p>
        </div>

        {/* BPM 显示 */}
        <div className="card-tech p-8 mb-8 text-center float">
          <div className="text-[72px] md:text-[88px] font-bold display-font mb-2 bg-gradient-to-r from-orange-500 via-orange-400 to-cyan-400 bg-clip-text text-transparent">
            {state.bpm}
          </div>
          <div className="text-gray-500 tracking-widest uppercase text-sm">
            Beats Per Minute
          </div>
        </div>

        {/* 节拍显示 */}
        <div className="card-tech p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-400 text-sm tracking-wider">TIME SIGNATURE</span>
            <span className="text-2xl font-bold text-cyan-400 display-font">
              {state.timeSignature}
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-3 md:gap-4">
            {Array.from({ length: totalBeats }).map((_, i) => {
              const beatNum = i + 1;
              const isCurrent = beatNum === state.currentBeat;
              const isAccent = beatNum === 1;
              
              return (
                <div
                  key={beatNum}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-200 ${
                    isCurrent
                      ? isAccent
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 glow-orange scale-110'
                        : 'bg-gradient-to-br from-cyan-500 to-cyan-600 glow-cyan scale-110'
                      : isAccent
                      ? 'bg-orange-900/40 border border-orange-700/50'
                      : 'bg-gray-800/60 border border-gray-700/50'
                  } ${isCurrent ? 'pulse-beat' : ''}`}
                >
                  <span className={isCurrent ? 'text-white' : 'text-gray-400'}>
                    {beatNum}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BPM 滑块 */}
        <div className="card-tech p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm tracking-wider">TEMPO</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleBPMChange(state.bpm - 1)}
                className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-500 transition-colors flex items-center justify-center"
              >
                <span className="text-xl text-gray-300">−</span>
              </button>
              <button
                onClick={() => handleBPMChange(state.bpm + 1)}
                className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-500 transition-colors flex items-center justify-center"
              >
                <span className="text-xl text-gray-300">+</span>
              </button>
            </div>
          </div>
          
          <input
            type="range"
            min="30"
            max="300"
            value={state.bpm}
            onChange={(e) => handleBPMChange(parseInt(e.target.value))}
            className="w-full"
          />
          
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>30</span>
            <span>300</span>
          </div>
        </div>

        {/* 播放控制 */}
        <div className="flex justify-center mb-10">
          <button
            onClick={handleTogglePlay}
            className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
              state.isPlaying
                ? 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600'
                : 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500'
            } ${state.isPlaying ? '' : 'glow-orange'}`}
          >
            <div className="w-0 h-0 border-t-[18px] border-t-transparent border-l-[32px] border-l-white border-b-[18px] border-b-transparent md:border-t-[20px] md:border-l-[36px] md:border-b-[20px] ml-1" />
          </button>
        </div>

        {/* 导航按钮 */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/settings"
            className="card-tech p-6 text-center transition-all duration-300 hover:bg-gray-800/60"
          >
            <div className="text-3xl mb-2">⚙️</div>
            <span className="text-gray-300 font-semibold">参数设置</span>
          </Link>
          
          <Link
            to="/sound"
            className="card-tech p-6 text-center transition-all duration-300 hover:bg-gray-800/60"
          >
            <div className="text-3xl mb-2">🔊</div>
            <span className="text-gray-300 font-semibold">声音设置</span>
          </Link>
          
          <Link
            to="/system"
            className="card-tech p-6 text-center transition-all duration-300 hover:bg-gray-800/60 col-span-2"
          >
            <div className="text-3xl mb-2">🔧</div>
            <span className="text-gray-300 font-semibold">系统设置</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
