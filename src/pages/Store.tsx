import { useState, useEffect } from 'react';
import { Crown, Sparkles, Clock, Check, Flame, Timer, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';

const SUBSCRIPTION_TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '/forever',
    features: ['5 Active Quests', 'Basic Character Customization', 'Community Leaderboard'],
    current: true,
  },
  {
    name: 'Adventurer',
    price: '$4.99',
    period: '/month',
    features: ['10 Active Quests', 'Exclusive Cosmetics', 'Priority Quest Access', 'Ad-Free Experience'],
    popular: true,
  },
  {
    name: 'Legend',
    price: '$9.99',
    period: '/month',
    features: ['Unlimited Active Quests', 'All Exclusive Cosmetics', 'Early Access Features', 'Custom Quest Creation', 'Legend Badge'],
  },
];

const LIMITED_ITEMS = [
  {
    id: '1',
    name: 'Frost Crown',
    description: 'A crown forged from eternal ice',
    rarity: 'legendary',
    price: 500,
    endTime: Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000,
    imageEmoji: '👑',
    slot: 'head',
  },
  {
    id: '2',
    name: 'Shadow Cloak',
    description: 'Woven from midnight shadows',
    rarity: 'epic',
    price: 300,
    endTime: Date.now() + 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000,
    imageEmoji: '🧥',
    slot: 'back',
  },
  {
    id: '3',
    name: 'Phoenix Wings',
    description: 'Rise from the ashes in style',
    rarity: 'legendary',
    price: 750,
    endTime: Date.now() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
    imageEmoji: '🔥',
    slot: 'back',
  },
  {
    id: '4',
    name: 'Emerald Amulet',
    description: 'Glows with ancient power',
    rarity: 'rare',
    price: 150,
    endTime: Date.now() + 12 * 60 * 60 * 1000,
    imageEmoji: '💎',
    slot: 'accessory',
  },
  {
    id: '5',
    name: 'Dragon Scale Armor',
    description: 'Impervious to fire and fear',
    rarity: 'legendary',
    price: 850,
    endTime: Date.now() + 3 * 24 * 60 * 60 * 1000,
    imageEmoji: '🐉',
    slot: 'chest',
  },
  {
    id: '6',
    name: 'Starlight Boots',
    description: 'Walk among the stars',
    rarity: 'epic',
    price: 400,
    endTime: Date.now() + 5 * 60 * 60 * 1000,
    imageEmoji: '✨',
    slot: 'feet',
  },
];

const rarityConfig: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  common: { bg: 'bg-muted/50', border: 'border-muted', glow: '', text: 'text-muted-foreground' },
  uncommon: { bg: 'bg-green-900/30', border: 'border-green-700/50', glow: 'shadow-green-500/20', text: 'text-green-400' },
  rare: { bg: 'bg-blue-900/30', border: 'border-blue-700/50', glow: 'shadow-blue-500/20', text: 'text-blue-400' },
  epic: { bg: 'bg-purple-900/30', border: 'border-purple-700/50', glow: 'shadow-purple-500/30', text: 'text-purple-400' },
  legendary: { bg: 'bg-amber-900/30', border: 'border-amber-700/50', glow: 'shadow-amber-500/40', text: 'text-amber-400' },
};

function formatTimeLeft(endTime: number): { text: string; urgent: boolean } {
  const now = Date.now();
  const diff = endTime - now;
  
  if (diff <= 0) return { text: 'Expired', urgent: true };
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return { text: `${days}d ${remainingHours}h`, urgent: false };
  }
  
  if (hours > 0) {
    return { text: `${hours}h ${minutes}m`, urgent: hours < 6 };
  }
  
  return { text: `${minutes}m`, urgent: true };
}

