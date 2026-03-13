import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '@/lib/theme';
import { useLeaderboard } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { getRaceEmoji } from '@/lib/races';
import { formatNumber } from '@/lib/levelSystem';

export function LeaderboardScreen() {
  const [search, setSearch] = useState('');
  const { data: leaderboard, isLoading } = useLeaderboard();
  const { user } = useAuth();

  const filtered = leaderboard?.filter(p =>
    !search || p.character_name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const rankIcons = ['👑', '🥈', '🥉'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hall of Champions</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search adventurers..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id || ''}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const isCurrentUser = item.id === user?.id;
          return (
            <View style={[styles.row, isCurrentUser && styles.rowHighlight]}>
              <View style={styles.rankContainer}>
                {index < 3 ? (
                  <Text style={styles.rankIcon}>{rankIcons[index]}</Text>
                ) : (
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                )}
              </View>
              <Text style={styles.raceEmoji}>{getRaceEmoji(item.race || 'human')}</Text>
              <View style={styles.playerInfo}>
                <Text style={[styles.playerName, isCurrentUser && styles.playerNameHighlight]}>
                  {item.character_name || 'Unknown'}
                  {isCurrentUser && ' (You)'}
                </Text>
                <Text style={styles.playerLevel}>Level {item.level}</Text>
              </View>
              <Text style={styles.xpValue}>{formatNumber(item.xp || 0)} XP</Text>
            </View>
          );
        }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Ionicons name="trophy-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No champions yet</Text>
            </View>
          ) : null
        }
        ListFooterComponent={<View style={styles.bottomPad} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  headerTitle: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.secondary },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.inputBackground, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, marginHorizontal: Spacing.xl, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: { flex: 1, paddingVertical: Spacing.md, fontSize: FontSizes.md, color: Colors.textPrimary },
  listContent: { paddingHorizontal: Spacing.xl },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  rowHighlight: { borderColor: Colors.secondary, backgroundColor: `${Colors.secondary}11` },
  rankContainer: { width: 32, alignItems: 'center' },
  rankIcon: { fontSize: 20 },
  rankNumber: { fontSize: FontSizes.md, fontWeight: 'bold', color: Colors.textMuted },
  raceEmoji: { fontSize: 24 },
  playerInfo: { flex: 1 },
  playerName: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary },
  playerNameHighlight: { color: Colors.secondary },
  playerLevel: { fontSize: FontSizes.xs, color: Colors.textMuted },
  xpValue: { fontSize: FontSizes.sm, fontWeight: 'bold', color: Colors.xpPurple },
  empty: { alignItems: 'center', paddingVertical: Spacing['4xl'], gap: Spacing.md },
  emptyText: { fontSize: FontSizes.lg, color: Colors.textMuted },
  bottomPad: { height: 100 },
});
