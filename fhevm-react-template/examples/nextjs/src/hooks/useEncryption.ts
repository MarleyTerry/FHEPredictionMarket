'use client';

import { useState, useCallback } from 'react';
import { useFhevmClient } from '@fhevm/sdk/react';
import type { EncryptedType } from '../lib/fhe/types';

/**
 * Enhanced encryption hook with additional utilities
 */
export function useEnhancedEncryption() {
  const { client, isInitialized } = useFhevmClient();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastEncrypted, setLastEncrypted] = useState<string | null>(null);

  const encrypt = useCallback(async (value: bigint | number, type: EncryptedType) => {
    if (!client || !isInitialized) {
      throw new Error('FHE client not initialized');
    }

    setIsEncrypting(true);
    setError(null);

    try {
      const bigIntValue = typeof value === 'number' ? BigInt(value) : value;
      const encrypted = await client.encrypt(bigIntValue, type);
      setLastEncrypted(encrypted);
      return encrypted;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Encryption failed');
      setError(error);
      throw error;
    } finally {
      setIsEncrypting(false);
    }
  }, [client, isInitialized]);

  const encryptMultiple = useCallback(async (
    values: Array<{ value: bigint | number; type: EncryptedType }>
  ) => {
    if (!client || !isInitialized) {
      throw new Error('FHE client not initialized');
    }

    setIsEncrypting(true);
    setError(null);

    try {
      const results = await Promise.all(
        values.map(({ value, type }) => {
          const bigIntValue = typeof value === 'number' ? BigInt(value) : value;
          return client.encrypt(bigIntValue, type);
        })
      );
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Multiple encryption failed');
      setError(error);
      throw error;
    } finally {
      setIsEncrypting(false);
    }
  }, [client, isInitialized]);

  return {
    encrypt,
    encryptMultiple,
    isEncrypting,
    error,
    lastEncrypted,
    isReady: isInitialized
  };
}
