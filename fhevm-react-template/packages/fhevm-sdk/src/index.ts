/**
 * @fhevm/sdk - Universal SDK for FHEVM
 * Framework-agnostic utilities for encrypted computation on blockchain
 */

export { FhevmClient } from './core/FhevmClient';
export { EncryptionService } from './core/EncryptionService';
export { DecryptionService } from './core/DecryptionService';
export { ContractService } from './core/ContractService';

export type {
  FhevmConfig,
  EncryptedInput,
  DecryptionResult,
  ContractConfig,
  FhevmInstance,
} from './types';

export {
  createFhevmClient,
  encryptValue,
  decryptValue,
  getContractInstance,
} from './utils';
