import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface VideoUploaderProps {
  onUploadComplete: (videoUrl: string) => void;
  onCancel: () => void;
}

export function VideoUploader({ onUploadComplete, onCancel }: VideoUploaderProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a video file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select a video under 100MB.',
        variant: 'destructive',
      });
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!videoFile || !user) return;

    setIsUploading(true);
    try {
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      onUploadComplete(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="parchment-card p-4">
      <h3 className="font-display font-semibold text-lg mb-3">Adventure Journal Entry</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Record or upload a short video (30-60 seconds) documenting your adventure.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!videoFile ? (
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-24 flex-col gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Video className="w-8 h-8 text-muted-foreground" />
            <span>Record or Select Video</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {videoPreview && (
            <div className="relative rounded-lg overflow-hidden">
              <video
                src={videoPreview}
                controls
                className="w-full aspect-video object-cover"
              />
              <button
                onClick={clearVideo}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive flex items-center justify-center"
              >
                <X className="w-4 h-4 text-destructive-foreground" />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="gold"
              className="flex-1"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Complete
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
