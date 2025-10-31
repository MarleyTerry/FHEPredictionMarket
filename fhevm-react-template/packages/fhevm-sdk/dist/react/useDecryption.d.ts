import type { Signer } from 'ethers';
import type { DecryptionParams } from '../types';
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
export declare function useDecryption(signer?: Signer, gatewayUrl?: string): {
    decrypt: <T = any>(type: "bool" | "uint8" | "uint16" | "uint32" | "uint64", params: DecryptionParams) => Promise<T | null>;
    publicDecrypt: <T = any>(contractAddress: string, ciphertext: bigint | string) => Promise<T | null>;
    decryptBool: (params: DecryptionParams) => Promise<boolean>;
    decryptUint8: (params: DecryptionParams) => Promise<number>;
    decryptUint16: (params: DecryptionParams) => Promise<number>;
    decryptUint32: (params: DecryptionParams) => Promise<number>;
    decryptUint64: (params: DecryptionParams) => Promise<bigint>;
    isDecrypting: boolean;
    error: Error;
};
//# sourceMappingURL=useDecryption.d.ts.map