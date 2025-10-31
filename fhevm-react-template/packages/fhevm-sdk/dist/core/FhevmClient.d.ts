import type { FhevmConfig, FhevmInstance } from '../types';
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
export declare class FhevmClient {
    private instance;
    private provider;
    private network?;
    private publicKeyBytes?;
    private initialized;
    constructor(config: FhevmConfig);
    /**
     * Initialize the FHEVM client
     */
    init(): Promise<void>;
    /**
     * Get the underlying FHEVM instance
     */
    getInstance(): FhevmInstance;
    /**
     * Check if client is initialized
     */
    isInitialized(): boolean;
    /**
     * Get the public key
     */
    getPublicKey(): {
        publicKeyId: string;
        publicKey: Uint8Array;
    } | null;
    /**
     * Helper to convert hex string to Uint8Array
     */
    private hexToUint8Array;
    /**
     * Create encrypted input builder for a contract
     */
    createEncryptedInput(contractAddress: string, userAddress: string): import("../types").EncryptedInputBuilder;
    /**
     * Generate a keypair for reencryption
     */
    generateKeypair(): {
        publicKey: string;
        privateKey: string;
    };
    /**
     * Create EIP-712 signature object
     */
    createEIP712(publicKey: string, contractAddress: string, delegatedAccount?: string): any;
    /**
     * Reencrypt a value for the user
     */
    reencrypt(handle: bigint, privateKey: string, publicKey: string, signature: string, contractAddress: string, userAddress: string): Promise<bigint>;
}
//# sourceMappingURL=FhevmClient.d.ts.map