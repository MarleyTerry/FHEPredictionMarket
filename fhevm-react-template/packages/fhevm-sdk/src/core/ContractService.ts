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
export class ContractService {
  private contract: Contract;
  private config: ContractConfig;

  constructor(config: ContractConfig) {
    this.config = config;
    this.contract = new Contract(config.address, config.abi, config.signer);
  }

  /**
   * Get the underlying ethers Contract instance
   */
  getContract(): Contract {
    return this.contract;
  }

  /**
   * Get contract address
   */
  getAddress(): string {
    return this.config.address;
  }

  /**
   * Call a contract method (read-only)
   */
  async read<T = any>(method: string, args: any[] = []): Promise<T> {
    try {
      const result = await this.contract[method](...args);
      return result;
    } catch (error) {
      console.error(`Failed to call ${method}:`, error);
      throw new Error(`Contract read failed: ${error}`);
    }
  }

  /**
   * Send a transaction to a contract method
   */
  async write(method: string, args: any[] = [], overrides?: any) {
    try {
      const tx = await this.contract[method](...args, overrides || {});
      return tx;
    } catch (error) {
      console.error(`Failed to send transaction ${method}:`, error);
      throw new Error(`Contract write failed: ${error}`);
    }
  }

  /**
   * Wait for a transaction to be mined
   */
  async waitForTransaction(txHash: string, confirmations: number = 1) {
    try {
      const receipt = await this.contract.runner?.provider?.waitForTransaction(
        txHash,
        confirmations
      );
      return receipt;
    } catch (error) {
      console.error('Failed to wait for transaction:', error);
      throw new Error(`Transaction wait failed: ${error}`);
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(method: string, args: any[] = []): Promise<bigint> {
    try {
      const gas = await this.contract[method].estimateGas(...args);
      return gas;
    } catch (error) {
      console.error(`Failed to estimate gas for ${method}:`, error);
      throw new Error(`Gas estimation failed: ${error}`);
    }
  }

  /**
   * Listen to contract events
   */
  on(event: string, listener: (...args: any[]) => void): void {
    this.contract.on(event, listener);
  }

  /**
   * Remove event listener
   */
  off(event: string, listener: (...args: any[]) => void): void {
    this.contract.off(event, listener);
  }

  /**
   * Query past events
   */
  async queryFilter(event: string, fromBlock?: number, toBlock?: number) {
    try {
      const filter = this.contract.filters[event]();
      const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
      return events;
    } catch (error) {
      console.error(`Failed to query events for ${event}:`, error);
      throw new Error(`Event query failed: ${error}`);
    }
  }

  /**
   * Connect contract to a different signer
   */
  connect(signer: Signer): ContractService {
    return new ContractService({
      ...this.config,
      signer,
    });
  }
}
