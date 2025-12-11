import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Crown, Sparkles, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    rarity: 'legendary',
    price: 500,
    timeLeft: '2d 14h',
    imageEmoji: '👑',
  },
  {
    id: '2',
    name: 'Shadow Cloak',
    rarity: 'epic',
    price: 300,
    timeLeft: '1d 6h',
    imageEmoji: '🧥',
  },
  {
    id: '3',
    name: 'Phoenix Wings',
    rarity: 'legendary',
    price: 750,
    timeLeft: '4d 2h',
    imageEmoji: '🔥',
  },
  {
    id: '4',
    name: 'Emerald Amulet',
    rarity: 'rare',
    price: 150,
    timeLeft: '12h',
    imageEmoji: '💎',
  },
];

const rarityColors: Record<string, string> = {
  common: 'bg-muted text-muted-foreground',
  uncommon: 'bg-green-900/50 text-green-400 border-green-700',
  rare: 'bg-blue-900/50 text-blue-400 border-blue-700',
  epic: 'bg-purple-900/50 text-purple-400 border-purple-700',
  legendary: 'bg-amber-900/50 text-amber-400 border-amber-700',
};

export default function Store() {
  const [activeTab, setActiveTab] = useState<'subscription' | 'cosmetics'>('subscription');

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h1 className="text-2xl font-cinzel font-bold text-primary text-center">Store</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/50">
        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'subscription'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Crown className="w-4 h-4 inline-block mr-2" />
          Subscription
        </button>
        <button
          onClick={() => setActiveTab('cosmetics')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'cosmetics'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="w-4 h-4 inline-block mr-2" />
          Limited Items
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'subscription' ? (
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
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Clock className="w-4 h-4" />
              Limited time offers - grab them before they're gone!
            </div>
            <div className="grid grid-cols-2 gap-3">
              {LIMITED_ITEMS.map((item) => (
                <Card key={item.id} className="border-border/50 overflow-hidden">
                  <div className="aspect-square bg-card/50 flex items-center justify-center text-5xl">
                    {item.imageEmoji}
                  </div>
                  <CardContent className="p-3">
                    <Badge className={`${rarityColors[item.rarity]} text-xs mb-2`}>
                      {item.rarity}
                    </Badge>
                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-primary font-bold text-sm">
                        🪙 {item.price}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timeLeft}
                      </span>
                    </div>
                    <Button size="sm" className="w-full mt-3" variant="secondary">
                      Purchase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
