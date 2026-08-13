import { MemoryEntity } from './types';

// In-Memory GEAP-Style Memory Bank with initial enterprise state
const initialEntities: MemoryEntity[] = [
  {
    id: 'vendor:v-9012',
    category: 'VENDOR',
    name: 'Apex Data Networks LLC',
    attributes: {
      ein: 'XX-XXXXX78',
      standardTerms: 'NET_30',
      approvedBankRouting: '021000021',
      approvedBankAccountLast4: '4489',
      annualSpendCap: 150000,
      historicalAverageInvoice: 4200,
    },
    trustScore: 0.94,
    historicalAnomalies: 0,
    lastUpdated: '2026-07-28T14:30:00Z',
    verifiedBy: 'agent_erp_ledger',
  },
  {
    id: 'vendor:v-4419',
    category: 'VENDOR',
    name: 'NovaScale Cloud Hosting (Unverified Wire)',
    attributes: {
      ein: 'PENDING_VERIFICATION',
      standardTerms: 'IMMEDIATE',
      approvedBankRouting: '121000358',
      approvedBankAccountLast4: '9921',
      annualSpendCap: 25000,
      historicalAverageInvoice: 0,
      accountAgeDays: 3,
    },
    trustScore: 0.28,
    historicalAnomalies: 2,
    lastUpdated: '2026-08-11T09:15:00Z',
    verifiedBy: 'UNVERIFIED',
  },
  {
    id: 'iam_policy:gcp-prod-compute',
    category: 'IAM_POLICY',
    name: 'Production Compute Engine Tier-2',
    attributes: {
      allowedRoles: [
        'roles/compute.instanceAdmin.v1',
        'roles/compute.networkViewer',
      ],
      prohibitedRoles: [
        'roles/owner',
        'roles/resourcemanager.organizationAdmin',
        'roles/iam.securityAdmin',
      ],
      autoRemediationPermitted: true,
      maxInstanceQuarantineTimeHours: 4,
    },
    trustScore: 0.98,
    historicalAnomalies: 0,
    lastUpdated: '2026-08-01T11:00:00Z',
    verifiedBy: 'agent_soc_remed',
  },
  {
    id: 'audit:q2-2026-baseline',
    category: 'AUDIT',
    name: 'Q2 2026 Financial & Cloud Security Baseline',
    attributes: {
      soc2ComplianceStatus: 'CERTIFIED',
      maxUnreviewedSpendUSD: 5000,
      mandatoryDualSignThresholdUSD: 10000,
    },
    trustScore: 1.0,
    historicalAnomalies: 0,
    lastUpdated: '2026-06-30T23:59:59Z',
    verifiedBy: 'Chief Compliance Officer',
  },
];

class MemoryBankStore {
  private entities: Map<string, MemoryEntity>;

  constructor() {
    this.entities = new Map();
    for (const entity of initialEntities) {
      this.entities.set(entity.id, entity);
    }
  }

  public getAll(): MemoryEntity[] {
    return Array.from(this.entities.values());
  }

  public getById(id: string): MemoryEntity | undefined {
    return this.entities.get(id);
  }

  public getByCategory(category: MemoryEntity['category']): MemoryEntity[] {
    return this.getAll().filter((e) => e.category === category);
  }

  public search(query: string): MemoryEntity[] {
    const q = query.toLowerCase();
    return this.getAll().filter(
      (e) =>
        e.id.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        JSON.stringify(e.attributes).toLowerCase().includes(q)
    );
  }

  public upsert(entity: MemoryEntity): void {
    this.entities.set(entity.id, entity);
  }
}

export const memoryBank = new MemoryBankStore();
