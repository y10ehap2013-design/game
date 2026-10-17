/**
 * FC 27 Controller Configuration & Customization Logic
 * Supports Xbox, PlayStation (DualShock / DualSense), and PC Keyboard & Mouse.
 * Handles Classic, Alternate, PES Classic, and full Custom button remapping.
 */

export type ControllerDevice = 'XBOX' | 'PLAYSTATION' | 'KEYBOARD' | 'MOBILE';

export type ControlSchemePreset = 'CLASSIC' | 'ALTERNATE' | 'PES_CLASSIC' | 'TWO_BUTTON' | 'CUSTOM';

export type MobileControlStyle = 'EFOOTBALL_MOBILE' | 'FC_MOBILE' | 'PSP_CLASSIC' | 'CASUAL_TWO_BUTTON';
export type MobileStickType = 'floating' | 'fixed';
export type MobileButtonSize = 'compact' | 'standard' | 'large';
export type MobileHandLayout = 'right_handed' | 'left_handed';

export interface MobileTouchConfig {
  style: MobileControlStyle;
  stickType: MobileStickType;
  handLayout: MobileHandLayout;
  buttonSize: MobileButtonSize;
  buttonOpacity: number; // 0.2 to 1.0
  hapticsEnabled: boolean;
  gestureShortcuts: boolean;
  deadzone: number;
}

export const DEFAULT_MOBILE_TOUCH_CONFIG: MobileTouchConfig = {
  style: 'EFOOTBALL_MOBILE',
  stickType: 'fixed',
  handLayout: 'right_handed',
  buttonSize: 'standard',
  buttonOpacity: 0.85,
  hapticsEnabled: true,
  gestureShortcuts: true,
  deadzone: 0.12,
};

export type GameActionId =
  | 'MOVE_UP'
  | 'MOVE_DOWN'
  | 'MOVE_LEFT'
  | 'MOVE_RIGHT'
  | 'SHORT_PASS'
  | 'THROUGH_BALL'
  | 'LOB_CROSS'
  | 'SHOOT'
  | 'POWER_SHOT'
  | 'FINESSE_SHOT'
  | 'SPRINT'
  | 'CONTROLLED_SPRINT'
  | 'JOCKEY'
  | 'SWITCH_PLAYER'
  | 'CAMERA'
  | 'PAUSE';

export interface ActionMetadata {
  id: GameActionId;
  label: string;
  category: 'Offense' | 'Defense' | 'Movement & Advanced' | 'System';
  description: string;
}

export const GAME_ACTIONS: ActionMetadata[] = [
  {
    id: 'SHORT_PASS',
    label: 'Short Pass / Ground Header',
    category: 'Offense',
    description: 'Ground pass to feet of nearest teammate or downward offensive header',
  },
  {
    id: 'THROUGH_BALL',
    label: 'Through Ball',
    category: 'Offense',
    description: 'Pass into space ahead of the attacking runner',
  },
  {
    id: 'LOB_CROSS',
    label: 'Lob Pass / Cross / Standing Tackle',
    category: 'Offense',
    description: 'Lofted cross into the penalty area or standing challenge in defense',
  },
  {
    id: 'SHOOT',
    label: 'Shoot / Volley / Slide Tackle',
    category: 'Offense',
    description: 'Strikes ball toward goal or slide tackle when defending',
  },
  {
    id: 'POWER_SHOT',
    label: 'HyperMotion Power Shot',
    category: 'Offense',
    description: 'Unleashes maximum velocity strike with camera zoom-in effect',
  },
  {
    id: 'FINESSE_SHOT',
    label: 'Finesse Shot Modifier',
    category: 'Offense',
    description: 'Curls the ball towards top corners with reduced pace and high bend',
  },
  {
    id: 'SPRINT',
    label: 'Sprint Burst (R2 / RT)',
    category: 'Movement & Advanced',
    description: 'Maximum speed linear sprint down the wing',
  },
  {
    id: 'CONTROLLED_SPRINT',
    label: 'Controlled Sprint (R1 / RB)',
    category: 'Movement & Advanced',
    description: 'Close-control technical dribbling at accelerated pace',
  },
  {
    id: 'JOCKEY',
    label: 'Player Pace Control / Jockey',
    category: 'Defense',
    description: 'Lower stance to jockey attacker and cut off passing lanes',
  },
  {
    id: 'SWITCH_PLAYER',
    label: 'Switch Player',
    category: 'Defense',
    description: 'Cycles active controlled defender closest to the ball',
  },
  {
    id: 'MOVE_UP',
    label: 'Move Up / Forward',
    category: 'Movement & Advanced',
    description: 'Drives controlled player toward opposing goal',
  },
  {
    id: 'MOVE_DOWN',
    label: 'Move Down / Backward',
    category: 'Movement & Advanced',
    description: 'Tracks player back toward home penalty area',
  },
  {
    id: 'MOVE_LEFT',
    label: 'Move Left',
    category: 'Movement & Advanced',
    description: 'Lateral movement towards left touchline',
  },
  {
    id: 'MOVE_RIGHT',
    label: 'Move Right',
    category: 'Movement & Advanced',
    description: 'Lateral movement towards right touchline',
  },
  {
    id: 'CAMERA',
    label: 'Cycle Camera Angle',
    category: 'System',
    description: 'Switches between TV Broadcast, PSP Classic, Player Cam, and Tactical',
  },
  {
    id: 'PAUSE',
    label: 'Pause / Match Menu',
    category: 'System',
    description: 'Halts match and displays tactic adjustments',
  },
];

