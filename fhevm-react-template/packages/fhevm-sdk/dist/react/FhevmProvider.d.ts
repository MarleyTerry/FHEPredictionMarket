import React, { type ReactNode } from 'react';
import { BrowserProvider } from 'ethers';
import { FhevmClient } from '../core/FhevmClient';
import type { FhevmConfig } from '../types';
interface FhevmContextValue {
    client: FhevmClient | null;
    isInitialized: boolean;
    error: Error | null;
}
export interface FhevmProviderProps {
    children: ReactNode;
    provider?: BrowserProvider;
    config?: Partial<FhevmConfig>;
}
/**
 * Provider component for FHEVM SDK in React applications
 *
 * Usage:
 * ```tsx
 * <FhevmProvider provider={provider}>
 *   <App />
 * </FhevmProvider>
 * ```
 */
export declare function FhevmProvider({ children, provider, config }: FhevmProviderProps): React.JSX.Element;
/**
 * Hook to access FHEVM context
 */
export declare function useFhevmContext(): FhevmContextValue;
export {};
//# sourceMappingURL=FhevmProvider.d.ts.map