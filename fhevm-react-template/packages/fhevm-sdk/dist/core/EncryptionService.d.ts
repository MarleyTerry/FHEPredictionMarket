import type { FhevmClient } from './FhevmClient';
import type { EncryptedData } from '../types';
/**
 * Service for encrypting values using FHEVM
 *
 * Usage:
 * ```typescript
 * const service = new EncryptionService(fhevmClient);
 * const encrypted = await service.encryptUint32(100);
 * ```
 */
export declare class EncryptionService {
    private client;
    constructor(client: FhevmClient);
    /**
     * Encrypt a single boolean value
     * This is a convenience method that creates a builder with one value
     */
    encryptBool(value: boolean, contractAddress: string, userAddress: string): Promise<EncryptedData>;
    /**
     * Encrypt a single 8-bit unsigned integer
     */
    encryptUint8(value: number, contractAddress: string, userAddress: string): Promise<EncryptedData>;
    /**
     * Encrypt a single 16-bit unsigned integer
     */
    encryptUint16(value: number, contractAddress: string, userAddress: string): Promise<EncryptedData>;
    /**
     * Encrypt a single 32-bit unsigned integer
     */
    encryptUint32(value: number, contractAddress: string, userAddress: string): Promise<EncryptedData>;
    /**
     * Encrypt a single 64-bit unsigned integer
     */
    encryptUint64(value: bigint, contractAddress: string, userAddress: string): Promise<EncryptedData>;
    /**
     * Create an encrypted input builder for batch encryption
     */
    createEncryptedInputBuilder(contractAddress: string, userAddress: string): import("../types").EncryptedInputBuilder;
    /**
     * Encrypt multiple values at once
     */
    encryptBatch(contractAddress: string, userAddress: string, values: Array<{
        type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address';
        value: boolean | number | bigint | string;
    }>): Promise<EncryptedData>;
    /**
     * Validate unsigned integer value
     */
    private validateUint;
    /**
     * Validate 64-bit unsigned integer
     */
    private validateUint64;
}
//# sourceMappingURL=EncryptionService.d.ts.map