/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Globe,
  Shirt,
  Compass,
  GraduationCap,
  Trophy,
  HardDrive,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Eye,
  ChevronDown,
  ChevronUp,
  Activity,
  Flame,
  Pause,
  Award,
  Settings,
  Sliders,
  Crown,
  LayoutGrid,
  Download,
  Star,
  Shield,
  Briefcase,
} from 'lucide-react';
import { Match3DEngine } from './game/threeEngine.ts';
import { soundFX } from './game/soundFX.ts';
import { PSPHeldWrapper } from './components/PSPHeldWrapper.tsx';
import { ModeChooseHub } from './components/ModeChooseHub.tsx';
import { LeaguesModeHub } from './components/LeaguesModeHub.tsx';
import { CupsModeHub } from './components/CupsModeHub.tsx';
import { UCLModeHub } from './components/UCLModeHub.tsx';
import { UELModeHub } from './components/UELModeHub.tsx';
import { CAFModeHub } from './components/CAFModeHub.tsx';
import { CAFConfedModeHub } from './components/CAFConfedModeHub.tsx';
import { ManagerCareerHub } from './components/ManagerCareerHub.tsx';
import { DatabaseViewer } from './components/DatabaseViewer.tsx';
import { KitEditorStudio } from './components/KitEditorStudio.tsx';
import { TacticsBoard } from './components/TacticsBoard.tsx';
import { CareerYouthAcademy } from './components/CareerYouthAcademy.tsx';
import { EsportsTournamentsMods } from './components/EsportsTournamentsMods.tsx';
import { PatchExportStudio } from './components/PatchExportStudio.tsx';
import { DownloadGamePage } from './components/DownloadGamePage.tsx';
import { CustomizeControlsModal } from './components/CustomizeControlsModal.tsx';
import { Official2026Logo } from './components/Official2026Ball.tsx';
import { loadSavedConfig, saveConfig, ControllerMappingConfig } from './logic/controllerSettings.ts';

type AppView =
  | 'MODE_CHOOSE'
  | 'UCL'
  | 'UEL'
  | 'CAF'
  | 'CAF_CONFED'
  | 'MANAGER_CAREER'
  | 'LEAGUES'
  | 'CUPS'
  | 'MATCH_SIM'
  | 'DATABASE'
  | 'KITS'
  | 'TACTICS'
  | 'YOUTH_AI'
  | 'ESPORTS'
  | 'PATCH_EXPORT'
  | 'DOWNLOAD';

type GameState = 'title' | 'playing' | 'paused' | 'gameover';

export interface CustomMatchParams {
  homeTeamName: string;
  homeTeamColor: string;
  awayTeamName: string;
  awayTeamColor: string;
  homeTeamShort: string;
  awayTeamShort: string;
  stadiumName: string;
  tournamentName: string;
}

