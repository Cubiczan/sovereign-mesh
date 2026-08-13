import { inspectModelArmor } from './model-armor';
import { RebacCheckResult, RebacTuple, EnterpriseAgent } from './types';

// Default Fleet Agents
export const initialFleetAgents: EnterpriseAgent[] = [
  {
    id: 'agent_procure',
    name: 'ProcureOps Sentinel',
    role: 'procurement',
    description: 'Autonomous vendor order drafting, catalog reconciliation, and quote validation',
    capabilities: ['erp:read_catalog', 'erp:draft_po', 'erp:execute_payment'],
    riskTier: 'HIGH',
    status: 'ACTIVE',
    assignedModel: 'gemini-2.5-flash',
    totalExecutions: 142,
    policyViolations: 0,
    avatarIcon: 'ShoppingCart',
  },
  {
    id: 'agent_soc_remed',
    name: 'CloudGuard SOC Sentinel',
    role: 'soc_remediation',
    description: 'Autonomous security triage, firewall quarantine, and IAM drift remediation',
    capabilities: ['gcp:read_telemetry', 'gcp:isolate_vm', 'gcp:modify_iam', 'gcp:update_firewall'],
    riskTier: 'CRITICAL',
    status: 'ACTIVE',
    assignedModel: 'gemini-2.5-flash',
    totalExecutions: 89,
    policyViolations: 1,
    avatarIcon: 'ShieldAlert',
  },
  {
    id: 'agent_erp_ledger',
    name: 'LedgerMind Auditor',
    role: 'erp_ledger',
    description: 'Financial ledger verification, 3-way invoice matching, and bank detail reconciliation',
    capabilities: ['erp:read_invoice', 'erp:verify_gl', 'erp:post_reconciliation'],
    riskTier: 'MEDIUM',
    status: 'ACTIVE',
    assignedModel: 'gemini-2.5-flash',
    totalExecutions: 310,
    policyViolations: 0,
    avatarIcon: 'Receipt',
  },
  {
    id: 'agent_challenger',
    name: 'Adversarial Council Challenger (CHP)',
    role: 'challenger',
    description: 'Red-teams and challenges high-risk agent proposals with Memory Bank evidence',
    capabilities: ['chp:audit_proposal', 'chp:query_memory_bank', 'chp:raise_challenge'],
    riskTier: 'HIGH',
    status: 'ACTIVE',
    assignedModel: 'gemini-2.5-pro',
    totalExecutions: 67,
    policyViolations: 0,
    avatarIcon: 'Crosshair',
  },
  {
    id: 'agent_adjudicator',
    name: 'Sovereign Adjudicator & Cryptographic Notary',
    role: 'adjudicator',
    description: 'Calculates R0 consensus scores, enforces domain score floors, and signs immutable locks',
    capabilities: ['chp:score_r0', 'chp:sign_decision_lock', 'chp:request_countersign'],
    riskTier: 'CRITICAL',
    status: 'ACTIVE',
    assignedModel: 'gemini-2.5-pro',
    totalExecutions: 67,
    policyViolations: 0,
    avatarIcon: 'Scale',
  },
];

// In-Memory SpiceDB / Zanzibar Relationship Tuples
const initialTuples: RebacTuple[] = [
  // Procurement agent relations
  { resource: 'erp:catalog', relation: 'viewer', subject: 'agent_procure' },
  { resource: 'erp:purchase_orders', relation: 'editor', subject: 'agent_procure' },
  { resource: 'erp:payment_gateway', relation: 'executor', subject: 'agent_procure' },

  // SOC agent relations
  { resource: 'gcp:telemetry', relation: 'viewer', subject: 'agent_soc_remed' },
  { resource: 'gcp:firewall_rules', relation: 'executor', subject: 'agent_soc_remed' },
  { resource: 'gcp:iam_bindings', relation: 'editor', subject: 'agent_soc_remed' },

  // Ledger agent relations
  { resource: 'erp:invoices', relation: 'viewer', subject: 'agent_erp_ledger' },
  { resource: 'erp:general_ledger', relation: 'editor', subject: 'agent_erp_ledger' },
];

export class RebacEngine {
  private tuples: RebacTuple[];

  constructor() {
    this.tuples = [...initialTuples];
  }

