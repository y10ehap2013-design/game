import test from 'node:test';
import assert from 'node:assert/strict';
import {
  stepBallPhysics,
  calculatePassVector,
  calculateShotVector,
  checkGoalScored,
  calculateFC27PowerShotVector,
  evaluateTimedFinishing,
  calculateDribbleVelocity,
} from './physics.ts';
import type { BallState, GoalDimensions } from './physics.ts';

test('stepBallPhysics applies gravity and bounces off ground', () => {
  const initialBall: BallState = {
    position: { x: 0, y: 5, z: 0 },
    velocity: { x: 0, y: -2, z: 0 },
    inAir: true,
  };

  const nextState = stepBallPhysics(initialBall, 0.05);
  assert.ok(nextState.position.y < 5, 'Ball should fall under gravity');
  assert.ok(nextState.velocity.y < -2, 'Downward velocity should increase');

  // Test floor bounce
  const groundBall: BallState = {
    position: { x: 0, y: 0.22, z: 0 },
    velocity: { x: 0, y: -5, z: 0 },
    inAir: false,
  };
  const bouncedState = stepBallPhysics(groundBall, 0.05);
  assert.equal(bouncedState.position.y, 0.22);
  assert.ok(bouncedState.velocity.y > 0, 'Ball should rebound with positive y velocity');
});

test('calculatePassVector creates accurate forward ground and through passes', () => {
  const passer = { x: 0, y: 0.22, z: 0 };
  const teammate = { x: 10, y: 0.22, z: 20 };

  const groundPass = calculatePassVector(passer, teammate, false);
  assert.ok(groundPass.z > 0, 'Pass should move towards positive Z');
  assert.ok(groundPass.x > 0, 'Pass should move towards positive X');
  assert.equal(groundPass.y, 0.1, 'Ground pass should stay low');

  const throughPass = calculatePassVector(passer, teammate, true);
  assert.ok(throughPass.y > groundPass.y, 'Through pass should have loft and extra speed');
  assert.ok(
    Math.hypot(throughPass.x, throughPass.z) > Math.hypot(groundPass.x, groundPass.z),
    'Through pass should travel faster'
  );
});

test('calculateShotVector scales velocity with charge fraction', () => {
  const origin = { x: 0, y: 0.22, z: 30 };
  const goalCenter = { x: 0, y: 1.2, z: 50 };

  const lowShot = calculateShotVector(origin, goalCenter, 0.2);
  const highShot = calculateShotVector(origin, goalCenter, 0.9);

  assert.ok(highShot.z > lowShot.z, 'Full charged shot should have higher forward speed');
  assert.ok(highShot.y > lowShot.y, 'Charged shot should have higher elevation');
});

test('checkGoalScored registers ball crossing inside posts', () => {
  const goal: GoalDimensions = {
    minX: -3.66,
    maxX: 3.66,
    minY: 0,
    maxY: 2.44,
    goalZ: 50,
    depthZ: 2,
  };

  const prevInFront = { x: 1.0, y: 1.0, z: 49.5 };
  const scoredCross = { x: 1.0, y: 1.0, z: 50.5 };
  assert.equal(
    checkGoalScored(scoredCross, prevInFront, goal),
    true,
    'Crossing line inside posts must count as goal'
  );

  const missedWide = { x: 6.0, y: 1.0, z: 50.5 };
  assert.equal(
    checkGoalScored(missedWide, prevInFront, goal),
    false,
    'Wide shot must not count as goal'
  );

  const missedHigh = { x: 0.0, y: 4.0, z: 50.5 };
  assert.equal(
    checkGoalScored(missedHigh, prevInFront, goal),
    false,
    'Over crossbar must not count as goal'
  );
});

test('calculateFC27PowerShotVector produces blistering laser strike with green timing boost', () => {
  const origin = { x: 0, y: 0.22, z: 20 };
  const goalCenter = { x: 0, y: 1.5, z: 50 };

  const normalPowerShot = calculateFC27PowerShotVector(origin, goalCenter, 0.8, false);
  const greenTimedPowerShot = calculateFC27PowerShotVector(origin, goalCenter, 0.8, true);

  const normalSpeed = Math.hypot(normalPowerShot.x, normalPowerShot.z);
  const greenSpeed = Math.hypot(greenTimedPowerShot.x, greenTimedPowerShot.z);

  assert.ok(normalSpeed > 35, `Power shot speed should exceed 35m/s (got ${normalSpeed})`);
  assert.ok(greenSpeed > normalSpeed, 'Green timed finish should boost power shot speed by 15%');
});

test('evaluateTimedFinishing accurately awards green release window', () => {
  const perfect = evaluateTimedFinishing(0.45);
  assert.equal(perfect.grade, 'PERFECT_GREEN');
  assert.equal(perfect.multiplier, 1.25);

  const early = evaluateTimedFinishing(0.2);
  assert.equal(early.grade, 'EARLY_YELLOW');

  const late = evaluateTimedFinishing(0.7);
  assert.equal(late.grade, 'LATE_RED');
});

test('calculateDribbleVelocity handles R1 controlled sprint vs R2 full burst', () => {
  const input = { x: 0, z: 1 };

  const controlled = calculateDribbleVelocity(input, 'CONTROLLED_R1');
  assert.equal(controlled.speedMps, 7.4);
  assert.equal(controlled.touchDistance, 0.75, 'Controlled sprint must keep tight touches');

  const fullBurst = calculateDribbleVelocity(input, 'FULL_BURST_R2');
  assert.equal(fullBurst.speedMps, 9.2);
  assert.equal(fullBurst.touchDistance, 1.6, 'Full burst pushes ball forward');
});
