import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '@/lib/theme';
import { StatusBar } from '@/components/home/StatusBar';
import { useProfile } from '@/hooks/useProfile';
import { useRunTracker } from '@/hooks/useRunTracker';
import { Card } from '@/components/ui/Card';

export function HomeScreen() {
  const navigation = useNavigation();
  const { data: profile } = useProfile();
  const { isRunning, distance, duration } = useRunTracker();

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Active Run Banner */}
        {isRunning && (
          <TouchableOpacity
            style={styles.runBanner}
            onPress={() => navigation.navigate('RunTracker' as never)}
          >
            <View style={styles.runBannerContent}>
              <Ionicons name="walk" size={20} color={Colors.success} />
              <Text style={styles.runBannerText}>
                Exploring: {(distance / 1000).toFixed(2)} km | {formatDuration(duration)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.success} />
          </TouchableOpacity>
        )}

        {/* Camp Scene */}
        <View style={styles.campScene}>
          <View style={styles.campBackground}>
            <Text style={styles.campEmoji}>🏕️</Text>
            <Text style={styles.campTitle}>Adventure Camp</Text>
            <Text style={styles.campSubtitle}>
              Welcome back, {profile?.character_name || 'Adventurer'}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('RunTracker' as never)}
          >
            <Ionicons name="navigate" size={32} color={Colors.success} />
            <Text style={styles.actionLabel}>Start Exploring</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) parent.navigate('Quests');
            }}
          >
            <Ionicons name="shield" size={32} color={Colors.secondary} />
            <Text style={styles.actionLabel}>View Quests</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <Card variant="bordered" style={styles.statsCard}>
          <Text style={styles.statsTitle}>Adventure Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile?.level || 1}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile?.xp || 0}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile?.gold || 0}</Text>
              <Text style={styles.statLabel}>Gold</Text>
            </View>
          </View>
        </Card>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  runBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${Colors.success}22`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: `${Colors.success}44`,
  },
  runBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  runBannerText: {
    color: Colors.success,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  campScene: {
    height: 220,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    ...Shadows.lg,
  },
  campBackground: {
    flex: 1,
    backgroundColor: Colors.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.xl,
  },
  campEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  campTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  campSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  actionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  statsCard: {
    marginBottom: Spacing.xl,
  },
  statsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  bottomPad: {
    height: 100,
  },
});
