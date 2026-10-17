/**
 * PSP Simulator Handheld Chassis & FC 27 Cross-Platform Controller.
 * Provides authentic Sony PSP hardware styling with D-pad, Analog Nub,
 * Action Buttons (△ ▢ ✕ ◯), L/R bumpers, FC 27 Standard vs Classic PES presets,
 * HyperMotion Power Shot, Lob Crossing, and Green Timed Finishing.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Gamepad2,
  Maximize2,
  Volume2,
  VolumeX,
  Eye,
  Zap,
  Sparkles,
  Flame,
  Sliders,
  CheckCircle2,
  Smartphone,
  Download,
  Settings,
} from 'lucide-react';
import { soundFX } from '../game/soundFX.ts';
import {
  ControllerMappingConfig,
  GAMEPAD_BUTTONS,
  MobileTouchConfig,
  DEFAULT_MOBILE_TOUCH_CONFIG,
} from '../logic/controllerSettings.ts';

interface PSPHeldWrapperProps {
  children: React.ReactNode;
  onPass: () => void;
  onThroughBall: () => void;
  onLobCross?: () => void;
  onShootStart: (isPowerShot?: boolean) => void;
  onShootRelease: () => void;
  onTimedFinishTap?: () => void;
  onFinesseShot?: () => void;
  onSprintToggle: (sprinting: boolean) => void;
  onControlledSprintToggle?: (active: boolean) => void;
  onSwitchPlayer: () => void;
  onDirectionChange: (dir: { x: number; z: number }) => void;
  onTogglePause: () => void;
  cameraMode: string;
  onCycleCamera: () => void;
  playStyleNotification?: string | null;
  timedFinishNotification?: { grade: string; label: string } | null;
  controllerConfig?: ControllerMappingConfig;
  onOpenCustomizeControls?: () => void;
  onOpenDownload?: () => void;
}

export const PSPHeldWrapper: React.FC<PSPHeldWrapperProps> = ({
  children,
  onPass,
  onThroughBall,
  onLobCross,
  onShootStart,
  onShootRelease,
  onTimedFinishTap,
  onFinesseShot,
  onSprintToggle,
  onControlledSprintToggle,
  onSwitchPlayer,
  onDirectionChange,
  onTogglePause,
  cameraMode,
  onCycleCamera,
  playStyleNotification,
  timedFinishNotification,
  controllerConfig,
  onOpenCustomizeControls,
  onOpenDownload,
}) => {
  const [controlPreset, setControlPreset] = useState<'FC27_STANDARD' | 'PES_CLASSIC'>('FC27_STANDARD');
  const [isHandheldFrame, setIsHandheldFrame] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAnalogDragging, setIsAnalogDragging] = useState<boolean>(false);
  const [analogOffset, setAnalogOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isChargingShot, setIsChargingShot] = useState<boolean>(false);
  const analogRef = useRef<HTMLDivElement>(null);
  const prevGamepadButtons = useRef<Map<number, boolean>>(new Map());

  const mobileCfg: MobileTouchConfig = controllerConfig?.mobileTouchConfig || DEFAULT_MOBILE_TOUCH_CONFIG;

  const triggerMobileHaptic = useCallback((pattern: number | number[] = 20) => {
    if (mobileCfg.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  }, [mobileCfg.hapticsEnabled]);

  // If user selected MOBILE device in settings, switch to mobile touch overlay
  useEffect(() => {
    if (controllerConfig?.device === 'MOBILE') {
      setIsHandheldFrame(false);
    }
  }, [controllerConfig?.device]);

  // Listen to window resize to adapt to mobile/desktop viewports
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsHandheldFrame(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effective active preset
  const effectivePreset = controllerConfig?.preset || controlPreset;
  const isAlternate = effectivePreset === 'ALTERNATE';
  const isPES = effectivePreset === 'PES_CLASSIC' || controlPreset === 'PES_CLASSIC';

  // Hardware Gamepad polling loop (supports Xbox, PlayStation, USB Gamepads)
  useEffect(() => {
    let animId: number;

    const poll = () => {
      if (typeof navigator !== 'undefined' && navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];

        if (gp) {
          const deadzone = controllerConfig?.deadzone ?? 0.15;
          // Left Stick movement
          let rawX = gp.axes[0] || 0;
          let rawY = gp.axes[1] || 0;

          // Check D-Pad
          if (gp.buttons[12]?.pressed) rawY = -1; // Up
          if (gp.buttons[13]?.pressed) rawY = 1; // Down
          if (gp.buttons[14]?.pressed) rawX = -1; // Left
          if (gp.buttons[15]?.pressed) rawX = 1; // Right

          const dist = Math.hypot(rawX, rawY);
          if (dist > deadzone) {
            onDirectionChange({ x: rawX, z: -rawY });
          } else if (!isAnalogDragging) {
            // Analog nub not touched
          }

          const isDown = (btnIdx: number | string | undefined): boolean => {
            if (typeof btnIdx === 'number' && gp.buttons[btnIdx]) {
              return gp.buttons[btnIdx].pressed || gp.buttons[btnIdx].value > 0.4;
            }
            return false;
          };

          const justPressed = (btnIdx: number | string | undefined): boolean => {
            if (typeof btnIdx !== 'number') return false;
            const current = isDown(btnIdx);
            const prev = prevGamepadButtons.current.get(btnIdx) || false;
            return current && !prev;
          };

          const justReleased = (btnIdx: number | string | undefined): boolean => {
            if (typeof btnIdx !== 'number') return false;
            const current = isDown(btnIdx);
            const prev = prevGamepadButtons.current.get(btnIdx) || false;
            return !current && prev;
          };

          const gb = controllerConfig?.gamepadBindings;
          const passBtn = gb?.SHORT_PASS ?? GAMEPAD_BUTTONS.A_CROSS;
          const thruBtn = gb?.THROUGH_BALL ?? GAMEPAD_BUTTONS.Y_TRIANGLE;
          const crossBtn = gb?.LOB_CROSS ?? (isAlternate ? GAMEPAD_BUTTONS.B_CIRCLE : GAMEPAD_BUTTONS.X_SQUARE);
          const shootBtn = gb?.SHOOT ?? (isAlternate ? GAMEPAD_BUTTONS.X_SQUARE : GAMEPAD_BUTTONS.B_CIRCLE);
          const sprintBtn = gb?.SPRINT ?? (isPES ? GAMEPAD_BUTTONS.RB_R1 : GAMEPAD_BUTTONS.RT_R2);
          const ctrlSprintBtn = gb?.CONTROLLED_SPRINT ?? GAMEPAD_BUTTONS.RB_R1;
          const switchBtn = gb?.SWITCH_PLAYER ?? GAMEPAD_BUTTONS.LB_L1;
          const pauseBtn = gb?.PAUSE ?? GAMEPAD_BUTTONS.START_OPTIONS;
          const camBtn = gb?.CAMERA ?? GAMEPAD_BUTTONS.BACK_SELECT;

          if (justPressed(passBtn)) onPass();
          if (justPressed(thruBtn)) onThroughBall();
          if (justPressed(crossBtn)) {
            if (onLobCross) onLobCross();
            else onThroughBall();
          }
          if (justPressed(switchBtn)) onSwitchPlayer();
          if (justPressed(pauseBtn)) onTogglePause();
          if (justPressed(camBtn)) onCycleCamera();

          // Shoot charging & Timed Finishing
          if (justPressed(shootBtn)) {
            if (isChargingShot) {
              onTimedFinishTap?.();
            } else {
              setIsChargingShot(true);
              const isPower = isDown(GAMEPAD_BUTTONS.LB_L1) && isDown(GAMEPAD_BUTTONS.RB_R1);
              onShootStart(isPower);
            }
          }
          if (justReleased(shootBtn)) {
            setIsChargingShot(false);
            onShootRelease();
          }

          // Sprint
          if (isDown(sprintBtn)) {
            onSprintToggle(true);
          } else if (justReleased(sprintBtn)) {
            onSprintToggle(false);
          }

          // Controlled Sprint
          if (isDown(ctrlSprintBtn) && !isDown(sprintBtn)) {
            onControlledSprintToggle ? onControlledSprintToggle(true) : onSprintToggle(true);
          } else if (justReleased(ctrlSprintBtn)) {
            onControlledSprintToggle ? onControlledSprintToggle(false) : onSprintToggle(false);
          }

          // Update previous state
          gp.buttons.forEach((b, idx) => {
            prevGamepadButtons.current.set(idx, b.pressed || b.value > 0.4);
          });
        }
      }
      animId = requestAnimationFrame(poll);
    };

    animId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(animId);
  }, [
    controllerConfig,
    isAlternate,
    isPES,
    onPass,
    onThroughBall,
    onLobCross,
    onShootStart,
    onShootRelease,
    onTimedFinishTap,
    onSprintToggle,
    onControlledSprintToggle,
    onSwitchPlayer,
    onDirectionChange,
    onTogglePause,
    onCycleCamera,
    isChargingShot,
    isAnalogDragging,
  ]);

  // Keyboard controls listener
  useEffect(() => {
    const heldKeys = new Set<string>();
    const kb = controllerConfig?.keyboardBindings;

    const matchesKey = (eCode: string, actionKey: string | undefined, defaultCodes: string[]) => {
      if (actionKey && eCode === actionKey) return true;
      return defaultCodes.includes(eCode);
    };

    const updateDirectionFromKeys = () => {
      let x = 0;
      let z = 0;
      if (heldKeys.has('KeyA') || heldKeys.has('ArrowLeft')) x -= 1;
      if (heldKeys.has('KeyD') || heldKeys.has('ArrowRight')) x += 1;
      if (heldKeys.has('KeyW') || heldKeys.has('ArrowUp')) z += 1; // forward toward away goal
      if (heldKeys.has('KeyS') || heldKeys.has('ArrowDown')) z -= 1;

      const len = Math.hypot(x, z);
      if (len > 0) {
        onDirectionChange({ x: x / len, z: z / len });
      } else {
        onDirectionChange({ x: 0, z: 0 });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (!heldKeys.has(e.code)) {
        heldKeys.add(e.code);
        updateDirectionFromKeys();

        // Check configured or default action keys
        if (matchesKey(e.code, kb?.SHORT_PASS, ['KeyJ', 'Space', 'KeyS'])) {
          onPass();
        } else if (matchesKey(e.code, kb?.THROUGH_BALL, ['KeyI', 'KeyE', 'KeyW'])) {
          onThroughBall();
        } else if (matchesKey(e.code, kb?.LOB_CROSS, ['KeyU', 'KeyC', 'KeyA'])) {
          onLobCross ? onLobCross() : onThroughBall();
        } else if (matchesKey(e.code, kb?.SHOOT, ['KeyK', 'KeyD'])) {
          if (isChargingShot) {
            onTimedFinishTap?.();
          } else {
            setIsChargingShot(true);
            onShootStart(false);
          }
        } else if (matchesKey(e.code, kb?.POWER_SHOT, ['KeyF', 'KeyP'])) {
          setIsChargingShot(true);
          onShootStart(true);
        } else if (matchesKey(e.code, kb?.FINESSE_SHOT, ['KeyZ'])) {
          onFinesseShot?.();
        } else if (matchesKey(e.code, kb?.CONTROLLED_SPRINT, ['KeyR', 'ControlLeft'])) {
          onControlledSprintToggle ? onControlledSprintToggle(true) : onSprintToggle(true);
        } else if (matchesKey(e.code, kb?.SPRINT, ['ShiftLeft', 'ShiftRight', 'KeyL'])) {
          onSprintToggle(true);
        } else if (matchesKey(e.code, kb?.SWITCH_PLAYER, ['KeyQ', 'Tab'])) {
          onSwitchPlayer();
        } else if (matchesKey(e.code, kb?.PAUSE, ['Escape'])) {
          onTogglePause();
        } else if (matchesKey(e.code, kb?.CAMERA, ['KeyV'])) {
          onCycleCamera();
        } else if (e.code === 'KeyM') {
          const nextMute = !soundFX.getMuted();
          soundFX.setMuted(nextMute);
          setIsMuted(nextMute);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      heldKeys.delete(e.code);
      updateDirectionFromKeys();

      if (
        matchesKey(e.code, kb?.SHOOT, ['KeyK', 'KeyD']) ||
        matchesKey(e.code, kb?.POWER_SHOT, ['KeyF', 'KeyP'])
      ) {
        setIsChargingShot(false);
        onShootRelease();
      } else if (matchesKey(e.code, kb?.SPRINT, ['ShiftLeft', 'ShiftRight', 'KeyL'])) {
        onSprintToggle(false);
      } else if (matchesKey(e.code, kb?.CONTROLLED_SPRINT, ['KeyR', 'ControlLeft'])) {
        onControlledSprintToggle ? onControlledSprintToggle(false) : onSprintToggle(false);
      }
    };

    const handleBlur = () => {
      heldKeys.clear();
      onDirectionChange({ x: 0, z: 0 });
      onSprintToggle(false);
      setIsChargingShot(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [
    controllerConfig,
    onPass,
    onThroughBall,
    onLobCross,
    onShootStart,
    onShootRelease,
    onTimedFinishTap,
    onFinesseShot,
    onSprintToggle,
    onControlledSprintToggle,
    onSwitchPlayer,
    onDirectionChange,
    onTogglePause,
    onCycleCamera,
    isChargingShot,
  ]);

  // Analog Nub Touch / Mouse Drag Handling
  const handleAnalogMove = (clientX: number, clientY: number) => {
    if (!analogRef.current) return;
    const rect = analogRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = 38;
    const dist = Math.hypot(dx, dy);

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);
    const offsetX = Math.cos(angle) * clampedDist;
    const offsetY = Math.sin(angle) * clampedDist;

    setAnalogOffset({ x: offsetX, y: offsetY });

    // In 3D space: X is left/right, Z is forward/back (-Y on screen is forward +Z)
    const normX = offsetX / maxRadius;
    const normZ = -offsetY / maxRadius;
    onDirectionChange({ x: normX, z: normZ });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsAnalogDragging(true);
    handleAnalogMove(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isAnalogDragging) {
      handleAnalogMove(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    setIsAnalogDragging(false);
    setAnalogOffset({ x: 0, y: 0 });
    onDirectionChange({ x: 0, z: 0 });
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFX.setMuted(next);
  };

  // Shoot button click handling with FC 27 timed finishing
  const handleShootPress = (isPower: boolean = false) => {
    triggerMobileHaptic(isPower ? [30, 40, 30] : 25);
    if (isChargingShot) {
      onTimedFinishTap?.();
    } else {
      setIsChargingShot(true);
      onShootStart(isPower);
    }
  };

  const handleShootEnd = () => {
    setIsChargingShot(false);
    onShootRelease();
  };

  // Full Screen / Mobile Overlay view
  if (!isHandheldFrame) {
    return (
      <div className="relative w-full h-full bg-black select-none overflow-hidden">
        {children}

        {/* FC 27 PlayStyle+ Notification Popup */}
        {playStyleNotification && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.8)] border border-white/60 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>PLAYSTYLE+ {playStyleNotification.toUpperCase()}</span>
          </div>
        )}

        {/* FC 27 Timed Finishing Feedback Bar */}
        {timedFinishNotification && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-black/90 border-2 text-xs font-mono font-black shadow-2xl transition-all">
            <span
              className={
                timedFinishNotification.grade === 'PERFECT_GREEN'
                  ? 'text-emerald-400'
                  : timedFinishNotification.grade === 'EARLY_YELLOW'
                  ? 'text-yellow-400'
                  : 'text-rose-500'
              }
            >
              {timedFinishNotification.label}
            </span>
          </div>
        )}

        {/* Floating Top Bar for Mobile Overlay */}
        <div className="absolute top-2 right-2 z-40 flex items-center gap-1.5">
          {/* Mobile Mode & Style Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/50 text-purple-200 text-[10px] font-mono shadow-md">
            <Smartphone className="w-3 h-3 text-purple-400" />
            <span className="font-bold hidden sm:inline">{mobileCfg.style.replace(/_/g, ' ')}</span>
            <span className="font-bold sm:hidden">MOBILE</span>
          </div>

          {onOpenCustomizeControls && (
            <button
              onClick={onOpenCustomizeControls}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-white text-[10px] font-mono border border-cyan-500/60 cursor-pointer shadow-md"
              title="Customize Controls & Remap Gamepad, Mobile Touch & Keyboard"
            >
              <Settings className="w-3 h-3 text-cyan-400" />
              <span>CONTROLS</span> ⚙️
            </button>
          )}

          {onOpenDownload && (
            <button
              onClick={onOpenDownload}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 text-[10px] font-mono border border-emerald-500/60 cursor-pointer shadow-md"
              title="Download or Install the Game on Mobile, PC, or PPSSPP"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              <span>INSTALL</span> 📥
            </button>
          )}

          <button
            onClick={onCycleCamera}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/75 hover:bg-black/90 text-white text-[10px] border border-white/20 cursor-pointer"
            title="Cycle Camera Angle"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span className="font-semibold">{cameraMode}</span>
          </button>
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-black/75 hover:bg-black/90 text-white text-[10px] border border-white/20 cursor-pointer"
            title="Toggle Audio"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button
            onClick={() => setIsHandheldFrame(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-semibold cursor-pointer shadow-md"
            title="Switch to PSP Simulator Chassis"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>PSP Chassis</span>
          </button>
        </div>

        {/* On-Screen Mobile Touch Controls (Left/Right adaptive to handLayout) */}
        {/* Virtual Analog Joystick Container */}
        <div
          className={`absolute bottom-20 z-40 pointer-events-auto ${
            mobileCfg.handLayout === 'left_handed' ? 'right-4 sm:right-8' : 'left-4 sm:left-8'
          }`}
        >
          <div
            ref={analogRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-cyan-400/50 bg-black/50 backdrop-blur-sm flex items-center justify-center relative touch-none cursor-pointer active:scale-95 transition-transform shadow-xl"
            style={{ opacity: mobileCfg.buttonOpacity }}
          >
            <div className="absolute inset-2 rounded-full border border-dashed border-white/20 pointer-events-none" />
            <div
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-white shadow-xl absolute pointer-events-none"
              style={{
                transform: `translate(${analogOffset.x}px, ${analogOffset.y}px)`,
              }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white/80" />
              </div>
            </div>
          </div>
          <div className="text-center mt-1">
            <span className="text-[9px] font-mono font-bold text-cyan-300/80 bg-black/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
              {mobileCfg.stickType === 'floating' ? 'FLOATING STICK' : 'ANALOG STICK'}
            </span>
          </div>
        </div>

        {/* Action Buttons Cluster (adaptive position & layout) */}
        <div
          className={`absolute bottom-20 z-40 pointer-events-auto flex flex-col gap-2 ${
            mobileCfg.handLayout === 'left_handed'
              ? 'left-4 sm:left-8 items-start'
              : 'right-4 sm:right-8 items-end'
          }`}
          style={{ opacity: mobileCfg.buttonOpacity }}
        >
          {/* Top Row Modifiers: Power Shot & Sprint & Switch */}
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => {
                triggerMobileHaptic(15);
                onSwitchPlayer();
              }}
              className="px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white text-[10px] font-bold shadow flex items-center gap-1 cursor-pointer active:scale-90 transition-transform"
              title="Switch Player"
            >
              <span>🔄 SWITCH</span>
            </button>

            <button
              onMouseDown={() => handleShootPress(true)}
              onMouseUp={handleShootEnd}
              onTouchStart={() => handleShootPress(true)}
              onTouchEnd={handleShootEnd}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 cursor-pointer active:scale-90 transition-transform"
              title="HyperMotion Power Shot"
            >
              <Zap className="w-3 h-3 text-yellow-300" />
              <span>POWER SHOT</span>
            </button>

            <button
              onMouseDown={() => {
                triggerMobileHaptic(15);
                onSprintToggle(true);
              }}
              onMouseUp={() => onSprintToggle(false)}
              onTouchStart={() => {
                triggerMobileHaptic(15);
                onSprintToggle(true);
              }}
              onTouchEnd={() => onSprintToggle(false)}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 cursor-pointer active:scale-90 transition-transform"
              title="Full Speed Dash"
            >
              <span>⚡ SPRINT</span>
            </button>
          </div>

          {/* Action Cluster according to mobileCfg.style */}
          {mobileCfg.style === 'CASUAL_TWO_BUTTON' ? (
            /* 2-Button Casual Layout */
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  triggerMobileHaptic(20);
                  onPass();
                }}
                className={`rounded-full bg-cyan-600/95 hover:bg-cyan-500 text-white font-bold flex flex-col items-center justify-center shadow-xl active:scale-90 transition-transform cursor-pointer border-2 border-white/40 ${
                  mobileCfg.buttonSize === 'compact'
                    ? 'w-14 h-14 text-sm'
                    : mobileCfg.buttonSize === 'large'
                    ? 'w-20 h-20 text-lg'
                    : 'w-16 h-16 text-base'
                }`}
              >
                <span className="font-black text-xl">✕</span>
                <span className="text-[10px] font-mono tracking-wider font-bold">PASS</span>
              </button>

              <button
                onMouseDown={() => handleShootPress(false)}
                onMouseUp={handleShootEnd}
                onTouchStart={() => handleShootPress(false)}
                onTouchEnd={handleShootEnd}
                className={`rounded-full bg-rose-600/95 hover:bg-rose-500 text-white font-bold flex flex-col items-center justify-center shadow-xl active:scale-90 transition-transform cursor-pointer border-2 border-white/40 ${
                  mobileCfg.buttonSize === 'compact'
                    ? 'w-14 h-14 text-sm'
                    : mobileCfg.buttonSize === 'large'
                    ? 'w-20 h-20 text-lg'
                    : 'w-16 h-16 text-base'
                }`}
              >
                <span className="font-black text-xl">◯</span>
                <span className="text-[10px] font-mono tracking-wider font-bold">SHOOT</span>
              </button>
            </div>
          ) : (
            /* Standard 4-Action Diamond Cluster */
            <div
              className={`grid grid-cols-3 gap-1.5 sm:gap-2 ${
                mobileCfg.buttonSize === 'compact'
                  ? 'w-36 h-36'
                  : mobileCfg.buttonSize === 'large'
                  ? 'w-48 h-48'
                  : 'w-42 h-42'
              }`}
            >
              {/* Top: Triangle △ (Through Ball) */}
              <div className="col-start-2">
                <button
                  onClick={() => {
                    triggerMobileHaptic(20);
                    onThroughBall();
                  }}
                  className={`rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer border border-emerald-400/50 ${
                    mobileCfg.buttonSize === 'compact'
                      ? 'w-11 h-11 text-xs'
                      : mobileCfg.buttonSize === 'large'
                      ? 'w-15 h-15 text-base'
                      : 'w-13 h-13 text-sm'
                  }`}
                >
                  <span className="leading-none">▲</span>
                  <span className="text-[8px] font-black tracking-tight mt-0.5">THRU</span>
                </button>
              </div>

              {/* Left: Square ▢ (Lob Cross or Shoot or Tackle) */}
              <div className="col-start-1 row-start-2">
                <button
                  onMouseDown={() => {
                    triggerMobileHaptic(20);
                    if (isAlternate || isPES) {
                      handleShootPress(false);
                    } else {
                      onLobCross ? onLobCross() : onThroughBall();
                    }
                  }}
                  onMouseUp={() => {
                    if (isAlternate || isPES) handleShootEnd();
                  }}
                  onTouchStart={() => {
                    triggerMobileHaptic(20);
                    if (isAlternate || isPES) {
                      handleShootPress(false);
                    } else {
                      onLobCross ? onLobCross() : onThroughBall();
                    }
                  }}
                  onTouchEnd={() => {
                    if (isAlternate || isPES) handleShootEnd();
                  }}
                  className={`rounded-full font-bold flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer border border-white/20 ${
                    mobileCfg.buttonSize === 'compact'
                      ? 'w-11 h-11 text-xs'
                      : mobileCfg.buttonSize === 'large'
                      ? 'w-15 h-15 text-base'
                      : 'w-13 h-13 text-sm'
                  } ${
                    isAlternate
                      ? 'bg-rose-600/90 hover:bg-rose-500 text-white'
                      : 'bg-blue-600/90 hover:bg-blue-500 text-white'
                  }`}
                >
                  <span className="leading-none">▢</span>
                  <span className="text-[8px] font-black tracking-tight mt-0.5">
                    {mobileCfg.style === 'FC_MOBILE' ? 'TACKLE' : isAlternate ? 'SHOOT' : isPES ? 'SHOT' : 'CROSS'}
                  </span>
                </button>
              </div>

              {/* Right: Circle ◯ (Shoot / Cross / Dash) */}
              <div className="col-start-3 row-start-2">
                <button
                  onMouseDown={() => {
                    if (isAlternate) {
                      triggerMobileHaptic(20);
                      onLobCross ? onLobCross() : onThroughBall();
                    } else if (isPES) {
                      triggerMobileHaptic(15);
                      onSprintToggle(true);
                    } else {
                      handleShootPress(false);
                    }
                  }}
                  onMouseUp={() => {
                    if (isPES) {
                      onSprintToggle(false);
                    } else if (!isAlternate) {
                      handleShootEnd();
                    }
                  }}
                  onTouchStart={() => {
                    if (isAlternate) {
                      triggerMobileHaptic(20);
                      onLobCross ? onLobCross() : onThroughBall();
                    } else if (isPES) {
                      triggerMobileHaptic(15);
                      onSprintToggle(true);
                    } else {
                      handleShootPress(false);
                    }
                  }}
                  onTouchEnd={() => {
                    if (isPES) {
                      onSprintToggle(false);
                    } else if (!isAlternate) {
                      handleShootEnd();
                    }
                  }}
                  className={`rounded-full font-bold flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer border border-white/20 ${
                    mobileCfg.buttonSize === 'compact'
                      ? 'w-11 h-11 text-xs'
                      : mobileCfg.buttonSize === 'large'
                      ? 'w-15 h-15 text-base'
                      : 'w-13 h-13 text-sm'
                  } ${
                    isAlternate
                      ? 'bg-blue-600/90 hover:bg-blue-500 text-white'
                      : isPES
                      ? 'bg-amber-500/90 hover:bg-amber-400 text-slate-900'
                      : 'bg-rose-600/90 hover:bg-rose-500 text-white'
                  }`}
                >
                  <span className="leading-none">◯</span>
                  <span className="text-[8px] font-black tracking-tight mt-0.5">
                    {isAlternate ? 'CROSS' : isPES ? 'SPRINT' : 'SHOOT'}
                  </span>
                </button>
              </div>

              {/* Bottom: Cross ✕ (Short Ground Pass) */}
              <div className="col-start-2 row-start-3">
                <button
                  onClick={() => {
                    triggerMobileHaptic(20);
                    onPass();
                  }}
                  className={`rounded-full bg-cyan-600/90 hover:bg-cyan-500 text-white font-bold flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer border border-cyan-400/50 ${
                    mobileCfg.buttonSize === 'compact'
                      ? 'w-11 h-11 text-xs'
                      : mobileCfg.buttonSize === 'large'
                      ? 'w-15 h-15 text-base'
                      : 'w-13 h-13 text-sm'
                  }`}
                >
                  <span className="leading-none">✕</span>
                  <span className="text-[8px] font-black tracking-tight mt-0.5">PASS</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Authentic Sony PSP Handheld Chassis
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-zinc-900 to-black p-2 sm:p-4 select-none overflow-hidden">
      {/* PSP Handheld Outer Bezel */}
      <div className="relative w-full max-w-[1180px] aspect-[16/9.2] bg-gradient-to-r from-zinc-900 via-neutral-900 to-zinc-900 rounded-[48px] sm:rounded-[64px] p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.2)] border-4 border-neutral-800 flex flex-col justify-between">
        {/* Top Rim: Shoulder Bumpers, Preset Switcher & Logo */}
        <div className="w-full flex items-center justify-between px-6 sm:px-12 pt-1 pb-2">
          {/* L Trigger (Switch Player / Chip Modifier) */}
          <button
            onClick={onSwitchPlayer}
            className="px-5 py-1.5 rounded-t-xl bg-gradient-to-b from-neutral-700 to-neutral-800 hover:from-neutral-600 text-slate-200 font-mono text-xs font-bold border-t border-x border-neutral-600 shadow-md active:translate-y-0.5 cursor-pointer"
            title="L1: Switch Player [Q]"
          >
            [L1] SWITCH
          </button>

          {/* Center Brand Plate & Preset Toggle & Controls Config */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-0.5 w-6 sm:w-8 bg-neutral-700 rounded-full" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold tracking-widest text-cyan-400 text-xs sm:text-sm font-sans">
                PSP 2027
              </span>
              <button
                onClick={() =>
                  setControlPreset(controlPreset === 'FC27_STANDARD' ? 'PES_CLASSIC' : 'FC27_STANDARD')
                }
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 border border-cyan-500/40 text-cyan-300 font-bold cursor-pointer"
                title="Toggle Control Scheme"
              >
                MODE: {effectivePreset === 'ALTERNATE' ? 'FC27 ALT' : isPES ? 'PES' : 'FC 27'}
              </button>
              <button
                onClick={() => setIsHandheldFrame(false)}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 hover:bg-purple-900 border border-purple-500/60 text-purple-200 font-bold cursor-pointer flex items-center gap-1 shadow-sm"
                title="Switch to Mobile Phone & Tablet Touch Controls Mode"
              >
                <Smartphone className="w-3 h-3 text-purple-400" />
                <span className="hidden sm:inline">MOBILE TOUCH</span>
                <span className="sm:hidden">MOBILE</span>
              </button>
              {onOpenCustomizeControls && (
                <button
                  onClick={onOpenCustomizeControls}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-white font-bold cursor-pointer flex items-center gap-1 shadow-sm"
                  title="Customize Controls & Remap Gamepad / Keyboard / Mobile"
                >
                  <Settings className="w-3 h-3 text-cyan-400" />
                  <span className="hidden sm:inline">CONTROLS</span> ⚙️
                </button>
              )}
              {onOpenDownload && (
                <button
                  onClick={onOpenDownload}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-200 font-bold cursor-pointer flex items-center gap-1 shadow-sm"
                  title="Download Game to Play on Mobile, PC, or PPSSPP"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">DOWNLOAD</span> 📥
                </button>
              )}
            </div>
            <div className="h-0.5 w-6 sm:w-8 bg-neutral-700 rounded-full" />
          </div>

          {/* Right Bumpers: R1 Controlled Sprint & R2 Burst */}
          <div className="flex items-center gap-2">
            <button
              onMouseDown={() =>
                onControlledSprintToggle ? onControlledSprintToggle(true) : onSprintToggle(true)
              }
              onMouseUp={() =>
                onControlledSprintToggle ? onControlledSprintToggle(false) : onSprintToggle(false)
              }
              onTouchStart={() =>
                onControlledSprintToggle ? onControlledSprintToggle(true) : onSprintToggle(true)
              }
              onTouchEnd={() =>
                onControlledSprintToggle ? onControlledSprintToggle(false) : onSprintToggle(false)
              }
              className="px-3.5 py-1.5 rounded-t-xl bg-gradient-to-b from-emerald-700 to-emerald-900 hover:from-emerald-600 text-white font-mono text-xs font-bold border-t border-x border-emerald-600 shadow-md active:translate-y-0.5 cursor-pointer"
              title="R1: FC 27 Controlled Sprint (Technical Dribble) [R]"
            >
              [R1] DRIBBLE
            </button>
            <button
              onMouseDown={() => onSprintToggle(true)}
              onMouseUp={() => onSprintToggle(false)}
              onTouchStart={() => onSprintToggle(true)}
              onTouchEnd={() => onSprintToggle(false)}
              className="px-4 py-1.5 rounded-t-xl bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 text-white font-mono text-xs font-bold border-t border-x border-amber-500 shadow-md active:translate-y-0.5 cursor-pointer"
              title="R2: Full Speed Burst [Shift]"
            >
              [R2] SPRINT
            </button>
          </div>
        </div>

        {/* Middle Body: Left Controls | Screen 16:9 | Right Controls */}
        <div className="w-full flex-1 flex items-center justify-between gap-3 sm:gap-6 min-h-0 px-2 sm:px-4">
          {/* Left Control Cluster: D-Pad & Analog Nub */}
          <div className="w-24 sm:w-36 flex flex-col items-center justify-around h-full py-2">
            {/* Sony D-Pad */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <button
                onMouseDown={() => onDirectionChange({ x: 0, z: 1 })}
                onMouseUp={() => onDirectionChange({ x: 0, z: 0 })}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-t-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 flex items-center justify-center text-neutral-400 active:bg-cyan-600 cursor-pointer"
              >
                ▲
              </button>
              <button
                onMouseDown={() => onDirectionChange({ x: 0, z: -1 })}
                onMouseUp={() => onDirectionChange({ x: 0, z: 0 })}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-b-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 flex items-center justify-center text-neutral-400 active:bg-cyan-600 cursor-pointer"
              >
                ▼
              </button>
              <button
                onMouseDown={() => onDirectionChange({ x: -1, z: 0 })}
                onMouseUp={() => onDirectionChange({ x: 0, z: 0 })}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-l-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 flex items-center justify-center text-neutral-400 active:bg-cyan-600 cursor-pointer"
              >
                ◀
              </button>
              <button
                onMouseDown={() => onDirectionChange({ x: 1, z: 0 })}
                onMouseUp={() => onDirectionChange({ x: 0, z: 0 })}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-r-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 flex items-center justify-center text-neutral-400 active:bg-cyan-600 cursor-pointer"
              >
                ▶
              </button>
              <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700" />
            </div>

            {/* PSP Analog Thumb Nub */}
            <div className="flex flex-col items-center mt-2">
              <div
                ref={analogRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-neutral-900 to-black border-2 border-neutral-700 shadow-inner flex items-center justify-center relative touch-none cursor-pointer"
                title="Analog 360° Movement (Touch / Drag / WASD)"
              >
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 border border-neutral-600 shadow-md flex items-center justify-center absolute pointer-events-none transition-transform duration-75"
                  style={{
                    transform: `translate(${analogOffset.x}px, ${analogOffset.y}px)`,
                  }}
                >
                  <div className="w-5 h-5 rounded-full border border-neutral-500/40 grid grid-cols-2 gap-0.5 p-0.5">
                    <div className="bg-neutral-600 rounded-full" />
                    <div className="bg-neutral-600 rounded-full" />
                    <div className="bg-neutral-600 rounded-full" />
                    <div className="bg-neutral-600 rounded-full" />
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-neutral-500 mt-1 font-mono">ANALOG</span>
            </div>
          </div>

          {/* Central 16:9 LCD Screen Frame */}
          <div className="flex-1 h-full min-h-0 bg-black rounded-xl sm:rounded-2xl border-4 border-neutral-950 shadow-2xl overflow-hidden relative flex items-center justify-center">
            {children}

            {/* FC 27 PlayStyle+ Notification Popup on Handheld Screen */}
            {playStyleNotification && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.8)] border border-white/60 animate-bounce">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>PLAYSTYLE+ {playStyleNotification.toUpperCase()}</span>
              </div>
            )}

            {/* FC 27 Timed Finishing Feedback Bar */}
            {timedFinishNotification && (
              <div className="absolute top-22 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center gap-1.5 px-4 py-1 rounded-xl bg-black/90 border-2 text-xs font-mono font-black shadow-2xl">
                <span
                  className={
                    timedFinishNotification.grade === 'PERFECT_GREEN'
                      ? 'text-emerald-400'
                      : timedFinishNotification.grade === 'EARLY_YELLOW'
                      ? 'text-yellow-400'
                      : 'text-rose-500'
                  }
                >
                  {timedFinishNotification.label}
                </span>
              </div>
            )}
          </div>

          {/* Right Action Cluster: △ ▢ ✕ ◯ */}
          <div className="w-24 sm:w-36 flex flex-col items-center justify-center h-full py-2">
            {/* Dedicated Power Shot Trigger Button */}
            <button
              onMouseDown={() => handleShootPress(true)}
              onMouseUp={handleShootEnd}
              onTouchStart={() => handleShootPress(true)}
              onTouchEnd={handleShootEnd}
              className="mb-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 cursor-pointer active:scale-90 transition-transform"
              title="FC 27 HyperMotion Power Shot [F / P]"
            >
              <Zap className="w-3 h-3 text-yellow-300" />
              <span>POWER SHOT</span>
            </button>

            <div className="relative w-28 h-28 sm:w-32 sm:h-32">
              {/* Triangle △ (Through Ball) */}
              <button
                onClick={onThroughBall}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-900 hover:from-neutral-700 border border-emerald-500/60 shadow-lg flex flex-col items-center justify-center active:scale-90 transition-transform cursor-pointer"
                title="△ Through Ball [I / W]"
              >
                <span className="text-emerald-400 font-bold text-base leading-none">△</span>
                <span className="text-[8px] text-emerald-300/80 leading-none mt-0.5">THRU</span>
              </button>

              {/* Square ▢ (Lob Cross in Classic / Shoot in Alternate & PES) */}
              <button
                onMouseDown={() => {
                  if (isAlternate || isPES) {
                    handleShootPress(false);
                  } else {
                    onLobCross ? onLobCross() : onThroughBall();
                  }
                }}
                onMouseUp={() => {
                  if (isAlternate || isPES) handleShootEnd();
                }}
                onTouchStart={() => {
                  if (isAlternate || isPES) {
                    handleShootPress(false);
                  } else {
                    onLobCross ? onLobCross() : onThroughBall();
                  }
                }}
                onTouchEnd={() => {
                  if (isAlternate || isPES) handleShootEnd();
                }}
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-900 hover:from-neutral-700 shadow-lg flex flex-col items-center justify-center active:scale-90 transition-transform cursor-pointer ${
                  isAlternate
                    ? 'border border-rose-500/70 text-rose-400'
                    : 'border border-blue-500/60 text-blue-400'
                }`}
                title={isAlternate ? '▢ Shoot [K / D]' : isPES ? '▢ Shoot [K / D]' : '▢ Lob Pass / Cross [U / C]'}
              >
                <span className="font-bold text-base leading-none">▢</span>
                <span className="text-[8px] leading-none mt-0.5">
                  {isAlternate ? 'SHOOT' : isPES ? 'SHOT' : 'CROSS'}
                </span>
              </button>

              {/* Circle ◯ (Shoot in Classic / Cross in Alternate / Sprint in PES) */}
              <button
                onMouseDown={() => {
                  if (isAlternate) {
                    onLobCross ? onLobCross() : onThroughBall();
                  } else if (isPES) {
                    onSprintToggle(true);
                  } else {
                    handleShootPress(false);
                  }
                }}
                onMouseUp={() => {
                  if (isPES) {
                    onSprintToggle(false);
                  } else if (!isAlternate) {
                    handleShootEnd();
                  }
                }}
                onTouchStart={() => {
                  if (isAlternate) {
                    onLobCross ? onLobCross() : onThroughBall();
                  } else if (isPES) {
                    onSprintToggle(true);
                  } else {
                    handleShootPress(false);
                  }
                }}
                onTouchEnd={() => {
                  if (isPES) {
                    onSprintToggle(false);
                  } else if (!isAlternate) {
                    handleShootEnd();
                  }
                }}
                className={`absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-900 hover:from-neutral-700 shadow-lg flex flex-col items-center justify-center active:scale-90 transition-transform cursor-pointer ${
                  isAlternate
                    ? 'border border-blue-500/70 text-blue-400'
                    : isPES
                    ? 'border border-amber-500/70 text-amber-400'
                    : 'border border-rose-500/70 text-rose-400'
                }`}
                title={isAlternate ? '◯ Lob Pass / Cross [U / C]' : isPES ? '◯ Sprint [Shift]' : '◯ Shoot / Timed Finish [K / D]'}
              >
                <span className="font-bold text-base leading-none">◯</span>
                <span className="text-[8px] leading-none mt-0.5">
                  {isAlternate ? 'CROSS' : isPES ? 'SPRINT' : 'SHOOT'}
                </span>
              </button>

              {/* Cross ✕ (Short Pass) */}
              <button
                onClick={onPass}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-900 hover:from-neutral-700 border border-cyan-500/60 shadow-lg flex flex-col items-center justify-center active:scale-90 transition-transform cursor-pointer"
                title="✕ Ground Short Pass [J / Space]"
              >
                <span className="text-cyan-400 font-bold text-base leading-none">✕</span>
                <span className="text-[8px] text-cyan-300/80 leading-none mt-0.5">PASS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Home, Volume, Select, Start */}
        <div className="w-full flex items-center justify-between px-8 sm:px-16 pt-2 pb-1 border-t border-neutral-800/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHandheldFrame(false)}
              className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white px-2.5 py-1 rounded bg-neutral-800/60 border border-neutral-700 cursor-pointer"
              title="Maximize to Fullscreen LCD"
            >
              <Maximize2 className="w-3 h-3 text-cyan-400" />
              <span>FULLSCREEN</span>
            </button>
            <button
              onClick={toggleMute}
              className="p-1.5 rounded bg-neutral-800/60 border border-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
              title="Mute Audio [M]"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          </div>

          {/* Quick Camera Switch */}
          <button
            onClick={onCycleCamera}
            className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white font-mono bg-neutral-800 px-3 py-1 rounded border border-neutral-700 cursor-pointer"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>CAM: {cameraMode}</span>
          </button>

          {/* Select & Start Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={onCycleCamera}
              className="text-[10px] font-bold tracking-wider font-mono px-3 py-1 rounded-sm bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 cursor-pointer"
            >
              SELECT
            </button>
            <button
              onClick={onTogglePause}
              className="text-[10px] font-bold tracking-wider font-mono px-3 py-1 rounded-sm bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow cursor-pointer"
            >
              START / PAUSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
