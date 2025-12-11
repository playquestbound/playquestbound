import { useMemo } from 'react';

interface CharacterCustomization {
  skinTone?: string;
  hairStyle?: string;
  hairColor?: string;
  eyeColor?: string;
}

interface CharacterDisplayProps {
  customization: CharacterCustomization | null;
  race?: string | null;
  characterClass?: string | null;
}

export function CharacterDisplay({ customization, race, characterClass }: CharacterDisplayProps) {
  const skinTone = customization?.skinTone || '#D4A574';
  const hairColor = customization?.hairColor || '#4A3728';
  const eyeColor = customization?.eyeColor || '#4A3728';
  const hairStyle = customization?.hairStyle || 'Style 1';

  // Hair path based on style
  const hairPath = useMemo(() => {
    switch (hairStyle) {
      case 'Style 1': // Short
        return 'M30,25 Q50,15 70,25 Q75,35 70,40 L30,40 Q25,35 30,25';
      case 'Style 2': // Medium
        return 'M25,25 Q50,10 75,25 Q80,40 75,55 L70,45 L50,50 L30,45 L25,55 Q20,40 25,25';
      case 'Style 3': // Long
        return 'M20,25 Q50,5 80,25 Q85,50 80,75 L70,60 L50,65 L30,60 L20,75 Q15,50 20,25';
      case 'Style 4': // Spiky
        return 'M30,30 L25,15 L35,25 L40,10 L50,25 L60,10 L65,25 L75,15 L70,30 Q75,40 70,45 L30,45 Q25,40 30,30';
      case 'Style 5': // Bald
        return '';
      case 'Style 6': // Braided
        return 'M25,25 Q50,10 75,25 Q80,40 75,50 L72,70 L68,50 L50,45 L32,50 L28,70 L25,50 Q20,40 25,25';
      default:
        return 'M30,25 Q50,15 70,25 Q75,35 70,40 L30,40 Q25,35 30,25';
    }
  }, [hairStyle]);

  // Race-specific ear modifications
  const getEars = () => {
    if (race === 'elf') {
      return (
        <>
          <path d="M18,45 Q10,35 15,25 L25,40 Z" fill={skinTone} />
          <path d="M82,45 Q90,35 85,25 L75,40 Z" fill={skinTone} />
        </>
      );
    }
    if (race === 'orc') {
      return (
        <>
          <ellipse cx="22" cy="50" rx="6" ry="8" fill={skinTone} />
          <ellipse cx="78" cy="50" rx="6" ry="8" fill={skinTone} />
        </>
      );
    }
    return (
      <>
        <ellipse cx="24" cy="50" rx="4" ry="6" fill={skinTone} />
        <ellipse cx="76" cy="50" rx="4" ry="6" fill={skinTone} />
      </>
    );
  };

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Glow effect behind character */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full animate-pulse" />
      
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
        {/* Body */}
        <ellipse cx="50" cy="105" rx="25" ry="15" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
        
        {/* Neck */}
        <rect x="42" y="70" width="16" height="15" fill={skinTone} />
        
        {/* Head */}
        <ellipse cx="50" cy="50" rx="28" ry="32" fill={skinTone} />
        
        {/* Ears */}
        {getEars()}
        
        {/* Hair */}
        {hairPath && (
          <path d={hairPath} fill={hairColor} />
        )}
        
        {/* Eyes */}
        <ellipse cx="38" cy="48" rx="5" ry="4" fill="white" />
        <ellipse cx="62" cy="48" rx="5" ry="4" fill="white" />
        <circle cx="38" cy="48" r="2.5" fill={eyeColor} />
        <circle cx="62" cy="48" r="2.5" fill={eyeColor} />
        <circle cx="39" cy="47" r="1" fill="white" />
        <circle cx="63" cy="47" r="1" fill="white" />
        
        {/* Eyebrows */}
        <path d="M32,40 Q38,38 44,40" stroke={hairColor} strokeWidth="2" fill="none" />
        <path d="M56,40 Q62,38 68,40" stroke={hairColor} strokeWidth="2" fill="none" />
        
        {/* Nose */}
        <path d="M50,52 L48,58 Q50,60 52,58 Z" fill={`color-mix(in srgb, ${skinTone} 80%, black)`} opacity="0.3" />
        
        {/* Mouth */}
        <path d="M44,65 Q50,70 56,65" stroke="#8B4513" strokeWidth="1.5" fill="none" />
        
        {/* Class indicator on chest */}
        {characterClass && (
          <text x="50" y="100" textAnchor="middle" fontSize="10" fill="hsl(var(--secondary))">
            {characterClass === 'wanderer' && '🧭'}
            {characterClass === 'lightfoot' && '👟'}
            {characterClass === 'trailblazer' && '🔥'}
            {characterClass === 'wayfarer' && '🌍'}
            {characterClass === 'forager' && '🌿'}
            {characterClass === 'nightowl' && '🦉'}
            {characterClass === 'chronicler' && '📖'}
            {characterClass === 'ironside' && '🛡️'}
          </text>
        )}
      </svg>
    </div>
  );
}
