/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  User,
  Users,
  Trophy,
  Play,
  Zap,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Shield,
  Sliders,
  Sparkles,
  Check,
  Search,
  Eye,
  RefreshCw,
  Plus,
  Compass,
  TrendingUp,
  Activity,
  Award,
  Globe,
  SlidersHorizontal,
  Flame,
  Shirt,
} from 'lucide-react';
import type { ManagerProfile, ManagerCategory } from '../data/managersData.ts';
import { WORLD_CLASS_MANAGERS } from '../data/managersData.ts';
import type {
  CustomManagerCharacter,
  SquadPlayer,
  CareerClub,
  ManagerCareerState,
  CareerDifficulty,
  TacticalMentality,
  MatchSimulationResult,
  MatchEvent,
} from '../logic/managerCareerLogic.ts';
import {
  POPULAR_CAREER_CLUBS,
  generateInitialSquad,
  generateTransferMarketPool,
  simulateInstantMatch,
  swapSquadPlayers,
  buyPlayerFromMarket,
  createDefaultCustomManager,
} from '../logic/managerCareerLogic.ts';
import { ManagerCharacterCreator } from './ManagerCharacterCreator.tsx';

interface ManagerCareerHubProps {
  onBackToModeChoose: () => void;
  onLaunchSpectatorMatch: (params: {
    homeTeamName: string;
    homeTeamColor: string;
    awayTeamName: string;
    awayTeamColor: string;
    homeTeamShort: string;
    awayTeamShort: string;
    stadiumName: string;
    tournamentName: string;
  }) => void;
}

type CareerHubStep = 'CHOOSE_PATH' | 'SELECT_REAL_MANAGER' | 'CREATE_CUSTOM_MANAGER' | 'SETUP_CLUB_FINANCES' | 'ACTIVE_DASHBOARD';
type DashboardTab = 'MATCH_HUB' | 'SQUAD_HUB' | 'TRANSFERS' | 'STANDINGS' | 'OFFICE';

