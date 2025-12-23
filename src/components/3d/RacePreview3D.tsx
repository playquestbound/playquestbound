import * as React from 'react';
import { Suspense, useRef, useEffect, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Group, AnimationMixer, LoopRepeat } from 'three';
import { Gender } from '@/lib/races';
import { useRaceModelUrl } from '@/hooks/useRaceModels';

interface RacePreview3DProps {
  raceId: string | null;
  gender: Gender;
  className?: string;
}

// Error boundary to catch model loading failures
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

function PlaceholderCharacter({ raceId }: { raceId: string | null }) {
  const ref = useRef<Group>(null);
  
  // Get race-specific color
  const getRaceColor = () => {
    switch (raceId) {
      case 'human': return '#d4a574';
      case 'elf': return '#c9b896';
      case 'dwarf': return '#b08968';
      case 'orc': return '#6b8e6b';
      default: return '#8b7355';
    }
  };
  
  // Idle floating animation
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  const skinColor = getRaceColor();
  
  // Different body proportions based on race
  const getBodyProps = () => {
    switch (raceId) {
      case 'dwarf':
        return { bodyHeight: 0.6, bodyWidth: 0.4, headSize: 0.28, legHeight: 0.3 };
      case 'elf':
        return { bodyHeight: 0.9, bodyWidth: 0.25, headSize: 0.22, legHeight: 0.5 };
      case 'orc':
        return { bodyHeight: 0.85, bodyWidth: 0.45, headSize: 0.3, legHeight: 0.4 };
      default:
        return { bodyHeight: 0.8, bodyWidth: 0.3, headSize: 0.25, legHeight: 0.4 };
    }
  };
  
  const { bodyHeight, bodyWidth, headSize, legHeight } = getBodyProps();
  const totalHeight = legHeight + bodyHeight + headSize * 2;
  const baseY = -totalHeight / 2;
  
  return (
    <group ref={ref}>
      {/* Legs */}
      <mesh position={[-0.1, baseY + legHeight / 2, 0]}>
        <capsuleGeometry args={[0.08, legHeight, 8, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.1, baseY + legHeight / 2, 0]}>
        <capsuleGeometry args={[0.08, legHeight, 8, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, baseY + legHeight + bodyHeight / 2, 0]}>
        <capsuleGeometry args={[bodyWidth, bodyHeight, 8, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-bodyWidth - 0.1, baseY + legHeight + bodyHeight * 0.6, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.07, 0.4, 8, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[bodyWidth + 0.1, baseY + legHeight + bodyHeight * 0.6, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.07, 0.4, 8, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, baseY + legHeight + bodyHeight + headSize, 0]}>
        <sphereGeometry args={[headSize, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.08, baseY + legHeight + bodyHeight + headSize + 0.02, headSize - 0.05]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.08, baseY + legHeight + bodyHeight + headSize + 0.02, headSize - 0.05]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Pupils */}
      <mesh position={[-0.08, baseY + legHeight + bodyHeight + headSize + 0.02, headSize - 0.02]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0.08, baseY + legHeight + bodyHeight + headSize + 0.02, headSize - 0.02]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      
      {/* Race-specific features */}
      {raceId === 'elf' && (
        <>
          {/* Pointed ears */}
          <mesh position={[-headSize - 0.05, baseY + legHeight + bodyHeight + headSize + 0.05, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.04, 0.15, 8]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
          <mesh position={[headSize + 0.05, baseY + legHeight + bodyHeight + headSize + 0.05, 0]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[0.04, 0.15, 8]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </>
      )}
      
      {raceId === 'orc' && (
        <>
          {/* Tusks */}
          <mesh position={[-0.06, baseY + legHeight + bodyHeight + headSize - 0.1, headSize - 0.02]} rotation={[0.3, 0, 0.2]}>
            <coneGeometry args={[0.02, 0.08, 8]} />
            <meshStandardMaterial color="#f5f5dc" />
          </mesh>
          <mesh position={[0.06, baseY + legHeight + bodyHeight + headSize - 0.1, headSize - 0.02]} rotation={[0.3, 0, -0.2]}>
            <coneGeometry args={[0.02, 0.08, 8]} />
            <meshStandardMaterial color="#f5f5dc" />
          </mesh>
        </>
      )}
      
      {raceId === 'dwarf' && (
        /* Beard */
        <mesh position={[0, baseY + legHeight + bodyHeight + headSize - 0.15, headSize - 0.05]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      )}
    </group>
  );
}

interface AnimatedModelProps {
  url: string;
  raceId: string | null;
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

function AnimatedModel({ url, raceId }: AnimatedModelProps) {
  const scale = raceId === 'dwarf' ? 0.5 : 1;
  
  return (
    <ModelErrorBoundary fallback={<PlaceholderCharacter raceId={raceId} />}>
      <AnimatedModelInner url={url} scale={scale} />
    </ModelErrorBoundary>
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
        <torusGeometry args={[0.3, 0.05, 8, 32]} />
        <meshStandardMaterial color="#d4af37" wireframe />
      </mesh>
    </group>
  );
}

export function RacePreview3D({ raceId, gender, className = "w-full h-64" }: RacePreview3DProps) {
  // Fetch model URL from database
  const modelUrl = useRaceModelUrl(raceId, gender);
  
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 40 }}
        shadows
      >
        <ambientLight intensity={0.1} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.2} 
          castShadow 
        />
        <pointLight position={[-5, 5, -5]} intensity={0.08} color="#d4af37" />
        <spotLight 
          position={[0, 5, 0]} 
          intensity={0.05} 
          angle={0.5}
          penumbra={1}
        />
        {/* Rim lights for edge highlight */}
        <pointLight position={[-2, 1, -2]} intensity={0.3} color="#4a90d9" />
        <pointLight position={[2, 1, -2]} intensity={0.3} color="#d4af37" />
        
        <Suspense fallback={<LoadingSpinner />}>
          {raceId ? (
            modelUrl ? (
              <AnimatedModel url={modelUrl} raceId={raceId} />
            ) : (
              <PlaceholderCharacter raceId={raceId} />
            )
          ) : (
            <LoadingSpinner />
          )}
          <Environment preset="night" />
        </Suspense>
        
        <ContactShadows 
          position={[0, -0.8, 0]} 
          opacity={0.5} 
          scale={3} 
          blur={2} 
        />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}
