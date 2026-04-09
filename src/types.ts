export type TimeSignature = string;

export type NoteValue = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth' | 'triplet';

export type SoundType = 'click' | 'drum' | 'wood' | 'electronic' | 'metal';

export interface Volume {
  accent: number;
  normal: number;
}

export interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
  timeSignature: TimeSignature;
  noteValue: NoteValue;
  soundType: SoundType;
  volume: Volume;
  subdivision: number;
  currentBeat: number;
  currentSubdivision: number;
}

export type MetronomeAction =
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_BPM'; payload: number }
  | { type: 'SET_TIME_SIGNATURE'; payload: TimeSignature }
  | { type: 'SET_NOTE_VALUE'; payload: NoteValue }
  | { type: 'SET_SOUND_TYPE'; payload: SoundType }
  | { type: 'SET_VOLUME'; payload: Partial<Volume> }
  | { type: 'SET_SUBDIVISION'; payload: number }
  | { type: 'NEXT_BEAT' }
  | { type: 'NEXT_SUBDIVISION' }
  | { type: 'RESET_BEAT' };

export interface SoundConfig {
  accentFrequency: number;
  secondaryFrequency: number;
  normalFrequency: number;
  duration: number;
}
