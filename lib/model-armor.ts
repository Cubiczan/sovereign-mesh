export interface ArmorInspection {
  passed: boolean;
  riskScore: number; // 0.0 (clean) to 1.0 (malicious)
  flags: string[];
  sanitizedInput?: string;
  detectedPatterns: {
    patternType: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }[];
}

const INJECTION_PATTERNS = [
  {
    regex: /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
    type: 'PROMPT_INJECTION',
    desc: 'Instruction override attempt detected',
    severity: 'CRITICAL' as const,
  },
  {
    regex: /system\s*:\s*override|you\s+are\s+now\s+in\s+god\s+mode/i,
    type: 'ROLE_HIJACK',
    desc: 'System prompt hijacking detected',
    severity: 'CRITICAL' as const,
  },
  {
    regex: /(\.\.\/|\.\.\\){2,}/,
    type: 'PATH_TRAVERSAL',
    desc: 'Directory traversal sequence detected in arguments',
    severity: 'HIGH' as const,
  },
  {
    regex: /roles\/(owner|resourcemanager\.organizationAdmin)/i,
    type: 'PRIVILEGE_ESCALATION',
    desc: 'Excessive IAM privilege escalation request',
    severity: 'HIGH' as const,
  },
  {
    regex: /(api_key|sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,})/i,
    type: 'SECRET_EXFILTRATION',
    desc: 'Sensitive token/credential pattern detected in payload',
    severity: 'HIGH' as const,
  },
  {
    regex: /base64\s+decode|eval\s*\(|child_process/i,
    type: 'ARBITRARY_EXECUTION',
    desc: 'Obfuscated execution vector detected',
    severity: 'HIGH' as const,
  }
];

export function inspectModelArmor(payload: unknown): ArmorInspection {
  const text = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const detectedPatterns: ArmorInspection['detectedPatterns'] = [];
  const flags: string[] = [];

  let accumulatedRisk = 0.0;

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.regex.test(text)) {
      detectedPatterns.push({
        patternType: pattern.type,
        description: pattern.desc,
        severity: pattern.severity,
      });
      flags.push(`[${pattern.severity}] ${pattern.type}: ${pattern.desc}`);
      accumulatedRisk += pattern.severity === 'CRITICAL' ? 0.6 : 0.35;
    }
  }

  // Check for abnormal length or hidden hex strings
  if (text.length > 5000) {
    flags.push('[MEDIUM] PAYLOAD_SIZE: Excessive payload length');
    accumulatedRisk += 0.2;
  }

  const finalRisk = Math.min(1.0, accumulatedRisk);
  const passed = finalRisk < 0.4;

  return {
    passed,
    riskScore: Number(finalRisk.toFixed(2)),
    flags,
    detectedPatterns,
    sanitizedInput: passed ? text : '[REDACTED_BY_MODEL_ARMOR]',
  };
}
