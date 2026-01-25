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
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/videos/camp-main.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
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
            className="border-muted-foreground/30 text-foreground hover:bg-muted/20"
          >
            Sign In
          </Button>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
          <div className="max-w-lg text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-display">
              <Sparkles className="w-4 h-4" />
              Coming Soon
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Turn Your Runs Into{' '}
              <span className="text-secondary">Epic Quests</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Questbound transforms your daily runs into adventures. Complete quests, earn rewards, and level up your character in the real world.
            </p>

            {/* Waitlist Form */}
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-muted/30 border-muted-foreground/20 text-foreground placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-display"
              >
                {isLoading ? 'Joining...' : 'Join Waitlist'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            {/* Social Proof */}
            <p className="text-sm text-muted-foreground">
              Join 500+ adventurers waiting for launch
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl w-full">
            <FeatureCard
              icon={<Sword className="w-6 h-6 text-secondary" />}
              title="Complete Quests"
              description="Daily and weekly challenges that reward your activity"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-secondary" />}
              title="Build Your Character"
              description="Choose your race, class, and customize your hero"
            />
            <FeatureCard
              icon={<Trophy className="w-6 h-6 text-secondary" />}
              title="Earn Rewards"
              description="Collect gold, XP, and exclusive titles"
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-muted-foreground">
          © 2025 Questbound. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30 text-center space-y-3">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
