'use client';

import React, { useState, useEffect } from 'react';
import {
  EnterpriseAgent,
  RebacTuple,
  RebacCheckResult,
  SignedDecisionLock,
  MemoryEntity,
  EnterpriseScenario,
} from '@/lib/types';
import { ENTERPRISE_SCENARIOS } from '@/lib/scenarios';
import { initialFleetAgents } from '@/lib/rebac-engine';
import { DeliberationCouncil } from '@/components/DeliberationCouncil';
import { ZeroTrustGate } from '@/components/ZeroTrustGate';
import { FleetRegistry } from '@/components/FleetRegistry';
import { MemoryBankViewer } from '@/components/MemoryBankViewer';
import { AuditLedger } from '@/components/AuditLedger';
import {
  ShieldCheck,
  Cpu,
  Database,
  FileCheck,
  Key,
  Flame,
} from 'lucide-react';

type TabType = 'arena' | 'rebac' | 'fleet' | 'memory' | 'audit';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('arena');
  const [agents, setAgents] = useState<EnterpriseAgent[]>(initialFleetAgents);
  const [tuples, setTuples] = useState<RebacTuple[]>([]);
  const [memoryEntities, setMemoryEntities] = useState<MemoryEntity[]>([]);
  const [currentScenario, setCurrentScenario] = useState<EnterpriseScenario>(
    ENTERPRISE_SCENARIOS[0]
  );
  const [activeLock, setActiveLock] = useState<SignedDecisionLock | null>(null);
  const [lastRebac, setLastRebac] = useState<RebacCheckResult | null>(null);
  const [locks, setLocks] = useState<SignedDecisionLock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data from APIs
  useEffect(() => {
    fetch('/api/fleet')
      .then((res) => res.json())
      .then((data) => {
        if (data.fleet) setAgents(data.fleet);
      })
      .catch(() => {});

    fetch('/api/rebac')
      .then((res) => res.json())
      .then((data) => {
        if (data.tuples) setTuples(data.tuples);
      })
      .catch(() => {});

    fetch('/api/memory')
      .then((res) => res.json())
      .then((data) => {
        if (data.entities) setMemoryEntities(data.entities);
      })
      .catch(() => {});
  }, []);

  const handleRunDeliberation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/deliberate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionId: `dec-${Date.now()}`,
          title: currentScenario.name,
          agentId: currentScenario.initiatingAgentId,
          resource: currentScenario.proposedAction.resource,
          permission: currentScenario.proposedAction.permission,
          payload: currentScenario.proposedAction.parameters,
        }),
      });

      const data = await res.json();
      if (data.rebacResult) {
        setLastRebac(data.rebacResult);
      }
      if (data.lock) {
        setActiveLock(data.lock);
        setLocks((prev) => [data.lock, ...prev.filter((l) => l.id !== data.lock.id)]);
      }
    } catch (err) {
      console.error('Deliberation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEvaluation = async (
    agentId: string,
    resource: string,
    permission: string,
    payload: Record<string, unknown>
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/rebac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, resource, permission, payload }),
      });
      const data = await res.json();
      setLastRebac(data);
    } catch (err) {
      console.error('ReBAC evaluation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountersign = () => {
    if (!activeLock) return;
    const countersignedLock: SignedDecisionLock = {
      ...activeLock,
      status: 'LOCKED',
      r0Score: 0.98,
      actionSummary: `${activeLock.actionSummary} [MANUALLY COUNTERSIGNED BY COMPLIANCE OFFICER]`,
    };
    setActiveLock(countersignedLock);
    setLocks((prev) => [
      countersignedLock,
      ...prev.filter((l) => l.id !== activeLock.id),
    ]);
  };

  return (
    <main className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="brand-title">SovereignMesh Control Plane</h1>
            <p className="brand-subtitle">
              Zero-Trust Autonomous Agent Fleet • Google Cloud Vertex AI & Gemini 2.5 • GEAP Architecture
            </p>
          </div>
        </div>

        <div className="header-meta">
          <span className="status-badge">
            <span className="pulse-dot"></span> MESH ARMED
          </span>
          <span className="adc-badge">
            <Flame size={12} style={{ color: 'var(--accent-amber)' }} /> GCP Project: project-651348c0
          </span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          onClick={() => setActiveTab('arena')}
          className={`nav-tab ${activeTab === 'arena' ? 'active' : ''}`}
        >
          <Cpu size={15} /> Deliberation Arena (CHP)
        </button>
        <button
          onClick={() => setActiveTab('rebac')}
          className={`nav-tab ${activeTab === 'rebac' ? 'active' : ''}`}
        >
          <Key size={15} /> Zero-Trust ReBAC Gate
        </button>
        <button
          onClick={() => setActiveTab('fleet')}
          className={`nav-tab ${activeTab === 'fleet' ? 'active' : ''}`}
        >
          <ShieldCheck size={15} /> Fleet Manifest (AGENTS.md)
        </button>
        <button
          onClick={() => setActiveTab('memory')}
          className={`nav-tab ${activeTab === 'memory' ? 'active' : ''}`}
        >
          <Database size={15} /> GEAP Memory Bank
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`nav-tab ${activeTab === 'audit' ? 'active' : ''}`}
        >
          <FileCheck size={15} /> Signed Decision Ledger ({locks.length})
        </button>
      </nav>

      {/* View Content */}
      {activeTab === 'arena' && (
        <DeliberationCouncil
          currentScenario={currentScenario}
          onSelectScenario={(scen) => {
            setCurrentScenario(scen);
            setActiveLock(null);
            setLastRebac(null);
          }}
          scenarios={ENTERPRISE_SCENARIOS}
          activeLock={activeLock}
          lastRebac={lastRebac}
          onRunDeliberation={handleRunDeliberation}
          onCountersign={handleCountersign}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'rebac' && (
        <ZeroTrustGate
          tuples={tuples}
          lastEvaluation={lastRebac}
          onTestEvaluation={handleTestEvaluation}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'fleet' && <FleetRegistry agents={agents} />}

      {activeTab === 'memory' && (
        <MemoryBankViewer entities={memoryEntities} />
      )}

      {activeTab === 'audit' && <AuditLedger locks={locks} />}
    </main>
  );
}
