interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i + 1 === currentStep
              ? 'w-6 bg-secondary'
              : i + 1 < currentStep
              ? 'bg-secondary/60'
              : 'bg-muted-foreground/30'
          }`}
        />
      ))}
      <span className="ml-2 text-xs text-muted-foreground font-display">
        {currentStep} of {totalSteps}
      </span>
    </div>
  );
}
