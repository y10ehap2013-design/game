/**
 * EA SPORTS FC 27 & PES 2019 Controller Configuration & Remapper
 * Features real-time Gamepad API polling, Xbox/PlayStation visualizers,
 * Preset switching (Classic vs Alternate vs PES Classic vs Custom),
 * and live keyboard & controller remapping with conflict prevention.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Gamepad2,
  Keyboard,
  Settings,
  RotateCcw,
  Check,
  AlertTriangle,
  Zap,
  Shield,
  HelpCircle,
  Eye,
  Sliders,
  ChevronRight,
  X,
  Radio,
  Smartphone,
  Sparkles,
  Move,
  CheckCircle2,
} from 'lucide-react';
import {
  ControllerDevice,
  ControlSchemePreset,
  ControllerMappingConfig,
  GameActionId,
  GAME_ACTIONS,
  GAMEPAD_BUTTONS,
  MobileControlStyle,
  MobileStickType,
  MobileButtonSize,
  MobileHandLayout,
  MobileTouchConfig,
  DEFAULT_MOBILE_TOUCH_CONFIG,
  getDefaultConfig,
  getButtonDisplayLabel,
  checkActionConflicts,
  saveConfig,
} from '../logic/controllerSettings.ts';
import { soundFX } from '../game/soundFX.ts';

interface CustomizeControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ControllerMappingConfig;
  onConfigChange: (newConfig: ControllerMappingConfig) => void;
}

export const CustomizeControlsModal: React.FC<CustomizeControlsModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigChange,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<ControllerDevice>(config.device);
  const [selectedPreset, setSelectedPreset] = useState<ControlSchemePreset>(config.preset);
  const [activeTab, setActiveTab] = useState<'remapping' | 'visualizer' | 'guide'>('remapping');
  const [listeningAction, setListeningAction] = useState<GameActionId | null>(null);
  const [connectedGamepadName, setConnectedGamepadName] = useState<string | null>(null);
  const [pressedButtons, setPressedButtons] = useState<Set<number>>(new Set());
  const [axesValues, setAxesValues] = useState<{ lx: number; ly: number; rx: number; ry: number }>({
    lx: 0,
    ly: 0,
    rx: 0,
    ry: 0,
  });
  const [triggerValues, setTriggerValues] = useState<{ lt: number; rt: number }>({ lt: 0, rt: 0 });
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // Mobile Touch Playground Test State
  const [mobileStickPos, setMobileStickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMobileStickActive, setIsMobileStickActive] = useState<boolean>(false);
  const [activeMobileAction, setActiveMobileAction] = useState<string | null>(null);
  const [mobileFeedbackMsg, setMobileFeedbackMsg] = useState<string>('Touch buttons or drag joystick to test');

  const mobileCfg: MobileTouchConfig = config.mobileTouchConfig || DEFAULT_MOBILE_TOUCH_CONFIG;

  const handleMobileConfigUpdate = (partial: Partial<MobileTouchConfig>) => {
    const updated = {
      ...config,
      mobileTouchConfig: {
        ...mobileCfg,
        ...partial,
      },
    };
    onConfigChange(updated);
    saveConfig(updated);
  };

  const requestRef = useRef<number | null>(null);

  // Poll physical gamepads in real time
  const pollGamepad = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return;
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];

    if (gp) {
      setConnectedGamepadName(gp.id);
      const activeBtns = new Set<number>();
      gp.buttons.forEach((b, idx) => {
        if (b.pressed || b.value > 0.3) {
          activeBtns.add(idx);
        }
      });
      setPressedButtons(activeBtns);

      // Axes
      setAxesValues({
        lx: gp.axes[0] ? Number(gp.axes[0].toFixed(2)) : 0,
        ly: gp.axes[1] ? Number(gp.axes[1].toFixed(2)) : 0,
        rx: gp.axes[2] ? Number(gp.axes[2].toFixed(2)) : 0,
        ry: gp.axes[3] ? Number(gp.axes[3].toFixed(2)) : 0,
      });

      // Triggers (Buttons 6 and 7 in standard mapping)
      const lt = gp.buttons[6]?.value ?? 0;
      const rt = gp.buttons[7]?.value ?? 0;
      setTriggerValues({ lt: Number(lt.toFixed(2)), rt: Number(rt.toFixed(2)) });

      // If we are currently listening for button remapping and a button is pressed
      if (listeningAction !== null) {
        for (let i = 0; i < gp.buttons.length; i++) {
          if (gp.buttons[i].pressed) {
            handleRemapGamepadButton(listeningAction, i);
            break;
          }
        }
      }
    } else {
      setConnectedGamepadName(null);
      setPressedButtons(new Set());
    }

    requestRef.current = requestAnimationFrame(pollGamepad);
  }, [listeningAction]);

  useEffect(() => {
    if (isOpen) {
      requestRef.current = requestAnimationFrame(pollGamepad);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isOpen, pollGamepad]);

  // Listen to keyboard remapping if in listening state
  useEffect(() => {
    if (!isOpen || !listeningAction || selectedDevice !== 'KEYBOARD') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Don't bind Escape if we want to allow cancelling remapping
      if (e.code === 'Escape' && listeningAction !== 'PAUSE') {
        setListeningAction(null);
        return;
      }

      const updated = {
        ...config,
        preset: 'CUSTOM' as const,
        keyboardBindings: {
          ...config.keyboardBindings,
          [listeningAction]: e.code,
        },
      };
      onConfigChange(updated);
      saveConfig(updated);
      setSelectedPreset('CUSTOM');
      setListeningAction(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, listeningAction, selectedDevice, config, onConfigChange]);

  const handleRemapGamepadButton = (action: GameActionId, buttonIndex: number) => {
    const updated = {
      ...config,
      preset: 'CUSTOM' as const,
      gamepadBindings: {
        ...config.gamepadBindings,
        [action]: buttonIndex,
      },
    };
    onConfigChange(updated);
    saveConfig(updated);
    setSelectedPreset('CUSTOM');
    setListeningAction(null);
  };

  const handlePresetSelect = (preset: ControlSchemePreset) => {
    setSelectedPreset(preset);
    const fresh = getDefaultConfig(preset, selectedDevice);
    onConfigChange(fresh);
    saveConfig(fresh);
  };

  const handleDeviceSelect = (dev: ControllerDevice) => {
    setSelectedDevice(dev);
    const updated = { ...config, device: dev };
    onConfigChange(updated);
    saveConfig(updated);
  };

  const handleResetDefaults = () => {
    const fresh = getDefaultConfig(selectedPreset, selectedDevice);
    onConfigChange(fresh);
    saveConfig(fresh);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden font-sans text-slate-100">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black uppercase tracking-tight text-white">
                  CUSTOMIZE CONTROLS
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  FC 27 &amp; PES ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configure Xbox / PlayStation gamepads or PC keyboard mappings with live input testing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device & Mode Selector Tabs */}
        <div className="w-full bg-slate-950/60 px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Device Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => handleDeviceSelect('XBOX')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDevice === 'XBOX'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Xbox Controller</span>
            </button>
            <button
              onClick={() => handleDeviceSelect('PLAYSTATION')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDevice === 'PLAYSTATION'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>PlayStation DualSense</span>
            </button>
            <button
              onClick={() => handleDeviceSelect('KEYBOARD')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDevice === 'KEYBOARD'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>PC Keyboard &amp; Mouse</span>
            </button>
            <button
              onClick={() => handleDeviceSelect('MOBILE')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDevice === 'MOBILE'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Smartphone className="w-4 h-4 text-purple-300" />
              <span>Mobile Touch</span>
            </button>
          </div>

          {/* Sub Navigation: Remap vs Visualizer vs Controls Guide */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('remapping')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                activeTab === 'remapping' ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              {selectedDevice === 'MOBILE' ? 'Mobile Controls Setup' : 'Button Mapping'}
            </button>
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'visualizer' ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{selectedDevice === 'MOBILE' ? 'Live Mobile Tester' : 'Live Gamepad Tester'}</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'guide' ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Controls &amp; Gestures Guide</span>
            </button>
          </div>
        </div>

        {/* Live Hardware Connection Bar */}
        <div className="w-full bg-slate-900/90 px-6 py-2 border-b border-slate-800/60 flex items-center justify-between text-xs font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connectedGamepadName
                  ? 'bg-emerald-400 animate-pulse'
                  : selectedDevice === 'MOBILE'
                  ? 'bg-purple-400 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
            {connectedGamepadName ? (
              <span className="text-emerald-300">
                HARDWARE DETECTED: <span className="text-white font-bold">{connectedGamepadName}</span>
              </span>
            ) : selectedDevice === 'MOBILE' ? (
              <span className="text-purple-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span>MOBILE TOUCH ENGINE ACTIVE: Virtual Joystick &amp; Touch Action Buttons ready for phones &amp; tablets</span>
              </span>
            ) : (
              <span className="text-amber-300/90">
                {selectedDevice === 'KEYBOARD'
                  ? 'KEYBOARD DETECTED: Ready for PC Key Remapping'
                  : 'PLUG-AND-PLAY READY: Connect your Xbox or PS Controller via USB/Bluetooth and press any button'}
              </span>
            )}
          </div>

          {pressedButtons.size > 0 && (
            <div className="text-[11px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
              Active: {Array.from(pressedButtons).map((b) => `Btn #${b}`).join(', ')}
            </div>
          )}
        </div>

        {/* Scrollable Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BUTTON REMAPPING / MOBILE CONTROLS SETUP */}
          {activeTab === 'remapping' && (
            selectedDevice === 'MOBILE' ? (
              <div className="space-y-6">
                {/* 1. Mobile Touch Scheme Style */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4" />
                        <span>Mobile Touch Control Style</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Choose your touch layout preset for mobile phones, touchscreens, and tablets
                      </p>
                    </div>
                    <span className="text-xs font-mono text-purple-300 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/60 w-fit">
                      Preset: {mobileCfg.style.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      {
                        id: 'EFOOTBALL_MOBILE' as const,
                        name: 'eFootball / PES Mobile',
                        badge: 'Classic PES',
                        desc: 'Dedicated Pass, Through, Sprint/Dash, Shoot, and Tackle cluster with tactile response',
                      },
                      {
                        id: 'FC_MOBILE' as const,
                        name: 'EA FC 27 Mobile',
                        badge: 'Modern FC',
                        desc: 'Short Pass, Driven Ground, Through Ball, Power Shot & Skill Dribble buttons',
                      },
                      {
                        id: 'PSP_CLASSIC' as const,
                        name: 'PSP Virtual Handheld',
                        badge: 'Sony PSP',
                        desc: 'Authentic △ ▢ ✕ ◯ Touch Cluster + L1/R1 bumpers on top of the screen',
                      },
                      {
                        id: 'CASUAL_TWO_BUTTON' as const,
                        name: 'Casual 2-Button Tap',
                        badge: 'Simplified',
                        desc: 'Large simplified Pass (✕) and Shoot (◯) buttons with automated sprint & smart assist',
                      },
                    ].map((st) => {
                      const isSel = mobileCfg.style === st.id;
                      return (
                        <div
                          key={st.id}
                          onClick={() => handleMobileConfigUpdate({ style: st.id })}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSel
                              ? 'bg-gradient-to-b from-purple-900/40 to-slate-900 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                              : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-white">{st.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                {st.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{st.desc}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                            <span className={isSel ? 'text-purple-300 font-bold' : 'text-slate-500'}>
                              {isSel ? '✓ ACTIVE' : 'Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Virtual Joystick & Hand Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Thumbstick Type */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Move className="w-4 h-4 text-cyan-400" />
                      <span>Virtual Analog Thumbstick Mode</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Select how the movement joystick behaves on screen
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => handleMobileConfigUpdate({ stickType: 'fixed' })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          mobileCfg.stickType === 'fixed'
                            ? 'bg-cyan-950/60 border-cyan-400 text-white shadow'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs">Fixed Virtual Stick</div>
                        <div className="text-[10px] text-slate-400 mt-1">Stationary pad anchored in bottom corner</div>
                      </button>

                      <button
                        onClick={() => handleMobileConfigUpdate({ stickType: 'floating' })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          mobileCfg.stickType === 'floating'
                            ? 'bg-cyan-950/60 border-cyan-400 text-white shadow'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs">Floating Dynamic Stick</div>
                        <div className="text-[10px] text-slate-400 mt-1">Spawns directly under your thumb on touch</div>
                      </button>
                    </div>

                    {/* Stick Deadzone */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                        <span>STICK DEADZONE / DRIFT SHIELD</span>
                        <span className="text-cyan-300 font-bold">{Math.round(mobileCfg.deadzone * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={Math.round(mobileCfg.deadzone * 100)}
                        onChange={(e) => handleMobileConfigUpdate({ deadzone: Number(e.target.value) / 100 })}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Hand Layout (Right vs Left Handed) */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>Hand Orientation &amp; Screen Sides</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Invert the screen side controls for left-handed gameplay
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => handleMobileConfigUpdate({ handLayout: 'right_handed' })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          mobileCfg.handLayout === 'right_handed'
                            ? 'bg-emerald-950/60 border-emerald-400 text-white shadow'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs">Standard Right-Handed</div>
                        <div className="text-[10px] text-slate-400 mt-1">Stick on Left · Buttons on Right</div>
                      </button>

                      <button
                        onClick={() => handleMobileConfigUpdate({ handLayout: 'left_handed' })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          mobileCfg.handLayout === 'left_handed'
                            ? 'bg-emerald-950/60 border-emerald-400 text-white shadow'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs">Inverted Left-Handed</div>
                        <div className="text-[10px] text-slate-400 mt-1">Stick on Right · Buttons on Left</div>
                      </button>
                    </div>

                    {/* Haptic & Gestures Toggles */}
                    <div className="pt-2 flex flex-col gap-2">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">Tactile Haptic Feedback</span>
                          <span className="text-[10px] text-slate-400 font-mono">(Vibrate phone on kick &amp; tackle)</span>
                        </div>
                        <button
                          onClick={() => {
                            const next = !mobileCfg.hapticsEnabled;
                            handleMobileConfigUpdate({ hapticsEnabled: next });
                            if (next && typeof navigator !== 'undefined' && navigator.vibrate) {
                              navigator.vibrate([25, 40, 25]);
                            }
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            mobileCfg.hapticsEnabled
                              ? 'bg-emerald-600 text-white shadow'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {mobileCfg.hapticsEnabled ? 'ENABLED' : 'DISABLED'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Button Ergonomics: Size, Opacity & Gesture Shortcuts */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Button Ergonomics &amp; Visibility
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Customize button touch targets and transparency so you can see through to the pitch
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Size */}
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-slate-300">BUTTON SCALE</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['compact', 'standard', 'large'] as MobileButtonSize[]).map((sz) => (
                          <button
                            key={sz}
                            onClick={() => handleMobileConfigUpdate({ buttonSize: sz })}
                            className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                              mobileCfg.buttonSize === sz
                                ? 'bg-purple-600 text-white shadow'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Opacity */}
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>BUTTON OPACITY</span>
                        <span className="text-purple-300 font-mono">{Math.round(mobileCfg.buttonOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="25"
                        max="100"
                        value={Math.round(mobileCfg.buttonOpacity * 100)}
                        onChange={(e) => handleMobileConfigUpdate({ buttonOpacity: Number(e.target.value) / 100 })}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>

                    {/* Gestures Shortcut Toggle */}
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">GESTURE SHORTCUTS</span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {mobileCfg.gestureShortcuts ? 'ACTIVE' : 'OFF'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleMobileConfigUpdate({ gestureShortcuts: !mobileCfg.gestureShortcuts })}
                        className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          mobileCfg.gestureShortcuts
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {mobileCfg.gestureShortcuts ? 'Double-Tap & Flick Enabled' : 'Standard Tap Only'}
                      </button>
                    </div>
                  </div>

                  {/* CTA to Visualizer */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-slate-400 font-mono">
                      Test your custom button layout and responsive tactile input:
                    </span>
                    <button
                      onClick={() => setActiveTab('visualizer')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Live Mobile Tester</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Preset Selector Card */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Control Scheme Preset
                    </div>
                    <div className="text-sm text-slate-200 font-medium">
                      {selectedPreset === 'CLASSIC' && 'Classical Layout: B / ● Shoot · X / ◼ Lob Cross · A / ✕ Pass · Y / ▲ Through Ball'}
                      {selectedPreset === 'ALTERNATE' && 'Alternate Layout: Swaps Shoot and Cross buttons (Shoot on X / ◼, Cross on B / ●)'}
                      {selectedPreset === 'PES_CLASSIC' && 'PES / eFootball Classic: Shoot on Square · Long Pass on Circle · Sprint on R1'}
                      {selectedPreset === 'TWO_BUTTON' && 'Two-Button Casual: Simplified for quick play'}
                      {selectedPreset === 'CUSTOM' && 'Custom Configuration: User-remapped actions'}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handlePresetSelect('CLASSIC')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        selectedPreset === 'CLASSIC'
                          ? 'bg-cyan-600 text-white shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Classic
                    </button>
                    <button
                      onClick={() => handlePresetSelect('ALTERNATE')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        selectedPreset === 'ALTERNATE'
                          ? 'bg-cyan-600 text-white shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Alternate (Swap Shoot/Cross)
                    </button>
                    <button
                      onClick={() => handlePresetSelect('PES_CLASSIC')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        selectedPreset === 'PES_CLASSIC'
                          ? 'bg-cyan-600 text-white shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      PES Classic
                    </button>
                    <button
                      onClick={() => handlePresetSelect('CUSTOM')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        selectedPreset === 'CUSTOM'
                          ? 'bg-amber-600 text-white shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                {/* Listening Notice Banner */}
                {listeningAction && (
                  <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500/60 text-amber-200 flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3">
                      <Radio className="w-5 h-5 animate-ping text-amber-400" />
                      <div>
                        <div className="font-black text-sm uppercase">
                          Press any button on your controller or key on your keyboard to assign to:
                        </div>
                        <div className="text-xs text-amber-300 font-mono">
                          {GAME_ACTIONS.find((a) => a.id === listeningAction)?.label}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setListeningAction(null)}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                    >
                      Cancel (Esc)
                    </button>
                  </div>
                )}

                {/* Action Remapping Table */}
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono uppercase text-[11px]">
                        <th className="py-3 px-4 font-bold">Action</th>
                        <th className="py-3 px-4 font-bold">Category</th>
                        <th className="py-3 px-4 font-bold">
                          {selectedDevice === 'KEYBOARD' ? 'Keyboard Key' : `${selectedDevice} Button`}
                        </th>
                        <th className="py-3 px-4 font-bold text-right">Configure</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {GAME_ACTIONS.map((action) => {
                        const isKeyboard = selectedDevice === 'KEYBOARD';
                        const binding = isKeyboard
                          ? config.keyboardBindings[action.id]
                          : config.gamepadBindings[action.id];
                        const display = getButtonDisplayLabel(binding, selectedDevice);
                        const conflicts = checkActionConflicts(config, action.id, !isKeyboard);
                        const isListening = listeningAction === action.id;

                        return (
                          <tr
                            key={action.id}
                            className={`hover:bg-slate-900/40 transition-colors ${
                              isListening ? 'bg-amber-500/10' : ''
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="font-bold text-white text-sm">{action.label}</div>
                              <div className="text-[11px] text-slate-400 max-w-sm">
                                {action.description}
                              </div>
                              {conflicts.length > 0 && (
                                <div className="flex items-center gap-1 text-[10px] text-rose-400 mt-0.5">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Conflicts with: {conflicts.join(', ')}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-800 text-slate-300">
                                {action.category}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black shadow-sm ${display.badgeColor}`}
                              >
                                {display.symbol && <span>{display.symbol}</span>}
                                <span>{display.label}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setListeningAction(action.id)}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                                  isListening
                                    ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                                    : 'bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white border border-slate-700'
                                }`}
                              >
                                {isListening ? 'Listening...' : 'Remap'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {/* TAB 2: LIVE GAMEPAD TESTER & VISUALIZER */}
          {activeTab === 'visualizer' && (
            selectedDevice === 'MOBILE' ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-purple-400" />
                      <span>Live Mobile Touchscreen Playground</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Interact with the virtual joystick and action buttons on this smartphone simulator to preview touch scale, layout &amp; tactile feedback
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-300">
                      Style: {mobileCfg.style.replace(/_/g, ' ')}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                      Scale: {mobileCfg.buttonSize.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Virtual Mobile Phone Mockup */}
                <div className="relative w-full max-w-2xl mx-auto p-4 sm:p-6 rounded-[36px] bg-gradient-to-b from-slate-900 via-neutral-950 to-slate-900 border-4 border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none">
                  {/* Phone Notch & Speaker Pill */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 pointer-events-none">
                    <div className="w-12 h-1.5 rounded-full bg-slate-700/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                  </div>

                  {/* Phone Screen Display (Pitch turf) */}
                  <div className="relative w-full aspect-[16/9] min-h-[260px] sm:min-h-[320px] rounded-[24px] bg-gradient-to-b from-[#0a381c] via-[#082b15] to-[#041a0d] border border-white/10 overflow-hidden flex items-center justify-between p-4 sm:p-6 shadow-inner">
                    {/* Pitch markings */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white -translate-x-1/2" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white" />
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-20 h-36 border border-white" />
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-20 h-36 border border-white" />
                    </div>

                    {/* Left & Right Clusters (respecting handLayout) */}
                    <div
                      className={`relative z-20 w-full h-full flex items-center justify-between ${
                        mobileCfg.handLayout === 'left_handed' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Virtual Analog Joystick (Interactive Test) */}
                      <div className="flex flex-col items-center justify-center p-2">
                        <div
                          onPointerDown={(e) => {
                            setIsMobileStickActive(true);
                            const rect = e.currentTarget.getBoundingClientRect();
                            const cx = rect.left + rect.width / 2;
                            const cy = rect.top + rect.height / 2;
                            const dx = e.clientX - cx;
                            const dy = e.clientY - cy;
                            const dist = Math.hypot(dx, dy);
                            const maxR = 36;
                            const clamped = Math.min(dist, maxR);
                            const ang = Math.atan2(dy, dx);
                            setMobileStickPos({ x: Math.cos(ang) * clamped, y: Math.sin(ang) * clamped });
                            setMobileFeedbackMsg(`Joystick Active (${Math.round((clamped / maxR) * 100)}% Power)`);
                          }}
                          onPointerMove={(e) => {
                            if (!isMobileStickActive) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const cx = rect.left + rect.width / 2;
                            const cy = rect.top + rect.height / 2;
                            const dx = e.clientX - cx;
                            const dy = e.clientY - cy;
                            const dist = Math.hypot(dx, dy);
                            const maxR = 36;
                            const clamped = Math.min(dist, maxR);
                            const ang = Math.atan2(dy, dx);
                            setMobileStickPos({ x: Math.cos(ang) * clamped, y: Math.sin(ang) * clamped });
                            setMobileFeedbackMsg(`Driving: ${Math.round((clamped / maxR) * 100)}% Speed`);
                          }}
                          onPointerUp={() => {
                            setIsMobileStickActive(false);
                            setMobileStickPos({ x: 0, y: 0 });
                            setMobileFeedbackMsg('Joystick Centered');
                          }}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-cyan-400/50 bg-black/40 backdrop-blur-sm flex items-center justify-center relative touch-none cursor-grab active:cursor-grabbing shadow-lg"
                        >
                          {/* Outer direction tick marks */}
                          <div className="absolute inset-2 rounded-full border border-dashed border-white/20 pointer-events-none" />

                          {/* Thumbstick Knob */}
                          <div
                            className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-white shadow-xl flex items-center justify-center absolute pointer-events-none transition-transform duration-75"
                            style={{
                              transform: `translate(${mobileStickPos.x}px, ${mobileStickPos.y}px)`,
                            }}
                          >
                            <div className="w-3.5 h-3.5 rounded-full bg-white/80" />
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-300 font-bold mt-2">
                          {mobileCfg.stickType === 'floating' ? 'FLOATING STICK' : 'FIXED STICK'}
                        </span>
                      </div>

                      {/* Right Touch Action Cluster (Interactive Buttons Test) */}
                      <div
                        className="flex flex-col items-center justify-center"
                        style={{ opacity: mobileCfg.buttonOpacity }}
                      >
                        {/* Power Shot Banner Button */}
                        <button
                          onClick={() => {
                            setActiveMobileAction('HYPER_POWER_SHOT');
                            setMobileFeedbackMsg('⚡ HyperMotion Power Shot Executed!');
                            soundFX.playPowerShot();
                            if (mobileCfg.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
                              navigator.vibrate([30, 40, 30]);
                            }
                            setTimeout(() => setActiveMobileAction(null), 800);
                          }}
                          className={`mb-2 px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 cursor-pointer transition-all active:scale-90 ${
                            activeMobileAction === 'HYPER_POWER_SHOT'
                              ? 'bg-yellow-400 text-black scale-105'
                              : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500'
                          }`}
                        >
                          <Zap className="w-3 h-3 text-yellow-300" />
                          <span>Power Shot</span>
                        </button>

                        {/* Button Cluster */}
                        {mobileCfg.style === 'CASUAL_TWO_BUTTON' ? (
                          /* 2-Button Casual Layout */
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setActiveMobileAction('PASS');
                                setMobileFeedbackMsg('✕ Ground Short Pass to Feet');
                                soundFX.playKick(0.5);
                                if (mobileCfg.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
                                  navigator.vibrate(20);
                                }
                                setTimeout(() => setActiveMobileAction(null), 400);
                              }}
                              className={`rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex flex-col items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer ${
                                mobileCfg.buttonSize === 'compact'
                                  ? 'w-14 h-14 text-sm'
                                  : mobileCfg.buttonSize === 'large'
                                  ? 'w-20 h-20 text-lg'
                                  : 'w-16 h-16 text-base'
                              } ${activeMobileAction === 'PASS' ? 'ring-4 ring-cyan-300 scale-105' : ''}`}
                            >
                              <span className="font-black">✕</span>
                              <span className="text-[9px] uppercase tracking-wider">PASS</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveMobileAction('SHOOT');
                                setMobileFeedbackMsg('◯ Direct Goal Strike');
                                soundFX.playKick(1.0);
                                if (mobileCfg.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
                                  navigator.vibrate(25);
                                }
                                setTimeout(() => setActiveMobileAction(null), 400);
                              }}
                              className={`rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold flex flex-col items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer ${
                                mobileCfg.buttonSize === 'compact'
                                  ? 'w-14 h-14 text-sm'
                                  : mobileCfg.buttonSize === 'large'
                                  ? 'w-20 h-20 text-lg'
                                  : 'w-16 h-16 text-base'
                              } ${activeMobileAction === 'SHOOT' ? 'ring-4 ring-rose-300 scale-105' : ''}`}
                            >
                              <span className="font-black">◯</span>
                              <span className="text-[9px] uppercase tracking-wider">SHOOT</span>
                            </button>
                          </div>
                        ) : (
                          /* Standard 4-Button Cluster */
                          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                            {/* Top Button: Through Ball */}
                            <div className="col-start-2">
                              <button
                                onClick={() => {
                                  setActiveMobileAction('THROUGH');
                                  setMobileFeedbackMsg('▲ Through Ball into Space');
                                  soundFX.playKick(0.6);
                                  if (mobileCfg.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
                                    navigator.vibrate(20);
                                  }
                                  setTimeout(() => setActiveMobileAction(null), 400);
                                }}
                                className={`rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex flex-col items-center justify-center shadow-lg active:scale-90 transition-all cursor-pointer ${
                                  mobileCfg.buttonSize === 'compact'
                                    ? 'w-11 h-11 text-xs'
                                    : mobileCfg.buttonSize === 'large'
                                    ? 'w-15 h-15 text-base'
                                    : 'w-13 h-13 text-sm'
                                } ${activeMobileAction === 'THROUGH' ? 'ring-4 ring-emerald-300 scale-105' : ''}`}
                              >
                                <span>▲</span>
                                <span className="text-[8px] font-black tracking-tight">THRU</span>
                              </button>
                            </div>

                            {/* Left Button: Cross / Tackle */}
                            <div className="col-start-1 row-start-2">
                              <button
                                onClick={() => {
                                  setActiveMobileAction('CROSS');
                                  setMobileFeedbackMsg('▢ Lob Cross / Standing Challenge');
                                  soundFX.playKick(0.7);
                                  if (mobileCfg.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
                                    navigator.vibrate(20);
                                  }
                                  setTimeout(() => setActiveMobileAction(null), 400);
                                }}
                                className={`rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold flex flex-col items-center justify-center shadow-lg active:scale-90 transition-all cursor-pointer ${
                                  mobileCfg.buttonSize === 'compact'
                                    ? 'w-11 h-11 text-xs'
                                    : mobileCfg.buttonSize === 'large'
                                    ? 'w-15 h-15 text-base'
                                    : 'w-13 h-13 text-sm'
                                } ${activeMobileAction === 'CROSS' ? 'ring-4 ring-blue-300 scale-105' : ''}`}
                              >
                                <span>▢</span>
                                <span className="text-[8px] font-black tracking-tight">
                                  {mobileCfg.style === 'FC_MOBILE' ? 'TACKLE' : 'CROSS'}
                                </span>
                              </button>
                            </div>

                            {/* Right Button: Shoot / Sprint */}
                            <div className="col-start-3 row-start-2">
                              <button
                                onClick={() => {
                                  setActiveMobileAction('SHOOT');
                                  setMobileFeedbackMsg('◯ Strike on Goal / Volley');
                                  soundFX.playKick(1.0);
                                  if (mobileCfg.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
                                    navigator.vibrate(25);
                                  }
                                  setTimeout(() => setActiveMobileAction(null), 400);
                                }}
                                className={`rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold flex flex-col items-center justify-center shadow-lg active:scale-90 transition-all cursor-pointer ${
                                  mobileCfg.buttonSize === 'compact'
                                    ? 'w-11 h-11 text-xs'
                                    : mobileCfg.buttonSize === 'large'
                                    ? 'w-15 h-15 text-base'
                                    : 'w-13 h-13 text-sm'
                                } ${activeMobileAction === 'SHOOT' ? 'ring-4 ring-rose-300 scale-105' : ''}`}
                              >
                                <span>◯</span>
                                <span className="text-[8px] font-black tracking-tight">SHOOT</span>
                              </button>
                            </div>

                            {/* Bottom Button: Short Ground Pass */}
                            <div className="col-start-2 row-start-3">
                              <button
                                onClick={() => {
                                  setActiveMobileAction('PASS');
                                  setMobileFeedbackMsg('✕ Ground Short Pass');
                                  soundFX.playKick(0.5);
                                  if (mobileCfg.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
                                    navigator.vibrate(20);
                                  }
                                  setTimeout(() => setActiveMobileAction(null), 400);
                                }}
                                className={`rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex flex-col items-center justify-center shadow-lg active:scale-90 transition-all cursor-pointer ${
                                  mobileCfg.buttonSize === 'compact'
                                    ? 'w-11 h-11 text-xs'
                                    : mobileCfg.buttonSize === 'large'
                                    ? 'w-15 h-15 text-base'
                                    : 'w-13 h-13 text-sm'
                                } ${activeMobileAction === 'PASS' ? 'ring-4 ring-cyan-300 scale-105' : ''}`}
                              >
                                <span>✕</span>
                                <span className="text-[8px] font-black tracking-tight">PASS</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Feedback Banner at bottom of phone */}
                  <div className="w-full mt-3 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-slate-300">
                        INPUT EVENT: <span className="text-white font-bold">{mobileFeedbackMsg}</span>
                      </span>
                    </div>
                    {activeMobileAction && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900 text-purple-200 border border-purple-700 animate-pulse">
                        ACTION: {activeMobileAction}
                      </span>
                    )}
                  </div>
                </div>

                {/* Live Gauges under Mobile Visualizer */}
                <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">STICK POSITION</div>
                    <div className="text-cyan-400 font-bold mt-1">
                      X: {mobileStickPos.x.toFixed(1)}, Y: {mobileStickPos.y.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">TOUCH OPACITY</div>
                    <div className="text-purple-400 font-bold mt-1">
                      {Math.round(mobileCfg.buttonOpacity * 100)}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">ORIENTATION</div>
                    <div className="text-emerald-400 font-bold mt-1">
                      {mobileCfg.handLayout === 'left_handed' ? 'LEFT-HANDED' : 'RIGHT-HANDED'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">HAPTICS STATUS</div>
                    <div className="text-amber-400 font-bold mt-1">
                      {mobileCfg.hapticsEnabled ? 'ACTIVE (VIBRATING)' : 'MUTED'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5 text-cyan-400" />
                      <span>Real-Time Controller Input Visualizer</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Move your analog sticks and press any button to inspect physical controller input response and trigger values
                    </p>
                  </div>
                  <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    Deadzone: {config.deadzone * 100}%
                  </div>
                </div>

                {/* Visual Controller Diagram */}
                <div className="relative w-full max-w-xl mx-auto p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-inner flex flex-col items-center justify-center">
                  {/* SVG Gamepad Graphic */}
                  <svg
                    className="w-full max-w-md h-auto"
                    viewBox="0 0 500 320"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Controller Shell */}
                    <path
                      d="M130 50 C200 55, 300 55, 370 50 C440 45, 480 120, 460 250 C450 300, 390 310, 360 260 C330 210, 310 190, 250 190 C190 190, 170 210, 140 260 C110 310, 50 300, 40 250 C20 120, 60 45, 130 50 Z"
                      fill="#1e293b"
                      stroke="#334155"
                      strokeWidth="6"
                    />

                    {/* Left Trigger LT / L2 */}
                    <rect
                      x="90"
                      y="18"
                      width="60"
                      height="24"
                      rx="6"
                      fill={pressedButtons.has(6) || triggerValues.lt > 0.1 ? '#06b6d4' : '#334155'}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                    <text x="120" y="34" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {selectedDevice === 'PLAYSTATION' ? 'L2' : 'LT'} ({Math.round(triggerValues.lt * 100)}%)
                    </text>

                    {/* Right Trigger RT / R2 */}
                    <rect
                      x="350"
                      y="18"
                      width="60"
                      height="24"
                      rx="6"
                      fill={pressedButtons.has(7) || triggerValues.rt > 0.1 ? '#f59e0b' : '#334155'}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                    <text x="380" y="34" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {selectedDevice === 'PLAYSTATION' ? 'R2' : 'RT'} ({Math.round(triggerValues.rt * 100)}%)
                    </text>

                    {/* Left Bumper LB / L1 */}
                    <rect
                      x="100"
                      y="46"
                      width="65"
                      height="18"
                      rx="4"
                      fill={pressedButtons.has(4) ? '#38bdf8' : '#1e293b'}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                    <text x="132" y="60" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {selectedDevice === 'PLAYSTATION' ? 'L1' : 'LB'}
                    </text>

                    {/* Right Bumper RB / R1 */}
                    <rect
                      x="335"
                      y="46"
                      width="65"
                      height="18"
                      rx="4"
                      fill={pressedButtons.has(5) ? '#10b981' : '#1e293b'}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                    <text x="367" y="60" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {selectedDevice === 'PLAYSTATION' ? 'R1' : 'RB'}
                    </text>

                    {/* D-PAD */}
                    <g transform="translate(130, 140)">
                      {/* Up */}
                      <rect
                        x="-10"
                        y="-32"
                        width="20"
                        height="24"
                        rx="3"
                        fill={pressedButtons.has(12) ? '#38bdf8' : '#0f172a'}
                        stroke="#475569"
                      />
                      {/* Down */}
                      <rect
                        x="-10"
                        y="8"
                        width="20"
                        height="24"
                        rx="3"
                        fill={pressedButtons.has(13) ? '#38bdf8' : '#0f172a'}
                        stroke="#475569"
                      />
                      {/* Left */}
                      <rect
                        x="-32"
                        y="-10"
                        width="24"
                        height="20"
                        rx="3"
                        fill={pressedButtons.has(14) ? '#38bdf8' : '#0f172a'}
                        stroke="#475569"
                      />
                      {/* Right */}
                      <rect
                        x="8"
                        y="-10"
                        width="24"
                        height="20"
                        rx="3"
                        fill={pressedButtons.has(15) ? '#38bdf8' : '#0f172a'}
                        stroke="#475569"
                      />
                      <circle cx="0" cy="0" r="10" fill="#0f172a" />
                    </g>

                    {/* Action Buttons Cluster: A/B/X/Y or ✕/◯/▢/△ */}
                    <g transform="translate(370, 140)">
                      {/* Y or △ (Top) */}
                      <circle
                        cx="0"
                        cy="-24"
                        r="14"
                        fill={pressedButtons.has(3) ? '#f59e0b' : '#0f172a'}
                        stroke="#f59e0b"
                        strokeWidth="2"
                      />
                      <text x="0" y="-19" fill="#fef08a" fontSize="12" fontWeight="black" textAnchor="middle">
                        {selectedDevice === 'PLAYSTATION' ? '▲' : 'Y'}
                      </text>

                      {/* B or ◯ (Right) */}
                      <circle
                        cx="24"
                        cy="0"
                        r="14"
                        fill={pressedButtons.has(1) ? '#f43f5e' : '#0f172a'}
                        stroke="#f43f5e"
                        strokeWidth="2"
                      />
                      <text x="24" y="5" fill="#fecdd3" fontSize="12" fontWeight="black" textAnchor="middle">
                        {selectedDevice === 'PLAYSTATION' ? '●' : 'B'}
                      </text>

                      {/* A or ✕ (Bottom) */}
                      <circle
                        cx="0"
                        cy="24"
                        r="14"
                        fill={pressedButtons.has(0) ? '#10b981' : '#0f172a'}
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                      <text x="0" y="29" fill="#a7f3d0" fontSize="12" fontWeight="black" textAnchor="middle">
                        {selectedDevice === 'PLAYSTATION' ? '✖' : 'A'}
                      </text>

                      {/* X or ▢ (Left) */}
                      <circle
                        cx="-24"
                        cy="0"
                        r="14"
                        fill={pressedButtons.has(2) ? '#3b82f6' : '#0f172a'}
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      <text x="-24" y="5" fill="#bfdbfe" fontSize="12" fontWeight="black" textAnchor="middle">
                        {selectedDevice === 'PLAYSTATION' ? '◼' : 'X'}
                      </text>
                    </g>

                    {/* Left Analog Stick */}
                    <g transform="translate(190, 205)">
                      <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                      {/* Nub offset by axes */}
                      <circle
                        cx={axesValues.lx * 14}
                        cy={axesValues.ly * 14}
                        r="18"
                        fill={pressedButtons.has(10) ? '#06b6d4' : '#1e293b'}
                        stroke="#64748b"
                        strokeWidth="2"
                      />
                      <text x="0" y="4" fill="#94a3b8" fontSize="9" textAnchor="middle">
                        LS
                      </text>
                    </g>

                    {/* Right Analog Stick */}
                    <g transform="translate(310, 205)">
                      <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                      <circle
                        cx={axesValues.rx * 14}
                        cy={axesValues.ry * 14}
                        r="18"
                        fill={pressedButtons.has(11) ? '#06b6d4' : '#1e293b'}
                        stroke="#64748b"
                        strokeWidth="2"
                      />
                      <text x="0" y="4" fill="#94a3b8" fontSize="9" textAnchor="middle">
                        RS
                      </text>
                    </g>

                    {/* Select / View Button */}
                    <rect
                      x="210"
                      y="125"
                      width="20"
                      height="12"
                      rx="3"
                      fill={pressedButtons.has(8) ? '#38bdf8' : '#0f172a'}
                      stroke="#475569"
                    />

                    {/* Start / Menu Button */}
                    <rect
                      x="270"
                      y="125"
                      width="20"
                      height="12"
                      rx="3"
                      fill={pressedButtons.has(9) ? '#38bdf8' : '#0f172a'}
                      stroke="#475569"
                    />
                  </svg>

                  {/* Live Gauges under Visualizer */}
                  <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">LEFT STICK X/Y</div>
                      <div className="text-cyan-400 font-bold mt-1">
                        {axesValues.lx.toFixed(2)}, {axesValues.ly.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">RIGHT STICK X/Y</div>
                      <div className="text-cyan-400 font-bold mt-1">
                        {axesValues.rx.toFixed(2)}, {axesValues.ry.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">LT / L2 TRIGGER</div>
                      <div className="text-emerald-400 font-bold mt-1">
                        {Math.round(triggerValues.lt * 100)}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">RT / R2 TRIGGER</div>
                      <div className="text-amber-400 font-bold mt-1">
                        {Math.round(triggerValues.rt * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* TAB 3: CONTROLS & GESTURES GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
              {/* Card 0: Mobile Touch Controls & Gestures Guide */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-base">
                    <Smartphone className="w-5 h-5 text-purple-400" />
                    <h4>📱 Mobile Phone &amp; Tablet Touch Controls Guide</h4>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-500/40">
                    TOUCHSCREEN READY
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  PES &amp; eFootball Studio 2027 delivers authentic mobile controls optimized for smartphone and tablet gaming.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-800/40">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                      <Move className="w-3.5 h-3.5" />
                      <span>360° Movement &amp; Dribble</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px]">
                      Drag the virtual thumbstick in any direction. In Floating mode, touch anywhere on the left side of the screen to spawn the stick right under your thumb.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-800/40">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                      <span>✕ Ground &amp; ▲ Through Pass</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px]">
                      Tap <b className="text-white">✕ (Pass)</b> to deliver a crisp ball to feet. Tap <b className="text-white">▲ (Through)</b> to lead runners into open space behind the defensive line.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-800/40">
                    <div className="flex items-center gap-1.5 font-bold text-rose-300">
                      <span>◯ Striking &amp; Power Shot</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px]">
                      Tap <b className="text-white">◯ (Shoot)</b> to finish on goal. Hold to charge shot power. Tap the dedicated <b className="text-yellow-300">Power Shot</b> button or double-tap shoot for HyperMotion blast.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-800/40">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <span>⚡ Sprint Burst &amp; Dash</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px]">
                      Hold the <b className="text-white">Sprint / Dash</b> button while steering the analog stick to unleash rapid acceleration down the wings.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-800/40">
                    <div className="flex items-center gap-1.5 font-bold text-blue-300">
                      <span>▢ Standing Tackle &amp; Slide</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px]">
                      When defending, tap <b className="text-white">▢</b> to execute a standing challenge. Hold for defensive containment and passing lane jockeying.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-800/40">
                    <div className="flex items-center gap-1.5 font-bold text-purple-300">
                      <span>🔄 Left-Handed Mode &amp; Haptics</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px]">
                      Switch to Inverted Left-Handed mode in Controls settings to flip sides. Tactile vibrations provide feedback on every shot and tackle.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 1: Gamepad Recommendations */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                  <Gamepad2 className="w-5 h-5" />
                  <h4>🎮 Recommended: Using a Controller (Gamepad)</h4>
                </div>
                <p className="text-xs text-slate-300">
                  Playing with a controller provides the best experience for sports games and precision HyperMotion dribbling.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-emerald-400">Xbox Controllers:</span>
                    <p className="text-slate-400 mt-1">
                      Natively supported by Windows and browser Gamepad API. Simply plug it in via USB or connect via Bluetooth, and it works instantly.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-blue-400">PlayStation (DualShock 4 / DualSense):</span>
                    <p className="text-slate-400 mt-1">
                      EA Sports FC 27 supports PlayStation controllers natively on PC with authentic ✕ / ◯ / ▢ / △ button glyphs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Standard Controller Layout Comparison */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                  <Sliders className="w-5 h-5" />
                  <h4>🕹️ Standard Controller Layout (Classical vs Alternate)</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Most PC players use the Classical button layout. Here is the default comparison for Xbox and PlayStation gamepads:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                    <thead className="bg-slate-900 font-mono text-slate-400">
                      <tr>
                        <th className="p-2.5">Action</th>
                        <th className="p-2.5">Xbox Controller</th>
                        <th className="p-2.5">PlayStation Controller</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                      <tr>
                        <td className="p-2.5 text-white font-bold">Move Player</td>
                        <td className="p-2.5 text-slate-300">Left Analog Stick</td>
                        <td className="p-2.5 text-slate-300">Left Analog Stick</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-white font-bold">Sprint</td>
                        <td className="p-2.5 text-amber-300 font-bold">RT (Right Trigger)</td>
                        <td className="p-2.5 text-amber-300 font-bold">R2 (Right Trigger)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-white font-bold">Short Pass / Header</td>
                        <td className="p-2.5 text-emerald-300">A</td>
                        <td className="p-2.5 text-blue-300">✖ (Cross)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-white font-bold">Through Ball</td>
                        <td className="p-2.5 text-amber-300">Y</td>
                        <td className="p-2.5 text-emerald-300">▲ (Triangle)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-white font-bold">Lob Pass / Cross / Tackle</td>
                        <td className="p-2.5 text-blue-300">X</td>
                        <td className="p-2.5 text-pink-300">◼ (Square)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-white font-bold">Shoot / Volley / Slide Tackle</td>
                        <td className="p-2.5 text-rose-300 font-bold">B</td>
                        <td className="p-2.5 text-rose-300 font-bold">● (Circle)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-white font-bold">Finesse Shot Modifier</td>
                        <td className="p-2.5 text-slate-300">RB</td>
                        <td className="p-2.5 text-slate-300">R1</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-white font-bold">Player Pace Control / Jockey</td>
                        <td className="p-2.5 text-slate-300">LT</td>
                        <td className="p-2.5 text-slate-300">L1</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-white font-bold">Skill Moves</td>
                        <td className="p-2.5 text-slate-300">Right Analog Stick</td>
                        <td className="p-2.5 text-slate-300">Right Analog Stick</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card 3: Keyboard Controls & Guide */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                  <Keyboard className="w-5 h-5" />
                  <h4>⌨️ Keyboard &amp; Mouse Controls</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">MOVEMENT</span>
                    <span className="font-bold text-white">W / A / S / D or Arrows</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">SHORT PASS</span>
                    <span className="font-bold text-emerald-400">S (or Space)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">THROUGH BALL</span>
                    <span className="font-bold text-amber-400">W (or Key I)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">SHOOT</span>
                    <span className="font-bold text-rose-400">D (or Key K)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">LOB PASS / LONG BALL</span>
                    <span className="font-bold text-blue-400">A (or Key U)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">SPRINT</span>
                    <span className="font-bold text-yellow-400">E or Left Shift</span>
                  </div>
                </div>
              </div>

              {/* Card 4: How to Customize */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-cyan-800/60 space-y-2">
                <h4 className="font-bold text-white text-sm">🛠️ How to Customize Your Controls in FC 27:</h4>
                <ol className="list-decimal list-inside text-xs space-y-1 text-slate-300">
                  <li>Navigate to Settings (the gear icon ⚙️) or click Controls in the Dock.</li>
                  <li>Select Customize Controls.</li>
                  <li>Change the Control Scheme from Classic to Alternate (swaps Shoot and Cross buttons) or choose Custom to remap every single button.</li>
                  <li>Hit Save &amp; Apply Changes to store your setup.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="w-full bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
            {saveSuccessNotice && (
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Defaults restored!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                saveConfig(config);
                onClose();
              }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
