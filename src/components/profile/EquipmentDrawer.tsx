import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Backpack, Shirt, Crown, Footprints, Gem, Lock } from 'lucide-react';

const EQUIPMENT_SLOTS = [
  { id: 'head', label: 'Head', icon: Crown },
  { id: 'chest', label: 'Chest', icon: Shirt },
  { id: 'feet', label: 'Feet', icon: Footprints },
  { id: 'accessory', label: 'Accessory', icon: Gem },
];

interface EquipmentDrawerProps {
  children?: React.ReactNode;
}

export function EquipmentDrawer({ children }: EquipmentDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button 
            size="icon" 
            variant="outline"
            className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-secondary bg-card/80 backdrop-blur hover:bg-secondary/20"
          >
            <Backpack className="w-6 h-6 text-secondary" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-card border-l border-border">
        <SheetHeader>
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            <Backpack className="w-5 h-5 text-secondary" />
            Equipment
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {/* Equipment Slots */}
          <div className="grid grid-cols-2 gap-3">
            {EQUIPMENT_SLOTS.map((slot) => {
              const Icon = slot.icon;
              return (
                <div
                  key={slot.id}
                  className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-secondary/50 transition-colors cursor-pointer group"
                >
                  <div className="relative">
                    <Icon className="w-8 h-8 text-muted-foreground group-hover:text-secondary transition-colors" />
                    <Lock className="w-4 h-4 absolute -bottom-1 -right-1 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">{slot.label}</span>
                </div>
              );
            })}
          </div>

          {/* Coming Soon Message */}
          <div className="parchment-card p-4 text-center">
            <p className="font-display font-semibold mb-2">Equipment Coming Soon!</p>
            <p className="text-sm text-muted-foreground">
              Complete quests to unlock gear and customize your adventurer's look.
            </p>
          </div>

          {/* Inventory Preview */}
          <div>
            <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
              <Backpack className="w-4 h-4" />
              Inventory
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded border border-border bg-muted/20 flex items-center justify-center"
                >
                  <span className="text-muted-foreground/30 text-xs">?</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
