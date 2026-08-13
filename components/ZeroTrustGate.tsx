'use client';

import React, { useState } from 'react';
import { RebacTuple, RebacCheckResult } from '@/lib/types';
import {
  ShieldCheck,
  ShieldX,
  AlertOctagon,
  Key,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ZeroTrustGateProps {
  tuples: RebacTuple[];
  lastEvaluation: RebacCheckResult | null;
  onTestEvaluation: (agentId: string, resource: string, permission: string, payload: Record<string, unknown>) => void;
  isLoading: boolean;
}

export function ZeroTrustGate({
  tuples,
  lastEvaluation,
  onTestEvaluation,
  isLoading,
}: ZeroTrustGateProps) {
  const [selectedAgent, setSelectedAgent] = useState('agent_procure');
  const [selectedResource, setSelectedResource] = useState('erp:payment_gateway');
  const [selectedPermission, setSelectedPermission] = useState('execute');
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        amountUSD: 18500,
        vendorId: 'vendor:v-4419',
        bankAccountLast4: '9921',
        vendorAgeDays: 3,
      },
      null,
      2
    )
  );

  const handleRunTest = () => {
    try {
      const parsed = JSON.parse(testPayload);
      onTestEvaluation(selectedAgent, selectedResource, selectedPermission, parsed);
    } catch {
      alert('Invalid JSON in payload');
    }
  };

  return (
    <div className="view-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            <Key size={16} /> Zero-Trust ReBAC Gate & Model Armor
          </h2>
          <p className="brand-subtitle">
            Google Zanzibar Relationship-Based Access Control (ReBAC) intercepting every autonomous tool call
          </p>
        </div>
        <span className="status-badge">
          <ShieldCheck size={14} /> LEAST PRIVILEGE ENFORCED
        </span>
      </div>

      <div className="arena-grid">
        {/* Left: ReBAC Evaluation Playground */}
        <div className="panel-card">
          <div className="panel-header">
            <span className="panel-title">
              <Layers size={14} /> Real-Time Tool Call Interceptor
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                CALLER IDENTITY (SUBJECT)
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              >
                <option value="agent_procure">agent_procure (ProcureOps)</option>
                <option value="agent_soc_remed">agent_soc_remed (CloudGuard SOC)</option>
                <option value="agent_erp_ledger">agent_erp_ledger (LedgerMind)</option>
                <option value="unauthorized_subagent">unauthorized_subagent (Rogue Caller)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                TARGET ENTERPRISE RESOURCE
              </label>
              <select
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              >
                <option value="erp:payment_gateway">erp:payment_gateway (Wire Disbursement)</option>
                <option value="gcp:iam_bindings">gcp:iam_bindings (IAM Permissions)</option>
                <option value="gcp:firewall_rules">gcp:firewall_rules (Network Ingress/Egress)</option>
                <option value="erp:invoices">erp:invoices (Invoice Storage)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                DESIRED PERMISSION
              </label>
              <select
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              >
                <option value="execute">execute (Run Action)</option>
                <option value="edit">edit (Mutate Records)</option>
                <option value="view">view (Read-Only)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                TOOL ARGUMENTS & PAYLOAD (JSON)
              </label>
              <textarea
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                rows={5}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#06090e',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#cbd5e1',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              onClick={handleRunTest}
              disabled={isLoading}
              className="btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Sparkles size={14} /> Evaluate ReBAC Policy & Model Armor
            </button>
          </div>
        </div>

        {/* Right: Zanzibar Tuples & Live Interception Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {lastEvaluation && (
            <div
              className={`decision-lock-banner ${
                lastEvaluation.decision === 'ALLOW'
                  ? 'locked'
                  : lastEvaluation.decision === 'DENY'
                  ? 'rejected'
                  : 'countersign'
              }`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Interceptor Evaluation Result
                </span>
                <span
                  className={`lock-status-badge ${
                    lastEvaluation.decision === 'ALLOW'
                      ? 'badge-locked'
                      : lastEvaluation.decision === 'DENY'
                      ? 'badge-rejected'
                      : 'badge-countersign'
                  }`}
                >
                  {lastEvaluation.decision === 'ALLOW' && <ShieldCheck size={14} />}
                  {lastEvaluation.decision === 'DENY' && <ShieldX size={14} />}
                  {lastEvaluation.decision === 'GATED_FOR_CONSENSUS' && <AlertOctagon size={14} />}
                  {lastEvaluation.decision}
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {lastEvaluation.reason}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
                <div className="code-block" style={{ fontSize: '11px' }}>
                  <strong>Model Armor Check:</strong> {lastEvaluation.armorCheck.passed ? '✅ PASSED' : '❌ VIOLATION'}
                  <br />
                  <strong>Risk Score:</strong> {lastEvaluation.armorCheck.riskScore}
                  {lastEvaluation.armorCheck.flags.length > 0 && (
                    <div style={{ color: 'var(--accent-rose)', marginTop: '4px' }}>
                      {lastEvaluation.armorCheck.flags.join('; ')}
                    </div>
                  )}
                </div>
                <div className="code-block" style={{ fontSize: '11px' }}>
                  <strong>Required Relations:</strong> {lastEvaluation.requiredRelations.join(', ')}
                  <br />
                  <strong>Matching Tuples:</strong> {lastEvaluation.matchingRelations.length > 0 ? lastEvaluation.matchingRelations.join(', ') : 'None'}
                </div>
              </div>
            </div>
          )}

          {/* Active Zanzibar Relationship Tuples */}
          <div className="panel-card">
            <div className="panel-header">
              <span className="panel-title">
                <Key size={14} /> Active Zanzibar Relationship Graph
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {tuples.length} TUPLES LOADED
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject (Agent)</th>
                    <th>Relation</th>
                    <th>Enterprise Resource</th>
                  </tr>
                </thead>
                <tbody>
                  {tuples.map((t, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-cyan)' }}>
                        {t.subject}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-amber)' }}>
                        {t.relation}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {t.resource}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
