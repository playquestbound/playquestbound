import { useState } from 'react';
import { RACES, Gender } from '@/lib/races';
import { SchematicButton } from '@/components/ui/SchematicButton';
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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header - compact */}
      <div className="text-center py-2 flex-shrink-0">
        <h1 className="font-display text-xl font-bold text-foreground">Choose Your Race</h1>
      </div>
      
      {/* Gender Selection - compact */}
      <div className="flex justify-center gap-3 py-2 flex-shrink-0">
        <button
          onClick={() => handleGenderChange('male')}
          className={cn(
            "px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
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
            "px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
            gender === 'female' 
              ? "bg-secondary text-secondary-foreground ring-2 ring-secondary" 
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          ♀ Girl
        </button>
      </div>
      
      {/* 3D Preview - takes most of the space */}
      <div className="relative flex-1 min-h-0 bg-gradient-to-b from-background to-muted/20 rounded-2xl border border-border/50 overflow-hidden">
        <RacePreview3D 
          raceId={selectedRace} 
          gender={gender}
          className="w-full h-full"
        />
        {selectedRace && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-background/80 backdrop-blur-sm rounded-full">
            <span className="font-display text-sm font-semibold text-foreground">
              {RACES.find(r => r.id === selectedRace)?.name}
            </span>
          </div>
        )}
      </div>

      {/* Race Grid - fixed height */}
      <div className="grid grid-cols-4 gap-2 py-3 flex-shrink-0">
        {RACES.map((race) => (
          <button
            key={race.id}
            onClick={() => onSelect(race.id)}
            className={cn(
              "flex flex-col items-center text-center p-2 rounded-xl border-2 transition-all duration-200",
              selectedRace === race.id 
                ? "border-secondary bg-secondary/10 scale-105" 
                : "border-border/50 bg-card/50 active:scale-95"
            )}
          >
            <span className="text-xl">{race.emoji}</span>
            <span className="font-display text-[10px] font-semibold text-foreground">{race.name}</span>
          </button>
        ))}
      </div>

      {/* Continue Button - fixed at bottom */}
      <div className="flex-shrink-0 flex justify-center px-8">
        <SchematicButton
          size="lg"
          className="w-full"
          disabled={!selectedRace}
          onClick={onContinue}
        >
          Continue
        </SchematicButton>
      </div>
    </div>
  );
}
