import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Video, ArrowLeft, Circle, Square, RotateCcw, 
  Loader2, CheckCircle, AlertCircle, Camera
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface VideoStepProps {
  questId: string;
  onComplete: (videoUrl: string) => void;
  onBack: () => void;
}

const MIN_DURATION = 15;
const MAX_DURATION = 60;

export function VideoStep({ questId, onComplete, onBack }: VideoStepProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"select" | "record" | "preview" | "uploading">("select");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setMode("record");
    } catch (err) {
      console.error("Camera error:", err);
      setError("Failed to access camera. Please check permissions.");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setVideoBlob(blob);
      const url = URL.createObjectURL(blob);
      setVideoPreviewUrl(url);
      setMode("preview");
      
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= MAX_DURATION) {
          stopRecording();
        }
        return newTime;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };


  const resetVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoBlob(null);
    setVideoPreviewUrl(null);
    setRecordingTime(0);
    setMode("select");
    setError(null);
  };

  const uploadVideo = async () => {
    if (!videoBlob || !user) return;

    setMode("uploading");
    setError(null);
    setUploadProgress(0);

    try {
      const fileName = `${user.id}/${questId}/${Date.now()}.webm`;
      
      // Simulate progress for UX (Supabase doesn't provide progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, videoBlob, {
          cacheControl: "3600",
          upsert: false,
        });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      setUploadProgress(100);

      // Use signed URL instead of public URL for privacy
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("videos")
        .createSignedUrl(data.path, 86400); // 24 hour expiry

      if (signedUrlError) throw signedUrlError;

      // Store the path (not the URL) so we can generate fresh signed URLs later
      onComplete(data.path);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload video");
      setMode("preview");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const canStop = recordingTime >= MIN_DURATION;

  return (
    <div className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-bold text-foreground">Video Journal</h2>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {mode === "select" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
            <Video className="h-16 w-16 text-primary" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground">Record Your Adventure</p>
              <p className="text-sm text-muted-foreground">
                Capture a {MIN_DURATION}-{MAX_DURATION} second video of your quest completion
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button onClick={startCamera} className="w-full max-w-xs">
              <Camera className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center max-w-xs">
              Videos must be recorded live to verify quest completion
            </p>
          </div>
        )}

        {mode === "record" && (
          <div className="flex-1 flex flex-col relative bg-black">
            <video
              ref={videoRef}
              className="flex-1 object-cover"
              autoPlay
              muted
              playsInline
            />
            
            {/* Recording overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Timer */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <div className={`px-4 py-2 rounded-full ${
                  isRecording ? "bg-red-500" : "bg-black/50"
                } text-white font-mono text-lg flex items-center gap-2`}>
                  {isRecording && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  {formatTime(recordingTime)}
                </div>
              </div>

              {/* Helper text */}
              {isRecording && recordingTime < MIN_DURATION && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
                  Minimum {MIN_DURATION} seconds
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
              {!isRecording ? (
                <Button 
                  size="lg"
                  onClick={startRecording}
                  className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
                >
                  <Circle className="h-8 w-8" />
                </Button>
              ) : (
                <Button 
                  size="lg"
                  onClick={stopRecording}
                  disabled={!canStop}
                  className={`h-16 w-16 rounded-full ${
                    canStop ? "bg-red-500 hover:bg-red-600" : "bg-gray-500"
                  }`}
                >
                  <Square className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
        )}

        {mode === "preview" && videoPreviewUrl && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-black relative">
              <video
                src={videoPreviewUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            </div>
            
            <div className="p-4 space-y-3 border-t border-border">
              <div className="flex items-center justify-center text-green-500">
                <CheckCircle className="h-5 w-5 mr-2" />
                Video ready!
              </div>

              {error && (
                <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={resetVideo} className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
                <Button onClick={uploadVideo} className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Use This Video
                </Button>
              </div>
            </div>
          </div>
        )}

        {mode === "uploading" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground">Uploading Video...</p>
              <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
            </div>
            <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
