import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, AlertCircle, CheckSquare } from "lucide-react";

interface ChallengeStepProps {
  challenge: string;
  onConfirm: () => void;
  onBack: () => void;
  error?: string | null;
}

export function ChallengeStep({ challenge, onConfirm, onBack, error }: ChallengeStepProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold text-foreground">Verify Challenge</h2>
      </div>

      {/* Challenge Card */}
      <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <CheckSquare className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground mb-1">Quest Challenge</p>
            <p className="text-lg font-medium text-foreground">{challenge}</p>
          </div>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="bg-card/50 border border-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="challenge-confirm"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked === true)}
            className="mt-1"
          />
          <Label
            htmlFor="challenge-confirm"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I confirm that I completed this challenge and captured it in my video journal. 
            I understand this is on the honor system.
          </Label>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-500">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button 
        onClick={onConfirm} 
        disabled={!confirmed}
        className="w-full"
        size="lg"
      >
        Complete Quest
      </Button>

      {/* Honor System Note */}
      <p className="text-xs text-center text-muted-foreground">
        Questbound uses an honor system. Your video and location are recorded for your personal adventure journal.
      </p>
    </div>
  );
}
