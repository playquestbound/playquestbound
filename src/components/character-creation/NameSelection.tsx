import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface NameSelectionProps {
  name: string;
  onNameChange: (name: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function NameSelection({ name, onNameChange, onContinue, onBack }: NameSelectionProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isUnique, setIsUnique] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validation regex: alphanumeric and spaces, 3-16 chars
  const isValidFormat = /^[a-zA-Z0-9 ]{3,16}$/.test(name);

  useEffect(() => {
    setIsUnique(null);
    setError(null);

    if (!name || name.length < 3) return;

    if (!isValidFormat) {
      setError('Name must be 3-16 characters (letters, numbers, spaces only)');
      return;
    }

    const checkUniqueness = async () => {
      setIsChecking(true);
      try {
        const { data } = await supabase
          .from('profiles')
          .select('id')
          .eq('character_name', name.trim());

        if (data && data.length > 0) {
          setIsUnique(false);
          setError('This name is already claimed');
        } else {
          setIsUnique(true);
          setError(null);
        }
      } catch {
        setError('Could not check name availability');
      } finally {
        setIsChecking(false);
      }
    };

    const timer = setTimeout(checkUniqueness, 500);
    return () => clearTimeout(timer);
  }, [name, isValidFormat]);

  const canContinue = name.length >= 3 && isValidFormat && isUnique === true;

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Name Your Character</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Choose a name that will be remembered
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="parchment-card p-6">
          <div className="relative">
            <Input
              placeholder="Enter your name, adventurer..."
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              maxLength={16}
              className="text-lg pr-10"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isChecking && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
              {!isChecking && isUnique === true && (
                <CheckCircle className="w-5 h-5 text-accent" />
              )}
              {!isChecking && isUnique === false && (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
            </div>
          </div>
          
          {error && (
            <p className="text-destructive text-sm mt-2">{error}</p>
          )}
          
          {!error && isUnique === true && (
            <p className="text-accent text-sm mt-2">This name is available!</p>
          )}

          <p className="text-xs text-muted-foreground mt-3">
            3-16 characters, letters, numbers, and spaces only
          </p>
        </div>
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
          disabled={!canContinue || isChecking}
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
