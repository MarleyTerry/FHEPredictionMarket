/**
 * Hook to access FHEVM client instance
 *
 * Usage:
 * ```tsx
 * const { client, isInitialized, error } = useFhevmClient();
 * ```
 */
export declare function useFhevmClient(): {
    client: import("..").FhevmClient;
    isInitialized: boolean;
    error: Error;
    isReady: boolean;
};
//# sourceMappingURL=useFhevmClient.d.ts.map