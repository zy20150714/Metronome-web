import type { SoundType, SoundConfig } from '../types';

export const soundTypes: SoundType[] = ['click', 'drum', 'wood', 'electronic', 'metal'];

export const soundNames: Record<SoundType, string> = {
  click: '点击声',
  drum: '鼓声',
  wood: '木鱼声',
  electronic: '电子音',
  metal: '金属声',
};

class AudioUtils {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
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

  private customSoundConfig: SoundConfig = {
    accentFrequency: 1200,
    secondaryFrequency: 800,
    normalFrequency: 600,
    duration: 0.06,
  };

  private customWaveType: OscillatorType = 'sine';

  public getAudioContext(): AudioContext | null {
    try {
      if (!this.audioContext) {
        const AudioContextConstructor = window.AudioContext || (window as { webkitAudioContext?: new () => AudioContext }).webkitAudioContext;
        if (AudioContextConstructor) {
          this.audioContext = new AudioContextConstructor();
          this.masterGain = this.audioContext.createGain();
          this.masterGain.gain.value = 1;
          this.masterGain.connect(this.audioContext.destination);
        } else {
          console.warn('Web Audio API is not supported in this browser');
          return null;
        }
      }
      
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

  public setMasterVolume(volume: number): void {
    if (this.masterGain && this.audioContext) {
      const normalizedVolume = Math.min(Math.max(volume / 100, 0), 1);
      this.masterGain.gain.setTargetAtTime(normalizedVolume, this.audioContext.currentTime, 0.01);
    }
  }

  public getMasterVolume(): number {
    return this.masterGain ? this.masterGain.gain.value * 100 : 100;
  }

  public setCustomSoundConfig(config: Partial<SoundConfig> & { waveType?: OscillatorType }): void {
    if (config.waveType) {
      this.customWaveType = config.waveType;
    }
    this.customSoundConfig = { ...this.customSoundConfig, ...config };
  }

  public getCustomSoundConfig(): SoundConfig & { waveType: OscillatorType } {
    return { ...this.customSoundConfig, waveType: this.customWaveType };
  }

  private playTone(frequency: number, volume: number, duration: number, type: OscillatorType = 'sine', startTime?: number): void {
    const audioContext = this.getAudioContext();
    if (!audioContext || !this.masterGain) {
      return;
    }

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      const supportedTypes: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
      if (!supportedTypes.includes(type)) {
        type = 'sine';
      }
      oscillator.type = type;

      const start = startTime || audioContext.currentTime;
      
      if (oscillator.frequency.setValueAtTime) {
        oscillator.frequency.setValueAtTime(frequency, start);
      } else {
        (oscillator.frequency as AudioParam & { value: number }).value = frequency;
      }

      const normalizedVolume = Math.min(volume / 100, 0.8);
      
      if (gainNode.gain.setValueAtTime) {
        gainNode.gain.setValueAtTime(0, start);
        gainNode.gain.linearRampToValueAtTime(normalizedVolume, start + 0.005);
        if (gainNode.gain.exponentialRampToValueAtTime) {
          gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);
        } else {
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
      gainNode.connect(this.masterGain);

      if (oscillator.start) {
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
      } else {
        (oscillator as OscillatorNode & { noteOn: (time: number) => void }).noteOn(start);
        (oscillator as OscillatorNode & { noteOff: (time: number) => void }).noteOff(start + duration + 0.02);
      }
    } catch (error) {
      console.warn('Error playing tone:', error);
    }
  }

  public playAccent(soundType: SoundType, volume: number, startTime?: number): void {
    const config = soundType === 'custom' ? this.customSoundConfig : this.soundConfigs[soundType] || this.soundConfigs.click;
    const waveType = soundType === 'custom' ? this.customWaveType : 'sine';
    this.playTone(config.accentFrequency, volume, config.duration, waveType, startTime);
  }

  public playSecondary(soundType: SoundType, volume: number, startTime?: number): void {
    const config = soundType === 'custom' ? this.customSoundConfig : this.soundConfigs[soundType] || this.soundConfigs.click;
    const waveType = soundType === 'custom' ? this.customWaveType : 'sine';
    this.playTone(config.secondaryFrequency, volume * 0.9, config.duration * 0.8, waveType, startTime);
  }

  public playNormal(soundType: SoundType, volume: number, startTime?: number): void {
    const config = soundType === 'custom' ? this.customSoundConfig : this.soundConfigs[soundType] || this.soundConfigs.click;
    const waveType = soundType === 'custom' ? this.customWaveType : 'sine';
    this.playTone(config.normalFrequency, volume * 0.8, config.duration * 0.7, waveType, startTime);
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

  public scheduleSound(soundType: SoundType, isAccent: boolean, isSecondary: boolean, volume: number, time: number): void {
    try {
      if (isAccent) {
        this.playAccent(soundType, volume, time);
      } else if (isSecondary) {
        this.playSecondary(soundType, volume, time);
      } else {
        this.playNormal(soundType, volume, time);
      }
    } catch (error) {
      console.warn('Error scheduling sound:', error);
    }
  }

  public preload(): void {
    this.getAudioContext();
  }

  public isSupported(): boolean {
    return !!(window.AudioContext || (window as { webkitAudioContext?: new () => AudioContext }).webkitAudioContext);
  }

  public testSound(soundType: SoundType, isAccent: boolean = true): void {
    this.playSound(soundType, isAccent, false, 70);
  }
}

export const audioUtils = new AudioUtils();
