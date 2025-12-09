import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCharacter } from '@/hooks/useProfile';
import { RaceSelector } from '@/components/RaceSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function CharacterCreation() {
  const [characterName, setCharacterName] = useState('');
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const createCharacter = useCreateCharacter();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!characterName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter a character name.',
        variant: 'destructive',
      });
      return;
    }

    if (characterName.length < 3 || characterName.length > 20) {
      toast({
        title: 'Invalid Name',
        description: 'Character name must be 3-20 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedRace) {
      toast({
        title: 'Race Required',
        description: 'Please choose your race.',
        variant: 'destructive',
      });
      return;
    }

    // Check name uniqueness
    setIsChecking(true);
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('character_name', characterName.trim())
        .maybeSingle();

      if (existing) {
        toast({
          title: 'Name Taken',
          description: 'This character name is already in use. Choose another.',
          variant: 'destructive',
        });
        setIsChecking(false);
        return;
      }

      await createCharacter.mutateAsync({
        characterName: characterName.trim(),
        race: selectedRace,
      });

      toast({
        title: 'Character Created!',
        description: 'Your adventure begins now!',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create character. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const isLoading = isChecking || createCharacter.isPending;

  return (
    <div className="min-h-screen flex flex-col p-4 bg-background">
      {/* Header */}
      <div className="text-center py-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="font-display text-2xl font-bold">Create Your Character</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Choose wisely, adventurer
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Character Name */}
        <div className="parchment-card p-4 mb-4">
          <label className="font-display font-semibold text-sm mb-2 block">
            Character Name
          </label>
          <Input
            placeholder="Enter your name..."
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            maxLength={20}
          />
          <p className="text-xs text-muted-foreground mt-1">
            3-20 characters, must be unique
          </p>
        </div>

        {/* Race Selection */}
        <div className="parchment-card p-4 mb-4 flex-1">
          <label className="font-display font-semibold text-sm mb-3 block">
            Choose Your Race
          </label>
          <RaceSelector
            selectedRace={selectedRace}
            onSelect={setSelectedRace}
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full"
          disabled={isLoading || !characterName || !selectedRace}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Begin Your Journey'
          )}
        </Button>
      </form>
    </div>
  );
}
