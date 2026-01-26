import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import qbLogo from '@/assets/qb-logo.png';
import questFeatureImg from '@/assets/quest-feature.jpg';
import progressFeatureImg from '@/assets/progress-feature.jpg';
import rewardsFeatureImg from '@/assets/rewards-feature.jpg';

const emailSchema = z.string().email('Please enter a valid email address');

type TabId = 'quest' | 'earn' | 'compete';

export default function Landing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('quest');

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Invalid email",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('waitlist_emails')
        .insert({ email: email.toLowerCase().trim() });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already on the list!",
            description: "You're already signed up for early access.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "You're in!",
          description: "We'll notify you when Questbound launches.",
        });
        setEmail('');
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'quest', label: 'Quest' },
    { id: 'earn', label: 'Earn' },
    { id: 'compete', label: 'Compete' },
  ];

  return (
    <div className="min-h-screen bg-white font-tech">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 bg-white">
        <img src={qbLogo} alt="Questbound" className="h-8 w-auto" />
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/auth')}
            className="text-stone-600 hover:text-stone-900 text-sm tracking-wide transition-colors font-tech"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white pt-16 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Image Placeholder */}
          <div className="relative w-full max-w-2xl mx-auto h-64 md:h-80 mb-8">
            <div className="absolute inset-0 bg-stone-100 rounded-2xl flex items-center justify-center">
              <span className="text-stone-400 text-sm font-tech">Hero Image</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight mb-4 font-tech font-bold tracking-tight">
            QUESTBOUND<br />
            adventure is out there!
          </h1>

          {/* Subtitle */}
          <p className="text-stone-600 text-lg md:text-xl max-w-xl mx-auto mb-8 font-tech font-light">
            Earn glory and gold in real life quests.
          </p>

          {/* CTA Button */}
          <Button
            onClick={() => navigate('/auth')}
            className="h-12 px-8 bg-emerald-800 hover:bg-emerald-700 text-white font-tech font-medium tracking-wide rounded-full text-base shadow-[0_0_30px_8px_hsl(43_85%_55%/0.4)] hover:shadow-[0_0_40px_12px_hsl(43_85%_55%/0.6)] transition-all duration-300"
          >
            Dive into your Adventure
          </Button>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white py-8 px-6 border-b border-stone-200">
        <div className="flex items-center justify-center gap-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm md:text-base font-tech font-medium tracking-wide uppercase transition-colors pb-2 border-b-2 ${
                activeTab === tab.id
                  ? 'text-stone-900 border-stone-900'
                  : 'text-stone-400 border-transparent hover:text-stone-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Section Header */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-stone-900 leading-tight mb-4 font-tech font-bold">
            Main quests, Side quests, they are a real thing now.
          </h2>
        </div>
      </section>

      {/* Feature Section 1 */}
      <FeatureSection
        tagline="Quest"
        headline="Turn life into adventure"
        description="Receive your quests, track your progress, earn gear, gold and glory!"
        features={[
          { badge: 'New', title: 'Receive Your Quest', description: "Each day you will receive big or small quests, each class, location, quester will receive different quests depending on what's going on and where you are!", image: questFeatureImg },
          { badge: 'New', title: 'Track Your Progress', description: 'Watch your character grow stronger as you complete more quests over time.', image: progressFeatureImg },
          { title: 'Earn Real Rewards', description: 'Main and side quests will reward you with Gold, XP, Items or real money!', image: rewardsFeatureImg },
        ]}
        ctaText="Start questing"
        onCtaClick={() => navigate('/auth')}
      />

      {/* Feature Section 2 */}
      <FeatureSection
        tagline="Earn"
        headline="Discover legendary Quests"
        description="Legendary quests will bring you real gold (real money) to complete certain quests! Be a worthy adventurer and the grand wizard will bring you high level Quests to earn real money to complete!"
        features={[
          { badge: 'New', title: 'Location-Based Quests', description: 'Discover quests tied to real-world locations and landmarks near you.' },
          { badge: 'New', title: 'Seasonal Events', description: 'Join limited-time events with exclusive rewards and community challenges.' },
          { title: 'Explore XP', description: 'Explore paths or run to gain XP and gold for your character.' },
        ]}
        ctaText="Start exploring"
        onCtaClick={() => navigate('/auth')}
      />

      {/* Feature Section 3 */}
      <FeatureSection
        tagline="Band Together"
        headline="Create your Guild and Quest together!"
        description="Questing is better with friends, create your own Guilds, adventure together, earn gold together! Some Quests may need some extra hands!"
        features={[
          { title: 'Climb the Leaderboards', description: 'See how you rank against other adventurers in your area and globally.' },
          { title: 'Challenge Your Friends', description: 'Create custom challenges and invite your friends to compete.' },
          { title: 'Earn Legendary Titles', description: 'Complete epic quests to unlock rare titles and show off your achievements.' },
        ]}
        ctaText="Start competing"
        onCtaClick={() => navigate('/auth')}
      />

      {/* Comparison Table */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-stone-900 text-center mb-12 font-tech font-bold">
            And by everything, we mean everything
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-4 pr-4 font-tech font-medium text-stone-500 text-sm">Feature</th>
                  <th className="text-center py-4 px-4 font-tech font-medium text-stone-500 text-sm">Free</th>
                  <th className="text-center py-4 pl-4 font-tech font-medium text-stone-500 text-sm">Premium</th>
                </tr>
              </thead>
              <tbody className="font-tech text-sm">
                <ComparisonRow feature="Record your activities" free={true} premium={true} />
                <ComparisonRow feature="Complete daily quests" free={true} premium={true} />
                <ComparisonRow feature="Track XP and level up" free={true} premium={true} />
                <ComparisonRow feature="Access all quest types" free={false} premium={true} />
                <ComparisonRow feature="Earn bonus gold rewards" free={false} premium={true} />
                <ComparisonRow feature="Exclusive gear and titles" free={false} premium={true} />
                <ComparisonRow feature="Priority quest access" free={false} premium={true} />
                <ComparisonRow feature="Compete on leaderboards" free={false} premium={true} />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-white py-16 px-6 border-t border-stone-200">
        <div className="max-w-2xl mx-auto text-center">
          {/* Optional small image placeholder */}
          <div className="w-32 h-32 mx-auto mb-8 bg-stone-100 rounded-xl flex items-center justify-center">
            <span className="text-stone-400 text-xs font-tech">Badge</span>
          </div>

          <h2 className="text-2xl md:text-3xl text-stone-900 mb-4 font-tech font-bold">
            Every quest completed brings you closer to greatness. Welcome to the adventure.
          </h2>

          <p className="text-stone-500 text-sm mb-8 font-tech">
            Join thousands of adventurers already on their quest.
          </p>

          {/* Waitlist Form */}
          <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-orange-500 font-tech rounded-full px-5"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 bg-emerald-800 hover:bg-emerald-700 text-white font-tech font-medium tracking-wide rounded-full shadow-[0_0_30px_8px_hsl(43_85%_55%/0.4)] hover:shadow-[0_0_40px_12px_hsl(43_85%_55%/0.6)] transition-all duration-300"
            >
              {isLoading ? 'Joining...' : 'Get Early Access'}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 py-8 px-6 text-center">
        <p className="text-stone-400 text-sm font-tech">
          © 2025 Questbound. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

type FeatureItem = {
  badge?: string;
  title: string;
  description: string;
  image?: string;
};

type FeatureSectionProps = {
  tagline: string;
  headline: string;
  description: string;
  features: FeatureItem[];
  ctaText: string;
  onCtaClick: () => void;
};

function FeatureSection({ tagline, headline, description, features, ctaText, onCtaClick }: FeatureSectionProps) {
  return (
    <section className="bg-white py-16 px-6 border-t border-stone-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-orange-500 text-sm font-tech font-medium uppercase tracking-widest mb-2 block">
            {tagline}
          </span>
          <h3 className="text-2xl md:text-3xl lg:text-4xl text-stone-900 mb-4 font-tech font-bold">
            {headline}
          </h3>
          <p className="text-stone-600 text-base md:text-lg max-w-2xl mx-auto font-tech font-light">
            {description}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              {/* Feature Image */}
              <div className="aspect-square bg-stone-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                {feature.image ? (
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-stone-400 text-xs font-tech">Feature Image</span>
                )}
              </div>
              
              {feature.badge && (
                <span className="inline-block bg-orange-100 text-orange-600 text-xs font-tech font-medium px-2 py-1 rounded mb-2">
                  {feature.badge}
                </span>
              )}
              
              <h4 className="text-lg text-stone-900 mb-2 font-tech font-semibold">
                {feature.title}
              </h4>
              <p className="text-stone-600 text-sm font-tech font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div className="text-center">
          <Button
            onClick={onCtaClick}
            className="h-11 px-6 bg-emerald-800 hover:bg-emerald-700 text-white font-tech font-medium tracking-wide rounded-full shadow-[0_0_30px_8px_hsl(43_85%_55%/0.4)] hover:shadow-[0_0_40px_12px_hsl(43_85%_55%/0.6)] transition-all duration-300"
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
}

function ComparisonRow({ feature, free, premium }: { feature: string; free: boolean; premium: boolean }) {
  return (
    <tr className="border-b border-stone-100">
      <td className="py-4 pr-4 text-stone-700">{feature}</td>
      <td className="py-4 px-4 text-center">
        {free ? (
          <Check className="w-5 h-5 text-green-500 mx-auto" />
        ) : (
          <X className="w-5 h-5 text-stone-300 mx-auto" />
        )}
      </td>
      <td className="py-4 pl-4 text-center">
        {premium ? (
          <Check className="w-5 h-5 text-green-500 mx-auto" />
        ) : (
          <X className="w-5 h-5 text-stone-300 mx-auto" />
        )}
      </td>
    </tr>
  );
}
