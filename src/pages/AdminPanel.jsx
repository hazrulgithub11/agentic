import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { pokemonAdminService, PokemonRarity, PokemonType } from '../services/pokemonAdminService';

const AdminPanel = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [adminAddress, setAdminAddress] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [createdPokemon, setCreatedPokemon] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        rarity: PokemonRarity.COMMON,
        behavior: '',
        pokemonType: PokemonType.NORMAL,
        metadataUri: ''
    });

    const handleConnect = async () => {
        try {
            setStatus({ type: 'info', message: 'Connecting admin wallet...' });
            const address = await pokemonAdminService.connectAdminWallet();
            setAdminAddress(address);
            setIsConnected(true);
            setStatus({ type: 'success', message: 'Connected as admin!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreatePokemon = async (e) => {
        e.preventDefault();
        if (!isConnected) {
            setStatus({ type: 'error', message: 'Please connect admin wallet first' });
            return;
        }

        try {
            setStatus({ type: 'info', message: 'Creating Pokemon...' });
            const result = await pokemonAdminService.createPokemonAndGetHash(formData);
            setCreatedPokemon(result);
            setStatus({ type: 'success', message: 'Pokemon created successfully!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setStatus({ type: 'info', message: 'Copied to clipboard!' });
    };

    return (
        <div className="bg-gray-900 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-gray-800 rounded-lg shadow-2xl p-6">
                    <h1 className="text-3xl font-bold mb-6 text-center text-purple-300">
                        Pokemon Admin Panel
                    </h1>

                    {/* Status Messages */}
                    {status.message && (
                        <div className={`mb-6 p-4 rounded ${
                            status.type === 'error' ? 'bg-red-100 text-red-700' :
                            status.type === 'success' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                            {status.message}
                        </div>
                    )}

                    {/* Connect Button */}
                    {!isConnected ? (
                        <button
                            onClick={handleConnect}
                            className="w-full mb-6 py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Connect Admin Wallet
                        </button>
                    ) : (
                        <div className="mb-6 p-4 bg-gray-700 rounded">
                            <p className="text-gray-300">Connected as: {adminAddress}</p>
                        </div>
                    )}

                    {/* Create Pokemon Form */}
                    <form onSubmit={handleCreatePokemon} className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Pokemon Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-700 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Rarity</label>
                            <select
                                name="rarity"
                                value={formData.rarity}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-700 text-white"
                            >
                                {Object.entries(PokemonRarity).map(([key, value]) => (
                                    <option key={key} value={value}>{key}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Behavior</label>
                            <textarea
                                name="behavior"
                                value={formData.behavior}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-700 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Type</label>
                            <select
                                name="pokemonType"
                                value={formData.pokemonType}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-700 text-white"
                            >
                                {Object.entries(PokemonType).map(([key, value]) => (
                                    <option key={key} value={value}>{key}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Metadata URI</label>
                            <input
                                type="text"
                                name="metadataUri"
                                value={formData.metadataUri}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-700 text-white"
                                placeholder="ipfs://..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!isConnected}
                            className={`w-full py-2 px-4 rounded text-white ${
                                isConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500'
                            }`}
                        >
                            Create Pokemon
                        </button>
                    </form>

                    {/* Created Pokemon Details */}
                    {createdPokemon && (
                        <div className="mt-6 p-4 bg-gray-700 rounded">
                            <h2 className="text-xl font-bold text-purple-300 mb-4">Created Pokemon Details</h2>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Token ID:</span>
                                    <div className="flex items-center">
                                        <span className="text-white mr-2">{createdPokemon.tokenId}</span>
                                        <button
                                            onClick={() => copyToClipboard(createdPokemon.tokenId)}
                                            className="text-purple-400 hover:text-purple-300"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Claim Hash:</span>
                                    <div className="flex items-center">
                                        <span className="text-white mr-2">{`${createdPokemon.claimHash.slice(0, 6)}...${createdPokemon.claimHash.slice(-4)}`}</span>
                                        <button
                                            onClick={() => copyToClipboard(createdPokemon.claimHash)}
                                            className="text-purple-400 hover:text-purple-300"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Transaction:</span>
                                    <div className="flex items-center">
                                        <a
                                            href={`https://etherscan.io/tx/${createdPokemon.transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-400 hover:text-purple-300"
                                        >
                                            View on Etherscan
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel; 