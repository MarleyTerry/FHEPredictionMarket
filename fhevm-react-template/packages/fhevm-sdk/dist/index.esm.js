import { initFhevm, createInstance } from 'fhevmjs';
import { Contract } from 'ethers';

/**
 * Main FHEVM Client - Framework agnostic
 *
 * Usage:
 * ```typescript
 * const client = new FhevmClient({ provider });
 * await client.init();
 * const encrypted = await client.encrypt32(42);
 * ```
 */
class FhevmClient {
    constructor(config) {
        this.instance = null;
        this.initialized = false;
        this.provider = config.provider;
        this.network = config.network;
        // Convert hex string to Uint8Array if provided
        if (config.publicKey) {
            this.publicKeyBytes = this.hexToUint8Array(config.publicKey);
        }
    }
    /**
     * Initialize the FHEVM client
     */
    async init() {
        if (this.initialized) {
            return;
        }
        try {
            // Initialize fhevmjs library
            await initFhevm();
            // Get network information
            const network = await this.provider.getNetwork();
            const chainId = Number(network.chainId);
            // Prepare config for createInstance
            const config = {
                kmsContractAddress: this.network?.aclAddress || '0x',
                aclContractAddress: this.network?.aclAddress || '0x',
                chainId,
            };
            // Add public key if available
            if (this.publicKeyBytes) {
                config.publicKey = this.publicKeyBytes;
            }
            // Add gateway URL if available
            if (this.network?.gatewayUrl) {
                config.gatewayUrl = this.network.gatewayUrl;
            }
            this.instance = await createInstance(config);
            this.initialized = true;
        }
        catch (error) {
            console.error('Failed to initialize FHEVM client:', error);
            throw new Error(`FHEVM initialization failed: ${error}`);
        }
    }
    /**
     * Get the underlying FHEVM instance
     */
    getInstance() {
        if (!this.instance) {
            throw new Error('FHEVM client not initialized. Call init() first.');
        }
        return this.instance;
    }
    /**
     * Check if client is initialized
     */
    isInitialized() {
        return this.initialized;
    }
    /**
     * Get the public key
     */
    getPublicKey() {
        const instance = this.getInstance();
        return instance.getPublicKey();
    }
    /**
     * Helper to convert hex string to Uint8Array
     */
    hexToUint8Array(hex) {
        const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
        const bytes = new Uint8Array(cleanHex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
        }
        return bytes;
    }
    /**
     * Create encrypted input builder for a contract
     */
    createEncryptedInput(contractAddress, userAddress) {
        const instance = this.getInstance();
        return instance.createEncryptedInput(contractAddress, userAddress);
    }
    /**
     * Generate a keypair for reencryption
     */
    generateKeypair() {
        const instance = this.getInstance();
        return instance.generateKeypair();
    }
    /**
     * Create EIP-712 signature object
     */
    createEIP712(publicKey, contractAddress, delegatedAccount) {
        const instance = this.getInstance();
        return instance.createEIP712(publicKey, contractAddress, delegatedAccount);
    }
    /**
     * Reencrypt a value for the user
     */
    async reencrypt(handle, privateKey, publicKey, signature, contractAddress, userAddress) {
        const instance = this.getInstance();
        return instance.reencrypt(handle, privateKey, publicKey, signature, contractAddress, userAddress);
    }
}

/**
 * Service for encrypting values using FHEVM
 *
 * Usage:
 * ```typescript
 * const service = new EncryptionService(fhevmClient);
 * const encrypted = await service.encryptUint32(100);
 * ```
 */
