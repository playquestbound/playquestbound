import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuestFilters as Filters } from "@/hooks/useAdminQuests";

interface QuestFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "archived", label: "Archived" },
];

const tiers = [
  { value: "all", label: "All Tiers" },
  { value: "side", label: "Side" },
  { value: "main", label: "Main" },
  { value: "grand", label: "Grand" },
];

const niches = [
  { value: "all", label: "All Niches" },
  { value: "running", label: "Running" },
  { value: "hiking", label: "Hiking" },
  { value: "beach", label: "Beach" },
  { value: "snow", label: "Snow" },
  { value: "surf", label: "Surf" },
  { value: "hyrox", label: "Hyrox" },
  { value: "walk", label: "Walk" },
  { value: "exploring", label: "Exploring" },
  { value: "general", label: "General" },
];

export function QuestFilters({ filters, onFiltersChange }: QuestFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search quests..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-10 bg-muted border-border"
        />
      </div>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
      >
        <SelectTrigger className="w-full sm:w-[150px] bg-muted border-border">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tier Filter */}
      <Select
        value={filters.tier}
        onValueChange={(value) => onFiltersChange({ ...filters, tier: value })}
      >
        <SelectTrigger className="w-full sm:w-[130px] bg-muted border-border">
          <SelectValue placeholder="Tier" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          {tiers.map((tier) => (
            <SelectItem key={tier.value} value={tier.value}>
              {tier.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Niche Filter */}
      <Select
        value={filters.niche}
        onValueChange={(value) => onFiltersChange({ ...filters, niche: value })}
      >
        <SelectTrigger className="w-full sm:w-[140px] bg-muted border-border">
          <SelectValue placeholder="Niche" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          {niches.map((niche) => (
            <SelectItem key={niche.value} value={niche.value}>
              {niche.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
