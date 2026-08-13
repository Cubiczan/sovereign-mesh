export type AgentRole =
  | 'procurement'
  | 'soc_remediation'
  | 'erp_ledger'
  | 'challenger'
  | 'adjudicator';

export interface EnterpriseAgent {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  capabilities: string[];
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'DELIBERATING' | 'RESTRICTED' | 'IDLE';
  assignedModel: string;
  totalExecutions: number;
  policyViolations: number;
  avatarIcon: string;
}

export type RebacDecision = 'ALLOW' | 'DENY' | 'GATED_FOR_CONSENSUS';

export interface RebacCheckResult {
  allowed: boolean;
  decision: RebacDecision;
  agentId: string;
  resource: string;
  permission: string;
  requiredRelations: string[];
  matchingRelations: string[];
  reason: string;
  evaluatedAt: string;
  armorCheck: {
    passed: boolean;
    flags: string[];
    riskScore: number;
  };
}

export interface RebacTuple {
  resource: string;
  relation: string;
  subject: string;
}

export interface ChpDebateRound {
  roundNumber: number;
  speaker: 'PROPOSER' | 'CHALLENGER' | 'ADJUDICATOR';
  agentId: string;
  agentName: string;
  content: string;
  evidenceCitations: string[];
  confidenceScore: number;
  timestamp: string;
}

export interface SignedDecisionLock {
  id: string;
  decisionId: string;
  title: string;
  status: 'LOCKED' | 'REJECTED' | 'COUNTERSIGN_REQUIRED';
  r0Score: number;
  proposerId: string;
  challengerId: string;
  adjudicatorId: string;
  actionSummary: string;
  targetResource: string;
  payload: Record<string, unknown>;
  rounds: ChpDebateRound[];
  signatureHash: string;
  signedAt: string;
  auditTrail: {
    rebacResult: RebacCheckResult;
    armorScore: number;
    memoryContextUsed: string[];
  };
}

export interface MemoryEntity {
  id: string;
  category: 'VENDOR' | 'IAM_POLICY' | 'TRANSACTION' | 'INCIDENT' | 'AUDIT';
  name: string;
  attributes: Record<string, unknown>;
  trustScore: number;
  historicalAnomalies: number;
  lastUpdated: string;
  verifiedBy: string;
}

export interface EnterpriseScenario {
  id: string;
  name: string;
  category: 'PROCURE_TO_PAY' | 'CLOUD_IAM' | 'SUPPLY_CHAIN';
  difficulty: 'STANDARD' | 'ATTACK_VECTOR' | 'HIGH_STAKES';
  description: string;
  initiatingAgentId: string;
  proposedAction: {
    tool: string;
    resource: string;
    permission: string;
    parameters: Record<string, unknown>;
  };
  simulatedPayload: string;
  expectedOutcome: 'LOCKED' | 'REJECTED' | 'COUNTERSIGN_REQUIRED';
}
