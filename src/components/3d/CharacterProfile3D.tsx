import * as React from 'react';
import { Suspense, useRef, useEffect, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Group, AnimationMixer, LoopRepeat } from 'three';
import { useRaceModelUrl } from '@/hooks/useRaceModels';
import { Gender } from '@/lib/races';

interface CharacterProfile3DProps {
  raceId: string | null;
  gender: Gender;
  className?: string;
}

// Error boundary for model loading
interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function AnimatedModelInner({ url, scale = 1 }: { url: string; scale?: number }) {
  const { scene, animations } = useGLTF(url);
  const ref = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  
  useEffect(() => {
    if (animations.length > 0 && scene) {
      mixerRef.current = new AnimationMixer(scene);
      const action = mixerRef.current.clipAction(animations[0]);
      action.setLoop(LoopRepeat, Infinity);
      action.play();
    }
    
    return () => {
      mixerRef.current?.stopAllAction();
    };
  }, [animations, scene]);
  
  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });
  
  return <primitive ref={ref} object={scene.clone()} scale={scale} />;
}

function PlaceholderCharacter({ raceId }: { raceId: string | null }) {
  const ref = useRef<Group>(null);
  
  const getRaceColor = () => {
    switch (raceId) {
      case 'human': return '#d4a574';
      case 'elf': return '#c9b896';
      case 'dwarf': return '#b08968';
      case 'orc': return '#6b8e6b';
      default: return '#8b7355';
    }
  };
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });
  
  const skinColor = getRaceColor();
  
  return (
    <group ref={ref} scale={1.1}>
      {/* Simple placeholder body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
    </group>
  );
}

function AnimatedModel({ url, raceId }: { url: string; raceId: string | null }) {
  const scale = raceId === 'dwarf' ? 0.55 : 0.95;
  const positionY = raceId === 'dwarf' ? -0.3 : 0;
  
  return (
    <group position={[0, positionY, 0]}>
      <ModelErrorBoundary fallback={<PlaceholderCharacter raceId={raceId} />}>
        <AnimatedModelInner url={url} scale={scale} />
      </ModelErrorBoundary>
    </group>
  );
}

function LoadingSpinner() {
  const ref = useRef<Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });
  
  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[0.2, 0.03, 8, 32]} />
        <meshStandardMaterial color="#d4af37" wireframe />
      </mesh>
    </group>
  );
}

export function CharacterProfile3D({ raceId, gender, className = "w-full h-full" }: CharacterProfile3DProps) {
  const modelUrl = useRaceModelUrl(raceId, gender);
  
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.3, 3.2], fov: 35 }}
        shadows
      >
        {/* Lighting - front-facing setup */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[2, 3, 5]} 
          intensity={0.8} 
          castShadow 
        />
        
        {/* Key light from front */}
        <spotLight 
          position={[0, 4, 4]} 
          intensity={1} 
          angle={0.5}
          penumbra={0.8}
          color="#ffffff"
        />
        
        {/* Fill lights */}
        <pointLight position={[-2, 1, 2]} intensity={0.4} color="#4a90d9" />
        <pointLight position={[2, 1, 2]} intensity={0.4} color="#d4af37" />
        
        {/* Rim light from behind */}
        <pointLight position={[0, 2, -2]} intensity={0.6} color="#ffffff" />
        
        <Suspense fallback={<LoadingSpinner />}>
          {raceId ? (
            modelUrl ? (
              <AnimatedModel url={modelUrl} raceId={raceId} />
            ) : (
              <PlaceholderCharacter raceId={raceId} />
            )
          ) : (
            <PlaceholderCharacter raceId={null} />
          )}
          <Environment preset="night" />
        </Suspense>
        
        <ContactShadows 
          position={[0, -0.8, 0]} 
          opacity={0.4} 
          scale={2} 
          blur={2} 
        />
      </Canvas>
    </div>
  );
}
