/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Trophy,
  Play,
  Globe,
  ChevronLeft,
  Crown,
  Shield,
  Sparkles,
  Users,
  Check,
  Shuffle,
  Activity,
  Award,
  Flame,
  Star,
  Plus,
  Edit3,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  getNationalTeams,
  getTeamsForCup,
  NationalTeam,
  UEFA_TEAMS,
  CAF_TEAMS,
  CONMEBOL_TEAMS,
  CONCACAF_TEAMS,
  ARAB_TEAMS,
} from '../data/fifaNations.ts';
import { CLUB_LEAGUES, ClubTeam } from '../data/clubLeagues.ts';
import { Official2026Logo } from './Official2026Ball.tsx';

export type CupId =
  | 'WORLD_CUP_2026'
  | 'EURO_2024'
  | 'COPA_AMERICA_2024'
  | 'CAF_2025'
  | 'ARAB_CUP'
  | 'SUPER_CUP_ALL_LEAGUES'
  | 'MAKE_YOUR_CUP';

interface CupDefinition {
  id: CupId;
  name: string;
  tagline: string;
  category: 'International Only' | 'European Only' | 'Americas Only' | 'Africa Only' | 'Arab Nations Only' | 'All Leagues Super Cup' | 'Owner Custom Mode';
  badge: string;
  description: string;
  allowedType: 'INTERNATIONAL_ALL' | 'EUROPE_ONLY' | 'AMERICAS_ONLY' | 'AFRICA_ONLY' | 'ARAB_ONLY' | 'CLUBS_SUPER_CUP' | 'CUSTOM_OWNER';
  defaultTeamsCount: number;
}

export const CUP_LIST: CupDefinition[] = [
  {
    id: 'WORLD_CUP_2026',
    name: 'FIFA World Cup 2026',
    tagline: 'North America 2026 • 211 Member Nations',
    category: 'International Only',
    badge: '🌐',
    description: 'Strictly for international national teams only. Compete with any of the 211 FIFA nations across UEFA, CONMEBOL, CAF, AFC, and CONCACAF.',
    allowedType: 'INTERNATIONAL_ALL',
    defaultTeamsCount: 16,
  },
  {
    id: 'EURO_2024',
    name: 'UEFA Euro 2024 / 2028',
    tagline: 'European National Championship',
    category: 'European Only',
    badge: '🇪🇺',
    description: 'Strictly for European international national teams only (Germany, Spain, France, England, Portugal, Italy, Netherlands, Croatia, etc.).',
    allowedType: 'EUROPE_ONLY',
    defaultTeamsCount: 16,
  },
  {
    id: 'COPA_AMERICA_2024',
    name: 'Copa América 2024',
    tagline: 'South & North America Dual Continent Cup',
    category: 'Americas Only',
    badge: '🌎',
    description: 'Strictly for South America (CONMEBOL) and North America (CONCACAF) national teams only (Argentina, Brazil, Uruguay, Colombia, USA, Mexico, Canada).',
    allowedType: 'AMERICAS_ONLY',
    defaultTeamsCount: 16,
  },
  {
    id: 'CAF_2025',
    name: 'CAF Africa Cup of Nations 2025',
    tagline: 'Morocco 2025 • African Continental Glory',
    category: 'Africa Only',
    badge: '🌍',
    description: 'Strictly for Africa national teams only (Morocco, Egypt, Senegal, Nigeria, Algeria, Ivory Coast, Cameroon, South Africa, Tunisia, Ghana).',
    allowedType: 'AFRICA_ONLY',
    defaultTeamsCount: 16,
  },
  {
    id: 'ARAB_CUP',
    name: 'FIFA Arab Cup (Cup of Arabic)',
    tagline: 'Arab World National Championship',
    category: 'Arab Nations Only',
    badge: '🏆',
    description: 'Strictly for international Arab national teams only (Egypt, Morocco, Saudi Arabia, Algeria, Tunisia, Qatar, UAE, Iraq, Jordan, Oman, Bahrain, etc.).',
    allowedType: 'ARAB_ONLY',
    defaultTeamsCount: 16,
  },
  {
    id: 'SUPER_CUP_ALL_LEAGUES',
    name: 'Super Cup of All Leagues',
    tagline: 'Domestic League Champions Tournament',
    category: 'All Leagues Super Cup',
    badge: '👑',
    description: 'The ultimate clash between champions of all leagues in the game (Al Ahly, Real Madrid, Manchester City, Flamengo, Al Hilal, Wydad, Espérance, Vissel Kobe, etc.).',
    allowedType: 'CLUBS_SUPER_CUP',
    defaultTeamsCount: 8,
  },
  {
    id: 'MAKE_YOUR_CUP',
    name: 'Make Your Cup (Owner Mode)',
    tagline: 'Create & Own Your Custom Trophy Tournament',
    category: 'Owner Custom Mode',
    badge: '🛠️',
    description: 'Be the tournament Owner & President! Set cup name, your owner title, trophy type, participant teams (nations or clubs), bracket size, and lift your cup!',
    allowedType: 'CUSTOM_OWNER',
    defaultTeamsCount: 8,
  },
];

