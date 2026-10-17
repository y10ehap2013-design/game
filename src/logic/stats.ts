/**
 * Player attributes, Overall Rating (OVR) algorithms,
 * and AI-Powered Injury Risk Prediction based on player load patterns.
 */

export interface PlayerAttributes {
  pace: number;         // Speed, acceleration
  shooting: number;     // Finishing, shot power, long shots
  passing: number;      // Short pass, vision, crossing
  dribbling: number;    // Agility, ball control, balance
  defending: number;    // Interceptions, tackling, positioning
  physical: number;     // Stamina, strength, jumping
  gkReflexes?: number;  // Goalkeeping specific
}

export type PlayerPosition =
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'DMF'
  | 'CMF'
  | 'AMF'
  | 'LWF'
  | 'RWF'
  | 'SS'
  | 'CF';

/**
 * Calculates authentic PES / eFootball style Overall Rating (OVR).
 */
export function calculateOverallRating(
  pos: PlayerPosition,
  attrs: PlayerAttributes
): number {
  let ovr = 0;
  const p = attrs.pace;
  const s = attrs.shooting;
  const ps = attrs.passing;
  const d = attrs.dribbling;
  const df = attrs.defending;
  const ph = attrs.physical;
  const gk = attrs.gkReflexes ?? 50;

  switch (pos) {
    case 'CF':
    case 'SS':
      ovr = s * 0.40 + p * 0.25 + d * 0.20 + ph * 0.10 + ps * 0.05;
      break;
    case 'LWF':
    case 'RWF':
      ovr = p * 0.35 + d * 0.30 + s * 0.20 + ps * 0.10 + ph * 0.05;
      break;
    case 'AMF':
      ovr = ps * 0.35 + d * 0.30 + s * 0.20 + p * 0.10 + ph * 0.05;
      break;
    case 'CMF':
      ovr = ps * 0.30 + ph * 0.25 + d * 0.20 + df * 0.15 + s * 0.10;
      break;
    case 'DMF':
      ovr = df * 0.35 + ph * 0.30 + ps * 0.20 + d * 0.10 + p * 0.05;
      break;
    case 'LB':
    case 'RB':
      ovr = p * 0.30 + df * 0.30 + ph * 0.20 + ps * 0.15 + d * 0.05;
      break;
    case 'CB':
      ovr = df * 0.45 + ph * 0.35 + p * 0.10 + ps * 0.10;
      break;
    case 'GK':
      ovr = gk * 0.60 + ph * 0.25 + df * 0.15;
      break;
  }

  return Math.min(99, Math.max(45, Math.round(ovr)));
}

export interface PlayerLoadProfile {
  matchesLast14Days: number;     // e.g. 4
  minutesPlayedLast14Days: number; // e.g. 360
  highIntensitySprintKm: number;  // e.g. 18.5 km
  currentStamina: number;         // 0 - 100
  recoveryDays: number;           // days since last match
  priorInjuriesCount: number;     // historical injury count
  age: number;
}

export interface InjuryPredictionResult {
  riskScore: number; // 0 - 100
  riskTier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  vulnerableMuscleGroup: string;
  recommendedAction: string;
}

/**
 * AI-powered injury risk prediction model based on sports science workload ratios
 * (Acute-to-Chronic Workload Ratio ACWR & physiological strain indicators).
 */
export function predictInjuryRisk(
  profile: PlayerLoadProfile
): InjuryPredictionResult {
  let score = 15; // baseline human athletics risk

  // Fatigue accumulation
  if (profile.minutesPlayedLast14Days > 300) {
    score += (profile.minutesPlayedLast14Days - 300) * 0.12;
  }
  if (profile.matchesLast14Days >= 4) {
    score += (profile.matchesLast14Days - 3) * 14;
  }

  // High intensity sprint distance overload
  if (profile.highIntensitySprintKm > 14) {
    score += (profile.highIntensitySprintKm - 14) * 2.2;
  }

  // Recovery deficits
  if (profile.recoveryDays <= 2) {
    score += (3 - profile.recoveryDays) * 12;
  }

  // Low current stamina
  if (profile.currentStamina < 60) {
    score += (60 - profile.currentStamina) * 0.5;
  }

  // Prior injury history & age factor
  score += profile.priorInjuriesCount * 6;
  if (profile.age > 30) {
    score += (profile.age - 30) * 1.8;
  }

  score = Math.min(98, Math.max(5, Math.round(score)));

  let riskTier: InjuryPredictionResult['riskTier'] = 'LOW';
  let vulnerableMuscleGroup = 'None (Optimal)';
  let recommendedAction = 'Ready for 90 minutes. Full training intensity.';

  if (score >= 75) {
    riskTier = 'CRITICAL';
    vulnerableMuscleGroup = 'Hamstring Biceps Femoris / Adductor Strain';
    recommendedAction = 'MANDATORY BENCH/REST: High probability of acute tear. Light hydrotherapy only.';
  } else if (score >= 55) {
    riskTier = 'HIGH';
    vulnerableMuscleGroup = 'Calf Soleus / Quadriceps Tendonitis';
    recommendedAction = 'Limit to 30 mins substitute appearance. Sub-maximal sprint load.';
  } else if (score >= 35) {
    riskTier = 'MODERATE';
    vulnerableMuscleGroup = 'Groin Overload / Lumbar Tightness';
    recommendedAction = 'Monitor closely during 2nd half. Sub off at 60m if intensity drops.';
  }

  return {
    riskScore: score,
    riskTier,
    vulnerableMuscleGroup,
    recommendedAction,
  };
}

/**
 * Youth Academy growth potential projection.
 */
export function projectYouthGrowth(
  currentRating: number,
  potential: number,
  age: number,
  drillQuality: number = 1.0 // 0.8 to 1.3
): number {
  if (age >= 23 || currentRating >= potential) {
    return currentRating;
  }
  const remainingPotential = potential - currentRating;
  const growthRate = (24 - age) * 0.28 * drillQuality;
  const projectedIncrease = Math.min(remainingPotential, Math.round(growthRate));
  return currentRating + projectedIncrease;
}
