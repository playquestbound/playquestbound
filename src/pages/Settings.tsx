import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Eye, Link2, Apple, Watch, Activity, Palette, Check, Sparkles, Sun, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNavTheme, navThemes, NavTheme, designStyles, DesignStyle } from '@/hooks/useNavTheme';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
export default function Settings() {
  const navigate = useNavigate();
  const [publicJournal, setPublicJournal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { theme: currentTheme, setTheme, designStyle, setDesignStyle } = useNavTheme();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Sign out the user first
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Account Deletion Requested',
        description: 'Your account deletion has been initiated. You will be signed out.',
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process account deletion',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublicJournalToggle = (checked: boolean) => {
    setPublicJournal(checked);
    toast({
      title: checked ? 'Journal Now Public' : 'Journal Now Private',
      description: checked 
        ? 'Other adventurers can now view your quest videos' 
        : 'Your quest videos are now hidden from others',
    });
  };

  const integrations = [
    { name: 'Apple Fitness', icon: Apple, connected: false },
    { name: 'Whoop', icon: Watch, connected: false },
    { name: 'Strava', icon: Activity, connected: false },
  ];

  const handleConnect = (name: string) => {
    toast({
      title: 'Coming Soon',
      description: `${name} integration will be available soon!`,
    });
  };

  const handleThemeChange = (theme: NavTheme) => {
    setTheme(theme);
    toast({
      title: 'Theme Updated',
      description: `Color scheme set to ${navThemes[theme].name}`,
    });
  };

  const handleDesignStyleChange = (style: DesignStyle) => {
    setDesignStyle(style);
    toast({
      title: 'Design Style Updated',
      description: `Switched to ${designStyles[style].name} design`,
    });
  };

  const themeOptions: { id: NavTheme; preview: string; glow: string }[] = [
    { id: 'classic', preview: '#ffffff', glow: 'transparent' },
    { id: 'blue', preview: '#60d0ff', glow: 'rgba(96, 208, 255, 0.5)' },
    { id: 'orange', preview: '#ffaa40', glow: 'rgba(255, 170, 64, 0.5)' },
    { id: 'green', preview: '#90ff50', glow: 'rgba(144, 255, 80, 0.5)' },
    { id: 'red', preview: '#ff5050', glow: 'rgba(255, 80, 80, 0.5)' },
  ];

  const designStyleOptions: { id: DesignStyle; icon: typeof Sparkles; gradient: string }[] = [
    { id: 'sleek', icon: Sparkles, gradient: 'from-gray-600 to-gray-800' },
    { id: 'modern', icon: Sun, gradient: 'from-emerald-700 to-emerald-900' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-6 pb-24">
        {/* Design Style Section */}
        <div className="parchment-card p-4 space-y-4">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Design Style
          </h2>
          
          <p className="text-xs text-muted-foreground">
            Choose your preferred visual style
          </p>

          <div className="grid grid-cols-2 gap-3">
            {designStyleOptions.map(({ id, icon: Icon, gradient }) => (
              <button
                key={id}
                onClick={() => handleDesignStyleChange(id)}
                className={cn(
                  "relative p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-200 border-2",
                  designStyle === id 
                    ? "border-primary bg-primary/10 scale-[1.02]" 
                    : "border-border/50 bg-card/50 hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br",
                  gradient
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-display font-semibold text-sm">
                  {designStyles[id].name}
                </span>
                <span className="text-[10px] text-muted-foreground text-center">
                  {designStyles[id].description}
                </span>
                {designStyle === id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme Section */}
        <div className="parchment-card p-4 space-y-4">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5 text-secondary" />
            Navigation Theme
          </h2>
          
          <p className="text-xs text-muted-foreground">
            Choose a color scheme for your navigation bar
          </p>

          <div className="grid grid-cols-5 gap-3">
            {themeOptions.map(({ id, preview, glow }) => (
              <button
                key={id}
                onClick={() => handleThemeChange(id)}
                className={`relative aspect-square rounded-lg flex items-center justify-center transition-all duration-200 ${
                  currentTheme === id ? 'scale-110' : 'hover:scale-105'
                }`}
                style={{
                  background: navThemes[id].bgColor,
                  boxShadow: currentTheme === id 
                    ? `0 0 20px ${glow}, 0 0 0 2px ${preview}` 
                    : `0 0 12px ${glow}`,
                  border: `2px solid ${currentTheme === id ? preview : 'transparent'}`,
                }}
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ 
                    background: preview,
                    boxShadow: `0 0 8px ${glow}`,
                  }}
                />
                {currentTheme === id && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            {themeOptions.map(({ id }) => (
              <span 
                key={id}
                className={`text-[10px] ${currentTheme === id ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
              >
                {navThemes[id].name}
              </span>
            ))}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="parchment-card p-4 space-y-4">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Eye className="w-5 h-5 text-secondary" />
            Privacy
          </h2>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-journal" className="text-sm font-medium">
                Public Journal
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow others to view your adventure journal videos
              </p>
            </div>
            <Switch
              id="public-journal"
              checked={publicJournal}
              onCheckedChange={handlePublicJournalToggle}
            />
          </div>
        </div>

        {/* Integrations Section */}
        <div className="parchment-card p-4 space-y-4">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Link2 className="w-5 h-5 text-secondary" />
            Integrations
          </h2>
          
          <div className="space-y-3">
            {integrations.map(({ name, icon: Icon, connected }) => (
              <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      {connected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleConnect(name)}
                >
                  {connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="parchment-card p-4 space-y-4 border-destructive/50">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Delete Account?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account, 
                    character, quest progress, and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
