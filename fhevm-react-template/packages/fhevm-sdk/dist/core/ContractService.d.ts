import { Contract, type Signer } from 'ethers';
import type { ContractConfig } from '../types';
/**
 * Service for interacting with FHEVM contracts
 *
 * Usage:
 * ```typescript
 * const service = new ContractService({
 *   address: '0x...',
 *   abi: [...],
 *   signer
 * });
 *
 * const tx = await service.call('functionName', [arg1, arg2]);
 * ```
 */
export declare class ContractService {
    private contract;
    private config;
    constructor(config: ContractConfig);
    /**
     * Get the underlying ethers Contract instance
     */
    getContract(): Contract;
    /**
     * Get contract address
     */
    getAddress(): string;
    /**
     * Call a contract method (read-only)
     */
    read<T = any>(method: string, args?: any[]): Promise<T>;
    /**
     * Send a transaction to a contract method
     */
    write(method: string, args?: any[], overrides?: any): Promise<any>;
    /**
     * Wait for a transaction to be mined
     */
    waitForTransaction(txHash: string, confirmations?: number): Promise<import("ethers").TransactionReceipt>;
    /**
     * Estimate gas for a transaction
     */
    estimateGas(method: string, args?: any[]): Promise<bigint>;
    /**
     * Listen to contract events
     */
    on(event: string, listener: (...args: any[]) => void): void;
    /**
     * Remove event listener
     */
    off(event: string, listener: (...args: any[]) => void): void;
    /**
     * Query past events
     */
    queryFilter(event: string, fromBlock?: number, toBlock?: number): Promise<(import("ethers").EventLog | import("ethers").Log)[]>;
    /**
     * Connect contract to a different signer
     */
    connect(signer: Signer): ContractService;
}
//# sourceMappingURL=ContractService.d.ts.map