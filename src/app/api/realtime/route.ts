import { NextResponse } from 'next/server';

/**
 * Realtime Voice API Route Placeholder
 * Phase 1 Foundation: Realtime session negotiation is implemented in Phase 5.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Not Implemented',
      message: 'Realtime voice session minting will be implemented in Phase 5.',
    },
    { status: 501 }
  );
}
