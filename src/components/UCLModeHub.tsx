/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Trophy,
  Play,
  Star,
  Shield,
  Award,
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
  Tv,
} from 'lucide-react';
import { UCL_CLUBS, UCLClub, KnockoutMatch, generateDefaultKnockoutMatches } from '../data/uclTeams.ts';
import { soundFX } from '../game/soundFX.ts';

interface UCLModeHubProps {
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

type UCLTab = 'LEAGUE_PHASE' | 'KNOCKOUT_TREE' | 'SELECT_CLUB' | 'MATCHDAY';

export const UCLModeHub: React.FC<UCLModeHubProps> = ({
  onBackToModeChoose,
  onLaunchMatch,
}) => {
  const [activeTab, setActiveTab] = useState<UCLTab>('LEAGUE_PHASE');
  const [userClub, setUserClub] = useState<UCLClub>(() => UCL_CLUBS[0]); // Real Madrid default
  const [opponentClub, setOpponentClub] = useState<UCLClub>(() => UCL_CLUBS[1]); // Manchester City
  const [knockoutMatches] = useState<KnockoutMatch[]>(() => generateDefaultKnockoutMatches());
  const [isPlayingAnthem, setIsPlayingAnthem] = useState<boolean>(false);

  // Play UCL Anthem Fanfare
  const handlePlayAnthem = () => {
    setIsPlayingAnthem(true);
    soundFX.playUCLAnthemFanfare();
    setTimeout(() => setIsPlayingAnthem(false), 2800);
  };

  // Launch UCL Match Simulator
  const handleStartUCLMatch = (home: UCLClub, away: UCLClub, roundName: string = 'League Phase') => {
    soundFX.playWhistle();
    onLaunchMatch({
      homeTeamName: home.name,
      homeTeamColor: home.primaryColor,
      awayTeamName: away.name,
      awayTeamColor: away.primaryColor,
      homeTeamShort: home.shortName,
      awayTeamShort: away.shortName,
      stadiumName: `${home.stadium} (UEFA Champions League)`,
      tournamentName: `UEFA Champions League • ${roundName}`,
    });
  };

  return (
    <div className="w-full h-full bg-[#020819] text-white flex flex-col justify-between p-4 sm:p-8 overflow-y-auto font-sans select-none bg-gradient-to-b from-[#041133] via-[#020b24] to-[#010512]">
      {/* Top Header Bar */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pb-4 sm:pb-6 border-b border-indigo-900/60 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToModeChoose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#071744] hover:bg-indigo-900 border border-indigo-700/80 text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95"
            title="Return to Main Mode Choose"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Choose Mode</span>
          </button>

          {/* UCL Starball & Title */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-950 to-blue-900 border-2 border-cyan-400/80 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)]">
              {/* Starball SVG */}
              <svg className="w-6 h-6 text-cyan-300" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow flex items-center gap-1.5">
                  <span>UEFA CHAMPIONS LEAGUE</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-cyan-300 border border-cyan-500/50 text-[10px] font-mono font-bold tracking-wider">
                  36-TEAM FORMAT
                </span>
              </div>
              <p className="text-[11px] text-indigo-200 font-medium">
                CE SONT LES MEILLEURS • DIE MEISTER • DIE BESTEN • LES GRANDES ÉQUIPES • THE CHAMPIONS
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
                ? 'bg-cyan-500 text-black border-white animate-pulse'
                : 'bg-[#0a1f5c] hover:bg-indigo-900 border-cyan-500/60 text-cyan-200'
            }`}
            title="Play the iconic UEFA Champions League Anthem Fanfare"
          >
            <Volume2 className="w-4 h-4 text-cyan-300" />
            <span className="hidden sm:inline">{isPlayingAnthem ? 'PLAYING ANTHEM...' : 'UCL ANTHEM 🎺'}</span>
          </button>

          <button
            onClick={() => handleStartUCLMatch(userClub, opponentClub, 'Grand Match')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase shadow-[0_0_20px_rgba(56,189,248,0.5)] cursor-pointer transition-all active:scale-95"
            title="Play Champions League Match with selected club"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>PLAY MATCH</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase Banner with Starry Ambient Glow */}
      <div className="w-full max-w-7xl mx-auto my-5">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#06174a] via-[#030f33] to-[#010921] border-2 border-indigo-500/70 p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Subtle starry background circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-700 text-xs font-mono text-cyan-300 mb-2 shadow">
              <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>THE ULTIMATE EUROPEAN CLUB FOOTBALL STAGE • MUNICH 2025 / LONDON 2026</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight drop-shadow-md">
              THE CHIEFS • EUROPEAN GLORY
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1 leading-relaxed">
              Command Europe&apos;s football royalty in the prestigious single league phase and high-stakes knockout stages.
              Selected club: <strong className="text-cyan-300">{userClub.name}</strong> ({userClub.uclTitles}x Champions League Winner).
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-mono">
              <span className="bg-[#071b52] px-3 py-1 rounded-lg border border-indigo-700 text-cyan-300 font-bold">
                ⭐ 36 Elite European Clubs
              </span>
              <span className="bg-[#071b52] px-3 py-1 rounded-lg border border-indigo-700 text-indigo-200">
                🏆 Top 8 Direct to Round of 16
              </span>
              <span className="bg-[#071b52] px-3 py-1 rounded-lg border border-indigo-700 text-amber-300">
                💰 €100M Prize Purse
              </span>
            </div>
          </div>

          {/* Active Club Spotlight Card */}
          <div className="relative z-10 p-5 rounded-2xl bg-[#05143d]/90 border border-cyan-500/50 shadow-2xl flex flex-col items-center text-center shrink-0 min-w-[240px]">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl border-2 border-white/40 mb-2"
              style={{ backgroundColor: userClub.primaryColor, color: userClub.secondaryColor }}
            >
              {userClub.shortName}
            </div>
            <div className="font-black text-lg text-white">{userClub.name}</div>
            <div className="text-xs font-mono text-cyan-300 flex items-center gap-1">
              <span>{userClub.flag}</span>
              <span>{userClub.country}</span>
              <span>• OVR {userClub.rating}</span>
            </div>
            <div className="text-[11px] text-indigo-300 mt-1">
              Trophy Count: <span className="text-amber-400 font-bold">{userClub.uclTitles}x UCL</span>
            </div>
            <button
              onClick={() => setActiveTab('SELECT_CLUB')}
              className="mt-3 px-3 py-1.5 rounded-xl bg-indigo-900/90 hover:bg-indigo-800 text-white font-bold text-xs border border-indigo-600 cursor-pointer transition-all"
            >
              Change Club
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="w-full max-w-7xl mx-auto flex items-center gap-2 p-1.5 rounded-2xl bg-indigo-950/70 border border-indigo-800/80 mb-5 overflow-x-auto shrink-0">
        {[
          { id: 'LEAGUE_PHASE' as const, label: '🏆 36-Team League Phase Table' },
          { id: 'KNOCKOUT_TREE' as const, label: '⚔️ Knockout Bracket & Final' },
          { id: 'SELECT_CLUB' as const, label: '👑 Choose European Club' },
          { id: 'MATCHDAY' as const, label: '⚽ Champions Matchday' },
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
                  ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg border border-cyan-400'
                  : 'text-indigo-200 hover:text-white hover:bg-indigo-900/60'
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
          <div className="rounded-3xl bg-[#041133]/90 border border-indigo-800 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-900/80 mb-4">
                <div>
                  <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                    <span>UEFA Champions League Standings</span>
                    <span className="text-xs font-mono text-cyan-300 font-normal">
                      (Unified 36-Team League Phase)
                    </span>
                  </h3>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Top 8 automatically qualify for the Round of 16. Positions 9–24 enter the 2-legged Knockout Play-offs.
                  </p>
                </div>

                {/* Legend Badges */}
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Top 8: Direct Round of 16
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    9–24: Play-off Phase
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="text-indigo-300 border-b border-indigo-900/60 text-[11px] font-mono">
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
                      <th className="py-2.5 px-3 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-950/80">
                    {UCL_CLUBS.map((club, idx) => {
                      const pos = idx + 1;
                      const isTop8 = pos <= 8;
                      const isPlayoff = pos > 8 && pos <= 24;
                      const isSelected = userClub.id === club.id;

                      return (
                        <tr
                          key={club.id}
                          className={`transition-colors ${
                            isSelected
                              ? 'bg-blue-900/40 border-l-4 border-cyan-400'
                              : 'hover:bg-indigo-900/30'
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-bold">
                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] ${
                                isTop8
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : isPlayoff
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {pos}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{club.flag}</span>
                              <div
                                className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[9px] font-black shrink-0"
                                style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                              >
                                {club.shortName.substring(0, 1)}
                              </div>
                              <span className="font-bold text-white text-xs">{club.name}</span>
                              {club.uclTitles > 0 && (
                                <span className="text-[10px] text-amber-400 font-mono flex items-center gap-0.5">
                                  ⭐ {club.uclTitles}
                                </span>
                              )}
                              {isSelected && (
                                <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-black font-mono text-[9px] font-bold">
                                  YOU
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center font-mono">{club.matchesPlayed}</td>
                          <td className="py-3 px-2 text-center font-mono text-emerald-400">{club.won}</td>
                          <td className="py-3 px-2 text-center font-mono text-slate-400">{club.drawn}</td>
                          <td className="py-3 px-2 text-center font-mono text-rose-400">{club.lost}</td>
                          <td className="py-3 px-2 text-center font-mono">{club.goalsFor}</td>
                          <td className="py-3 px-2 text-center font-mono">{club.goalsAgainst}</td>
                          <td className="py-3 px-2 text-center font-mono font-bold text-cyan-300">
                            {club.goalDiff > 0 ? `+${club.goalDiff}` : club.goalDiff}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-black text-sm text-yellow-300">
                            {club.points}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => {
                                setUserClub(club);
                                soundFX.playKick(0.5);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-900/80 hover:bg-cyan-600 text-white font-bold text-[10px] cursor-pointer transition-all"
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
            <div className="rounded-3xl bg-gradient-to-r from-[#170a3d] via-[#09154a] to-[#041133] border-2 border-yellow-500/80 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-300 font-mono text-xs font-bold border border-amber-800 mb-2">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span>THE GRAND FINAL • ALLIANZ ARENA MUNICH</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                  UEFA CHAMPIONS LEAGUE FINAL
                </h3>
                <p className="text-xs sm:text-sm text-indigo-100 mt-1 leading-relaxed">
                  The crowning match of club football. Compete for the iconic Big Ears trophy with authentic European crowd chants and stadium atmosphere.
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => handleStartUCLMatch(userClub, opponentClub, 'Grand Final')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Trophy className="w-4 h-4 fill-slate-950" />
                    <span>PLAY THE GRAND FINAL</span>
                  </button>
                </div>
              </div>

              {/* Matchup Preview */}
              <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-700 flex items-center gap-4 shrink-0 shadow-xl">
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg mx-auto border border-white/40"
                    style={{ backgroundColor: userClub.primaryColor, color: userClub.secondaryColor }}
                  >
                    {userClub.shortName}
                  </div>
                  <div className="font-bold text-xs text-white mt-1">{userClub.name}</div>
                </div>

                <div className="text-amber-400 font-black text-lg font-mono">VS</div>

                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg mx-auto border border-white/40"
                    style={{ backgroundColor: opponentClub.primaryColor, color: opponentClub.secondaryColor }}
                  >
                    {opponentClub.shortName}
                  </div>
                  <div className="font-bold text-xs text-white mt-1">{opponentClub.name}</div>
                </div>
              </div>
            </div>

            {/* Knockout Match Fixtures Grid */}
            <div className="rounded-3xl bg-[#041133]/90 border border-indigo-800 p-6 shadow-xl">
              <h4 className="text-base font-bold uppercase text-white mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Round of 16 &amp; Quarter-Final Fixtures</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {knockoutMatches.slice(0, 8).map((match) => (
                  <div
                    key={match.id}
                    className="p-3.5 rounded-2xl bg-indigo-950/70 border border-indigo-800 hover:border-cyan-400 transition-all flex flex-col justify-between shadow"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 mb-2">
                        <span>{match.round}</span>
                        <span>{match.leg}</span>
                      </div>

                      {/* Home Team */}
                      <div className="flex items-center justify-between py-1 border-b border-indigo-900/50">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <span>{match.homeTeam.flag}</span>
                          <span className="truncate max-w-[120px]">{match.homeTeam.name}</span>
                        </div>
                        <span className="font-mono font-bold text-cyan-300">{match.homeScore ?? '-'}</span>
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <span>{match.awayTeam.flag}</span>
                          <span className="truncate max-w-[120px]">{match.awayTeam.name}</span>
                        </div>
                        <span className="font-mono font-bold text-cyan-300">{match.awayScore ?? '-'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartUCLMatch(match.homeTeam, match.awayTeam, match.round)}
                      className="mt-3 w-full py-1.5 rounded-lg bg-indigo-900 hover:bg-cyan-600 text-white font-bold text-[10px] uppercase shadow transition-all cursor-pointer"
                    >
                      Play Match
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHOOSE EUROPEAN CLUB */}
        {activeTab === 'SELECT_CLUB' && (
          <div className="rounded-3xl bg-[#041133]/90 border border-indigo-800 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-indigo-900/80 mb-5">
              <div>
                <h3 className="text-xl font-black uppercase text-white">Select Your Champions League Club</h3>
                <p className="text-xs text-indigo-200">
                  Pick any of the licensed European powerhouses to lead into the Champions League campaign.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {UCL_CLUBS.map((club) => {
                const isSelected = userClub.id === club.id;
                return (
                  <div
                    key={club.id}
                    onClick={() => {
                      setUserClub(club);
                      soundFX.playKick(0.5);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-900 to-blue-900 border-2 border-cyan-400 shadow-xl scale-102'
                        : 'bg-indigo-950/60 hover:bg-indigo-900/40 border-indigo-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border border-white/40 shadow"
                          style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                        >
                          {club.shortName}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-base">{club.flag}</span>
                          <span className="px-2 py-0.5 rounded bg-black/40 text-cyan-300 font-mono text-[10px] font-bold">
                            OVR {club.rating}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-black text-sm text-white">{club.name}</h4>
                      <p className="text-[11px] text-indigo-200 mt-0.5">{club.stadium}</p>

                      <div className="mt-3 space-y-1 text-[11px] font-mono">
                        <div className="flex justify-between text-slate-300">
                          <span>Attack / Defense</span>
                          <span className="text-cyan-300">{club.attackRating} / {club.defenseRating}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>UCL Titles</span>
                          <span className="text-amber-400 font-bold">{club.uclTitles}x Champions</span>
                        </div>
                      </div>

                      <div className="mt-2 text-[10px] text-indigo-300">
                        <strong className="text-white">Stars:</strong> {club.keyPlayers.slice(0, 2).join(', ')}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-indigo-900/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400">
                        {isSelected ? '✓ ACTIVE CLUB' : 'CLICK TO SELECT'}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: MATCHDAY PLAY HUB */}
        {activeTab === 'MATCHDAY' && (
          <div className="rounded-3xl bg-[#041133]/90 border border-indigo-800 p-6 sm:p-8 shadow-xl flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 text-cyan-300 font-mono text-xs font-bold border border-indigo-700 mb-3">
              <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>OFFICIAL UEFA CHAMPIONS LEAGUE MATCHDAY</span>
            </div>
            <h3 className="text-3xl font-black uppercase text-white">READY FOR EUROPEAN KICK-OFF</h3>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-lg mt-1">
              {userClub.stadium} • Floodlit Night • Starball Physics Engine
            </p>

            {/* Stadium Pitch Face-off */}
            <div className="my-6 p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-[#07194f] to-indigo-950 border-2 border-cyan-500/60 max-w-2xl w-full shadow-2xl flex items-center justify-around">
              {/* Home Club */}
              <div className="flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl border-2 border-white/50 mb-2"
                  style={{ backgroundColor: userClub.primaryColor, color: userClub.secondaryColor }}
                >
                  {userClub.shortName}
                </div>
                <div className="font-black text-base text-white">{userClub.name}</div>
                <div className="text-xs font-mono text-cyan-300">{userClub.flag} Home Team</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-3xl font-black text-amber-400 font-mono">VS</div>
                <div className="text-[10px] font-mono text-indigo-300 mt-1">20:00 CET</div>
              </div>

              {/* Away Club */}
              <div className="flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl border-2 border-white/50 mb-2"
                  style={{ backgroundColor: opponentClub.primaryColor, color: opponentClub.secondaryColor }}
                >
                  {opponentClub.shortName}
                </div>
                <div className="font-black text-base text-white">{opponentClub.name}</div>
                <div className="text-xs font-mono text-cyan-300">{opponentClub.flag} Away Team</div>
              </div>
            </div>

            {/* Launch Match Button */}
            <button
              onClick={() => handleStartUCLMatch(userClub, opponentClub, 'Championship Clash')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(56,189,248,0.7)] cursor-pointer transition-all active:scale-95 flex items-center gap-3"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>START 3D CHAMPIONS LEAGUE MATCH</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation CTA */}
      <div className="w-full max-w-7xl mx-auto pt-4 border-t border-indigo-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="text-xs text-indigo-200 font-mono">
          <span>UEFA Champions League • Official Licensed European Tournament • 3D PSP Simulator</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToModeChoose}
            className="px-4 py-2 rounded-xl bg-[#071744] hover:bg-indigo-900 text-white font-bold text-xs cursor-pointer border border-indigo-800 transition-all"
          >
            Return to Mode Choose
          </button>
          <button
            onClick={() => handleStartUCLMatch(userClub, opponentClub, 'Exhibition')}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase shadow cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Quick Match</span>
          </button>
        </div>
      </div>
    </div>
  );
};
