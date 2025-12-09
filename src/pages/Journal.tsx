import { useState } from 'react';
import { useCompletedQuests, UserQuest } from '@/hooks/useQuests';
import { BottomNav } from '@/components/BottomNav';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, Coins, Sparkles, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';

export default function Journal() {
  const { data: completedQuests, isLoading } = useCompletedQuests();
  const [selectedEntry, setSelectedEntry] = useState<UserQuest | null>(null);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center py-4">
          <BookOpen className="w-10 h-10 mx-auto mb-2 text-secondary" />
          <h1 className="font-display text-2xl font-bold">Adventure Journal</h1>
          <p className="text-sm text-muted-foreground">Your completed quests</p>
        </div>

        {/* Journal Entries Grid */}
        {completedQuests && completedQuests.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {completedQuests.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="parchment-card p-0 overflow-hidden text-left hover:shadow-gold transition-shadow"
              >
                {/* Video Thumbnail */}
                <div className="aspect-video bg-muted relative">
                  {entry.video_url ? (
                    <>
                      <video
                        src={entry.video_url}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                        <div className="w-10 h-10 rounded-full bg-secondary/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-secondary-foreground ml-0.5" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Entry Info */}
                <div className="p-2">
                  <h3 className="font-display text-xs font-semibold line-clamp-1">
                    {entry.quest?.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {entry.completed_at && format(new Date(entry.completed_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="parchment-card p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-display font-semibold mb-2">No Entries Yet</h3>
            <p className="text-sm text-muted-foreground">
              Complete quests to fill your adventure journal with memories.
            </p>
          </div>
        )}
      </div>

      {/* Entry Detail Modal */}
      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="parchment-card max-w-md mx-auto p-0 overflow-hidden">
          {selectedEntry && (
            <>
              {/* Video Player */}
              <div className="aspect-video bg-foreground relative">
                {selectedEntry.video_url ? (
                  <video
                    src={selectedEntry.video_url}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/80 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-background" />
                </button>
              </div>

              {/* Entry Details */}
              <div className="p-4">
                <h2 className="font-display text-lg font-bold mb-1">
                  {selectedEntry.quest?.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedEntry.quest?.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {selectedEntry.completed_at && 
                        format(new Date(selectedEntry.completed_at), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-xp" />
                    <span className="font-display font-semibold text-xp">
                      +{selectedEntry.quest?.xp_reward} XP
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-secondary" />
                    <span className="font-display font-semibold text-secondary">
                      +{selectedEntry.quest?.gold_reward} Gold
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setSelectedEntry(null)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
