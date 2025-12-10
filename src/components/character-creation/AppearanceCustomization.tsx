import { SKIN_TONES, HAIR_STYLES, HAIR_COLORS, EYE_COLORS, CharacterCustomization } from '@/lib/characterData';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface AppearanceCustomizationProps {
  customization: CharacterCustomization;
  onChange: (customization: CharacterCustomization) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function AppearanceCustomization({ 
  customization, 
  onChange, 
  onContinue, 
  onBack 
}: AppearanceCustomizationProps) {
  const updateField = <K extends keyof CharacterCustomization>(
    field: K, 
    value: CharacterCustomization[K]
  ) => {
    onChange({ ...customization, [field]: value });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Customize Appearance</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Make your character unique
        </p>
      </div>

      {/* Character Preview */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-32 rounded-lg border-2 border-border bg-card flex items-center justify-center">
          <div className="text-center">
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-1"
              style={{ backgroundColor: customization.skinTone }}
            />
            <div 
              className="w-8 h-4 rounded-t-full mx-auto -mt-3"
              style={{ backgroundColor: customization.hairColor }}
            />
            <div className="flex gap-1 justify-center mt-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: customization.eyeColor }}
              />
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: customization.eyeColor }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pb-4">
        {/* Skin Tone */}
        <div className="parchment-card p-4">
          <label className="font-display font-semibold text-sm mb-3 block">Skin Tone</label>
          <div className="flex gap-2 flex-wrap">
            {SKIN_TONES.map((color) => (
              <button
                key={color}
                onClick={() => updateField('skinTone', color)}
                className={`w-8 h-8 rounded-full transition-all ${
                  customization.skinTone === color 
                    ? 'ring-2 ring-secondary ring-offset-2 ring-offset-card scale-110' 
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Hair Style */}
        <div className="parchment-card p-4">
          <label className="font-display font-semibold text-sm mb-3 block">Hair Style</label>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {HAIR_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => updateField('hairStyle', style)}
                  className={`px-4 py-2 rounded-lg border-2 whitespace-nowrap font-display text-sm transition-all ${
                    customization.hairStyle === style
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-border hover:border-secondary/50'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Hair Color */}
        <div className="parchment-card p-4">
          <label className="font-display font-semibold text-sm mb-3 block">Hair Color</label>
          <div className="flex gap-2 flex-wrap">
            {HAIR_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateField('hairColor', color)}
                className={`w-8 h-8 rounded-full transition-all border-2 ${
                  customization.hairColor === color 
                    ? 'ring-2 ring-secondary ring-offset-2 ring-offset-card scale-110 border-secondary' 
                    : 'hover:scale-105 border-border'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Eye Color */}
        <div className="parchment-card p-4">
          <label className="font-display font-semibold text-sm mb-3 block">Eye Color</label>
          <div className="flex gap-2 flex-wrap">
            {EYE_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateField('eyeColor', color)}
                className={`w-8 h-8 rounded-full transition-all ${
                  customization.eyeColor === color 
                    ? 'ring-2 ring-secondary ring-offset-2 ring-offset-card scale-110' 
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          variant="gold"
          size="lg"
          className="flex-1"
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
