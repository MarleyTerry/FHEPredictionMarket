import { useState, useCallback } from 'react';
import type { Signer } from 'ethers';
import { DecryptionService } from '../core/DecryptionService';
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
export function useDecryption(signer?: Signer, gatewayUrl?: string) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async <T = any>(
      type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64',
      params: DecryptionParams
    ): Promise<T | null> => {
      if (!signer) {
        setError(new Error('Signer not provided'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const service = new DecryptionService(signer, gatewayUrl);

        let result: any;
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
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Decryption failed');
        setError(error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [signer, gatewayUrl]
  );

  const publicDecrypt = useCallback(
    async <T = any>(contractAddress: string, ciphertext: bigint | string): Promise<T | null> => {
      if (!signer) {
        setError(new Error('Signer not provided'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const service = new DecryptionService(signer, gatewayUrl);
        const result = await service.publicDecrypt<T>(contractAddress, ciphertext);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Public decryption failed');
        setError(error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [signer, gatewayUrl]
  );

  const decryptBool = useCallback(
    (params: DecryptionParams) => decrypt<boolean>('bool', params),
    [decrypt]
  );

  const decryptUint8 = useCallback(
    (params: DecryptionParams) => decrypt<number>('uint8', params),
    [decrypt]
  );

  const decryptUint16 = useCallback(
    (params: DecryptionParams) => decrypt<number>('uint16', params),
    [decrypt]
  );

  const decryptUint32 = useCallback(
    (params: DecryptionParams) => decrypt<number>('uint32', params),
    [decrypt]
  );

  const decryptUint64 = useCallback(
    (params: DecryptionParams) => decrypt<bigint>('uint64', params),
    [decrypt]
  );

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
