import type { FhevmClient } from './FhevmClient';
import type { EncryptedInput, EncryptedData } from '../types';

/**
 * Service for encrypting values using FHEVM
 *
 * Usage:
 * ```typescript
 * const service = new EncryptionService(fhevmClient);
 * const encrypted = await service.encryptUint32(100);
 * ```
 */
export class EncryptionService {
  private client: FhevmClient;

  constructor(client: FhevmClient) {
    this.client = client;
  }

  /**
   * Encrypt a boolean value
   */
  async encryptBool(value: boolean): Promise<EncryptedInput> {
    if (!this.client.isInitialized()) {
      await this.client.init();
    }
    return this.client.encryptBool(value);
  }

  /**
   * Encrypt an 8-bit unsigned integer
   */
  async encryptUint8(value: number): Promise<EncryptedInput> {
    this.validateUint(value, 8);
    if (!this.client.isInitialized()) {
      await this.client.init();
    }
    return this.client.encrypt8(value);
  }

  /**
   * Encrypt a 16-bit unsigned integer
   */
  async encryptUint16(value: number): Promise<EncryptedInput> {
    this.validateUint(value, 16);
    if (!this.client.isInitialized()) {
      await this.client.init();
    }
    return this.client.encrypt16(value);
  }

  /**
   * Encrypt a 32-bit unsigned integer
   */
  async encryptUint32(value: number): Promise<EncryptedInput> {
    this.validateUint(value, 32);
    if (!this.client.isInitialized()) {
      await this.client.init();
    }
    return this.client.encrypt32(value);
  }

  /**
   * Encrypt a 64-bit unsigned integer
   */
  async encryptUint64(value: bigint): Promise<EncryptedInput> {
    this.validateUint64(value);
    if (!this.client.isInitialized()) {
      await this.client.init();
    }
    return this.client.encrypt64(value);
  }

  /**
   * Create an encrypted input builder for batch encryption
   */
  createEncryptedInputBuilder(contractAddress: string, userAddress: string) {
    if (!this.client.isInitialized()) {
      throw new Error('Client not initialized');
    }
    return this.client.createEncryptedInput(contractAddress, userAddress);
  }

  /**
   * Encrypt multiple values at once
   */
  async encryptBatch(
    contractAddress: string,
    userAddress: string,
    values: Array<{
      type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address';
      value: boolean | number | bigint | string;
    }>
  ): Promise<EncryptedData> {
    if (!this.client.isInitialized()) {
      await this.client.init();
    }

    const builder = this.createEncryptedInputBuilder(contractAddress, userAddress);

    for (const { type, value } of values) {
      switch (type) {
        case 'bool':
          builder.addBool(value as boolean);
          break;
        case 'uint8':
          builder.add8(value as number);
          break;
        case 'uint16':
          builder.add16(value as number);
          break;
        case 'uint32':
          builder.add32(value as number);
          break;
        case 'uint64':
          builder.add64(value as bigint);
          break;
        case 'address':
          builder.addAddress(value as string);
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
  private validateUint(value: number, bits: 8 | 16 | 32): void {
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
  private validateUint64(value: bigint): void {
    if (value < 0n) {
      throw new Error('Value must be non-negative');
    }
    const max = 2n ** 64n - 1n;
    if (value > max) {
      throw new Error(`Value exceeds maximum for uint64: ${max}`);
    }
  }
}
