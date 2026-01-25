import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen font-tech">
      {/* Hero Section - Dark with video background */}
      <section className="relative min-h-screen bg-stone-950 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src="/videos/camp-main.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950" />
        </div>

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-5">
          <img src={qbLogo} alt="Questbound" className="h-8 w-auto" />
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/auth')}
              className="text-stone-300 hover:text-white text-sm tracking-wide transition-colors"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-12 pb-32">
          {/* Headline with mixed typography */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-6 font-tech">
            <span className="block font-light tracking-tight">This App</span>
            <span className="block italic text-amber-200">is Adventure</span>
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-base md:text-lg max-w-md mb-12 font-light">
            Turn your daily runs into epic quests with the first fitness app that rewards real-world adventure.
          </p>

          {/* Hero Image Placeholder - Replace with your asset */}
          <div className="relative w-64 h-80 md:w-80 md:h-96 mb-16">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center">
              <span className="text-stone-400 text-sm">Hero Image</span>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-amber-500/10 rounded-3xl blur-2xl -z-10" />
          </div>

          {/* As Seen In */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-stone-500 text-xs uppercase tracking-widest">As Seen In</span>
            <div className="flex items-center gap-8 opacity-60">
              {/* Placeholder logos - replace with actual brand images */}
              <span className="text-stone-400 text-sm font-medium">Brand 1</span>
              <span className="text-stone-400 text-sm font-medium">Brand 2</span>
              <span className="text-stone-400 text-sm font-medium">Brand 3</span>
              <span className="text-stone-400 text-sm font-medium">Brand 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section - Light/Cream */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight mb-6 font-light font-tech">
            The App That<br />
            Keeps You Moving
          </h2>

          {/* Description */}
          <p className="text-stone-600 text-base md:text-lg max-w-xl mx-auto mb-10 font-light">
            The first fitness app that rewards all your healthy actions and includes amazing benefits from your favorite brands, too!
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 font-tech rounded-full px-5"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-8 bg-emerald-700 hover:bg-emerald-600 text-white font-medium tracking-wide rounded-full"
              >
                {isLoading ? 'Joining...' : 'Reserve'}
              </Button>
            </form>
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
              className="h-12 px-8 border-stone-400 text-stone-700 hover:bg-stone-100 font-medium tracking-wide rounded-full"
            >
              Explore
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-stone-400 text-xs mb-16">
            *Available on iOS and Android soon
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
            <StatItem value="100+" label="Epic Quests" />
            <StatItem value="10x" label="XP Rewards" />
            <StatItem value="Free" label="To Start" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 py-8 px-6 text-center">
        <p className="text-stone-500 text-sm">
          © 2025 Questbound. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-light text-stone-900 mb-2 tracking-tight">
        {value}
      </div>
      <div className="text-sm text-stone-500 font-light">
        {label}
      </div>
    </div>
  );
}
