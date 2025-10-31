/**
 * FHE-related type definitions
 */

export type EncryptedType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bytes';

export interface EncryptedValue {
  value: string;
  type: EncryptedType;
  timestamp: number;
}

export interface FHEOperation {
  operation: 'add' | 'sub' | 'mul' | 'div' | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';
  operands: string[];
  result?: string;
}

export interface DecryptionRequest {
  handles: string[];
  signature: string;
  publicKey: string;
}

export interface FHEClientConfig {
  provider: any;
  network?: string;
  gatewayUrl?: string;
}

export interface FHEError {
  code: string;
  message: string;
  details?: any;
}