export const ManagerCareerHub: React.FC<ManagerCareerHubProps> = ({
  onBackToModeChoose,
  onLaunchSpectatorMatch,
}) => {
  // Flow navigation
  const [currentStep, setCurrentStep] = useState<CareerHubStep>('CHOOSE_PATH');
  const [selectedRealManager, setSelectedRealManager] = useState<ManagerProfile | null>(null);
  const [createdCustomManager, setCreatedCustomManager] = useState<CustomManagerCharacter | null>(null);

  // Manager filter & search state
  const [managerCategory, setManagerCategory] = useState<ManagerCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Club & Career Setup state
  const [selectedClub, setSelectedClub] = useState<CareerClub>(POPULAR_CAREER_CLUBS[0]);
  const [isCreatingCustomClub, setIsCreatingCustomClub] = useState<boolean>(false);
  const [customClubName, setCustomClubName] = useState<string>('Cairo Titans FC');
  const [customClubShort, setCustomClubShort] = useState<string>('CTI');
  const [customClubStadium, setCustomClubStadium] = useState<string>('Grand Sphinx Arena');
  const [customClubColor1, setCustomClubColor1] = useState<string>('#0284C7');
  const [customClubColor2, setCustomClubColor2] = useState<string>('#FFFFFF');
  const [customClubLeague, setCustomClubLeague] = useState<string>('Global Super League');

  // Finances & Difficulty
  const [chosenBudgetMillions, setChosenBudgetMillions] = useState<number>(85);
  const [chosenDifficulty, setChosenDifficulty] = useState<CareerDifficulty>('PROFESSIONAL');

  // Active Career Session State
  const [careerState, setCareerState] = useState<ManagerCareerState | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('MATCH_HUB');

  // Squad selection for swap
  const [selectedPlayerForSwap, setSelectedPlayerForSwap] = useState<string | null>(null);

  // Match Simulation & Live Watch state
  const [lastMatchResult, setLastMatchResult] = useState<MatchSimulationResult | null>(null);
  const [isWatchingLiveMatch, setIsWatchingLiveMatch] = useState<boolean>(false);
  const [liveMinute, setLiveMinute] = useState<number>(0);
  const [liveHomeScore, setLiveHomeScore] = useState<number>(0);
  const [liveAwayScore, setLiveAwayScore] = useState<number>(0);
  const [liveEvents, setLiveEvents] = useState<MatchEvent[]>([]);
  const [liveBallPos, setLiveBallPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [liveCommentary, setLiveCommentary] = useState<string>('The referee signals kick-off! Both squads battle for early dominance.');

  // Notification toast
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Filtered real managers
  const filteredManagers = WORLD_CLASS_MANAGERS.filter(m => {
    const matchesCategory = managerCategory === 'ALL' || m.category === managerCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.currentTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nationality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Start new career
  const handleLaunchCareer = () => {
    const finalClub: CareerClub = isCreatingCustomClub
      ? {
          id: 'custom_club_' + Date.now(),
          name: customClubName,
          shortName: customClubShort,
          country: 'Global',
          league: customClubLeague,
          stadiumName: customClubStadium,
          primaryColor: customClubColor1,
          secondaryColor: customClubColor2,
          isCustom: true,
        }
      : selectedClub;

    const squad = generateInitialSquad(finalClub.name, finalClub.primaryColor);
    const transferPool = generateTransferMarketPool();

    const newCareer: ManagerCareerState = {
      id: 'career_' + Date.now(),
      managerType: selectedRealManager ? 'REAL' : 'CUSTOM',
      realManager: selectedRealManager || undefined,
      customManager: createdCustomManager || undefined,
      club: finalClub,
      transferBudgetMillions: chosenBudgetMillions,
      wageBudgetWeeklyK: Math.round(chosenBudgetMillions * 3.2),
      difficulty: chosenDifficulty,
      boardConfidence: 85,
      mentality: 'BALANCED',
      formation: selectedRealManager?.preferredFormation as any || '4-3-3',
      seasonStats: {
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
      },
      squad,
      transferMarket: transferPool,
    };

    setCareerState(newCareer);
    setCurrentStep('ACTIVE_DASHBOARD');
    showNotification(`Welcome, Boss! You have officially taken charge of ${finalClub.name}!`);
  };

  // Handle Instant Simulator
  const handleInstantSimulate = () => {
    if (!careerState) return;
    const opponent = 'Bordeaux Athletic';
    const result = simulateInstantMatch(careerState, opponent, 81);
    setLastMatchResult(result);

    // Update career stats
    const isWin = result.homeScore > result.awayScore;
    const isDraw = result.homeScore === result.awayScore;
    const pointsGained = isWin ? 3 : isDraw ? 1 : 0;

    setCareerState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        boardConfidence: Math.min(100, Math.max(10, prev.boardConfidence + result.boardConfidenceChange)),
        transferBudgetMillions: Math.round((prev.transferBudgetMillions + result.financialPrizeK / 1000) * 10) / 10,
        seasonStats: {
          matchesPlayed: prev.seasonStats.matchesPlayed + 1,
          wins: prev.seasonStats.wins + (isWin ? 1 : 0),
          draws: prev.seasonStats.draws + (isDraw ? 1 : 0),
          losses: prev.seasonStats.losses + (!isWin && !isDraw ? 1 : 0),
          goalsFor: prev.seasonStats.goalsFor + result.homeScore,
          goalsAgainst: prev.seasonStats.goalsAgainst + result.awayScore,
          points: prev.seasonStats.points + pointsGained,
        },
      };
    });

    showNotification(`Instant Match Result: ${result.homeTeamName} ${result.homeScore} - ${result.awayScore} ${result.awayTeamName}`);
  };

  // Start "Watch Team Play (Coach Sideline Mode)"
  const handleStartWatchTeamPlay = () => {
    setIsWatchingLiveMatch(true);
    setLiveMinute(0);
    setLiveHomeScore(0);
    setLiveAwayScore(0);
    setLiveEvents([]);
    setLiveCommentary(`Kick-off at ${careerState?.club.stadiumName}! Manager watching intensely from the dugout.`);
  };

  // Live match ticker interval
  useEffect(() => {
    if (!isWatchingLiveMatch || !careerState) return;

    const interval = setInterval(() => {
      setLiveMinute(prevMin => {
        if (prevMin >= 90) {
          clearInterval(interval);
          setIsWatchingLiveMatch(false);

          // Update final season stats
          const win = liveHomeScore > liveAwayScore;
          const draw = liveHomeScore === liveAwayScore;
          const pts = win ? 3 : draw ? 1 : 0;
          setCareerState(s => {
            if (!s) return null;
            return {
              ...s,
              boardConfidence: Math.min(100, Math.max(10, s.boardConfidence + (win ? 3 : draw ? 0 : -3))),
              seasonStats: {
                matchesPlayed: s.seasonStats.matchesPlayed + 1,
                wins: s.seasonStats.wins + (win ? 1 : 0),
                draws: s.seasonStats.draws + (draw ? 1 : 0),
                losses: s.seasonStats.losses + (!win && !draw ? 1 : 0),
                goalsFor: s.seasonStats.goalsFor + liveHomeScore,
                goalsAgainst: s.seasonStats.goalsAgainst + liveAwayScore,
                points: s.seasonStats.points + pts,
              },
            };
          });

          showNotification(`Full Time: Match concluded! Result recorded.`);
          return 90;
        }

        const nextMin = prevMin + 5;

        // Animate tactical 2D ball
        setLiveBallPos({
          x: Math.min(92, Math.max(8, 50 + (Math.random() * 60 - 30))),
          y: Math.min(88, Math.max(12, 50 + (Math.random() * 60 - 30))),
        });

        // Chance of goal or big event
        const homeProb = careerState.mentality === 'ALL_OUT_ATTACK' ? 0.22 : 0.14;
        const awayProb = careerState.mentality === 'ULTRA_DEFENSIVE' ? 0.06 : 0.12;

        if (Math.random() < homeProb) {
          setLiveHomeScore(s => s + 1);
          const scorer = careerState.squad.find(p => p.isStarting && ['ST', 'RW', 'LW', 'CAM'].includes(p.position))?.name || 'Striker';
          setLiveEvents(ev => [
            ...ev,
            {
              minute: nextMin,
              type: 'GOAL',
              team: 'HOME',
              playerName: scorer,
              detail: `GOAL! ${scorer} blasts home into the roof of the net!`,
            },
          ]);
          setLiveCommentary(`${nextMin}' GOAL for ${careerState.club.name}! Celebrations erupt along the technical area.`);
        } else if (Math.random() < awayProb) {
          setLiveAwayScore(s => s + 1);
          setLiveEvents(ev => [
            ...ev,
            {
              minute: nextMin,
              type: 'GOAL',
              team: 'AWAY',
              playerName: 'Opponent Striker',
              detail: 'Opponent capitalizes on defensive hesitation.',
            },
          ]);
          setLiveCommentary(`${nextMin}' Goal conceded. Manager shouts instructions from the touchline.`);
        } else if (Math.random() < 0.2) {
          setLiveCommentary(`${nextMin}' Dangerous cross cleared away by your center backs.`);
        } else {
          setLiveCommentary(`${nextMin}' Methodical midfield circulation. Maintaining possession shape.`);
        }

        return nextMin;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isWatchingLiveMatch, careerState, liveHomeScore, liveAwayScore]);

  // Handle player swap in Squad Hub
  const handlePlayerClick = (playerId: string) => {
    if (!careerState) return;

    if (!selectedPlayerForSwap) {
      setSelectedPlayerForSwap(playerId);
      showNotification('Player selected. Now click another player to swap starting status or position.');
    } else {
      if (selectedPlayerForSwap === playerId) {
        setSelectedPlayerForSwap(null);
      } else {
        const updated = swapSquadPlayers(careerState.squad, selectedPlayerForSwap, playerId);
        setCareerState({
          ...careerState,
          squad: updated,
        });
        setSelectedPlayerForSwap(null);
        showNotification('Squad lineup successfully updated!');
      }
    }
  };

  // Handle transfer market purchase
  const handleBuyPlayer = (playerId: string) => {
    if (!careerState) return;
    const res = buyPlayerFromMarket(careerState, playerId);
    if (res.success) {
      setCareerState(res.newState);
      showNotification(`Official Signing Confirmed! Player added to your Squad Hub.`);
    } else {
      showNotification(`Transfer Alert: ${res.error}`);
    }
  };

  // =========================================================================
  // RENDER: CHARACTER CREATOR STUDIO
  // =========================================================================
  if (currentStep === 'CREATE_CUSTOM_MANAGER') {
    return (
      <ManagerCharacterCreator
        onConfirm={(char: CustomManagerCharacter) => {
          setCreatedCustomManager(char);
          setSelectedRealManager(null);
          setCurrentStep('SETUP_CLUB_FINANCES');
        }}
        onCancel={() => setCurrentStep('CHOOSE_PATH')}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#03091e] text-white flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-cyan-500 text-black font-black text-xs shadow-2xl flex items-center gap-2 border border-white/50 animate-bounce">
          <Sparkles className="w-4 h-4 fill-black" />
          <span>{notification}</span>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: CHOOSE MANAGER PATH (REAL VS NEW CUSTOM MANAGER)
      ========================================================================== */}
      {currentStep === 'CHOOSE_PATH' && (
        <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={onBackToModeChoose}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-300 text-xs font-bold border border-blue-800 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Modes</span>
            </button>
            <div className="px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold">
              FC 27 CAREER EXPANSION
            </div>
          </div>

          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/60 border border-blue-600/80 text-cyan-300 text-xs font-mono font-bold mb-3 shadow-lg">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>OFFICIAL MANAGER CAREER MODE • وضع المهنة التدريبية</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              Choose Your Managerial Path
            </h1>
            <p className="text-sm sm:text-base text-blue-200 mt-2 max-w-2xl mx-auto">
              Step into the technical area. Take charge of world football as one of the 32 greatest managers on Earth, or sculpt your own custom coaching avatar with complete skeletal, muscular, and tactical customization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* CARD 1: REAL WORLD-CLASS MANAGERS */}
            <div
              onClick={() => setCurrentStep('SELECT_REAL_MANAGER')}
              className="group relative bg-gradient-to-br from-[#06183e] via-[#04102c] to-[#020718] hover:from-[#0a235c] hover:to-[#04143a] border-2 border-blue-600 hover:border-cyan-400 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden ring-1 ring-blue-500/30"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/25 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-black shadow-xl">
                    <Trophy className="w-8 h-8 text-black fill-black" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-blue-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/50">
                    32 ELITE MANAGERS
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-300 transition-colors uppercase">
                  World-Class Manager
                </h3>
                <p className="text-xs sm:text-sm text-blue-200 mt-2 leading-relaxed">
                  Choose from 32 iconic tacticians across club football, national teams, and legendary free agents.
                </p>

                <div className="mt-5 flex flex-col gap-2.5 text-xs text-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                      <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                    </div>
                    <span><strong className="text-white">Elite Club Bosses:</strong> Ancelotti, Guardiola, Arteta, Flick, Inzaghi, Amorim, Mourinho</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                      <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                    </div>
                    <span><strong className="text-white">National Giants:</strong> Scaloni, De la Fuente, Deschamps, Tuchel, Nagelsmann, Bielsa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                      <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                    </div>
                    <span><strong className="text-white">Legendary Masters:</strong> Zinedine Zidane, Jurgen Klopp, Massimiliano Allegri</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-blue-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 font-bold">SELECT REAL MANAGER</span>
                <div className="flex items-center gap-2 text-xs font-black text-white group-hover:text-cyan-300">
                  <span>ENTER ROSTER</span>
                  <div className="w-7 h-7 rounded-lg bg-cyan-400 flex items-center justify-center text-black">
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: CREATE NEW CUSTOM MANAGER */}
            <div
              onClick={() => setCurrentStep('CREATE_CUSTOM_MANAGER')}
              className="group relative bg-gradient-to-br from-[#130630] via-[#0e0422] to-[#060212] hover:from-[#1e0a4a] hover:to-[#10032b] border-2 border-purple-500 hover:border-pink-400 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden ring-1 ring-purple-500/30"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/30 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-black shadow-xl">
                    <User className="w-8 h-8 text-black" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-purple-950 text-pink-300 font-mono text-xs font-bold border border-purple-500/50">
                    AVATAR STUDIO
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-pink-300 transition-colors uppercase">
                  Create New Manager
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 mt-2 leading-relaxed">
                  Forge your own coaching legend with full facial sculpture, skeleton physique, muscular build, tall/short stature, and tactical perk trees.
                </p>

                <div className="mt-5 flex flex-col gap-2.5 text-xs text-purple-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                      <Sliders className="w-2.5 h-2.5 text-black stroke-[3]" />
                    </div>
                    <span><strong className="text-white">Skeleton &amp; Physique:</strong> Slender, athletic, muscular, or stocky body builds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                      <Sliders className="w-2.5 h-2.5 text-black stroke-[3]" />
                    </div>
                    <span><strong className="text-white">Height &amp; Arm Reach:</strong> 160 cm to 205 cm tall/short slider + arms wingspan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                      <Sliders className="w-2.5 h-2.5 text-black stroke-[3]" />
                    </div>
                    <span><strong className="text-white">Facial Features:</strong> Nose types, eye colors, hairstyles, beards, and suits</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-purple-900/80 flex items-center justify-between">
                <span className="text-xs font-mono text-pink-300 font-bold">CUSTOMIZE CHARACTER</span>
                <div className="flex items-center gap-2 text-xs font-black text-white group-hover:text-pink-300">
                  <span>LAUNCH STUDIO</span>
                  <div className="w-7 h-7 rounded-lg bg-pink-500 flex items-center justify-center text-black">
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: SELECT REAL WORLD-CLASS MANAGER (Curated Roster of 32)
      ========================================================================== */}
      {currentStep === 'SELECT_REAL_MANAGER' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
          {/* Top Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#051336]/80 p-4 rounded-3xl border border-blue-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentStep('CHOOSE_PATH')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-300 text-xs font-bold border border-blue-800 transition cursor-pointer"
              >
                ← Back
              </button>
              <div>
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-cyan-400" />
                  <span>World-Class Football Managers ({filteredManagers.length}/32)</span>
                </h2>
                <p className="text-xs text-blue-300">
                  Select an elite manager to take over any club or national powerhouse
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search manager, club, nation..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#030d22] border border-blue-700 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'ALL' as const, label: 'All 32 World Managers' },
              { id: 'ELITE_CLUB' as const, label: 'Elite Club Managers (17)' },
              { id: 'NATIONAL_TEAM' as const, label: 'National Team Bosses (12)' },
              { id: 'LEGENDARY' as const, label: 'Legendary Icons (3)' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setManagerCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  managerCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md border border-cyan-400'
                    : 'bg-[#061536] text-blue-300 hover:text-white border border-blue-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Managers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredManagers.map(mgr => (
              <div
                key={mgr.id}
                onClick={() => {
                  setSelectedRealManager(mgr);
                  setCreatedCustomManager(null);
                  setCurrentStep('SETUP_CLUB_FINANCES');
                }}
                className="group relative bg-[#06163a]/90 hover:bg-[#0a235c] border border-blue-800/80 hover:border-cyan-400 rounded-3xl p-5 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-white/20 font-black"
                        style={{ backgroundColor: mgr.portraitAccent }}
                      >
                        {mgr.flag}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                          {mgr.name}
                        </h3>
                        <div className="text-xs text-blue-200 font-semibold flex items-center gap-1.5">
                          <span>{mgr.currentTeam}</span>
                          <span>•</span>
                          <span>{mgr.nationality}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-blue-950 border border-blue-700 text-cyan-300 font-mono text-xs font-bold">
                      OVR {mgr.reputation}
                    </span>
                  </div>

                  {/* Achievements Pill */}
                  <div className="p-2.5 rounded-xl bg-[#030d22] border border-blue-900/60 mb-3">
                    <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold mb-0.5">
                      Key Achievements &amp; Legacy
                    </div>
                    <p className="text-xs text-blue-100 line-clamp-2 leading-relaxed">
                      {mgr.achievements}
                    </p>
                  </div>

                  {/* Tactical Style & Specialty */}
                  <div className="flex flex-col gap-1 text-[11px] text-blue-200">
                    <div>
                      <strong className="text-white">Tactical Style:</strong> {mgr.tacticalStyle}
                    </div>
                    <div>
                      <strong className="text-white">Coaching Specialty:</strong> {mgr.coachingSpecialty}
                    </div>
                    <div>
                      <strong className="text-white">Formation:</strong> {mgr.preferredFormation}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-800/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-blue-300">Click to Select</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:text-white">
                    <span>Choose Manager</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: SETUP CLUB, TRANSFER MONEY & DIFFICULTY
      ========================================================================== */}
      {currentStep === 'SETUP_CLUB_FINANCES' && (
        <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center gap-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(selectedRealManager ? 'SELECT_REAL_MANAGER' : 'CHOOSE_PATH')}
              className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-300 text-xs font-bold border border-blue-800 transition cursor-pointer"
            >
              ← Back
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-300">Appointed Manager:</span>
              <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold text-xs">
                {selectedRealManager?.name || createdCustomManager?.name}
              </span>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Select Club &amp; Career Settings
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-1">
              Choose an existing giant or create a custom club • Configure transfer money &amp; match difficulty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Club Selection (Existing or Create Custom) */}
            <div className="p-5 rounded-3xl bg-[#06163a]/90 border border-blue-800 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-blue-300 font-bold">
                  Club Assignment
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsCreatingCustomClub(false)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      !isCreatingCustomClub
                        ? 'bg-blue-600 text-white border-cyan-400'
                        : 'bg-[#030d22] text-blue-300 border-blue-800'
                    }`}
                  >
                    Existing Club
                  </button>
                  <button
                    onClick={() => setIsCreatingCustomClub(true)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      isCreatingCustomClub
                        ? 'bg-blue-600 text-white border-cyan-400'
                        : 'bg-[#030d22] text-blue-300 border-blue-800'
                    }`}
                  >
                    + Custom Club
                  </button>
                </div>
              </div>

              {!isCreatingCustomClub ? (
                <div>
                  <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                    Select From Global Leagues &amp; African Giants
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {POPULAR_CAREER_CLUBS.map(club => (
                      <button
                        key={club.id}
                        onClick={() => setSelectedClub(club)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                          selectedClub.id === club.id
                            ? 'bg-blue-600 text-white border-cyan-400 shadow-md'
                            : 'bg-[#030d22] text-blue-200 border-blue-800 hover:bg-blue-900/60'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full shrink-0 border border-white/50"
                          style={{ backgroundColor: club.primaryColor }}
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold truncate">{club.name}</div>
                          <div className="text-[10px] text-blue-300 truncate">{club.league}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-blue-300 uppercase mb-1">Club Name</label>
                    <input
                      type="text"
                      value={customClubName}
                      onChange={e => setCustomClubName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#030d22] border border-blue-700 text-white text-xs font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-mono text-blue-300 uppercase mb-1">Short Badge (3 Letters)</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={customClubShort}
                        onChange={e => setCustomClubShort(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 rounded-xl bg-[#030d22] border border-blue-700 text-white text-xs font-bold uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-blue-300 uppercase mb-1">League</label>
                      <input
                        type="text"
                        value={customClubLeague}
                        onChange={e => setCustomClubLeague(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#030d22] border border-blue-700 text-white text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-blue-300 uppercase mb-1">Home Stadium</label>
                    <input
                      type="text"
                      value={customClubStadium}
                      onChange={e => setCustomClubStadium(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#030d22] border border-blue-700 text-white text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Transfer Money & Match Difficulty */}
            <div className="p-5 rounded-3xl bg-[#06163a]/90 border border-blue-800 flex flex-col justify-between gap-5 shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-blue-300 font-bold uppercase flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Starting Transfer Budget</span>
                  </label>
                  <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-black">
                    ${chosenBudgetMillions} Million
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="500"
                  step="5"
                  value={chosenBudgetMillions}
                  onChange={e => setChosenBudgetMillions(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-blue-400 font-mono mt-1">
                  <span>$15M (Modest)</span>
                  <span>$85M (Balanced)</span>
                  <span>$250M (Elite)</span>
                  <span>$500M (Tycoon)</span>
                </div>
              </div>

              {/* Match Difficulty */}
              <div>
                <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Match &amp; AI Difficulty</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['SEMI_PRO', 'PROFESSIONAL', 'WORLD_CLASS', 'LEGENDARY'] as CareerDifficulty[]).map(d => (
                    <button
                      key={d}
                      onClick={() => setChosenDifficulty(d)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                        chosenDifficulty === d
                          ? 'bg-blue-600 text-white border-cyan-400 shadow-md'
                          : 'bg-[#030d22] text-blue-300 border-blue-800 hover:bg-blue-900/60'
                      }`}
                    >
                      {d.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Launch CTA */}
              <button
                onClick={handleLaunchCareer}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-black text-black" />
                <span>Launch Manager Career</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: ACTIVE CAREER DASHBOARD (Squad Hub, Match Simulator & Live Watch)
      ========================================================================== */}
      {currentStep === 'ACTIVE_DASHBOARD' && careerState && (
        <div className="flex-1 flex flex-col">
          {/* Top Office Header */}
          <div className="bg-[#051336]/90 backdrop-blur-md border-b border-blue-900 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentStep('CHOOSE_PATH')}
                className="px-3 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-300 text-xs font-bold border border-blue-800 transition cursor-pointer"
              >
                ← Career Home
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black text-white">{careerState.club.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-950 text-cyan-300 font-mono text-[10px] font-bold border border-blue-700">
                    {careerState.club.league}
                  </span>
                </div>
                <div className="text-xs text-blue-300 flex items-center gap-2">
                  <span>Manager: <strong>{careerState.realManager?.name || careerState.customManager?.name}</strong></span>
                  <span>•</span>
                  <span>Board Confidence: <strong className="text-emerald-400">{careerState.boardConfidence}%</strong></span>
                </div>
              </div>
            </div>

            {/* Financial Summary & Record */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-[#030d22] border border-blue-800 text-right">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Transfer Funds</div>
                <div className="text-xs font-mono font-black text-white">${careerState.transferBudgetMillions.toFixed(1)}M</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#030d22] border border-blue-800 text-right">
                <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Record (W-D-L)</div>
                <div className="text-xs font-mono font-black text-white">
                  {careerState.seasonStats.wins}-{careerState.seasonStats.draws}-{careerState.seasonStats.losses} ({careerState.seasonStats.points} pts)
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'MATCH_HUB' as const, label: 'Match Day & Simulation', icon: Play },
              { id: 'SQUAD_HUB' as const, label: 'Squad Hub & Lineup', icon: Users },
              { id: 'TRANSFERS' as const, label: 'Transfer Market & Scouting', icon: DollarSign },
              { id: 'STANDINGS' as const, label: 'League Table & Fixtures', icon: Trophy },
              { id: 'OFFICE' as const, label: 'Manager Office & Bio', icon: Briefcase },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg border border-cyan-400'
                      : 'bg-[#061536] text-blue-300 hover:text-white border border-blue-800 hover:bg-blue-900/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* DASHBOARD TAB 1: MATCH DAY & SIMULATION */}
          {activeTab === 'MATCH_HUB' && (
            <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Upcoming Match Card & Controls */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-5 rounded-3xl bg-[#06163a]/90 border border-blue-800 flex flex-col gap-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-cyan-400 font-bold">Upcoming Fixture</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[11px] font-mono">
                      Matchday {careerState.seasonStats.matchesPlayed + 1}
                    </span>
                  </div>

                  {/* Matchup Header */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#030d22] border border-blue-900">
                    <div className="text-center w-5/12">
                      <div className="w-10 h-10 rounded-xl mx-auto mb-1 flex items-center justify-center font-black text-sm" style={{ backgroundColor: careerState.club.primaryColor, color: careerState.club.secondaryColor }}>
                        {careerState.club.shortName}
                      </div>
                      <div className="text-xs font-bold truncate text-white">{careerState.club.name}</div>
                      <div className="text-[10px] text-cyan-300 font-mono">Home</div>
                    </div>

                    <div className="text-center font-mono font-black text-blue-300 text-sm">VS</div>

                    <div className="text-center w-5/12">
                      <div className="w-10 h-10 rounded-xl mx-auto mb-1 flex items-center justify-center font-black text-sm bg-red-600 text-white">
                        BOR
                      </div>
                      <div className="text-xs font-bold truncate text-white">Bordeaux Athletic</div>
                      <div className="text-[10px] text-red-300 font-mono">Away</div>
                    </div>
                  </div>

                  {/* Tactical Mentality Slider / Selector */}
                  <div>
                    <label className="block text-xs font-mono text-blue-300 font-bold uppercase mb-2">
                      Tactical Mentality
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {(['ULTRA_DEFENSIVE', 'DEFENSIVE', 'BALANCED', 'ATTACKING', 'ALL_OUT_ATTACK'] as TacticalMentality[]).map(m => (
                        <button
                          key={m}
                          onClick={() => setCareerState({ ...careerState, mentality: m })}
                          className={`py-1.5 px-1 rounded-xl text-[10px] font-bold text-center transition cursor-pointer truncate ${
                            careerState.mentality === m
                              ? 'bg-blue-600 text-white border border-cyan-400 shadow'
                              : 'bg-[#030d22] text-blue-300 border border-blue-900 hover:bg-blue-900/60'
                          }`}
                        >
                          {m === 'ULTRA_DEFENSIVE' ? 'Park Bus' : m === 'DEFENSIVE' ? 'Defensive' : m === 'BALANCED' ? 'Balanced' : m === 'ATTACKING' ? 'Attacking' : 'All Out'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* TWO MATCH OPTIONS AS REQUESTED BY USER */}
                  <div className="flex flex-col gap-2.5 pt-2">
                    {/* OPTION 1: INSTANT SIMULATOR (محاكي فوري) */}
                    <button
                      onClick={handleInstantSimulate}
                      disabled={isWatchingLiveMatch}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 text-cyan-300" />
                      <span>Instant Simulator (محاكي فوري)</span>
                    </button>

                    {/* OPTION 2: WATCH TEAM PLAY (COACH MODE) */}
                    <button
                      onClick={handleStartWatchTeamPlay}
                      disabled={isWatchingLiveMatch}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 fill-black text-black" />
                      <span>Watch Team Play (Coach Sideline Mode)</span>
                    </button>

                    {/* OPTION 3: 3D MATCH SIMULATOR (AI vs AI) */}
                    <button
                      onClick={() =>
                        onLaunchSpectatorMatch({
                          homeTeamName: careerState.club.name,
                          homeTeamColor: careerState.club.primaryColor,
                          awayTeamName: 'Bordeaux Athletic',
                          awayTeamColor: '#B91C1C',
                          homeTeamShort: careerState.club.shortName,
                          awayTeamShort: 'BOR',
                          stadiumName: careerState.club.stadiumName,
                          tournamentName: careerState.club.league,
                        })
                      }
                      className="w-full py-2.5 rounded-xl bg-[#091b40] hover:bg-blue-900 border border-blue-700 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Launch 3D PSP Simulator (Spectator Mode)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Match Simulation Viewport or Result Summary */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {isWatchingLiveMatch ? (
                  /* LIVE COACH SIDELINE VIEWPORT */
                  <div className="p-6 rounded-3xl bg-[#06163a]/95 border-2 border-emerald-500/80 shadow-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-blue-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-xs font-mono uppercase font-black text-emerald-400">
                          LIVE COACH BROADCAST • {liveMinute}&apos; MIN
                        </span>
                      </div>
                      <div className="text-2xl font-black font-mono text-white">
                        {careerState.club.shortName} <span className="text-cyan-300">{liveHomeScore}</span> - <span className="text-red-400">{liveAwayScore}</span> BOR
                      </div>
                    </div>

                    {/* 2D Mini Pitch Radar */}
                    <div className="relative w-full h-48 rounded-2xl bg-gradient-to-b from-[#1b5e20] to-[#0d3b13] border-2 border-white/30 overflow-hidden flex items-center justify-center shadow-inner">
                      {/* Pitch markings */}
                      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/40" />
                      <div className="w-20 h-20 rounded-full border-2 border-white/40 absolute" />
                      <div className="w-28 h-12 border-2 border-t-0 border-white/40 absolute top-0" />
                      <div className="w-28 h-12 border-2 border-b-0 border-white/40 absolute bottom-0" />

                      {/* Animated 2D Ball */}
                      <div
                        className="absolute w-3.5 h-3.5 rounded-full bg-yellow-300 shadow-[0_0_8px_#fde047] transition-all duration-700 ease-out z-20"
                        style={{ left: `${liveBallPos.x}%`, top: `${liveBallPos.y}%` }}
                      />

                      {/* Home team player dots */}
                      <div className="absolute left-[30%] top-[45%] w-3 h-3 rounded-full bg-cyan-400 border border-white" />
                      <div className="absolute left-[50%] top-[30%] w-3 h-3 rounded-full bg-cyan-400 border border-white" />
                      <div className="absolute left-[65%] top-[55%] w-3 h-3 rounded-full bg-cyan-400 border border-white" />

                      {/* Away team player dots */}
                      <div className="absolute left-[35%] top-[55%] w-3 h-3 rounded-full bg-red-500 border border-white" />
                      <div className="absolute left-[48%] top-[70%] w-3 h-3 rounded-full bg-red-500 border border-white" />
                    </div>

                    {/* Live Commentary Feed */}
                    <div className="p-3.5 rounded-2xl bg-[#030d22] border border-blue-900 text-xs font-semibold text-blue-100 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{liveCommentary}</span>
                    </div>

                    {/* Live Event Ticker */}
                    <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                      {liveEvents.map((ev, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold ${
                            ev.team === 'HOME' ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-800' : 'bg-red-950/80 text-red-200 border border-red-800'
                          }`}
                        >
                          <span className="font-mono font-black">{ev.minute}&apos;</span>
                          <span className="font-bold">{ev.detail}</span>
                          <span className="text-[10px] uppercase font-mono">{ev.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : lastMatchResult ? (
                  /* POST-MATCH RESULT CARD */
                  <div className="p-6 rounded-3xl bg-[#06163a]/90 border border-blue-800 shadow-xl flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-blue-800 pb-3">
                      <span className="text-xs font-mono uppercase text-cyan-400 font-bold">Latest Match Summary</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        Prize: +${lastMatchResult.financialPrizeK}K
                      </span>
                    </div>

                    {/* Score Banner */}
                    <div className="flex items-center justify-around p-4 rounded-2xl bg-[#030d22] border border-blue-900 text-center">
                      <div>
                        <div className="text-sm font-bold text-white">{lastMatchResult.homeTeamName}</div>
                        <div className="text-3xl font-black font-mono text-cyan-300">{lastMatchResult.homeScore}</div>
                        <div className="text-[10px] text-blue-300 font-mono">{lastMatchResult.homeShots} Shots ({lastMatchResult.homePossession}%)</div>
                      </div>
                      <div className="text-xs font-mono text-blue-400 uppercase">FINAL</div>
                      <div>
                        <div className="text-sm font-bold text-white">{lastMatchResult.awayTeamName}</div>
                        <div className="text-3xl font-black font-mono text-white">{lastMatchResult.awayScore}</div>
                        <div className="text-[10px] text-blue-300 font-mono">{lastMatchResult.awayShots} Shots ({lastMatchResult.awayPossession}%)</div>
                      </div>
                    </div>

                    {/* Man of the Match */}
                    <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-600/50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-amber-200">Man of the Match:</span>
                        <span className="font-black text-white">{lastMatchResult.manOfTheMatch}</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-300">Rating: 9.4</span>
                    </div>

                    {/* Goal Events Timeline */}
                    <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                      {lastMatchResult.events.map((ev, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#030d22] border border-blue-900 text-xs"
                        >
                          <span className="font-mono text-cyan-300 font-bold">{ev.minute}&apos;</span>
                          <span className="text-white font-medium">{ev.detail}</span>
                          <span className="text-[10px] font-mono text-blue-400">{ev.team}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* IDLE PRE-MATCH SCREEN */
                  <div className="p-8 rounded-3xl bg-[#06163a]/60 border border-blue-800/60 shadow-xl flex flex-col items-center justify-center text-center my-auto min-h-[300px]">
                    <div className="w-14 h-14 rounded-2xl bg-blue-900/60 flex items-center justify-center text-cyan-400 mb-3">
                      <Play className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-black uppercase text-white">Tactical Room Ready</h3>
                    <p className="text-xs text-blue-300 max-w-sm mt-1 leading-relaxed">
                      Select either Instant Simulator to immediately calculate the fixture with deep statistics, or launch Watch Team Play to observe the 90-minute clash from your sideline dugout.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DASHBOARD TAB 2: SQUAD HUB (Lineup & Player Status) */}
          {activeTab === 'SQUAD_HUB' && (
            <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#06163a]/90 p-4 rounded-3xl border border-blue-800">
                <div>
                  <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span>Squad Hub • {careerState.squad.length} Players</span>
                  </h3>
                  <p className="text-xs text-blue-300">
                    Click any player to select, then click another player to swap starting lineup positions.
                  </p>
                </div>

                {/* Formation Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-blue-300 font-bold">Formation:</span>
                  {(['4-3-3', '4-2-3-1', '3-5-2', '4-4-2'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setCareerState({ ...careerState, formation: f })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                        careerState.formation === f
                          ? 'bg-blue-600 text-white border-cyan-400'
                          : 'bg-[#030d22] text-blue-300 border-blue-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Squad Players Table / Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {careerState.squad.map(player => {
                  const isSelected = selectedPlayerForSwap === player.id;
                  return (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerClick(player.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600 border-cyan-400 ring-2 ring-cyan-400/50 shadow-xl'
                          : player.isStarting
                          ? 'bg-[#06163a] border-blue-800 hover:border-blue-700'
                          : 'bg-[#030d22]/90 border-blue-900/60 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                            player.isStarting ? 'bg-cyan-500 text-black' : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          {player.position}
                        </span>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>{player.flag}</span>
                            <span>{player.name}</span>
                            {player.isStarting && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-950 text-cyan-300 text-[9px] font-mono font-bold">
                                XI
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-blue-300 flex items-center gap-2 mt-0.5 font-mono">
                            <span>Age {player.age}</span>
                            <span>•</span>
                            <span>Val: ${player.valueMillions}M</span>
                            <span>•</span>
                            <span>${player.weeklyWageK}k/wk</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <div className="text-base font-black font-mono text-cyan-300">
                            {player.overall}
                          </div>
                          <div className="text-[10px] font-mono text-emerald-400">
                            {player.morale}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DASHBOARD TAB 3: TRANSFERS & FINANCES */}
          {activeTab === 'TRANSFERS' && (
            <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
              <div className="bg-[#06163a]/90 p-4 rounded-3xl border border-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <span>Global Transfer Market &amp; Scouting</span>
                  </h3>
                  <p className="text-xs text-blue-300">
                    Acquire elite global superstars using your club transfer budget.
                  </p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-[#030d22] border border-blue-800">
                  <span className="text-[11px] font-mono text-blue-300 uppercase">Available Transfer Budget: </span>
                  <span className="text-sm font-mono font-black text-emerald-400">
                    ${careerState.transferBudgetMillions.toFixed(1)}M
                  </span>
                </div>
              </div>

              {/* Market Players Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {careerState.transferMarket.map(target => (
                  <div
                    key={target.id}
                    className="p-4 rounded-3xl bg-[#06163a]/90 border border-blue-800/80 flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-xl bg-blue-950 border border-blue-700 text-cyan-300 font-mono text-xs font-black">
                          {target.position}
                        </span>
                        <span className="text-base font-black font-mono text-white">
                          OVR {target.overall}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span>{target.flag}</span>
                        <span>{target.name}</span>
                      </h4>
                      <p className="text-[11px] text-blue-300 font-mono mt-1">
                        Age: {target.age} • Wage: ${target.weeklyWageK}k/wk
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-blue-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-blue-400 uppercase font-mono">Price</div>
                        <div className="text-xs font-mono font-black text-emerald-400">${target.valueMillions}M</div>
                      </div>

                      <button
                        onClick={() => handleBuyPlayer(target.id)}
                        disabled={careerState.transferBudgetMillions < target.valueMillions}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          careerState.transferBudgetMillions >= target.valueMillions
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-black'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Sign</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DASHBOARD TAB 4: LEAGUE TABLE & STANDINGS */}
          {activeTab === 'STANDINGS' && (
            <div className="max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
              <div className="p-5 rounded-3xl bg-[#06163a]/90 border border-blue-800 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>{careerState.club.league} Standings</span>
                  </h3>
                  <span className="text-xs font-mono text-blue-300">Season 2026/27</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-blue-800 text-[11px] font-mono text-blue-300 uppercase">
                        <th className="py-2.5 px-3">Pos</th>
                        <th className="py-2.5 px-3">Club</th>
                        <th className="py-2.5 px-3 text-center">P</th>
                        <th className="py-2.5 px-3 text-center">W</th>
                        <th className="py-2.5 px-3 text-center">D</th>
                        <th className="py-2.5 px-3 text-center">L</th>
                        <th className="py-2.5 px-3 text-center">GF</th>
                        <th className="py-2.5 px-3 text-center">GA</th>
                        <th className="py-2.5 px-3 text-center">GD</th>
                        <th className="py-2.5 px-3 text-center font-bold text-white">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-blue-900/60 bg-blue-600/20 font-bold">
                        <td className="py-2.5 px-3 font-mono text-cyan-300">1</td>
                        <td className="py-2.5 px-3 flex items-center gap-2 text-white">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: careerState.club.primaryColor }} />
                          <span>{careerState.club.name}</span>
                          <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">YOU</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">{careerState.seasonStats.matchesPlayed}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{careerState.seasonStats.wins}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{careerState.seasonStats.draws}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{careerState.seasonStats.losses}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{careerState.seasonStats.goalsFor}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{careerState.seasonStats.goalsAgainst}</td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          {careerState.seasonStats.goalsFor - careerState.seasonStats.goalsAgainst}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-emerald-400 font-black">
                          {careerState.seasonStats.points}
                        </td>
                      </tr>
                      {/* Sim competitor clubs */}
                      {[
                        { pos: 2, name: 'Bordeaux Athletic', p: careerState.seasonStats.matchesPlayed, w: 1, d: 1, l: 0, gf: 3, ga: 2, pts: 4 },
                        { pos: 3, name: 'Olympique Coastal', p: careerState.seasonStats.matchesPlayed, w: 1, d: 0, l: 1, gf: 2, ga: 2, pts: 3 },
                        { pos: 4, name: 'Vanguard FC', p: careerState.seasonStats.matchesPlayed, w: 0, d: 1, l: 1, gf: 1, ga: 3, pts: 1 },
                      ].map(row => (
                        <tr key={row.pos} className="border-b border-blue-900/40 text-blue-200">
                          <td className="py-2.5 px-3 font-mono text-blue-400">{row.pos}</td>
                          <td className="py-2.5 px-3 font-medium">{row.name}</td>
                          <td className="py-2.5 px-3 text-center font-mono">{row.p}</td>
                          <td className="py-2.5 px-3 text-center font-mono">{row.w}</td>
                          <td className="py-2.5 px-3 text-center font-mono">{row.d}</td>
                          <td className="py-2.5 px-3 text-center font-mono">{row.l}</td>
                          <td className="py-2.5 px-3 text-center font-mono">{row.gf}</td>
                          <td className="py-2.5 px-3 text-center font-mono">{row.ga}</td>
                          <td className="py-2.5 px-3 text-center font-mono">{row.gf - row.ga}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-white">{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD TAB 5: MANAGER OFFICE & BIO */}
          {activeTab === 'OFFICE' && (
            <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
              <div className="p-6 rounded-3xl bg-[#06163a]/90 border border-blue-800 shadow-xl flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-black text-2xl font-black">
                      {careerState.realManager?.flag || careerState.customManager?.flag || '⚽'}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        {careerState.realManager?.name || careerState.customManager?.name}
                      </h3>
                      <p className="text-xs text-blue-300">
                        Manager of {careerState.club.name} • {careerState.club.country}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-950 text-cyan-300 font-mono text-xs font-bold border border-blue-700">
                    {careerState.managerType === 'REAL' ? 'World-Class Profile' : 'Custom Created Persona'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#030d22] border border-blue-900 text-xs text-blue-200 leading-relaxed">
                  {careerState.realManager?.bio ||
                    `A dynamic coaching visionary renowned for tactical discipline and player development at ${careerState.club.name}.`}
                </div>

                {careerState.realManager && (
                  <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-800 text-xs">
                    <div className="font-bold text-cyan-300 mb-1">Career Achievements &amp; Legacy:</div>
                    <p className="text-white leading-relaxed">{careerState.realManager.achievements}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
