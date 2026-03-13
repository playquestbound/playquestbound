import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/lib/theme';
import { useProfile } from '@/hooks/useProfile';
import { useActiveTitle } from '@/hooks/useTitles';
import { getXpProgress, formatNumber } from '@/lib/levelSystem';
import { getRaceEmoji } from '@/lib/races';

export function StatusBar() {
  const { data: profile } = useProfile();
  const { data: activeTitle } = useActiveTitle();

  if (!profile) return null;

  const xpProgress = getXpProgress(profile.xp, profile.level);
  const raceEmoji = getRaceEmoji(profile.race || 'human');

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.nameSection}>
          <Text style={styles.raceEmoji}>{raceEmoji}</Text>
          <View>
            <Text style={styles.characterName}>{profile.character_name || 'Adventurer'}</Text>
            {activeTitle && <Text style={styles.title}>{activeTitle}</Text>}
          </View>
        </View>
        <View style={styles.statsSection}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv.{profile.level}</Text>
          </View>
          <View style={styles.goldContainer}>
            <Text style={styles.goldIcon}>🪙</Text>
            <Text style={styles.goldText}>{formatNumber(profile.gold)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.xpBarContainer}>
        <View style={styles.xpBarBackground}>
          <View style={[styles.xpBarFill, { width: `${xpProgress.percentage}%` }]} />
        </View>
        <Text style={styles.xpText}>
          {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.required)} XP
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: `${Colors.backgroundCard}ee`,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  raceEmoji: {
    fontSize: 28,
  },
  characterName: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  title: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  levelBadge: {
    backgroundColor: `${Colors.xpPurple}33`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.xpPurple,
  },
  levelText: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.xpPurpleLight,
  },
  goldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goldIcon: {
    fontSize: 16,
  },
  goldText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gold,
  },
  xpBarContainer: {
    gap: 4,
  },
  xpBarBackground: {
    height: 6,
    backgroundColor: `${Colors.xpPurple}22`,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: Colors.xpPurple,
    borderRadius: BorderRadius.full,
  },
  xpText: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'right',
  },
});
