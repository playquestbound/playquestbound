import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown, AlertTriangle, Loader2, Play } from "lucide-react";
import { type AdminQuest } from "@/hooks/useAdminQuests";

interface BatchPublishModalProps {
  category: string;
  quests: AdminQuest[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function BatchPublishModal({
  category,
  quests,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: BatchPublishModalProps) {
  const [understoodGrand, setUnderstoodGrand] = useState(false);
  
  const grandQuests = quests.filter(q => q.tier === "grand");
  const hasGrandQuests = grandQuests.length > 0;
  const totalXP = quests.reduce((sum, q) => sum + q.xp_reward, 0);
  const totalGold = quests.reduce((sum, q) => sum + q.gold_reward, 0);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setUnderstoodGrand(false);
    }
    onOpenChange(newOpen);
  };

  const canConfirm = !hasGrandQuests || understoodGrand;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Publish {quests.length} {category}</DialogTitle>
          <DialogDescription>
            This will make all selected quests immediately visible to players.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Summary */}
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="secondary">{quests.length} quests</Badge>
            <span className="text-muted-foreground">{totalXP} total XP</span>
            <span className="text-muted-foreground">{totalGold} total Gold</span>
          </div>

          {/* Grand Quest Warning */}
          {hasGrandQuests && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-400">
                    Includes {grandQuests.length} Grand Quest{grandQuests.length > 1 ? "s" : ""}!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Grand Quests are legendary challenges. Make sure they're ready.
                  </p>
                  <ul className="text-sm text-yellow-300/80 mt-2">
                    {grandQuests.map(q => (
                      <li key={q.id} className="flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        {q.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-yellow-500/20">
                <Checkbox
                  id="understand-grand"
                  checked={understoodGrand}
                  onCheckedChange={(checked) => setUnderstoodGrand(checked === true)}
                />
                <Label
                  htmlFor="understand-grand"
                  className="text-sm font-medium text-yellow-400 cursor-pointer"
                >
                  I understand I'm publishing Grand Quest(s)
                </Label>
              </div>
            </div>
          )}

          {/* Quest List Preview */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Quests to publish:
            </p>
            <ScrollArea className="h-32 rounded-md border border-border">
              <div className="p-2 space-y-1">
                {quests.map(quest => (
                  <div
                    key={quest.id}
                    className="flex items-center justify-between text-sm py-1"
                  >
                    <span className="text-foreground">{quest.title}</span>
                    <span className="text-muted-foreground">{quest.xp_reward} XP</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!canConfirm || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Publish {quests.length} Quest{quests.length > 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
