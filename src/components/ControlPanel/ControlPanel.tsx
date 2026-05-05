import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';

const ControlPanel: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const [isPressed, setIsPressed] = React.useState(false);
  
  const handleTogglePlay = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };
  
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  
  return (
    <div className="flex flex-col items-center justify-center mb-10">
      {/* 播放状态指示器 */}
      <div className={`mb-6 sm:mb-8 flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-full transition-all duration-500 ${state.isPlaying ? 'bg-gradient-to-br from-green-400 to-emerald-600 animate-breath shadow-2xl shadow-green-500/60' : 'bg-gradient-to-br from-gray-600 to-gray-800'}`}>
        {state.isPlaying ? (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-6 bg-white rounded animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-8 bg-white rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-6 bg-white rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
        ) : (
          <div className="w-4 h-4 bg-gray-400 rounded-full" />
        )}
      </div>
      
      {/* 大型播放/停止按钮 - 响应式大小 */}
      <button
        onClick={handleTogglePlay}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center text-white font-bold shadow-2xl transition-all duration-300 ripple ${state.isPlaying ? 'bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-pink-500/50' : 'bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-cyan-500/50'} ${isPressed ? 'scale-95' : 'scale-100'} ${state.isPlaying ? 'animate-glow' : ''}`}
      >
        {state.isPlaying ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-12 sm:w-5 sm:h-14 bg-white rounded" />
            <div className="w-4 h-12 sm:w-5 sm:h-14 bg-white rounded" />
          </div>
        ) : (
          <svg className="w-16 h-16 sm:w-20 sm:h-20 ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      
      {/* 状态文字 */}
      <div className="mt-6 text-gray-400 text-sm sm:text-base font-medium tracking-wider uppercase">
        {state.isPlaying ? '正在播放...' : '点击开始'}
      </div>
    </div>
  );
};

export default React.memo(ControlPanel);