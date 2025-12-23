import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RACES, Gender } from '@/lib/races';
import { useRaceModels, useUploadRaceModel, useDeleteRaceModel } from '@/hooks/useRaceModels';

export default function ModelManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedRace, setSelectedRace] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<Gender>('male');
  const [dragActive, setDragActive] = useState(false);
  
  const { data: models, isLoading } = useRaceModels();
  const uploadMutation = useUploadRaceModel();
  const deleteMutation = useDeleteRaceModel();
  
  const handleFileSelect = async (file: File) => {
    if (!selectedRace) {
      toast({
        title: 'Select a race',
        description: 'Please select a race before uploading a model.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload a GLB or GLTF file.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await uploadMutation.mutateAsync({
        raceId: selectedRace,
        gender: selectedGender,
        file,
      });
      
      toast({
        title: 'Model uploaded',
        description: `${selectedRace} ${selectedGender} model has been uploaded.`,
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };
  
  const handleDelete = async (id: string, raceName: string, gender: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: 'Model deleted',
        description: `${raceName} ${gender} model has been removed.`,
      });
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const getModelForRace = (raceId: string, gender: Gender) => {
    return models?.find(m => m.race_id === raceId && m.gender === gender);
  };
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/admin/quests')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">3D Model Management</h1>
        </div>
        
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Character Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Race</label>
                <Select value={selectedRace} onValueChange={setSelectedRace}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    {RACES.map(race => (
                      <SelectItem key={race.id} value={race.id}>
                        {race.emoji} {race.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Gender</label>
                <Select value={selectedGender} onValueChange={(v) => setSelectedGender(v as Gender)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Drop Zone */}
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                ${dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'}
                ${!selectedRace ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => selectedRace && fileInputRef.current?.click()}
            >
              {uploadMutation.isPending ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-muted-foreground">Uploading model...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Drag & drop a GLB file here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports .glb and .gltf files
                  </p>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
                e.target.value = '';
              }}
            />
          </CardContent>
        </Card>
        
        {/* Models Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Models</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RACES.map(race => (
                  <div key={race.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span>{race.emoji}</span>
                      {race.name}
                    </h3>
                    
                    <div className="space-y-2">
                      {(['male', 'female'] as Gender[]).map(gender => {
                        const model = getModelForRace(race.id, gender);
                        return (
                          <div 
                            key={gender}
                            className={`
                              flex items-center justify-between p-2 rounded
                              ${model ? 'bg-green-500/10' : 'bg-muted'}
                            `}
                          >
                            <span className="capitalize flex items-center gap-2">
                              {gender}
                              {model && <Check className="h-4 w-4 text-green-500" />}
                            </span>
                            
                            {model ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(model.id, race.name, gender)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">No model</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
