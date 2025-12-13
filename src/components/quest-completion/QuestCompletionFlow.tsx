import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LocationStep } from "./LocationStep";
import { VideoStep } from "./VideoStep";
import { ChallengeStep } from "./ChallengeStep";
import { SubmissionStep } from "./SubmissionStep";
import { CelebrationScreen } from "./CelebrationScreen";
import { type Quest, type UserQuest } from "@/hooks/useQuests";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { calculateLevel } from "@/lib/levelSystem";

export type CompletionStep = "location" | "video" | "challenge" | "submitting" | "celebration";

interface QuestCompletionFlowProps {
  userQuest: UserQuest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CompletionData {
  location: { lat: number; lng: number } | null;
  videoUrl: string | null;
  challengeConfirmed: boolean;
}

// Sample challenges - in production these would come from quest.verification_config
const SAMPLE_CHALLENGES = [
  "I showed the trail/path in my video",
  "I captured myself at the location",
  "I completed the activity shown in the quest",
  "I documented my journey from start to finish",
  "I captured the key landmark or destination",
];

export function QuestCompletionFlow({ userQuest, open, onOpenChange }: QuestCompletionFlowProps) {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<CompletionStep>("location");
  const [data, setData] = useState<CompletionData>({
    location: null,
    videoUrl: null,
    challengeConfirmed: false,
  });
  const [rewards, setRewards] = useState<{ xp: number; gold: number; leveledUp: boolean; newLevel: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<string>("");

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setStep("location");
      setData({ location: null, videoUrl: null, challengeConfirmed: false });
      setRewards(null);
      setError(null);
      // Pick a random challenge
      setChallenge(SAMPLE_CHALLENGES[Math.floor(Math.random() * SAMPLE_CHALLENGES.length)]);
    }
  }, [open]);

  const quest = userQuest?.quest;

  const handleLocationComplete = (lat: number, lng: number) => {
    setData(prev => ({ ...prev, location: { lat, lng } }));
    setStep("video");
  };

  const handleVideoComplete = (videoUrl: string) => {
    setData(prev => ({ ...prev, videoUrl }));
    setStep("challenge");
  };

  const handleChallengeConfirm = () => {
    setData(prev => ({ ...prev, challengeConfirmed: true }));
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!user || !userQuest || !quest || !data.location || !data.videoUrl) {
      setError("Missing required data for submission");
      return;
    }

    setStep("submitting");
    setError(null);

    try {
      // 1. Create quest completion record
      const { error: completionError } = await supabase
        .from("quest_completions")
        .insert({
          user_id: user.id,
          quest_id: quest.id,
          status: "completed",
          video_url: data.videoUrl,
          completion_lat: data.location.lat,
          completion_lng: data.location.lng,
          challenge_confirmed: true,
          xp_awarded: quest.xp_reward,
          gold_awarded: quest.gold_reward,
          submitted_at: new Date().toISOString(),
          auto_approved: true,
        });

      if (completionError) throw completionError;

      // 2. Update user_quests status
      const { error: questError } = await supabase
        .from("user_quests")
        .update({
          status: "completed",
          video_url: data.videoUrl,
          location_lat: data.location.lat,
          location_lng: data.location.lng,
          completed_at: new Date().toISOString(),
        })
        .eq("id", userQuest.id);

      if (questError) throw questError;

      // 3. Update user stats (XP, gold, level)
      const currentXp = profile?.xp || 0;
      const currentGold = profile?.gold || 0;
      const currentLevel = profile?.level || 1;

      const newXp = currentXp + quest.xp_reward;
      const newGold = currentGold + quest.gold_reward;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > currentLevel;

      const { error: statsError } = await supabase
        .from("profiles")
        .update({
          xp: newXp,
          gold: newGold,
          level: newLevel,
        })
        .eq("id", user.id);

      if (statsError) throw statsError;

      // 4. Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["active-quests"] });
      queryClient.invalidateQueries({ queryKey: ["completed-quests"] });
      queryClient.invalidateQueries({ queryKey: ["available-quests"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      // 5. Show celebration
      setRewards({
        xp: quest.xp_reward,
        gold: quest.gold_reward,
        leveledUp,
        newLevel,
      });
      setStep("celebration");
    } catch (err) {
      console.error("Quest completion error:", err);
      setError(err instanceof Error ? err.message : "Failed to complete quest");
      setStep("challenge"); // Go back to challenge step on error
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!quest) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-lg p-0 overflow-hidden bg-background border-border"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {step === "location" && (
          <LocationStep 
            onComplete={handleLocationComplete} 
            onCancel={handleClose}
          />
        )}

        {step === "video" && (
          <VideoStep 
            questId={quest.id}
            onComplete={handleVideoComplete}
            onBack={() => setStep("location")}
          />
        )}

        {step === "challenge" && (
          <ChallengeStep
            challenge={challenge}
            onConfirm={handleChallengeConfirm}
            onBack={() => setStep("video")}
            error={error}
          />
        )}

        {step === "submitting" && (
          <SubmissionStep />
        )}

        {step === "celebration" && rewards && (
          <CelebrationScreen
            questTitle={quest.title}
            xpEarned={rewards.xp}
            goldEarned={rewards.gold}
            leveledUp={rewards.leveledUp}
            newLevel={rewards.newLevel}
            onContinue={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
