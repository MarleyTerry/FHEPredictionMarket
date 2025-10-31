'use strict';

var React = require('react');
var fhevmjs = require('fhevmjs');
var ethers = require('ethers');

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
            await fhevmjs.initFhevm();
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
            this.instance = await fhevmjs.createInstance(config);
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

const FhevmContext = React.createContext(undefined);
/**
 * Provider component for FHEVM SDK in React applications
 *
 * Usage:
 * ```tsx
 * <FhevmProvider provider={provider}>
 *   <App />
 * </FhevmProvider>
 * ```
 */
function FhevmProvider({ children, provider, config }) {
    const [client, setClient] = React.useState(null);
    const [isInitialized, setIsInitialized] = React.useState(false);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        if (!provider) {
            setClient(null);
            setIsInitialized(false);
            return;
        }
        const initClient = async () => {
            try {
                const fhevmClient = new FhevmClient({
                    provider,
                    ...config,
                });
                await fhevmClient.init();
                setClient(fhevmClient);
                setIsInitialized(true);
                setError(null);
            }
            catch (err) {
                console.error('Failed to initialize FHEVM client:', err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
                setIsInitialized(false);
            }
        };
        initClient();
    }, [provider, config]);
    return (React.createElement(FhevmContext.Provider, { value: { client, isInitialized, error } }, children));
}
/**
 * Hook to access FHEVM context
 */
function useFhevmContext() {
    const context = React.useContext(FhevmContext);
    if (context === undefined) {
        throw new Error('useFhevmContext must be used within FhevmProvider');
    }
    return context;
}

/**
 * Hook to access FHEVM client instance
 *
 * Usage:
 * ```tsx
 * const { client, isInitialized, error } = useFhevmClient();
 * ```
 */
