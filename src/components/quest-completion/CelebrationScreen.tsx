import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, Star, Coins, ArrowUp, Crown } from "lucide-react";

interface CelebrationScreenProps {
  questTitle: string;
  xpEarned: number;
  goldEarned: number;
  leveledUp: boolean;
  newLevel: number;
  titleEarned?: string;
  onContinue: () => void;
}

export function CelebrationScreen({
  questTitle,
  xpEarned,
  goldEarned,
  leveledUp,
  newLevel,
  titleEarned,
  onContinue,
}: CelebrationScreenProps) {
  const [displayXp, setDisplayXp] = useState(0);
  const [displayGold, setDisplayGold] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  // Animate XP counter
  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const xpIncrement = xpEarned / steps;
    const goldIncrement = goldEarned / steps;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplayXp(Math.min(Math.round(xpIncrement * step), xpEarned));
      setDisplayGold(Math.min(Math.round(goldIncrement * step), goldEarned));

      if (step >= steps) {
        clearInterval(timer);
        if (leveledUp) {
          setTimeout(() => setShowLevelUp(true), 300);
        }
        if (titleEarned) {
          setTimeout(() => setShowTitle(true), leveledUp ? 800 : 300);
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [xpEarned, goldEarned, leveledUp, titleEarned]);

  return (
    <div className="p-6 py-8 flex flex-col items-center space-y-6 relative overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-yellow-400/30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${12 + Math.random() * 12}px`,
            }}
          />
        ))}
      </div>

      {/* Trophy Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
        <div className="relative p-6 rounded-full bg-gradient-to-br from-yellow-400/30 to-yellow-600/20 border-2 border-yellow-400/50">
          <Trophy className="h-16 w-16 text-yellow-400" />
        </div>
      </div>

      {/* Quest Complete Text */}
      <div className="text-center space-y-2 z-10">
        <h1 className="text-3xl font-bold text-foreground animate-pulse">
          Quest Complete!
        </h1>
        <p className="text-lg text-muted-foreground">{questTitle}</p>
      </div>

      {/* Rewards */}
      <div className="flex gap-8 z-10">
        {/* XP */}
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/50">
            <Star className="h-8 w-8 text-purple-400" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">+{displayXp}</p>
            <p className="text-sm text-muted-foreground">XP Earned</p>
          </div>
        </div>

        {/* Gold */}
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 rounded-full bg-yellow-500/20 border border-yellow-500/50">
            <Coins className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">+{displayGold}</p>
            <p className="text-sm text-muted-foreground">Gold Earned</p>
          </div>
        </div>
      </div>

      {/* Level Up Banner */}
      {showLevelUp && (
        <div className="w-full p-4 bg-gradient-to-r from-green-500/20 via-green-400/30 to-green-500/20 border border-green-400/50 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
          <div className="flex items-center justify-center gap-3">
            <ArrowUp className="h-6 w-6 text-green-400" />
            <div className="text-center">
              <p className="text-lg font-bold text-green-400">LEVEL UP!</p>
              <p className="text-sm text-green-300">You are now Level {newLevel}</p>
            </div>
            <ArrowUp className="h-6 w-6 text-green-400" />
          </div>
        </div>
      )}

      {/* Title Earned Banner */}
      {showTitle && titleEarned && (
        <div className="w-full p-4 bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 border border-amber-400/50 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
          <div className="flex items-center justify-center gap-3">
            <Crown className="h-6 w-6 text-amber-400" />
            <div className="text-center">
              <p className="text-lg font-bold text-amber-400">TITLE EARNED!</p>
              <p className="text-sm text-amber-300">"{titleEarned}"</p>
            </div>
            <Crown className="h-6 w-6 text-amber-400" />
          </div>
        </div>
      )}

      {/* Continue Button */}
      <Button 
        onClick={onContinue} 
        size="lg" 
        className="w-full max-w-xs z-10"
      >
        Continue
      </Button>
    </div>
  );
}