class EncryptionService {
    constructor(client) {
        this.client = client;
    }
    /**
     * Encrypt a single boolean value
     * This is a convenience method that creates a builder with one value
     */
    async encryptBool(value, contractAddress, userAddress) {
        if (!this.client.isInitialized()) {
            await this.client.init();
        }
        const builder = this.client.createEncryptedInput(contractAddress, userAddress);
        builder.addBool(value);
        return builder.encrypt();
    }
    /**
     * Encrypt a single 8-bit unsigned integer
     */
    async encryptUint8(value, contractAddress, userAddress) {
        this.validateUint(value, 8);
        if (!this.client.isInitialized()) {
            await this.client.init();
        }
        const builder = this.client.createEncryptedInput(contractAddress, userAddress);
        builder.add8(value);
        return builder.encrypt();
    }
    /**
     * Encrypt a single 16-bit unsigned integer
     */
    async encryptUint16(value, contractAddress, userAddress) {
        this.validateUint(value, 16);
        if (!this.client.isInitialized()) {
            await this.client.init();
        }
        const builder = this.client.createEncryptedInput(contractAddress, userAddress);
        builder.add16(value);
        return builder.encrypt();
    }
    /**
     * Encrypt a single 32-bit unsigned integer
     */
    async encryptUint32(value, contractAddress, userAddress) {
        this.validateUint(value, 32);
        if (!this.client.isInitialized()) {
            await this.client.init();
        }
        const builder = this.client.createEncryptedInput(contractAddress, userAddress);
        builder.add32(value);
        return builder.encrypt();
    }
    /**
     * Encrypt a single 64-bit unsigned integer
     */
    async encryptUint64(value, contractAddress, userAddress) {
        this.validateUint64(value);
        if (!this.client.isInitialized()) {
            await this.client.init();
        }
        const builder = this.client.createEncryptedInput(contractAddress, userAddress);
        builder.add64(value);
        return builder.encrypt();
    }
    /**
     * Create an encrypted input builder for batch encryption
     */
    createEncryptedInputBuilder(contractAddress, userAddress) {
        if (!this.client.isInitialized()) {
            throw new Error('Client not initialized');
        }
        return this.client.createEncryptedInput(contractAddress, userAddress);
    }
    /**
     * Encrypt multiple values at once
     */
    async encryptBatch(contractAddress, userAddress, values) {
        if (!this.client.isInitialized()) {
            await this.client.init();
        }
        const builder = this.createEncryptedInputBuilder(contractAddress, userAddress);
        for (const { type, value } of values) {
            switch (type) {
                case 'bool':
                    builder.addBool(value);
                    break;
                case 'uint8':
                    builder.add8(value);
                    break;
                case 'uint16':
                    builder.add16(value);
                    break;
                case 'uint32':
                    builder.add32(value);
                    break;
                case 'uint64':
                    builder.add64(value);
                    break;
                case 'address':
                    builder.addAddress(value);
                    break;
                default:
                    throw new Error(`Unsupported type: ${type}`);
            }
        }
        return builder.encrypt();
    }
    /**
     * Validate unsigned integer value
     */
    validateUint(value, bits) {
        if (!Number.isInteger(value)) {
            throw new Error('Value must be an integer');
        }
        if (value < 0) {
            throw new Error('Value must be non-negative');
        }
        const max = 2 ** bits - 1;
        if (value > max) {
            throw new Error(`Value exceeds maximum for uint${bits}: ${max}`);
        }
    }
    /**
     * Validate 64-bit unsigned integer
     */
    validateUint64(value) {
        if (value < 0n) {
            throw new Error('Value must be non-negative');
        }
        const max = 2n ** 64n - 1n;
        if (value > max) {
            throw new Error(`Value exceeds maximum for uint64: ${max}`);
        }
    }
}

/**
 * Service for decrypting FHEVM encrypted values
 *
 * Supports both:
 * - userDecrypt: User-initiated decryption with EIP-712 signature
 * - publicDecrypt: Public decryption without signature
 *
 * Usage:
 * ```typescript
 * const service = new DecryptionService(signer);
 * const result = await service.decrypt({
 *   contractAddress: '0x...',
 *   ciphertext: '0x...',
 *   userAddress: '0x...'
 * });
 * ```
 */
