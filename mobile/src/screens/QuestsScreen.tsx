import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/lib/theme';
import { QuestCard } from '@/components/QuestCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  useQuestsGroupedByTier,
  useActiveQuests,
  useAcceptQuest,
  useAbandonQuest,
  useQuestLimit,
  type Quest,
  type QuestFilters,
} from '@/hooks/useQuests';
import { useProfile } from '@/hooks/useProfile';

export function QuestsScreen() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'new'>('new');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [filters, setFilters] = useState<QuestFilters>({ niche: 'all', difficulty: 'all', classFilter: 'all' });

  const { data: profile } = useProfile();
  const { groupedQuests, isLoading } = useQuestsGroupedByTier(filters, profile?.class);
  const { data: activeQuests } = useActiveQuests();
  const { data: questLimit } = useQuestLimit();
  const acceptQuest = useAcceptQuest();
  const abandonQuest = useAbandonQuest();

  const handleAccept = async (questId: string) => {
    try {
      await acceptQuest.mutateAsync(questId);
      setSelectedQuest(null);
      Alert.alert('Quest Accepted!', 'Check your ongoing quests to track progress.');
    } catch (error: any) {
      Alert.alert('Cannot Accept', error.message);
    }
  };

  const handleAbandon = async (userQuestId: string) => {
    Alert.alert('Abandon Quest?', 'Are you sure you want to abandon this quest?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Abandon',
        style: 'destructive',
        onPress: async () => {
          try {
            await abandonQuest.mutateAsync(userQuestId);
          } catch (error) {
            Alert.alert('Error', 'Failed to abandon quest.');
          }
        },
      },
    ]);
  };

  const renderQuestSection = (title: string, quests: Quest[], icon: string) => {
    if (quests.length === 0) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>{icon}</Text>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Badge label={`${quests.length}`} color={`${Colors.secondary}22`} textColor={Colors.secondary} />
        </View>
        {quests.map(quest => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onPress={() => setSelectedQuest(quest)}
            showActions
            onAccept={() => handleAccept(quest.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quest Board</Text>
        {questLimit && (
          <Text style={styles.questCount}>
            {questLimit.activeCount}/{questLimit.limit === Infinity ? '∞' : questLimit.limit} Active
          </Text>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ongoing' && styles.tabActive]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.tabTextActive]}>
            Ongoing ({activeQuests?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'new' && styles.tabActive]}
          onPress={() => setActiveTab('new')}
        >
          <Text style={[styles.tabText, activeTab === 'new' && styles.tabTextActive]}>
            New Quests
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'ongoing' ? (
          activeQuests && activeQuests.length > 0 ? (
            activeQuests.map(uq => (
              uq.quest && (
                <QuestCard
                  key={uq.id}
                  quest={uq.quest}
                  onPress={() => uq.quest && setSelectedQuest(uq.quest)}
                  showActions
                  isActive
                  onAbandon={() => handleAbandon(uq.id)}
                />
              )
            ))
          ) : (
            <View style={styles.empty}>
              <Ionicons name="shield-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No active quests</Text>
              <Text style={styles.emptySubtext}>Accept quests from the board to begin!</Text>
            </View>
          )
        ) : (
          <>
            {renderQuestSection('For You', groupedQuests.forYou, '⭐')}
            {renderQuestSection('Grand Quests', groupedQuests.grand, '👑')}
            {renderQuestSection('Main Quests', groupedQuests.main, '⚔️')}
            {renderQuestSection('Side Quests', groupedQuests.side, '📜')}
            {!isLoading && groupedQuests.grand.length === 0 && groupedQuests.main.length === 0 && groupedQuests.side.length === 0 && (
              <View style={styles.empty}>
                <Ionicons name="search" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No quests available</Text>
                <Text style={styles.emptySubtext}>Check back soon for new adventures!</Text>
              </View>
            )}
          </>
        )}
        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Quest Detail Modal */}
      <Modal
        visible={!!selectedQuest}
        onClose={() => setSelectedQuest(null)}
        title={selectedQuest?.title}
      >
        {selectedQuest && (
          <View>
            <Text style={styles.modalDescription}>{selectedQuest.description}</Text>

            <View style={styles.modalRewards}>
              <View style={styles.modalRewardItem}>
                <Text style={styles.modalRewardLabel}>XP Reward</Text>
                <Text style={styles.modalRewardValue}>{selectedQuest.xp_reward}</Text>
              </View>
              <View style={styles.modalRewardItem}>
                <Text style={styles.modalRewardLabel}>Gold Reward</Text>
                <Text style={styles.modalRewardValue}>{selectedQuest.gold_reward}</Text>
              </View>
            </View>

            <View style={styles.modalMeta}>
              <Badge label={selectedQuest.difficulty.toUpperCase()} size="md" />
              {selectedQuest.niche && (
                <Badge label={selectedQuest.niche} color={`${Colors.accent}22`} textColor={Colors.accent} size="md" />
              )}
              {selectedQuest.class_affinity && (
                <Badge label={selectedQuest.class_affinity} color={`${Colors.xpPurple}22`} textColor={Colors.xpPurple} size="md" />
              )}
            </View>

            <Button
              title="Accept Quest"
              onPress={() => handleAccept(selectedQuest.id)}
              loading={acceptQuest.isPending}
              fullWidth
              size="lg"
              style={{ marginTop: Spacing.xl }}
            />
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  questCount: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.secondary,
  },
  tabText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.textDark,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  bottomPad: {
    height: 100,
  },
  modalDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  modalRewards: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  modalRewardItem: {
    flex: 1,
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  modalRewardLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  modalRewardValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  modalMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});
