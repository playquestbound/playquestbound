import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Play, Calendar, Archive, Eye, Coins, Sparkles } from "lucide-react";
import type { AdminQuest } from "@/hooks/useAdminQuests";

interface QuestTableProps {
  quests: AdminQuest[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onPublish: (quest: AdminQuest) => void;
  onSchedule: (quest: AdminQuest) => void;
  onArchive: (quest: AdminQuest) => void;
  onPreview: (quest: AdminQuest) => void;
}

const statusStyles: Record<string, string> = {
  draft: "bg-slate-600/20 text-slate-400 border-slate-600/30",
  scheduled: "bg-blue-600/20 text-blue-400 border-blue-600/30",
  live: "bg-green-600/20 text-green-400 border-green-600/30",
  archived: "bg-red-600/20 text-red-400 border-red-600/30",
};

const tierStyles: Record<string, string> = {
  side: "bg-slate-700 text-slate-200",
  main: "bg-amber-700 text-amber-100",
  grand: "bg-gradient-to-r from-yellow-600 to-amber-600 text-white",
};

export function QuestTable({
  quests,
  selectedIds,
  onSelectionChange,
  onPublish,
  onSchedule,
  onArchive,
  onPreview,
}: QuestTableProps) {
  const allSelected = quests.length > 0 && selectedIds.length === quests.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < quests.length;

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(quests.map((q) => q.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[50px]">
              <Checkbox
                checked={allSelected}
                ref={(ref) => {
                  if (ref) {
                    (ref as unknown as HTMLInputElement).indeterminate = someSelected;
                  }
                }}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead className="w-[100px]">Tier</TableHead>
            <TableHead className="w-[100px]">Niche</TableHead>
            <TableHead className="w-[120px]">Rewards</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No quests found matching your filters.
              </TableCell>
            </TableRow>
          ) : (
            quests.map((quest) => (
              <TableRow key={quest.id} className="hover:bg-muted/30">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(quest.id)}
                    onCheckedChange={() => toggleOne(quest.id)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{quest.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {quest.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={tierStyles[quest.tier || 'side']}>
                    {quest.tier || 'side'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground capitalize">
                    {quest.niche || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs flex items-center gap-1 text-blue-400">
                      <Sparkles className="h-3 w-3" />
                      {quest.xp_reward}
                    </span>
                    <span className="text-xs flex items-center gap-1 text-yellow-400">
                      <Coins className="h-3 w-3" />
                      {quest.gold_reward}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyles[quest.status || 'draft']}>
                    {quest.status || 'draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                      <DropdownMenuItem onClick={() => onPreview(quest)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      {quest.status !== 'live' && (
                        <DropdownMenuItem onClick={() => onPublish(quest)}>
                          <Play className="mr-2 h-4 w-4 text-green-400" />
                          Go Live
                        </DropdownMenuItem>
                      )}
                      {quest.status === 'draft' && (
                        <DropdownMenuItem onClick={() => onSchedule(quest)}>
                          <Calendar className="mr-2 h-4 w-4 text-blue-400" />
                          Schedule
                        </DropdownMenuItem>
                      )}
                      {quest.status !== 'archived' && (
                        <DropdownMenuItem onClick={() => onArchive(quest)}>
                          <Archive className="mr-2 h-4 w-4 text-red-400" />
                          Archive
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Mobile card view component
export function QuestCards({
  quests,
  selectedIds,
  onSelectionChange,
  onPublish,
  onSchedule,
  onArchive,
  onPreview,
}: QuestTableProps) {
  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (quests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No quests found matching your filters.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {quests.map((quest) => (
        <div
          key={quest.id}
          className="bg-card border border-border rounded-lg p-4 space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedIds.includes(quest.id)}
                onCheckedChange={() => toggleOne(quest.id)}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-foreground">{quest.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {quest.description}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                <DropdownMenuItem onClick={() => onPreview(quest)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                {quest.status !== 'live' && (
                  <DropdownMenuItem onClick={() => onPublish(quest)}>
                    <Play className="mr-2 h-4 w-4 text-green-400" />
                    Go Live
                  </DropdownMenuItem>
                )}
                {quest.status === 'draft' && (
                  <DropdownMenuItem onClick={() => onSchedule(quest)}>
                    <Calendar className="mr-2 h-4 w-4 text-blue-400" />
                    Schedule
                  </DropdownMenuItem>
                )}
                {quest.status !== 'archived' && (
                  <DropdownMenuItem onClick={() => onArchive(quest)}>
                    <Archive className="mr-2 h-4 w-4 text-red-400" />
                    Archive
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={tierStyles[quest.tier || 'side']}>
              {quest.tier || 'side'}
            </Badge>
            <Badge variant="outline" className={statusStyles[quest.status || 'draft']}>
              {quest.status || 'draft'}
            </Badge>
            {quest.niche && (
              <Badge variant="secondary" className="capitalize">
                {quest.niche}
              </Badge>
            )}
          </div>

          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1 text-blue-400">
              <Sparkles className="h-3 w-3" />
              {quest.xp_reward} XP
            </span>
            <span className="flex items-center gap-1 text-yellow-400">
              <Coins className="h-3 w-3" />
              {quest.gold_reward} Gold
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
