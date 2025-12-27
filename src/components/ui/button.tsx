import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-display font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-parchment",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-border bg-card hover:bg-muted hover:border-secondary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-gold",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-secondary underline-offset-4 hover:underline",
        fantasy: "relative font-display font-semibold tracking-wide uppercase text-sm bg-gradient-to-b from-leather-light to-leather text-secondary border-2 border-secondary shadow-[0_4px_12px_hsl(var(--leather)/0.4),inset_0_1px_1px_hsl(50_60%_70%/0.1)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_hsl(var(--leather)/0.5),0_0_20px_hsl(var(--secondary)/0.3)]",
        gold: "bg-gradient-to-r from-secondary to-gold-dark text-primary font-bold uppercase tracking-wider border-2 border-secondary/50 shadow-gold hover:shadow-[0_0_30px_hsl(43_85%_55%/0.5)] hover:-translate-y-0.5",
        darkFantasy: "relative font-display font-bold uppercase tracking-[0.2em] text-sm bg-gradient-to-b from-[hsl(160_40%_12%)] to-[hsl(160_30%_6%)] text-[hsl(160_80%_65%)] border border-[hsl(160_60%_35%/0.5)] hover:border-[hsl(160_70%_50%/0.8)] hover:text-[hsl(160_90%_75%)] dark-fantasy-glow",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
