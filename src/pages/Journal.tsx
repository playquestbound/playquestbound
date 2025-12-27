import { useState } from 'react';
import { useCompletedQuests, UserQuest } from '@/hooks/useQuests';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, Coins, Sparkles, Calendar, X, MapPin, Timer, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  entry_type: string;
  title: string;
  description: string | null;
  distance_km: number | null;
  duration_seconds: number | null;
  avg_pace: number | null;
  xp_earned: number | null;
  gold_earned: number | null;
  route_data: any;
  created_at: string;
}

export default function Journal() {
  const { user } = useAuth();
  const { data: completedQuests, isLoading: questsLoading } = useCompletedQuests();
  const [selectedEntry, setSelectedEntry] = useState<UserQuest | null>(null);
  const [selectedRunEntry, setSelectedRunEntry] = useState<JournalEntry | null>(null);

  const { data: journalEntries, isLoading: journalLoading } = useQuery({
    queryKey: ['journal-entries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as JournalEntry[];
    },
    enabled: !!user,
  });

  const isLoading = questsLoading || journalLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const runEntries = journalEntries?.filter(e => e.entry_type === 'run') || [];
  const hasEntries = (completedQuests && completedQuests.length > 0) || runEntries.length > 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center py-4">
          <BookOpen className="w-10 h-10 mx-auto mb-2 text-secondary" />
          <h1 className="font-display text-2xl font-bold">Adventure Journal</h1>
          <p className="text-sm text-muted-foreground">Your quests and explorations</p>
        </div>

        {/* Run Entries Section */}
        {runEntries.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Explorations
            </h2>
            <div className="space-y-2">
              {runEntries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedRunEntry(entry)}
                  className="parchment-card p-4 w-full text-left hover:shadow-gold transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-semibold">{entry.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(entry.created_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xp">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-display font-semibold">+{entry.xp_earned || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {entry.distance_km?.toFixed(2) || '0.00'} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {entry.duration_seconds ? formatDuration(entry.duration_seconds) : '--:--'}
                    </span>
                    {entry.avg_pace && (
                      <span>{entry.avg_pace.toFixed(1)} min/km</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Completed Quests Section */}
        {completedQuests && completedQuests.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" />
              Completed Quests
            </h2>
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
          </div>
        )}

        {/* Empty State */}
        {!hasEntries && (
          <div className="parchment-card p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-display font-semibold mb-2">No Entries Yet</h3>
            <p className="text-sm text-muted-foreground">
              Complete quests or go on explorations to fill your adventure journal.
            </p>
          </div>
        )}
      </div>

      {/* Run Entry Detail Modal */}
      <Dialog open={!!selectedRunEntry} onOpenChange={(open) => !open && setSelectedRunEntry(null)}>
        <DialogContent className="parchment-card max-w-md mx-auto p-4">
          {selectedRunEntry && (
            <>
              <div className="text-center mb-4">
                <MapPin className="w-10 h-10 mx-auto mb-2 text-primary" />
                <h2 className="font-display text-xl font-bold">{selectedRunEntry.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedRunEntry.created_at), 'MMMM d, yyyy • h:mm a')}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="parchment-card p-3 text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="font-display font-bold">{selectedRunEntry.distance_km?.toFixed(2) || '0.00'}</div>
                  <div className="text-xs text-muted-foreground">km</div>
                </div>
                <div className="parchment-card p-3 text-center">
                  <Timer className="w-5 h-5 mx-auto mb-1 text-secondary" />
                  <div className="font-display font-bold">
                    {selectedRunEntry.duration_seconds ? formatDuration(selectedRunEntry.duration_seconds) : '--:--'}
                  </div>
                  <div className="text-xs text-muted-foreground">time</div>
                </div>
                <div className="parchment-card p-3 text-center">
                  <Sparkles className="w-5 h-5 mx-auto mb-1 text-xp" />
                  <div className="font-display font-bold text-xp">+{selectedRunEntry.xp_earned || 0}</div>
                  <div className="text-xs text-muted-foreground">XP</div>
                </div>
              </div>

              {selectedRunEntry.avg_pace && (
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Average pace: {selectedRunEntry.avg_pace.toFixed(1)} min/km
                </p>
              )}

              {selectedRunEntry.description && (
                <p className="text-sm text-muted-foreground mb-4">{selectedRunEntry.description}</p>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedRunEntry(null)}
              >
                Close
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Quest Entry Detail Modal */}
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
    </div>
  );
}
