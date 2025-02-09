import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 text-center">
          <h1 className="text-4xl font-bold mb-6 text-purple-300">
            Mystery Pokémon Cards
          </h1>
          
          <p className="text-gray-300 mb-8 text-lg">
            Scan your NFC-enabled Pokémon card to reveal your unique Pokémon NFT!
          </p>

          {/* Main Action Button */}
          <button
            onClick={() => navigate('/scan')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl mb-8 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Scan Pokémon Card
          </button>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="text-purple-400 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">Easy Scanning</h3>
              <p className="text-gray-300">Just tap your card to your device's NFC reader</p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="text-purple-400 text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">3D Reveal</h3>
              <p className="text-gray-300">Watch as your Pokémon comes to life in 3D</p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="text-purple-400 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">Secure NFT</h3>
              <p className="text-gray-300">Your Pokémon is safely stored on the blockchain</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-12 bg-gray-700/50 p-6 rounded-lg text-left">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li>Click the "Scan Pokémon Card" button above</li>
              <li>Hold your NFC-enabled Pokémon card to your device</li>
              <li>Connect your wallet when prompted</li>
              <li>Watch as your unique Pokémon is revealed!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home