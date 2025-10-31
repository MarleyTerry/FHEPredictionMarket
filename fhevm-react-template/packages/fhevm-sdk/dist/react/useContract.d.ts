import { ContractService } from '../core/ContractService';
import type { ContractConfig } from '../types';
/**
 * Hook for interacting with FHEVM contracts
 *
 * Usage:
 * ```tsx
 * const { contract, read, write, isLoading, error } = useContract({
 *   address: '0x...',
 *   abi: [...],
 *   signer
 * });
 *
 * const result = await read('balanceOf', [address]);
 * const tx = await write('transfer', [to, amount]);
 * ```
 */
export declare function useContract(config: ContractConfig): {
    contract: ContractService;
    read: <T = any>(method: string, args?: any[]) => Promise<T | null>;
    write: (method: string, args?: any[], overrides?: any) => Promise<any>;
    estimateGas: (method: string, args?: any[]) => Promise<bigint | null>;
    on: (event: string, listener: (...args: any[]) => void) => void;
    off: (event: string, listener: (...args: any[]) => void) => void;
    isLoading: boolean;
    error: Error;
};
//# sourceMappingURL=useContract.d.ts.map