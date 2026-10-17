/**
 * Pure physics calculations for 3D football engine.
 * Decoupled from WebGL and React for deterministic testing and simulation.
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface BallState {
  position: Vector3D;
  velocity: Vector3D;
  angularVelocity?: Vector3D;
  inAir: boolean;
}

export interface GoalDimensions {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  goalZ: number; // e.g. -50 for home goal, +50 for away goal
  depthZ: number;
}

export const GRAVITY = -19.6; // m/s^2 (tuned for snappy arcade-sim feel)
export const TURF_FRICTION = 0.982;
export const AIR_DRAG = 0.994;
export const RESTITUTION = 0.65; // bounce factor

/**
 * Step ball physics forward by delta time dt.
 */
export function stepBallPhysics(
  ball: BallState,
  dt: number,
  fieldBounds: { x: number; z: number } = { x: 38, z: 54 }
): BallState {
  const clampedDt = Math.min(dt, 0.05);
  
  // Clone state
  const nextPos: Vector3D = { ...ball.position };
  const nextVel: Vector3D = { ...ball.velocity };

  // Apply gravity
  if (nextPos.y > 0.22) {
    nextVel.y += GRAVITY * clampedDt;
    nextVel.x *= Math.pow(AIR_DRAG, clampedDt * 60);
    nextVel.z *= Math.pow(AIR_DRAG, clampedDt * 60);
  } else {
    // Ground friction
    nextVel.x *= Math.pow(TURF_FRICTION, clampedDt * 60);
    nextVel.z *= Math.pow(TURF_FRICTION, clampedDt * 60);
  }

  // Update position
  nextPos.x += nextVel.x * clampedDt;
  nextPos.y += nextVel.y * clampedDt;
  nextPos.z += nextVel.z * clampedDt;

  // Ground collision
  if (nextPos.y <= 0.22) {
    nextPos.y = 0.22;
    if (Math.abs(nextVel.y) > 0.8) {
      nextVel.y = -nextVel.y * RESTITUTION;
    } else {
      nextVel.y = 0;
    }
  }

  // Field boundary checks (pitch boundaries)
  const isOutOfBounds =
    Math.abs(nextPos.x) > fieldBounds.x || Math.abs(nextPos.z) > fieldBounds.z;

  const inAir = nextPos.y > 0.25;

  return {
    position: nextPos,
    velocity: nextVel,
    inAir,
  };
}

/**
 * Calculates pass launch velocity vector from passer to target position.
 */
export function calculatePassVector(
  origin: Vector3D,
  target: Vector3D,
  isThroughBall: boolean = false,
  powerMultiplier: number = 1.0
): Vector3D {
  const dx = target.x - origin.x;
  const dz = target.z - origin.z;
  const distance = Math.hypot(dx, dz);

  const normX = distance > 0.001 ? dx / distance : 0;
  const normZ = distance > 0.001 ? dz / distance : 1;

  if (isThroughBall) {
    // Through ball leads ahead and has slightly more pace + slight loft
    const speed = Math.max(14, Math.min(distance * 1.35, 28)) * powerMultiplier;
    return {
      x: normX * speed,
      y: 1.8,
      z: normZ * speed,
    };
  } else {
    // Ground driven pass
    const speed = Math.max(11, Math.min(distance * 1.25, 24)) * powerMultiplier;
    return {
      x: normX * speed,
      y: 0.1,
      z: normZ * speed,
    };
  }
}

/**
 * Calculates shot velocity vector towards goal with power charging and aim curl.
 */
export function calculateShotVector(
  origin: Vector3D,
  goalCenter: Vector3D,
  chargeFraction: number, // 0.1 to 1.0
  curveAngle: number = 0 // -1 to 1 for left/right curl
): Vector3D {
  const dx = goalCenter.x - origin.x;
  const dz = goalCenter.z - origin.z;
  const dist = Math.hypot(dx, dz);

  const baseSpeed = 16 + chargeFraction * 20; // 16m/s to 36m/s (bullet strike)
  const normX = dist > 0.001 ? dx / dist : 0;
  const normZ = dist > 0.001 ? dz / dist : 1;

  // Elevation based on power
  const elevation = 2.0 + chargeFraction * 6.5;

  // Add curl/angle offset
  const perpX = -normZ * curveAngle * 4;
  const perpZ = normX * curveAngle * 4;

  return {
    x: normX * baseSpeed + perpX,
    y: elevation,
    z: normZ * baseSpeed + perpZ,
  };
}

