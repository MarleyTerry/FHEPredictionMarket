import { NextRequest, NextResponse } from 'next/server';

/**
 * Homomorphic computation API endpoint
 * Provides information about FHE computation operations
 */
export async function POST(request: NextRequest) {
  try {
    const { operation, operands, contractAddress } = await request.json();

    if (!operation || !operands || !contractAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: operation, operands, contractAddress' },
        { status: 400 }
      );
    }

    // FHE computations are performed on-chain
    return NextResponse.json({
      success: true,
      message: 'FHE computations are performed on-chain',
      supportedOperations: [
        'add', 'sub', 'mul', 'div',
        'eq', 'ne', 'lt', 'lte', 'gt', 'gte',
        'and', 'or', 'xor', 'not',
        'min', 'max'
      ],
      clientInstructions: {
        sdk: '@fhevm/sdk',
        method: 'useContract().executeEncryptedOperation(operation, operands)'
      }
    });
  } catch (error) {
    console.error('Computation API error:', error);
    return NextResponse.json(
      { error: 'Failed to process computation request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/fhe/compute',
    method: 'POST',
    description: 'FHE computation operations information',
    note: 'Actual computations are performed on-chain in smart contracts'
  });
}