class DecryptionService {
    constructor(signer, gatewayUrl) {
        this.signer = signer;
        this.gatewayUrl = gatewayUrl || 'https://gateway.zama.ai';
    }
    /**
     * Decrypt a value with user signature (userDecrypt)
     */
    async decrypt(params) {
        const { contractAddress, ciphertext, userAddress } = params;
        try {
            // Create EIP-712 signature for decryption request
            const signature = await this.createDecryptionSignature(contractAddress, ciphertext, userAddress);
            // Send decryption request to gateway
            const result = await this.requestDecryption(contractAddress, ciphertext, signature);
            return {
                value: result,
                signature,
            };
        }
        catch (error) {
            console.error('Decryption failed:', error);
            throw new Error(`Failed to decrypt value: ${error}`);
        }
    }
    /**
     * Public decryption without signature
     */
    async publicDecrypt(contractAddress, ciphertext) {
        try {
            const response = await fetch(`${this.gatewayUrl}/publicDecrypt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contractAddress,
                    ciphertext: typeof ciphertext === 'bigint' ? ciphertext.toString() : ciphertext,
                }),
            });
            if (!response.ok) {
                throw new Error(`Gateway returned ${response.status}`);
            }
            const data = await response.json();
            return data.value;
        }
        catch (error) {
            console.error('Public decryption failed:', error);
            throw new Error(`Failed to publicly decrypt value: ${error}`);
        }
    }
    /**
     * Decrypt boolean value
     */
    async decryptBool(params) {
        const result = await this.decrypt(params);
        return result.value === 1;
    }
    /**
     * Decrypt uint8 value
     */
    async decryptUint8(params) {
        const result = await this.decrypt(params);
        return result.value;
    }
    /**
     * Decrypt uint16 value
     */
    async decryptUint16(params) {
        const result = await this.decrypt(params);
        return result.value;
    }
    /**
     * Decrypt uint32 value
     */
    async decryptUint32(params) {
        const result = await this.decrypt(params);
        return result.value;
    }
    /**
     * Decrypt uint64 value
     */
    async decryptUint64(params) {
        const result = await this.decrypt(params);
        return BigInt(result.value);
    }
    /**
     * Create EIP-712 signature for decryption
     */
    async createDecryptionSignature(contractAddress, ciphertext, userAddress) {
        const chainId = await this.signer.provider?.getNetwork().then((n) => Number(n.chainId));
        if (!chainId) {
            throw new Error('Could not determine chain ID');
        }
        const domain = {
            name: 'FHEVM',
            version: '1',
            chainId,
            verifyingContract: contractAddress,
        };
        const types = {
            Decryption: [
                { name: 'ciphertext', type: 'uint256' },
                { name: 'requester', type: 'address' },
            ],
        };
        const value = {
            ciphertext: typeof ciphertext === 'bigint' ? ciphertext.toString() : ciphertext,
            requester: userAddress,
        };
        try {
            // Sign using EIP-712
            const signature = await this.signer.signTypedData(domain, types, value);
            return signature;
        }
        catch (error) {
            console.error('Failed to create signature:', error);
            throw new Error(`Signature creation failed: ${error}`);
        }
    }
    /**
     * Request decryption from gateway
     */
    async requestDecryption(contractAddress, ciphertext, signature) {
        try {
            const response = await fetch(`${this.gatewayUrl}/decrypt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contractAddress,
                    ciphertext: typeof ciphertext === 'bigint' ? ciphertext.toString() : ciphertext,
                    signature,
                }),
            });
            if (!response.ok) {
                throw new Error(`Gateway returned ${response.status}: ${await response.text()}`);
            }
            const data = await response.json();
            return data.value;
        }
        catch (error) {
            console.error('Gateway request failed:', error);
            throw error;
        }
    }
}

/**
 * Service for interacting with FHEVM contracts
 *
 * Usage:
 * ```typescript
 * const service = new ContractService({
 *   address: '0x...',
 *   abi: [...],
 *   signer
 * });
 *
 * const tx = await service.call('functionName', [arg1, arg2]);
 * ```
 */
