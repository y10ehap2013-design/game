/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Trophy,
  Play,
  Flame,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Calendar,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
  RotateCcw,
  Activity,
  Zap,
  Globe,
  Award,
} from 'lucide-react';
import type { UELClub, UELKnockoutMatch } from '../data/uelTeams.ts';
import { UEL_CLUBS, generateDefaultUELKnockoutMatches } from '../data/uelTeams.ts';
import {
  getUELQualificationStatus,
  sortUELTable,
  simulateUELMatch,
  simulateFullMatchdayRound,
  filterUELClubs,
} from '../logic/uelCompetition.ts';
import { soundFX } from '../game/soundFX.ts';

interface UELModeHubProps {
  onBackToModeChoose: () => void;
  onLaunchMatch: (params: {
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

type UELTab = 'LEAGUE_PHASE' | 'KNOCKOUT_TREE' | 'SELECT_CLUB' | 'MATCHDAY' | 'SEASON_TRACKER';

export const UELModeHub: React.FC<UELModeHubProps> = ({
  onBackToModeChoose,
  onLaunchMatch,
}) => {
  const [activeTab, setActiveTab] = useState<UELTab>('LEAGUE_PHASE');
  const [clubs, setClubs] = useState<UELClub[]>(() => sortUELTable(UEL_CLUBS));
  const [userClub, setUserClub] = useState<UELClub>(() => UEL_CLUBS[0]); // Bayer Leverkusen default
  const [opponentClub, setOpponentClub] = useState<UELClub>(() => UEL_CLUBS[1]); // Juventus
  const [knockoutMatches] = useState<UELKnockoutMatch[]>(() => generateDefaultUELKnockoutMatches());
  const [isPlayingAnthem, setIsPlayingAnthem] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');
  const [lastRoundResults, setLastRoundResults] = useState<
    Array<{ home: UELClub; away: UELClub; homeGoals: number; awayGoals: number; scorer: string }>
  >([]);
  const [matchdayRoundNumber, setMatchdayRoundNumber] = useState<number>(7);

  // Play UEL Official Anthem Fanfare
  const handlePlayAnthem = () => {
    setIsPlayingAnthem(true);
    soundFX.playUELAnthemFanfare();
    setTimeout(() => setIsPlayingAnthem(false), 2900);
  };

  // Launch Match with authentic UEL parameters
  const handleStartUELMatch = (home: UELClub, away: UELClub, roundName: string = 'League Phase') => {
    soundFX.playWhistle();
    onLaunchMatch({
      homeTeamName: home.name,
      homeTeamColor: home.primaryColor,
      awayTeamName: away.name,
      awayTeamColor: away.primaryColor,
      homeTeamShort: home.shortName,
      awayTeamShort: away.shortName,
      stadiumName: `${home.stadium} (UEFA Europa League)`,
      tournamentName: `UEFA Europa League 2026/27 • ${roundName}`,
    });
  };

  // Simulate a full round across all 36 teams
  const handleSimulateFullRound = () => {
    soundFX.playKick(0.8);
    const simResult = simulateFullMatchdayRound(clubs);
    setClubs(simResult.updatedClubs);
    setLastRoundResults(simResult.roundResults);
    setMatchdayRoundNumber((prev) => prev + 1);
  };

  // Reset standings
  const handleResetStandings = () => {
    soundFX.playKick(0.3);
    setClubs(sortUELTable(UEL_CLUBS));
    setLastRoundResults([]);
    setMatchdayRoundNumber(7);
  };

  // Unique country list
  const uniqueCountries = ['ALL', ...Array.from(new Set(UEL_CLUBS.map((c) => c.country))).sort()];

  // Filtered clubs for gallery
  const filteredClubs = filterUELClubs(clubs, searchQuery, countryFilter);

  return (
    <div className="w-full h-full bg-[#0a0d14] text-white flex flex-col justify-between p-4 sm:p-8 overflow-y-auto font-sans select-none bg-gradient-to-b from-[#13110d] via-[#0c0e14] to-[#06070a]">
      {/* Top Header Bar */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pb-4 sm:pb-6 border-b border-orange-950/80 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToModeChoose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1a1410] hover:bg-orange-950 border border-orange-700/60 text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95"
            title="Return to Main Mode Choose"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Choose Mode</span>
          </button>

          {/* UEL Energy Wave & Title */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 border-2 border-orange-400 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.6)]">
              {/* Europa Trophy Silhouette */}
              <Trophy className="w-6 h-6 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow flex items-center gap-1.5">
                  <span className="text-orange-400">UEFA EUROPA LEAGUE</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-950/90 text-orange-300 border border-orange-500/60 text-[10px] font-mono font-bold tracking-wider">
                  36-TEAM PHASE
                </span>
              </div>
              <p className="text-[11px] text-orange-200/80 font-medium">
                THE ENERGY WAVE • OFFICIAL 2026/27 COMPETITION • 36 PARTICIPATING CLUBS
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePlayAnthem}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold shadow cursor-pointer transition-all active:scale-95 ${
              isPlayingAnthem
                ? 'bg-orange-500 text-black border-white animate-pulse'
                : 'bg-[#21160d] hover:bg-orange-900 border-orange-500/60 text-orange-200'
            }`}
            title="Play the iconic UEFA Europa League Official Anthem Fanfare"
          >
            <Volume2 className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">{isPlayingAnthem ? 'PLAYING ANTHEM...' : 'UEL ANTHEM 🎺'}</span>
          </button>

          <button
            onClick={() => handleStartUELMatch(userClub, opponentClub, 'Grand Match')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-xs uppercase shadow-[0_0_20px_rgba(249,115,22,0.5)] cursor-pointer transition-all active:scale-95"
            title="Play Europa League Match with selected club in 3D pitch"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>PLAY MATCH</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase Banner with Europa Orange Energy Wave */}
      <div className="w-full max-w-7xl mx-auto my-5">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#261205] via-[#160d09] to-[#0d0f14] border-2 border-orange-500/70 p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Subtle glowing energy ambient light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/90 border border-orange-600/60 text-xs font-mono text-orange-300 mb-2 shadow">
              <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              <span>THE 2026/27 UEFA EUROPA LEAGUE • UNIFIED 36 CLUBS PHASE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight drop-shadow-md">
              THE ORANGE ENERGY WAVE
            </h2>
            <p className="text-xs sm:text-sm text-orange-100/90 font-medium mt-1 leading-relaxed">
              Featuring all 36 qualified European powerhouses: Bayer Leverkusen, Juventus, Milan, Benfica, Real Sociedad, Marseille, Crystal Palace, Celtic, Lyon, and more.
              Selected club: <strong className="text-orange-300">{userClub.name}</strong> ({userClub.country} • OVR {userClub.rating}).
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-mono">
              <span className="bg-[#1f130b] px-3 py-1 rounded-lg border border-orange-700/80 text-orange-300 font-bold flex items-center gap-1">
                <span>🔥</span> 36 Contenders
              </span>
              <span className="bg-[#1f130b] px-3 py-1 rounded-lg border border-orange-700/80 text-emerald-300 flex items-center gap-1">
                <span>⭐</span> Top 8: Direct Round of 16
              </span>
              <span className="bg-[#1f130b] px-3 py-1 rounded-lg border border-orange-700/80 text-amber-300 flex items-center gap-1">
                <span>⚔️</span> 9–24: Play-off Knockouts
              </span>
              <span className="bg-[#1f130b] px-3 py-1 rounded-lg border border-orange-700/80 text-yellow-300 flex items-center gap-1">
                <span>🏆</span> €45M Winner Purse
              </span>
            </div>
          </div>

          {/* Active Club Spotlight Card */}
          <div className="relative z-10 p-5 rounded-2xl bg-[#1b120c]/90 border border-orange-500/60 shadow-2xl flex flex-col items-center text-center shrink-0 min-w-[240px]">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl border-2 border-white/40 mb-2"
              style={{ backgroundColor: userClub.primaryColor, color: userClub.secondaryColor }}
            >
              {userClub.shortName}
            </div>
            <div className="font-black text-lg text-white">{userClub.name}</div>
            <div className="text-xs font-mono text-orange-300 flex items-center gap-1">
              <span>{userClub.flag}</span>
              <span>{userClub.country}</span>
              <span>• OVR {userClub.rating}</span>
            </div>
            <div className="text-[11px] text-orange-200 mt-1">
              Stadium: <span className="text-white font-semibold">{userClub.stadium}</span>
            </div>
            <div className="text-[10px] text-orange-300/80 font-mono mt-0.5">
              Manager: {userClub.manager}
            </div>
            <button
              onClick={() => setActiveTab('SELECT_CLUB')}
              className="mt-3 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-black font-bold text-xs cursor-pointer transition-all active:scale-95 shadow"
            >
              Change Club
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="w-full max-w-7xl mx-auto flex items-center gap-2 p-1.5 rounded-2xl bg-[#1a120b]/90 border border-orange-900/60 mb-5 overflow-x-auto shrink-0">
        {[
          { id: 'LEAGUE_PHASE' as const, label: '🏆 36-Team League Standings' },
          { id: 'KNOCKOUT_TREE' as const, label: '⚔️ Knockout Bracket & Final' },
          { id: 'SELECT_CLUB' as const, label: '👑 Choose Europa Club (36)' },
          { id: 'MATCHDAY' as const, label: '⚽ Matchday & 3D Pitch' },
          { id: 'SEASON_TRACKER' as const, label: '📊 Standings & Results Tracker' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playKick(0.3);
                setActiveTab(tab.id);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-black shadow-lg font-black'
                  : 'text-orange-200/80 hover:text-white hover:bg-orange-950/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Views */}
      <div className="w-full max-w-7xl mx-auto flex-1 mb-6">
        {/* TAB 1: 36-TEAM LEAGUE PHASE STANDINGS */}
        {activeTab === 'LEAGUE_PHASE' && (
          <div className="rounded-3xl bg-[#120f0c]/90 border border-orange-900/70 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-orange-950 mb-4">
                <div>
                  <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                    <span className="text-orange-400">UEFA Europa League Phase Table</span>
                    <span className="text-xs font-mono text-orange-200 font-normal">
                      (Unified 36-Team Single League Phase)
                    </span>
                  </h3>
                  <p className="text-xs text-orange-200/80 mt-0.5">
                    Positions 1–8 qualify directly for the Round of 16. Positions 9–24 enter the 2-legged Knockout Play-offs. Positions 25–36 are eliminated.
                  </p>
                </div>

                {/* Legend Badges & Quick Action */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Top 8: Direct Round of 16
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-orange-950 text-orange-300 border border-orange-700">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    9–24: Play-off Knockouts
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    25–36: Eliminated
                  </span>

                  <button
                    onClick={handleSimulateFullRound}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-black font-extrabold text-xs shadow cursor-pointer active:scale-95"
                    title="Simulate Matchday for all 36 clubs"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span>Simulate Matchday {matchdayRoundNumber}</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="text-orange-300/80 border-b border-orange-950 text-[11px] font-mono">
                      <th className="py-2.5 px-3">POS</th>
                      <th className="py-2.5 px-3">CLUB</th>
                      <th className="py-2.5 px-2 text-center">MP</th>
                      <th className="py-2.5 px-2 text-center">W</th>
                      <th className="py-2.5 px-2 text-center">D</th>
                      <th className="py-2.5 px-2 text-center">L</th>
                      <th className="py-2.5 px-2 text-center">GF</th>
                      <th className="py-2.5 px-2 text-center">GA</th>
                      <th className="py-2.5 px-2 text-center">GD</th>
                      <th className="py-2.5 px-3 text-center font-bold text-white">PTS</th>
                      <th className="py-2.5 px-3 text-center">STATUS</th>
                      <th className="py-2.5 px-3 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-950/40">
                    {clubs.map((club, idx) => {
                      const pos = idx + 1;
                      const status = getUELQualificationStatus(pos);
                      const isSelected = userClub.id === club.id;

                      return (
                        <tr
                          key={club.id}
                          className={`transition-colors ${
                            isSelected
                              ? 'bg-orange-950/40 border-l-4 border-orange-400'
                              : 'hover:bg-orange-950/20'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold">
                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] ${
                                status === 'TOP_8'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : status === 'PLAYOFF'
                                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {pos}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{club.flag}</span>
                              <div
                                className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[9px] font-black shrink-0"
                                style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                              >
                                {club.shortName.substring(0, 1)}
                              </div>
                              <span className="font-bold text-white text-xs">{club.name}</span>
                              {club.uelTitles > 0 && (
                                <span className="text-[10px] text-amber-400 font-mono flex items-center gap-0.5">
                                  🏆 {club.uelTitles}
                                </span>
                              )}
                              {isSelected && (
                                <span className="px-1.5 py-0.2 rounded bg-orange-400 text-black font-mono text-[9px] font-bold">
                                  YOU
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono">{club.matchesPlayed}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-emerald-400">{club.won}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-slate-400">{club.drawn}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-rose-400">{club.lost}</td>
                          <td className="py-2.5 px-2 text-center font-mono">{club.goalsFor}</td>
                          <td className="py-2.5 px-2 text-center font-mono">{club.goalsAgainst}</td>
                          <td className="py-2.5 px-2 text-center font-mono font-bold text-orange-300">
                            {club.goalDiff > 0 ? `+${club.goalDiff}` : club.goalDiff}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-yellow-300">
                            {club.points}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                                status === 'TOP_8'
                                  ? 'bg-emerald-950 text-emerald-300'
                                  : status === 'PLAYOFF'
                                  ? 'bg-orange-950 text-orange-300'
                                  : 'bg-rose-950/60 text-rose-400'
                              }`}
                            >
                              {status === 'TOP_8' ? 'Round of 16' : status === 'PLAYOFF' ? 'Play-off' : 'Eliminated'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => {
                                setUserClub(club);
                                soundFX.playKick(0.5);
                              }}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-orange-500 text-black'
                                  : 'bg-orange-950 hover:bg-orange-600 hover:text-black text-orange-200'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Pick Club'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KNOCKOUT BRACKET & FINAL */}
        {activeTab === 'KNOCKOUT_TREE' && (
          <div className="space-y-6">
            {/* The Grand Final Spotlight Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-[#240e04] via-[#1a0f07] to-[#0c0d12] border-2 border-orange-500/80 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950 text-orange-300 font-mono text-xs font-bold border border-orange-700 mb-2">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span>THE GRAND FINAL 2027 • ESTADIO DE SAN MAMÉS / DEUTSCHE BANK PARK</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                  UEFA EUROPA LEAGUE FINAL
                </h3>
                <p className="text-xs sm:text-sm text-orange-100/90 mt-1 leading-relaxed">
                  The electric climax of Thursday European football. Fight for the legendary silver Europa League trophy, automatic qualification to the UEFA Champions League, and European Super Cup glory.
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => handleStartUELMatch(userClub, opponentClub, 'Grand Final')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Trophy className="w-4 h-4 fill-black" />
                    <span>PLAY THE GRAND FINAL</span>
                  </button>
                </div>
              </div>

              {/* Matchup Preview */}
              <div className="p-4 rounded-2xl bg-[#1b120c]/90 border border-orange-700/80 flex items-center gap-4 shrink-0 shadow-xl">
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg mx-auto border border-white/40"
                    style={{ backgroundColor: userClub.primaryColor, color: userClub.secondaryColor }}
                  >
                    {userClub.shortName}
                  </div>
                  <div className="font-bold text-xs text-white mt-1 max-w-[100px] truncate">{userClub.name}</div>
                </div>

                <div className="text-orange-400 font-black text-lg font-mono">VS</div>

                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg mx-auto border border-white/40"
                    style={{ backgroundColor: opponentClub.primaryColor, color: opponentClub.secondaryColor }}
                  >
                    {opponentClub.shortName}
                  </div>
                  <div className="font-bold text-xs text-white mt-1 max-w-[100px] truncate">{opponentClub.name}</div>
                </div>
              </div>
            </div>

            {/* Knockout Match Fixtures Grid */}
            <div className="rounded-3xl bg-[#120f0c]/90 border border-orange-900/70 p-6 shadow-xl">
              <h4 className="text-base font-bold uppercase text-white mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span>Round of 16 &amp; Knockout Phase Fixtures</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {knockoutMatches.slice(0, 8).map((match) => (
                  <div
                    key={match.id}
                    className="p-3.5 rounded-2xl bg-[#1b140e] border border-orange-900/60 hover:border-orange-400 transition-all flex flex-col justify-between shadow"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-orange-300 mb-2">
                        <span>{match.round}</span>
                        <span>{match.leg}</span>
                      </div>

                      {/* Home Team */}
                      <div className="flex items-center justify-between py-1 border-b border-orange-950">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <span>{match.homeTeam.flag}</span>
                          <span className="truncate max-w-[120px]">{match.homeTeam.name}</span>
                        </div>
                        <span className="font-mono font-bold text-orange-400">{match.homeScore ?? '-'}</span>
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <span>{match.awayTeam.flag}</span>
                          <span className="truncate max-w-[120px]">{match.awayTeam.name}</span>
                        </div>
                        <span className="font-mono font-bold text-orange-400">{match.awayScore ?? '-'}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-orange-950 flex items-center justify-between">
                      <span className="text-[10px] text-orange-200/60 truncate max-w-[140px] font-mono">
                        {match.stadium}
                      </span>
                      <button
                        onClick={() => handleStartUELMatch(match.homeTeam, match.awayTeam, match.round)}
                        className="px-2 py-0.5 rounded bg-orange-600 hover:bg-orange-500 text-black font-bold text-[10px] cursor-pointer"
                      >
                        Play
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHOOSE EUROPA CLUB (All 36 Clubs Gallery) */}
        {activeTab === 'SELECT_CLUB' && (
          <div className="rounded-3xl bg-[#120f0c]/90 border border-orange-900/70 p-6 shadow-xl space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-orange-950">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search from 36 Europa clubs or stars..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1b140e] border border-orange-800/80 text-white text-xs placeholder-orange-300/40 focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    aria-label="Filter clubs by nation"
                    className="px-3 py-2 rounded-xl bg-[#1b140e] border border-orange-800/80 text-orange-200 text-xs font-semibold focus:outline-none focus:border-orange-400"
                  >
                    {uniqueCountries.map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {c === 'ALL' ? '🌍 All Nations (36)' : c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs font-mono text-orange-300">
                Showing <strong className="text-white">{filteredClubs.length}</strong> of 36 qualified clubs
              </div>
            </div>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredClubs.map((club) => {
                const isSelected = userClub.id === club.id;
                const isOpponent = opponentClub.id === club.id;

                return (
                  <div
                    key={club.id}
                    className={`p-4 rounded-2xl bg-[#1b140e] border transition-all flex flex-col justify-between shadow-lg ${
                      isSelected
                        ? 'border-orange-400 ring-2 ring-orange-500/40 bg-orange-950/40'
                        : isOpponent
                        ? 'border-amber-400 bg-amber-950/20'
                        : 'border-orange-950 hover:border-orange-700/80'
                    }`}
                  >
                    <div>
                      {/* Club Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow border border-white/30"
                            style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                          >
                            {club.shortName}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white leading-tight">{club.name}</div>
                            <div className="text-[10px] font-mono text-orange-300/80 flex items-center gap-1">
                              <span>{club.flag}</span>
                              <span>{club.country}</span>
                            </div>
                          </div>
                        </div>

                        <div className="px-2 py-1 rounded bg-black/50 border border-orange-800/60 font-mono font-bold text-xs text-orange-400">
                          {club.rating}
                        </div>
                      </div>

                      {/* Ratings Breakdown */}
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono bg-black/30 p-1.5 rounded-lg mb-3">
                        <div>
                          <div className="text-orange-300/60 text-[9px]">ATT</div>
                          <div className="font-bold text-emerald-400">{club.attackRating}</div>
                        </div>
                        <div>
                          <div className="text-orange-300/60 text-[9px]">MID</div>
                          <div className="font-bold text-cyan-400">{club.midfieldRating}</div>
                        </div>
                        <div>
                          <div className="text-orange-300/60 text-[9px]">DEF</div>
                          <div className="font-bold text-amber-400">{club.defenseRating}</div>
                        </div>
                      </div>

                      {/* Key Stars */}
                      <div className="text-[10px] text-orange-200/80 mb-2">
                        <span className="text-orange-400 font-bold">Stars: </span>
                        {club.keyPlayers.slice(0, 3).join(', ')}
                      </div>

                      {/* Stadium */}
                      <div className="text-[10px] text-slate-400 truncate">
                        🏟️ {club.stadium}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-orange-950/80 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setUserClub(club);
                          soundFX.playKick(0.5);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-500 text-black'
                            : 'bg-orange-950/80 hover:bg-orange-600 text-white hover:text-black'
                        }`}
                      >
                        {isSelected ? '✓ My Club' : 'Select Club'}
                      </button>

                      <button
                        onClick={() => {
                          setOpponentClub(club);
                          soundFX.playKick(0.3);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isOpponent
                            ? 'bg-amber-500 text-black'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                        title="Set as Match Opponent"
                      >
                        {isOpponent ? 'Opponent' : 'vs'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: MATCHDAY & 3D SIMULATOR */}
        {activeTab === 'MATCHDAY' && (
          <div className="space-y-6">
            {/* Matchday Fixture Card */}
            <div className="rounded-3xl bg-gradient-to-r from-[#200e05] via-[#160d08] to-[#0c0d12] border-2 border-orange-500/70 p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950 text-orange-300 font-mono text-xs font-bold border border-orange-700 mb-2">
                    <Activity className="w-3.5 h-3.5 text-orange-400" />
                    <span>MATCHDAY FIXTURE • STADIUM ATMOSPHERE</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                    EUROPA LEAGUE MATCHDAY CLASH
                  </h3>
                  <p className="text-xs sm:text-sm text-orange-100/90 mt-1">
                    Play directly in 3D with authentic squad rosters, tactical controls, power shot hyper-motion, and PSP buttons.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStartUELMatch(userClub, opponentClub, 'Europa Matchday')}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-sm uppercase shadow-xl cursor-pointer active:scale-95 transition-all"
                  >
                    <Play className="w-5 h-5 fill-black" />
                    <span>LAUNCH 3D MATCH</span>
                  </button>
                </div>
              </div>

              {/* Clash Card */}
              <div className="mt-6 p-6 rounded-2xl bg-[#140f0a] border border-orange-900/60 flex flex-col md:flex-row items-center justify-around gap-6">
                {/* Home Club */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl shadow-2xl border-2 border-white/50 mb-2"
                    style={{ backgroundColor: userClub.primaryColor, color: userClub.secondaryColor }}
                  >
                    {userClub.shortName}
                  </div>
                  <div className="text-lg font-black text-white">{userClub.name}</div>
                  <div className="text-xs font-mono text-orange-300">
                    {userClub.flag} {userClub.country} • OVR {userClub.rating}
                  </div>
                  <div className="mt-2 text-xs text-slate-300 max-w-[200px]">
                    Key: {userClub.keyPlayers.slice(0, 2).join(', ')}
                  </div>
                </div>

                {/* Center VS & Stadium */}
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-600/30 border border-orange-500 flex items-center justify-center font-black text-xl text-orange-400 mx-auto">
                    VS
                  </div>
                  <div className="mt-2 text-xs font-mono text-orange-300 font-bold">
                    UEFA Europa League Official
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    🏟️ {userClub.stadium}
                  </div>
                </div>

                {/* Away Club */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl shadow-2xl border-2 border-white/50 mb-2"
                    style={{ backgroundColor: opponentClub.primaryColor, color: opponentClub.secondaryColor }}
                  >
                    {opponentClub.shortName}
                  </div>
                  <div className="text-lg font-black text-white">{opponentClub.name}</div>
                  <div className="text-xs font-mono text-orange-300">
                    {opponentClub.flag} {opponentClub.country} • OVR {opponentClub.rating}
                  </div>
                  <div className="mt-2 text-xs text-slate-300 max-w-[200px]">
                    Key: {opponentClub.keyPlayers.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STANDINGS & RESULTS TRACKER */}
        {activeTab === 'SEASON_TRACKER' && (
          <div className="space-y-6">
            {/* Monitor Header */}
            <div className="rounded-3xl bg-[#120f0c]/90 border border-orange-900/70 p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-950 mb-4">
                <div>
                  <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                    <span className="text-orange-400">2026/27 Live Standings &amp; Results Monitor</span>
                  </h3>
                  <p className="text-xs text-orange-200/80 mt-0.5">
                    Track results and latest standings for all 36 teams throughout the 2026/27 Europa League campaign.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateFullRound}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-bold text-xs shadow cursor-pointer active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span>Simulate Matchday Round {matchdayRoundNumber}</span>
                  </button>

                  <button
                    onClick={handleResetStandings}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#21160e] hover:bg-orange-950 border border-orange-800 text-orange-300 text-xs font-semibold cursor-pointer"
                    title="Reset Standings to Season Kick-off"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Latest Results Feed */}
              {lastRoundResults.length > 0 ? (
                <div>
                  <h4 className="text-xs font-mono font-bold text-orange-400 uppercase mb-3 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Latest Matchday Results ({lastRoundResults.length} Fixtures)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {lastRoundResults.map((r, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#1b140e] border border-orange-950 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <div className="flex items-center gap-1.5">
                            <span>{r.home.flag}</span>
                            <span className="truncate max-w-[100px] text-white">{r.home.name}</span>
                          </div>
                          <span className="font-mono text-orange-400">{r.homeGoals}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold mt-1">
                          <div className="flex items-center gap-1.5">
                            <span>{r.away.flag}</span>
                            <span className="truncate max-w-[100px] text-white">{r.away.name}</span>
                          </div>
                          <span className="font-mono text-orange-400">{r.awayGoals}</span>
                        </div>

                        <div className="mt-2 pt-1 border-t border-orange-950/60 text-[10px] text-orange-300/60 font-mono">
                          ⚽ Scorer: {r.scorer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-black/30 border border-orange-950 text-center">
                  <div className="text-orange-400 text-sm font-bold">No matchday simulated yet</div>
                  <p className="text-xs text-orange-200/60 mt-1">
                    Click &quot;Simulate Matchday Round {matchdayRoundNumber}&quot; to generate dynamic 18-match round results and update the 36-team standings!
                  </p>
                </div>
              )}
            </div>

            {/* Top Stars & Key Players Leaderboard */}
            <div className="rounded-3xl bg-[#120f0c]/90 border border-orange-900/70 p-6 shadow-xl">
              <h4 className="text-sm font-bold uppercase text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-400" />
                <span>Featured Europa League 2026/27 Stars</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { name: 'Florian Wirtz', club: 'Bayer Leverkusen', flag: '🇩🇪', rating: 90 },
                  { name: 'Dušan Vlahović', club: 'Juventus', flag: '🇮🇹', rating: 88 },
                  { name: 'Rafael Leão', club: 'Milan', flag: '🇮🇹', rating: 89 },
                  { name: 'Ángel Di María', club: 'Benfica', flag: '🇵🇹', rating: 86 },
                  { name: 'Eberechi Eze', club: 'Crystal Palace', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 84 },
                  { name: 'Mason Greenwood', club: 'Marseille', flag: '🇫🇷', rating: 86 },
                ].map((star, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#1b140e] border border-orange-950 text-center">
                    <div className="w-10 h-10 rounded-full bg-orange-600/30 border border-orange-400 flex items-center justify-center font-black text-sm mx-auto mb-2 text-orange-300">
                      {star.flag}
                    </div>
                    <div className="font-bold text-xs text-white truncate">{star.name}</div>
                    <div className="text-[10px] text-orange-300/80 truncate">{star.club}</div>
                    <div className="mt-1 font-mono text-[10px] text-amber-400 font-bold">OVR {star.rating}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
