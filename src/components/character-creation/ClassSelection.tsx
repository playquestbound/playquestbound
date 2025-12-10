import { CLASSES } from '@/lib/characterData';
import { Button } from '@/components/ui/button';

interface ClassSelectionProps {
  selectedClass: string | null;
  onSelect: (classId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function ClassSelection({ selectedClass, onSelect, onContinue, onBack }: ClassSelectionProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Choose Your Class</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your class shapes your adventures
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {CLASSES.map((cls) => (
          <div
            key={cls.id}
            onClick={() => onSelect(cls.id)}
            className={`race-card flex items-start gap-4 p-4 ${
              selectedClass === cls.id ? 'selected' : 'border-border'
            }`}
          >
            <div className="text-3xl flex-shrink-0">{cls.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground">{cls.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-snug">
                {cls.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          variant="gold"
          size="lg"
          className="flex-1"
          disabled={!selectedClass}
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
