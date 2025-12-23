import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import type { Json } from '@/integrations/supabase/types';
import { Gender } from '@/lib/races';

import { ProgressIndicator } from '@/components/character-creation/ProgressIndicator';
import { RaceSelection } from '@/components/character-creation/RaceSelection';
import { ClassSelection } from '@/components/character-creation/ClassSelection';
import { AppearanceCustomization } from '@/components/character-creation/AppearanceCustomization';
import { NameSelection } from '@/components/character-creation/NameSelection';
import { ReviewConfirm } from '@/components/character-creation/ReviewConfirm';
import { DEFAULT_CUSTOMIZATION, CharacterCustomization } from '@/lib/characterData';

const TOTAL_STEPS = 5;

export default function CharacterCreation() {
  const { data: profile } = useProfile();
  const isEditMode = profile?.has_created_character === true;
  
  const [step, setStep] = useState(1);
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender>('male');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [customization, setCustomization] = useState<CharacterCustomization>(DEFAULT_CUSTOMIZATION);
  const [characterName, setCharacterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Pre-populate with existing data in edit mode
  useEffect(() => {
    if (profile && !initialized) {
      if (profile.race) setSelectedRace(profile.race);
      if (profile.class) setSelectedClass(profile.class);
      if (profile.character_name) setCharacterName(profile.character_name);
      if (profile.customization) {
        setCustomization(profile.customization as CharacterCustomization);
      }
      setInitialized(true);
    }
  }, [profile, initialized]);

  const handleSubmit = async () => {
    if (!user || !selectedRace || !selectedClass || !characterName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all steps.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check name uniqueness (skip if name unchanged in edit mode)
      const nameChanged = !isEditMode || characterName.trim() !== profile?.character_name;
      
      if (nameChanged) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('character_name', characterName.trim())
          .neq('id', user.id);

        if (existing && existing.length > 0) {
          toast({
            title: 'Name Taken',
            description: 'This name was just claimed. Please choose another.',
            variant: 'destructive',
          });
          setStep(4);
          setIsSubmitting(false);
          return;
        }
      }

      // Save character data
      const { error } = await supabase
        .from('profiles')
        .update({
          character_name: characterName.trim(),
          race: selectedRace,
          class: selectedClass,
          customization: customization as unknown as Json,
          has_created_character: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Invalidate and refetch profile before navigating
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      await queryClient.refetchQueries({ queryKey: ['profile'] });

      toast({
        title: isEditMode ? 'Character Updated!' : 'Character Created!',
        description: isEditMode 
          ? `${characterName}'s changes have been saved.`
          : `Welcome, ${characterName}! Your adventure begins now.`,
      });

      navigate(isEditMode ? '/profile' : '/', { replace: true });
    } catch (error) {
      console.error('Failed to save character:', error);
      toast({
        title: 'Error',
        description: 'Failed to save character. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep = (newStep: number) => {
    if (newStep >= 1 && newStep <= TOTAL_STEPS) {
      setStep(newStep);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProgressIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

      <div className="flex-1 p-4 max-w-md mx-auto w-full flex flex-col">
        {step === 1 && (
          <RaceSelection
            selectedRace={selectedRace}
            onSelect={setSelectedRace}
            onContinue={() => goToStep(2)}
            selectedGender={selectedGender}
            onGenderSelect={setSelectedGender}
          />
        )}

        {step === 2 && (
          <ClassSelection
            selectedClass={selectedClass}
            onSelect={setSelectedClass}
            onContinue={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        )}

        {step === 3 && (
          <AppearanceCustomization
            customization={customization}
            onChange={setCustomization}
            onContinue={() => goToStep(4)}
            onBack={() => goToStep(2)}
          />
        )}

        {step === 4 && (
          <NameSelection
            name={characterName}
            onNameChange={setCharacterName}
            onContinue={() => goToStep(5)}
            onBack={() => goToStep(3)}
          />
        )}

        {step === 5 && selectedRace && selectedClass && (
          <ReviewConfirm
            name={characterName}
            raceId={selectedRace}
            classId={selectedClass}
            customization={customization}
            onConfirm={handleSubmit}
            onBack={() => goToStep(4)}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
