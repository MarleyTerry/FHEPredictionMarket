'use client';

import { useFhevmClient, useEncryption, useDecryption } from '@fhevm/sdk/react';

/**
 * Main FHE hook that combines all FHE operations
 * Provides a unified interface for encryption, decryption, and client management
 */
export function useFHE() {
  const { client, isInitialized, error: clientError } = useFhevmClient();
  const { encrypt, isEncrypting, error: encryptError } = useEncryption();
  const { decrypt, isDecrypting, error: decryptError } = useDecryption();

  return {
    // Client
    client,
    isInitialized,

    // Encryption
    encrypt,
    isEncrypting,

    // Decryption
    decrypt,
    isDecrypting,

    // Errors
    error: clientError || encryptError || decryptError,

    // Status
    isReady: isInitialized && !clientError,
    isProcessing: isEncrypting || isDecrypting
  };
}