export default function App() {
  // When user opens the game, it opens in mode choose as requested
  const [gameState, setGameState] = useState<GameState>('playing');
  const [activeView, setActiveView] = useState<AppView>('MODE_CHOOSE');
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'TV' | 'PSP' | 'PLAYER' | 'TACTICAL'>('TV');
  const [isControlsModalOpen, setIsControlsModalOpen] = useState<boolean>(false);
  const [controllerConfig, setControllerConfig] = useState<ControllerMappingConfig>(() => loadSavedConfig());

  // Active custom match team configuration
  const [customMatchTeams, setCustomMatchTeams] = useState<CustomMatchParams>({
    homeTeamName: 'Al Ahly SC',
    homeTeamColor: '#C8102E',
    awayTeamName: 'Real Madrid CF',
    awayTeamColor: '#FFFFFF',
    homeTeamShort: 'AHL',
    awayTeamShort: 'RMA',
    stadiumName: 'Cairo International Stadium',
    tournamentName: 'Exhibition Friendly',
  });
  const [matchSessionId, setMatchSessionId] = useState<number>(1);

  // Match State
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [matchMinute, setMatchMinute] = useState<number>(0);
  const [powerFraction, setPowerFraction] = useState<number>(0);
  const [staminaFraction, setStaminaFraction] = useState<number>(1.0);
  const [possessionTeam, setPossessionTeam] = useState<'A' | 'B'>('A');
  const [possessionPlayer, setPossessionPlayer] = useState<string>('Striker');
  const [latestCommentary, setLatestCommentary] = useState<string>('Match ready for kick-off');
  const [radarData, setRadarData] = useState<{
    players: Array<{ x: number; z: number; team: 'A' | 'B'; isControlled: boolean }>;
    ball: { x: number; z: number };
  }>({ players: [], ball: { x: 0, z: 0 } });

  // Goal celebration banner
  const [goalAlert, setGoalAlert] = useState<string | null>(null);
  const [playStyleNotification, setPlayStyleNotification] = useState<string | null>(null);
  const [timedFinishNotification, setTimedFinishNotification] = useState<{ grade: string; label: string } | null>(null);

  // Canvas container reference
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Match3DEngine | null>(null);

  // Sync gameState with document.body.dataset.state for test compliance
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  // Handle ?autostart=1 query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setGameState('playing');
      setActiveView('MODE_CHOOSE');
    }
  }, []);

  // Title screen Enter / Space keyboard start handshake
  useEffect(() => {
    if (gameState !== 'title') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        setGameState('playing');
        setActiveView('MODE_CHOOSE');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  // Mount/Re-instantiate 3D Match Engine when playing in MATCH_SIM
  useEffect(() => {
    if (gameState === 'title' || activeView !== 'MATCH_SIM' || !canvasMountRef.current) {
      if (engineRef.current && activeView !== 'MATCH_SIM') {
        engineRef.current.destroy();
        engineRef.current = null;
      }
      return;
    }

    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = null;
    }

    const teamACol = customMatchTeams.homeTeamColor || '#C8102E';
    const teamBCol = customMatchTeams.awayTeamColor || '#FFFFFF';

    engineRef.current = new Match3DEngine(
      canvasMountRef.current,
      teamACol,
      teamBCol,
      {
        onScoreUpdate: (sA, sB, scorer) => {
          setScoreA(sA);
          setScoreB(sB);
          setGoalAlert(`GOAL! ${scorer} scored! (${sA} - ${sB})`);
          setTimeout(() => setGoalAlert(null), 4500);
        },
        onTimeUpdate: (min) => setMatchMinute(min),
        onPowerChange: (p) => setPowerFraction(p),
        onStaminaChange: (s) => setStaminaFraction(s),
        onPossessionChange: (team, pName) => {
          setPossessionTeam(team);
          setPossessionPlayer(pName);
        },
        onCommentary: (text) => {
          setLatestCommentary(text);
          soundFX.speakCommentary(text);
        },
        onRadarUpdate: (players, ball) => {
          setRadarData({ players, ball });
        },
        onTimedFinishFeedback: (grade, label) => {
          setTimedFinishNotification({ grade, label });
          setTimeout(() => setTimedFinishNotification(null), 2200);
        },
        onPlayStyleTrigger: (playStyleName) => {
          setPlayStyleNotification(playStyleName);
          setTimeout(() => setPlayStyleNotification(null), 2500);
        },
      }
    );

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [gameState, activeView, matchSessionId]);

  // Sync camera mode changes
  const handleCycleCamera = () => {
    const modes: Array<'TV' | 'PSP' | 'PLAYER' | 'TACTICAL'> = ['TV', 'PSP', 'PLAYER', 'TACTICAL'];
    const curIdx = modes.indexOf(cameraMode);
    const nextMode = modes[(curIdx + 1) % modes.length];
    setCameraMode(nextMode);
    if (engineRef.current) {
      engineRef.current.cameraMode = nextMode;
    }
  };

  // Launch a match with chosen teams from Leagues or Cups
  const handleLaunchMatch = (params: CustomMatchParams) => {
    setCustomMatchTeams(params);
    setScoreA(0);
    setScoreB(0);
    setMatchMinute(0);
    setMatchSessionId((prev) => prev + 1);
    setActiveView('MATCH_SIM');
    setGameState('playing');
  };

  // Controller Handlers (FC 27 & Classic PES)
  const handlePass = () => engineRef.current?.triggerPass();
  const handleThroughBall = () => engineRef.current?.triggerThroughBall();
  const handleLobCross = () => engineRef.current?.triggerLobCross();
  const handleShootStart = (isPowerShot: boolean = false) => engineRef.current?.startChargeShot(isPowerShot);
  const handleShootRelease = () => engineRef.current?.releaseShot();
  const handleTimedFinishTap = () => engineRef.current?.triggerTimedFinishingTap();
  const handleFinesseShot = () => engineRef.current?.triggerFinesseShot();
  const handleSprintToggle = (s: boolean) => {
    if (engineRef.current) engineRef.current.isSprinting = s;
  };
  const handleControlledSprintToggle = (active: boolean) => {
    if (engineRef.current) engineRef.current.isControlledSprinting = active;
  };
  const handleSwitchPlayer = () => engineRef.current?.switchControlledPlayer();
  const handleDirectionChange = (dir: { x: number; z: number }) => {
    if (engineRef.current) engineRef.current.inputVector = dir;
  };
  const handleTogglePause = () => {
    setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'));
  };

  return (
    <div className="relative w-screen h-screen bg-[#030d22] text-white overflow-hidden font-sans select-none">
      {/* =========================================================================
          SCREEN 1: TITLE SCREEN (Ultra Mode & Game Shell Craft)
      ========================================================================== */}
      {gameState === 'title' && (
        <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-12 z-50 bg-gradient-to-b from-[#061536] via-[#040f29] to-[#020713]">
          {/* Top Status & Platform Badges */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono font-bold tracking-widest text-white">
                PSP 2027 ENGINE • 211 FIFA NATIONS &amp; LEAGUES
              </span>
            </div>
            <div className="text-xs font-mono text-blue-200">
              BUILD 27.5.0 • MODE SELECT &amp; CUPS
            </div>
          </div>

          {/* Center Title Lockup & Emblem */}
          <div className="flex flex-col items-center justify-center text-center my-auto">
            {/* Official 2026 Logo (Triunfo Match Ball with Arabic & English Typography) */}
            <Official2026Logo ballSize={150} layout="vertical" className="mb-6" />

            {/* Typography Title Lockup */}
            <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md">
              PES &amp; eFootball Studio 2027
            </h1>
            <p className="text-sm sm:text-base font-semibold text-blue-100 tracking-wide mt-2 max-w-xl">
              Authentic PSP Handheld Match Simulator • UEFA Champions League &amp; Pyramids
            </p>
            <p className="text-xs text-blue-200 max-w-lg mt-1">
              UEFA Champions League (36-Team Mode) • World Cup 2026 • Euro 2024 • Copa América • CAF 2025 • Arab Cup
            </p>

            {/* Start CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
              <button
                data-start="true"
                onClick={() => {
                  setGameState('playing');
                  setActiveView('MODE_CHOOSE');
                }}
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all active:scale-95 cursor-pointer flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-black">
                  <Play className="w-4 h-4 text-black fill-black" />
                </div>
                <span>CHOOSE GAME MODE</span>
              </button>

              <button
                onClick={() => {
                  setGameState('playing');
                  setActiveView('UCL');
                }}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 hover:from-indigo-600 hover:to-blue-600 text-white font-black text-sm tracking-wider uppercase border border-cyan-400/80 shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all active:scale-95 cursor-pointer flex items-center gap-2.5"
                title="Play UEFA Champions League 36-Team Standalone Mode"
              >
                <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
                  <Star className="w-3.5 h-3.5 text-black fill-black" />
                </div>
                <span>CHAMPIONS LEAGUE ⭐</span>
              </button>

              <button
                onClick={() => {
                  setGameState('playing');
                  setActiveView('DOWNLOAD');
                }}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm tracking-wider uppercase border border-emerald-400/80 shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2.5"
                title="Download or Install the Game for Mobile, PC, or PPSSPP"
              >
                <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
                  <Download className="w-3.5 h-3.5 text-black" />
                </div>
                <span>DOWNLOAD 📥</span>
              </button>

              <button
                onClick={() => setIsControlsModalOpen(true)}
                className="px-6 py-4 rounded-2xl bg-[#091b40] hover:bg-blue-900 text-white font-bold text-sm tracking-wider uppercase border border-blue-700/80 shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2.5"
              >
                <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
                  <Settings className="w-3.5 h-3.5 text-black" />
                </div>
                <span>CONTROLS ⚙️</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-blue-300 mt-4">
              Press <kbd className="px-2 py-0.5 rounded bg-blue-900 text-white border border-blue-700">Enter</kbd> or <kbd className="px-2 py-0.5 rounded bg-blue-900 text-white border border-blue-700">Space</kbd> to Open Mode Choose
            </span>
          </div>

          {/* Bottom Clean Control Hints */}
          <div className="w-full flex flex-col items-center gap-1.5 text-center text-xs text-blue-200 font-mono border-t border-blue-900/80 pt-4">
            <div className="text-white flex flex-wrap items-center justify-center gap-2">
              <span><span className="text-cyan-300 font-bold">PSP &amp; Gamepad:</span> ✕ Pass · ◼ Shoot · ▲ Through Ball · ● Cross · R Sprint</span>
              <span className="text-blue-400">|</span>
              <span><span className="text-purple-300 font-bold">📱 Mobile Touch Mode:</span> 360° Virtual Joystick · Tap Pass · Double-Tap Power Shot</span>
              <span className="text-blue-400">|</span>
              <button
                onClick={() => {
                  setGameState('playing');
                  setActiveView('DOWNLOAD');
                }}
                className="text-emerald-400 hover:text-emerald-300 underline font-bold cursor-pointer inline-flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Install / Download Game</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 2: ACTIVE PLAYING / STUDIO VIEW
      ========================================================================== */}
      {gameState !== 'title' && (
        <div className="relative w-full h-full flex flex-col bg-[#030d22]">
          {/* Main Content Area based on activeView */}
          <div className="relative w-full flex-1 overflow-hidden">
            {/* VIEW 0: MODE CHOOSE HUB */}
            {activeView === 'MODE_CHOOSE' && (
              <ModeChooseHub
                onSelectLeagues={() => setActiveView('LEAGUES')}
                onSelectCups={() => setActiveView('CUPS')}
                onSelectQuickMatch={() => {
                  setScoreA(0);
                  setScoreB(0);
                  setMatchMinute(0);
                  setMatchSessionId((s) => s + 1);
                  setActiveView('MATCH_SIM');
                }}
                onSelectStudioTab={(tab) => setActiveView(tab)}
                onOpenControlsModal={() => setIsControlsModalOpen(true)}
                onSelectDownload={() => setActiveView('DOWNLOAD')}
                onSelectUCL={() => setActiveView('UCL')}
                onSelectUEL={() => setActiveView('UEL')}
                onSelectCAF={() => setActiveView('CAF')}
                onSelectCAFConfed={() => setActiveView('CAF_CONFED')}
                onSelectManagerCareer={() => setActiveView('MANAGER_CAREER')}
              />
            )}

            {/* VIEW: UEFA CHAMPIONS LEAGUE (Dedicated Standalone Mode) */}
            {activeView === 'UCL' && (
              <UCLModeHub
                onBackToModeChoose={() => setActiveView('MODE_CHOOSE')}
                onLaunchMatch={handleLaunchMatch}
              />
            )}

            {/* VIEW: UEFA EUROPA LEAGUE (Dedicated Standalone Mode) */}
            {activeView === 'UEL' && (
              <UELModeHub
                onBackToModeChoose={() => setActiveView('MODE_CHOOSE')}
                onLaunchMatch={handleLaunchMatch}
              />
            )}

            {/* VIEW: CAF CHAMPIONS LEAGUE (Dedicated Standalone Mode) */}
            {activeView === 'CAF' && (
              <CAFModeHub
                onBackToModeChoose={() => setActiveView('MODE_CHOOSE')}
                onLaunchMatch={handleLaunchMatch}
              />
            )}

            {/* VIEW: CAF CONFEDERATION CUP (Dedicated Standalone Mode) */}
            {activeView === 'CAF_CONFED' && (
              <CAFConfedModeHub
                onBackToModeChoose={() => setActiveView('MODE_CHOOSE')}
                onLaunchMatch={handleLaunchMatch}
              />
            )}

            {/* VIEW: MANAGER CAREER MODE (Dedicated Standalone Mode) */}
            {activeView === 'MANAGER_CAREER' && (
              <ManagerCareerHub
                onBackToModeChoose={() => setActiveView('MODE_CHOOSE')}
                onLaunchSpectatorMatch={handleLaunchMatch}
              />
            )}

            {/* VIEW 1: DOMESTIC LEAGUES MODE */}
            {activeView === 'LEAGUES' && (
              <LeaguesModeHub
                onBackToModeChoose={() => setActiveView('MODE_CHOOSE')}
                onLaunchMatch={handleLaunchMatch}
              />
            )}

            {/* VIEW 2: CHAMPIONSHIP CUPS MODE */}
            {activeView === 'CUPS' && (
              <CupsModeHub
                onBackToModeChoose={() => setActiveView('MODE_CHOOSE')}
                onLaunchMatch={handleLaunchMatch}
              />
            )}

            {/* VIEW 3: 3D MATCH SIMULATOR (with PSP Chassis) */}
            <div
              className={`w-full h-full ${activeView === 'MATCH_SIM' ? 'block' : 'hidden'}`}
            >
              <PSPHeldWrapper
                onPass={handlePass}
                onThroughBall={handleThroughBall}
                onLobCross={handleLobCross}
                onShootStart={handleShootStart}
                onShootRelease={handleShootRelease}
                onTimedFinishTap={handleTimedFinishTap}
                onFinesseShot={handleFinesseShot}
                onSprintToggle={handleSprintToggle}
                onControlledSprintToggle={handleControlledSprintToggle}
                onSwitchPlayer={handleSwitchPlayer}
                onDirectionChange={handleDirectionChange}
                onTogglePause={handleTogglePause}
                cameraMode={cameraMode}
                onCycleCamera={handleCycleCamera}
                playStyleNotification={playStyleNotification}
                timedFinishNotification={timedFinishNotification}
                controllerConfig={controllerConfig}
                onOpenCustomizeControls={() => setIsControlsModalOpen(true)}
                onOpenDownload={() => setActiveView('DOWNLOAD')}
              >
                {/* 3D WebGL Canvas Mount Container */}
                <div ref={canvasMountRef} className="w-full h-full relative" />

                {/* Scoreboard Overlay Top-Left */}
                <div className="absolute top-2 left-2 z-30 pointer-events-none flex items-center gap-2 bg-[#061536]/90 border border-blue-700/80 rounded-xl px-2.5 py-1 text-white shadow-xl">
                  {/* Team A */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white"
                      style={{ backgroundColor: customMatchTeams.homeTeamColor }}
                    />
                    <span className="text-[11px] font-black">{customMatchTeams.homeTeamShort}</span>
                    <span className="font-mono text-sm font-black text-cyan-300">{scoreA}</span>
                  </div>
                  <span className="text-blue-400 font-mono text-xs">-</span>
                  {/* Team B */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-black text-white">{scoreB}</span>
                    <span className="text-[11px] font-black">{customMatchTeams.awayTeamShort}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white"
                      style={{ backgroundColor: customMatchTeams.awayTeamColor }}
                    />
                  </div>

                  {/* Clock */}
                  <div className="border-l border-blue-700 pl-2 text-[11px] font-mono font-bold text-amber-300">
                    {matchMinute}&apos;
                  </div>
                </div>

                {/* Tournament Tag Top-Right */}
                <div className="absolute top-2 right-2 z-30 pointer-events-none flex items-center gap-2">
                  <div className="bg-[#061536]/90 border border-blue-700/80 rounded-xl px-3 py-1 text-white shadow-xl flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                      <Trophy className="w-2.5 h-2.5 text-black" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 truncate max-w-[180px]">
                      {customMatchTeams.tournamentName}
                    </span>
                  </div>
                </div>

                {/* Live Commentary & Possession Banner Top-Center */}
                <div className="absolute top-12 sm:top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none max-w-[280px] sm:max-w-sm w-full px-2 text-center">
                  <div className="bg-[#061536]/90 border border-blue-700/80 rounded-xl px-2.5 py-0.5 sm:py-1 text-white shadow-lg flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                    <span className="text-[11px] sm:text-xs font-semibold truncate text-white">{latestCommentary}</span>
                  </div>
                </div>

                {/* 2D Tactical Minimap Radar */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-36 h-24 bg-[#061536]/90 border border-blue-700/80 rounded-xl overflow-hidden shadow-lg p-1">
                  <div className="relative w-full h-full bg-[#0b381b]/95 rounded border border-white/20">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/40" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/40" />

                    {/* Ball Dot */}
                    <div
                      className="absolute w-1.5 h-1.5 rounded-full bg-white shadow -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${((radarData.ball.x + 24) / 48) * 100}%`,
                        top: `${((radarData.ball.z + 36) / 72) * 100}%`,
                      }}
                    />

                    {/* Players Dots */}
                    {radarData.players.map((p, idx) => (
                      <div
                        key={idx}
                        className={`absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 ${
                          p.isControlled
                            ? 'w-2 h-2 bg-yellow-300 ring-1 ring-white'
                            : p.team === 'A'
                            ? 'bg-rose-500'
                            : 'bg-white'
                        }`}
                        style={{
                          left: `${((p.x + 24) / 48) * 100}%`,
                          top: `${((p.z + 36) / 72) * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Shot Power & Stamina Meter Bottom-Left */}
                <div className="absolute bottom-3 left-3 z-30 pointer-events-none flex flex-col gap-1 w-32 bg-[#061536]/90 border border-blue-700/80 rounded-xl p-2 shadow-lg">
                  <div className="flex items-center justify-between text-[10px] text-white font-mono font-bold">
                    <span>STAMINA</span>
                    <span>{Math.round(staminaFraction * 100)}%</span>
                  </div>
                  <div className="w-full bg-blue-950 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-75"
                      style={{ width: `${staminaFraction * 100}%` }}
                    />
                  </div>

                  {powerFraction > 0 && (
                    <>
                      <div className="flex items-center justify-between text-[10px] text-cyan-300 font-mono font-bold mt-1">
                        <span>SHOT POWER</span>
                        <span>{Math.round(powerFraction * 100)}%</span>
                      </div>
                      <div className="w-full bg-blue-950 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                          style={{ width: `${powerFraction * 100}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Goal Celebration Alert Modal */}
                {goalAlert && (
                  <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center bg-black/40">
                    <div className="px-8 py-5 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white text-center font-black text-2xl sm:text-3xl tracking-wider shadow-[0_0_50px_rgba(37,99,235,0.8)] border-2 border-white/60">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Flame className="w-8 h-8 text-yellow-200 animate-bounce" />
                        <span>GOOOAL!</span>
                        <Flame className="w-8 h-8 text-yellow-200 animate-bounce" />
                      </div>
                      <div className="text-sm font-semibold opacity-95">{goalAlert}</div>
                    </div>
                  </div>
                )}
              </PSPHeldWrapper>
            </div>

            {/* VIEW 4: DATABASE VIEWER */}
            {activeView === 'DATABASE' && <DatabaseViewer />}

            {/* VIEW 5: KIT STUDIO & BATCH CONVERTER */}
            {activeView === 'KITS' && <KitEditorStudio />}

            {/* VIEW 6: TACTICS BOARD */}
            {activeView === 'TACTICS' && <TacticsBoard />}

            {/* VIEW 7: CAREER YOUTH ACADEMY & AI INJURY MODEL */}
            {activeView === 'YOUTH_AI' && <CareerYouthAcademy />}

            {/* VIEW 8: ESPORTS & MODDER COMMUNITY */}
            {activeView === 'ESPORTS' && <EsportsTournamentsMods />}

            {/* VIEW 9: PATCH EXPORTER & CLOUD SYNC */}
            {activeView === 'PATCH_EXPORT' && <PatchExportStudio />}

            {/* VIEW 10: DOWNLOAD GAME TO PLAY PAGE */}
            {activeView === 'DOWNLOAD' && (
              <DownloadGamePage
                onBackToHome={() => setActiveView('MODE_CHOOSE')}
                onLaunchInstantMatch={() => {
                  setScoreA(0);
                  setScoreB(0);
                  setMatchMinute(0);
                  setMatchSessionId((s) => s + 1);
                  setActiveView('MATCH_SIM');
                }}
                onOpenControls={() => setIsControlsModalOpen(true)}
              />
            )}
          </div>

          {/* =========================================================================
              COLLAPSIBLE BOTTOM DOCK (with background blue, icons black, font white)
          ========================================================================== */}
          <div
            className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 max-w-[96vw] w-auto ${
              isDockCollapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
            }`}
          >
            {/* Collapse / Expand Tab Handle */}
            <div className="flex justify-center -mb-px">
              <button
                onClick={() => setIsDockCollapsed(!isDockCollapsed)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-t-xl bg-[#061536] border-t border-x border-blue-700/80 text-[11px] font-mono text-cyan-300 hover:text-white shadow-md cursor-pointer"
              >
                {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{isDockCollapsed ? 'Show Navigation Dock' : 'Collapse Navigation Dock'}</span>
              </button>
            </div>

            {/* Dock Bar Container */}
            <div className="flex items-center gap-1.5 bg-[#061536]/95 border border-blue-700/80 rounded-2xl p-2 shadow-2xl overflow-x-auto max-w-full">
              {[
                { id: 'MODE_CHOOSE' as const, label: 'Mode Select', icon: LayoutGrid },
                { id: 'UCL' as const, label: 'Champions League', icon: Star },
                { id: 'UEL' as const, label: 'Europa League', icon: Trophy },
                { id: 'CAF' as const, label: 'CAF Champions League', icon: Shield },
                { id: 'CAF_CONFED' as const, label: 'Confederation Cup', icon: Flame },
                { id: 'MANAGER_CAREER' as const, label: 'Manager Career', icon: Briefcase },
                { id: 'LEAGUES' as const, label: 'Global Leagues Directory', icon: Globe },
                { id: 'CUPS' as const, label: 'Championship Cups', icon: Crown },
                { id: 'MATCH_SIM' as const, label: 'PSP Match Simulator', icon: Gamepad2 },
                { id: 'DOWNLOAD' as const, label: 'Download Game', icon: Download },
                { id: 'TACTICS' as const, label: 'Tactics Board', icon: Compass },
                { id: 'DATABASE' as const, label: '211 Nations DB', icon: Globe },
                { id: 'KITS' as const, label: 'Kit Studio', icon: Shirt },
                { id: 'YOUTH_AI' as const, label: 'Youth Academy', icon: GraduationCap },
                { id: 'PATCH_EXPORT' as const, label: 'Patch Exporter', icon: HardDrive },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setIsDockCollapsed(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg border border-cyan-400'
                        : 'bg-[#091b40] text-white hover:bg-blue-900 border border-blue-800'
                    }`}
                  >
                    {/* Black icon inside crisp white badge per prompt requirement */}
                    <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black shrink-0">
                      <Icon className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                    </div>
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Customize Controls button in Dock */}
              <button
                onClick={() => setIsControlsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer bg-[#091b40] text-white hover:bg-blue-900 border border-blue-800 shadow-sm"
                title="Configure Xbox, PlayStation, Mobile Touch Controls, and Keyboard"
              >
                <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black shrink-0">
                  <Settings className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                </div>
                <span>Controls ⚙️</span>
              </button>

              {/* Title Screen Return button */}
              <button
                onClick={() => setGameState('title')}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#091b40] text-blue-200 hover:text-white border border-blue-800 text-xs font-mono cursor-pointer ml-1"
                title="Return to Title Screen"
              >
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <RotateCcw className="w-3 h-3 text-black" />
                </div>
                <span className="hidden sm:inline">Title</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 3: PAUSE MODAL
      ========================================================================== */}
      {gameState === 'paused' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md bg-[#061536] border border-blue-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-center text-white">
            <div className="flex items-center justify-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black">
                <Pause className="w-4 h-4 text-black" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-wider text-white">MATCH PAUSED</h3>
            </div>

            {/* Score tile */}
            <div className="p-4 rounded-2xl bg-[#030d22] border border-blue-800 flex items-center justify-around">
              <div>
                <div className="text-xs text-blue-200 font-bold">{customMatchTeams.homeTeamName}</div>
                <div className="text-3xl font-black font-mono text-cyan-300">{scoreA}</div>
              </div>
              <div className="text-xs font-mono text-blue-300">
                {matchMinute}&apos; MIN
              </div>
              <div>
                <div className="text-xs text-blue-200 font-bold">{customMatchTeams.awayTeamName}</div>
                <div className="text-3xl font-black font-mono text-white">{scoreB}</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setGameState('playing')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow cursor-pointer"
              >
                Resume Match (Esc / P)
              </button>
              <button
                onClick={() => {
                  setScoreA(0);
                  setScoreB(0);
                  setMatchMinute(0);
                  setMatchSessionId((s) => s + 1);
                  setGameState('playing');
                }}
                className="w-full py-2.5 rounded-xl bg-[#091b40] hover:bg-blue-900 border border-blue-700 text-white font-semibold text-xs cursor-pointer"
              >
                Restart Match (R)
              </button>
              <button
                onClick={() => {
                  setGameState('playing');
                  setActiveView('MODE_CHOOSE');
                }}
                className="w-full py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-cyan-300 font-semibold text-xs cursor-pointer"
              >
                Exit to Mode Choose
              </button>
              <button
                onClick={() => setGameState('title')}
                className="w-full py-2.5 rounded-xl bg-[#030d22] hover:bg-blue-950 border border-blue-900 text-blue-300 hover:text-white font-semibold text-xs cursor-pointer"
              >
                Quit to Title Screen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 4: CUSTOMIZE CONTROLS MODAL
      ========================================================================== */}
      <CustomizeControlsModal
        isOpen={isControlsModalOpen}
        onClose={() => setIsControlsModalOpen(false)}
        config={controllerConfig}
        onConfigChange={(newCfg) => {
          setControllerConfig(newCfg);
          saveConfig(newCfg);
        }}
      />
    </div>
  );
}
