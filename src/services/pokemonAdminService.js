import { ethers } from 'ethers/lib/ethers';
import contractData from '../contracts/PokemonNFT.json';

// Enum mappings for easier reference
export const PokemonRarity = {
    COMMON: 0,
    UNCOMMON: 1,
    RARE: 2,
    EPIC: 3,
    LEGENDARY: 4
};

export const PokemonType = {
    FIRE: 0,
    WATER: 1,
    GRASS: 2,
    ELECTRIC: 3,
    PSYCHIC: 4,
    NORMAL: 5
};

class PokemonAdminService {
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

    async connectAdminWallet() {
        if (this.provider) {
            await this.provider.send("eth_requestAccounts", []);
            const address = await this.signer.getAddress();
            const owner = await this.contract.owner();
            if (address.toLowerCase() !== owner.toLowerCase()) {
                throw new Error("Not authorized as contract owner");
            }
            return address;
        }
        throw new Error("MetaMask not installed");
    }

    async createPokemonAndGetHash(name, rarity, behavior, pokemonType, uri) {
        if (!this.contract) throw new Error("Contract not initialized");
        
        const tx = await this.contract.createPokemon(name, rarity, behavior, pokemonType, uri);
        const receipt = await tx.wait();
        
        const event = receipt.events.find(e => e.event === 'PokemonCreated');
        if (!event) throw new Error("Pokemon creation event not found");
        
        return {
            tokenId: event.args.tokenId.toString(),
            claimHash: event.args.claimHash
        };
    }

    // Helper function to create a Legendary Fire Pokemon (like Charizard)
    async createLegendaryFirePokemon(name, behavior, metadataUri) {
        return this.createPokemonAndGetHash({
            name,
            rarity: PokemonRarity.LEGENDARY,
            behavior,
            pokemonType: PokemonType.FIRE,
            metadataUri
        });
    }

    // Helper function to verify a claim hash
    async verifyClaimHash(claimHash) {
        try {
            // Try to get Pokemon details using the hash
            const tx = await this.contract.claimPokemon(claimHash);
            await tx.wait();
            return true;
        } catch (error) {
            if (error.message.includes("Hash already used")) {
                return false;
            }
            throw error;
        }
    }
}

export const pokemonAdminService = new PokemonAdminService(); 