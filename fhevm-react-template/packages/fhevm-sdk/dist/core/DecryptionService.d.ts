import type { Signer } from 'ethers';
import type { DecryptionParams, DecryptionResult } from '../types';
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
export declare class DecryptionService {
    private signer;
    private gatewayUrl?;
    constructor(signer: Signer, gatewayUrl?: string);
    /**
     * Decrypt a value with user signature (userDecrypt)
     */
    decrypt<T = any>(params: DecryptionParams): Promise<DecryptionResult<T>>;
    /**
     * Public decryption without signature
     */
    publicDecrypt<T = any>(contractAddress: string, ciphertext: bigint | string): Promise<T>;
    /**
     * Decrypt boolean value
     */
    decryptBool(params: DecryptionParams): Promise<boolean>;
    /**
     * Decrypt uint8 value
     */
    decryptUint8(params: DecryptionParams): Promise<number>;
    /**
     * Decrypt uint16 value
     */
    decryptUint16(params: DecryptionParams): Promise<number>;
    /**
     * Decrypt uint32 value
     */
    decryptUint32(params: DecryptionParams): Promise<number>;
    /**
     * Decrypt uint64 value
     */
    decryptUint64(params: DecryptionParams): Promise<bigint>;
    /**
     * Create EIP-712 signature for decryption
     */
    private createDecryptionSignature;
    /**
     * Request decryption from gateway
     */
    private requestDecryption;
}
//# sourceMappingURL=DecryptionService.d.ts.map