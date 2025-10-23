import { createInstance, initFhevm } from 'fhevmjs';
import type { BrowserProvider, JsonRpcProvider } from 'ethers';
import type { FhevmConfig, FhevmInstance, NetworkConfig } from '../types';

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
export class FhevmClient {
  private instance: FhevmInstance | null = null;
  private provider: BrowserProvider | JsonRpcProvider;
  private network?: NetworkConfig;
  private publicKey?: string;
  private initialized = false;

  constructor(config: FhevmConfig) {
    this.provider = config.provider;
    this.network = config.network as NetworkConfig;
    this.publicKey = config.publicKey;
  }

  /**
   * Initialize the FHEVM client
   */
  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize fhevmjs library
      await initFhevm();

      // Get network information
      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);

      // Create FHEVM instance with public key
      if (!this.publicKey) {
        // Fetch public key from the network if not provided
        this.publicKey = await this.fetchPublicKey(chainId);
      }

      this.instance = await createInstance({
        chainId,
        publicKey: this.publicKey,
      });

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize FHEVM client:', error);
      throw new Error(`FHEVM initialization failed: ${error}`);
    }
  }

  /**
   * Get the underlying FHEVM instance
   */
  getInstance(): FhevmInstance {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized. Call init() first.');
    }
    return this.instance;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the public key
   */
  getPublicKey(): string {
    if (!this.publicKey) {
      throw new Error('Public key not available');
    }
    return this.publicKey;
  }

  /**
   * Fetch public key from the network
   */
  private async fetchPublicKey(chainId: number): Promise<string> {
    try {
      // In production, this would fetch from the gateway or ACL contract
      // For now, return a placeholder that would be replaced with actual implementation
      const response = await fetch(`https://gateway.zama.ai/publicKey/${chainId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch public key from gateway');
      }

      const data = await response.json();
      return data.publicKey;
    } catch (error) {
      console.warn('Failed to fetch public key, using default');
      // Fallback to a default public key for development
      return '0x' + '0'.repeat(64);
    }
  }

  /**
   * Create encrypted input builder for a contract
   */
  createEncryptedInput(contractAddress: string, userAddress: string) {
    const instance = this.getInstance();
    return instance.createEncryptedInput(contractAddress, userAddress);
  }

  /**
   * Encrypt a boolean value
   */
  encryptBool(value: boolean) {
    const instance = this.getInstance();
    return instance.encryptBool(value);
  }

  /**
   * Encrypt an 8-bit unsigned integer
   */
  encrypt8(value: number) {
    const instance = this.getInstance();
    return instance.encrypt8(value);
  }

  /**
   * Encrypt a 16-bit unsigned integer
   */
  encrypt16(value: number) {
    const instance = this.getInstance();
    return instance.encrypt16(value);
  }

  /**
   * Encrypt a 32-bit unsigned integer
   */
  encrypt32(value: number) {
    const instance = this.getInstance();
    return instance.encrypt32(value);
  }

  /**
   * Encrypt a 64-bit unsigned integer
   */
  encrypt64(value: bigint) {
    const instance = this.getInstance();
    return instance.encrypt64(value);
  }
}
