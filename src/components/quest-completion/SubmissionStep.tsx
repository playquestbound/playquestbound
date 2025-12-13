import { Loader2 } from "lucide-react";

export function SubmissionStep() {
  return (
    <div className="p-6 py-12 flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-primary/20 animate-ping" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-xl font-bold text-foreground">Submitting Quest...</p>
        <p className="text-sm text-muted-foreground">
          Recording your achievement
        </p>
      </div>
    </div>
  );
}
