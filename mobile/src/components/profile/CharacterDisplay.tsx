import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/lib/theme';

interface CharacterDisplayProps {
  race?: string | null;
  characterClass?: string | null;
  customization?: Record<string, string> | null;
  size?: 'sm' | 'md' | 'lg';
}

const raceColors: Record<string, string> = {
  human: '#8B7355',
  elf: '#7BA382',
  dwarf: '#9C7A5B',
  orc: '#6B8E5A',
  halfling: '#C4A574',
};

const raceEmojis: Record<string, string> = {
  human: '⚔️',
  elf: '🌙',
  dwarf: '⛏️',
  orc: '🐺',
  halfling: '🍃',
};

export function CharacterDisplay({ race, characterClass, customization, size = 'md' }: CharacterDisplayProps) {
  const raceColor = raceColors[race || 'human'] || '#8B7355';
  const raceEmoji = raceEmojis[race || 'human'] || '⚔️';
  const skinTone = customization?.skinTone || '#D4A574';

  const sizeConfig = {
    sm: { container: 60, emoji: 28, border: 2 },
    md: { container: 100, emoji: 44, border: 3 },
    lg: { container: 160, emoji: 72, border: 4 },
  };

  const config = sizeConfig[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: config.container,
          height: config.container,
          borderRadius: config.container / 2,
          borderWidth: config.border,
          borderColor: raceColor,
          backgroundColor: `${skinTone}33`,
        },
      ]}
    >
      <Text style={{ fontSize: config.emoji }}>{raceEmoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
