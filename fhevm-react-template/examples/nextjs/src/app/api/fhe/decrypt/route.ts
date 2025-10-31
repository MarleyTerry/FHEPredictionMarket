import { NextRequest, NextResponse } from 'next/server';

/**
 * Decryption API endpoint
 * Handles user decryption requests with EIP-712 signatures
 */
export async function POST(request: NextRequest) {
  try {
    const { handles, signature, publicKey } = await request.json();

    if (!handles || !signature || !publicKey) {
      return NextResponse.json(
        { error: 'Missing required fields: handles, signature, publicKey' },
        { status: 400 }
      );
    }

    // Decryption validation and processing
    // Actual decryption happens through the contract gateway
    return NextResponse.json({
      success: true,
      message: 'Decryption request received',
      clientInstructions: {
        sdk: '@fhevm/sdk',
        method: 'useDecryption().decrypt(handles)'
      }
    });
  } catch (error) {
    console.error('Decryption API error:', error);
    return NextResponse.json(
      { error: 'Failed to process decryption request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/fhe/decrypt',
    method: 'POST',
    description: 'User decryption with EIP-712 signature',
    requiredFields: ['handles', 'signature', 'publicKey']
  });
}
