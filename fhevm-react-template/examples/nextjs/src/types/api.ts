/**
 * API-related TypeScript types
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptAPIRequest {
  value: string;
  type: string;
}

export interface DecryptAPIRequest {
  handles: string[];
  signature: string;
  publicKey: string;
}

export interface ComputeAPIRequest {
  operation: string;
  operands: string[];
  contractAddress: string;
}

export interface KeyAPIResponse {
  publicKey: string;
  networkUrl: string;
  gatewayUrl: string;
}
