# SovereignMesh Fleet Governance Contract

> **Normative Specification:** `AGENTS.md` v2.4  
> **Security Baseline:** Google Zanzibar ReBAC + Consensus Hardening Protocol (CHP v1.0) + Model Armor

---

## 1. Fleet Overview

SovereignMesh governs an autonomous enterprise fleet across finance, cloud infrastructure, and security operations. All agents operate under **Zero-Trust Least Privilege**: no agent has ambient access to mutate state without verified identity, capability tags, and policy clearance.

```
+-------------------+--------------------+------------------------+---------------------+
| Agent ID          | Role               | Base Privileges        | Gated Actions (>R0) |
+-------------------+--------------------+------------------------+---------------------+
| agent_procure     | Procurement Ops    | read:catalog, draft:po | execute:payment     |
| agent_soc_remed   | Security Response  | read:telemetry, read:iam| mutate:firewall_rule|
| agent_erp_ledger  | Financial Ledger   | read:invoice, draft:gl | post:reconciliation |
| agent_challenger  | Adversarial Auditor| read:all_drafts, chp:audit | reject:proposal |
| agent_adjudicator | Decision Gate      | verify:signatures      | sign:decision_lock  |
+-------------------+--------------------+------------------------+---------------------+
```

---

## 2. Zero-Trust ReBAC Schema (Zanzibar Tuples)

```zanzibar
definition user {}

definition enterprise_resource {
    relation viewer: user
    relation editor: user
    relation executor: user
    relation council_auditor: user

    permission view = viewer + editor + executor
    permission edit = editor
    permission execute = executor & council_auditor
}
```

---

## 3. High-Stakes Decision Policy (CHP Gating Rules)

An action is classified as **HIGH_STAKES** and mandates a multi-agent Consensus Hardening Protocol deliberation if ANY of the following conditions trigger:
1. **Financial Value:** Total payment or balance transfer > `$5,000.00 USD`.
2. **Infrastructure Impact:** Modification of IAM roles (`roles/owner`, `roles/editor`, `admin`), firewall rules, or DNS configurations.
3. **Anomaly Flag:** Anomaly score from `Model Armor` or `Ledger Auditor` > `0.35`.
4. **New Entity:** Interaction with a vendor or recipient created within the last 14 days.

---

## 4. Cryptographic Lock Requirements

- A decision is **LOCKED** when the Adjudicator verifies:
  - Consensus Confidence Score $R_0 \ge 0.85$.
  - Challenger rebuttal addressed with cited evidentiary artifacts from Memory Bank.
  - Zero Model Armor policy violations detected.
- All locked decisions produce an immutable JSON-LD certificate signed with the Adjudicator key and stored in the enterprise Memory Bank.