/** Standard W3C Gamepad Button indices */
export const GAMEPAD_BUTTONS = {
  A_CROSS: 0,
  B_CIRCLE: 1,
  X_SQUARE: 2,
  Y_TRIANGLE: 3,
  LB_L1: 4,
  RB_R1: 5,
  LT_L2: 6,
  RT_R2: 7,
  BACK_SELECT: 8,
  START_OPTIONS: 9,
  L3: 10,
  R3: 11,
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
} as const;

export interface ControllerMappingConfig {
  preset: ControlSchemePreset;
  device: ControllerDevice;
  // Gamepad button index or 'AXIS_LX+', etc.
  gamepadBindings: Record<GameActionId, number | string>;
  // Keyboard Event.code e.g. 'KeyS', 'Space', 'ShiftLeft'
  keyboardBindings: Record<GameActionId, string>;
  // Mobile Touch Controls configuration
  mobileTouchConfig: MobileTouchConfig;
  deadzone: number;
  vibrationEnabled: boolean;
}

/** Default Classic Preset (EA SPORTS FC 27 Standard) */
export const DEFAULT_CLASSIC_GAMEPAD_BINDINGS: Record<GameActionId, number | string> = {
  SHORT_PASS: GAMEPAD_BUTTONS.A_CROSS, // Xbox A / PS Cross
  THROUGH_BALL: GAMEPAD_BUTTONS.Y_TRIANGLE, // Xbox Y / PS Triangle
  LOB_CROSS: GAMEPAD_BUTTONS.X_SQUARE, // Xbox X / PS Square
  SHOOT: GAMEPAD_BUTTONS.B_CIRCLE, // Xbox B / PS Circle
  POWER_SHOT: 'LB+RB+SHOOT', // Or dedicated button
  FINESSE_SHOT: GAMEPAD_BUTTONS.RB_R1, // Xbox RB / PS R1
  SPRINT: GAMEPAD_BUTTONS.RT_R2, // Xbox RT / PS R2
  CONTROLLED_SPRINT: GAMEPAD_BUTTONS.RB_R1, // Xbox RB / PS R1
  JOCKEY: GAMEPAD_BUTTONS.LT_L2, // Xbox LT / PS L1/L2
  SWITCH_PLAYER: GAMEPAD_BUTTONS.LB_L1, // Xbox LB / PS L1
  MOVE_UP: 'AXIS_LY_MINUS',
  MOVE_DOWN: 'AXIS_LY_PLUS',
  MOVE_LEFT: 'AXIS_LX_MINUS',
  MOVE_RIGHT: 'AXIS_LX_PLUS',
  CAMERA: GAMEPAD_BUTTONS.BACK_SELECT,
  PAUSE: GAMEPAD_BUTTONS.START_OPTIONS,
};

