import { CLASSES } from '@/lib/characterData';
import { Button } from '@/components/ui/button';
import { SchematicButton } from '@/components/ui/SchematicButton';
import { cn } from '@/lib/utils';

interface ClassSelectionProps {
  selectedClass: string | null;
  onSelect: (classId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function ClassSelection({ selectedClass, onSelect, onContinue, onBack }: ClassSelectionProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header - compact */}
      <div className="text-center py-2 flex-shrink-0">
        <h1 className="font-display text-xl font-bold text-foreground">Choose Your Class</h1>
        <p className="text-muted-foreground text-sm">Your class shapes your adventures</p>
      </div>

      {/* Class Grid */}
      <div className="flex-1 overflow-y-auto py-3 flex-shrink-0">
        <div className="grid grid-cols-2 gap-3">
          {CLASSES.map((cls) => (
            <button
              key={cls.id}
              onClick={() => onSelect(cls.id)}
              className={cn(
                "flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-200",
                selectedClass === cls.id 
                  ? "border-secondary bg-secondary/10 scale-105" 
                  : "border-border/50 bg-card/50 active:scale-95"
              )}
            >
              <span className="text-3xl mb-2">{cls.icon}</span>
              <span className="font-display text-sm font-semibold text-foreground">{cls.name}</span>
              <span className="text-xs text-muted-foreground mt-1 line-clamp-2">{cls.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-3 flex-shrink-0 px-6">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <SchematicButton
          size="lg"
          className="flex-1"
          disabled={!selectedClass}
          onClick={onContinue}
        >
          Continue
        </SchematicButton>
      </div>
    </div>
  );
}
