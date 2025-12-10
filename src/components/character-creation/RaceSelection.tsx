import { RACES } from '@/lib/characterData';
import { Button } from '@/components/ui/button';

interface RaceSelectionProps {
  selectedRace: string | null;
  onSelect: (raceId: string) => void;
  onContinue: () => void;
}

export function RaceSelection({ selectedRace, onSelect, onContinue }: RaceSelectionProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Choose Your Race</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your race defines your heritage
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-4">
        {RACES.map((race) => (
          <div
            key={race.id}
            onClick={() => onSelect(race.id)}
            className={`race-card flex flex-col items-center text-center p-4 ${
              selectedRace === race.id ? 'selected' : 'border-border'
            }`}
          >
            {/* Placeholder image area */}
            <div
              className="w-16 h-16 rounded-full mb-3"
              style={{ backgroundColor: race.color }}
            />
            <h3 className="font-display font-semibold text-foreground">{race.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-tight">
              {race.description}
            </p>
          </div>
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
