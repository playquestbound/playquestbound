import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Eye } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const navigate = useNavigate();
  const [publicJournal, setPublicJournal] = useState(false);

  const handlePublicJournalToggle = (checked: boolean) => {
    setPublicJournal(checked);
    toast({
      title: checked ? 'Journal Now Public' : 'Journal Now Private',
      description: checked 
        ? 'Other adventurers can now view your quest videos' 
        : 'Your quest videos are now hidden from others',
    });
  };

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

      <div className="p-4 max-w-lg mx-auto space-y-6">
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
      </div>
    </div>
  );
}
