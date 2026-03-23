import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X, MapPin, Shield } from "lucide-react";
import { type CreateQuestData } from "@/hooks/useAdminQuests";

interface CreateQuestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateQuestData) => Promise<void>;
  isLoading: boolean;
}

const QUEST_TYPES = [
  { value: "run", label: "Run" },
  { value: "hike", label: "Hike" },
  { value: "walk", label: "Walk" },
  { value: "explore", label: "Explore" },
  { value: "challenge", label: "Challenge" },
];

const QUEST_CATEGORIES = [
  { value: "fitness", label: "Fitness" },
  { value: "adventure", label: "Adventure" },
  { value: "exploration", label: "Exploration" },
  { value: "social", label: "Social" },
];

const NICHES = [
  { value: "none", label: "None" },
  { value: "running", label: "Running" },
  { value: "hiking", label: "Hiking" },
  { value: "urban", label: "Urban" },
  { value: "nature", label: "Nature" },
  { value: "mountain", label: "Mountain" },
];

const CLASSES = [
  { value: "none", label: "None (All Classes)" },
  { value: "warrior", label: "Warrior" },
  { value: "mage", label: "Mage" },
  { value: "rogue", label: "Rogue" },
  { value: "ranger", label: "Ranger" },
];

const DIFFICULTIES = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
  { value: "Legendary", label: "Legendary" },
];

const TIERS = [
  { value: "side", label: "Side Quest" },
  { value: "main", label: "Main Quest" },
  { value: "grand", label: "Grand Quest (Legendary)" },
];

export function CreateQuestModal({ open, onOpenChange, onSubmit, isLoading }: CreateQuestModalProps) {
  const defaultFormData: CreateQuestData = {
    title: "",
    description: "",
    quest_type: "run",
    quest_category: "fitness",
    niche: null,
    class_affinity: null,
    xp_reward: 50,
    gold_reward: 10,
    difficulty: "Easy",
    tier: "side",
    is_funded_eligible: false,
    requires_manual_review: false,
    verification_config: {
      requires_gps: false,
      requires_video: false,
      challenges: [],
    },
    min_level: null,
    visibility_lat: null,
    visibility_lng: null,
    visibility_radius_km: null,
  };

  const [formData, setFormData] = useState<CreateQuestData>(defaultFormData);
  const [newChallenge, setNewChallenge] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form
    setFormData(defaultFormData);
  };

  const addChallenge = () => {
    if (newChallenge.trim()) {
      setFormData(prev => ({
        ...prev,
        verification_config: {
          ...prev.verification_config,
          challenges: [...prev.verification_config.challenges, newChallenge.trim()],
        },
      }));
      setNewChallenge("");
    }
  };

  const removeChallenge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      verification_config: {
        ...prev.verification_config,
        challenges: prev.verification_config.challenges.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quest</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Quest Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quest title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the quest objective..."
                rows={3}
                required
              />
            </div>
          </div>

          {/* Quest Type & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quest Type</Label>
              <Select
                value={formData.quest_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, quest_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUEST_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={formData.quest_category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, quest_category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUEST_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tier & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tier</Label>
              <Select
                value={formData.tier}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tier: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIERS.map(tier => (
                    <SelectItem key={tier.value} value={tier.value}>{tier.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map(diff => (
                    <SelectItem key={diff.value} value={diff.value}>{diff.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Niche & Class */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Niche</Label>
              <Select
                value={formData.niche || "none"}
                onValueChange={(value) => setFormData(prev => ({ ...prev, niche: value === "none" ? null : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select niche" />
                </SelectTrigger>
                <SelectContent>
                  {NICHES.map(niche => (
                    <SelectItem key={niche.value} value={niche.value}>{niche.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Class Affinity</Label>
              <Select
                value={formData.class_affinity || "none"}
                onValueChange={(value) => setFormData(prev => ({ ...prev, class_affinity: value === "none" ? null : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map(cls => (
                    <SelectItem key={cls.value} value={cls.value}>{cls.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="xp">XP Reward</Label>
              <Input
                id="xp"
                type="number"
                min={0}
                value={formData.xp_reward}
                onChange={(e) => setFormData(prev => ({ ...prev, xp_reward: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label htmlFor="gold">Gold Reward</Label>
              <Input
                id="gold"
                type="number"
                min={0}
                value={formData.gold_reward}
                onChange={(e) => setFormData(prev => ({ ...prev, gold_reward: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          {/* Verification Config */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-medium">Verification Requirements</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="gps">Requires GPS Location</Label>
              <Switch
                id="gps"
                checked={formData.verification_config.requires_gps}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  verification_config: { ...prev.verification_config, requires_gps: checked },
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="video">Requires Video Proof</Label>
              <Switch
                id="video"
                checked={formData.verification_config.requires_video}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  verification_config: { ...prev.verification_config, requires_video: checked },
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Challenge Steps</Label>
              <div className="flex gap-2">
                <Input
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  placeholder="Add a challenge step..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addChallenge();
                    }
                  }}
                />
                <Button type="button" size="icon" variant="outline" onClick={addChallenge}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.verification_config.challenges.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {formData.verification_config.challenges.map((challenge, i) => (
                    <li key={i} className="flex items-center justify-between text-sm bg-background p-2 rounded">
                      <span>{challenge}</span>
                      <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeChallenge(i)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Visibility Gates */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <h4 className="font-medium">Visibility Gates</h4>
            </div>

            {/* Level Gate */}
            <div className="space-y-2">
              <Label htmlFor="min_level">Minimum Level Required</Label>
              <p className="text-xs text-muted-foreground">Leave empty for no level requirement</p>
              <Input
                id="min_level"
                type="number"
                min={1}
                max={75}
                value={formData.min_level ?? ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  min_level: e.target.value ? parseInt(e.target.value) : null,
                }))}
                placeholder="e.g. 10"
              />
            </div>

            {/* Geo Gate */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <Label>Geographic Visibility</Label>
              </div>
              <p className="text-xs text-muted-foreground">Only show this quest to players near a specific location</p>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="vis_lat" className="text-xs">Latitude</Label>
                  <Input
                    id="vis_lat"
                    type="number"
                    step="0.0001"
                    value={formData.visibility_lat ?? ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      visibility_lat: e.target.value ? parseFloat(e.target.value) : null,
                    }))}
                    placeholder="51.5074"
                  />
                </div>
                <div>
                  <Label htmlFor="vis_lng" className="text-xs">Longitude</Label>
                  <Input
                    id="vis_lng"
                    type="number"
                    step="0.0001"
                    value={formData.visibility_lng ?? ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      visibility_lng: e.target.value ? parseFloat(e.target.value) : null,
                    }))}
                    placeholder="-0.1278"
                  />
                </div>
                <div>
                  <Label htmlFor="vis_radius" className="text-xs">Radius (km)</Label>
                  <Input
                    id="vis_radius"
                    type="number"
                    step="0.1"
                    min={0.1}
                    value={formData.visibility_radius_km ?? ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      visibility_radius_km: e.target.value ? parseFloat(e.target.value) : null,
                    }))}
                    placeholder="50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Flags */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="funded">Funded Eligible</Label>
                <p className="text-xs text-muted-foreground">Quest rewards can be funded by sponsors</p>
              </div>
              <Switch
                id="funded"
                checked={formData.is_funded_eligible}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_funded_eligible: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="review">Requires Manual Review</Label>
                <p className="text-xs text-muted-foreground">Completions must be reviewed before rewards</p>
              </div>
              <Switch
                id="review"
                checked={formData.requires_manual_review}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_manual_review: checked }))}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title || !formData.description}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Quest"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}