import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { CharacterDisplay } from '@/components/profile/CharacterDisplay';
import { supabase } from '@/integrations/supabase/client';
import { getXpProgress, formatNumber } from '@/lib/levelSystem';
import { getRaceName } from '@/lib/races';
import { CLASSES } from '@/lib/characterData';

export function PlayerProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const playerId = route.params?.playerId;

  const { data: profile, isLoading } = useQuery({
    queryKey: ['player-profile', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_profiles')
        .select('*')
        .eq('id', playerId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });

  const { data: completedCount } = useQuery({
    queryKey: ['player-quests-count', playerId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_quests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', playerId)
        .eq('status', 'completed');
      if (error) throw error;
      return count || 0;
    },
    enabled: !!playerId,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.secondary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!profile) return null;

  const xpProgress = getXpProgress(profile.xp || 0, profile.level || 1);
  const classData = CLASSES.find(c => c.id === profile.class);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Player Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="gold" style={styles.characterCard}>
          <CharacterDisplay race={profile.race} characterClass={profile.class} size="lg" />
          <Text style={styles.characterName}>{profile.character_name || 'Unknown'}</Text>
          <View style={styles.raceClassRow}>
            <Text style={styles.raceText}>{getRaceName(profile.race || 'human')}</Text>
            {classData && (
              <>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.classText}>{classData.icon} {classData.name}</Text>
              </>
            )}
          </View>
          <View style={styles.xpSection}>
            <View style={styles.xpBarBg}>
              <View style={[styles.xpBarFill, { width: `${xpProgress.percentage}%` }]} />
            </View>
            <Text style={styles.xpLabel}>Level {profile.level}</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{completedCount || 0}</Text>
              <Text style={styles.statLabel}>Quests</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatNumber(profile.xp || 0)}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.level || 1}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  backButton: { padding: Spacing.sm },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.secondary },
  scrollContent: { padding: Spacing.xl },
  characterCard: { alignItems: 'center' },
  characterName: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.secondary, marginTop: Spacing.lg, marginBottom: 4 },
  raceClassRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  raceText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  separator: { color: Colors.textMuted },
  classText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  xpSection: { width: '100%', marginBottom: Spacing.lg },
  xpBarBg: { height: 8, backgroundColor: `${Colors.xpPurple}22`, borderRadius: BorderRadius.full, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: Colors.xpPurple, borderRadius: BorderRadius.full },
  xpLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, textAlign: 'center', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.textPrimary },
  statLabel: { fontSize: FontSizes.xs, color: Colors.textMuted },
});
