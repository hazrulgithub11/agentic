import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';

// Loading spinner component
const Loader = () => (
  <Html center>
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </Html>
);

function PokemonModel({ modelUrl, animate = true }) {
  const modelRef = useRef();
  const { scene, animations } = useGLTF(modelUrl);
  const [hovered, setHovered] = useState(false);

  // Animation logic
  useFrame((state) => {
    if (!modelRef.current || !animate) return;

    const time = state.clock.getElapsedTime();
    
    // Idle animation
    modelRef.current.position.y = Math.sin(time * 2) * 0.1;
    modelRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;

    // Hover effect
    if (hovered) {
      modelRef.current.rotation.y += 0.01;
      modelRef.current.position.y = Math.sin(time * 4) * 0.15;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={[0, 0, 0]}
    />
  );
}

const PokemonViewer = ({ modelUrl, showControls = true }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-[400px] bg-gray-50 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        {/* Lighting setup */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[0, 2, 0]} intensity={1} />
        
        {/* Pokemon model with loading state */}
        <Suspense fallback={<Loader />}>
          <PokemonModel modelUrl={modelUrl} />
        </Suspense>

        {/* Ground plane for shadow and reference */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#f3f4f6" />
        </mesh>

        {/* Camera controls */}
        {showControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={Math.PI/6}
            maxPolarAngle={Math.PI/2}
            minDistance={3}
            maxDistance={8}
          />
        )}
      </Canvas>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading Pokémon...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonViewer; 