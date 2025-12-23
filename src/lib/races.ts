export type Gender = 'male' | 'female';

export interface Race {
  id: string;
  name: string;
  description: string;
  traits: string[];
  emoji: string;
  modelUrls?: {
    male?: string;
    female?: string;
  };
}

export const RACES: Race[] = [
  {
    id: 'human',
    name: 'Human',
    description: 'Versatile and adaptable, humans thrive in any environment through sheer determination.',
    traits: ['Adaptable', 'Ambitious', 'Resilient'],
    emoji: '⚔️',
    modelUrls: {
      male: '/models/human-male.glb',
      female: '/models/human-female.glb',
    },
  },
  {
    id: 'elf',
    name: 'Elf',
    description: 'Graceful beings attuned to magic and nature. They move with purpose and ancient wisdom.',
    traits: ['Perceptive', 'Graceful', 'Wise'],
    emoji: '🌙',
    modelUrls: {
      male: '/models/elf-male.glb',
      female: '/models/elf-female.glb',
    },
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    description: 'Sturdy mountain folk with unbreakable spirit. Masters of crafts and endurance.',
    traits: ['Enduring', 'Steadfast', 'Brave'],
    emoji: '⛏️',
    modelUrls: {
      male: '/models/dwarf-male.glb',
      female: '/models/dwarf-female.glb',
    },
  },
  {
    id: 'orc',
    name: 'Orc',
    description: 'Fierce warriors connected to primal strength. They embrace battle with wild abandon.',
    traits: ['Fierce', 'Strong', 'Fearless'],
    emoji: '🐺',
    modelUrls: {
      male: '/models/orc-male.glb',
      female: '/models/orc-female.glb',
    },
  },
];

export function getRaceById(id: string): Race | undefined {
  return RACES.find(race => race.id === id);
}

export function getRaceEmoji(raceId: string): string {
  const race = getRaceById(raceId);
  return race?.emoji ?? '⚔️';
}

export function getRaceName(raceId: string): string {
  const race = getRaceById(raceId);
  return race?.name ?? 'Unknown';
}

export function getRaceModelUrl(raceId: string, gender: Gender): string | undefined {
  const race = getRaceById(raceId);
  return race?.modelUrls?.[gender];
}
