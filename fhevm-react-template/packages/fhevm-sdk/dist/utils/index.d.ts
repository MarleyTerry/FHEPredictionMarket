/**
 * Utility functions for FHEVM SDK
 */
import { BrowserProvider, JsonRpcProvider, type Signer } from 'ethers';
import { FhevmClient } from '../core/FhevmClient';
import { ContractService } from '../core/ContractService';
import type { FhevmConfig, ContractConfig } from '../types';
/**
 * Create a new FHEVM client instance
 */
export declare function createFhevmClient(provider: BrowserProvider | JsonRpcProvider, options?: Partial<FhevmConfig>): Promise<FhevmClient>;
/**
 * Quick encrypt value utility
 */
export declare function encryptValue(client: FhevmClient, type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64', value: boolean | number | bigint): Promise<import("../types").EncryptedData>;
/**
 * Quick decrypt value utility
 */
export declare function decryptValue(signer: Signer, type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64', contractAddress: string, ciphertext: bigint | string, userAddress: string, gatewayUrl?: string): Promise<number | bigint | boolean>;
/**
 * Create contract instance
 */
export declare function getContractInstance(config: ContractConfig): ContractService;
/**
 * Format Ethereum address
 */
export declare function formatAddress(address: string, chars?: number): string;
/**
 * Parse encrypted input proof
 */
export declare function parseEncryptedInput(inputProof: string): any;
/**
 * Validate Ethereum address
 */
export declare function isValidAddress(address: string): boolean;
/**
 * Convert Wei to Ether
 */
export declare function fromWei(wei: bigint | string, decimals?: number): string;
/**
 * Convert Ether to Wei
 */
export declare function toWei(ether: string | number, decimals?: number): bigint;
//# sourceMappingURL=index.d.ts.map