/** Default Keyboard Bindings (PC Controls) */
export const DEFAULT_KEYBOARD_BINDINGS: Record<GameActionId, string> = {
  SHORT_PASS: 'KeyS', // As in user guide: Short Pass: S
  THROUGH_BALL: 'KeyW', // Through Ball: W
  LOB_CROSS: 'KeyA', // Lob Pass / Long Ball: A
  SHOOT: 'KeyD', // Shoot: D
  POWER_SHOT: 'KeyF',
  FINESSE_SHOT: 'KeyZ',
  SPRINT: 'ShiftLeft', // Sprint: E or Left Shift
  CONTROLLED_SPRINT: 'KeyR',
  JOCKEY: 'KeyQ',
  SWITCH_PLAYER: 'KeyQ',
  MOVE_UP: 'KeyW',
  MOVE_DOWN: 'KeyS',
  MOVE_LEFT: 'KeyA',
  MOVE_RIGHT: 'KeyD',
  CAMERA: 'KeyV',
  PAUSE: 'Escape',
};

/**
 * Alternate Scheme: Swaps Shoot (B/Circle -> X/Square) and Lob Cross (X/Square -> B/Circle)
 */
export function getAlternateGamepadBindings(): Record<GameActionId, number | string> {
  return {
    ...DEFAULT_CLASSIC_GAMEPAD_BINDINGS,
    SHOOT: GAMEPAD_BUTTONS.X_SQUARE, // Shoot is now X / Square
    LOB_CROSS: GAMEPAD_BUTTONS.B_CIRCLE, // Lob Cross is now B / Circle
  };
}

/**
 * PES Classic Scheme: Shoot on Square (2), Long pass on Circle (1), Short pass on X (0), Through on Triangle (3), Sprint on R1 (5)
 */
export function getPESClassicGamepadBindings(): Record<GameActionId, number | string> {
  return {
    ...DEFAULT_CLASSIC_GAMEPAD_BINDINGS,
    SHOOT: GAMEPAD_BUTTONS.X_SQUARE, // PES: Shoot is Square
    LOB_CROSS: GAMEPAD_BUTTONS.B_CIRCLE, // PES: Long pass is Circle
    SHORT_PASS: GAMEPAD_BUTTONS.A_CROSS, // PES: Short pass is X
    THROUGH_BALL: GAMEPAD_BUTTONS.Y_TRIANGLE, // PES: Through ball is Triangle
    SPRINT: GAMEPAD_BUTTONS.RB_R1, // PES: Sprint is R1
  };
}

/**
 * Two Button Scheme: Simplified for beginners
 */
export function getTwoButtonGamepadBindings(): Record<GameActionId, number | string> {
  return {
    ...DEFAULT_CLASSIC_GAMEPAD_BINDINGS,
    SHORT_PASS: GAMEPAD_BUTTONS.A_CROSS,
    THROUGH_BALL: GAMEPAD_BUTTONS.A_CROSS,
    LOB_CROSS: GAMEPAD_BUTTONS.B_CIRCLE,
    SHOOT: GAMEPAD_BUTTONS.B_CIRCLE,
    SPRINT: GAMEPAD_BUTTONS.RT_R2,
  };
}

/** Get default configuration for any preset */
export function getDefaultConfig(preset: ControlSchemePreset = 'CLASSIC', device: ControllerDevice = 'XBOX'): ControllerMappingConfig {
  let gamepadBindings = { ...DEFAULT_CLASSIC_GAMEPAD_BINDINGS };

  if (preset === 'ALTERNATE') {
    gamepadBindings = getAlternateGamepadBindings();
  } else if (preset === 'PES_CLASSIC') {
    gamepadBindings = getPESClassicGamepadBindings();
  } else if (preset === 'TWO_BUTTON') {
    gamepadBindings = getTwoButtonGamepadBindings();
  }

  return {
    preset,
    device,
    gamepadBindings,
    keyboardBindings: { ...DEFAULT_KEYBOARD_BINDINGS },
    mobileTouchConfig: { ...DEFAULT_MOBILE_TOUCH_CONFIG },
    deadzone: 0.15,
    vibrationEnabled: true,
  };
}

