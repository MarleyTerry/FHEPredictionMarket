import type { ContractConfig } from '../types';
interface EncryptedTransactionParams {
    method: string;
    encryptedInputs: Array<{
        type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address';
        value: boolean | number | bigint | string;
    }>;
    additionalArgs?: any[];
    overrides?: any;
}
/**
 * Hook for sending encrypted transactions to FHEVM contracts
 *
 * Usage:
 * ```tsx
 * const { sendEncryptedTransaction, isLoading, error } = useEncryptedTransaction({
 *   address: '0x...',
 *   abi: [...],
 *   signer
 * });
 *
 * const tx = await sendEncryptedTransaction({
 *   method: 'placeBet',
 *   encryptedInputs: [
 *     { type: 'uint32', value: 100 },
 *     { type: 'bool', value: true }
 *   ],
 *   additionalArgs: [marketId]
 * });
 * ```
 */
export declare function useEncryptedTransaction(config: ContractConfig): {
    sendEncryptedTransaction: (params: EncryptedTransactionParams) => Promise<any>;
    isLoading: boolean;
    error: Error;
};
export {};
//# sourceMappingURL=useEncryptedTransaction.d.ts.map