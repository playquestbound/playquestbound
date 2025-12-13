import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleQuestModalProps {
  questTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (scheduledFor: string) => void;
  isLoading?: boolean;
}

// Generate time options in 30-minute intervals
const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = (i % 2) * 30;
  const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const label = format(new Date(`2000-01-01T${time}`), 'h:mm a');
  return { value: time, label };
});

export function ScheduleQuestModal({
  questTitle,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: ScheduleQuestModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("09:00");

  const handleSubmit = () => {
    if (!selectedDate) return;
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hours, minutes, 0, 0);
    onConfirm(scheduledDate.toISOString());
  };

  // Get timezone abbreviation
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Calculate preview text
  const getPreviewText = () => {
    if (!selectedDate) return null;
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hours, minutes, 0, 0);
    return format(scheduledDate, "EEEE, MMMM d, yyyy 'at' h:mm a");
  };

  const previewText = getPreviewText();

  // Disable past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-400" />
            Schedule Quest
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <p className="text-sm text-muted-foreground">
            Schedule <strong className="text-foreground">"{questTitle}"</strong> to go live at a specific date and time.
          </p>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-muted border-border",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border z-50" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < today}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time
            </Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-full bg-muted border-border">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50 max-h-[300px]">
                {timeOptions.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Timezone: {timezone}
            </p>
          </div>

          {/* Preview */}
          {previewText && (
            <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">This quest will go live on:</p>
              <p className="text-base font-semibold text-blue-400">{previewText}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedDate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Quest'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
