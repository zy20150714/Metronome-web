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
    <div className="flex flex-col items-center justify-center mb-8">
      {/* 播放状态指示器 */}
      <div className={`mb-6 flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${state.isPlaying ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-gray-300'}`}>
        {state.isPlaying && (
          <div className="w-5 h-5 bg-white rounded-full animate-beat" />
        )}
      </div>
      
      {/* 大型播放/停止按钮 - 120x120px */}
      <button
        onClick={handleTogglePlay}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl transition-all duration-200 active:scale-95 ${state.isPlaying ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} ${isPressed ? 'scale-95' : 'scale-100'}`}
      >
        {state.isPlaying ? (
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-1">⏸</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-1">▶</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;