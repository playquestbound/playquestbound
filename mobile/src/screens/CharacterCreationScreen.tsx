import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '@/lib/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CharacterDisplay } from '@/components/profile/CharacterDisplay';
import { useCreateCharacter } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { RACES, CLASSES, SKIN_TONES, HAIR_COLORS, EYE_COLORS, DEFAULT_CUSTOMIZATION } from '@/lib/characterData';
import type { Gender } from '@/lib/races';

type Step = 'race' | 'class' | 'name' | 'review';

export function CharacterCreationScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const editMode = route.params?.editMode;
  const createCharacter = useCreateCharacter();

  const [step, setStep] = useState<Step>('race');
  const [gender, setGender] = useState<Gender>('male');
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [nameError, setNameError] = useState('');
  const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);

  const steps: Step[] = ['race', 'class', 'name', 'review'];
  const currentStepIndex = steps.indexOf(step);

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) setStep(steps[nextIndex]);
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    } else if (editMode) {
      navigation.goBack();
    }
  };

  const checkNameUnique = async (name: string) => {
    if (name.length < 3) {
      setNameError('Name must be at least 3 characters');
      return false;
    }
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .ilike('character_name', name)
      .maybeSingle();
    if (data) {
      setNameError('This name is already taken');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleSubmit = async () => {
    try {
      await createCharacter.mutateAsync({
        characterName,
        race: selectedRace,
        characterClass: selectedClass,
        customization,
      });
      if (editMode) {
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create character');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((s, i) => (
        <View
          key={s}
          style={[styles.stepDot, i <= currentStepIndex && styles.stepDotActive]}
        />
      ))}
    </View>
  );

  const renderRaceStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Choose Your Race</Text>

      <View style={styles.genderToggle}>
        {(['male', 'female'] as Gender[]).map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.genderButton, gender === g && styles.genderButtonActive]}
            onPress={() => setGender(g)}
          >
            <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
              {g === 'male' ? '♂ Male' : '♀ Female'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.raceGrid}>
        {RACES.map(race => (
          <TouchableOpacity
            key={race.id}
            style={[
              styles.raceCard,
              { borderColor: race.color },
              selectedRace === race.id && styles.raceCardSelected,
            ]}
            onPress={() => setSelectedRace(race.id)}
          >
            <Text style={styles.raceEmoji}>
              {race.id === 'human' ? '⚔️' : race.id === 'elf' ? '🌙' : race.id === 'dwarf' ? '⛏️' : race.id === 'orc' ? '🐺' : '🍃'}
            </Text>
            <Text style={styles.raceName}>{race.name}</Text>
            <Text style={styles.raceDesc} numberOfLines={2}>{race.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Continue"
        onPress={goNext}
        disabled={!selectedRace}
        fullWidth
        size="lg"
      />
    </View>
  );

  const renderClassStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Choose Your Class</Text>

      <View style={styles.classGrid}>
        {CLASSES.map(cls => (
          <TouchableOpacity
            key={cls.id}
            style={[styles.classCard, selectedClass === cls.id && styles.classCardSelected]}
            onPress={() => setSelectedClass(cls.id)}
          >
            <Text style={styles.classIcon}>{cls.icon}</Text>
            <Text style={styles.className}>{cls.name}</Text>
            <Text style={styles.classDesc} numberOfLines={2}>{cls.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Continue"
        onPress={goNext}
        disabled={!selectedClass}
        fullWidth
        size="lg"
      />
    </View>
  );

  const renderNameStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Name Your Character</Text>

      <View style={styles.nameInputContainer}>
        <TextInput
          style={[styles.nameInput, nameError ? styles.nameInputError : null]}
          placeholder="Enter character name..."
          placeholderTextColor={Colors.textMuted}
          value={characterName}
          onChangeText={(text) => {
            setCharacterName(text);
            setNameError('');
          }}
          onBlur={() => characterName && checkNameUnique(characterName)}
          maxLength={20}
          autoCapitalize="words"
        />
        {nameError ? (
          <Text style={styles.nameError}>{nameError}</Text>
        ) : characterName.length >= 3 ? (
          <Text style={styles.nameSuccess}>Name available!</Text>
        ) : null}
      </View>

      {/* Appearance Customization */}
      <Text style={styles.subsectionTitle}>Skin Tone</Text>
      <View style={styles.colorRow}>
        {SKIN_TONES.map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorDot, { backgroundColor: color }, customization.skinTone === color && styles.colorDotSelected]}
            onPress={() => setCustomization({ ...customization, skinTone: color })}
          />
        ))}
      </View>

      <Text style={styles.subsectionTitle}>Hair Color</Text>
      <View style={styles.colorRow}>
        {HAIR_COLORS.map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorDot, { backgroundColor: color }, customization.hairColor === color && styles.colorDotSelected]}
            onPress={() => setCustomization({ ...customization, hairColor: color })}
          />
        ))}
      </View>

      <Text style={styles.subsectionTitle}>Eye Color</Text>
      <View style={styles.colorRow}>
        {EYE_COLORS.map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorDot, { backgroundColor: color }, customization.eyeColor === color && styles.colorDotSelected]}
            onPress={() => setCustomization({ ...customization, eyeColor: color })}
          />
        ))}
      </View>

      <Button
        title="Continue"
        onPress={async () => {
          if (characterName.length < 3) {
            setNameError('Name must be at least 3 characters');
            return;
          }
          const unique = await checkNameUnique(characterName);
          if (unique) goNext();
        }}
        disabled={characterName.length < 3}
        fullWidth
        size="lg"
        style={{ marginTop: Spacing.lg }}
      />
    </View>
  );

  const renderReviewStep = () => {
    const raceData = RACES.find(r => r.id === selectedRace);
    const classData = CLASSES.find(c => c.id === selectedClass);

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Review Your Character</Text>

        <Card variant="gold" style={styles.reviewCard}>
          <CharacterDisplay race={selectedRace} characterClass={selectedClass} customization={customization} size="lg" />
          <Text style={styles.reviewName}>{characterName}</Text>
          <Text style={styles.reviewInfo}>{raceData?.name} {classData?.icon} {classData?.name}</Text>

          <View style={styles.reviewStats}>
            <View style={styles.reviewStat}>
              <Text style={styles.reviewStatValue}>1</Text>
              <Text style={styles.reviewStatLabel}>Level</Text>
            </View>
            <View style={styles.reviewStat}>
              <Text style={styles.reviewStatValue}>0</Text>
              <Text style={styles.reviewStatLabel}>XP</Text>
            </View>
            <View style={styles.reviewStat}>
              <Text style={styles.reviewStatValue}>0</Text>
              <Text style={styles.reviewStatLabel}>Gold</Text>
            </View>
          </View>
        </Card>

        <Button
          title={editMode ? 'Save Changes' : 'Begin Adventure!'}
          onPress={handleSubmit}
          loading={createCharacter.isPending}
          fullWidth
          size="lg"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {(currentStepIndex > 0 || editMode) && (
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {editMode ? 'Edit Character' : 'Create Character'}
        </Text>
      </View>

      {renderStepIndicator()}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 'race' && renderRaceStep()}
        {step === 'class' && renderClassStep()}
        {step === 'name' && renderNameStep()}
        {step === 'review' && renderReviewStep()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  backButton: { padding: Spacing.sm },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.secondary },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.border },
  stepDotActive: { backgroundColor: Colors.secondary },
  scrollContent: { padding: Spacing.xl, paddingBottom: Spacing['5xl'] },
  stepContent: { gap: Spacing.lg },
  stepTitle: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.secondary, textAlign: 'center' },
  genderToggle: { flexDirection: 'row', gap: Spacing.sm },
  genderButton: {
    flex: 1, paddingVertical: Spacing.md, alignItems: 'center',
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
  },
  genderButtonActive: { borderColor: Colors.secondary, backgroundColor: `${Colors.secondary}22` },
  genderText: { fontSize: FontSizes.md, color: Colors.textMuted },
  genderTextActive: { color: Colors.secondary, fontWeight: '600' },
  raceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  raceCard: {
    width: '47%', backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, borderWidth: 2, alignItems: 'center', gap: Spacing.xs,
  },
  raceCardSelected: { backgroundColor: `${Colors.secondary}11` },
  raceEmoji: { fontSize: 36 },
  raceName: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.textPrimary },
  raceDesc: { fontSize: FontSizes.xs, color: Colors.textMuted, textAlign: 'center' },
  classGrid: { gap: Spacing.md },
  classCard: {
    backgroundColor: Colors.backgroundCard, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, borderWidth: 2, borderColor: Colors.border,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  classCardSelected: { borderColor: Colors.secondary, backgroundColor: `${Colors.secondary}11` },
  classIcon: { fontSize: 32 },
  className: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.textPrimary },
  classDesc: { fontSize: FontSizes.xs, color: Colors.textMuted, flex: 1 },
  nameInputContainer: { gap: Spacing.xs },
  nameInput: {
    backgroundColor: Colors.inputBackground, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg,
    fontSize: FontSizes.xl, color: Colors.textPrimary, textAlign: 'center',
  },
  nameInputError: { borderColor: Colors.destructive },
  nameError: { fontSize: FontSizes.xs, color: Colors.destructive, textAlign: 'center' },
  nameSuccess: { fontSize: FontSizes.xs, color: Colors.success, textAlign: 'center' },
  subsectionTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textSecondary, marginTop: Spacing.sm },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  colorDot: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: 'transparent',
  },
  colorDotSelected: { borderColor: Colors.secondary, borderWidth: 3 },
  reviewCard: { alignItems: 'center', marginBottom: Spacing.lg },
  reviewName: { fontSize: FontSizes['2xl'], fontWeight: 'bold', color: Colors.secondary, marginTop: Spacing.lg },
  reviewInfo: { fontSize: FontSizes.md, color: Colors.textSecondary, marginTop: Spacing.xs },
  reviewStats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: Spacing.xl },
  reviewStat: { alignItems: 'center' },
  reviewStatValue: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.textPrimary },
  reviewStatLabel: { fontSize: FontSizes.xs, color: Colors.textMuted },
});
