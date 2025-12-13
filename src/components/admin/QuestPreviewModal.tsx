import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Coins, Sparkles, Mountain, Target, Shield, CheckCircle2 } from "lucide-react";
import type { AdminQuest } from "@/hooks/useAdminQuests";

interface QuestPreviewModalProps {
  quest: AdminQuest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tierColors: Record<string, string> = {
  side: "bg-slate-600 text-slate-100",
  main: "bg-amber-600 text-amber-100",
  grand: "bg-gradient-to-r from-yellow-500 to-amber-500 text-black",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-600/20 text-green-400 border-green-600/30",
  medium: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  hard: "bg-orange-600/20 text-orange-400 border-orange-600/30",
  legendary: "bg-purple-600/20 text-purple-400 border-purple-600/30",
};

export function QuestPreviewModal({ quest, open, onOpenChange }: QuestPreviewModalProps) {
  if (!quest) return null;

  const verificationConfig = quest.verification_config as {
    gps?: Record<string, unknown>;
    video?: Record<string, unknown>;
    challenges?: string[];
  } | null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={tierColors[quest.tier || 'side']}>
              {quest.tier?.toUpperCase()}
            </Badge>
            <Badge variant="outline" className={difficultyColors[quest.difficulty]}>
              {quest.difficulty}
            </Badge>
            {quest.niche && (
              <Badge variant="secondary" className="capitalize">
                {quest.niche}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {quest.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {quest.description}
            </p>
          </div>

          {/* Rewards */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="text-lg font-semibold text-blue-400">{quest.xp_reward} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              <span className="text-lg font-semibold text-yellow-400">{quest.gold_reward} Gold</span>
            </div>
          </div>

          {/* Class Affinity */}
          {quest.class_affinity && (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Class Affinity:</span>
              <Badge variant="outline">{quest.class_affinity}</Badge>
            </div>
          )}

          {/* Flags */}
          <div className="flex gap-3 flex-wrap">
            {quest.is_funded_eligible && (
              <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                💰 Funded Eligible
              </Badge>
            )}
            {quest.requires_manual_review && (
              <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30">
                👁️ Manual Review Required
              </Badge>
            )}
          </div>

          {/* Verification Requirements */}
          {verificationConfig && (
            <div className="space-y-4 border-t border-border pt-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Verification Requirements
              </h4>

              {verificationConfig.gps && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Mountain className="h-4 w-4" />
                    GPS Requirements
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(verificationConfig.gps).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-foreground">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {verificationConfig.video && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-foreground mb-2">📹 Video Requirements</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(verificationConfig.video).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-foreground">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {verificationConfig.challenges && verificationConfig.challenges.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Challenges
                  </h5>
                  <ul className="space-y-1">
                    {verificationConfig.challenges.map((challenge, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-muted-foreground border-t border-border pt-4 space-y-1">
            <p>Quest ID: {quest.id}</p>
            <p>Created: {new Date(quest.created_at).toLocaleString()}</p>
            {quest.published_at && (
              <p>Published: {new Date(quest.published_at).toLocaleString()}</p>
            )}
            {quest.scheduled_for && (
              <p>Scheduled for: {new Date(quest.scheduled_for).toLocaleString()}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
