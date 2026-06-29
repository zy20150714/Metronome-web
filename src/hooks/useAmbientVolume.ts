import { useState, useRef, useCallback, useEffect } from 'react';
import { audioUtils } from './audioUtils';

export const useAmbientVolume = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [ambientLevel, setAmbientLevel] = useState(0);
  const [autoAdjust, setAutoAdjust] = useState(false);
  const [sensitivity, setSensitivity] = useState(50);
  const [baseVolume, setBaseVolume] = useState(70);
  const [error, setError] = useState<string | null>(null);
  
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const smoothingRef = useRef(0);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsSupported(false);
        setError('当前浏览器不支持麦克风访问');
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        }
      });

      streamRef.current = stream;
      
      const ctx = audioUtils.getAudioContext();
      if (!ctx) {
        setError('无法获取音频上下文');
        return false;
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      
      const microphone = ctx.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      analyserRef.current = analyser;
      microphoneRef.current = microphone;
      
      setIsListening(true);
      smoothingRef.current = 0;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const measure = () => {
        if (!analyserRef.current || !isListening) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalizedLevel = (average / 255) * 100;
        
        smoothingRef.current = smoothingRef.current * 0.9 + normalizedLevel * 0.1;
        
        setAmbientLevel(Math.round(smoothingRef.current * 10) / 10);
        
        if (autoAdjust) {
          const ambientFactor = sensitivity / 50;
          const volumeAdjustment = (smoothingRef.current - 30) * ambientFactor * 0.5;
          const targetVolume = Math.min(100, Math.max(20, baseVolume + volumeAdjustment));
          audioUtils.setMasterVolume(targetVolume);
        }
        
        animationRef.current = requestAnimationFrame(measure);
      };
      
      measure();
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '无法访问麦克风';
      setError(message);
      setIsListening(false);
      return false;
    }
  }, [autoAdjust, sensitivity, baseVolume, isListening]);

  const stopListening = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (microphoneRef.current) {
      try {
        microphoneRef.current.disconnect();
      } catch (e) {
        console.warn('Error disconnecting microphone:', e);
      }
      microphoneRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    analyserRef.current = null;
    setIsListening(false);
    setAmbientLevel(0);
    smoothingRef.current = 0;
  }, []);

  const toggleAutoAdjust = useCallback(() => {
    setAutoAdjust(prev => !prev);
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    isSupported,
    ambientLevel,
    autoAdjust,
    sensitivity,
    baseVolume,
    error,
    startListening,
    stopListening,
    setSensitivity,
    setBaseVolume,
    toggleAutoAdjust,
  };
};