/**
 * FC 27 HyperMotion Power Shot:
 * Blistering speed, laser precision, dramatic flat trajectory.
 */
export function calculateFC27PowerShotVector(
  origin: Vector3D,
  goalCenter: Vector3D,
  chargeFraction: number,
  isGreenTimed: boolean = false
): Vector3D {
  const dx = goalCenter.x - origin.x;
  const dz = goalCenter.z - origin.z;
  const dist = Math.hypot(dx, dz);

  // Power shot reaches up to 44m/s, boosted further by green timed finish
  const speed = (28 + chargeFraction * 14) * (isGreenTimed ? 1.15 : 1.0);
  const normX = dist > 0.001 ? dx / dist : 0;
  const normZ = dist > 0.001 ? dz / dist : 1;

  // Flatter, more aggressive laser trajectory
  const elevation = 1.4 + chargeFraction * 3.8;

  return {
    x: normX * speed,
    y: elevation,
    z: normZ * speed,
  };
}

export type TimedFinishingGrade = 'PERFECT_GREEN' | 'EARLY_YELLOW' | 'LATE_RED';

/**
 * Evaluates FC 27 Timed Finishing release window.
 * Perfect green is between 0.35s and 0.55s after strike initiation.
 */
export function evaluateTimedFinishing(elapsedSeconds: number): {
  grade: TimedFinishingGrade;
  multiplier: number;
  label: string;
} {
  if (elapsedSeconds >= 0.35 && elapsedSeconds <= 0.55) {
    return {
      grade: 'PERFECT_GREEN',
      multiplier: 1.25,
      label: 'GREAT TIMING (GREEN)',
    };
  } else if (elapsedSeconds < 0.35) {
    return {
      grade: 'EARLY_YELLOW',
      multiplier: 0.9,
      label: 'EARLY TIMING (YELLOW)',
    };
  } else {
    return {
      grade: 'LATE_RED',
      multiplier: 0.75,
      label: 'LATE TIMING (RED)',
    };
  }
}

/**
 * FC 27 Controlled Sprint (R1 Dribble) vs Full Sprint (R2 Burst)
 */
export function calculateDribbleVelocity(
  inputVector: { x: number; z: number },
  sprintMode: 'NONE' | 'CONTROLLED_R1' | 'FULL_BURST_R2'
): { velocity: { x: number; z: number }; touchDistance: number; speedMps: number } {
  let speedMps = 5.2; // base jog dribble
  let touchDistance = 1.0;

  if (sprintMode === 'CONTROLLED_R1') {
    speedMps = 7.4; // technical controlled sprint
    touchDistance = 0.75; // stays closer to boots for rapid cuts
  } else if (sprintMode === 'FULL_BURST_R2') {
    speedMps = 9.2; // explosive full sprint
    touchDistance = 1.6; // knocks ball further ahead
  }

  return {
    velocity: {
      x: inputVector.x * speedMps,
      z: inputVector.z * speedMps,
    },
    touchDistance,
    speedMps,
  };
}

/**
 * Check if the ball crossed the goal plane inside the posts.
 */
export function checkGoalScored(
  ballPos: Vector3D,
  prevBallPos: Vector3D,
  goal: GoalDimensions
): boolean {
  // Goal post width check
  const inHorizontalSpan =
    ballPos.x >= goal.minX && ballPos.x <= goal.maxX;
  const inVerticalSpan =
    ballPos.y >= goal.minY && ballPos.y <= goal.maxY;

  // Crossed the goal line
  const crossedZ =
    (prevBallPos.z < goal.goalZ && ballPos.z >= goal.goalZ) ||
    (prevBallPos.z > goal.goalZ && ballPos.z <= goal.goalZ);

  return inHorizontalSpan && inVerticalSpan && crossedZ;
}
