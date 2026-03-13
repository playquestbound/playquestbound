import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export function SettingsScreen() {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [publicJournal, setPublicJournal] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="bordered" style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDesc}>Receive quest updates and reminders</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
              thumbColor={Colors.white}
            />
          </View>
        </Card>

        <Card variant="bordered" style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Public Journal</Text>
              <Text style={styles.settingDesc}>Allow others to see your journal entries</Text>
            </View>
            <Switch
              value={publicJournal}
              onValueChange={setPublicJournal}
              trackColor={{ false: Colors.border, true: Colors.secondary }}
              thumbColor={Colors.white}
            />
          </View>
        </Card>

        <Card variant="bordered" style={styles.section}>
          <Text style={styles.sectionTitle}>Integrations</Text>
          {['Apple Fitness', 'Strava', 'Whoop'].map(name => (
            <TouchableOpacity key={name} style={styles.integrationRow}>
              <Text style={styles.integrationName}>{name}</Text>
              <View style={styles.integrationStatus}>
                <Text style={styles.integrationStatusText}>Connect</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        <Card variant="bordered" style={[styles.section, styles.dangerSection]}>
          <Text style={[styles.sectionTitle, { color: Colors.destructive }]}>Danger Zone</Text>
          <Button
            title="Delete Account"
            variant="destructive"
            onPress={() => Alert.alert(
              'Delete Account?',
              'This action cannot be undone. All your data will be permanently deleted.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Contact Support', 'Please contact support to delete your account.') },
              ]
            )}
            fullWidth
          />
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
  scrollContent: { padding: Spacing.xl, gap: Spacing.lg },
  section: { gap: Spacing.md },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.secondary },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingInfo: { flex: 1, marginRight: Spacing.md },
  settingLabel: { fontSize: FontSizes.md, color: Colors.textPrimary, fontWeight: '500' },
  settingDesc: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  integrationRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  integrationName: { fontSize: FontSizes.md, color: Colors.textPrimary },
  integrationStatus: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  integrationStatusText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  dangerSection: { borderColor: Colors.destructive },
});
