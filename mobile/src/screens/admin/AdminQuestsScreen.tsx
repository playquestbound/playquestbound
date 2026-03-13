import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import {
  useAdminQuests, useQuestStats, usePublishQuest, useArchiveQuest,
  useCreateQuest, type QuestFilters, type AdminQuest, type CreateQuestData,
} from '@/hooks/useAdminQuests';

const statusColors: Record<string, string> = {
  draft: Colors.textMuted,
  live: Colors.success,
  scheduled: Colors.info,
  archived: Colors.error,
};

export function AdminQuestsScreen() {
  const navigation = useNavigation();
  const [filters, setFilters] = useState<QuestFilters>({ status: 'all', tier: 'all', niche: 'all', search: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuest, setNewQuest] = useState<Partial<CreateQuestData>>({
    quest_type: 'standard', quest_category: 'physical', difficulty: 'medium', tier: 'side',
    xp_reward: 100, gold_reward: 50,
  });

  const { data: quests, isLoading } = useAdminQuests(filters);
  const { data: stats } = useQuestStats();
  const publishQuest = usePublishQuest();
  const archiveQuest = useArchiveQuest();
  const createQuest = useCreateQuest();

  const handlePublish = (quest: AdminQuest) => {
    Alert.alert('Publish Quest?', `Publish "${quest.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Publish', onPress: async () => {
          try {
            await publishQuest.mutateAsync(quest.id);
            Alert.alert('Published!', 'Quest is now live.');
          } catch (e) { Alert.alert('Error', 'Failed to publish.'); }
        },
      },
    ]);
  };

  const handleArchive = (quest: AdminQuest) => {
    Alert.alert('Archive Quest?', `Archive "${quest.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive', style: 'destructive', onPress: async () => {
          try {
            await archiveQuest.mutateAsync(quest.id);
          } catch (e) { Alert.alert('Error', 'Failed to archive.'); }
        },
      },
    ]);
  };

  const handleCreate = async () => {
    if (!newQuest.title || !newQuest.description) {
      Alert.alert('Error', 'Title and description are required.');
      return;
    }
    try {
      await createQuest.mutateAsync({
        title: newQuest.title!,
        description: newQuest.description!,
        quest_type: newQuest.quest_type || 'standard',
        quest_category: newQuest.quest_category || 'physical',
        niche: newQuest.niche || null,
        class_affinity: newQuest.class_affinity || null,
        xp_reward: newQuest.xp_reward || 100,
        gold_reward: newQuest.gold_reward || 50,
        difficulty: newQuest.difficulty || 'medium',
        tier: newQuest.tier || 'side',
        is_funded_eligible: false,
        requires_manual_review: false,
        verification_config: { requires_gps: true, requires_video: true, challenges: [] },
      });
      setShowCreateModal(false);
      setNewQuest({ quest_type: 'standard', quest_category: 'physical', difficulty: 'medium', tier: 'side', xp_reward: 100, gold_reward: 50 });
      Alert.alert('Created!', 'Quest saved as draft.');
    } catch (e) {
      Alert.alert('Error', 'Failed to create quest.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quest Management</Text>
        <TouchableOpacity onPress={() => setShowCreateModal(true)} style={styles.addButton}>
          <Ionicons name="add" size={24} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {stats && (
        <View style={styles.statsRow}>
          {Object.entries(stats).map(([key, value]) => (
            <View key={key} style={styles.statItem}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{key}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {['all', 'draft', 'live', 'scheduled', 'archived'].map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, filters.status === status && styles.filterChipActive]}
            onPress={() => setFilters({ ...filters, status })}
          >
            <Text style={[styles.filterChipText, filters.status === status && styles.filterChipTextActive]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={quests}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card variant="bordered" style={styles.questCard}>
            <View style={styles.questHeader}>
              <Text style={styles.questTitle} numberOfLines={1}>{item.title}</Text>
              <Badge
                label={(item.status || 'draft').toUpperCase()}
                color={`${statusColors[item.status || 'draft']}22`}
                textColor={statusColors[item.status || 'draft']}
                size="sm"
              />
            </View>
            <Text style={styles.questDesc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.questMeta}>
              <Text style={styles.metaText}>{item.tier} | {item.difficulty} | {item.xp_reward} XP</Text>
            </View>
            <View style={styles.questActions}>
              {item.status === 'draft' && (
                <Button title="Publish" variant="primary" size="sm" onPress={() => handlePublish(item)} />
              )}
              {item.status !== 'archived' && (
                <Button title="Archive" variant="ghost" size="sm" onPress={() => handleArchive(item)} />
              )}
            </View>
          </Card>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No quests found</Text>
            </View>
          ) : null
        }
      />

      {/* Create Quest Modal */}
      <Modal visible={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Quest" fullScreen>
        <Input label="Title" value={newQuest.title || ''} onChangeText={t => setNewQuest({ ...newQuest, title: t })} placeholder="Quest title" />
        <Input label="Description" value={newQuest.description || ''} onChangeText={t => setNewQuest({ ...newQuest, description: t })} placeholder="Quest description" multiline numberOfLines={4} />
        <Input label="XP Reward" value={String(newQuest.xp_reward || '')} onChangeText={t => setNewQuest({ ...newQuest, xp_reward: parseInt(t) || 0 })} keyboardType="numeric" />
        <Input label="Gold Reward" value={String(newQuest.gold_reward || '')} onChangeText={t => setNewQuest({ ...newQuest, gold_reward: parseInt(t) || 0 })} keyboardType="numeric" />

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Tier</Text>
          <View style={styles.chipRow}>
            {['side', 'main', 'grand'].map(tier => (
              <TouchableOpacity
                key={tier}
                style={[styles.chip, newQuest.tier === tier && styles.chipActive]}
                onPress={() => setNewQuest({ ...newQuest, tier })}
              >
                <Text style={[styles.chipText, newQuest.tier === tier && styles.chipTextActive]}>
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Difficulty</Text>
          <View style={styles.chipRow}>
            {['easy', 'medium', 'hard', 'legendary'].map(diff => (
              <TouchableOpacity
                key={diff}
                style={[styles.chip, newQuest.difficulty === diff && styles.chipActive]}
                onPress={() => setNewQuest({ ...newQuest, difficulty: diff })}
              >
                <Text style={[styles.chipText, newQuest.difficulty === diff && styles.chipTextActive]}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button title="Create Quest" onPress={handleCreate} loading={createQuest.isPending} fullWidth size="lg" style={{ marginTop: Spacing.xl }} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  backButton: { padding: Spacing.sm },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.secondary, flex: 1, marginLeft: Spacing.sm },
  addButton: { padding: Spacing.sm },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.textPrimary },
  statLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, textTransform: 'capitalize' },
  filterBar: { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  filterChipText: { fontSize: FontSizes.xs, color: Colors.textMuted },
  filterChipTextActive: { color: Colors.textDark, fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: 20 },
  questCard: { marginBottom: Spacing.sm },
  questHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  questTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary, flex: 1, marginRight: Spacing.sm },
  questDesc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginBottom: Spacing.sm },
  questMeta: { marginBottom: Spacing.sm },
  metaText: { fontSize: FontSizes.xs, color: Colors.textMuted, textTransform: 'capitalize' },
  questActions: { flexDirection: 'row', gap: Spacing.sm },
  empty: { alignItems: 'center', paddingVertical: Spacing['4xl'] },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted },
  formRow: { marginBottom: Spacing.lg },
  formLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary, fontWeight: '500', marginBottom: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  chipText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  chipTextActive: { color: Colors.textDark, fontWeight: '600' },
});
