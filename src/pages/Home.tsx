import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatBPM, formatTimeSignature } from '../utils/metronomeUtils';
import { soundNames } from '../utils/audioUtils';

const Home: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handlePlayPause = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const handleBPMChange = (delta: number) => {
    const newBPM = Math.min(300, Math.max(20, state.bpm + delta));
    dispatch({ type: 'SET_BPM', payload: newBPM });
  };

  const getBeatIndicatorStyle = (index: number) => {
    const isActive = state.currentBeat === index && state.currentSubdivision === 1;
    const isAccent = index === 1;
    
    return {
      width: isAccent ? '50px' : '40px',
      height: isAccent ? '50px' : '40px',
      borderRadius: theme.cardStyle === 'organic' ? '50% 50% 50% 0%' : 
                   theme.cardStyle === 'sharp' ? '8px' : 
                   theme.cardStyle === 'rounded' ? '12px' : '50%',
      backgroundColor: isActive ? theme.primary : `${theme.primary}22`,
      boxShadow: isActive ? `0 0 20px ${theme.glow}` : 'none',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isAccent ? '18px' : '14px',
      fontWeight: 'bold',
      color: isActive ? '#fff' : theme.textSecondary
    };
  };

  return (
    <div 
      className="min-h-screen p-4 sm:p-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="container mx-auto max-w-lg">
        <div className="flex justify-end mb-6">
          <Link
            to="/themes"
            className="p-3 rounded-lg transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-6 h-6" style={{ color: theme.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </Link>
        </div>

        <div 
          className="text-center mb-8 p-6 rounded-xl"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <div className="text-6xl md:text-7xl font-bold mb-2" 
               style={{ 
                 fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : 
                             theme.id === 'retro' ? "'Georgia', serif" : "'Inter', sans-serif",
                 color: theme.primary
               }}>
            {formatBPM(state.bpm)}
          </div>
          <div style={{ color: theme.textSecondary }}>
            {soundNames[state.soundType]} · {formatTimeSignature(state.timeSignature)}
          </div>
        </div>

        <div 
          className="flex justify-center gap-3 mb-8"
          style={{ flexWrap: 'wrap' }}
        >
          {Array.from({ length: state.timeSignature.beats }).map((_, i) => (
            <div key={i} style={getBeatIndicatorStyle(i + 1)}>
              {i + 1}
            </div>
          ))}
        </div>

        <div 
          className="flex justify-center mb-8"
        >
          <button
            onClick={handlePlayPause}
            className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ 
              background: theme.gradient,
              boxShadow: `0 8px 32px ${theme.glow}`,
              borderRadius: theme.cardStyle === 'sharp' ? '16px' : '50%'
            }}
          >
            {state.isPlaying ? (
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        <div 
          className="flex items-center justify-center gap-6 mb-8"
        >
          <button
            onClick={() => handleBPMChange(-10)}
            className="p-4 rounded-xl transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.cornerRadius,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-6 h-6" style={{ color: theme.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="range"
            min="20"
            max="300"
            value={state.bpm}
            onChange={(e) => dispatch({ type: 'SET_BPM', payload: parseInt(e.target.value) })}
            className="flex-1 max-w-xs h-2 rounded-full appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} 100%)`,
              borderRadius: '10px'
            }}
          />
          <button
            onClick={() => handleBPMChange(10)}
            className="p-4 rounded-xl transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.cornerRadius,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-6 h-6" style={{ color: theme.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div 
          className="grid grid-cols-3 gap-4"
        >
          <button
            onClick={() => navigate('/settings')}
            className="p-4 rounded-xl transition-all duration-300 hover:scale-105 text-center"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.cornerRadius,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-8 h-8 mx-auto mb-2" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span style={{ color: theme.text, fontSize: '14px' }}>参数设置</span>
          </button>
          <button
            onClick={() => navigate('/sound')}
            className="p-4 rounded-xl transition-all duration-300 hover:scale-105 text-center"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.cornerRadius,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-8 h-8 mx-auto mb-2" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span style={{ color: theme.text, fontSize: '14px' }}>声音设置</span>
          </button>
          <button
            onClick={() => navigate('/system')}
            className="p-4 rounded-xl transition-all duration-300 hover:scale-105 text-center"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.cornerRadius,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-8 h-8 mx-auto mb-2" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span style={{ color: theme.text, fontSize: '14px' }}>系统设置</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
