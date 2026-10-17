import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOverallRating,
  predictInjuryRisk,
  projectYouthGrowth,
} from './stats.ts';
import type { PlayerAttributes, PlayerLoadProfile } from './stats.ts';

test('calculateOverallRating weights stats properly by position', () => {
  const strikerAttrs: PlayerAttributes = {
    pace: 88,
    shooting: 92,
    passing: 78,
    dribbling: 86,
    defending: 40,
    physical: 82,
  };
  const cfRating = calculateOverallRating('CF', strikerAttrs);
  assert.ok(cfRating >= 85, `Striker rating should be high (got ${cfRating})`);

  const defenderAttrs: PlayerAttributes = {
    pace: 75,
    shooting: 40,
    passing: 72,
    dribbling: 65,
    defending: 91,
    physical: 88,
  };
  const cbRating = calculateOverallRating('CB', defenderAttrs);
  assert.ok(cbRating >= 85, `CB rating should be high (got ${cbRating})`);
});

test('predictInjuryRisk flags heavy fatigue and match overload as high/critical risk', () => {
  const freshPlayer: PlayerLoadProfile = {
    matchesLast14Days: 1,
    minutesPlayedLast14Days: 90,
    highIntensitySprintKm: 4.2,
    currentStamina: 95,
    recoveryDays: 5,
    priorInjuriesCount: 0,
    age: 22,
  };
  const freshResult = predictInjuryRisk(freshPlayer);
  assert.equal(freshResult.riskTier, 'LOW');
  assert.ok(freshResult.riskScore < 35);

  const exhaustedPlayer: PlayerLoadProfile = {
    matchesLast14Days: 5,
    minutesPlayedLast14Days: 450,
    highIntensitySprintKm: 24.5,
    currentStamina: 38,
    recoveryDays: 1,
    priorInjuriesCount: 3,
    age: 33,
  };
  const exhaustedResult = predictInjuryRisk(exhaustedPlayer);
  assert.ok(
    exhaustedResult.riskTier === 'HIGH' || exhaustedResult.riskTier === 'CRITICAL',
    `Should be high or critical risk tier (got ${exhaustedResult.riskTier})`
  );
  assert.ok(exhaustedResult.riskScore >= 70);
  assert.ok(exhaustedResult.recommendedAction.includes('BENCH') || exhaustedResult.recommendedAction.includes('substitute'));
});

test('projectYouthGrowth respects maximum potential and age limits', () => {
  const current = 70;
  const potential = 88;
  const growthAt17 = projectYouthGrowth(current, potential, 17, 1.2);
  assert.ok(growthAt17 > current, '17 year old should gain rating');
  assert.ok(growthAt17 <= potential, 'Rating cannot exceed potential');

  const veteran = projectYouthGrowth(84, 85, 27, 1.0);
  assert.equal(veteran, 84, 'Players >= 23 years old do not use youth academy growth');
});
