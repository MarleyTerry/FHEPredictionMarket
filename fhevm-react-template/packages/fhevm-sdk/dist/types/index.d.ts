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
 * FHEVM Instance with encryption capabilities (from fhevmjs)
 */
export interface FhevmInstance {
    createEncryptedInput(contractAddress: string, userAddress: string): EncryptedInputBuilder;
    generateKeypair(): {
        publicKey: string;
        privateKey: string;
    };
    createEIP712(publicKey: string, contractAddress: string, delegatedAccount?: string): any;
    reencrypt(handle: bigint, privateKey: string, publicKey: string, signature: string, contractAddress: string, userAddress: string): Promise<bigint>;
    getPublicKey(): {
        publicKeyId: string;
        publicKey: Uint8Array;
    } | null;
    getPublicParams(bits: number): {
        publicParams: Uint8Array;
        publicParamsId: string;
    } | null;
}
/**
 * Builder for encrypted inputs (ZKInput from fhevmjs)
 */
export interface EncryptedInputBuilder {
    addBool(value: boolean): this;
    add4(value: number | bigint): this;
    add8(value: number | bigint): this;
    add16(value: number | bigint): this;
    add32(value: number | bigint): this;
    add64(value: number | bigint): this;
    add128(value: number | bigint): this;
    add256(value: number | bigint): this;
    addBytes64(value: Uint8Array): this;
    addBytes128(value: Uint8Array): this;
    addBytes256(value: Uint8Array): this;
    addAddress(address: string): this;
    encrypt(): Promise<EncryptedData>;
}
/**
 * Encrypted data structure
 */
export interface EncryptedData {
    handles: Uint8Array[];
    inputProof: Uint8Array;
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
export declare const SUPPORTED_NETWORKS: Record<number, NetworkConfig>;
//# sourceMappingURL=index.d.ts.map