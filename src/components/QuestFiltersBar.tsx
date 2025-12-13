import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuestFilters } from "@/hooks/useQuests";

interface QuestFiltersBarProps {
  filters: QuestFilters;
  onFiltersChange: (filters: QuestFilters) => void;
  userClass?: string | null;
}

const niches = [
  { value: "all", label: "All Activities" },
  { value: "running", label: "🏃 Running" },
  { value: "hiking", label: "🥾 Hiking" },
  { value: "beach", label: "🏖️ Beach" },
  { value: "snow", label: "❄️ Snow" },
  { value: "surf", label: "🏄 Surf" },
  { value: "hyrox", label: "💪 Hyrox" },
  { value: "walk", label: "🚶 Walk" },
  { value: "exploring", label: "🗺️ Exploring" },
  { value: "general", label: "⭐ General" },
];

const difficulties = [
  { value: "all", label: "All Difficulties" },
  { value: "easy", label: "★ Easy" },
  { value: "medium", label: "★★ Medium" },
  { value: "hard", label: "★★★ Hard" },
  { value: "legendary", label: "★★★★ Legendary" },
];

const classOptions = [
  { value: "all", label: "All Classes" },
  { value: "for-you", label: "✨ For You" },
  { value: "Wanderer", label: "Wanderer" },
  { value: "Lightfoot", label: "Lightfoot" },
  { value: "Trailblazer", label: "Trailblazer" },
  { value: "Wayfarer", label: "Wayfarer" },
  { value: "Forager", label: "Forager" },
  { value: "Nightowl", label: "Nightowl" },
  { value: "Chronicler", label: "Chronicler" },
  { value: "Ironside", label: "Ironside" },
];

export function QuestFiltersBar({ filters, onFiltersChange, userClass }: QuestFiltersBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* Niche Filter */}
      <Select
        value={filters.niche}
        onValueChange={(value) => onFiltersChange({ ...filters, niche: value })}
      >
        <SelectTrigger className="min-w-[140px] bg-card/50 border-border text-sm h-9">
          <SelectValue placeholder="Activity" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          {niches.map((niche) => (
            <SelectItem key={niche.value} value={niche.value}>
              {niche.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Difficulty Filter */}
      <Select
        value={filters.difficulty}
        onValueChange={(value) => onFiltersChange({ ...filters, difficulty: value })}
      >
        <SelectTrigger className="min-w-[130px] bg-card/50 border-border text-sm h-9">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          {difficulties.map((diff) => (
            <SelectItem key={diff.value} value={diff.value}>
              {diff.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Class Filter */}
      {userClass && (
        <Select
          value={filters.classFilter}
          onValueChange={(value) => onFiltersChange({ ...filters, classFilter: value })}
        >
          <SelectTrigger className="min-w-[120px] bg-card/50 border-border text-sm h-9">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            {classOptions.map((cls) => (
              <SelectItem key={cls.value} value={cls.value}>
                {cls.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
