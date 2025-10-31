import { NextRequest, NextResponse } from 'next/server';

/**
 * Encryption API endpoint
 * Handles client-side encryption operations
 * Note: Actual encryption happens on the client using fhevmjs
 */
export async function POST(request: NextRequest) {
  try {
    const { value, type } = await request.json();

    if (!value || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: value and type' },
        { status: 400 }
      );
    }

    // Encryption is performed client-side for security
    // This endpoint can be used for validation or logging
    return NextResponse.json({
      success: true,
      message: 'Encryption should be performed on the client side',
      clientInstructions: {
        sdk: '@fhevm/sdk',
        method: 'useFhevmClient().encrypt(value, type)'
      }
    });
  } catch (error) {
    console.error('Encryption API error:', error);
    return NextResponse.json(
      { error: 'Failed to process encryption request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/fhe/encrypt',
    method: 'POST',
    description: 'Client-side encryption guidance',
    supportedTypes: ['uint8', 'uint16', 'uint32', 'uint64', 'address', 'bytes']
  });
}
