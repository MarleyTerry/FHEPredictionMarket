import { useState, useCallback } from 'react';
import { EncryptionService } from '../core/EncryptionService';
import { useFhevmClient } from './useFhevmClient';
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
export function useEncryption() {
  const { client, isReady } = useFhevmClient();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (
      type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64',
      value: boolean | number | bigint
    ): Promise<EncryptedInput | null> => {
      if (!client || !isReady) {
        setError(new Error('FHEVM client not ready'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const service = new EncryptionService(client);

        let result: EncryptedInput;
        switch (type) {
          case 'bool':
            result = await service.encryptBool(value as boolean);
            break;
          case 'uint8':
            result = await service.encryptUint8(value as number);
            break;
          case 'uint16':
            result = await service.encryptUint16(value as number);
            break;
          case 'uint32':
            result = await service.encryptUint32(value as number);
            break;
          case 'uint64':
            result = await service.encryptUint64(value as bigint);
            break;
          default:
            throw new Error(`Unsupported type: ${type}`);
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isReady]
  );

  const encryptBatch = useCallback(
    async (
      contractAddress: string,
      userAddress: string,
      values: Array<{
        type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address';
        value: boolean | number | bigint | string;
      }>
    ): Promise<EncryptedData | null> => {
      if (!client || !isReady) {
        setError(new Error('FHEVM client not ready'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const service = new EncryptionService(client);
        const result = await service.encryptBatch(contractAddress, userAddress, values);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Batch encryption failed');
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isReady]
  );

  const encryptBool = useCallback(
    (value: boolean) => encrypt('bool', value),
    [encrypt]
  );

  const encryptUint8 = useCallback(
    (value: number) => encrypt('uint8', value),
    [encrypt]
  );

  const encryptUint16 = useCallback(
    (value: number) => encrypt('uint16', value),
    [encrypt]
  );

  const encryptUint32 = useCallback(
    (value: number) => encrypt('uint32', value),
    [encrypt]
  );

  const encryptUint64 = useCallback(
    (value: bigint) => encrypt('uint64', value),
    [encrypt]
  );

  return {
    encrypt,
    encryptBatch,
    encryptBool,
    encryptUint8,
    encryptUint16,
    encryptUint32,
    encryptUint64,
    isEncrypting,
    error,
  };
}
