import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMetronome } from '../contexts/MetronomeContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatBPM, formatTimeSignature } from '../utils/metronomeUtils';

const BPMI_PRESETS = [
  { name: '慢速', bpm: 40, emoji: '🐢' },
  { name: '行板', bpm: 80, emoji: '🚶' },
  { name: '中速', bpm: 100, emoji: '🏃' },
  { name: '快板', bpm: 140, emoji: '🚀' },
  { name: '急板', bpm: 200, emoji: '⚡' },
];

const ACHIEVEMENTS = [
  { id: 'first_beat', name: '首次节拍', description: '完成你的第一个节拍', icon: '🎵', check: (count: number) => count >= 1 },
  { id: 'practice_10', name: '练习达人', description: '累计练习10个节拍', icon: '🥉', check: (count: number) => count >= 10 },
  { id: 'practice_100', name: '节拍大师', description: '累计练习100个节拍', icon: '🥈', check: (count: number) => count >= 100 },
  { id: 'practice_1000', name: '节奏之王', description: '累计练习1000个节拍', icon: '🥇', check: (count: number) => count >= 1000 },
  { id: 'speed_200', name: '速度狂魔', description: '达到200 BPM', icon: '⚡', check: (_: number, bpm?: number) => (bpm || 0) >= 200 },
  { id: 'slow_40', name: '慢速大师', description: '降至40 BPM', icon: '🐢', check: (_: number, bpm?: number) => (bpm || 0) <= 40 },
  { id: 'focus_30', name: '专注练习', description: '连续练习30分钟', icon: '🧘', check: (time: number) => time >= 1800 },
  { id: 'streak_7', name: '连续7天', description: '连续7天练习', icon: '🔥', check: (_: number, _bpm?: number, streak?: number) => (streak || 0) >= 7 },
];

const SOUND_VARIANTS = [
  { id: 'click', name: '经典点击', icon: '🔊' },
  { id: 'woodblock', name: '木鱼', icon: '🥁' },
  { id: 'hihat', name: '踩镲', icon: '🎛️' },
  { id: 'bell', name: '钟声', icon: '🔔' },
  { id: 'digital', name: '电子音', icon: '💻' },
];

const FINGER_PATTERNS = [
  { id: 'single', name: '单指', pattern: [1, 0, 0, 0], icon: '☝️' },
  { id: 'double', name: '双指', pattern: [1, 0, 1, 0], icon: '✌️' },
  { id: 'triple', name: '三指', pattern: [1, 1, 0, 1], icon: '3️⃣' },
  { id: 'full', name: '四指', pattern: [1, 1, 1, 1], icon: '🖐️' },
];

const MARKER_STYLES = [
  { id: 'pulse', name: '脉冲', icon: '💫' },
  { id: 'bounce', name: '弹跳', icon: '🏀' },
  { id: 'flash', name: '闪烁', icon: '⚡' },
  { id: 'ripple', name: '波纹', icon: '🌊' },
];

const VISUAL_MODES = [
  { id: 'normal', name: '标准', icon: '🎵' },
  { id: 'party', name: '派对', icon: '🎉' },
  { id: 'calm', name: '平静', icon: '🧘' },
  { id: 'night', name: '夜店', icon: '🌙' },
];

const ACCENT_STYLES = [
  { id: 'strong', name: '强音', icon: '🔴', color: '#ef4444' },
  { id: 'medium', name: '中音', icon: '🟡', color: '#eab308' },
  { id: 'soft', name: '弱音', icon: '🟢', color: '#22c55e' },
];