export default function Store() {
  const [activeTab, setActiveTab] = useState<'cosmetics' | 'subscription'>('cosmetics');
  const { data: profile } = useProfile();
  const [, setTick] = useState(0);

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const userGold = profile?.gold || 0;

  const handlePurchase = (item: typeof LIMITED_ITEMS[0]) => {
    if (userGold < item.price) {
      toast({
        title: "Not Enough Gold",
        description: `You need ${item.price - userGold} more gold to purchase ${item.name}.`,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Coming Soon!",
      description: "Item purchases will be available soon.",
    });
  };

  // Sort items by time remaining (most urgent first)
  const sortedItems = [...LIMITED_ITEMS].sort((a, b) => a.endTime - b.endTime);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header with Gold Display */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-2xl font-cinzel font-bold text-primary">Store</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-yellow-500">{userGold.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/50">
        <button
          onClick={() => setActiveTab('cosmetics')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'cosmetics'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Flame className="w-4 h-4 inline-block mr-2" />
          Limited Items
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'subscription'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Crown className="w-4 h-4 inline-block mr-2" />
          Premium
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full">
        {activeTab === 'cosmetics' ? (
          <div className="space-y-4">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-amber-500/20 border border-primary/30 p-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Limited Time</span>
                </div>
                <h2 className="text-xl font-cinzel font-bold text-foreground mb-1">Exclusive Collection</h2>
                <p className="text-sm text-muted-foreground">
                  Rare cosmetics that won't come back. Grab them before time runs out!
                </p>
              </div>
            </div>

            {/* Urgent Items (less than 12 hours) */}
            {sortedItems.filter(item => formatTimeLeft(item.endTime).urgent).length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold text-red-400">Ending Soon!</span>
                </div>
                <div className="space-y-3">
                  {sortedItems
                    .filter(item => formatTimeLeft(item.endTime).urgent)
                    .map((item) => {
                      const rarity = rarityConfig[item.rarity];
                      const timeLeft = formatTimeLeft(item.endTime);
                      const canAfford = userGold >= item.price;

                      return (
                        <Card 
                          key={item.id} 
                          className={`${rarity.bg} ${rarity.border} border overflow-hidden shadow-lg ${rarity.glow}`}
                        >
                          <div className="flex">
                            <div className="w-24 h-24 flex items-center justify-center text-4xl bg-black/20">
                              {item.imageEmoji}
                            </div>
                            <CardContent className="flex-1 p-3 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <Badge className={`${rarity.text} bg-transparent border ${rarity.border} text-xs px-1.5`}>
                                      {item.rarity}
                                    </Badge>
                                    <h3 className="font-semibold text-foreground mt-1">{item.name}</h3>
                                  </div>
                                  <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs animate-pulse">
                                    <Clock className="w-3 h-3" />
                                    {timeLeft.text}
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className={`font-bold ${canAfford ? 'text-yellow-500' : 'text-red-400'}`}>
                                  🪙 {item.price}
                                </span>
                                <Button 
                                  size="sm" 
                                  onClick={() => handlePurchase(item)}
                                  className={canAfford ? 'bg-primary' : 'bg-muted text-muted-foreground'}
                                >
                                  {canAfford ? 'Buy Now' : 'Need Gold'}
                                </Button>
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </div>
            )}

            {/* All Items Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">All Limited Items</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {sortedItems
                  .filter(item => !formatTimeLeft(item.endTime).urgent)
                  .map((item) => {
                    const rarity = rarityConfig[item.rarity];
                    const timeLeft = formatTimeLeft(item.endTime);
                    const canAfford = userGold >= item.price;

                    return (
                      <Card 
                        key={item.id} 
                        className={`${rarity.bg} ${rarity.border} border overflow-hidden shadow-lg ${rarity.glow}`}
                      >
                        <div className="aspect-square flex items-center justify-center text-5xl bg-black/20 relative">
                          {item.imageEmoji}
                          <Badge 
                            className={`absolute top-2 right-2 ${rarity.text} bg-black/50 border-none text-xs`}
                          >
                            {item.rarity}
                          </Badge>
                        </div>
                        <CardContent className="p-3 space-y-2">
                          <h3 className="font-semibold text-sm text-foreground truncate">{item.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`font-bold text-sm ${canAfford ? 'text-yellow-500' : 'text-red-400'}`}>
                              🪙 {item.price}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeLeft.text}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full" 
                            variant={canAfford ? 'default' : 'secondary'}
                            onClick={() => handlePurchase(item)}
                          >
                            {canAfford ? 'Purchase' : 'Need Gold'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center mb-6">
              Upgrade your adventure with premium features
            </p>
            {SUBSCRIPTION_TIERS.map((tier) => (
              <Card
                key={tier.name}
                className={`relative overflow-hidden ${
                  tier.popular ? 'border-primary ring-1 ring-primary' : 'border-border/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Popular
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-cinzel">
                    {tier.name}
                    {tier.current && (
                      <Badge variant="outline" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={tier.current ? 'outline' : tier.popular ? 'default' : 'secondary'}
                    disabled={tier.current}
                  >
                    {tier.current ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
