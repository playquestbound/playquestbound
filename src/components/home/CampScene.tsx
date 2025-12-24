import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Group } from 'three';
import qbLogo from '@/assets/qb-logo.png';
import campBg from '@/assets/camp-bg.jpg';
import { CharacterProfile3D } from '@/components/3d/CharacterProfile3D';
import { useProfile } from '@/hooks/useProfile';
import { Gender } from '@/lib/races';

interface CampSceneProps {
  characterRace: string;
}

export function CampScene({ characterRace }: CampSceneProps) {
  const { data: profile } = useProfile();
  const gender = (profile?.customization as { gender?: Gender })?.gender || 'male';

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Background image */}
      <img
        src={campBg}
        alt="Forest camp background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Logo at top center */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
        <img 
          src={qbLogo} 
          alt="Questbound" 
          className="w-auto max-w-[320px] object-contain"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
          }}
        />
      </div>

      {/* Character 3D placeholder - positioned in the clearing */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-64">
          <CharacterProfile3D
            raceId={characterRace}
            gender={gender}
            className="w-full h-full"
            variant="forest"
          />
        </div>
      </div>
    </div>
  );
}
