import type { BrowserProvider, JsonRpcProvider, Signer } from 'ethers';

/**
 * Configuration for FHEVM Client
 */
export interface FhevmConfig {
  provider: BrowserProvider | JsonRpcProvider;
  network?: {
    chainId: number;
    name: string;
    gatewayUrl?: string;
    aclAddress?: string;
  };
  publicKey?: string;
}

/**
 * FHEVM Instance with encryption capabilities
 */
export interface FhevmInstance {
  encrypt8(value: number): EncryptedInput;
  encrypt16(value: number): EncryptedInput;
  encrypt32(value: number): EncryptedInput;
  encrypt64(value: bigint): EncryptedInput;
  encryptBool(value: boolean): EncryptedInput;
  createEncryptedInput(contractAddress: string, userAddress: string): EncryptedInputBuilder;
  getPublicKey(): string;
  setPublicKey(publicKey: string): void;
}

/**
 * Builder for encrypted inputs
 */
export interface EncryptedInputBuilder {
  add8(value: number): this;
  add16(value: number): this;
  add32(value: number): this;
  add64(value: bigint): this;
  addBool(value: boolean): this;
  addAddress(address: string): this;
  encrypt(): EncryptedData;
}

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  handles: Uint8Array[];
  inputProof: string;
}

/**
 * Single encrypted input
 */
export interface EncryptedInput {
  data: Uint8Array;
  signature?: string;
}

/**
 * Decryption result
 */
export interface DecryptionResult<T = any> {
  value: T;
  signature?: string;
}

/**
 * Contract configuration
 */
export interface ContractConfig {
  address: string;
  abi: any[];
  signer?: Signer;
}

/**
 * EIP-712 Domain for signatures
 */
export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

/**
 * Decryption request parameters
 */
export interface DecryptionParams {
  contractAddress: string;
  ciphertext: bigint | string;
  userAddress: string;
  signature?: string;
}

/**
 * Network configuration
 */
export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  gatewayUrl?: string;
  aclAddress?: string;
  kmsVerifierAddress?: string;
}

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS: Record<number, NetworkConfig> = {
  8009: {
    chainId: 8009,
    name: 'Zama Devnet',
    rpcUrl: 'https://devnet.zama.ai',
    gatewayUrl: 'https://gateway.zama.ai',
  },
  9000: {
    chainId: 9000,
    name: 'Zama Local',
    rpcUrl: 'http://localhost:8545',
    gatewayUrl: 'http://localhost:8545',
  },
};
