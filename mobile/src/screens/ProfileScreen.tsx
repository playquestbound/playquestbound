import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { CharacterDisplay } from '@/components/profile/CharacterDisplay';
import { useProfile } from '@/hooks/useProfile';
import { useActiveTitle } from '@/hooks/useTitles';
import { useCompletedQuests } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdminQuests';
import { getXpProgress, formatNumber } from '@/lib/levelSystem';
import { getRaceName } from '@/lib/races';
import { CLASSES } from '@/lib/characterData';

export function ProfileScreen() {
  const navigation = useNavigation();
  const { data: profile } = useProfile();
  const { data: activeTitle } = useActiveTitle();
  const { data: completedQuests } = useCompletedQuests();
  const { data: isAdmin } = useIsAdmin();
  const { signOut } = useAuth();

  if (!profile) return null;

  const xpProgress = getXpProgress(profile.xp, profile.level);
  const classData = CLASSES.find(c => c.id === profile.class);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Character Card */}
        <Card variant="gold" style={styles.characterCard}>
          <View style={styles.characterHeader}>
            <CharacterDisplay
              race={profile.race}
              characterClass={profile.class}
              customization={profile.customization as Record<string, string> | null}
              size="lg"
            />
            <View style={styles.levelGem}>
              <Text style={styles.levelText}>{profile.level}</Text>
            </View>
          </View>

          <Text style={styles.characterName}>{profile.character_name || 'Adventurer'}</Text>
          {activeTitle && <Text style={styles.titleText}>{activeTitle}</Text>}

          <View style={styles.raceClassRow}>
            <Text style={styles.raceText}>{getRaceName(profile.race || 'human')}</Text>
            {classData && (
              <>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.classText}>{classData.icon} {classData.name}</Text>
              </>
            )}
          </View>

          {/* XP Bar */}
          <View style={styles.xpSection}>
            <View style={styles.xpBarBg}>
              <View style={[styles.xpBarFill, { width: `${xpProgress.percentage}%` }]} />
            </View>
            <Text style={styles.xpLabel}>
              {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.required)} XP
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{completedQuests?.length || 0}</Text>
              <Text style={styles.statLabel}>Quests</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatNumber(profile.xp)}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatNumber(profile.gold)}</Text>
              <Text style={styles.statLabel}>Gold</Text>
            </View>
          </View>
        </Card>

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          {[
            { icon: 'book' as const, label: 'Journal', screen: 'Journal' },
            { icon: 'trophy' as const, label: 'Leaderboard', screen: 'Leaderboard' },
            { icon: 'settings' as const, label: 'Settings', screen: 'Settings' },
            { icon: 'search' as const, label: 'Find Players', screen: 'SearchPlayers' },
          ].map(item => (
            <TouchableOpacity
              key={item.screen}
              style={styles.navButton}
              onPress={() => {
                if (item.screen === 'Journal' || item.screen === 'Leaderboard') {
                  // These could be separate tab screens
                  navigation.navigate(item.screen as never);
                } else {
                  navigation.navigate(item.screen as never);
                }
              }}
            >
              <Ionicons name={item.icon} size={22} color={Colors.secondary} />
              <Text style={styles.navButtonText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('CharacterCreation' as never, { editMode: true })}
          >
            <Ionicons name="create" size={22} color={Colors.secondary} />
            <Text style={styles.navButtonText}>Edit Character</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          {isAdmin && (
            <>
              <View style={styles.adminDivider}>
                <Text style={styles.adminLabel}>ADMIN</Text>
              </View>
              {[
                { icon: 'shield' as const, label: 'Quest Management', screen: 'AdminQuests' },
                { icon: 'document-text' as const, label: 'Submissions', screen: 'AdminSubmissions' },
                { icon: 'cube' as const, label: 'Models', screen: 'AdminModels' },
              ].map(item => (
                <TouchableOpacity
                  key={item.screen}
                  style={styles.navButton}
                  onPress={() => navigation.navigate(item.screen as never)}
                >
                  <Ionicons name={item.icon} size={22} color={Colors.error} />
                  <Text style={styles.navButtonText}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Ionicons name="log-out" size={20} color={Colors.destructive} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.xl },
  characterCard: { alignItems: 'center', marginBottom: Spacing.xl },
  characterHeader: { position: 'relative', marginBottom: Spacing.lg },
  levelGem: {
    position: 'absolute', bottom: -8, right: -8,
    backgroundColor: Colors.xpPurple, width: 36, height: 36,
    borderRadius: 18, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.background,
  },
  levelText: { fontSize: FontSizes.sm, fontWeight: 'bold', color: Colors.white },
  characterName: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.secondary, marginBottom: 2 },
  titleText: { fontSize: FontSizes.sm, color: Colors.textMuted, fontStyle: 'italic', marginBottom: Spacing.sm },
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
  navButtons: { gap: Spacing.sm, marginBottom: Spacing.xl },
  navButton: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.md,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
  },
  navButtonText: { fontSize: FontSizes.md, color: Colors.textPrimary, flex: 1 },
  adminDivider: { paddingVertical: Spacing.sm },
  adminLabel: { fontSize: FontSizes.xs, fontWeight: 'bold', color: Colors.error, letterSpacing: 2 },
  signOutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  signOutText: { fontSize: FontSizes.md, color: Colors.destructive },
  bottomPad: { height: 100 },
});
