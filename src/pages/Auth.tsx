import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SchematicButton } from '@/components/ui/SchematicButton';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Sword, User, Calendar, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  birthday: z.string().min(1, 'Birthday is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitlistLoading, setIsWaitlistLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidation = z.string().email().safeParse(waitlistEmail);
    if (!emailValidation.success) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsWaitlistLoading(true);
    try {
      const { error } = await supabase
        .from('waitlist_emails')
        .insert({ email: waitlistEmail });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already on the list!',
            description: "You're already signed up for the waitlist.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Welcome to the quest!',
          description: "You're on the waitlist. We'll notify you when it's your turn.",
        });
        setWaitlistEmail('');
        setShowWaitlist(false);
      }
    } catch (error: any) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsWaitlistLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        toast({
          title: 'Validation Error',
          description: validation.error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    } else {
      const validation = signupSchema.safeParse({ fullName, birthday, email, password });
      if (!validation.success) {
        toast({
          title: 'Validation Error',
          description: validation.error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password, { fullName, birthday });

      if (error) {
        let message = error.message;
        if (error.message.includes('Invalid login credentials')) {
          message = 'Invalid email or password. Please try again.';
        } else if (error.message.includes('User already registered')) {
          message = 'An account with this email already exists. Try logging in.';
        }
        toast({
          title: 'Authentication Failed',
          description: message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: isLogin ? 'Welcome back, adventurer!' : 'Account created!',
          description: isLogin ? 'Your journey continues...' : 'Time to create your character!',
        });
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(180deg, hsl(0 0% 8%) 0%, hsl(0 0% 18%) 50%, hsl(0 0% 12%) 100%)' }}
    >
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div 
          className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center animate-float"
          style={{ backgroundColor: 'hsl(0 65% 25% / 0.3)' }}
        >
          <Sword className="w-12 h-12" style={{ color: 'hsl(50 60% 85%)' }} />
        </div>
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'hsl(50 60% 85%)' }}>Questbound</h1>
        <p className="text-muted-foreground max-w-xs mx-auto">
          Embark on real-world adventures. Earn glory and gold.
        </p>
      </div>

      {/* Auth Card */}
      <div 
        className="w-full max-w-sm p-6 rounded-lg border"
        style={{ 
          backgroundColor: 'hsl(0 65% 25% / 0.2)',
          borderColor: 'hsl(0 65% 25% / 0.5)'
        }}
      >
        <h2 className="font-display text-xl font-semibold text-center mb-6" style={{ color: 'hsl(50 60% 85%)' }}>
          {isLogin ? 'Continue Your Journey' : 'Begin Your Adventure'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 bg-background/50 border-muted"
                  required
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="Birthday"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="pl-10 bg-background/50 border-muted"
                  required
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-background/50 border-muted"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-background/50 border-muted"
              required
            />
          </div>

          <div className="flex justify-center px-4">
            <SchematicButton
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isLogin ? 'Entering...' : 'Creating...'}
                </>
              ) : (
                isLogin ? 'Enter the Realm' : 'Create Account'
              )}
            </SchematicButton>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground transition-colors"
          >
            {isLogin ? "New adventurer? " : "Already have an account? "}
            <span className="font-semibold" style={{ color: 'hsl(50 60% 85%)' }}>
              {isLogin ? 'Sign up' : 'Log in'}
            </span>
          </button>
        </div>

        {/* Waitlist Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-muted-foreground/30" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-muted-foreground/30" />
        </div>

        {/* Waitlist Section */}
        {showWaitlist ? (
          <form onSubmit={handleWaitlistSubmit} className="mt-4 space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                className="pl-10 bg-background/50 border-muted"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowWaitlist(false)}
                className="flex-1 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <SchematicButton
                type="submit"
                size="sm"
                className="flex-1"
                disabled={isWaitlistLoading}
              >
                {isWaitlistLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Join Waitlist'
                )}
              </SchematicButton>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowWaitlist(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors border border-muted-foreground/30 rounded-lg hover:border-muted-foreground/50"
          >
            <Sparkles className="w-4 h-4" style={{ color: 'hsl(50 60% 85%)' }} />
            Join the Waitlist
          </button>
        )}
      </div>
    </div>
  );
}
