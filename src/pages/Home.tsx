import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatBPM } from '../utils/metronomeUtils';
import { soundNames } from '../utils/audioUtils';

const Home: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [flash, setFlash] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }

    if (state.isPlaying) {
      setFlash(true);
      flashTimerRef.current = setTimeout(() => setFlash(false), 150);
    } else {
      setFlash(false);
    }

    return () => {
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
    };
  }, [state.currentBeat, state.isPlaying]);

  const handlePlayPause = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

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
      color: isActive ? '#fff' : theme.textSecondary,
      transform: isActive && state.isPlaying ? 'scale(1.1)' : 'scale(1)'
    };
  };

  const beatsCount = parseInt(state.timeSignature.split('/')[0]);

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
          className="text-center mb-8 p-6 rounded-xl relative overflow-hidden"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          {flash && (
            <div 
              className="absolute inset-0 blur-xl animate-fadeInOut"
              style={{ background: `${theme.primary}30` }}
            />
          )}
          <div className="relative">
            <div className="text-6xl md:text-7xl font-bold mb-2" 
                 style={{ 
                   fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : 
                               theme.id === 'retro' ? "'Georgia', serif" : "'Inter', sans-serif",
                   color: theme.primary
                 }}>
              {formatBPM(state.bpm)}
            </div>
            <div style={{ color: theme.textSecondary }}>
              {soundNames[state.soundType]} · {state.timeSignature}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div 
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
              state.isPlaying ? 'animate-breath' : ''
            }`}
            style={{ 
              background: state.isPlaying ? theme.gradient : `${theme.primary}30`,
              boxShadow: state.isPlaying ? `0 0 30px ${theme.glow}` : 'none'
            }}
          >
            {state.isPlaying ? (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-6 rounded animate-pulse" 
                  style={{ backgroundColor: '#fff', animationDelay: '0s' }} 
                />
                <div 
                  className="w-2 h-8 rounded animate-pulse" 
                  style={{ backgroundColor: '#fff', animationDelay: '0.1s' }} 
                />
                <div 
                  className="w-2 h-6 rounded animate-pulse" 
                  style={{ backgroundColor: '#fff', animationDelay: '0.2s' }} 
                />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.textSecondary }} />
            )}
          </div>
        </div>

        <div 
          className="flex justify-center gap-3 mb-8"
          style={{ flexWrap: 'wrap' }}
        >
          {Array.from({ length: beatsCount }).map((_, i) => (
            <div key={i} style={getBeatIndicatorStyle(i + 1)}>
              {i + 1}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                background: theme.gradient,
                boxShadow: `0 0 8px ${theme.glow}`
              }}
            />
            <span style={{ color: theme.textSecondary, fontSize: '12px' }}>重音拍</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `${theme.primary}60` }}
            />
            <span style={{ color: theme.textSecondary, fontSize: '12px' }}>普通拍</span>
          </div>
        </div>

        <div 
          className="flex justify-center mb-8"
        >
          <button
            onClick={handlePlayPause}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
              isPressed ? 'scale-95' : 'scale-100'
            } ${state.isPlaying ? 'animate-glow' : ''}`}
            style={{ 
              background: state.isPlaying ? theme.gradient : `${theme.primary}22`,
              border: `3px solid ${theme.primary}`,
              boxShadow: state.isPlaying ? `0 8px 32px ${theme.glow}` : theme.shadow,
              borderRadius: theme.cardStyle === 'sharp' ? '16px' : '50%'
            }}
          >
            {state.isPlaying ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-12 bg-white rounded" />
                <div className="w-4 h-12 bg-white rounded" />
              </div>
            ) : (
              <svg className="w-10 h-10" style={{ color: theme.primary }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        <div style={{ color: theme.textSecondary, textAlign: 'center', fontSize: '14px', marginBottom: '8px' }}>
          {state.isPlaying ? '正在播放...' : '点击开始'}
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
