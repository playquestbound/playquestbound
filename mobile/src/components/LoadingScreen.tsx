import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '@/lib/theme';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚔️</Text>
      <Text style={styles.title}>Questbound</Text>
      <ActivityIndicator size="large" color={Colors.secondary} style={styles.spinner} />
      <Text style={styles.subtitle}>Loading your adventure...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: FontSizes['3xl'],
    color: Colors.secondary,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  spinner: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
  },
});
