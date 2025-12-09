export interface Race {
  id: string;
  name: string;
  description: string;
  traits: string[];
  emoji: string;
}

export const RACES: Race[] = [
  {
    id: 'wanderer',
    name: 'Wanderer',
    description: 'Versatile humans with an innate curiosity and adaptability. They thrive in any environment.',
    traits: ['Adaptable', 'Curious', 'Resilient'],
    emoji: '🧭',
  },
  {
    id: 'stoneblood',
    name: 'Stoneblood',
    description: 'Sturdy dwarven folk with an unbreakable spirit. Masters of endurance and determination.',
    traits: ['Enduring', 'Steadfast', 'Brave'],
    emoji: '⛏️',
  },
  {
    id: 'duskwalker',
    name: 'Duskwalker',
    description: 'Graceful elven beings attuned to nature. They move with purpose and see beauty in all things.',
    traits: ['Perceptive', 'Graceful', 'Wise'],
    emoji: '🌙',
  },
  {
    id: 'wildheart',
    name: 'Wildheart',
    description: 'Fierce beast-folk connected to primal instincts. They embrace adventure with wild abandon.',
    traits: ['Instinctive', 'Fierce', 'Free'],
    emoji: '🐺',
  },
];

export function getRaceById(id: string): Race | undefined {
  return RACES.find(race => race.id === id);
}

export function getRaceEmoji(raceId: string): string {
  const race = getRaceById(raceId);
  return race?.emoji ?? '🧭';
}

export function getRaceName(raceId: string): string {
  const race = getRaceById(raceId);
  return race?.name ?? 'Unknown';
}
