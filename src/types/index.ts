export type TimeSignature = '1/4' | '2/4' | '3/4' | '4/4' | '5/4' | '6/8' | '7/8' | '9/8' | '12/8';

export type SubdivisionType = 
  | 'half' 
  | 'quarter' 
  | 'eighth' 
  | 'sixteenth' 
  | 'thirtysecond'
  | 'duplet' 
  | 'triplet' 
  | 'quartuplet' 
  | 'quintuplet' 
  | 'sextuplet' 
  | 'septuplet'
  | 'nonuplet';

export type SoundType = 'click' | 'drum' | 'wood' | 'electronic' | 'metal';

export interface Volume {
  accent: number;
  normal: number;
}

export interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
  timeSignature: TimeSignature;
  subdivision: SubdivisionType;
  soundType: SoundType;
  volume: Volume;
  currentBeat: number;
  currentSubdivision: number;
}

export type MetronomeAction =
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_BPM'; payload: number }
  | { type: 'SET_TIME_SIGNATURE'; payload: TimeSignature }
  | { type: 'SET_SUBDIVISION'; payload: SubdivisionType }
  | { type: 'SET_SOUND_TYPE'; payload: SoundType }
  | { type: 'SET_VOLUME'; payload: Partial<Volume> }
  | { type: 'NEXT_BEAT' }
  | { type: 'NEXT_SUBDIVISION' }
  | { type: 'RESET_BEAT' };

export interface SoundConfig {
  accentFrequency: number;
  secondaryFrequency: number;
  normalFrequency: number;
  duration: number;
}

export interface SubdivisionConfig {
  value: SubdivisionType;
  name: string;
  symbol: string;
  displayName: string;
  beatMultiplier: number;
  description: string;
}

export interface TimeSignatureConfig {
  value: TimeSignature;
  beats: number;
  beatValue: number;
}
