import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Sword, Shield, Trophy, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import qbLogo from '@/assets/qb-logo.png';

const emailSchema = z.string().email('Please enter a valid email address');

export default function Landing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950/90 via-orange-950/80 to-stone-950 text-stone-100 overflow-hidden relative font-tech">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50"
        >
          <source src="/videos/camp-main.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-orange-900/30 to-stone-950/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <img src={qbLogo} alt="Questbound" className="h-10 w-auto" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/auth')}
            className="border-amber-400/40 text-amber-100 hover:bg-amber-500/20 hover:border-amber-400/60 font-tech"
          >
            Sign In
          </Button>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
          <div className="max-w-lg text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm font-medium tracking-wide">
              <Sparkles className="w-4 h-4" />
              Coming Soon
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Turn Your Runs Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400">Epic Quests</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-stone-300 leading-relaxed font-light">
              Questbound transforms your daily runs into adventures. Complete quests, earn rewards, and level up your character in the real world.
            </p>

            {/* Waitlist Form */}
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-stone-900/60 border-amber-500/30 text-stone-100 placeholder:text-stone-400 focus:border-amber-400 font-tech"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-semibold tracking-wide shadow-lg shadow-amber-500/25"
              >
                {isLoading ? 'Joining...' : 'Join Waitlist'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            {/* Social Proof */}
            <p className="text-sm text-stone-400">
              Join <span className="text-amber-400 font-medium">500+</span> adventurers waiting for launch
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl w-full">
            <FeatureCard
              icon={<Sword className="w-6 h-6 text-amber-400" />}
              title="Complete Quests"
              description="Daily and weekly challenges that reward your activity"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-orange-400" />}
              title="Build Your Character"
              description="Choose your race, class, and customize your hero"
            />
            <FeatureCard
              icon={<Trophy className="w-6 h-6 text-yellow-400" />}
              title="Earn Rewards"
              description="Collect gold, XP, and exclusive titles"
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-stone-500">
          © 2025 Questbound. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-stone-900/50 backdrop-blur-sm border border-amber-500/20 text-center space-y-3 hover:border-amber-400/40 transition-colors">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10">
        {icon}
      </div>
      <h3 className="font-semibold text-stone-100 tracking-wide">{title}</h3>
      <p className="text-sm text-stone-400 font-light">{description}</p>
    </div>
  );
}