const Home: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [flash, setFlash] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [practiceTime, setPracticeTime] = useState(0);
  const [totalBeats, setTotalBeats] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [breathMode, setBreathMode] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [showTip, setShowTip] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [sessionGoal, setSessionGoal] = useState<number | null>(null);
  const [beatCounter, setBeatCounter] = useState<number | null>(null);
  const [loopMode, setLoopMode] = useState(false);
  const [loopBPM, setLoopBPM] = useState(100);
  const [isLoopingToFast, setIsLoopingToFast] = useState(true);
  const [timeStretch, setTimeStretch] = useState(false);
  const [stretchTarget, setStretchTarget] = useState(120);
  const [practiceStreak, setPracticeStreak] = useState(0);
  const [lastPracticeDate, setLastPracticeDate] = useState<string | null>(null);
  const [selectedSound, setSelectedSound] = useState('click');
  const [volume, setVolume] = useState(80);
  const [customPattern, setCustomPattern] = useState<number[]>([1, 0, 0, 0]);
  const [accentFirst] = useState(true);
  const [tapTempo, setTapTempo] = useState<number[]>([]);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [selectedFingerPattern, setSelectedFingerPattern] = useState('single');
  const [autoSaveTimer, setAutoSaveTimer] = useState(0);
  const [soundTestMode, setSoundTestMode] = useState(false);
  const [markerStyle, setMarkerStyle] = useState('pulse');
  const [visualMode, setVisualMode] = useState('normal');
  const [accentStyle, setAccentStyle] = useState('strong');
  const [subdivision, setSubdivision] = useState(1);
  const [swingAmount, setSwingAmount] = useState(0);
  const [showCoach, setShowCoach] = useState(false);
  const [mirrorMode, setMirrorMode] = useState(false);
  const [pulseOnBeat, setPulseOnBeat] = useState(true);
  const [savePreset1, setSavePreset1] = useState<{bpm: number, timeSignature: string} | null>(null);
  const [savePreset2, setSavePreset2] = useState<{bpm: number, timeSignature: string} | null>(null);
  const [savePreset3, setSavePreset3] = useState<{bpm: number, timeSignature: string} | null>(null);

  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const practiceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stretchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const beatCounterRef = useRef<number>(0);
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('metronome_practice');
    if (saved) {
      const data = JSON.parse(saved);
      setPracticeTime(data.practiceTime || 0);
      setTotalBeats(data.totalBeats || 0);
      setPracticeStreak(data.streak || 0);
      setLastPracticeDate(data.lastPracticeDate || null);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('metronome_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      if (settings.bpm) dispatch({ type: 'SET_BPM', payload: settings.bpm });
      if (settings.selectedSound) setSelectedSound(settings.selectedSound);
      if (settings.volume !== undefined) setVolume(settings.volume);
      if (settings.focusMode !== undefined) setFocusMode(settings.focusMode);
      if (settings.customPattern) setCustomPattern(settings.customPattern);
      if (settings.selectedFingerPattern) setSelectedFingerPattern(settings.selectedFingerPattern);
    }
  }, [dispatch]);

  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      setAutoSaveTimer(prev => prev + 1);
      const data = {
        practiceTime,
        totalBeats,
        streak: practiceStreak,
        lastPracticeDate,
        bpm: state.bpm,
        selectedSound,
        volume,
        focusMode,
        customPattern,
        selectedFingerPattern,
      };
      localStorage.setItem('metronome_settings', JSON.stringify(data));
    }, 30000);
    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [practiceTime, totalBeats, practiceStreak, lastPracticeDate, state.bpm, selectedSound, volume, focusMode, customPattern, selectedFingerPattern]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleBPMChange(5);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleBPMChange(-5);
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        setFocusMode(!focusMode);
      } else if (e.code === 'KeyL') {
        e.preventDefault();
        setLoopMode(!loopMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, loopMode]);

  useEffect(() => {
    if (state.isPlaying) {
      practiceTimerRef.current = setInterval(() => {
        setPracticeTime(prev => prev + 1);
        const today = new Date().toDateString();
        if (lastPracticeDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastPracticeDate === yesterday.toDateString()) {
            setPracticeStreak(prev => prev + 1);
          } else {
            setPracticeStreak(1);
          }
          setLastPracticeDate(today);
        }
      }, 1000);
    } else {
      if (practiceTimerRef.current) {
        clearInterval(practiceTimerRef.current);
      }
    }
    return () => {
      if (practiceTimerRef.current) {
        clearInterval(practiceTimerRef.current);
      }
    };
  }, [state.isPlaying, lastPracticeDate]);

  useEffect(() => {
    ACHIEVEMENTS.forEach(achievement => {
      if (!unlockedAchievements.includes(achievement.id)) {
        if (achievement.id === 'first_beat' || achievement.id === 'practice_10' || 
            achievement.id === 'practice_100' || achievement.id === 'practice_1000' || 
            achievement.id === 'focus_30') {
          if (achievement.check(achievement.id === 'focus_30' ? practiceTime : totalBeats)) {
            setUnlockedAchievements(prev => [...prev, achievement.id]);
          }
        } else if (achievement.id === 'speed_200' || achievement.id === 'slow_40') {
          if (achievement.check(0, state.bpm)) {
            setUnlockedAchievements(prev => [...prev, achievement.id]);
          }
        } else if (achievement.id === 'streak_7') {
          if (achievement.check(0, 0, practiceStreak)) {
            setUnlockedAchievements(prev => [...prev, achievement.id]);
          }
        }
      }
    });
  }, [totalBeats, state.bpm, practiceTime, practiceStreak]);

  useEffect(() => {
    if (sessionGoal && practiceTime >= sessionGoal) {
      setSessionGoal(null);
      alert('🎉 恭喜完成练习目标！');
    }
  }, [practiceTime, sessionGoal]);

  useEffect(() => {
    if (soundTestMode && state.isPlaying) {
      setSoundTestMode(false);
    }
  }, [state.isPlaying, soundTestMode]);

  useEffect(() => {
    if (beatCounter !== null && beatCounter > 0) {
      if (state.currentSubdivision === 1 && state.isPlaying) {
        beatCounterRef.current++;
        if (beatCounterRef.current >= beatCounter) {
          dispatch({ type: 'TOGGLE_PLAY' });
          setBeatCounter(null);
          beatCounterRef.current = 0;
        }
      }
    }
  }, [state.currentBeat, state.isPlaying, state.currentSubdivision, beatCounter, dispatch]);

  useEffect(() => {
    if (timeStretch && state.isPlaying) {
      const targetBPM = stretchTarget;
      const currentBPM = state.bpm;
      if (currentBPM < targetBPM) {
        stretchTimerRef.current = setTimeout(() => {
          dispatch({ type: 'SET_BPM', payload: Math.min(currentBPM + 1, targetBPM) });
        }, 1000);
      } else if (currentBPM > targetBPM) {
        stretchTimerRef.current = setTimeout(() => {
          dispatch({ type: 'SET_BPM', payload: Math.max(currentBPM - 1, targetBPM) });
        }, 1000);
      }
    }
    return () => {
      if (stretchTimerRef.current) clearTimeout(stretchTimerRef.current);
    };
  }, [timeStretch, state.isPlaying, state.bpm, stretchTarget, dispatch]);

  useEffect(() => {
    if (loopMode && state.isPlaying) {
      loopTimerRef.current = setTimeout(() => {
        const newBPM = isLoopingToFast ? loopBPM : 80;
        dispatch({ type: 'SET_BPM', payload: newBPM });
        setIsLoopingToFast(!isLoopingToFast);
      }, 4000);
    }
    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [loopMode, state.isPlaying, isLoopingToFast, loopBPM, dispatch]);

  useEffect(() => {
    if (breathMode && state.isPlaying) {
      let phaseIndex = 0;
      const phases: Array<'inhale' | 'hold' | 'exhale' | 'rest'> = ['inhale', 'hold', 'exhale', 'rest'];
      
      breathTimerRef.current = setInterval(() => {
        phaseIndex = (phaseIndex + 1) % phases.length;
        setBreathPhase(phases[phaseIndex]);
      }, 4000);
    }
    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, [breathMode, state.isPlaying]);

  useEffect(() => {
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }

    if (state.isPlaying) {
      setFlash(true);
      flashTimerRef.current = setTimeout(() => setFlash(false), 100);
      if (state.currentSubdivision === 1) {
        setTotalBeats(prev => prev + 1);
      }
    } else {
      setFlash(false);
    }

    return () => {
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
    };
  }, [state.currentBeat, state.isPlaying, state.currentSubdivision]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    } else if (countdown === 0) {
      handlePlayPause();
      setCountdown(null);
    }
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [countdown]);

  useEffect(() => {
    if (tapTempo.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTempo.length; i++) {
        intervals.push(tapTempo[i] - tapTempo[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const newBpm = Math.round(60000 / avgInterval);
      if (newBpm >= 20 && newBpm <= 300) {
        dispatch({ type: 'SET_BPM', payload: newBpm });
      }
    }
  }, [tapTempo, dispatch]);

  const handleTapTempo = useCallback(() => {
    const now = Date.now();
    setTapTempo(prev => [...prev.filter(t => now - t < 3000), now]);
  }, []);

  const handlePlayPause = () => {
    if (countdown !== null) {
      setCountdown(null);
      return;
    }
    if (soundTestMode) {
      setSoundTestMode(false);
    }
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const startWithCountdown = (seconds: number) => {
    setCountdown(seconds);
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  const handleBPMChange = (delta: number) => {
    const newBPM = Math.min(300, Math.max(20, state.bpm + delta));
    dispatch({ type: 'SET_BPM', payload: newBPM });
  };

  const getBeatIndicatorStyle = (index: number) => {
    const customIdx = accentFirst ? index : index - 1;
    const isActive = state.currentBeat === index && state.currentSubdivision === 1;
    const isAccent = customPattern[customIdx % customPattern.length] === 1;
    
    return {
      width: isAccent ? '52px' : '42px',
      height: isAccent ? '52px' : '42px',
      borderRadius: theme.cardStyle === 'organic' ? '50% 50% 50% 0%' : 
                   theme.cardStyle === 'sharp' ? '8px' : 
                   theme.cardStyle === 'rounded' ? '12px' : '50%',
      backgroundColor: isActive ? theme.primary : `${theme.primary}22`,
      boxShadow: isActive ? `0 0 25px ${theme.glow}` : 'none',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isAccent ? '18px' : '14px',
      fontWeight: 'bold',
      color: isActive ? '#fff' : theme.textSecondary,
      transform: isActive && state.isPlaying ? 'scale(1.15)' : 'scale(1)'
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const beatsCount = parseInt(state.timeSignature.split('/')[0]);

  const handleSavePractice = () => {
    const data = {
      practiceTime,
      totalBeats,
      streak: practiceStreak,
      lastPracticeDate,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('metronome_practice', JSON.stringify(data));
    alert('💾 练习数据已保存！');
  };

  const playSoundTest = () => {
    setSoundTestMode(true);
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';
    gainNode.gain.value = volume / 100;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  return (
    <div 
      className={`min-h-screen p-4 sm:p-6 ${focusMode ? 'bg-black/90' : ''}`}
      style={{ backgroundColor: focusMode ? 'rgba(0,0,0,0.9)' : theme.background }}
    >
      <div className="container mx-auto max-w-lg">
        <div className={`flex justify-end mb-4 gap-2 flex-wrap ${focusMode ? 'hidden' : ''}`}>
          <button
            onClick={() => setFocusMode(!focusMode)}
            className="p-2.5 rounded-lg transition-all hover:scale-110"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            title="专注模式 (F)"
          >
            <span className="text-xl">{focusMode ? '👁️' : '🎯'}</span>
          </button>
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="p-2.5 rounded-lg transition-all hover:scale-110 relative"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            title="成就系统"
          >
            <span className="text-xl">🏆</span>
            {unlockedAchievements.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {unlockedAchievements.length}
              </div>
            )}
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="p-2.5 rounded-lg transition-all hover:scale-110"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            title="练习统计"
          >
            <span className="text-xl">📊</span>
          </button>
          <button
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            className="p-2.5 rounded-lg transition-all hover:scale-110"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            title="更多设置"
          >
            <span className="text-xl">⚙️</span>
          </button>
          <button
            onClick={() => setShowCoach(!showCoach)}
            className="p-2.5 rounded-lg transition-all hover:scale-110"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            title="节拍教练"
          >
            <span className="text-xl">🎓</span>
          </button>
          <Link
            to="/themes"
            className="p-2.5 rounded-lg transition-all hover:scale-110"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            title="切换主题"
          >
            <span className="text-xl">🎨</span>
          </Link>
          <button
            onClick={() => setMirrorMode(!mirrorMode)}
            className="p-2.5 rounded-lg transition-all hover:scale-110"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            title="镜像模式"
          >
            <span className="text-xl">🔄</span>
          </button>
          <button
            onClick={() => setPulseOnBeat(!pulseOnBeat)}
            className="p-2.5 rounded-lg transition-all hover:scale-110"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            title="节拍脉冲"
          >
            <span className="text-xl">💗</span>
          </button>
          <Link
            to="/personalization"
            className="p-2.5 rounded-lg transition-all hover:scale-110"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            title="个性化设置"
          >
            <span className="text-xl">✨</span>
          </Link>
        </div>

        {focusMode && (
          <div className="mb-4 text-center">
            <button
              onClick={() => setFocusMode(false)}
              className="text-white/60 text-sm hover:text-white transition-colors"
            >
              按 F 退出专注模式
            </button>
          </div>
        )}

        {showAchievements && (
          <div 
            className="mb-4 p-4 rounded-2xl"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: theme.text }}>
              🏆 成就系统
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {ACHIEVEMENTS.map(achievement => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-xl text-center ${isUnlocked ? '' : 'opacity-40'}`}
                    style={{
                      backgroundColor: isUnlocked ? theme.primary + '20' : theme.background
                    }}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-xs font-bold" style={{ color: theme.text }}>{achievement.name}</div>
                    <div className="text-xs" style={{ color: theme.textSecondary }}>{achievement.description}</div>
                    {isUnlocked && <div className="text-xs text-green-500 mt-1">✓ 已解锁</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showStats && (
          <div 
            className="mb-4 p-4 rounded-2xl"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: theme.text }}>
              📊 练习统计
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold" style={{ color: theme.primary }}>{formatTime(practiceTime)}</div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>练习时长</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: theme.primary }}>{totalBeats}</div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>累计节拍</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: theme.primary }}>{practiceStreak}</div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>🔥 连续天数</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.border }}>
              <label className="text-xs block mb-2" style={{ color: theme.textSecondary }}>
                🎯 设置练习目标
              </label>
              <div className="flex gap-2">
                {[300, 600, 1800].map(time => (
                  <button
                    key={time}
                    onClick={() => setSessionGoal(time)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      sessionGoal === time ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: sessionGoal === time ? theme.primary + '30' : theme.background,
                      border: `1px solid ${sessionGoal === time ? theme.primary : theme.border}`,
                      color: theme.text
                    }}
                  >
                    {time === 300 ? '5分钟' : time === 600 ? '10分钟' : '30分钟'}
                  </button>
                ))}
              </div>
              {sessionGoal && (
                <div className="mt-2 text-xs text-center" style={{ color: theme.primary }}>
                  目标: {formatTime(sessionGoal)} | 进度: {Math.round((practiceTime / sessionGoal) * 100)}%
                </div>
              )}
            </div>
            <button
              onClick={() => { setPracticeTime(0); setTotalBeats(0); setPracticeStreak(0); }}
              className="mt-3 w-full py-2 rounded-lg text-sm"
              style={{ backgroundColor: theme.primary + '20', color: theme.primary }}
            >
              重置统计
            </button>
          </div>
        )}

        {showCoach && (
          <div 
            className="mb-4 p-4 rounded-2xl"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: theme.text }}>
              🎓 节拍教练
            </h3>
            
            <div className="mb-4">
              <label className="text-sm mb-2 block" style={{ color: theme.textSecondary }}>
                📐 节拍标记样式
              </label>
              <div className="grid grid-cols-4 gap-2">
                {MARKER_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setMarkerStyle(style.id)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      markerStyle === style.id ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: markerStyle === style.id ? theme.primary + '30' : theme.background,
                      border: `1px solid ${markerStyle === style.id ? theme.primary : theme.border}`,
                    }}
                  >
                    <div className="text-xl">{style.icon}</div>
                    <div className="text-xs mt-1" style={{ color: theme.text }}>{style.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm mb-2 block" style={{ color: theme.textSecondary }}>
                🌈 视觉效果
              </label>
              <div className="grid grid-cols-4 gap-2">
                {VISUAL_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setVisualMode(mode.id)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      visualMode === mode.id ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: visualMode === mode.id ? theme.primary + '30' : theme.background,
                      border: `1px solid ${visualMode === mode.id ? theme.primary : theme.border}`,
                    }}
                  >
                    <div className="text-xl">{mode.icon}</div>
                    <div className="text-xs mt-1" style={{ color: theme.text }}>{mode.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm mb-2 block" style={{ color: theme.textSecondary }}>
                🔊 重音样式
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ACCENT_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setAccentStyle(style.id)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      accentStyle === style.id ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: accentStyle === style.id ? style.color + '30' : theme.background,
                      border: `1px solid ${accentStyle === style.id ? style.color : theme.border}`,
                    }}
                  >
                    <div className="text-xl">{style.icon}</div>
                    <div className="text-xs mt-1" style={{ color: theme.text }}>{style.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm mb-2 block" style={{ color: theme.textSecondary }}>
                📐 细分拍数: {subdivision}
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={subdivision}
                onChange={(e) => setSubdivision(parseInt(e.target.value))}
                className="w-full h-2 rounded-full"
                style={{ background: theme.border }}
              />
            </div>

            <div className="mb-4">
              <label className="text-sm mb-2 block" style={{ color: theme.textSecondary }}>
                🎵 摇摆节奏: {swingAmount}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={swingAmount}
                onChange={(e) => setSwingAmount(parseInt(e.target.value))}
                className="w-full h-2 rounded-full"
                style={{ background: theme.border }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBreathMode(!breathMode)}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  breathMode ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: breathMode ? theme.primary + '30' : theme.background,
                  border: `1px solid ${breathMode ? theme.primary : theme.border}`,
                  color: theme.text
                }}
              >
                🧘 呼吸模式
              </button>
              <button
                onClick={() => setTimeStretch(!timeStretch)}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  timeStretch ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: timeStretch ? theme.primary + '30' : theme.background,
                  border: `1px solid ${timeStretch ? theme.primary : theme.border}`,
                  color: theme.text
                }}
              >
                ⏱️ 渐变速度
              </button>
            </div>

            {timeStretch && (
              <div className="mt-3">
                <label className="text-xs mb-2 block" style={{ color: theme.textSecondary }}>
                  目标速度: {stretchTarget} BPM
                </label>
                <input
                  type="range"
                  min="20"
                  max="300"
                  value={stretchTarget}
                  onChange={(e) => setStretchTarget(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full"
                  style={{ background: theme.border }}
                />
              </div>
            )}

            {breathMode && (
              <div className="mt-3 text-center p-4 rounded-lg" style={{ backgroundColor: theme.background }}>
                <div className="text-4xl mb-2">
                  {breathPhase === 'inhale' ? '🌬️' : breathPhase === 'hold' ? '⏸️' : breathPhase === 'exhale' ? '💨' : '😌'}
                </div>
                <div className="text-lg font-bold" style={{ color: theme.primary }}>
                  {breathPhase === 'inhale' ? '吸气' : breathPhase === 'hold' ? '屏息' : breathPhase === 'exhale' ? '呼气' : '休息'}
                </div>
              </div>
            )}
          </div>
        )}

        {showSettingsPanel && (
          <div 
            className="mb-4 p-4 rounded-2xl space-y-4"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h3 className="font-bold flex items-center gap-2" style={{ color: theme.text }}>
              ⚙️ 个性化设置
            </h3>

            <div>
              <label className="text-sm mb-2 block" style={{ color: theme.textSecondary }}>
                🔊 音量: {volume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-2 rounded-full"
                style={{ background: theme.border }}
              />
            </div>

            <div>
              <label className="text-sm mb-2 block" style={{ color: theme.textSecondary }}>
                🥁 节拍音色
              </label>
              <div className="grid grid-cols-5 gap-2">
                {SOUND_VARIANTS.map(sound => (
                  <button
                    key={sound.id}
                    onClick={() => setSelectedSound(sound.id)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      selectedSound === sound.id ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: selectedSound === sound.id ? theme.primary + '30' : theme.background,
                      border: `1px solid ${selectedSound === sound.id ? theme.primary : theme.border}`,
                    }}
                  >
                    <div className="text-xl">{sound.icon}</div>
                    <div className="text-xs mt-1" style={{ color: theme.text }}>{sound.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm mb-2 block" style={{ color: theme.textSecondary }}>
                🖐️ 手指模式
              </label>
              <div className="grid grid-cols-4 gap-2">
                {FINGER_PATTERNS.map(pattern => (
                  <button
                    key={pattern.id}
                    onClick={() => {
                      setSelectedFingerPattern(pattern.id);
                      setCustomPattern(pattern.pattern);
                    }}
                    className={`p-2 rounded-lg text-center transition-all ${
                      selectedFingerPattern === pattern.id ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: selectedFingerPattern === pattern.id ? theme.primary + '30' : theme.background,
                      border: `1px solid ${selectedFingerPattern === pattern.id ? theme.primary : theme.border}`,
                    }}
                  >
                    <div className="text-xl">{pattern.icon}</div>
                    <div className="text-xs mt-1" style={{ color: theme.text }}>{pattern.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={playSoundTest}
                className="flex-1 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: theme.primary + '20',
                  color: theme.primary
                }}
              >
                🔊 测试声音
              </button>
              <button
                onClick={handleSavePractice}
                className="flex-1 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: theme.primary + '20',
                  color: theme.primary
                }}
              >
                💾 保存数据
              </button>
            </div>
          </div>
        )}

        <div 
          className="text-center mb-6 p-5 rounded-2xl relative overflow-hidden"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          {flash && (
            <div 
              className="absolute inset-0 animate-pulse"
              style={{ background: `${theme.primary}15` }}
            />
          )}
          <div className="relative">
            <div 
              className="text-6xl md:text-7xl font-bold mb-2 cursor-pointer hover:scale-105 transition-transform" 
              style={{ 
                fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : 
                            theme.id === 'retro' ? "'Georgia', serif" : "'Inter', sans-serif",
                color: theme.primary
              }}
              onClick={() => setShowTip(!showTip)}
              title="点击切换提示"
            >
              {formatBPM(state.bpm)}
            </div>
            {showTip && (
              <div className="text-xs mb-2 animate-pulse" style={{ color: theme.textSecondary }}>
                💡 点击 BPM 可切换提示
              </div>
            )}
            <div style={{ color: theme.textSecondary }}>
              {state.isPlaying ? '🎵 播放中' : '⏸️ 已停止'} · {formatTimeSignature(state.timeSignature)}
            </div>
            {loopMode && (
              <div className="mt-1 text-xs" style={{ color: theme.primary }}>
                🔄 循环模式: {loopBPM} BPM ↔ 80 BPM
              </div>
            )}
            {beatCounter !== null && (
              <div className="mt-1 text-xs" style={{ color: theme.primary }}>
                📍 节拍计数: {beatCounterRef.current} / {beatCounter}
              </div>
            )}
          </div>
        </div>

        <div 
          className={`flex justify-center gap-3 mb-6 ${mirrorMode ? 'flex-row-reverse' : ''}`}
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
              style={{ background: theme.gradient, boxShadow: `0 0 8px ${theme.glow}` }}
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
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `${theme.textSecondary}40` }}
            />
            <span style={{ color: theme.textSecondary, fontSize: '12px' }}>弱拍</span>
          </div>
        </div>

        {countdown !== null && (
          <div className="text-center mb-4">
            <div 
              className="inline-flex items-center justify-center w-24 h-24 rounded-full text-5xl font-bold animate-pulse"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.glow})`,
                color: 'white',
                boxShadow: `0 0 40px ${theme.glow}`
              }}
            >
              {countdown}
            </div>
            <p className="text-sm mt-2" style={{ color: theme.textSecondary }}>
              准备开始...
            </p>
          </div>
        )}

        {soundTestMode && !state.isPlaying && (
          <div className="text-center mb-4">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl animate-bounce"
              style={{ 
                background: theme.gradient,
                color: 'white',
                boxShadow: `0 0 30px ${theme.glow}`
              }}
            >
              🔊
            </div>
            <p className="text-sm mt-2" style={{ color: theme.textSecondary }}>
              声音测试中... 音量: {volume}%
            </p>
          </div>
        )}

        <div className="flex justify-center mb-4">
          <button
            onClick={handlePlayPause}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onContextMenu={(e) => {
              e.preventDefault();
              startWithCountdown(4);
            }}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-200 ${
              isPressed ? 'scale-90' : 'scale-100'
            } ${state.isPlaying ? 'animate-pulse' : ''}`}
            style={{ 
              background: state.isPlaying ? theme.gradient : `${theme.primary}22`,
              border: `4px solid ${theme.primary}`,
              boxShadow: state.isPlaying ? `0 0 40px ${theme.glow}` : `0 0 20px ${theme.glow}40`,
            }}
          >
            {state.isPlaying ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-12 bg-white rounded animate-pulse" />
                <div className="w-4 h-12 bg-white rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
              </div>
            ) : (
              <svg className="w-12 h-12" style={{ color: theme.primary }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          <button
            onClick={() => startWithCountdown(2)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: theme.primary + '15', color: theme.primary }}
            title="2秒倒计时开始"
          >
            2s ⏱️
          </button>
          <button
            onClick={() => startWithCountdown(4)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: theme.primary + '15', color: theme.primary }}
            title="4秒倒计时开始"
          >
            4s ⏱️
          </button>
          <button
            onClick={() => startWithCountdown(8)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: theme.primary + '15', color: theme.primary }}
            title="8秒倒计时开始"
          >
            8s ⏱️
          </button>
          <button
            onClick={handleTapTempo}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: theme.primary + '15', color: theme.primary }}
            title="点击设置速度"
          >
            TAP 🎯
          </button>
          <button
            onClick={() => {
              setBeatCounter(beatCounter === null ? 8 : null);
              beatCounterRef.current = 0;
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              beatCounter !== null ? 'ring-2' : ''
            }`}
            style={{ 
              backgroundColor: beatCounter !== null ? theme.primary + '30' : theme.primary + '15', 
              color: theme.primary 
            }}
            title="节拍计数器"
          >
            📍 {beatCounter !== null ? `${beatCounter}拍` : '计数'}
          </button>
          <button
            onClick={() => setLoopMode(!loopMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              loopMode ? 'ring-2 animate-pulse' : ''
            }`}
            style={{ 
              backgroundColor: loopMode ? theme.primary + '30' : theme.primary + '15', 
              color: theme.primary 
            }}
            title="循环模式 (L)"
          >
            🔄 循环
          </button>
        </div>

        {loopMode && (
          <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}>
            <label className="text-xs mb-2 block" style={{ color: theme.textSecondary }}>
              快速BPM: {loopBPM}
            </label>
            <input
              type="range"
              min="40"
              max="300"
              value={loopBPM}
              onChange={(e) => setLoopBPM(parseInt(e.target.value))}
              className="w-full h-2 rounded-full"
              style={{ background: theme.border }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: theme.textSecondary }}>
              <span>80 BPM</span>
              <span>↔</span>
              <span>{loopBPM} BPM</span>
            </div>
          </div>
        )}

        <div style={{ color: theme.textSecondary, textAlign: 'center', fontSize: '14px', marginBottom: '8px' }}>
          {state.isPlaying ? '🎵 正在播放...' : '👆 点击开始'} · 右键可倒计时 · 按空格播放/暂停
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              color: theme.textSecondary
            }}
          >
            ⚡ BPM预设 & 保存 {showPresets ? '▲' : '▼'}
          </button>
          {showPresets && (
            <div className="space-y-3 mt-3">
              <div className="grid grid-cols-5 gap-2">
                {BPMI_PRESETS.map(preset => (
                  <button
                    key={preset.bpm}
                    onClick={() => dispatch({ type: 'SET_BPM', payload: preset.bpm })}
                    className={`p-2 rounded-xl text-center transition-all hover:scale-105 ${
                      state.bpm === preset.bpm ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: state.bpm === preset.bpm ? theme.primary + '30' : theme.surface,
                      border: `1px solid ${state.bpm === preset.bpm ? theme.primary : theme.border}`,
                    }}
                  >
                    <div className="text-lg">{preset.emoji}</div>
                    <div className="text-xs font-bold" style={{ color: theme.text }}>{preset.bpm}</div>
                  </button>
                ))}
              </div>
              
              <div className="border-t pt-3" style={{ borderColor: theme.border }}>
                <div className="text-xs mb-2 font-medium" style={{ color: theme.textSecondary }}>
                  💾 保存当前设置
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setSavePreset1({ bpm: state.bpm, timeSignature: state.timeSignature });
                      localStorage.setItem('preset1', JSON.stringify({ bpm: state.bpm, timeSignature: state.timeSignature }));
                      alert('预设1已保存！');
                    }}
                    className="p-2 rounded-lg text-center transition-all hover:scale-105"
                    style={{
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div className="text-lg">1️⃣</div>
                    <div className="text-xs" style={{ color: theme.text }}>
                      {savePreset1 ? `${savePreset1.bpm}` : '空'}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setSavePreset2({ bpm: state.bpm, timeSignature: state.timeSignature });
                      localStorage.setItem('preset2', JSON.stringify({ bpm: state.bpm, timeSignature: state.timeSignature }));
                      alert('预设2已保存！');
                    }}
                    className="p-2 rounded-lg text-center transition-all hover:scale-105"
                    style={{
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div className="text-lg">2️⃣</div>
                    <div className="text-xs" style={{ color: theme.text }}>
                      {savePreset2 ? `${savePreset2.bpm}` : '空'}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setSavePreset3({ bpm: state.bpm, timeSignature: state.timeSignature });
                      localStorage.setItem('preset3', JSON.stringify({ bpm: state.bpm, timeSignature: state.timeSignature }));
                      alert('预设3已保存！');
                    }}
                    className="p-2 rounded-lg text-center transition-all hover:scale-105"
                    style={{
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div className="text-lg">3️⃣</div>
                    <div className="text-xs" style={{ color: theme.text }}>
                      {savePreset3 ? `${savePreset3.bpm}` : '空'}
                    </div>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button
                    onClick={() => savePreset1 && dispatch({ type: 'SET_BPM', payload: savePreset1.bpm })}
                    disabled={!savePreset1}
                    className="py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                    style={{
                      backgroundColor: theme.primary + '20',
                      color: theme.primary,
                    }}
                  >
                    加载1
                  </button>
                  <button
                    onClick={() => savePreset2 && dispatch({ type: 'SET_BPM', payload: savePreset2.bpm })}
                    disabled={!savePreset2}
                    className="py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                    style={{
                      backgroundColor: theme.primary + '20',
                      color: theme.primary,
                    }}
                  >
                    加载2
                  </button>
                  <button
                    onClick={() => savePreset3 && dispatch({ type: 'SET_BPM', payload: savePreset3.bpm })}
                    disabled={!savePreset3}
                    className="py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                    style={{
                      backgroundColor: theme.primary + '20',
                      color: theme.primary,
                    }}
                  >
                    加载3
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div 
          className="flex items-center justify-center gap-3 mb-6"
        >
          <button
            onClick={() => handleBPMChange(-10)}
            className="p-3 rounded-xl transition-all hover:scale-110 active:scale-90"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            title="单击-10"
          >
            <span className="text-lg font-bold" style={{ color: theme.text }}>-10</span>
          </button>
          <input
            type="range"
            min="20"
            max="300"
            value={state.bpm}
            onChange={(e) => dispatch({ type: 'SET_BPM', payload: parseInt(e.target.value) })}
            className="flex-1 h-2.5 rounded-full appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} ${((state.bpm - 20) / 280) * 100}%, ${theme.border} 100%)`,
            }}
          />
          <button
            onClick={() => handleBPMChange(10)}
            className="p-3 rounded-xl transition-all hover:scale-110 active:scale-90"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            title="单击+10"
          >
            <span className="text-lg font-bold" style={{ color: theme.text }}>+10</span>
          </button>
        </div>

        <div 
          className="grid grid-cols-3 gap-3"
        >
          <button
            onClick={() => navigate('/settings')}
            className="p-4 rounded-xl transition-all hover:scale-105 text-center"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <span className="text-2xl mb-1 block">⚙️</span>
            <span style={{ color: theme.text, fontSize: '12px' }}>参数设置</span>
          </button>
          <button
            onClick={() => navigate('/sound')}
            className="p-4 rounded-xl transition-all hover:scale-105 text-center"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <span className="text-2xl mb-1 block">🔊</span>
            <span style={{ color: theme.text, fontSize: '12px' }}>声音设置</span>
          </button>
          <button
            onClick={() => navigate('/system')}
            className="p-4 rounded-xl transition-all hover:scale-105 text-center"
            style={{ 
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <span className="text-2xl mb-1 block">📱</span>
            <span style={{ color: theme.text, fontSize: '12px' }}>系统设置</span>
          </button>
        </div>

        <div className="mt-4 text-center text-xs" style={{ color: theme.textSecondary }}>
          💡 自动保存已开启 · 上次保存: {autoSaveTimer > 0 ? `${Math.floor((30 - autoSaveTimer) / 6)}秒前` : '刚刚'}
        </div>
      </div>
    </div>
  );
};

export default Home;
