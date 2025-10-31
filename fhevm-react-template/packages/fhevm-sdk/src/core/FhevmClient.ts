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
  private publicKeyBytes?: Uint8Array;
  private initialized = false;

  constructor(config: FhevmConfig) {
    this.provider = config.provider;
    this.network = config.network as NetworkConfig;
    // Convert hex string to Uint8Array if provided
    if (config.publicKey) {
      this.publicKeyBytes = this.hexToUint8Array(config.publicKey);
    }
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

      // Prepare config for createInstance
      const config: any = {
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
  getPublicKey(): { publicKeyId: string; publicKey: Uint8Array } | null {
    const instance = this.getInstance();
    return instance.getPublicKey();
  }

  /**
   * Helper to convert hex string to Uint8Array
   */
  private hexToUint8Array(hex: string): Uint8Array {
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
  createEncryptedInput(contractAddress: string, userAddress: string) {
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
  createEIP712(publicKey: string, contractAddress: string, delegatedAccount?: string) {
    const instance = this.getInstance();
    return instance.createEIP712(publicKey, contractAddress, delegatedAccount);
  }

  /**
   * Reencrypt a value for the user
   */
  async reencrypt(
    handle: bigint,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddress: string,
    userAddress: string
  ): Promise<bigint> {
    const instance = this.getInstance();
    return instance.reencrypt(handle, privateKey, publicKey, signature, contractAddress, userAddress);
  }
}