function useFhevmClient() {
    const { client, isInitialized, error } = useFhevmContext();
    return {
        client,
        isInitialized,
        error,
        isReady: isInitialized && !error,
    };
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
 * Hook for encrypting values with FHEVM
 *
 * Usage:
 * ```tsx
 * const { encrypt, encryptBatch, isEncrypting, error } = useEncryption();
 *
 * const handleEncrypt = async () => {
 *   const encrypted = await encrypt('uint32', 100);
 * };
 * ```
 */
function useEncryption() {
    const { client, isReady } = useFhevmClient();
    const [isEncrypting, setIsEncrypting] = React.useState(false);
    const [error, setError] = React.useState(null);
    const encrypt = React.useCallback(async (type, value) => {
        if (!client || !isReady) {
            setError(new Error('FHEVM client not ready'));
            return null;
        }
        setIsEncrypting(true);
        setError(null);
        try {
            const service = new EncryptionService(client);
            let result;
            switch (type) {
                case 'bool':
                    result = await service.encryptBool(value);
                    break;
                case 'uint8':
                    result = await service.encryptUint8(value);
                    break;
                case 'uint16':
                    result = await service.encryptUint16(value);
                    break;
                case 'uint32':
                    result = await service.encryptUint32(value);
                    break;
                case 'uint64':
                    result = await service.encryptUint64(value);
                    break;
                default:
                    throw new Error(`Unsupported type: ${type}`);
            }
            return result;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Encryption failed');
            setError(error);
            return null;
        }
        finally {
            setIsEncrypting(false);
        }
    }, [client, isReady]);
    const encryptBatch = React.useCallback(async (contractAddress, userAddress, values) => {
        if (!client || !isReady) {
            setError(new Error('FHEVM client not ready'));
            return null;
        }
        setIsEncrypting(true);
        setError(null);
        try {
            const service = new EncryptionService(client);
            const result = await service.encryptBatch(contractAddress, userAddress, values);
            return result;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Batch encryption failed');
            setError(error);
            return null;
        }
        finally {
            setIsEncrypting(false);
        }
    }, [client, isReady]);
    const encryptBool = React.useCallback((value) => encrypt('bool', value), [encrypt]);
    const encryptUint8 = React.useCallback((value) => encrypt('uint8', value), [encrypt]);
    const encryptUint16 = React.useCallback((value) => encrypt('uint16', value), [encrypt]);
    const encryptUint32 = React.useCallback((value) => encrypt('uint32', value), [encrypt]);
    const encryptUint64 = React.useCallback((value) => encrypt('uint64', value), [encrypt]);
    return {
        encrypt,
        encryptBatch,
        encryptBool,
        encryptUint8,
        encryptUint16,
        encryptUint32,
        encryptUint64,
        isEncrypting,
        error,
    };
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
 * Hook for decrypting FHEVM encrypted values
 *
 * Usage:
 * ```tsx
 * const { decrypt, isDecrypting, error } = useDecryption(signer);
 *
 * const handleDecrypt = async () => {
 *   const value = await decrypt('uint32', {
 *     contractAddress: '0x...',
 *     ciphertext: '0x...',
 *     userAddress: '0x...'
 *   });
 * };
 * ```
 */
function useDecryption(signer, gatewayUrl) {
    const [isDecrypting, setIsDecrypting] = React.useState(false);
    const [error, setError] = React.useState(null);
    const decrypt = React.useCallback(async (type, params) => {
        if (!signer) {
            setError(new Error('Signer not provided'));
            return null;
        }
        setIsDecrypting(true);
        setError(null);
        try {
            const service = new DecryptionService(signer, gatewayUrl);
            let result;
            switch (type) {
                case 'bool':
                    result = await service.decryptBool(params);
                    break;
                case 'uint8':
                    result = await service.decryptUint8(params);
                    break;
                case 'uint16':
                    result = await service.decryptUint16(params);
                    break;
                case 'uint32':
                    result = await service.decryptUint32(params);
                    break;
                case 'uint64':
                    result = await service.decryptUint64(params);
                    break;
                default:
                    throw new Error(`Unsupported type: ${type}`);
            }
            return result;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Decryption failed');
            setError(error);
            return null;
        }
        finally {
            setIsDecrypting(false);
        }
    }, [signer, gatewayUrl]);
    const publicDecrypt = React.useCallback(async (contractAddress, ciphertext) => {
        if (!signer) {
            setError(new Error('Signer not provided'));
            return null;
        }
        setIsDecrypting(true);
        setError(null);
        try {
            const service = new DecryptionService(signer, gatewayUrl);
            const result = await service.publicDecrypt(contractAddress, ciphertext);
            return result;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Public decryption failed');
            setError(error);
            return null;
        }
        finally {
            setIsDecrypting(false);
        }
    }, [signer, gatewayUrl]);
    const decryptBool = React.useCallback((params) => decrypt('bool', params), [decrypt]);
    const decryptUint8 = React.useCallback((params) => decrypt('uint8', params), [decrypt]);
    const decryptUint16 = React.useCallback((params) => decrypt('uint16', params), [decrypt]);
    const decryptUint32 = React.useCallback((params) => decrypt('uint32', params), [decrypt]);
    const decryptUint64 = React.useCallback((params) => decrypt('uint64', params), [decrypt]);
    return {
        decrypt,
        publicDecrypt,
        decryptBool,
        decryptUint8,
        decryptUint16,
        decryptUint32,
        decryptUint64,
        isDecrypting,
        error,
    };
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
        this.contract = new ethers.Contract(config.address, config.abi, config.signer);
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
 * Hook for interacting with FHEVM contracts
 *
 * Usage:
 * ```tsx
 * const { contract, read, write, isLoading, error } = useContract({
 *   address: '0x...',
 *   abi: [...],
 *   signer
 * });
 *
 * const result = await read('balanceOf', [address]);
 * const tx = await write('transfer', [to, amount]);
 * ```
 */
function useContract(config) {
    const [contract, setContract] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        try {
            const contractService = new ContractService(config);
            setContract(contractService);
            setError(null);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to create contract');
            setError(error);
            setContract(null);
        }
    }, [config.address, config.abi, config.signer]);
    const read = React.useCallback(async (method, args = []) => {
        if (!contract) {
            setError(new Error('Contract not initialized'));
            return null;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await contract.read(method, args);
            return result;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Contract read failed');
            setError(error);
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, [contract]);
    const write = React.useCallback(async (method, args = [], overrides) => {
        if (!contract) {
            setError(new Error('Contract not initialized'));
            return null;
        }
        setIsLoading(true);
        setError(null);
        try {
            const tx = await contract.write(method, args, overrides);
            return tx;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Transaction failed');
            setError(error);
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, [contract]);
    const estimateGas = React.useCallback(async (method, args = []) => {
        if (!contract) {
            setError(new Error('Contract not initialized'));
            return null;
        }
        try {
            const gas = await contract.estimateGas(method, args);
            return gas;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Gas estimation failed');
            setError(error);
            return null;
        }
    }, [contract]);
    const on = React.useCallback((event, listener) => {
        if (contract) {
            contract.on(event, listener);
        }
    }, [contract]);
    const off = React.useCallback((event, listener) => {
        if (contract) {
            contract.off(event, listener);
        }
    }, [contract]);
    return {
        contract,
        read,
        write,
        estimateGas,
        on,
        off,
        isLoading,
        error,
    };
}

/**
 * Hook for sending encrypted transactions to FHEVM contracts
 *
 * Usage:
 * ```tsx
 * const { sendEncryptedTransaction, isLoading, error } = useEncryptedTransaction({
 *   address: '0x...',
 *   abi: [...],
 *   signer
 * });
 *
 * const tx = await sendEncryptedTransaction({
 *   method: 'placeBet',
 *   encryptedInputs: [
 *     { type: 'uint32', value: 100 },
 *     { type: 'bool', value: true }
 *   ],
 *   additionalArgs: [marketId]
 * });
 * ```
 */
function useEncryptedTransaction(config) {
    const { client, isReady } = useFhevmClient();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const sendEncryptedTransaction = React.useCallback(async (params) => {
        if (!client || !isReady) {
            const error = new Error('FHEVM client not ready');
            setError(error);
            return null;
        }
        if (!config.signer) {
            const error = new Error('Signer not provided');
            setError(error);
            return null;
        }
        setIsLoading(true);
        setError(null);
        try {
            // Get user address
            const userAddress = await config.signer.getAddress();
            // Encrypt inputs
            const encryptionService = new EncryptionService(client);
            const encryptedData = await encryptionService.encryptBatch(config.address, userAddress, params.encryptedInputs);
            // Create contract service
            const contractService = new ContractService(config);
            // Prepare transaction arguments
            const txArgs = [
                ...encryptedData.handles,
                encryptedData.inputProof,
                ...(params.additionalArgs || []),
            ];
            // Send transaction
            const tx = await contractService.write(params.method, txArgs, params.overrides);
            return tx;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Transaction failed');
            setError(error);
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, [client, isReady, config]);
    return {
        sendEncryptedTransaction,
        isLoading,
        error,
    };
}

exports.FhevmProvider = FhevmProvider;
exports.useContract = useContract;
exports.useDecryption = useDecryption;
exports.useEncryptedTransaction = useEncryptedTransaction;
exports.useEncryption = useEncryption;
exports.useFhevmClient = useFhevmClient;
exports.useFhevmContext = useFhevmContext;
//# sourceMappingURL=index.js.map
