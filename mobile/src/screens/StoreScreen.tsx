import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useProfile } from '@/hooks/useProfile';
import { formatNumber } from '@/lib/levelSystem';

const FEATURED_ITEMS = [
  { id: '1', name: 'Shadow Cloak', rarity: 'epic', goldPrice: 500, slot: 'back', description: 'A cloak woven from midnight shadows.' },
  { id: '2', name: 'Iron Boots', rarity: 'rare', goldPrice: 300, slot: 'feet', description: 'Heavy boots that echo with each step.' },
  { id: '3', name: 'Golden Crown', rarity: 'legendary', goldPrice: 1000, slot: 'head', description: 'A crown fit for a champion.' },
  { id: '4', name: 'Leather Gauntlets', rarity: 'uncommon', goldPrice: 150, slot: 'hands', description: 'Well-worn battle gauntlets.' },
];

const SUBSCRIPTION_TIERS = [
  {
    id: 'free', name: 'Free', price: '$0', features: ['1 active quest', 'Basic customization', 'Leaderboard access'],
    current: true,
  },
  {
    id: 'adventurer', name: 'Adventurer', price: '$4.99/mo',
    features: ['5 active quests', 'Exclusive cosmetics', 'Priority access', 'Ad-free experience'],
    recommended: true,
  },
  {
    id: 'legend', name: 'Legend', price: '$9.99/mo',
    features: ['Unlimited quests', 'All cosmetics', 'Early access', 'Custom quests', 'Legend badge'],
  },
];

const rarityColors: Record<string, string> = {
  common: Colors.common,
  uncommon: Colors.uncommon,
  rare: Colors.rare,
  epic: Colors.epic,
  legendary: Colors.legendary,
};

export function StoreScreen() {
  const [activeTab, setActiveTab] = useState<'items' | 'premium'>('items');
  const { data: profile } = useProfile();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Store</Text>
        <View style={styles.goldDisplay}>
          <Text style={styles.goldIcon}>🪙</Text>
          <Text style={styles.goldText}>{formatNumber(profile?.gold || 0)}</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'items' && styles.tabActive]}
          onPress={() => setActiveTab('items')}
        >
          <Text style={[styles.tabText, activeTab === 'items' && styles.tabTextActive]}>Limited Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'premium' && styles.tabActive]}
          onPress={() => setActiveTab('premium')}
        >
          <Text style={[styles.tabText, activeTab === 'premium' && styles.tabTextActive]}>Premium</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'items' ? (
          <>
            {FEATURED_ITEMS.map(item => (
              <Card key={item.id} variant="bordered" style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: rarityColors[item.rarity] }]}>{item.name}</Text>
                    <Badge
                      label={item.rarity.toUpperCase()}
                      color={`${rarityColors[item.rarity]}22`}
                      textColor={rarityColors[item.rarity]}
                      size="sm"
                    />
                  </View>
                  <View style={styles.itemPreview}>
                    <Ionicons name="diamond" size={32} color={rarityColors[item.rarity]} />
                  </View>
                </View>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.itemFooter}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceIcon}>🪙</Text>
                    <Text style={styles.priceText}>{item.goldPrice}</Text>
                  </View>
                  <Button
                    title="Purchase"
                    variant="outline"
                    size="sm"
                    onPress={() => Alert.alert('Coming Soon', 'Item purchases will be available soon!')}
                  />
                </View>
              </Card>
            ))}
          </>
        ) : (
          <>
            {SUBSCRIPTION_TIERS.map(tier => (
              <Card
                key={tier.id}
                variant={tier.recommended ? 'gold' : 'bordered'}
                style={styles.tierCard}
              >
                {tier.recommended && (
                  <Badge
                    label="RECOMMENDED"
                    color={Colors.secondary}
                    textColor={Colors.textDark}
                    size="sm"
                    style={styles.recommendedBadge}
                  />
                )}
                <Text style={styles.tierName}>{tier.name}</Text>
                <Text style={styles.tierPrice}>{tier.price}</Text>
                <View style={styles.tierFeatures}>
                  {tier.features.map(feature => (
                    <View key={feature} style={styles.featureRow}>
                      <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                {tier.current ? (
                  <Badge label="CURRENT PLAN" color={`${Colors.success}22`} textColor={Colors.success} size="md" style={styles.currentBadge} />
                ) : (
                  <Button
                    title={`Upgrade to ${tier.name}`}
                    onPress={() => Alert.alert('Coming Soon', 'Subscriptions will be available via the App Store.')}
                    fullWidth
                    variant={tier.recommended ? 'primary' : 'outline'}
                  />
                )}
              </Card>
            ))}
          </>
        )}
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.secondary },
  goldDisplay: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  goldIcon: { fontSize: 18 },
  goldText: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.gold },
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
  itemCard: { marginBottom: Spacing.md },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  itemInfo: { flex: 1, gap: Spacing.xs },
  itemName: { fontSize: FontSizes.lg, fontWeight: 'bold' },
  itemPreview: { width: 56, height: 56, backgroundColor: Colors.backgroundElevated, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  itemDescription: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceIcon: { fontSize: 16 },
  priceText: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.gold },
  tierCard: { marginBottom: Spacing.md, alignItems: 'center' },
  recommendedBadge: { marginBottom: Spacing.sm },
  tierName: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.secondary, marginBottom: Spacing.xs },
  tierPrice: { fontSize: FontSizes['3xl'], fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Spacing.lg },
  tierFeatures: { width: '100%', gap: Spacing.sm, marginBottom: Spacing.lg },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  featureText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  currentBadge: { alignSelf: 'center' },
  bottomPad: { height: 100 },
});
