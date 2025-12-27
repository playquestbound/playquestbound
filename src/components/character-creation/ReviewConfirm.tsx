import { RACES, CLASSES } from '@/lib/characterData';
import { Button } from '@/components/ui/button';
import { SchematicButton } from '@/components/ui/SchematicButton';
import { Loader2, Sparkles } from 'lucide-react';

interface ReviewConfirmProps {
  name: string;
  raceId: string;
  classId: string;
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function ReviewConfirm({ 
  name, 
  raceId, 
  classId, 
  onConfirm, 
  onBack,
  isLoading 
}: ReviewConfirmProps) {
  const race = RACES.find(r => r.id === raceId);
  const characterClass = CLASSES.find(c => c.id === classId);

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary/20 flex items-center justify-center animate-pulse-gold">
          <Sparkles className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">Ready to Begin?</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review your character before embarking
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {/* Character Preview Card */}
        <div className="parchment-card p-6 text-center">
          {/* Avatar Preview */}
          <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-secondary flex items-center justify-center bg-muted">
            <div className="text-2xl">{characterClass?.icon}</div>
          </div>
          
          <h2 className="font-display text-2xl font-bold text-secondary">{name}</h2>
          
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-foreground font-display">{race?.name}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground font-display">{characterClass?.name}</span>
          </div>
        </div>

        {/* Details */}
        <div className="parchment-card p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Race</span>
            <span className="font-display font-semibold">{race?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Class</span>
            <span className="font-display font-semibold">{characterClass?.name}</span>
          </div>
        </div>

        {/* Starting Stats */}
        <div className="parchment-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Starting Stats</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-display text-xl font-bold text-foreground">1</p>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-secondary">0</p>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-secondary">0</p>
              <p className="text-xs text-muted-foreground">Gold</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4 px-6">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
        <SchematicButton
          size="lg"
          className="flex-1"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Creating...
            </>
          ) : (
            'Begin Adventure'
          )}
        </SchematicButton>
      </div>
    </div>
  );
}
