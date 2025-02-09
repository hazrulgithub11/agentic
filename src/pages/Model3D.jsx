import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Text3D, Center } from '@react-three/drei';
import Navbar from '../components/Navbar';
import * as THREE from 'three';
import { pokemonContractService } from '../services/pokemonContractService';

// Loading spinner component
const Loader = () => (
  <Html center>
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-xl text-purple-500 font-semibold">Preparing reveal...</span>
    </div>
  </Html>
);

function Stage({ onStageReady }) {
  const stageRef = useRef();
  const { scene: stageScene } = useGLTF('/stage.glb');
  const [isAnimating, setIsAnimating] = useState(true);

  useFrame((state) => {
    if (!stageRef.current || !isAnimating) return;

    const time = state.clock.getElapsedTime();
    
    // Stage entrance animation
    if (time < 2) {
      stageRef.current.position.y = -5 + time * 2.5; // Rise up
      stageRef.current.rotation.y = time * Math.PI; // Spin
    } else if (isAnimating) {
      stageRef.current.position.y = 0;
      stageRef.current.rotation.y = Math.PI * 2;
      setIsAnimating(false);
      onStageReady(); // Trigger Pokemon reveal
    }
  });

  return (
    <primitive
      ref={stageRef}
      object={stageScene}
      position={[0, -5, 0]}
      scale={1.5}
    />
  );
}

function PokemonInfo({ pokemonData }) {
  if (!pokemonData) return null;

  return (
    <Html position={[0, 5, 0]} center>
      <div className="bg-gray-800 bg-opacity-90 p-4 rounded-lg text-white">
        <h2 className="text-xl font-bold" style={{ color: pokemonContractService.getTypeColor(pokemonData.type) }}>
          {pokemonData.name}
        </h2>
        <div className="mt-2">
          <span className="text-sm font-semibold" style={{ color: getRarityColor(pokemonData.rarity) }}>
            {pokemonData.rarity}
          </span>
          <span className="mx-2">•</span>
          <span className="text-sm" style={{ color: pokemonContractService.getTypeColor(pokemonData.type) }}>
            {pokemonData.type}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-300">{pokemonData.behavior}</p>
      </div>
    </Html>
  );
}

function Pokemon({ isRevealing, pokemonData }) {
  const pokemonRef = useRef();
  const { scene: pokemonScene } = useGLTF('/poke.glb');
  const [revealed, setRevealed] = useState(false);
  
  const baseScale = 3;
  const baseHeight = 3;

  useFrame((state) => {
    if (!pokemonRef.current) return;

    const time = state.clock.getElapsedTime();

    if (isRevealing && !revealed) {
      const revealProgress = Math.min((time % 3) / 2, 1);
      pokemonRef.current.position.y = baseHeight + Math.sin(revealProgress * Math.PI) * 2;
      pokemonRef.current.rotation.y = revealProgress * Math.PI * 4;
      pokemonRef.current.scale.setScalar(revealProgress * baseScale);

      if (revealProgress === 1) {
        setRevealed(true);
      }
    } else if (revealed) {
      pokemonRef.current.position.y = baseHeight + Math.sin(time * 2) * 0.1;
      pokemonRef.current.rotation.y += 0.01;
      pokemonRef.current.scale.setScalar(baseScale);
    }
  });

  return (
    <>
      <primitive
        ref={pokemonRef}
        object={pokemonScene}
        position={[0, baseHeight, 0]}
        scale={0}
      />
      {revealed && pokemonData && (
        <>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.5}
            height={0.2}
            position={[0, baseHeight + 2, 0]}
          >
            {pokemonData.name}
            <meshPhongMaterial color={getRarityColor(pokemonData.rarity)} />
          </Text3D>
          <PokemonInfo pokemonData={pokemonData} />
        </>
      )}
    </>
  );
}

function getRarityColor(rarity) {
  switch (rarity) {
    case 'LEGENDARY': return '#FFD700';
    case 'EPIC': return '#A335EE';
    case 'RARE': return '#0070DD';
    case 'UNCOMMON': return '#1EFF00';
    default: return '#FFFFFF';
  }
}

function RevealScene({ claimHash }) {
  const [stageReady, setStageReady] = useState(false);
  const [showPokemon, setShowPokemon] = useState(false);
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stageReady) {
      const timer = setTimeout(() => {
        setShowPokemon(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stageReady]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
      />
      <pointLight position={[-10, 5, -10]} intensity={0.8} />
      
      <Stage onStageReady={() => setStageReady(true)} />
      
      {stageReady && <Pokemon isRevealing={showPokemon} pokemonData={pokemonData} />}

      {error && (
        <Html center>
          <div className="text-red-500 bg-white p-4 rounded">
            Error: {error}
          </div>
        </Html>
      )}

      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]} 
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.2} transparent />
      </mesh>
    </>
  );
}

const Model3D = () => {
  const [claimHash, setClaimHash] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);

  useEffect(() => {
    // Get hash from URL parameters
    const params = new URLSearchParams(window.location.search);
    setClaimHash(params.get('hash'));
  }, []);

  const handleConnectWallet = async () => {
    try {
      await pokemonContractService.connectWallet();
      setWalletConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setClaimStatus({ type: 'error', message: 'Failed to connect wallet' });
    }
  };

  const handleClaimPokemon = async () => {
    if (!claimHash) return;
    
    try {
      setClaiming(true);
      setClaimStatus({ type: 'info', message: 'Claiming your Pokemon...' });
      
      const tx = await pokemonContractService.claimPokemon(claimHash);
      await tx.wait();
      
      setClaimStatus({ type: 'success', message: 'Successfully claimed your Pokemon!' });
    } catch (error) {
      console.error('Failed to claim Pokemon:', error);
      setClaimStatus({ 
        type: 'error', 
        message: error.message || 'Failed to claim Pokemon' 
      });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-purple-300">
            Mystery Pokémon Reveal
          </h1>
          
          {claimStatus && (
            <div className={`mb-4 p-4 rounded ${
              claimStatus.type === 'error' ? 'bg-red-100 text-red-700' :
              claimStatus.type === 'success' ? 'bg-green-100 text-green-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {claimStatus.message}
            </div>
          )}

          {!walletConnected ? (
            <button
              onClick={handleConnectWallet}
              className="w-full mb-4 py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={handleClaimPokemon}
              disabled={claiming || !claimHash}
              className={`w-full mb-4 py-2 px-4 rounded text-white ${
                claiming || !claimHash ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {claiming ? 'Claiming...' : 'Claim Pokemon'}
            </button>
          )}
          
          <div className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden relative">
            <Canvas
              camera={{ 
                position: [0, 3, 6],
                fov: 60,
                near: 0.1,
                far: 1000
              }}
              shadows
            >
              <Suspense fallback={<Loader />}>
                <RevealScene claimHash={claimHash} />
              </Suspense>

              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minPolarAngle={Math.PI/6}
                maxPolarAngle={Math.PI/2}
                minDistance={4}
                maxDistance={15}
                target={[0, 2, 0]}
              />
            </Canvas>
          </div>

          <div className="mt-6 text-gray-300 text-center">
            <p className="text-lg">Watch as your mystery Pokémon is revealed!</p>
            <p className="text-sm mt-2 text-purple-400">
              Tip: You can rotate the view by dragging and zoom using the scroll wheel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model3D; 