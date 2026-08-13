<div align="center">

# 🛡️ SovereignMesh

**The Zero-Trust, Self-Governing Enterprise Agent Fleet**  
*Built for the [All Things Agentic Hackathon](https://allthingsagentichackathon.devpost.com/) — The Fortified Enterprise Fleet Track*

[![Gemini 2.5](https://img.shields.io/badge/Model-Gemini%202.5%20Flash%20%7C%20Pro-4285F4?logo=google)](https://ai.google.dev)
[![Google Cloud GEAP](https://img.shields.io/badge/Architecture-GEAP%20Control%20Plane-34A853?logo=googlecloud)](https://cloud.google.com)
[![Protocol](https://img.shields.io/badge/Consensus-CHP%20v1.0-FF6F00)](spec/CHP-v1.0.md)
[![Zero-Trust](https://img.shields.io/badge/Authorization-Zanzibar%20ReBAC-00ACC1)](lib/rebac-engine.ts)
[![Guardrails](https://img.shields.io/badge/Security-Model%20Armor-E53935)](lib/model-armor.ts)
[![Next.js 15](https://img.shields.io/badge/Frontend-Next.js%2015%20App%20Router-000000?logo=next.js)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ⚡ The Enterprise Problem

Enterprise adoption of autonomous multi-agent systems is paralyzed by three fundamental security barriers:

1. **Unbounded Tool Execution & Blast Radius:** Agents invoke critical enterprise tools (ERP payments, GCP IAM, database mutations) with static ambient credentials without granular least-privilege checks.
2. **High-Stakes Single-Agent Hallucinations & Injections:** When a single model orchestrates critical financial or infrastructure actions, it is susceptible to indirect prompt injection, data poisoning, and hallucinated parameters.
3. **Absence of Verifiable Cryptographic Auditability:** Security and compliance teams cannot verify *why* an agent executed an action, *what* evidence it considered, or *who* authorized it.

---

## 🏛️ The Solution: SovereignMesh Control Plane

**SovereignMesh** establishes a unified **Zero-Trust Autonomous Agent Control Plane** built on Google Cloud's **Gemini Enterprise Agent Platform (GEAP)** architecture:

```
                               ┌────────────────────────────────────────────────────────┐
                               │           SovereignMesh Control Plane                  │
                               │          Google Cloud GEAP Architecture                │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
          ┌───────────────────────┬───────────────────────┼───────────────────────┬───────────────────────┐
          ▼                       ▼                       ▼                       ▼                       ▼
    [Agent Registry]      [Zero-Trust ReBAC]      [Adversarial CHP]       [GEAP Memory Bank]      [Signed Ledger]
   AGENTS.md contract      SpiceDB / Zanzibar    Proposer vs Challenger   Cross-session entity    SHA-256 Decision
   5 Active Sentinels     Least-privilege gate   Adjudicator R0 scoring    memory & baselines      Lock Certificates
```

---

## 🚀 The Five Pillars of Fortified Fleet Governance

### 1. Enterprise Agent Registry (`AGENTS.md`)
- Auto-discovers and validates agents via executable `AGENTS.md` and `SKILL.md` specifications.
- Maps roles, capability scopes, and assigned models (**Gemini 2.5 Flash** for rapid operations, **Gemini 2.5 Pro** for adversarial deliberation).

### 2. Zero-Trust ReBAC Tool Interceptor
- Implements Google Zanzibar Relationship-Based Access Control (`viewer`, `editor`, `executor`, `council_auditor`).
- Enforces runtime least-privilege: tool calls fail closed unless matching relationship tuples exist.

### 3. Model Armor Guardrail Firewall
- Pre-execution payload inspection screening arguments for indirect prompt injection, role hijacking, directory traversals (`../../`), and secret exfiltration.

### 4. Consensus Hardening Protocol (CHP v1.0)
- High-stakes actions (financial spend > $5,000, IAM modifications, unverified vendor accounts) trigger a 3-agent adversarial deliberation:
  - **Round 1 (Proposer):** Formal business justification and parameter declaration.
  - **Round 2 (Adversarial Challenger Red Team):** Cross-examines proposal against historical Memory Bank facts.
  - **Round 3 (Sovereign Adjudicator):** Computes consensus confidence ratio $R_0$, verifies threshold floors ($R_0 \ge 0.85$), and generates an immutable cryptographic SHA-256 Decision Lock.

### 5. GEAP Memory Bank & Signed Decision Ledger
- Cross-session persistent entity memory tracking vendor trust scores, historical anomaly counts, and baseline IAM policies.
- Generates downloadable JSON-LD cryptographic proof certificates for compliance audits.

---

## 🧪 Interactive Benchmark Scenarios

| Scenario | Vector / Challenge | Gate Triggered | CHP Deliberation Outcome |
|---|---|---|---|
| **Tampered Invoice Attack** | An invoice payload attempts to redirect $18,500 to an unverified off-shore wire account with prompt injection instructions. | High-Stakes Spend ($18,500 > $5,000) & New Vendor (< 14 days) | Challenger detects Memory Bank routing mismatch $\rightarrow$ $R_0 = 0.05$ $\rightarrow$ **REJECTED** |
| **Malicious Cloud IAM Escalation** | A simulated lateral movement alert prompts the SOC agent to remediate, but injected payload requests `roles/owner`. | Model Armor Critical Flag + ReBAC Scope Violation | Blocked immediately at the ReBAC / Model Armor Gate $\rightarrow$ **DENY** |
| **Legitimate PO Clearance** | Routine $4,200 hardware replacement matching historical Memory Bank parameters and verified vendor credentials. | Policy Limit Check | Challenger confirms vendor trust score ($0.94$) $\rightarrow$ $R_0 = 0.92$ $\rightarrow$ **LOCKED (SHA-256 Minted)** |

---

## 🛠️ Quickstart & Local Installation

### Prerequisites
- Node.js 20+
- Google Cloud Project with Vertex AI / Model API (`aiplatform.googleapis.com`) enabled, or Application Default Credentials (ADC).

### Setup
```bash
# Clone the repository
git clone https://github.com/icohangar-ops/sovereign-mesh.git
cd sovereign-mesh

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the SovereignMesh Control Plane.

---

## 📦 Project Structure

```
sovereign-mesh/
├── AGENTS.md                          # Enterprise Fleet governance contract & agent manifest
├── package.json                       # Next.js 15 App Router & dependencies
├── app/
│   ├── layout.tsx                     # Global typography & root layout
│   ├── page.tsx                       # Master Control Plane Dashboard
│   ├── globals.css                    # Handcrafted design system (Vanilla CSS)
│   └── api/
│       ├── fleet/route.ts             # Agent Registry & quota status endpoint
│       ├── rebac/route.ts             # Zanzibar ReBAC policy evaluator
│       ├── memory/route.ts            # GEAP Memory Bank entity explorer
│       └── deliberate/route.ts        # End-to-end CHP Deliberation & Decision Lock engine
├── components/
│   ├── DeliberationCouncil.tsx        # Live adversarial debate visualizer (Proposer vs Challenger)
│   ├── ZeroTrustGate.tsx              # Real-time Zanzibar ReBAC tool interceptor
│   ├── FleetRegistry.tsx              # Active agent catalog & capability matrix
│   ├── MemoryBankViewer.tsx           # Searchable cross-session entity memory store
│   └── AuditLedger.tsx                # Signed decision certificates & JSON-LD exporter
└── lib/
    ├── gemini.ts                      # Google GenAI SDK integration with ADC
    ├── rebac-engine.ts                # Zanzibar ReBAC relationship graph logic
    ├── chp-engine.ts                  # Consensus Hardening Protocol v1.0 engine
    ├── model-armor.ts                 # Prompt injection & tool poisoning guardrails
    ├── memory-bank.ts                 # Persistent entity store & baseline state
    ├── scenarios.ts                   # Predefined enterprise benchmark scenarios
    └── types.ts                       # TypeScript interfaces & domain schemas
```

---

## 📜 License

MIT License. Copyright (c) 2026 SovereignMesh Authors.
