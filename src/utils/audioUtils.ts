import type { SoundType, SoundConfig } from '../types';

class AudioUtils {
  private audioContext: AudioContext | null = null;
  private soundConfigs: Record<SoundType, SoundConfig> = {
    click: {
      accentFrequency: 1000,
      secondaryFrequency: 600,
      normalFrequency: 400,
      duration: 0.08,
    },
    drum: {
      accentFrequency: 180,
      secondaryFrequency: 220,
      normalFrequency: 280,
      duration: 0.15,
    },
    wood: {
      accentFrequency: 700,
      secondaryFrequency: 550,
      normalFrequency: 450,
      duration: 0.12,
    },
    electronic: {
      accentFrequency: 1500,
      secondaryFrequency: 1100,
      normalFrequency: 900,
      duration: 0.08,
    },
    metal: {
      accentFrequency: 2500,
      secondaryFrequency: 1800,
      normalFrequency: 1500,
      duration: 0.2,
    },
  };

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioContext) {
        const AudioContextConstructor = window.AudioContext || (window as { webkitAudioContext?: new () => AudioContext }).webkitAudioContext;
        if (AudioContextConstructor) {
          this.audioContext = new AudioContextConstructor();
        } else {
          console.warn('Web Audio API is not supported in this browser');
          return null;
        }
      }
      
      // 确保音频上下文处于运行状态
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(err => {
          console.warn('Failed to resume audio context:', err);
        });
      }
      
      return this.audioContext;
    } catch (error) {
      console.warn('Error creating audio context:', error);
      return null;
    }
  }

  private playTone(frequency: number, volume: number, duration: number, type: OscillatorType = 'sine'): void {
    const audioContext = this.getAudioContext();
    if (!audioContext) {
      return;
    }

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // 兼容旧浏览器的振荡器类型
      const supportedTypes = ['sine', 'square', 'sawtooth', 'triangle'];
      if (!supportedTypes.includes(type)) {
        type = 'sine';
      }
      oscillator.type = type;

      // 兼容旧浏览器的频率设置
      if (oscillator.frequency.setValueAtTime) {
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      } else {
        (oscillator.frequency as AudioParam & { value: number }).value = frequency;
      }

      const normalizedVolume = Math.min(volume / 100, 0.8);
      
      // 兼容旧浏览器的增益设置
      if (gainNode.gain.setValueAtTime) {
        gainNode.gain.setValueAtTime(normalizedVolume, audioContext.currentTime);
        if (gainNode.gain.exponentialRampToValueAtTime) {
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        } else {
          // 降级方案：直接设置值
          setTimeout(() => {
            (gainNode.gain as AudioParam & { value: number }).value = 0.001;
          }, duration * 1000);
        }
      } else {
        (gainNode.gain as AudioParam & { value: number }).value = normalizedVolume;
        setTimeout(() => {
          (gainNode.gain as AudioParam & { value: number }).value = 0.001;
        }, duration * 1000);
      }

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 兼容旧浏览器的启动和停止方法
      if (oscillator.start) {
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } else {
        (oscillator as OscillatorNode & { noteOn: (time: number) => void }).noteOn(audioContext.currentTime);
        (oscillator as OscillatorNode & { noteOff: (time: number) => void }).noteOff(audioContext.currentTime + duration);
      }
    } catch (error) {
      console.warn('Error playing tone:', error);
    }
  }

  public playAccent(soundType: SoundType, volume: number): void {
    const config = this.soundConfigs[soundType];
    this.playTone(config.accentFrequency, volume, config.duration, 'sine');
  }

  public playSecondary(soundType: SoundType, volume: number): void {
    const config = this.soundConfigs[soundType];
    this.playTone(config.secondaryFrequency, volume * 0.9, config.duration * 0.8, 'sine');
  }

  public playNormal(soundType: SoundType, volume: number): void {
    const config = this.soundConfigs[soundType];
    this.playTone(config.normalFrequency, volume * 0.8, config.duration * 0.7, 'sine');
  }

  public playSound(soundType: SoundType, isAccent: boolean, isSecondary: boolean, volume: number): void {
    try {
      if (isAccent) {
        this.playAccent(soundType, volume);
      } else if (isSecondary) {
        this.playSecondary(soundType, volume);
      } else {
        this.playNormal(soundType, volume);
      }
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  public preload(): void {
    this.getAudioContext();
  }

  public isSupported(): boolean {
    return !!(window.AudioContext || (window as { webkitAudioContext?: new () => AudioContext }).webkitAudioContext);
  }
}

export const audioUtils = new AudioUtils();