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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </Link>
        </div>

        <div 
          className="text-center mb-8 p-6 rounded-2xl relative overflow-hidden"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
          }}
        >
          {flash && (
            <div 
              className="absolute inset-0 animate-pulse"
              style={{ backgroundColor: `${theme.primary}15` }}
            />
          )}
          <div className="relative">
            <div 
              className="text-6xl md:text-7xl font-bold mb-2" 
              style={{ 
                fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : 
                            theme.id === 'retro' ? "'Georgia', serif" : "'Inter', sans-serif",
                color: theme.primary
              }}
            >
              {formatBPM(state.bpm)}
            </div>
            <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
              {soundNames[state.soundType]} · {state.timeSignature}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div 
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
              state.isPlaying ? 'animate-pulse' : ''
            }`}
            style={{ 
              backgroundColor: state.isPlaying ? theme.primary : `${theme.primary}30`,
              boxShadow: state.isPlaying ? `0 0 30px ${theme.glow}` : 'none'
            }}
          >
            {state.isPlaying ? (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-6 rounded" style={{ backgroundColor: '#fff' }} />
                <div className="w-2 h-8 rounded" style={{ backgroundColor: '#fff' }} />
                <div className="w-2 h-6 rounded" style={{ backgroundColor: '#fff' }} />
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
              style={{ backgroundColor: theme.primary }}
            />
            <span style={{ color: theme.textSecondary, fontSize: '12px' }}>重音</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `${theme.primary}60` }}
            />
            <span style={{ color: theme.textSecondary, fontSize: '12px' }}>普通</span>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handlePlayPause}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            data-onboard="play-button"
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
              isPressed ? 'scale-95' : 'scale-100'
            }`}
            style={{ 
              backgroundColor: state.isPlaying ? theme.primary : `${theme.primary}22`,
              border: `3px solid ${theme.primary}`,
              boxShadow: state.isPlaying ? `0 8px 32px ${theme.glow}` : theme.shadow
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
          {state.isPlaying ? '正在播放' : '点击开始'}
        </div>

        <div 
          className="flex items-center justify-center gap-4 mb-8"
          data-onboard="bpm-slider"
        >
          <button
            onClick={() => handleBPMChange(-10)}
            className="w-12 h-12 rounded-xl transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-5 h-5 mx-auto" style={{ color: theme.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} 100%)`
            }}
          />
          <button
            onClick={() => handleBPMChange(10)}
            className="w-12 h-12 rounded-xl transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-5 h-5 mx-auto" style={{ color: theme.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/settings')}
            data-onboard="settings-nav"
            className="p-4 rounded-2xl transition-all duration-300 hover:scale-105 text-center"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-7 h-7 mx-auto mb-2" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span style={{ color: theme.text, fontSize: '13px' }}>参数</span>
          </button>
          <button
            onClick={() => navigate('/sound')}
            data-onboard="sound-nav"
            className="p-4 rounded-2xl transition-all duration-300 hover:scale-105 text-center"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-7 h-7 mx-auto mb-2" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span style={{ color: theme.text, fontSize: '13px' }}>声音</span>
          </button>
          <button
            onClick={() => navigate('/system')}
            data-onboard="system-nav"
            className="p-4 rounded-2xl transition-all duration-300 hover:scale-105 text-center"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-7 h-7 mx-auto mb-2" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span style={{ color: theme.text, fontSize: '13px' }}>系统</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
