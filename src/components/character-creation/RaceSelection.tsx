import { useState } from 'react';
import { RACES, Gender } from '@/lib/races';
import { Button } from '@/components/ui/button';
import { RacePreview3D } from '@/components/3d/RacePreview3D';
import { cn } from '@/lib/utils';

interface RaceSelectionProps {
  selectedRace: string | null;
  onSelect: (raceId: string) => void;
  onContinue: () => void;
  selectedGender?: Gender;
  onGenderSelect?: (gender: Gender) => void;
}

export function RaceSelection({ 
  selectedRace, 
  onSelect, 
  onContinue,
  selectedGender = 'male',
  onGenderSelect 
}: RaceSelectionProps) {
  const [gender, setGender] = useState<Gender>(selectedGender);
  
  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    onGenderSelect?.(newGender);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Choose Your Race</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your race defines your heritage
        </p>
      </div>
      
      {/* Gender Selection */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => handleGenderChange('male')}
          className={cn(
            "px-6 py-2 rounded-lg font-medium transition-all duration-200",
            gender === 'male' 
              ? "bg-secondary text-secondary-foreground ring-2 ring-secondary" 
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          ♂ Boy
        </button>
        <button
          onClick={() => handleGenderChange('female')}
          className={cn(
            "px-6 py-2 rounded-lg font-medium transition-all duration-200",
            gender === 'female' 
              ? "bg-secondary text-secondary-foreground ring-2 ring-secondary" 
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          ♀ Girl
        </button>
      </div>
      
      {/* 3D Preview */}
      <div className="relative bg-gradient-to-b from-background to-muted/20 rounded-xl border border-border/50 mb-4 overflow-hidden">
        <RacePreview3D 
          raceId={selectedRace} 
          gender={gender}
          className="w-full h-48"
        />
        {selectedRace && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full">
            <span className="font-display text-sm font-semibold text-foreground">
              {RACES.find(r => r.id === selectedRace)?.name}
            </span>
          </div>
        )}
      </div>

      {/* Race Grid */}
      <div className="grid grid-cols-4 gap-2 flex-1 overflow-y-auto pb-4">
        {RACES.map((race) => (
          <button
            key={race.id}
            onClick={() => onSelect(race.id)}
            className={cn(
              "flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all duration-200",
              selectedRace === race.id 
                ? "border-secondary bg-secondary/10 scale-105" 
                : "border-border/50 bg-card/50 hover:border-secondary/50 hover:bg-card"
            )}
          >
            <span className="text-2xl mb-1">{race.emoji}</span>
            <span className="font-display text-xs font-semibold text-foreground">{race.name}</span>
          </button>
        ))}
      </div>

      <Button
        variant="gold"
        size="lg"
        className="w-full mt-4"
        disabled={!selectedRace}
        onClick={onContinue}
      >
        Continue
      </Button>
    </div>
  );
}
