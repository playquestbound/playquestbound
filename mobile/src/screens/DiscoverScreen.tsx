import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/lib/theme';
import { Card } from '@/components/ui/Card';

export function DiscoverScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      <View style={styles.content}>
        <Card variant="bordered" style={styles.comingSoonCard}>
          <Ionicons name="compass" size={64} color={Colors.secondary} />
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonSubtitle}>
            Explore the world map to discover hidden locations, collect regional badges, and find nearby unlockables.
          </Text>

          <View style={styles.featuresList}>
            {[
              { icon: 'map' as const, text: 'Interactive world map with quest locations' },
              { icon: 'location' as const, text: 'Nearby unlockables based on your location' },
              { icon: 'ribbon' as const, text: 'Regional collections and badges' },
              { icon: 'telescope' as const, text: 'Discover hidden locations and secrets' },
            ].map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Ionicons name={feature.icon} size={20} color={Colors.secondary} />
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  headerTitle: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.secondary },
  content: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  comingSoonCard: { alignItems: 'center', paddingVertical: Spacing['3xl'] },
  comingSoonTitle: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.secondary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  comingSoonSubtitle: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  featuresList: { width: '100%', gap: Spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureText: { fontSize: FontSizes.sm, color: Colors.textSecondary, flex: 1 },
});
