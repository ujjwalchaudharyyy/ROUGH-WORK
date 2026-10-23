export interface TriageInput {
  category: string;
  title: string;
  description: string;
  affectedPeople: number;
  injuredCount: number;
  trappedCount: number;
  requiredAssistance: string;
  accessibilityNeeds?: string | null;
  latitude?: number;
  longitude?: number;
}

export interface TriageResult {
  recommendedPriority: 'P0' | 'P1' | 'P2' | 'P3';
  explanation: string;
  identifiedRisks: string[];
  suggestedActions: string[];
  confidence: number;
  missingInformation?: string;
  recommendedResponseCategory: string;
}

export const runDeterministicTriage = (input: TriageInput): TriageResult => {
  const risks: string[] = [];
  const actions: string[] = [];
  let score = 0; // High score => Higher priority

  const descLower = (input.description + ' ' + input.title).toLowerCase();

  // Life threat indicators (Trapped, unconscious, bleeding, drowning, collapsing)
  if (input.trappedCount > 0) {
    score += 45;
    risks.push(`Active entrapment reported: ${input.trappedCount} individual(s) trapped`);
    actions.push('Deploy Urban Search & Rescue (USAR) / heavy extrication squad');
  }

  if (input.injuredCount > 0) {
    score += 35;
    risks.push(`Reported casualties: ${input.injuredCount} injured individual(s) requiring medical evacuation`);
    actions.push('Dispatch advanced life support (ALS) medical responders & ambulances');
  }

  // Keywords detection
  const criticalKeywords = ['drowning', 'rising water', 'submerged', 'buried', 'suffocating', 'severe bleeding', 'unconscious', 'cardiac', 'crushed', 'gas leak', 'raging fire'];
  const urgentKeywords = ['children', 'infant', 'elderly', 'wheelchair', 'diabetic', 'dialysis', 'hypothermia', 'roof', 'stranded', 'isolated'];

  for (const kw of criticalKeywords) {
    if (descLower.includes(kw)) {
      score += 25;
      risks.push(`Critical keyword detected: "${kw}" indicating immediate peril`);
      break;
    }
  }

  for (const kw of urgentKeywords) {
    if (descLower.includes(kw)) {
      score += 15;
      risks.push(`Vulnerability factor flagged: "${kw}" requires expedited prioritization`);
      break;
    }
  }

  // Affected population scale
  if (input.affectedPeople >= 20) {
    score += 30;
    risks.push(`Mass casualty / large population impact: ${input.affectedPeople} persons at risk`);
    actions.push('Coordinate mass evacuation transit and open secondary designated shelter');
  } else if (input.affectedPeople >= 5) {
    score += 15;
    risks.push(`Moderate group scale: ${input.affectedPeople} persons`);
  }

  // Category specific risk factor
  if (input.category === 'BUILDING_COLLAPSE' || input.category === 'LANDSLIDE') {
    score += 25;
    risks.push('High structural instability and aftershock/landslip recurrence risk');
  } else if (input.category === 'FLOOD') {
    score += 15;
    risks.push('Risk of rapidly surging water levels, contamination, and impassable access routes');
    actions.push('Check boat fleet availability and identify high-ground staging zones');
  } else if (input.category === 'FIRE') {
    score += 20;
    risks.push('Rapid fire spread threat and smoke inhalation hazard');
    actions.push('Establish perimeter evacuation and dispatch fire suppression support');
  }

  // Determine Triage Category
  let priority: 'P0' | 'P1' | 'P2' | 'P3' = 'P2';
  let explanation = '';

  if (score >= 60 || input.trappedCount > 0 || (input.injuredCount > 0 && descLower.includes('severe'))) {
    priority = 'P0';
    explanation = 'P0 — Immediate Life-Threatening Emergency: Entrapment, active trauma, or critical life peril detected. Requires immediate first-responder dispatch without queue delay.';
    if (!actions.includes('Deploy immediate rapid response rescue unit')) {
      actions.unshift('Deploy immediate rapid response rescue unit');
    }
  } else if (score >= 35 || input.injuredCount > 0) {
    priority = 'P1';
    explanation = 'P1 — Urgent Assistance Required: High vulnerability, medical triage required, or rising hazards threaten safety within short operational window.';
    actions.push('Queue for prioritized team assignment and dispatch within 20 minutes');
  } else if (score >= 15 || input.category === 'FOOD_WATER_SHORTAGE' || input.category === 'EVACUATION_REQUEST') {
    priority = 'P2';
    explanation = 'P2 — Essential Assistance Required: Stable victims requiring scheduled evacuation, shelter placement, or life-support relief logistics.';
    actions.push('Allocate relief supplies and assign logistics transport as capacity permits');
  } else {
    priority = 'P3';
    explanation = 'P3 — Non-Urgent Support: Property assessment, minor clearing, advisory request, or non-critical logistical support.';
    actions.push('Monitor incident and coordinate with local volunteer units or community shelters');
  }

  let missingInfo: string | undefined;
  if (!input.accessibilityNeeds && (descLower.includes('elderly') || descLower.includes('hospital'))) {
    missingInfo = 'Specific mobility or wheelchair equipment requirements not specified.';
  }

  return {
    recommendedPriority: priority,
    explanation,
    identifiedRisks: risks.length > 0 ? risks : ['Standard operational hazard conditions apply.'],
    suggestedActions: actions.length > 0 ? actions : ['Log report and monitor site conditions.'],
    confidence: 0.92,
    missingInformation: missingInfo,
    recommendedResponseCategory: input.category,
  };
};

export const assessIncident = async (input: TriageInput): Promise<TriageResult> => {
  // Deterministic engine is the guaranteed primary safety baseline
  return runDeterministicTriage(input);
};
