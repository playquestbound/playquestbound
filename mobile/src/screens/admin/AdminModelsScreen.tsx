import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '@/lib/theme';
import { Card } from '@/components/ui/Card';

export function AdminModelsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Model Management</Text>
      </View>

      <View style={styles.content}>
        <Card variant="bordered" style={styles.comingSoon}>
          <Ionicons name="cube" size={48} color={Colors.secondary} />
          <Text style={styles.comingSoonTitle}>3D Model Management</Text>
          <Text style={styles.comingSoonText}>
            Upload and manage 3D character models for each race and gender combination.
            This feature is optimized for desktop admin access.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  backButton: { padding: Spacing.sm },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.secondary },
  content: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  comingSoon: { alignItems: 'center', paddingVertical: Spacing['3xl'] },
  comingSoonTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.secondary, marginTop: Spacing.lg },
  comingSoonText: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginTop: Spacing.sm },
});
