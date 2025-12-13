import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, CheckCircle, X, AlertCircle } from "lucide-react";

interface LocationStepProps {
  onComplete: (lat: number, lng: number) => void;
  onCancel: () => void;
}

export function LocationStep({ onComplete, onCancel }: LocationStepProps) {
  const [status, setStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "error">("idle");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async () => {
    setStatus("requesting");
    setError(null);

    try {
      if (!navigator.geolocation) {
        setStatus("error");
        setError("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setStatus("granted");
        },
        (err) => {
          console.error("Geolocation error:", err);
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setStatus("denied");
              setError("Location permission denied. Please enable location access in your browser settings.");
              break;
            case err.POSITION_UNAVAILABLE:
              setStatus("error");
              setError("Location information is unavailable.");
              break;
            case err.TIMEOUT:
              setStatus("error");
              setError("Location request timed out.");
              break;
            default:
              setStatus("error");
              setError("An unknown error occurred.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (err) {
      setStatus("error");
      setError("Failed to request location");
    }
  };

  useEffect(() => {
    // Auto-request on mount
    requestLocation();
  }, []);

  const handleContinue = () => {
    if (location) {
      onComplete(location.lat, location.lng);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Capture Location</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col items-center py-8 space-y-4">
        <div className={`p-6 rounded-full ${
          status === "granted" 
            ? "bg-green-500/20" 
            : status === "denied" || status === "error"
            ? "bg-red-500/20"
            : "bg-primary/20"
        }`}>
          {status === "requesting" ? (
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          ) : status === "granted" ? (
            <CheckCircle className="h-12 w-12 text-green-500" />
          ) : status === "denied" || status === "error" ? (
            <AlertCircle className="h-12 w-12 text-red-500" />
          ) : (
            <MapPin className="h-12 w-12 text-primary" />
          )}
        </div>

        <div className="text-center space-y-2">
          {status === "idle" && (
            <>
              <p className="text-lg font-medium text-foreground">Location Required</p>
              <p className="text-sm text-muted-foreground">
                We need your location to verify your quest completion
              </p>
            </>
          )}

          {status === "requesting" && (
            <>
              <p className="text-lg font-medium text-foreground">Getting Location...</p>
              <p className="text-sm text-muted-foreground">
                Please allow location access when prompted
              </p>
            </>
          )}

          {status === "granted" && location && (
            <>
              <p className="text-lg font-medium text-green-500">Location Captured!</p>
              <p className="text-sm text-muted-foreground">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </>
          )}

          {(status === "denied" || status === "error") && error && (
            <>
              <p className="text-lg font-medium text-red-500">Location Error</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        
        {(status === "denied" || status === "error") && (
          <Button onClick={requestLocation} className="flex-1">
            Try Again
          </Button>
        )}

        {status === "granted" && (
          <Button onClick={handleContinue} className="flex-1">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
