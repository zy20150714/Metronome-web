import type { TimeSignature, SubdivisionType, SubdivisionConfig } from '../types';

export const timeSignatures = [
  { beats: 2, noteValue: 4 },
  { beats: 3, noteValue: 4 },
  { beats: 4, noteValue: 4 },
  { beats: 5, noteValue: 4 },
  { beats: 6, noteValue: 8 },
  { beats: 7, noteValue: 8 },
  { beats: 9, noteValue: 8 },
  { beats: 12, noteValue: 8 },
];

export const subdivisions = [
  { id: 'quarter', label: '四分', description: '每拍为1个四分音符' },
  { id: 'eighth', label: '八分', description: '每拍分为2个八分音符' },
  { id: 'sixteenth', label: '十六分', description: '每拍分为4个十六分音符' },
  { id: 'triplet', label: '三连音', description: '三代二，3个音符代替2个' },
];

export const parseTimeSignature = (timeSignature: TimeSignature): { beats: number; beatValue: number } => {
  const [beats, beatValue] = timeSignature.split('/').map(Number);
  return { beats, beatValue };
};

export const subdivisionConfigs: SubdivisionConfig[] = [
  {
    value: 'half',
    name: '二分',
    symbol: '𝅗𝅥',
    displayName: '二分音符',
    beatMultiplier: 0.5,
    description: '每拍分为2个二分音符'
  },
  {
    value: 'quarter',
    name: '四分',
    symbol: '𝅘𝅥',
    displayName: '四分音符',
    beatMultiplier: 1,
    description: '每拍为1个四分音符'
  },
  {
    value: 'eighth',
    name: '八分',
    symbol: '𝅘𝅥𝅮',
    displayName: '八分音符',
    beatMultiplier: 2,
    description: '每拍分为2个八分音符'
  },
  {
    value: 'sixteenth',
    name: '十六分',
    symbol: '𝅘𝅥𝅯',
    displayName: '十六分音符',
    beatMultiplier: 4,
    description: '每拍分为4个十六分音符'
  },
  {
    value: 'thirtysecond',
    name: '三十二分',
    symbol: '𝅘𝅥𝅰',
    displayName: '三十二分音符',
    beatMultiplier: 8,
    description: '每拍分为8个三十二分音符'
  },
  {
    value: 'duplet',
    name: '二连音',
    symbol: '𝅘𝅥²',
    displayName: '二连音',
    beatMultiplier: 2/3,
    description: '二代三，2个音符代替3个'
  },
  {
    value: 'triplet',
    name: '三连音',
    symbol: '𝅘𝅥³',
    displayName: '三连音',
    beatMultiplier: 3,
    description: '三代二，3个音符代替2个'
  },
  {
    value: 'quartuplet',
    name: '四连音',
    symbol: '𝅘𝅥⁴',
    displayName: '四连音',
    beatMultiplier: 4/3,
    description: '四代三，4个音符代替3个'
  },
  {
    value: 'quintuplet',
    name: '五连音',
    symbol: '𝅘𝅥⁵',
    displayName: '五连音',
    beatMultiplier: 5,
    description: '五代四，5个音符代替4个'
  },
  {
    value: 'sextuplet',
    name: '六连音',
    symbol: '𝅘𝅥⁶',
    displayName: '六连音',
    beatMultiplier: 6,
    description: '六代四，6个音符代替4个'
  },
  {
    value: 'septuplet',
    name: '七连音',
    symbol: '𝅘𝅥⁷',
    displayName: '七连音',
    beatMultiplier: 7,
    description: '七代四，7个音符代替4个'
  },
  {
    value: 'nonuplet',
    name: '九连音',
    symbol: '𝅘𝅥⁹',
    displayName: '九连音',
    beatMultiplier: 9,
    description: '九代八，9个音符代替8个'
  }
];

export const getSubdivisionConfig = (subdivision: SubdivisionType): SubdivisionConfig => {
  const config = subdivisionConfigs.find(c => c.value === subdivision);
  return config || subdivisionConfigs.find(c => c.value === 'quarter')!;
};

export const calculateSubdivisionDuration = (bpm: number, subdivision: SubdivisionType): number => {
  const baseDuration = 60000 / bpm;
  const config = getSubdivisionConfig(subdivision);
  return baseDuration / config.beatMultiplier;
};

export const getSubdivisionsPerBeat = (subdivision: SubdivisionType): number => {
  const config = getSubdivisionConfig(subdivision);
  return config.beatMultiplier;
};

export const validateBPM = (bpm: number): number => {
  if (bpm < 30) return 30;
  if (bpm > 300) return 300;
  return bpm;
};

export const getSoundTypeEmoji = (soundType: string): string => {
  const emojis: Record<string, string> = {
    click: '👆',
    drum: '🥁',
    wood: '🪵',
    electronic: '🔊',
    metal: '🔔',
  };
  return emojis[soundType] || '🎵';
};

export const getSecondaryBeatPositions = (timeSignature: TimeSignature): number[] => {
  const [beats, beatValue] = timeSignature.split('/').map(Number);
  
  if (beatValue === 8) {
    if (beats === 6) return [4];
    if (beats === 9) return [4, 7];
    if (beats === 12) return [4, 7, 10];
    if (beats === 5) return [3];
    if (beats === 7) return [3, 5];
  }
  
  if (beatValue === 4) {
    if (beats === 5) return [3];
    if (beats === 7) return [3, 5];
  }
  
  return [];
};

export const getTimeSignatureName = (timeSignature: TimeSignature): string => {
  const [beats, beatValue] = timeSignature.split('/').map(Number);
  
  if (beatValue === 4) {
    if (beats === 2) return '二拍子';
    if (beats === 3) return '三拍子';
    if (beats === 4) return '四拍子';
    if (beats === 5) return '五拍子';
    if (beats === 6) return '六拍子';
    if (beats === 7) return '七拍子';
  }
  
  if (beatValue === 8) {
    if (beats === 6) return '六八拍子';
    if (beats === 9) return '九八拍子';
    if (beats === 12) return '十二八拍子';
    if (beats === 5) return '五八拍子';
    if (beats === 7) return '七八拍子';
  }
  
  return `${beats}/${beatValue}`;
};

export const getSoundTypeName = (soundType: string): string => {
  const names: Record<string, string> = {
    click: '点击声',
    drum: '鼓声',
    wood: '木鱼声',
    electronic: '电子音',
    metal: '金属声',
  };
  return names[soundType] || '未知声音';
};

export const getSubdivisionCounting = (subdivision: SubdivisionType): string => {
  const counting: Record<SubdivisionType, string> = {
    half: '1 - 2',
    quarter: '1',
    eighth: '1 &',
    sixteenth: '1 e & a',
    thirtysecond: '1 te ka & ta',
    duplet: '1-2',
    triplet: '1-trip-let',
    quartuplet: '1-2-3-4',
    quintuplet: '1-2-3-4-5',
    sextuplet: '1-trip-let-2-trip-let',
    septuplet: '1-2-3-4-5-6-7',
    nonuplet: '1-2-3-4-5-6-7-8-9'
  };
  return counting[subdivision] || '1';
};

export const formatBPM = (bpm: number): string => {
  return `${bpm}`;
};

export const formatTimeSignature = (timeSignature: string | { beats: number; noteValue: number }): string => {
  if (typeof timeSignature === 'string') {
    return timeSignature;
  }
  return `${timeSignature.beats}/${timeSignature.noteValue}`;
};
