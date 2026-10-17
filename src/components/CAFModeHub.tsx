/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Trophy,
  Play,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Calendar,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  Search,
  RotateCcw,
  Activity,
  Zap,
  Globe,
  Award,
  Shield,
  Layers,
} from 'lucide-react';
import type { CAFClub, CAFRound2Pairing, CAFGroup } from '../data/cafTeams.ts';
import { CAF_CLUBS, generateDefaultCAFPairings, generateDefaultCAFGroupStage } from '../data/cafTeams.ts';
import {
  simulateCAFMatch,
  simulateCAFTie,
  getQualifiedWinners,
  sortGroupClubs,
  filterCAFClubs,
} from '../logic/cafCompetition.ts';
import { soundFX } from '../game/soundFX.ts';

interface CAFModeHubProps {
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

type CAFTab = 'ROUND_2_PAIRINGS' | 'GROUP_STAGE' | 'ALL_CLUBS' | 'MATCHDAY' | 'STANDINGS_TRACKER';

export const CAFModeHub: React.FC<CAFModeHubProps> = ({
  onBackToModeChoose,
  onLaunchMatch,
}) => {
  const [activeTab, setActiveTab] = useState<CAFTab>('ROUND_2_PAIRINGS');
  const [pairings, setPairings] = useState<CAFRound2Pairing[]>(() => generateDefaultCAFPairings());
  const [userClub, setUserClub] = useState<CAFClub>(() => CAF_CLUBS[0]); // Zamalek SC default
  const [opponentClub, setOpponentClub] = useState<CAFClub>(() => CAF_CLUBS[16]); // Mamelodi Sundowns
  const [isPlayingAnthem, setIsPlayingAnthem] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');

  // Groups generated from the 16 qualified winners
  const [groups, setGroups] = useState<CAFGroup[]>(() => generateDefaultCAFGroupStage(pairings));

  // Play official CAF Champions League anthem
  const handlePlayAnthem = () => {
    setIsPlayingAnthem(true);
    soundFX.playCAFAnthemFanfare();
    setTimeout(() => setIsPlayingAnthem(false), 2800);
  };

  // Launch match in 3D simulator
  const handleStartCAFMatch = (home: CAFClub, away: CAFClub, roundName: string = '2nd Preliminary Round') => {
    soundFX.playWhistle();
    onLaunchMatch({
      homeTeamName: home.name,
      homeTeamColor: home.primaryColor,
      awayTeamName: away.name,
      awayTeamColor: away.primaryColor,
      homeTeamShort: home.shortName,
      awayTeamShort: away.shortName,
      stadiumName: `${home.stadium} (CAF Champions League)`,
      tournamentName: `TotalEnergies CAF Champions League • ${roundName}`,
    });
  };

  // Simulate an individual tie
  const handleSimulateTie = (pairIndex: number) => {
    soundFX.playKick(0.7);
    const updated = pairings.map((p) => {
      if (p.pairIndex === pairIndex) {
        return simulateCAFTie(p, Math.random());
      }
      return p;
    });
    setPairings(updated);
    setGroups(generateDefaultCAFGroupStage(updated));
  };

  // Simulate all 16 ties
  const handleSimulateAllTies = () => {
    soundFX.playKick(0.9);
    const updated = pairings.map((p) => simulateCAFTie(p, Math.random()));
    setPairings(updated);
    setGroups(generateDefaultCAFGroupStage(updated));
  };

  // Reset all ties
  const handleResetTies = () => {
    soundFX.playKick(0.3);
    const initial = generateDefaultCAFPairings();
    setPairings(initial);
    setGroups(generateDefaultCAFGroupStage(initial));
  };

  // Unique country list
  const uniqueCountries = ['ALL', ...Array.from(new Set(CAF_CLUBS.map((c) => c.country))).sort()];

  // Filtered clubs for gallery
  const filteredClubs = filterCAFClubs(CAF_CLUBS, searchQuery, countryFilter);

  return (
    <div className="w-full h-full bg-[#05130b] text-white flex flex-col justify-between p-4 sm:p-8 overflow-y-auto font-sans select-none bg-gradient-to-b from-[#082414] via-[#05170d] to-[#020b06]">
      {/* Top Header Bar */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pb-4 sm:pb-6 border-b border-emerald-900/60 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToModeChoose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#092b18] hover:bg-emerald-950 border border-emerald-700/60 text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95"
            title="Return to Main Mode Choose"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Choose Mode</span>
          </button>

          {/* CAF Champions League Emblem & Title */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-amber-500 border-2 border-emerald-300 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <Trophy className="w-6 h-6 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow flex items-center gap-1.5">
                  <span className="text-emerald-400">CAF CHAMPIONS LEAGUE</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[10px] font-mono font-bold tracking-wider">
                  32 CLUBS • 16 PAIRINGS
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 font-medium">
                TotalEnergies CAF Champions League • 2ND PRELIMINARY ROUND &amp; GROUP STAGE • 2026/27
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePlayAnthem}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold shadow cursor-pointer transition-all active:scale-95 ${
              isPlayingAnthem
                ? 'bg-emerald-400 text-black border-white animate-pulse'
                : 'bg-[#0b331d] hover:bg-emerald-900 border-emerald-500/60 text-emerald-200'
            }`}
            title="Play the iconic TotalEnergies CAF Champions League Anthem Fanfare"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{isPlayingAnthem ? 'PLAYING ANTHEM...' : 'CAF ANTHEM 🎺'}</span>
          </button>

          <button
            onClick={() => handleStartCAFMatch(userClub, opponentClub, 'African Heavyweight Clash')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs uppercase shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer transition-all active:scale-95"
            title="Play CAF Champions League match in 3D simulator"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>PLAY MATCH</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase Banner */}
      <div className="w-full max-w-7xl mx-auto my-5">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#062916] via-[#041d0f] to-[#020d07] border-2 border-emerald-500/70 p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-600/60 text-xs font-mono text-emerald-300 mb-2 shadow">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>SECOND QUALIFYING ROUND • 16 TWO-LEGGED BATTLES TO REACH THE GROUP STAGE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight drop-shadow-md">
              AFRICA&apos;S ULTIMATE CLUB GLORY
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-1 leading-relaxed">
              32 clubs from North, West, Central, East, and Southern Africa. 16 aggregate winners qualify for the prestigious 4-group stage.
              Selected club: <strong className="text-emerald-300">{userClub.name}</strong> ({userClub.country} • {userClub.cafTitles}x CAF Champions League Winner).
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-mono">
              <span className="bg-[#0b331c] px-3 py-1 rounded-lg border border-emerald-700/80 text-emerald-300 font-bold flex items-center gap-1">
                <span>🌍</span> 32 African Contenders
              </span>
              <span className="bg-[#0b331c] px-3 py-1 rounded-lg border border-emerald-700/80 text-amber-300 flex items-center gap-1">
                <span>⚔️</span> 16 Head-to-Head Pairings
              </span>
              <span className="bg-[#0b331c] px-3 py-1 rounded-lg border border-emerald-700/80 text-cyan-300 flex items-center gap-1">
                <span>🏆</span> 16 Tickets to Group Stage
              </span>
              <span className="bg-[#0b331c] px-3 py-1 rounded-lg border border-emerald-700/80 text-yellow-300 flex items-center gap-1">
                <span>💰</span> $4M Prize Purse &amp; Club World Cup
              </span>
            </div>
          </div>

          {/* Active Club Spotlight Card */}
          <div className="relative z-10 p-5 rounded-2xl bg-[#082c17]/90 border border-emerald-500/60 shadow-2xl flex flex-col items-center text-center shrink-0 min-w-[240px]">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl border-2 border-white/40 mb-2"
              style={{ backgroundColor: userClub.primaryColor, color: userClub.secondaryColor }}
            >
              {userClub.shortName}
            </div>
            <div className="font-black text-lg text-white">{userClub.name}</div>
            <div className="text-xs font-mono text-emerald-300 flex items-center gap-1">
              <span>{userClub.flag}</span>
              <span>{userClub.country}</span>
              <span>• OVR {userClub.rating}</span>
            </div>
            <div className="text-[11px] text-emerald-200 mt-1">
              Stadium: <span className="text-white font-semibold">{userClub.stadium}</span>
            </div>
            <div className="text-[10px] text-emerald-300/80 font-mono mt-0.5">
              Titles: {userClub.cafTitles}x CAF Champions League
            </div>
            <button
              onClick={() => setActiveTab('ALL_CLUBS')}
              className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer transition-all active:scale-95 shadow"
            >
              Change Club
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="w-full max-w-7xl mx-auto flex items-center gap-2 p-1.5 rounded-2xl bg-[#072414]/90 border border-emerald-900/60 mb-5 overflow-x-auto shrink-0">
        {[
          { id: 'ROUND_2_PAIRINGS' as const, label: '⚔️ 16 Head-to-Head Pairings (Round 2)' },
          { id: 'GROUP_STAGE' as const, label: '🏆 Group Stage (16 Winners)' },
          { id: 'ALL_CLUBS' as const, label: '👑 All 32 African Clubs' },
          { id: 'MATCHDAY' as const, label: '⚽ Matchday & 3D Pitch' },
          { id: 'STANDINGS_TRACKER' as const, label: '📊 Road to the Final' },
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
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 text-black shadow-lg font-black'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-950/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="w-full max-w-7xl mx-auto flex-1 mb-6">
        {/* TAB 1: 16 HEAD-TO-HEAD PAIRINGS */}
        {activeTab === 'ROUND_2_PAIRINGS' && (
          <div className="rounded-3xl bg-[#072212]/90 border border-emerald-900/70 p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-950">
              <div>
                <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                  <span className="text-emerald-400">Second Qualifying Round (16 Head-to-Head Ties)</span>
                </h3>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  The 16 aggregate winners book their tickets to the prestigious CAF Champions League Group Stage.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateAllTies}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black font-black text-xs shadow cursor-pointer active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>Simulate All 16 Ties</span>
                </button>

                <button
                  onClick={handleResetTies}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a331a] hover:bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-semibold cursor-pointer"
                  title="Reset to initial draw scores"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Grid of the 16 Pairings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {pairings.map((p) => {
                const isHomeWinner = p.winnerId === p.homeTeam.id;
                const isAwayWinner = p.winnerId === p.awayTeam.id;

                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-[#092b18] border border-emerald-900/60 hover:border-emerald-400 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      {/* Pairing Header */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 mb-3 pb-2 border-b border-emerald-950">
                        <span className="font-bold flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-emerald-600 text-black flex items-center justify-center font-black text-[10px]">
                            #{p.pairIndex}
                          </span>
                          <span>Pairing {p.pairIndex}</span>
                        </span>
                        <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded border border-emerald-800">
                          {p.homeTeam.country} {p.homeTeam.flag} vs {p.awayTeam.flag} {p.awayTeam.country}
                        </span>
                      </div>

                      {/* Home Team */}
                      <div
                        className={`flex items-center justify-between py-2 px-2.5 rounded-xl transition-all ${
                          isHomeWinner ? 'bg-emerald-950/80 border border-emerald-500/50' : 'bg-black/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{p.homeTeam.flag}</span>
                          <div
                            className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[9px] font-black shrink-0"
                            style={{ backgroundColor: p.homeTeam.primaryColor, color: p.homeTeam.secondaryColor }}
                          >
                            {p.homeTeam.shortName.substring(0, 1)}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-white block">{p.homeTeam.name}</span>
                            <span className="text-[10px] text-emerald-300/80 font-mono">
                              OVR {p.homeTeam.rating}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div className="text-[10px] font-mono text-slate-400">
                            <div>L1: {p.leg1HomeScore ?? '-'}</div>
                            <div>L2: {p.leg2AwayScore ?? '-'}</div>
                          </div>
                          <div className="font-mono text-lg font-black text-amber-300 min-w-[24px]">
                            {p.aggHomeScore}
                          </div>
                          {isHomeWinner && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-black font-mono text-[9px] font-black">
                              QUALIFIED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Away Team */}
                      <div
                        className={`flex items-center justify-between py-2 px-2.5 rounded-xl mt-2 transition-all ${
                          isAwayWinner ? 'bg-emerald-950/80 border border-emerald-500/50' : 'bg-black/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{p.awayTeam.flag}</span>
                          <div
                            className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[9px] font-black shrink-0"
                            style={{ backgroundColor: p.awayTeam.primaryColor, color: p.awayTeam.secondaryColor }}
                          >
                            {p.awayTeam.shortName.substring(0, 1)}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-white block">{p.awayTeam.name}</span>
                            <span className="text-[10px] text-emerald-300/80 font-mono">
                              OVR {p.awayTeam.rating}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div className="text-[10px] font-mono text-slate-400">
                            <div>L1: {p.leg1AwayScore ?? '-'}</div>
                            <div>L2: {p.leg2HomeScore ?? '-'}</div>
                          </div>
                          <div className="font-mono text-lg font-black text-amber-300 min-w-[24px]">
                            {p.aggAwayScore}
                          </div>
                          {isAwayWinner && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-black font-mono text-[9px] font-black">
                              QUALIFIED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pairing Footer & Actions */}
                    <div className="mt-4 pt-3 border-t border-emerald-950 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-emerald-300/70 truncate max-w-[180px]">
                        🏟️ {p.homeTeam.stadium}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSimulateTie(p.pairIndex)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 text-[10px] font-bold cursor-pointer transition-all"
                          title="Simulate 2-legged tie"
                        >
                          Simulate Tie
                        </button>

                        <button
                          onClick={() => handleStartCAFMatch(p.homeTeam, p.awayTeam, `Pairing ${p.pairIndex}`)}
                          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow"
                        >
                          <Play className="w-3 h-3 fill-black" />
                          <span>Play</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: GROUP STAGE (16 Aggregate Winners) */}
        {activeTab === 'GROUP_STAGE' && (
          <div className="rounded-3xl bg-[#072212]/90 border border-emerald-900/70 p-6 shadow-xl space-y-6">
            <div className="pb-4 border-b border-emerald-950">
              <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                <span className="text-emerald-400">CAF Champions League Group Stage</span>
                <span className="text-xs font-mono text-emerald-300 font-normal">
                  (16 Aggregate Winners • 4 Groups of 4)
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Top 2 teams from each group advance to the Quarter-Finals.
              </p>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((group) => {
                const sortedClubs = sortGroupClubs(group.clubs);

                return (
                  <div
                    key={group.name}
                    className="p-5 rounded-2xl bg-[#092b18] border border-emerald-800/80 shadow-lg"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-950">
                      <h4 className="font-black text-base uppercase text-emerald-300 flex items-center gap-2">
                        <span>🏆 {group.name}</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 border border-emerald-700">
                        Top 2 to Quarter-Finals
                      </span>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-emerald-300/70 text-[10px] font-mono border-b border-emerald-950">
                          <th className="py-2 px-1">POS</th>
                          <th className="py-2 px-2">CLUB</th>
                          <th className="py-2 px-1 text-center">MP</th>
                          <th className="py-2 px-1 text-center">W</th>
                          <th className="py-2 px-1 text-center">D</th>
                          <th className="py-2 px-1 text-center">L</th>
                          <th className="py-2 px-1 text-center">GD</th>
                          <th className="py-2 px-2 text-center font-bold text-white">PTS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-950/40">
                        {sortedClubs.map((club, idx) => {
                          const isTop2 = idx < 2;
                          const isSelected = userClub.id === club.id;

                          return (
                            <tr
                              key={club.id}
                              className={`transition-colors ${
                                isSelected ? 'bg-emerald-950/60 font-bold' : 'hover:bg-emerald-950/30'
                              }`}
                            >
                              <td className="py-2.5 px-1 font-mono">
                                <span
                                  className={`w-5 h-5 rounded flex items-center justify-center text-[10px] ${
                                    isTop2
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                                      : 'bg-black/30 text-slate-400'
                                  }`}
                                >
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="py-2.5 px-2">
                                <div className="flex items-center gap-1.5">
                                  <span>{club.flag}</span>
                                  <span className="truncate max-w-[130px] font-semibold text-white">
                                    {club.name}
                                  </span>
                                  {club.cafTitles > 0 && (
                                    <span className="text-[9px] text-amber-400 font-mono">
                                      ⭐{club.cafTitles}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-2.5 px-1 text-center font-mono">{club.matchesPlayed}</td>
                              <td className="py-2.5 px-1 text-center font-mono text-emerald-400">{club.won}</td>
                              <td className="py-2.5 px-1 text-center font-mono text-slate-400">{club.drawn}</td>
                              <td className="py-2.5 px-1 text-center font-mono text-rose-400">{club.lost}</td>
                              <td className="py-2.5 px-1 text-center font-mono font-bold text-emerald-300">
                                {club.goalDiff > 0 ? `+${club.goalDiff}` : club.goalDiff}
                              </td>
                              <td className="py-2.5 px-2 text-center font-mono font-black text-amber-300">
                                {club.points}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ALL 32 AFRICAN CLUBS GALLERY */}
        {activeTab === 'ALL_CLUBS' && (
          <div className="rounded-3xl bg-[#072212]/90 border border-emerald-900/70 p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-emerald-950">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search from 32 African clubs or stars..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#092b18] border border-emerald-800 text-white text-xs placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    aria-label="Filter clubs by African nation"
                    className="px-3 py-2 rounded-xl bg-[#092b18] border border-emerald-800 text-emerald-200 text-xs font-semibold focus:outline-none focus:border-emerald-400"
                  >
                    {uniqueCountries.map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {c === 'ALL' ? '🌍 All Nations (32)' : c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs font-mono text-emerald-300">
                Showing <strong className="text-white">{filteredClubs.length}</strong> of 32 clubs
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
                    className={`p-4 rounded-2xl bg-[#092b18] border transition-all flex flex-col justify-between shadow-lg ${
                      isSelected
                        ? 'border-emerald-400 ring-2 ring-emerald-500/40 bg-emerald-950/60'
                        : isOpponent
                        ? 'border-amber-400 bg-amber-950/20'
                        : 'border-emerald-950 hover:border-emerald-700'
                    }`}
                  >
                    <div>
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
                            <div className="text-[10px] font-mono text-emerald-300/80 flex items-center gap-1">
                              <span>{club.flag}</span>
                              <span>{club.country}</span>
                            </div>
                          </div>
                        </div>

                        <div className="px-2 py-1 rounded bg-black/50 border border-emerald-800/60 font-mono font-bold text-xs text-emerald-400">
                          {club.rating}
                        </div>
                      </div>

                      {/* Ratings */}
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono bg-black/30 p-1.5 rounded-lg mb-3">
                        <div>
                          <div className="text-emerald-300/60 text-[9px]">ATT</div>
                          <div className="font-bold text-emerald-400">{club.attackRating}</div>
                        </div>
                        <div>
                          <div className="text-emerald-300/60 text-[9px]">MID</div>
                          <div className="font-bold text-cyan-400">{club.midfieldRating}</div>
                        </div>
                        <div>
                          <div className="text-emerald-300/60 text-[9px]">DEF</div>
                          <div className="font-bold text-amber-400">{club.defenseRating}</div>
                        </div>
                      </div>

                      {/* Key Stars */}
                      <div className="text-[10px] text-emerald-200/80 mb-2">
                        <span className="text-emerald-400 font-bold">Stars: </span>
                        {club.keyPlayers.slice(0, 3).join(', ')}
                      </div>

                      {/* Stadium */}
                      <div className="text-[10px] text-slate-400 truncate">
                        🏟️ {club.stadium}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-emerald-950 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setUserClub(club);
                          soundFX.playKick(0.5);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-black'
                            : 'bg-emerald-950/80 hover:bg-emerald-600 text-white hover:text-black'
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

        {/* TAB 4: MATCHDAY & 3D PITCH */}
        {activeTab === 'MATCHDAY' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-[#092b18] via-[#051c10] to-[#030d07] border-2 border-emerald-500/70 p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-700 mb-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CAF CHAMPIONS LEAGUE MATCHDAY</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                    AFRICAN CONTINENTAL CLASH
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                    Play with authentic African squads, roar of the crowd, tactical boards, and PSP handheld controls.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStartCAFMatch(userClub, opponentClub, 'Championship Clash')}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm uppercase shadow-xl cursor-pointer active:scale-95 transition-all"
                  >
                    <Play className="w-5 h-5 fill-black" />
                    <span>LAUNCH 3D PITCH</span>
                  </button>
                </div>
              </div>

              {/* Clash Card */}
              <div className="mt-6 p-6 rounded-2xl bg-[#041a0e] border border-emerald-900/60 flex flex-col md:flex-row items-center justify-around gap-6">
                {/* Home Club */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl shadow-2xl border-2 border-white/50 mb-2"
                    style={{ backgroundColor: userClub.primaryColor, color: userClub.secondaryColor }}
                  >
                    {userClub.shortName}
                  </div>
                  <div className="text-lg font-black text-white">{userClub.name}</div>
                  <div className="text-xs font-mono text-emerald-300">
                    {userClub.flag} {userClub.country} • OVR {userClub.rating}
                  </div>
                  <div className="mt-2 text-xs text-slate-300 max-w-[200px]">
                    Stars: {userClub.keyPlayers.slice(0, 2).join(', ')}
                  </div>
                </div>

                {/* Center VS */}
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center font-black text-xl text-emerald-400 mx-auto">
                    VS
                  </div>
                  <div className="mt-2 text-xs font-mono text-emerald-300 font-bold">
                    CAF Champions League 2026/27
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
                  <div className="text-xs font-mono text-emerald-300">
                    {opponentClub.flag} {opponentClub.country} • OVR {opponentClub.rating}
                  </div>
                  <div className="mt-2 text-xs text-slate-300 max-w-[200px]">
                    Stars: {opponentClub.keyPlayers.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ROAD TO THE FINAL */}
        {activeTab === 'STANDINGS_TRACKER' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-[#072212]/90 border border-emerald-900/70 p-6 shadow-xl">
              <div className="pb-4 border-b border-emerald-950 mb-4">
                <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                  <span className="text-emerald-400">Road to the CAF Champions League Grand Final</span>
                </h3>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Follow the tournament pathway: 2nd Preliminary Round (32 clubs / 16 ties) ➔ Group Stage (16 clubs / 4 groups) ➔ Quarter-Finals ➔ Semi-Finals ➔ The Grand Final.
                </p>
              </div>

              {/* Tournament Pathway Milestones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#092b18] border border-emerald-700/80">
                  <div className="text-xs font-mono text-emerald-400 font-bold mb-1">STAGE 1 (ACTIVE)</div>
                  <div className="text-base font-black text-white">2nd Preliminary Round</div>
                  <p className="text-[11px] text-emerald-200/80 mt-1">
                    32 teams in 16 head-to-head 2-legged ties. Aggregate winners advance.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#092b18] border border-emerald-800">
                  <div className="text-xs font-mono text-amber-400 font-bold mb-1">STAGE 2</div>
                  <div className="text-base font-black text-white">Group Stage</div>
                  <p className="text-[11px] text-emerald-200/80 mt-1">
                    4 groups of 4 teams. Top 2 from each group advance to Quarter-Finals.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#092b18] border border-emerald-800">
                  <div className="text-xs font-mono text-cyan-400 font-bold mb-1">STAGE 3</div>
                  <div className="text-base font-black text-white">Knockout Stage</div>
                  <p className="text-[11px] text-emerald-200/80 mt-1">
                    8 Quarter-Finalists battle over home-and-away legs to reach the Final.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#092b18] border border-yellow-500/80 bg-gradient-to-br from-[#092b18] to-amber-950/40">
                  <div className="text-xs font-mono text-yellow-300 font-bold mb-1">THE CLIMAX</div>
                  <div className="text-base font-black text-white">The Grand Final</div>
                  <p className="text-[11px] text-emerald-200/80 mt-1">
                    Cairo International Stadium / Stade Mohammed V / Loftus Versfeld.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
