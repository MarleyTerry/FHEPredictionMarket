import type { EncryptedInput, EncryptedData } from '../types';
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
export declare function useEncryption(): {
    encrypt: (type: "bool" | "uint8" | "uint16" | "uint32" | "uint64", value: boolean | number | bigint) => Promise<EncryptedInput | null>;
    encryptBatch: (contractAddress: string, userAddress: string, values: Array<{
        type: "bool" | "uint8" | "uint16" | "uint32" | "uint64" | "address";
        value: boolean | number | bigint | string;
    }>) => Promise<EncryptedData | null>;
    encryptBool: (value: boolean) => Promise<EncryptedInput>;
    encryptUint8: (value: number) => Promise<EncryptedInput>;
    encryptUint16: (value: number) => Promise<EncryptedInput>;
    encryptUint32: (value: number) => Promise<EncryptedInput>;
    encryptUint64: (value: bigint) => Promise<EncryptedInput>;
    isEncrypting: boolean;
    error: Error;
};
//# sourceMappingURL=useEncryption.d.ts.map