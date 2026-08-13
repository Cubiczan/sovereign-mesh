import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SovereignMesh — Fortified Enterprise Agent Control Plane',
  description:
    'Zero-Trust ReBAC, Model Armor Guardrails, and Consensus Hardening Protocol (CHP v1.0) for Autonomous Enterprise Agent Fleets.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
