import type { Signer } from 'ethers';
import type { DecryptionParams, DecryptionResult, EIP712Domain } from '../types';

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
export class DecryptionService {
  private signer: Signer;
  private gatewayUrl?: string;

  constructor(signer: Signer, gatewayUrl?: string) {
    this.signer = signer;
    this.gatewayUrl = gatewayUrl || 'https://gateway.zama.ai';
  }

  /**
   * Decrypt a value with user signature (userDecrypt)
   */
  async decrypt<T = any>(params: DecryptionParams): Promise<DecryptionResult<T>> {
    const { contractAddress, ciphertext, userAddress } = params;

    try {
      // Create EIP-712 signature for decryption request
      const signature = await this.createDecryptionSignature(
        contractAddress,
        ciphertext,
        userAddress
      );

      // Send decryption request to gateway
      const result = await this.requestDecryption(
        contractAddress,
        ciphertext,
        signature
      );

      return {
        value: result,
        signature,
      };
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error(`Failed to decrypt value: ${error}`);
    }
  }

  /**
   * Public decryption without signature
   */
  async publicDecrypt<T = any>(
    contractAddress: string,
    ciphertext: bigint | string
  ): Promise<T> {
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
    } catch (error) {
      console.error('Public decryption failed:', error);
      throw new Error(`Failed to publicly decrypt value: ${error}`);
    }
  }

  /**
   * Decrypt boolean value
   */
  async decryptBool(params: DecryptionParams): Promise<boolean> {
    const result = await this.decrypt<number>(params);
    return result.value === 1;
  }

  /**
   * Decrypt uint8 value
   */
  async decryptUint8(params: DecryptionParams): Promise<number> {
    const result = await this.decrypt<number>(params);
    return result.value;
  }

  /**
   * Decrypt uint16 value
   */
  async decryptUint16(params: DecryptionParams): Promise<number> {
    const result = await this.decrypt<number>(params);
    return result.value;
  }

  /**
   * Decrypt uint32 value
   */
  async decryptUint32(params: DecryptionParams): Promise<number> {
    const result = await this.decrypt<number>(params);
    return result.value;
  }

  /**
   * Decrypt uint64 value
   */
  async decryptUint64(params: DecryptionParams): Promise<bigint> {
    const result = await this.decrypt<string>(params);
    return BigInt(result.value);
  }

  /**
   * Create EIP-712 signature for decryption
   */
  private async createDecryptionSignature(
    contractAddress: string,
    ciphertext: bigint | string,
    userAddress: string
  ): Promise<string> {
    const chainId = await this.signer.provider?.getNetwork().then((n) => Number(n.chainId));

    if (!chainId) {
      throw new Error('Could not determine chain ID');
    }

    const domain: EIP712Domain = {
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
    } catch (error) {
      console.error('Failed to create signature:', error);
      throw new Error(`Signature creation failed: ${error}`);
    }
  }

  /**
   * Request decryption from gateway
   */
  private async requestDecryption(
    contractAddress: string,
    ciphertext: bigint | string,
    signature: string
  ): Promise<any> {
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
    } catch (error) {
      console.error('Gateway request failed:', error);
      throw error;
    }
  }
}
