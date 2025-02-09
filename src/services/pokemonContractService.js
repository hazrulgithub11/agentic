import { ethers } from 'ethers/lib/ethers';
import contractData from '../contracts/PokemonNFT.json';

class PokemonContractService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.initialize();
    }

    async initialize() {
        if (typeof window.ethereum !== 'undefined') {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            this.contract = new ethers.Contract(contractData.address, contractData.abi, this.signer);
        }
    }

    async connectWallet() {
        if (this.provider) {
            await this.provider.send("eth_requestAccounts", []);
            return this.signer.getAddress();
        }
        throw new Error("MetaMask not installed");
    }

    async getPokemonDetails(tokenId) {
        if (!this.contract) throw new Error("Contract not initialized");
        
        const pokemon = await this.contract.getPokemon(tokenId);
        return {
            name: pokemon.name,
            rarity: this.getRarityString(pokemon.rarity),
            behavior: pokemon.behavior,
            type: this.getTypeString(pokemon.pokemonType),
            claimed: pokemon.claimed,
            owner: pokemon.owner,
            tokenURI: pokemon.tokenURI
        };
    }

    async claimPokemon(hash) {
        if (!this.contract) throw new Error("Contract not initialized");
        
        const tx = await this.contract.claimPokemon(hash);
        await tx.wait();
        return tx;
    }

    async isPokemonClaimed(tokenId) {
        if (!this.contract) throw new Error("Contract not initialized");
        return await this.contract.isPokemonClaimed(tokenId);
    }

    getRarityString(rarityEnum) {
        const rarities = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
        return rarities[rarityEnum] || 'UNKNOWN';
    }

    getTypeString(typeEnum) {
        const types = ['FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'PSYCHIC', 'NORMAL'];
        return types[typeEnum] || 'UNKNOWN';
    }

    getTypeColor(type) {
        const colors = {
            'FIRE': '#FF4136',
            'WATER': '#0074D9',
            'GRASS': '#2ECC40',
            'ELECTRIC': '#FFDC00',
            'PSYCHIC': '#F012BE',
            'NORMAL': '#AAAAAA'
        };
        return colors[type] || '#FFFFFF';
    }
}

export const pokemonContractService = new PokemonContractService(); 