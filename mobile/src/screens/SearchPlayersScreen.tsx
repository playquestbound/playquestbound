import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/lib/theme';
import { supabase } from '@/integrations/supabase/client';
import { getRaceEmoji } from '@/lib/races';

export function SearchPlayersScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setSearch(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('public_profiles')
        .select('*')
        .ilike('character_name', `%${text}%`)
        .limit(20);

      if (!error) setResults(data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Players</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by character name..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={item => item.id || ''}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.playerRow}
            onPress={() => navigation.navigate('PlayerProfile' as never, { playerId: item.id } as never)}
          >
            <Text style={styles.raceEmoji}>{getRaceEmoji(item.race || 'human')}</Text>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{item.character_name || 'Unknown'}</Text>
              <Text style={styles.playerLevel}>Level {item.level} | {item.xp} XP</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          search.length >= 2 && !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No players found</Text>
            </View>
          ) : null
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
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.inputBackground, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, marginHorizontal: Spacing.xl, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: { flex: 1, paddingVertical: Spacing.md, fontSize: FontSizes.md, color: Colors.textPrimary },
  listContent: { paddingHorizontal: Spacing.xl },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.md,
    padding: Spacing.lg, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  raceEmoji: { fontSize: 28 },
  playerInfo: { flex: 1 },
  playerName: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary },
  playerLevel: { fontSize: FontSizes.xs, color: Colors.textMuted },
  empty: { alignItems: 'center', paddingVertical: Spacing['4xl'] },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted },
});
