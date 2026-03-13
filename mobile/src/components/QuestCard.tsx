import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '@/lib/theme';
import { Badge } from './ui/Badge';
import type { Quest } from '@/hooks/useQuests';

interface QuestCardProps {
  quest: Quest;
  onPress: () => void;
  showActions?: boolean;
  onAccept?: () => void;
  onAbandon?: () => void;
  onComplete?: () => void;
  isActive?: boolean;
}

const difficultyStars = (difficulty: string) => {
  const levels: Record<string, number> = { easy: 1, medium: 2, hard: 3, legendary: 4 };
  const count = levels[difficulty] || 1;
  return '★'.repeat(count) + '☆'.repeat(4 - count);
};

const tierColors: Record<string, string> = {
  grand: Colors.grandTier,
  main: Colors.mainTier,
  side: Colors.sideTier,
};

export function QuestCard({
  quest,
  onPress,
  showActions = false,
  onAccept,
  onAbandon,
  onComplete,
  isActive = false,
}: QuestCardProps) {
  const tierColor = tierColors[quest.tier || 'side'] || Colors.sideTier;

  return (
    <TouchableOpacity style={[styles.container, { borderLeftColor: tierColor }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{quest.title}</Text>
          {quest.tier === 'grand' && <Text style={styles.tierIcon}>👑</Text>}
        </View>
        <Badge
          label={quest.tier?.toUpperCase() || 'SIDE'}
          color={`${tierColor}22`}
          textColor={tierColor}
          size="sm"
        />
      </View>

      <Text style={styles.description} numberOfLines={2}>{quest.description}</Text>

      <View style={styles.footer}>
        <View style={styles.rewards}>
          <View style={styles.rewardItem}>
            <Text style={styles.xpIcon}>✦</Text>
            <Text style={styles.rewardText}>{quest.xp_reward} XP</Text>
          </View>
          <View style={styles.rewardItem}>
            <Text style={styles.goldIcon}>🪙</Text>
            <Text style={styles.rewardText}>{quest.gold_reward}</Text>
          </View>
        </View>
        <Text style={[styles.difficulty, { color: tierColor }]}>
          {difficultyStars(quest.difficulty)}
        </Text>
      </View>

      {quest.niche && (
        <Badge
          label={quest.niche}
          color={`${Colors.accent}22`}
          textColor={Colors.accent}
          size="sm"
          style={styles.nicheBadge}
        />
      )}

      {showActions && (
        <View style={styles.actions}>
          {isActive && onComplete && (
            <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.completeText}>Complete</Text>
            </TouchableOpacity>
          )}
          {isActive && onAbandon && (
            <TouchableOpacity style={styles.abandonButton} onPress={onAbandon}>
              <Ionicons name="close-circle" size={18} color={Colors.destructive} />
              <Text style={styles.abandonText}>Abandon</Text>
            </TouchableOpacity>
          )}
          {!isActive && onAccept && (
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Ionicons name="add-circle" size={18} color={Colors.secondary} />
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  tierIcon: {
    fontSize: 16,
    marginLeft: Spacing.xs,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewards: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpIcon: {
    color: Colors.xpPurple,
    fontSize: 14,
  },
  goldIcon: {
    fontSize: 14,
  },
  rewardText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  difficulty: {
    fontSize: FontSizes.sm,
    letterSpacing: 2,
  },
  nicheBadge: {
    marginTop: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  acceptText: {
    color: Colors.secondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completeText: {
    color: Colors.success,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  abandonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  abandonText: {
    color: Colors.destructive,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
