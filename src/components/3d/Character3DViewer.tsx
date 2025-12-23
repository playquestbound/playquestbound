import * as React from 'react';
import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Group } from 'three';

interface Character3DViewerProps {
  baseModelUrl?: string;
  equipmentSlots?: {
    head?: string;
    body?: string;
    weapon?: string;
    accessory?: string;
  };
  className?: string;
  autoRotate?: boolean;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 0.5]} />
      <meshStandardMaterial color="#4a5568" wireframe />
    </mesh>
  );
}

interface ModelProps {
  url: string;
  position?: [number, number, number];
}

function Model({ url, position = [0, 0, 0] }: ModelProps) {
  const { scene } = useGLTF(url);
  const ref = useRef<Group>(null);
  
  return (
    <primitive 
      ref={ref}
      object={scene.clone()} 
      position={position}
      scale={1}
    />
  );
}

interface CharacterWithEquipmentProps {
  baseModelUrl?: string;
  equipmentSlots?: Character3DViewerProps['equipmentSlots'];
}

function CharacterWithEquipment({ baseModelUrl, equipmentSlots }: CharacterWithEquipmentProps) {
  // If no base model provided, show placeholder
  if (!baseModelUrl) {
    return (
      <group>
        {/* Placeholder character */}
        <mesh position={[0, 0.75, 0]}>
          <capsuleGeometry args={[0.3, 1, 8, 16]} />
          <meshStandardMaterial color="#8b7355" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {/* Base character model */}
      <Model url={baseModelUrl} />
      
      {/* Equipment slots - modular parts */}
      {equipmentSlots?.head && (
        <Model url={equipmentSlots.head} position={[0, 1.6, 0]} />
      )}
      {equipmentSlots?.body && (
        <Model url={equipmentSlots.body} position={[0, 0.8, 0]} />
      )}
      {equipmentSlots?.weapon && (
        <Model url={equipmentSlots.weapon} position={[0.5, 0.8, 0]} />
      )}
      {equipmentSlots?.accessory && (
        <Model url={equipmentSlots.accessory} position={[-0.5, 0.8, 0]} />
      )}
    </group>
  );
}

export function Character3DViewer({ 
  baseModelUrl, 
  equipmentSlots,
  className = "w-full h-64",
  autoRotate = true
}: Character3DViewerProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        
        <Suspense fallback={<LoadingFallback />}>
          <CharacterWithEquipment 
            baseModelUrl={baseModelUrl}
            equipmentSlots={equipmentSlots}
          />
          <Environment preset="studio" />
        </Suspense>
        
        <ContactShadows 
          position={[0, -0.5, 0]} 
          opacity={0.4} 
          scale={5} 
          blur={2} 
        />
        
        <OrbitControls 
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
