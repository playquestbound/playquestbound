import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRunTracker } from '@/hooks/useRunTracker';

export function RunTrackerScreen() {
  const navigation = useNavigation();
  const {
    isRunning, isPaused, distance, duration, currentPosition, locationError,
    startTracking, pauseTracking, resumeTracking, stopTracking,
  } = useRunTracker();

  const distanceKm = distance / 1000;
  const pace = duration > 0 && distanceKm > 0 ? duration / 60 / distanceKm : 0;
  const estimatedXp = Math.floor(distanceKm * 100);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Run Tracker</Text>
        <View style={styles.headerRight}>
          {currentPosition && (
            <View style={styles.gpsIndicator}>
              <Ionicons name="location" size={14} color={Colors.success} />
              <Text style={styles.gpsText}>GPS</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {/* Main Stats */}
        <View style={styles.mainStats}>
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceValue}>{distanceKm.toFixed(2)}</Text>
            <Text style={styles.distanceUnit}>km</Text>
          </View>
          <Text style={styles.durationText}>{formatDuration(duration)}</Text>
        </View>

        {/* Secondary Stats */}
        <View style={styles.secondaryStats}>
          <Card variant="bordered" style={styles.statCard}>
            <Ionicons name="speedometer" size={24} color={Colors.secondary} />
            <Text style={styles.statValue}>{pace > 0 ? pace.toFixed(1) : '--'}</Text>
            <Text style={styles.statLabel}>min/km</Text>
          </Card>
          <Card variant="bordered" style={styles.statCard}>
            <Ionicons name="star" size={24} color={Colors.xpPurple} />
            <Text style={[styles.statValue, { color: Colors.xpPurple }]}>+{estimatedXp}</Text>
            <Text style={styles.statLabel}>XP earned</Text>
          </Card>
        </View>

        {locationError && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={20} color={Colors.error} />
            <Text style={styles.errorText}>{locationError}</Text>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          {!isRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={startTracking}>
              <Ionicons name="play" size={40} color={Colors.textDark} />
            </TouchableOpacity>
          ) : (
            <View style={styles.activeControls}>
              {isPaused ? (
                <TouchableOpacity style={styles.resumeButton} onPress={resumeTracking}>
                  <Ionicons name="play" size={32} color={Colors.textDark} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.pauseButton} onPress={pauseTracking}>
                  <Ionicons name="pause" size={32} color={Colors.secondary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.stopButton} onPress={stopTracking}>
                <Ionicons name="stop" size={32} color={Colors.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },
  backButton: { padding: Spacing.sm },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.secondary },
  headerRight: { width: 60, alignItems: 'flex-end' },
  gpsIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  gpsText: { fontSize: FontSizes.xs, color: Colors.success, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: Spacing.xl, justifyContent: 'center' },
  mainStats: { alignItems: 'center', marginBottom: Spacing['3xl'] },
  distanceContainer: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm },
  distanceValue: { fontSize: 72, fontWeight: 'bold', color: Colors.textPrimary },
  distanceUnit: { fontSize: FontSizes['2xl'], color: Colors.textMuted },
  durationText: { fontSize: FontSizes['3xl'], color: Colors.secondary, fontWeight: '600', marginTop: Spacing.sm },
  secondaryStats: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing['3xl'] },
  statCard: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  statValue: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.textPrimary },
  statLabel: { fontSize: FontSizes.xs, color: Colors.textMuted },
  errorContainer: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: `${Colors.error}22`, borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.xl,
  },
  errorText: { fontSize: FontSizes.sm, color: Colors.error, flex: 1 },
  controls: { alignItems: 'center' },
  startButton: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center',
    ...Shadows.lg,
  },
  activeControls: { flexDirection: 'row', gap: Spacing.xl },
  pauseButton: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: `${Colors.secondary}22`, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.secondary,
  },
  resumeButton: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center',
    ...Shadows.md,
  },
  stopButton: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.destructive, justifyContent: 'center', alignItems: 'center',
    ...Shadows.md,
  },
});