/** Format button label according to device (Xbox vs PlayStation vs Keyboard) */
export function getButtonDisplayLabel(
  binding: number | string,
  device: ControllerDevice
): { label: string; badgeColor: string; symbol?: string } {
  if (typeof binding === 'string') {
    if (binding === 'AXIS_LY_MINUS' || binding === 'AXIS_LY_PLUS' || binding === 'AXIS_LX_MINUS' || binding === 'AXIS_LX_PLUS') {
      return { label: 'Left Analog Stick', badgeColor: 'bg-neutral-800 text-neutral-300' };
    }
    if (binding === 'LB+RB+SHOOT') {
      return {
        label: device === 'PLAYSTATION' ? 'L1 + R1 + Shoot' : 'LB + RB + Shoot',
        badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      };
    }
    // Keyboard key format
    const cleanKey = binding.replace(/^Key/, '').replace(/^Arrow/, '').replace(/Left$/, ' (L)').replace(/Right$/, ' (R)');
    return { label: cleanKey, badgeColor: 'bg-slate-800 text-cyan-300 border border-slate-700' };
  }

  // Numerical Gamepad Button
  switch (binding) {
    case GAMEPAD_BUTTONS.A_CROSS:
      if (device === 'MOBILE') {
        return { label: '✕ Pass (Tap)', badgeColor: 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/50', symbol: '✕' };
      }
      return device === 'PLAYSTATION'
        ? { label: '✖ Cross', badgeColor: 'bg-blue-900/60 text-blue-300 border border-blue-500/50', symbol: '✖' }
        : { label: 'A Button', badgeColor: 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/50', symbol: 'A' };
    case GAMEPAD_BUTTONS.B_CIRCLE:
      if (device === 'MOBILE') {
        return { label: '◯ Shoot / Cross', badgeColor: 'bg-rose-900/60 text-rose-300 border border-rose-500/50', symbol: '◯' };
      }
      return device === 'PLAYSTATION'
        ? { label: '● Circle', badgeColor: 'bg-rose-900/60 text-rose-300 border border-rose-500/50', symbol: '●' }
        : { label: 'B Button', badgeColor: 'bg-rose-900/60 text-rose-300 border border-rose-500/50', symbol: 'B' };
    case GAMEPAD_BUTTONS.X_SQUARE:
      if (device === 'MOBILE') {
        return { label: '▢ Shoot / Tackle', badgeColor: 'bg-blue-900/60 text-blue-300 border border-blue-500/50', symbol: '▢' };
      }
      return device === 'PLAYSTATION'
        ? { label: '◼ Square', badgeColor: 'bg-pink-900/60 text-pink-300 border border-pink-500/50', symbol: '◼' }
        : { label: 'X Button', badgeColor: 'bg-blue-900/60 text-blue-300 border border-blue-500/50', symbol: 'X' };
    case GAMEPAD_BUTTONS.Y_TRIANGLE:
      if (device === 'MOBILE') {
        return { label: '▲ Thru Ball (Tap)', badgeColor: 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/50', symbol: '▲' };
      }
      return device === 'PLAYSTATION'
        ? { label: '▲ Triangle', badgeColor: 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/50', symbol: '▲' }
        : { label: 'Y Button', badgeColor: 'bg-amber-900/60 text-amber-300 border border-amber-500/50', symbol: 'Y' };
    case GAMEPAD_BUTTONS.LB_L1:
      if (device === 'MOBILE') {
        return { label: '🔄 Switch (Tap)', badgeColor: 'bg-neutral-800 text-slate-200 border border-neutral-600', symbol: 'L1' };
      }
      return device === 'PLAYSTATION'
        ? { label: 'L1 Bumper', badgeColor: 'bg-neutral-800 text-slate-200 border border-neutral-600' }
        : { label: 'LB Bumper', badgeColor: 'bg-neutral-800 text-slate-200 border border-neutral-600' };
    case GAMEPAD_BUTTONS.RB_R1:
      if (device === 'MOBILE') {
        return { label: '⚡ Dribble / Power', badgeColor: 'bg-purple-900/60 text-purple-300 border border-purple-500/50', symbol: 'R1' };
      }
      return device === 'PLAYSTATION'
        ? { label: 'R1 Bumper', badgeColor: 'bg-neutral-800 text-slate-200 border border-neutral-600' }
        : { label: 'RB Bumper', badgeColor: 'bg-neutral-800 text-slate-200 border border-neutral-600' };
    case GAMEPAD_BUTTONS.LT_L2:
      if (device === 'MOBILE') {
        return { label: '🛡️ Jockey / Shield', badgeColor: 'bg-neutral-800 text-cyan-300 border border-neutral-600', symbol: 'L2' };
      }
      return device === 'PLAYSTATION'
        ? { label: 'L2 Trigger', badgeColor: 'bg-neutral-800 text-cyan-300 border border-neutral-600' }
        : { label: 'LT Trigger', badgeColor: 'bg-neutral-800 text-cyan-300 border border-neutral-600' };
    case GAMEPAD_BUTTONS.RT_R2:
      if (device === 'MOBILE') {
        return { label: '🏃 Sprint Toggle', badgeColor: 'bg-amber-900/60 text-amber-300 border border-amber-500/50', symbol: 'R2' };
      }
      return device === 'PLAYSTATION'
        ? { label: 'R2 Trigger', badgeColor: 'bg-amber-900/60 text-amber-300 border border-amber-500/50' }
        : { label: 'RT Trigger', badgeColor: 'bg-amber-900/60 text-amber-300 border border-amber-500/50' };
    case GAMEPAD_BUTTONS.BACK_SELECT:
      return device === 'PLAYSTATION'
        ? { label: 'Share / Create', badgeColor: 'bg-neutral-800 text-slate-300' }
        : { label: 'View / Back', badgeColor: 'bg-neutral-800 text-slate-300' };
    case GAMEPAD_BUTTONS.START_OPTIONS:
      return device === 'PLAYSTATION'
        ? { label: 'Options', badgeColor: 'bg-neutral-800 text-slate-300' }
        : { label: 'Menu / Start', badgeColor: 'bg-neutral-800 text-slate-300' };
    default:
      return { label: `Button ${binding}`, badgeColor: 'bg-neutral-800 text-slate-300' };
  }
}

/** Check if two key/gamepad actions are mapped to the same button */
export function checkActionConflicts(
  config: ControllerMappingConfig,
  targetAction: GameActionId,
  isGamepad: boolean
): GameActionId[] {
  const targetBinding = isGamepad
    ? config.gamepadBindings[targetAction]
    : config.keyboardBindings[targetAction];

  // Whitelisted overlaps (e.g. Sprint and Controlled Sprint can have modifiers)
  const allowedOverlaps = new Set<string>(['MOVE_UP', 'MOVE_DOWN', 'MOVE_LEFT', 'MOVE_RIGHT']);
  if (allowedOverlaps.has(targetAction)) return [];

  const conflicts: GameActionId[] = [];
  const entries = isGamepad
    ? Object.entries(config.gamepadBindings)
    : Object.entries(config.keyboardBindings);

  for (const [action, binding] of entries) {
    if (action !== targetAction && binding === targetBinding && !allowedOverlaps.has(action)) {
      conflicts.push(action as GameActionId);
    }
  }

  return conflicts;
}

/** LocalStorage persistence key */
export const CONTROLS_STORAGE_KEY = 'fc27_controller_settings_v1';

export function loadSavedConfig(): ControllerMappingConfig {
  if (typeof window === 'undefined') return getDefaultConfig();
  try {
    const raw = localStorage.getItem(CONTROLS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.preset && parsed.gamepadBindings && parsed.keyboardBindings) {
        return {
          ...parsed,
          mobileTouchConfig: {
            ...DEFAULT_MOBILE_TOUCH_CONFIG,
            ...(parsed.mobileTouchConfig || {}),
          },
        } as ControllerMappingConfig;
      }
    }
  } catch {
    // fallback
  }
  return getDefaultConfig();
}

export function saveConfig(config: ControllerMappingConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONTROLS_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}
