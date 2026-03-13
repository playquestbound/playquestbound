import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCompletedQuests } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function JournalScreen() {
  const [activeTab, setActiveTab] = useState<'runs' | 'quests'>('runs');
  const { user } = useAuth();
  const { data: completedQuests } = useCompletedQuests();

  const { data: journalEntries } = useQuery({
    queryKey: ['journal-entries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const runEntries = journalEntries?.filter(e => e.entry_type === 'run') || [];

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adventure Journal</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'runs' && styles.tabActive]}
          onPress={() => setActiveTab('runs')}
        >
          <Text style={[styles.tabText, activeTab === 'runs' && styles.tabTextActive]}>
            Explorations ({runEntries.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quests' && styles.tabActive]}
          onPress={() => setActiveTab('quests')}
        >
          <Text style={[styles.tabText, activeTab === 'quests' && styles.tabTextActive]}>
            Quests ({completedQuests?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'runs' ? (
          runEntries.length > 0 ? (
            runEntries.map(entry => (
              <Card key={entry.id} variant="bordered" style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Ionicons name="walk" size={20} color={Colors.success} />
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                </View>
                <View style={styles.entryStats}>
                  <View style={styles.entryStat}>
                    <Text style={styles.entryStatValue}>
                      {(entry.distance_km || 0).toFixed(2)} km
                    </Text>
                    <Text style={styles.entryStatLabel}>Distance</Text>
                  </View>
                  <View style={styles.entryStat}>
                    <Text style={styles.entryStatValue}>
                      {formatDuration(entry.duration_seconds || 0)}
                    </Text>
                    <Text style={styles.entryStatLabel}>Duration</Text>
                  </View>
                  <View style={styles.entryStat}>
                    <Text style={styles.entryStatValue}>
                      {entry.avg_pace ? `${entry.avg_pace.toFixed(1)}` : '--'}
                    </Text>
                    <Text style={styles.entryStatLabel}>min/km</Text>
                  </View>
                  <View style={styles.entryStat}>
                    <Text style={[styles.entryStatValue, { color: Colors.xpPurple }]}>
                      +{entry.xp_earned || 0}
                    </Text>
                    <Text style={styles.entryStatLabel}>XP</Text>
                  </View>
                </View>
                <Text style={styles.entryDate}>
                  {new Date(entry.created_at).toLocaleDateString()}
                </Text>
              </Card>
            ))
          ) : (
            <View style={styles.empty}>
              <Ionicons name="map-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No explorations yet</Text>
              <Text style={styles.emptySubtext}>Start your first run to see it here!</Text>
            </View>
          )
        ) : (
          completedQuests && completedQuests.length > 0 ? (
            completedQuests.map(uq => (
              uq.quest && (
                <Card key={uq.id} variant="bordered" style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    <Ionicons name="trophy" size={20} color={Colors.secondary} />
                    <Text style={styles.entryTitle}>{uq.quest.title}</Text>
                  </View>
                  <Text style={styles.entryDescription}>{uq.quest.description}</Text>
                  <View style={styles.questRewards}>
                    <Badge label={`${uq.quest.xp_reward} XP`} color={`${Colors.xpPurple}22`} textColor={Colors.xpPurple} />
                    <Badge label={`${uq.quest.gold_reward} Gold`} color={`${Colors.gold}22`} textColor={Colors.gold} />
                  </View>
                  {uq.completed_at && (
                    <Text style={styles.entryDate}>
                      Completed {new Date(uq.completed_at).toLocaleDateString()}
                    </Text>
                  )}
                </Card>
              )
            ))
          ) : (
            <View style={styles.empty}>
              <Ionicons name="shield-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No completed quests</Text>
              <Text style={styles.emptySubtext}>Complete quests to fill your journal!</Text>
            </View>
          )
        )}
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  headerTitle: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.secondary },
  tabContainer: {
    flexDirection: 'row', marginHorizontal: Spacing.xl, marginBottom: Spacing.md,
    backgroundColor: Colors.backgroundElevated, borderRadius: BorderRadius.md, padding: 4,
  },
  tab: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: BorderRadius.sm },
  tabActive: { backgroundColor: Colors.secondary },
  tabText: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textMuted },
  tabTextActive: { color: Colors.textDark },
  content: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl },
  entryCard: { marginBottom: Spacing.md },
  entryHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  entryTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  entryStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  entryStat: { alignItems: 'center' },
  entryStatValue: { fontSize: FontSizes.md, fontWeight: 'bold', color: Colors.textPrimary },
  entryStatLabel: { fontSize: FontSizes.xs, color: Colors.textMuted },
  entryDate: { fontSize: FontSizes.xs, color: Colors.textMuted },
  entryDescription: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginBottom: Spacing.sm },
  questRewards: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  empty: { alignItems: 'center', paddingVertical: Spacing['4xl'], gap: Spacing.md },
  emptyText: { fontSize: FontSizes.lg, color: Colors.textPrimary, fontWeight: '600' },
  emptySubtext: { fontSize: FontSizes.sm, color: Colors.textMuted },
  bottomPad: { height: 100 },
});
