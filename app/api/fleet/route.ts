import { NextResponse } from 'next/server';
import { initialFleetAgents } from '@/lib/rebac-engine';

export async function GET() {
  return NextResponse.json({
    fleet: initialFleetAgents,
    registryVersion: '2.4.0',
    governanceModel: 'GEAP-Zanzibar-CHP',
    status: 'OPERATIONAL',
    totalAgents: initialFleetAgents.length,
    activeQuotas: {
      geminiFlashRPM: 2000,
      geminiProRPM: 360,
    },
  });
}
