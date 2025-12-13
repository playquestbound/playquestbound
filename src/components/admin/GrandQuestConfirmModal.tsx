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
import { Crown, AlertTriangle, Loader2 } from "lucide-react";
import { type AdminQuest } from "@/hooks/useAdminQuests";

interface GrandQuestConfirmModalProps {
  quest: AdminQuest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function GrandQuestConfirmModal({
  quest,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: GrandQuestConfirmModalProps) {
  const [understood, setUnderstood] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setUnderstood(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-yellow-500/20">
              <Crown className="h-5 w-5 text-yellow-400" />
            </div>
            <DialogTitle className="text-xl">
              You're about to publish a Grand Quest
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2 space-y-3">
            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
              <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-400">
                  Grand Quests are legendary challenges
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  These are the most prestigious quests in Questbound. Publishing "{quest?.title}" will make it immediately visible to all players.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Grand quests should be:
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Thoroughly tested and verified</li>
                <li>Appropriately rewarding ({quest?.xp_reward} XP, {quest?.gold_reward} Gold)</li>
                <li>Ready for player engagement</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <Checkbox
            id="understand"
            checked={understood}
            onCheckedChange={(checked) => setUnderstood(checked === true)}
          />
          <Label
            htmlFor="understand"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            I understand this is a major quest
          </Label>
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
            disabled={!understood || isLoading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Crown className="h-4 w-4 mr-2" />
            )}
            Publish Grand Quest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
