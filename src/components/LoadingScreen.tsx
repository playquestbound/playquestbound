import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center animate-pulse-gold">
          <span className="text-4xl">⚔️</span>
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Questbound</h1>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading your adventure...</span>
        </div>
      </div>
    </div>
  );
}
