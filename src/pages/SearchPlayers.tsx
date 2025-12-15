import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getRaceName } from '@/lib/races';
import { ArrowLeft, Search, User, Star } from 'lucide-react';

interface PlayerResult {
  id: string;
  character_name: string | null;
  race: string | null;
  class: string | null;
  level: number;
  xp: number;
}

export default function SearchPlayers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, character_name, race, class, level, xp')
      .ilike('character_name', `%${searchQuery}%`)
      .limit(20);
    
    if (!error && data) {
      setResults(data);
    }
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 pt-4">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Search Adventurers</h1>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter character name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {isSearching && (
            <p className="text-center text-muted-foreground py-8">Searching...</p>
          )}
          
          {!isSearching && hasSearched && results.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No adventurers found</p>
          )}

          {results.map((player) => (
            <div 
              key={player.id}
              className="parchment-card p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/player/${player.id}`)}
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold">
                  {player.character_name || 'Unknown'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {getRaceName(player.race || 'human')} {player.class ? `• ${player.class.charAt(0).toUpperCase() + player.class.slice(1)}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">{player.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
