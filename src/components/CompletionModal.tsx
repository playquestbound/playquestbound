import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, Sparkles, Trophy } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  xpReward: number;
  goldReward: number;
  questTitle: string;
}

export function CompletionModal({ 
  isOpen, 
  onClose, 
  xpReward, 
  goldReward,
  questTitle 
}: CompletionModalProps) {
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowRewards(false);
      const timer = setTimeout(() => setShowRewards(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="parchment-card border-2 border-secondary max-w-sm mx-auto">
        <div className="text-center py-4">
          {/* Trophy Icon */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center animate-celebrate">
            <Trophy className="w-10 h-10 text-secondary" />
          </div>

          <h2 className="font-display text-2xl font-bold mb-2">Quest Complete!</h2>
          <p className="text-muted-foreground mb-6">{questTitle}</p>

          {/* Rewards */}
          {showRewards && (
            <div className="flex justify-center gap-6 mb-6">
              <div className="animate-xp-gain">
                <div className="flex items-center justify-center gap-2 text-xp">
                  <Sparkles className="w-6 h-6" />
                  <span className="font-display text-2xl font-bold">+{xpReward}</span>
                </div>
                <span className="text-sm text-muted-foreground">XP Earned</span>
              </div>

              <div className="animate-coins" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-center gap-2 text-secondary">
                  <Coins className="w-6 h-6" />
                  <span className="font-display text-2xl font-bold">+{goldReward}</span>
                </div>
                <span className="text-sm text-muted-foreground">Gold Earned</span>
              </div>
            </div>
          )}

          <Button variant="fantasy" className="w-full" onClick={onClose}>
            Continue Adventure
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