class ContractService {
    constructor(config) {
        this.config = config;
        this.contract = new Contract(config.address, config.abi, config.signer);
    }
    /**
     * Get the underlying ethers Contract instance
     */
    getContract() {
        return this.contract;
    }
    /**
     * Get contract address
     */
    getAddress() {
        return this.config.address;
    }
    /**
     * Call a contract method (read-only)
     */
    async read(method, args = []) {
        try {
            const result = await this.contract[method](...args);
            return result;
        }
        catch (error) {
            console.error(`Failed to call ${method}:`, error);
            throw new Error(`Contract read failed: ${error}`);
        }
    }
    /**
     * Send a transaction to a contract method
     */
    async write(method, args = [], overrides) {
        try {
            const tx = await this.contract[method](...args, overrides || {});
            return tx;
        }
        catch (error) {
            console.error(`Failed to send transaction ${method}:`, error);
            throw new Error(`Contract write failed: ${error}`);
        }
    }
    /**
     * Wait for a transaction to be mined
     */
    async waitForTransaction(txHash, confirmations = 1) {
        try {
            const receipt = await this.contract.runner?.provider?.waitForTransaction(txHash, confirmations);
            return receipt;
        }
        catch (error) {
            console.error('Failed to wait for transaction:', error);
            throw new Error(`Transaction wait failed: ${error}`);
        }
    }
    /**
     * Estimate gas for a transaction
     */
    async estimateGas(method, args = []) {
        try {
            const gas = await this.contract[method].estimateGas(...args);
            return gas;
        }
        catch (error) {
            console.error(`Failed to estimate gas for ${method}:`, error);
            throw new Error(`Gas estimation failed: ${error}`);
        }
    }
    /**
     * Listen to contract events
     */
    on(event, listener) {
        this.contract.on(event, listener);
    }
    /**
     * Remove event listener
     */
    off(event, listener) {
        this.contract.off(event, listener);
    }
    /**
     * Query past events
     */
    async queryFilter(event, fromBlock, toBlock) {
        try {
            const filter = this.contract.filters[event]();
            const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
            return events;
        }
        catch (error) {
            console.error(`Failed to query events for ${event}:`, error);
            throw new Error(`Event query failed: ${error}`);
        }
    }
    /**
     * Connect contract to a different signer
     */
    connect(signer) {
        return new ContractService({
            ...this.config,
            signer,
        });
    }
}

/**
 * Utility functions for FHEVM SDK
 */
/**
 * Create a new FHEVM client instance
 */
async function createFhevmClient(provider, options) {
    const config = {
        provider,
        ...options,
    };
    const client = new FhevmClient(config);
    await client.init();
    return client;
}
/**
 * Quick encrypt value utility
 */
async function encryptValue(client, type, value) {
    const service = new EncryptionService(client);
    switch (type) {
        case 'bool':
            return service.encryptBool(value);
        case 'uint8':
            return service.encryptUint8(value);
        case 'uint16':
            return service.encryptUint16(value);
        case 'uint32':
            return service.encryptUint32(value);
        case 'uint64':
            return service.encryptUint64(value);
        default:
            throw new Error(`Unsupported type: ${type}`);
    }
}
/**
 * Quick decrypt value utility
 */
async function decryptValue(signer, type, contractAddress, ciphertext, userAddress, gatewayUrl) {
    const service = new DecryptionService(signer, gatewayUrl);
    const params = {
        contractAddress,
        ciphertext,
        userAddress,
    };
    switch (type) {
        case 'bool':
            return service.decryptBool(params);
        case 'uint8':
            return service.decryptUint8(params);
        case 'uint16':
            return service.decryptUint16(params);
        case 'uint32':
            return service.decryptUint32(params);
        case 'uint64':
            return service.decryptUint64(params);
        default:
            throw new Error(`Unsupported type: ${type}`);
    }
}
/**
 * Create contract instance
 */
function getContractInstance(config) {
    return new ContractService(config);
}

export { ContractService, DecryptionService, EncryptionService, FhevmClient, createFhevmClient, decryptValue, encryptValue, getContractInstance };
//# sourceMappingURL=index.esm.js.map
