import * as React from 'react';
import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, MeshReflectorMaterial } from '@react-three/drei';
import { Group, Mesh } from 'three';

interface ItemPreview3DProps {
  modelUrl?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  className?: string;
}

const RARITY_COLORS: Record<string, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

const RARITY_GLOW: Record<string, number> = {
  common: 0,
  uncommon: 0.2,
  rare: 0.4,
  epic: 0.6,
  legendary: 1,
};

function LoadingFallback() {
  const ref = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });
  
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#4a5568" wireframe />
    </mesh>
  );
}

interface ItemModelProps {
  url: string;
  rarity: string;
}

function ItemModel({ url, rarity }: ItemModelProps) {
  const { scene } = useGLTF(url);
  const ref = useRef<Group>(null);
  
  // Apply emissive glow based on rarity
  useEffect(() => {
    const glowIntensity = RARITY_GLOW[rarity] || 0;
    const color = RARITY_COLORS[rarity] || '#9ca3af';
    
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material && 'emissive' in mesh.material) {
          (mesh.material as any).emissive?.setStyle(color);
          (mesh.material as any).emissiveIntensity = glowIntensity;
        }
      }
    });
  }, [scene, rarity]);
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <primitive 
        ref={ref}
        object={scene.clone()} 
        scale={1}
      />
    </Float>
  );
}

function PlaceholderItem({ rarity }: { rarity: string }) {
  const ref = useRef<Mesh>(null);
  const color = RARITY_COLORS[rarity] || '#9ca3af';
  const glowIntensity = RARITY_GLOW[rarity] || 0;
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime;
    }
  });
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh ref={ref}>
        <dodecahedronGeometry args={[0.5]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={glowIntensity}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

export function ItemPreview3D({ 
  modelUrl, 
  rarity = 'common',
  className = "w-full h-48"
}: ItemPreview3DProps) {
  const color = RARITY_COLORS[rarity] || '#9ca3af';
  
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.3} />
        <spotLight 
          position={[5, 5, 5]} 
          intensity={1} 
          angle={0.3}
          penumbra={0.5}
          color={color}
        />
        <pointLight position={[-3, 3, -3]} intensity={0.5} />
        
        <Suspense fallback={<LoadingFallback />}>
          {modelUrl ? (
            <ItemModel url={modelUrl} rarity={rarity} />
          ) : (
            <PlaceholderItem rarity={rarity} />
          )}
          <Environment preset="city" />
        </Suspense>
        
        {/* Reflective floor for legendary items */}
        {rarity === 'legendary' && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[10, 10]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={1024}
              mixBlur={1}
              mixStrength={50}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#0a0a0a"
              metalness={0.5}
              mirror={0.5}
            />
          </mesh>
        )}
      </Canvas>
    </div>
  );
}
