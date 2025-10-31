/**
 * FHE-specific TypeScript types for the Next.js example
 */

export type EncryptedType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bytes';

export interface FHEClientState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface EncryptedData {
  ciphertext: string;
  type: EncryptedType;
  timestamp: number;
}

export interface DecryptionRequest {
  handles: string[];
  signature: string;
  publicKey: string;
}

export interface FHETransaction {
  txHash: string;
  encryptedInputs: string[];
  status: 'pending' | 'confirmed' | 'failed';
}
