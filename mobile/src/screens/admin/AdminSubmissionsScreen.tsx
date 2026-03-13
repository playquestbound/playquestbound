import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  useAdminSubmissions, useSubmissionStats, useApproveSubmission, useRejectSubmission,
  type SubmissionFilters, type Submission,
} from '@/hooks/useAdminSubmissions';

const statusColors: Record<string, string> = {
  pending: Colors.warning,
  approved: Colors.success,
  rejected: Colors.error,
};

export function AdminSubmissionsScreen() {
  const navigation = useNavigation();
  const [filters, setFilters] = useState<SubmissionFilters>({ status: 'pending', search: '' });

  const { data: submissions } = useAdminSubmissions(filters);
  const { data: stats } = useSubmissionStats();
  const approveSubmission = useApproveSubmission();
  const rejectSubmission = useRejectSubmission();

  const handleApprove = (submission: Submission) => {
    const xp = submission.quest?.xp_reward || 0;
    const gold = submission.quest?.gold_reward || 0;

    Alert.alert('Approve Submission?', `Award ${xp} XP and ${gold} Gold?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve', onPress: async () => {
          try {
            await approveSubmission.mutateAsync({ submissionId: submission.id, xpAwarded: xp, goldAwarded: gold });
            Alert.alert('Approved!', 'Rewards have been awarded.');
          } catch (e) { Alert.alert('Error', 'Failed to approve.'); }
        },
      },
    ]);
  };

  const handleReject = (submission: Submission) => {
    Alert.prompt('Reject Submission', 'Enter rejection reason:', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject', style: 'destructive', onPress: async (reason) => {
          try {
            await rejectSubmission.mutateAsync({ submissionId: submission.id, reason: reason || 'No reason provided' });
          } catch (e) { Alert.alert('Error', 'Failed to reject.'); }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submissions</Text>
      </View>

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

      <View style={styles.filterBar}>
        {['all', 'pending', 'approved', 'rejected'].map(status => (
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
        data={submissions}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card variant="bordered" style={styles.submissionCard}>
            <View style={styles.submissionHeader}>
              <View style={styles.submissionInfo}>
                <Text style={styles.questTitle}>{item.quest?.title || 'Unknown Quest'}</Text>
                <Text style={styles.playerName}>by {item.profile?.character_name || 'Unknown'} (Lv.{item.profile?.level})</Text>
              </View>
              <Badge
                label={item.status.toUpperCase()}
                color={`${statusColors[item.status]}22`}
                textColor={statusColors[item.status]}
                size="sm"
              />
            </View>

            {item.submitted_at && (
              <Text style={styles.dateText}>
                Submitted {new Date(item.submitted_at).toLocaleDateString()}
              </Text>
            )}

            {item.status === 'pending' && (
              <View style={styles.actions}>
                <Button title="Approve" variant="primary" size="sm" onPress={() => handleApprove(item)} style={{ flex: 1 }} />
                <Button title="Reject" variant="destructive" size="sm" onPress={() => handleReject(item)} style={{ flex: 1 }} />
              </View>
            )}
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No submissions found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  backButton: { padding: Spacing.sm },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.secondary },
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
  submissionCard: { marginBottom: Spacing.sm },
  submissionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  submissionInfo: { flex: 1, marginRight: Spacing.sm },
  questTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary },
  playerName: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  dateText: { fontSize: FontSizes.xs, color: Colors.textMuted, marginBottom: Spacing.sm },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  empty: { alignItems: 'center', paddingVertical: Spacing['4xl'] },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted },
});
