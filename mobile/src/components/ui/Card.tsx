import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '@/lib/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'bordered' | 'gold';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: Colors.backgroundCard,
    ...Shadows.sm,
  },
  elevated: {
    backgroundColor: Colors.backgroundElevated,
    ...Shadows.md,
  },
  bordered: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gold: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.secondary,
    ...Shadows.gold,
  },
});
