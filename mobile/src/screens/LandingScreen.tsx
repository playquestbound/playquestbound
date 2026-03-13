import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '@/lib/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/integrations/supabase/client';

export function LandingScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleWaitlist = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('waitlist_emails').insert({ email: email.trim() });
      if (error) {
        if (error.code === '23505') {
          Alert.alert('Already Registered', "You're already on the waitlist!");
        } else {
          Alert.alert('Error', 'Failed to join waitlist.');
        }
      } else {
        Alert.alert('Success!', "You've been added to the waitlist.");
        setEmail('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>⚔️</Text>
          <Text style={styles.heroTitle}>Questbound</Text>
          <Text style={styles.heroSubtitle}>Turn every step into an adventure</Text>
          <Text style={styles.heroDescription}>
            Gamify your fitness journey with RPG quests, character progression, and real-world challenges.
          </Text>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('Auth' as never)}
            size="lg"
            style={styles.ctaButton}
          />
        </View>

        {/* Features */}
        <View style={styles.features}>
          {[
            { emoji: '🗡️', title: 'Quest', desc: 'Accept quests and complete real-world challenges' },
            { emoji: '⭐', title: 'Earn', desc: 'Gain XP, gold, and level up your character' },
            { emoji: '👥', title: 'Guild', desc: 'Compete on leaderboards and join the community' },
          ].map(f => (
            <Card key={f.title} variant="bordered" style={styles.featureCard}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </Card>
          ))}
        </View>

        {/* Tiers */}
        <View style={styles.tiersSection}>
          <Text style={styles.sectionTitle}>Choose Your Path</Text>
          <View style={styles.tiers}>
            <Card variant="bordered" style={styles.tierCard}>
              <Text style={styles.tierName}>Free</Text>
              <Text style={styles.tierPrice}>$0</Text>
              <Text style={styles.tierFeature}>1 active quest</Text>
              <Text style={styles.tierFeature}>Basic customization</Text>
            </Card>
            <Card variant="gold" style={styles.tierCard}>
              <Text style={styles.tierName}>Adventurer</Text>
              <Text style={styles.tierPrice}>$4.99/mo</Text>
              <Text style={styles.tierFeature}>5 active quests</Text>
              <Text style={styles.tierFeature}>Exclusive cosmetics</Text>
            </Card>
          </View>
        </View>

        {/* Waitlist */}
        <Card variant="bordered" style={styles.waitlistCard}>
          <Text style={styles.waitlistTitle}>Join the Waitlist</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button
            title="Join Waitlist"
            onPress={handleWaitlist}
            loading={submitting}
            fullWidth
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: FontSizes['5xl'],
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  ctaButton: {
    minWidth: 200,
  },
  features: {
    gap: Spacing.md,
    marginBottom: Spacing['3xl'],
  },
  featureCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  featureEmoji: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  featureDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  tiersSection: {
    marginBottom: Spacing['3xl'],
  },
  sectionTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  tiers: {
    gap: Spacing.md,
  },
  tierCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  tierName: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  tierPrice: {
    fontSize: FontSizes['3xl'],
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  tierFeature: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  waitlistCard: {
    marginBottom: Spacing['4xl'],
  },
  waitlistTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
});
