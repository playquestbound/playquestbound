import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { X, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as THREE from 'three';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  rarity: string;
  price: number;
  image?: string;
  imageEmoji?: string;
  slot: string;
  questLocked?: boolean;
  modelUrl?: string;
}

interface ProductDetailModalProps {
  item: StoreItem;
  onClose: () => void;
}

function RotatingModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={2.5}
      position={[0, -0.5, 0]}
    />
  );
}

function FallbackModel() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#d4a574" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

const rarityConfig: Record<string, { gradient: string; glow: string; text: string }> = {
  common: { gradient: 'from-gray-600 to-gray-800', glow: 'shadow-gray-500/30', text: 'text-gray-400' },
  uncommon: { gradient: 'from-green-600 to-green-900', glow: 'shadow-green-500/30', text: 'text-green-400' },
  rare: { gradient: 'from-blue-600 to-blue-900', glow: 'shadow-blue-500/30', text: 'text-blue-400' },
  epic: { gradient: 'from-purple-600 to-purple-900', glow: 'shadow-purple-500/30', text: 'text-purple-400' },
  legendary: { gradient: 'from-amber-500 via-yellow-500 to-amber-600', glow: 'shadow-amber-500/50', text: 'text-amber-400' },
};

export default function ProductDetailModal({ item, onClose }: ProductDetailModalProps) {
  const rarity = rarityConfig[item.rarity] || rarityConfig.common;
  
  // Map items to their 3D models
  const modelMap: Record<string, string> = {
    '1': '/models/fuji-jingasa.glb', // FUJI JINGASA
  };
  
  const modelUrl = item.modelUrl || modelMap[item.id];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-sm bg-gradient-to-b from-background/95 to-background border border-border/50 rounded-2xl overflow-hidden shadow-2xl ${rarity.glow} animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-foreground/70 hover:text-foreground hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image + 3D Model Section */}
        <div className="relative aspect-square">
          {/* Background Image with darkened overlay */}
          <div className="absolute inset-0">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover opacity-40 blur-sm"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-muted/50 to-background flex items-center justify-center text-8xl">
                {item.imageEmoji}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          {/* 3D Model Canvas */}
          <div className="absolute inset-0 z-10">
            <Canvas
              camera={{ position: [0, 1, 4], fov: 45 }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.5} />
              <spotLight
                position={[5, 5, 5]}
                angle={0.3}
                penumbra={1}
                intensity={1}
                castShadow
              />
              <pointLight position={[-5, 5, -5]} intensity={0.5} />
              
              <Suspense fallback={<FallbackModel />}>
                {modelUrl ? (
                  <RotatingModel url={modelUrl} />
                ) : (
                  <FallbackModel />
                )}
              </Suspense>

              {/* Shadow on ground */}
              <ContactShadows
                position={[0, -1.5, 0]}
                opacity={0.6}
                scale={5}
                blur={2}
                far={4}
              />

              <Environment preset="city" />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </div>

          {/* Rarity Badge */}
          <Badge 
            className={`absolute top-3 left-3 z-20 ${item.rarity === 'legendary' ? 'text-amber-200 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 border-none animate-pulse shadow-lg shadow-amber-500/50' : `${rarity.text} bg-black/70 border-none`} text-xs px-3 py-1`}
          >
            {item.rarity}
          </Badge>
        </div>

        {/* Item Details */}
        <div className="p-5 space-y-4">
          <div>
            <h2 className="text-xl font-cinzel font-bold text-foreground">{item.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          </div>

          {/* How to get */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">How to Unlock</h3>
            {item.questLocked ? (
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">
                  {item.name === 'FUJI JINGASA' 
                    ? 'Complete the legendary Mt. Fuji Quest to unlock this sacred headpiece.'
                    : item.name === 'BASE BOOTS'
                    ? 'Reach Base Camp on Mt. Everest to earn these legendary boots.'
                    : 'Complete a special quest to unlock this item.'}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg">🪙</span>
                <p className="text-sm text-foreground">Purchase for <span className="font-bold text-yellow-500">{item.price} gold</span></p>
              </div>
            )}
          </div>

          {/* Action Button */}
          {item.questLocked ? (
            <Button 
              className="w-full bg-muted text-muted-foreground cursor-not-allowed"
              disabled
            >
              <Lock className="w-4 h-4 mr-2" />
              Quest Locked
            </Button>
          ) : (
            <Button 
              className={`w-full ${item.rarity === 'legendary' ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black font-bold hover:from-amber-500 hover:to-amber-500' : ''}`}
            >
              Purchase for {item.price} 🪙
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