  public getTuples(): RebacTuple[] {
    return [...this.tuples];
  }

  public addTuple(tuple: RebacTuple): void {
    this.tuples.push(tuple);
  }

  /**
   * Evaluates a permission request against the Zanzibar relationship graph + Model Armor.
   */
  public evaluate(
    agentId: string,
    resource: string,
    permission: string,
    payload: Record<string, unknown>
  ): RebacCheckResult {
    const evaluatedAt = new Date().toISOString();

    // 1. Run Model Armor Inspection first
    const armorCheck = inspectModelArmor(payload);

    if (!armorCheck.passed) {
      return {
        allowed: false,
        decision: 'DENY',
        agentId,
        resource,
        permission,
        requiredRelations: ['authorized_caller'],
        matchingRelations: [],
        reason: `Model Armor violation: ${armorCheck.flags.join(', ')}`,
        evaluatedAt,
        armorCheck: {
          passed: false,
          flags: armorCheck.flags,
          riskScore: armorCheck.riskScore,
        },
      };
    }

    // 2. Check relationship graph
    const matchingTuples = this.tuples.filter(
      (t) => t.subject === agentId && t.resource === resource
    );
    const matchingRelations = matchingTuples.map((t) => t.relation);

    // Map permission to required relation
    let requiredRelation = 'viewer';
    if (permission === 'edit' || permission === 'write') requiredRelation = 'editor';
    if (permission === 'execute' || permission === 'mutate') requiredRelation = 'executor';

    const hasRelation =
      matchingRelations.includes(requiredRelation) ||
      (requiredRelation === 'viewer' &&
        (matchingRelations.includes('editor') || matchingRelations.includes('executor')));

    if (!hasRelation) {
      return {
        allowed: false,
        decision: 'DENY',
        agentId,
        resource,
        permission,
        requiredRelations: [requiredRelation],
        matchingRelations,
        reason: `Zero-Trust ReBAC check failed: Agent ${agentId} lacks required '${requiredRelation}' relation on '${resource}'.`,
        evaluatedAt,
        armorCheck: {
          passed: true,
          flags: [],
          riskScore: armorCheck.riskScore,
        },
      };
    }

    // 3. Check High-Stakes Gating Policies (e.g. spend > 5000 or IAM changes)
    const isFinancialHighStakes =
      typeof payload.amountUSD === 'number' && payload.amountUSD > 5000;
    const isIamHighStakes =
      resource === 'gcp:iam_bindings' &&
      typeof payload.role === 'string' &&
      (payload.role.includes('admin') || payload.role.includes('owner'));
    const isNewVendor =
      typeof payload.vendorAgeDays === 'number' && payload.vendorAgeDays < 14;

    if (isFinancialHighStakes || isIamHighStakes || isNewVendor) {
      const reasons: string[] = [];
      if (isFinancialHighStakes) reasons.push(`Spend amount ($${payload.amountUSD}) exceeds auto-clearance threshold ($5,000)`);
      if (isIamHighStakes) reasons.push(`Privileged IAM role assignment (${payload.role})`);
      if (isNewVendor) reasons.push(`New vendor created ${payload.vendorAgeDays} days ago`);

      return {
        allowed: false,
        decision: 'GATED_FOR_CONSENSUS',
        agentId,
        resource,
        permission,
        requiredRelations: [requiredRelation, 'council_auditor'],
        matchingRelations,
        reason: `High-Stakes Gating Triggered: ${reasons.join('; ')}. Escalating to Adversarial CHP Council.`,
        evaluatedAt,
        armorCheck: {
          passed: true,
          flags: armorCheck.flags,
          riskScore: armorCheck.riskScore,
        },
      };
    }

    // Direct Allow
    return {
      allowed: true,
      decision: 'ALLOW',
      agentId,
      resource,
      permission,
      requiredRelations: [requiredRelation],
      matchingRelations,
      reason: `ReBAC check passed: ${agentId} holds '${requiredRelation}' on '${resource}'. Action is within autonomous safety bounds.`,
      evaluatedAt,
      armorCheck: {
        passed: true,
        flags: [],
        riskScore: armorCheck.riskScore,
      },
    };
  }
}

export const rebacEngine = new RebacEngine();
