import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, FontSizes, Spacing } from '@/lib/theme';

interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({
  label,
  color = Colors.backgroundElevated,
  textColor = Colors.textPrimary,
  size = 'sm',
  style,
}: BadgeProps) {
  return (
    <View style={[styles.base, styles[size], { backgroundColor: color }, style]}>
      <Text style={[styles.text, styles[`text_${size}`], { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  text: {
    fontWeight: '600',
  },
  text_sm: {
    fontSize: FontSizes.xs,
  },
  text_md: {
    fontSize: FontSizes.sm,
  },
});
