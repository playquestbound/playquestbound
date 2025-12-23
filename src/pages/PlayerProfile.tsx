import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { CharacterDisplay } from '@/components/profile/CharacterDisplay';
import { StatOrb } from '@/components/profile/StatOrb';
import { getRaceName } from '@/lib/races';
import { getXpProgress, formatNumber } from '@/lib/levelSystem';
import { ArrowLeft, Sparkles, Star, Shield, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Customization {
  skinTone?: string;
  hairStyle?: string;
  hairColor?: string;
  eyeColor?: string;
}

export default function PlayerProfile() {
  const { playerId } = useParams();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['player-profile', playerId],
    queryFn: async () => {
      // Use public_profiles view for viewing other players (excludes sensitive data like gold)
      const { data, error } = await supabase
        .from('public_profiles')
        .select('*')
        .eq('id', playerId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });

  const { data: completedQuests } = useQuery({
    queryKey: ['player-quests', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_quests')
        .select('id')
        .eq('user_id', playerId)
        .eq('status', 'completed');
      
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pb-20 flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Adventurer not found</p>
        <Button onClick={() => navigate('/search-players')}>Go Back</Button>
      </div>
    );
  }

  const xpProgress = getXpProgress(profile.xp, profile.level);
  const customization = profile.customization as Customization | null;
  const questsCompleted = completedQuests?.length || 0;

  return (
    <div className="min-h-screen bg-background pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative p-4 space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Adventurer Profile</h1>
        </div>

        {/* Character Name & Class Badge */}
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold mb-1">
            {profile.character_name || 'Adventurer'}
          </h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border">
            <Shield className="w-3.5 h-3.5 text-secondary" />
            <span className="text-sm text-muted-foreground">
              {getRaceName(profile.race || 'human')} {profile.class ? `• ${profile.class.charAt(0).toUpperCase() + profile.class.slice(1)}` : ''}
            </span>
          </div>
        </div>

        {/* Character Display with Stats */}
        <div className="relative py-8">
          {/* Top Stats */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
            <StatOrb 
              icon={Star} 
              value={profile.level} 
              label="Level" 
              color="level" 
            />
          </div>

          {/* Left Stat */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
            <StatOrb 
              icon={Sparkles} 
              value={formatNumber(profile.xp)} 
              label="XP" 
              color="xp" 
            />
          </div>

          {/* Right Stat */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
            <StatOrb 
              icon={Star} 
              value={questsCompleted} 
              label="Quests" 
              color="quest" 
            />
          </div>

          {/* Character Display */}
          <div className="flex items-center justify-center py-8">
            <CharacterDisplay 
              customization={customization}
              race={profile.race}
              characterClass={profile.class}
            />
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="parchment-card p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Level {profile.level} Progress</span>
            <span className="font-display font-semibold text-xp">
              {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.required)} XP
            </span>
          </div>
          <div className="xp-bar h-3 rounded-full overflow-hidden">
            <div 
              className="xp-bar-fill h-full transition-all duration-500" 
              style={{ width: `${xpProgress.percentage}%` }}
            />
          </div>
        </div>

        {/* Member Since */}
        <div className="parchment-card p-4 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">Member Since</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(profile.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
