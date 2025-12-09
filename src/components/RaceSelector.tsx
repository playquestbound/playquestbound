import { RACES, Race } from '@/lib/races';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface RaceSelectorProps {
  selectedRace: string | null;
  onSelect: (raceId: string) => void;
}

export function RaceSelector({ selectedRace, onSelect }: RaceSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {RACES.map((race) => (
        <button
          key={race.id}
          onClick={() => onSelect(race.id)}
          className={cn(
            "race-card text-left",
            selectedRace === race.id && "selected"
          )}
        >
          {selectedRace === race.id && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
              <Check className="w-3 h-3 text-secondary-foreground" />
            </div>
          )}
          
          <div className="text-3xl mb-2">{race.emoji}</div>
          <h3 className="font-display font-semibold text-sm mb-1">{race.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{race.description}</p>
          
          <div className="flex flex-wrap gap-1">
            {race.traits.map((trait) => (
              <span 
                key={trait} 
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium"
              >
                {trait}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
