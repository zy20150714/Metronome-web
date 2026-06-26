import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import { useTheme } from '../../contexts/ThemeContext';

const ControlPanel: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = React.useState(false);

  const handleTogglePlay = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return (
    <div className="flex flex-col items-center justify-center mb-10">
      <div
        className={`mb-8 flex items-center justify-center w-20 sm:w-24 h-20 sm:h-24 rounded-full transition-all duration-500 ${
          state.isPlaying ? 'animate-breath' : ''
        }`}
        style={{
          background: state.isPlaying
            ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
            : 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
          boxShadow: state.isPlaying
            ? '0 0 30px rgba(34, 197, 94, 0.5), 0 0 60px rgba(34, 197, 94, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        {state.isPlaying ? (
          <div className="flex items-center space-x-1.5">
            <div
              className="w-2 h-7 sm:h-8 bg-white rounded animate-pulse"
              style={{ animationDelay: '0s' }}
            />
            <div
              className="w-2 h-5 bg-white rounded animate-pulse"
              style={{ animationDelay: '0.15s' }}
            />
            <div
              className="w-2 h-7 sm:h-8 bg-white rounded animate-pulse"
              style={{ animationDelay: '0.3s' }}
            />
          </div>
        ) : (
          <div className="w-5 h-5 bg-gray-400 rounded-full" />
        )}
      </div>

      <button
        onClick={handleTogglePlay}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ripple ${isPressed ? 'scale-95' : 'scale-100'}`}
        style={{
          background: state.isPlaying
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            : theme.gradient,
          boxShadow: state.isPlaying
            ? '0 0 40px rgba(239, 68, 68, 0.5)'
            : `0 0 40px ${theme.glow}`,
        }}
      >
        {state.isPlaying ? (
          <div className="flex items-center space-x-3">
            <div className="w-3 h-12 sm:w-4 sm:h-14 bg-white rounded" />
            <div className="w-3 h-12 sm:w-4 sm:h-14 bg-white rounded" />
          </div>
        ) : (
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 ml-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div
        className="mt-6 text-sm sm:text-base font-medium tracking-wider uppercase"
        style={{ color: theme.textSecondary }}
      >
        {state.isPlaying ? '正在播放...' : '点击开始'}
      </div>
    </div>
  );
};

export default React.memo(ControlPanel);