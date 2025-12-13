import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Sparkles, Target, Shield, CheckCircle2, ArrowLeft } from "lucide-react";
import type { Quest } from "@/hooks/useQuests";
import { cn } from "@/lib/utils";

interface QuestDetailModalProps {
  quest: Quest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: () => void;
  isLoading?: boolean;
  canAccept?: boolean;
}

const tierStyles: Record<string, string> = {
  side: "bg-slate-600 text-slate-100",
  main: "bg-amber-600 text-amber-100",
  grand: "bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold",
};

const difficultyStyles: Record<string, string> = {
  easy: "bg-green-600/20 text-green-400 border-green-600/30",
  medium: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  hard: "bg-orange-600/20 text-orange-400 border-orange-600/30",
  legendary: "bg-purple-600/20 text-purple-400 border-purple-600/30",
};

const nicheColors: Record<string, string> = {
  running: "bg-red-600/20 text-red-400",
  hiking: "bg-green-600/20 text-green-400",
  beach: "bg-cyan-600/20 text-cyan-400",
  snow: "bg-blue-600/20 text-blue-400",
  surf: "bg-teal-600/20 text-teal-400",
  hyrox: "bg-orange-600/20 text-orange-400",
  walk: "bg-lime-600/20 text-lime-400",
  exploring: "bg-violet-600/20 text-violet-400",
  general: "bg-slate-600/20 text-slate-400",
};

export function QuestDetailModal({
  quest,
  open,
  onOpenChange,
  onAccept,
  isLoading,
  canAccept = true,
}: QuestDetailModalProps) {
  if (!quest) return null;

  const verificationConfig = quest.verification_config as {
    gps?: Record<string, unknown>;
    video?: Record<string, unknown>;
    challenges?: string[];
  } | null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-background/95 backdrop-blur border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={tierStyles[quest.tier || 'side']}>
              {quest.tier?.toUpperCase() || 'SIDE'}
            </Badge>
            <Badge variant="outline" className={difficultyStyles[quest.difficulty.toLowerCase()]}>
              {quest.difficulty}
            </Badge>
            {quest.niche && (
              <Badge className={cn("capitalize", nicheColors[quest.niche] || nicheColors.general)}>
                {quest.niche}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl font-bold text-foreground text-left">
            {quest.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {quest.description}
          </p>

          {/* Rewards */}
          <div className="flex gap-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="text-lg font-bold text-blue-400">+{quest.xp_reward} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="text-lg font-bold text-yellow-400">+{quest.gold_reward} Gold</span>
            </div>
          </div>

          {/* Class Affinity */}
          {quest.class_affinity && (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Recommended for:</span>
              <Badge variant="outline" className="text-primary border-primary/50">
                {quest.class_affinity}
              </Badge>
            </div>
          )}

          {/* Verification Requirements */}
          {verificationConfig && (
            <div className="space-y-3 border-t border-border pt-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                What You'll Need to Do
              </h4>

              {verificationConfig.gps && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-foreground mb-2">📍 GPS Requirements</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {verificationConfig.gps.min_distance && (
                      <li>• Travel at least {(verificationConfig.gps.min_distance as number / 1000).toFixed(1)}km</li>
                    )}
                    {verificationConfig.gps.min_duration && (
                      <li>• Duration: minimum {Math.round((verificationConfig.gps.min_duration as number) / 60)} minutes</li>
                    )}
                    {verificationConfig.gps.location_type && (
                      <li>• Location type: {String(verificationConfig.gps.location_type)}</li>
                    )}
                  </ul>
                </div>
              )}

              {verificationConfig.video && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-foreground mb-2">📹 Video Journal</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {typeof verificationConfig.video.min_duration === 'number' && (
                      <li>• Record at least {verificationConfig.video.min_duration} seconds</li>
                    )}
                    {Array.isArray(verificationConfig.video.must_show) && (
                      <li>• Show: {verificationConfig.video.must_show.join(', ')}</li>
                    )}
                  </ul>
                </div>
              )}

              {verificationConfig.challenges && verificationConfig.challenges.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Challenges to Complete
                  </h5>
                  <ul className="space-y-2">
                    {verificationConfig.challenges.map((challenge, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary font-bold">{index + 1}.</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Accept Button */}
          {onAccept && (
            <div className="pt-2">
              <Button
                onClick={onAccept}
                disabled={isLoading || !canAccept}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold"
                size="lg"
              >
                {isLoading ? 'Accepting...' : !canAccept ? 'Quest Limit Reached' : 'Accept Quest'}
              </Button>
              {!canAccept && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Complete or abandon a quest to accept new ones
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