interface BracketMatch {
  id: string;
  roundName: string;
  teamA: { name: string; color: string; short: string; rating: number };
  teamB: { name: string; color: string; short: string; rating: number };
  scoreA: number | null;
  scoreB: number | null;
  winner: string | null;
}

interface CupsModeHubProps {
  onBackToModeChoose: () => void;
  onLaunchMatch: (matchParams: {
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

export const CupsModeHub: React.FC<CupsModeHubProps> = ({
  onBackToModeChoose,
  onLaunchMatch,
}) => {
  const [selectedCupId, setSelectedCupId] = useState<CupId | null>(null);

  // Selected Cup tournament state
  const selectedCup = CUP_LIST.find((c) => c.id === selectedCupId) || null;
  const [userSelectedTeam, setUserSelectedTeam] = useState<string>('');
  const [tournamentMatches, setTournamentMatches] = useState<BracketMatch[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [champion, setChampion] = useState<string | null>(null);

  // Custom "Make Your Cup with Owner" state
  const [customCupName, setCustomCupName] = useState<string>('Owner Champions Cup 2027');
  const [customOwnerName, setCustomOwnerName] = useState<string>('President / Tournament Owner');
  const [customTrophyType, setCustomTrophyType] = useState<string>('Golden World Trophy');
  const [customTeamPoolType, setCustomTeamPoolType] = useState<'INTERNATIONAL' | 'CLUBS' | 'MIXED'>('INTERNATIONAL');
  const [customBracketSize, setCustomBracketSize] = useState<number>(8);

  // Helper to retrieve valid teams for chosen cup
  const getEligibleTeams = (cup: CupDefinition): Array<{ name: string; color: string; short: string; rating: number }> => {
    if (cup.allowedType === 'CLUBS_SUPER_CUP') {
      // League champions
      const teams: Array<{ name: string; color: string; short: string; rating: number }> = [];
      CLUB_LEAGUES.forEach((l) => {
        if (l.teams.length > 0) {
          const champ = l.teams[0];
          teams.push({
            name: champ.name,
            color: champ.primaryColor,
            short: champ.shortName,
            rating: 86,
          });
        }
      });
      return teams;
    }

    if (cup.allowedType === 'CUSTOM_OWNER') {
      if (customTeamPoolType === 'CLUBS') {
        return CLUB_LEAGUES.flatMap((l) =>
          l.teams.map((t) => ({
            name: t.name,
            color: t.primaryColor,
            short: t.shortName,
            rating: 84,
          }))
        );
      }
      if (customTeamPoolType === 'INTERNATIONAL') {
        return getNationalTeams().map((n) => ({
          name: n.name,
          color: n.homeColors.primary,
          short: n.name.slice(0, 3).toUpperCase(),
          rating: n.rating,
        }));
      }
      // Mixed
      const nations = getNationalTeams().slice(0, 20).map((n) => ({
        name: n.name,
        color: n.homeColors.primary,
        short: n.name.slice(0, 3).toUpperCase(),
        rating: n.rating,
      }));
      const clubs = CLUB_LEAGUES.flatMap((l) =>
        l.teams.map((t) => ({
          name: t.name,
          color: t.primaryColor,
          short: t.shortName,
          rating: 85,
        }))
      );
      return [...nations, ...clubs];
    }

    // International Cups with exact filters specified by user:
    let filteredNations: NationalTeam[] = [];
    if (cup.allowedType === 'INTERNATIONAL_ALL') {
      filteredNations = getNationalTeams(); // all 211 nations
    } else if (cup.allowedType === 'EUROPE_ONLY') {
      filteredNations = getTeamsForCup('EURO'); // UEFA only
    } else if (cup.allowedType === 'AMERICAS_ONLY') {
      filteredNations = getTeamsForCup('COPA_AMERICA'); // CONMEBOL + CONCACAF only
    } else if (cup.allowedType === 'AFRICA_ONLY') {
      filteredNations = getTeamsForCup('CAF_CUP'); // CAF only
    } else if (cup.allowedType === 'ARAB_ONLY') {
      filteredNations = getTeamsForCup('ARAB_CUP'); // Arab nations only
    }

    return filteredNations.map((n) => ({
      name: n.name,
      color: n.homeColors.primary,
      short: n.name.slice(0, 3).toUpperCase(),
      rating: n.rating,
    }));
  };

  // Initialize Tournament Bracket
  const handleStartTournament = (cup: CupDefinition) => {
    const pool = getEligibleTeams(cup);
    const count = cup.id === 'MAKE_YOUR_CUP' ? customBracketSize : cup.defaultTeamsCount;
    // Ensure user team is included
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    const userTeamObj = pool.find((t) => t.name === userSelectedTeam) || selected[0];
    if (!selected.some((t) => t.name === userTeamObj.name)) {
      selected[0] = userTeamObj;
    }

    // Build Round 1 Quarter-finals or Round of 16
    const matches: BracketMatch[] = [];
    const roundName = count === 16 ? 'Round of 16' : count === 8 ? 'Quarter-Finals' : 'Semi-Finals';

    for (let i = 0; i < count; i += 2) {
      matches.push({
        id: `M_${i / 2 + 1}`,
        roundName,
        teamA: selected[i],
        teamB: selected[i + 1] || selected[0],
        scoreA: null,
        scoreB: null,
        winner: null,
      });
    }

    setTournamentMatches(matches);
    setCurrentRoundIdx(0);
    setChampion(null);
  };

  // Simulate Current Match
  const handleSimulateMatch = (matchIdx: number) => {
    const match = tournamentMatches[matchIdx];
    if (!match || match.winner) return;

    let sA = Math.floor(Math.random() * 4);
    let sB = Math.floor(Math.random() * 4);
    if (sA === sB) {
      if (Math.random() > 0.5) sA += 1;
      else sB += 1;
    }
    const winName = sA > sB ? match.teamA.name : match.teamB.name;

    const updated = [...tournamentMatches];
    updated[matchIdx] = {
      ...match,
      scoreA: sA,
      scoreB: sB,
      winner: winName,
    };
    setTournamentMatches(updated);

    // Check if round is complete
    const allDone = updated.every((m) => m.winner !== null);
    if (allDone) {
      if (updated.length === 1) {
        // Final complete
        setChampion(winName);
      } else {
        // Advance to next round
        const nextWinners = updated.map((m) =>
          m.winner === m.teamA.name ? m.teamA : m.teamB
        );
        const nextMatches: BracketMatch[] = [];
        const nextRoundName =
          nextWinners.length === 4 ? 'Semi-Finals' : 'The Grand Final';

        for (let i = 0; i < nextWinners.length; i += 2) {
          nextMatches.push({
            id: `NM_${i / 2 + 1}`,
            roundName: nextRoundName,
            teamA: nextWinners[i],
            teamB: nextWinners[i + 1],
            scoreA: null,
            scoreB: null,
            winner: null,
          });
        }
        setTournamentMatches(nextMatches);
      }
    }
  };

  return (
    <div className="w-full h-full bg-[#030d22] text-white flex flex-col overflow-hidden font-sans select-none">
      {/* Top Header Bar */}
      <div className="w-full bg-[#061536] border-b border-blue-900/60 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (selectedCupId) {
                setSelectedCupId(null);
                setTournamentMatches([]);
                setChampion(null);
              } else {
                onBackToModeChoose();
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-white border border-blue-700/60 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow"
          >
            <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
              <ChevronLeft className="w-4 h-4 text-black stroke-[3]" />
            </div>
            <span>{selectedCupId ? 'All Cups' : 'Mode Select'}</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black shadow-sm">
              <Trophy className="w-4 h-4 text-black fill-black" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase flex items-center gap-2">
                <span>CHAMPIONSHIP CUPS HUB</span>
                {selectedCup && (
                  <>
                    <span className="text-blue-400 font-normal">/</span>
                    <span className="text-cyan-300 font-black">{selectedCup.name}</span>
                  </>
                )}
              </h1>
              <p className="text-[11px] text-blue-200">
                {selectedCup
                  ? selectedCup.tagline
                  : 'World Cup 2026 • Euro • Copa América • CAF 2025 • Arab Cup • Super Cup • Owner Mode'}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>CUPS ENGINE LOADED</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-[#040f28] via-[#020b1f] to-[#010612]">
        {/* =========================================================================
            STATE 1: ALL CUPS MENU (World Cup, Euro, Copa America, CAF 2025, Arab Cup, Super Cup, Make Your Cup)
        ========================================================================== */}
        {!selectedCupId && (
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black">
                  <Trophy className="w-4 h-4 text-black fill-black" />
                </div>
                <span>SELECT CUP TOURNAMENT</span>
              </h2>
              <p className="text-xs sm:text-sm text-blue-200 mt-0.5">
                Choose international cups, continental championships, domestic champions super cup, or create your custom cup in Owner Mode.
              </p>
            </div>

            {/* Cups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CUP_LIST.map((cup) => (
                <div
                  key={cup.id}
                  onClick={() => {
                    setSelectedCupId(cup.id);
                    const eligible = getEligibleTeams(cup);
                    if (eligible.length > 0) {
                      setUserSelectedTeam(eligible[0].name);
                    }
                  }}
                  className={`group relative bg-[#091b40]/90 hover:bg-[#0f2a63] border rounded-3xl p-5 sm:p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden ${
                    cup.id === 'MAKE_YOUR_CUP'
                      ? 'border-amber-400/80 bg-gradient-to-br from-[#0c2452] to-[#140a33]'
                      : 'border-blue-800 hover:border-cyan-400'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20" />

                  <div>
                    {/* Badge and Category pill */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-950 text-cyan-300 font-mono text-[10px] font-bold border border-blue-800">
                        {cup.category}
                      </span>
                      {cup.id === 'WORLD_CUP_2026' ? (
                        <Official2026Logo ballSize={34} showSubtitles={false} />
                      ) : (
                        <span className="text-2xl">{cup.badge}</span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <span>{cup.name}</span>
                    </h3>

                    <p className="text-xs text-blue-200 font-medium mt-1">
                      {cup.tagline}
                    </p>

                    <p className="text-[11px] text-blue-300 mt-3 line-clamp-3 leading-relaxed">
                      {cup.description}
                    </p>
                  </div>

                  {/* Bottom Footer */}
                  <div className="mt-5 pt-3 border-t border-blue-800/80 flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-300">
                      {cup.id === 'MAKE_YOUR_CUP' ? 'OWNER MODE ACTIVE' : 'KNOCKOUT CUP'}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs font-black text-white group-hover:text-cyan-300">
                      <span>ENTER CUP</span>
                      <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
                        <ArrowRight className="w-3 h-3 text-black stroke-[3]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: SELECTED CUP SCREEN & TOURNAMENT BRACKET
        ========================================================================== */}
        {selectedCup && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {/* Header Card for this Cup */}
            <div className="bg-[#091b40]/90 border border-blue-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-blue-800/80 mb-6">
                <div className="flex items-start gap-4">
                  {selectedCup.id === 'WORLD_CUP_2026' ? (
                    <Official2026Logo ballSize={88} layout="horizontal" />
                  ) : null}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{selectedCup.badge}</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-950 text-cyan-300 font-mono text-[10px] font-bold border border-blue-800">
                        {selectedCup.category}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      {selectedCup.id === 'MAKE_YOUR_CUP' ? customCupName : selectedCup.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-200 mt-0.5 max-w-xl">
                      {selectedCup.description}
                    </p>
                  </div>
                </div>

                {/* Champion Banner if won */}
                {champion && (
                  <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-center shadow-lg border border-white flex items-center gap-2 animate-bounce">
                    <Crown className="w-5 h-5 text-black" />
                    <span>CHAMPION: {champion}!</span>
                  </div>
                )}
              </div>

              {/* SPECIAL SECTION FOR MAKE YOUR CUP: OWNER CONFIGURATION */}
              {selectedCup.id === 'MAKE_YOUR_CUP' && tournamentMatches.length === 0 && (
                <div className="p-5 rounded-2xl bg-[#05112c] border border-amber-400/60 mb-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-black font-black">
                      <Crown className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase">
                        TOURNAMENT OWNER &amp; COMMISSIONER CONTROL
                      </h4>
                      <p className="text-[11px] text-amber-200">
                        You have total authority over this cup: edit cup name, your owner title, trophy type, and team pool.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-blue-200 uppercase">Cup Name</label>
                      <input
                        type="text"
                        value={customCupName}
                        onChange={(e) => setCustomCupName(e.target.value)}
                        className="w-full mt-1 bg-[#091b40] border border-blue-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-blue-200 uppercase">Owner / President Name</label>
                      <input
                        type="text"
                        value={customOwnerName}
                        onChange={(e) => setCustomOwnerName(e.target.value)}
                        className="w-full mt-1 bg-[#091b40] border border-blue-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-blue-200 uppercase">Trophy Design</label>
                      <select
                        value={customTrophyType}
                        onChange={(e) => setCustomTrophyType(e.target.value)}
                        className="w-full mt-1 bg-[#091b40] border border-blue-700 rounded-xl px-3 py-2 text-xs text-white font-bold cursor-pointer"
                      >
                        <option value="Golden World Trophy">🏆 Golden World Trophy</option>
                        <option value="Platinum Continental Crown">👑 Platinum Continental Crown</option>
                        <option value="Diamond League Shield">🛡️ Diamond League Shield</option>
                        <option value="Arabian Golden Dagger">🗡️ Arabian Golden Trophy</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-blue-200 uppercase">Participating Pool</label>
                      <select
                        value={customTeamPoolType}
                        onChange={(e) => setCustomTeamPoolType(e.target.value as any)}
                        className="w-full mt-1 bg-[#091b40] border border-blue-700 rounded-xl px-3 py-2 text-xs text-white font-bold cursor-pointer"
                      >
                        <option value="INTERNATIONAL">National Teams (211 Nations)</option>
                        <option value="CLUBS">Domestic Clubs (All Leagues)</option>
                        <option value="MIXED">Mixed (Clubs &amp; Nations Clash)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs text-blue-200 font-bold">Bracket Size:</span>
                    {[4, 8, 16].map((size) => (
                      <button
                        key={size}
                        onClick={() => setCustomBracketSize(size)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          customBracketSize === size
                            ? 'bg-amber-400 text-black font-black shadow'
                            : 'bg-blue-950 text-blue-200 hover:text-white border border-blue-800'
                        }`}
                      >
                        {size} Teams ({size === 4 ? 'Semi-Finals' : size === 8 ? 'Quarter-Finals' : 'Round of 16'})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tournament Setup & Team Selection */}
              {tournamentMatches.length === 0 && (
                <div className="flex flex-col gap-4">
                  <div className="p-5 rounded-2xl bg-[#05112c] border border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-full sm:w-auto flex-1">
                      <label className="text-xs font-black text-cyan-300 uppercase tracking-wider block mb-1">
                        Select Your Team to Guide in {selectedCup.name}:
                      </label>
                      <select
                        value={userSelectedTeam}
                        onChange={(e) => setUserSelectedTeam(e.target.value)}
                        className="w-full bg-[#091b40] border border-blue-700 rounded-xl px-3 py-2.5 text-sm text-white font-bold cursor-pointer"
                      >
                        {getEligibleTeams(selectedCup).map((t) => (
                          <option key={t.name} value={t.name}>
                            {t.name} (OVR {t.rating})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => handleStartTournament(selectedCup)}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(37,99,235,0.6)] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
                        <Play className="w-3.5 h-3.5 text-black fill-black" />
                      </div>
                      <span>GENERATE TOURNAMENT BRACKET</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Active Tournament Bracket View */}
              {tournamentMatches.length > 0 && (
                <div className="flex flex-col gap-6">
                  {/* Round Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-blue-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black">
                        <Layers className="w-3.5 h-3.5 text-black" />
                      </div>
                      <span className="font-black text-lg text-white">
                        {tournamentMatches[0]?.roundName || 'Knockout Stage'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleStartTournament(selectedCup)}
                      className="px-3 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-xs font-bold text-blue-200 cursor-pointer"
                    >
                      Reset Bracket
                    </button>
                  </div>

                  {/* Bracket Match Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tournamentMatches.map((match, idx) => (
                      <div
                        key={match.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          match.winner
                            ? 'bg-[#040e26] border-blue-900 opacity-90'
                            : 'bg-[#05112c] border-blue-700 shadow-lg'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-blue-300 mb-2">
                          <span>MATCH #{idx + 1}</span>
                          <span>{match.roundName}</span>
                        </div>

                        {/* Team A */}
                        <div
                          className={`flex items-center justify-between p-2.5 rounded-xl ${
                            match.winner === match.teamA.name
                              ? 'bg-emerald-950/80 border border-emerald-500/80 font-black'
                              : 'bg-blue-950/60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-white"
                              style={{ backgroundColor: match.teamA.color }}
                            />
                            <span className="text-sm text-white font-bold">
                              {match.teamA.name}
                            </span>
                            {match.teamA.name === userSelectedTeam && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-600 text-[10px] text-white font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-lg font-black text-cyan-300">
                            {match.scoreA !== null ? match.scoreA : '-'}
                          </span>
                        </div>

                        {/* Team B */}
                        <div
                          className={`flex items-center justify-between p-2.5 rounded-xl mt-1.5 ${
                            match.winner === match.teamB.name
                              ? 'bg-emerald-950/80 border border-emerald-500/80 font-black'
                              : 'bg-blue-950/60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-white"
                              style={{ backgroundColor: match.teamB.color }}
                            />
                            <span className="text-sm text-white font-bold">
                              {match.teamB.name}
                            </span>
                            {match.teamB.name === userSelectedTeam && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-600 text-[10px] text-white font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-lg font-black text-cyan-300">
                            {match.scoreB !== null ? match.scoreB : '-'}
                          </span>
                        </div>

                        {/* Actions for this match */}
                        {!match.winner && (
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-blue-800/60">
                            <button
                              onClick={() => {
                                onLaunchMatch({
                                  homeTeamName: match.teamA.name,
                                  homeTeamColor: match.teamA.color,
                                  awayTeamName: match.teamB.name,
                                  awayTeamColor: match.teamB.color,
                                  homeTeamShort: match.teamA.short,
                                  awayTeamShort: match.teamB.short,
                                  stadiumName: `${selectedCup.name} Arena`,
                                  tournamentName: selectedCup.name,
                                });
                              }}
                              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow"
                            >
                              <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                                <Play className="w-3 h-3 text-black fill-black" />
                              </div>
                              <span>Play in 3D (PSP Controls)</span>
                            </button>

                            <button
                              onClick={() => handleSimulateMatch(idx)}
                              className="px-3 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                            >
                              <div className="w-3.5 h-3.5 rounded bg-white flex items-center justify-center text-black">
                                <Activity className="w-2.5 h-2.5 text-black" />
                              </div>
                              <span>Simulate</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
