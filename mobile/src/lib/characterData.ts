// Race data
export const RACES = [
  {
    id: 'human',
    name: 'Human',
    description: 'Versatile and adaptable. The backbone of any adventuring party.',
    color: '#8B7355',
  },
  {
    id: 'elf',
    name: 'Elf',
    description: 'Graceful and agile. At home in forests and ancient places.',
    color: '#7BA382',
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    description: 'Sturdy and resilient. Built for mountains and hard roads.',
    color: '#9C7A5B',
  },
  {
    id: 'orc',
    name: 'Orc',
    description: 'Powerful and fierce. Strength in every step.',
    color: '#6B8E5A',
  },
  {
    id: 'halfling',
    name: 'Halfling',
    description: 'Small but clever. Finds paths others miss.',
    color: '#C4A574',
  },
] as const;

// Class data
export const CLASSES = [
  {
    id: 'wanderer',
    name: 'Wanderer',
    description: 'Urban explorer. You find beauty in abandoned places and hidden corners of the city.',
    icon: '🏚️',
  },
  {
    id: 'lightfoot',
    name: 'Lightfoot',
    description: 'Runner. The open road calls to you. Every mile is a meditation.',
    icon: '🏃',
  },
  {
    id: 'exile',
    name: 'Exile',
    description: 'Hiker. Peaks and trails are your domain. You find freedom in the wilderness.',
    icon: '🥾',
  },
  {
    id: 'stoneblood',
    name: 'Stoneblood',
    description: 'Strength seeker. The iron is your altar. Power flows through discipline.',
    icon: '💪',
  },
  {
    id: 'bard',
    name: 'Bard',
    description: 'Storyteller. You capture moments and weave tales. The world is your canvas.',
    icon: '📸',
  },
] as const;

// Customization options
export const SKIN_TONES = [
  '#FFE5D8',
  '#F5D0B8',
  '#E8B998',
  '#D4A574',
  '#C08552',
  '#8D5524',
  '#5C3D2E',
  '#3D2314',
];

export const HAIR_STYLES = [
  'Style 1',
  'Style 2',
  'Style 3',
  'Style 4',
  'Style 5',
  'Style 6',
];

export const HAIR_COLORS = [
  '#1A1A1A', // Black
  '#4A3728', // Brown
  '#D4A857', // Blonde
  '#8B2500', // Red
  '#FFFFFF', // White
  '#3366CC', // Blue
  '#228B22', // Green
  '#6B3FA0', // Purple
  '#FF69B4', // Pink
  '#FF6B35', // Orange
];

export const EYE_COLORS = [
  '#4A3728', // Brown
  '#4169E1', // Blue
  '#228B22', // Green
  '#8B7355', // Hazel
  '#D4A857', // Amber
  '#808080', // Gray
  '#6B3FA0', // Purple
  '#B22222', // Red
];

export type CharacterCustomization = {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
};

export const DEFAULT_CUSTOMIZATION: CharacterCustomization = {
  skinTone: SKIN_TONES[3],
  hairStyle: HAIR_STYLES[0],
  hairColor: HAIR_COLORS[1],
  eyeColor: EYE_COLORS[0],
};
