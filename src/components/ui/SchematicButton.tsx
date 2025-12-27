import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

interface SchematicButtonProps extends Omit<ButtonProps, 'variant'> {
  showAnnotations?: boolean;
}

export const SchematicButton = React.forwardRef<HTMLButtonElement, SchematicButtonProps>(
  ({ className, children, showAnnotations = true, ...props }, ref) => {
    return (
      <div className="relative group">
        {/* Left annotation line */}
        {showAnnotations && (
          <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 flex items-center opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="w-4 h-px bg-[hsl(160_60%_40%)]" />
            <div className="w-1.5 h-1.5 border border-[hsl(160_60%_40%)] rotate-45 -ml-0.5" />
          </div>
        )}

        {/* Right annotation line */}
        {showAnnotations && (
          <div className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 flex items-center opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 border border-[hsl(160_60%_40%)] rotate-45 -mr-0.5" />
            <div className="w-4 h-px bg-[hsl(160_60%_40%)]" />
          </div>
        )}

        {/* Corner decorations */}
        {showAnnotations && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-[hsl(160_60%_40%/0.6)] opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-1 -right-1 w-2 h-2 border-r border-t border-[hsl(160_60%_40%/0.6)] opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-l border-b border-[hsl(160_60%_40%/0.6)] opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-[hsl(160_60%_40%/0.6)] opacity-60 group-hover:opacity-100 transition-opacity" />
          </>
        )}

        <Button
          ref={ref}
          variant="darkFantasy"
          className={cn(className)}
          {...props}
        >
          {children}
        </Button>
      </div>
    );
  }
);

SchematicButton.displayName = "SchematicButton";
