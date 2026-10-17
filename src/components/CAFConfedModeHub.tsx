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
  Flame,
} from 'lucide-react';
import type { CAFConfedClub, CAFConfedPairing, CAFConfedGroup } from '../data/cafConfedTeams.ts';
import {
  CAF_CONFED_CLUBS,
  generateDefaultCAFConfedPairings,
  generateDefaultCAFConfedGroupStage,
} from '../data/cafConfedTeams.ts';
import {
  simulateCAFConfedMatch,
  simulateCAFConfedTie,
  simulateAllCAFConfedTies,
  getQualifiedConfedWinners,
  sortConfedGroupClubs,
  filterCAFConfedClubs,
} from '../logic/cafConfedCompetition.ts';
import { soundFX } from '../game/soundFX.ts';

interface CAFConfedModeHubProps {
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

type ConfedTab = 'ROUND_2_PAIRINGS' | 'GROUP_STAGE' | 'ALL_CLUBS' | 'MATCHDAY' | 'ROAD_TO_FINAL';

export const CAFConfedModeHub: React.FC<CAFConfedModeHubProps> = ({
  onBackToModeChoose,
  onLaunchMatch,
}) => {
  const [activeTab, setActiveTab] = useState<ConfedTab>('ROUND_2_PAIRINGS');
  const [pairings, setPairings] = useState<CAFConfedPairing[]>(() => generateDefaultCAFConfedPairings());
  const [userClub, setUserClub] = useState<CAFConfedClub>(() => CAF_CONFED_CLUBS[0]); // Al Ahly SC (Cairo) default
  const [opponentClub, setOpponentClub] = useState<CAFConfedClub>(() => CAF_CONFED_CLUBS[10]); // Raja Club Athletic
  const [isPlayingAnthem, setIsPlayingAnthem] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');

  // Groups generated from the 16 qualified aggregate winners
  const [groups, setGroups] = useState<CAFConfedGroup[]>(() => generateDefaultCAFConfedGroupStage(pairings));

  // Play official CAF Confederation Cup anthem
  const handlePlayAnthem = () => {
    setIsPlayingAnthem(true);
    soundFX.playCAFConfedFanfare();
    setTimeout(() => setIsPlayingAnthem(false), 2800);
  };

  // Launch match in 3D simulator
  const handleStartConfedMatch = (home: CAFConfedClub, away: CAFConfedClub, roundName = '2nd Preliminary Round') => {
    soundFX.playWhistle();
    onLaunchMatch({
      homeTeamName: home.name,
      homeTeamColor: home.primaryColor,
      awayTeamName: away.name,
      awayTeamColor: away.primaryColor,
      homeTeamShort: home.shortName,
      awayTeamShort: away.shortName,
      stadiumName: `${home.stadium} (CAF Confederation Cup)`,
      tournamentName: `TotalEnergies CAF Confederation Cup • ${roundName}`,
    });
  };

  // Simulate an individual tie
  const handleSimulateTie = (pairIndex: number) => {
    soundFX.playKick(0.7);
    const updated = pairings.map((p) => {
      if (p.pairIndex === pairIndex) {
        return simulateCAFConfedTie(p, Math.random());
      }
      return p;
    });
    setPairings(updated);
    setGroups(generateDefaultCAFConfedGroupStage(updated));
  };

  // Simulate all 16 ties
  const handleSimulateAllTies = () => {
    soundFX.playKick(0.9);
    const updated = simulateAllCAFConfedTies(pairings, Math.random());
    setPairings(updated);
    setGroups(generateDefaultCAFConfedGroupStage(updated));
  };

  // Reset all ties
  const handleResetTies = () => {
    soundFX.playKick(0.3);
    const initial = generateDefaultCAFConfedPairings();
    setPairings(initial);
    setGroups(generateDefaultCAFConfedGroupStage(initial));
  };

  // Unique country list
  const uniqueCountries = ['ALL', ...Array.from(new Set(CAF_CONFED_CLUBS.map((c) => c.country))).sort()];

  // Filtered clubs for gallery
  const filteredClubs = filterCAFConfedClubs(CAF_CONFED_CLUBS, searchQuery, countryFilter);

  return (
    <div className="w-full h-full bg-[#180a03] text-white flex flex-col justify-between p-4 sm:p-8 overflow-y-auto font-sans select-none bg-gradient-to-b from-[#2b1205] via-[#1a0a03] to-[#0d0502]">
      {/* Top Header Bar */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pb-4 sm:pb-6 border-b border-amber-900/60 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToModeChoose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#351505] hover:bg-amber-950 border border-amber-700/60 text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95"
            title="Return to Main Mode Choose"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Choose Mode</span>
          </button>

          {/* CAF Confederation Cup Emblem & Title */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 border-2 border-amber-300 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              <Trophy className="w-6 h-6 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow flex items-center gap-1.5">
                  <span className="text-amber-400">CAF CONFEDERATION CUP</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/60 text-[10px] font-mono font-bold tracking-wider">
                  32 CLUBS • 16 TIES
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 font-medium">
                TotalEnergies CAF Confederation Cup • 2ND PRELIMINARY ROUND &amp; GROUP STAGE • 2026/27
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
                ? 'bg-amber-400 text-black border-white animate-pulse'
                : 'bg-[#3b1706] hover:bg-amber-900 border-amber-500/60 text-amber-200'
            }`}
            title="Play the iconic TotalEnergies CAF Confederation Cup Anthem Fanfare"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{isPlayingAnthem ? 'PLAYING ANTHEM...' : 'CAF CONFED ANTHEM 🎺'}</span>
          </button>

          <button
            onClick={() => handleStartConfedMatch(userClub, opponentClub, 'Continental Showdown')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer transition-all active:scale-95"
            title="Play CAF Confederation Cup match in 3D simulator"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>PLAY MATCH</span>
          </button>
        </div>
      </div>

      {/* Hero Active Club Banner */}
      <div className="w-full max-w-7xl mx-auto my-4 shrink-0">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#291004] via-[#1f0d04] to-[#120702] border-2 border-amber-600/60 p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex-1 space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-xs font-mono text-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>SECOND QUALIFYING ROUND • 16 TWO-LEGGED BATTLES TO REACH THE GROUP STAGE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow">
              AFRICA&apos;S PRESTIGIOUS CONTINENTAL CUP
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-3xl leading-relaxed">
              32 clubs from North, West, Central, East, and Southern Africa. 16 aggregate winners qualify for the prestigious 4-group stage. Selected club:{' '}
              <span className="font-extrabold text-amber-300">{userClub.name}</span> ({userClub.country}
              {userClub.confedTitles > 0 ? ` • ${userClub.confedTitles}x Confederation Cup Winner` : ''}).
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-xl bg-amber-950/90 border border-amber-700/60 text-xs font-bold text-amber-200">
                🌍 32 African Contenders
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-950/90 border border-amber-700/60 text-xs font-bold text-amber-200">
                ⚔️ 16 Head-to-Head Pairings
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-950/90 border border-amber-700/60 text-xs font-bold text-amber-200">
                🏆 16 Tickets to Group Stage
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-950/90 border border-amber-700/60 text-xs font-bold text-amber-200">
                💰 $2M Prize Purse &amp; CAF Super Cup
              </span>
            </div>
          </div>

          {/* User Club Badge Card */}
          <div className="z-10 shrink-0 bg-[#351505]/90 border border-amber-600/70 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-xl min-w-[200px]">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg border-2 border-white/20"
              style={{
                backgroundColor: userClub.primaryColor,
                color: userClub.secondaryColor,
              }}
            >
              {userClub.shortName}
            </div>
            <div className="text-center">
              <div className="text-base font-black text-white">{userClub.name}</div>
              <div className="text-xs text-amber-300 font-bold flex items-center justify-center gap-1">
                <span>{userClub.flag}</span>
                <span>{userClub.country}</span>
                <span>• OVR {userClub.rating}</span>
              </div>
              <div className="text-[10px] text-amber-200/80 font-mono mt-0.5">
                Stadium: {userClub.stadium.split(',')[0]}
              </div>
              {userClub.confedTitles > 0 && (
                <div className="text-[10px] text-amber-400 font-bold mt-0.5">
                  Titles: {userClub.confedTitles}x Confederation Cup
                </div>
              )}
            </div>
            <button
              onClick={() => setActiveTab('ALL_CLUBS')}
              className="mt-1 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] shadow cursor-pointer transition-all active:scale-95"
            >
              Change Club
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full max-w-7xl mx-auto flex items-center gap-2 p-1 bg-[#240d04]/80 border border-amber-900/60 rounded-2xl overflow-x-auto shrink-0 my-2">
        {[
          { id: 'ROUND_2_PAIRINGS' as const, label: '16 Head-to-Head Pairings (Round 2)', icon: Zap },
          { id: 'GROUP_STAGE' as const, label: 'Group Stage (16 Winners)', icon: Trophy },
          { id: 'ALL_CLUBS' as const, label: 'All 32 African Clubs', icon: Award },
          { id: 'MATCHDAY' as const, label: 'Matchday & 3D Pitch', icon: Play },
          { id: 'ROAD_TO_FINAL' as const, label: 'Road to the Final', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playKick(0.3);
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-900/40'
                  : 'text-amber-200 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto flex-1 my-3">
        {/* TAB 1: 16 HEAD-TO-HEAD PAIRINGS (ROUND 2) */}
        {activeTab === 'ROUND_2_PAIRINGS' && (
          <div className="bg-[#240d04]/90 border border-amber-900/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-amber-900/60 mb-5 gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-black uppercase text-white flex items-center gap-2">
                  <span>SECOND QUALIFYING ROUND (16 HEAD-TO-HEAD TIES)</span>
                </h3>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  The 16 aggregate winners book their tickets to the prestigious CAF Confederation Cup Group Stage.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateAllTies}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs shadow cursor-pointer transition-all active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>Simulate All 16 Ties</span>
                </button>
                <button
                  onClick={handleResetTies}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3b1706] hover:bg-amber-900 border border-amber-700/60 text-amber-200 font-bold text-xs shadow cursor-pointer transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* 16 Pairings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pairings.map((pairing) => {
                const teamAWon = pairing.winnerId === pairing.teamA.id;
                const teamBWon = pairing.winnerId === pairing.teamB.id;

                return (
                  <div
                    key={pairing.id}
                    className="relative bg-[#180a03]/90 border border-amber-900/70 hover:border-amber-500/80 rounded-2xl p-4 transition-all hover:bg-[#200e04] shadow-lg flex flex-col justify-between"
                  >
                    {/* Header info: Pair Index + Country Flags + Initial Status */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 pb-2 mb-2 border-b border-amber-900/40">
                      <span className="px-2 py-0.5 rounded-md bg-amber-950 font-bold text-amber-400">
                        #{pairing.pairIndex} Pairing {pairing.pairIndex}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-900/40 text-amber-200 font-bold border border-amber-700/40">
                        {pairing.firstLegStatus}
                      </span>
                      <span className="text-amber-400 font-bold">
                        {pairing.teamA.country} {pairing.teamA.flag} vs {pairing.teamB.flag} {pairing.teamB.country}
                      </span>
                    </div>

                    {/* Team A Row */}
                    <div
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                        teamAWon ? 'bg-amber-950/70 border border-amber-600/60' : 'bg-[#120702]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{pairing.teamA.flag}</span>
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow"
                          style={{
                            backgroundColor: pairing.teamA.primaryColor,
                            color: pairing.teamA.secondaryColor,
                          }}
                        >
                          {pairing.teamA.shortName[0]}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                            <span>{pairing.teamA.name}</span>
                            {pairing.teamA.confedTitles > 0 && (
                              <span className="text-[10px] text-amber-400 font-bold">
                                ★{pairing.teamA.confedTitles}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-amber-300 font-mono">
                            OVR {pairing.teamA.rating}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-[11px] font-mono text-amber-300">
                          <div>L1: {pairing.leg1HomeScore}</div>
                          <div>L2: {pairing.leg2AwayScore}</div>
                        </div>
                        <div className="text-xl font-black text-amber-300 w-8 text-center">
                          {pairing.aggScoreTeamA}
                        </div>
                        {teamAWon && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black font-extrabold text-[10px] uppercase shadow">
                            QUALIFIED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Team B Row */}
                    <div
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all mt-2 ${
                        teamBWon ? 'bg-amber-950/70 border border-amber-600/60' : 'bg-[#120702]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{pairing.teamB.flag}</span>
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow"
                          style={{
                            backgroundColor: pairing.teamB.primaryColor,
                            color: pairing.teamB.secondaryColor,
                          }}
                        >
                          {pairing.teamB.shortName[0]}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                            <span>{pairing.teamB.name}</span>
                            {pairing.teamB.confedTitles > 0 && (
                              <span className="text-[10px] text-amber-400 font-bold">
                                ★{pairing.teamB.confedTitles}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-amber-300 font-mono">
                            OVR {pairing.teamB.rating}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-[11px] font-mono text-amber-300">
                          <div>L1: {pairing.leg1AwayScore}</div>
                          <div>L2: {pairing.leg2HomeScore}</div>
                        </div>
                        <div className="text-xl font-black text-amber-300 w-8 text-center">
                          {pairing.aggScoreTeamB}
                        </div>
                        {teamBWon && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black font-extrabold text-[10px] uppercase shadow">
                            QUALIFIED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Simulation & Play Match Action */}
                    <div className="mt-3 pt-2 border-t border-amber-900/40 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleSimulateTie(pairing.pairIndex)}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Simulate Tie</span>
                      </button>

                      <button
                        onClick={() => handleStartConfedMatch(pairing.teamA, pairing.teamB, `Tie #${pairing.pairIndex}`)}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-black text-[11px] flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow"
                      >
                        <Play className="w-3 h-3 fill-black" />
                        <span>Play 3D Match</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: GROUP STAGE (16 AGGREGATE QUALIFIERS) */}
        {activeTab === 'GROUP_STAGE' && (
          <div className="bg-[#240d04]/90 border border-amber-900/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
            <div className="pb-4 border-b border-amber-900/60 mb-5">
              <h3 className="text-lg sm:text-xl font-black uppercase text-white flex items-center gap-2">
                <span>CAF CONFEDERATION CUP GROUP STAGE</span>
                <span className="text-xs font-mono font-normal text-amber-400">
                  (16 AGGREGATE WINNERS • 4 GROUPS OF 4)
                </span>
              </h3>
              <p className="text-xs text-amber-200/90 mt-0.5">
                Top 2 teams from each group advance to the Quarter-Finals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {groups.map((group) => {
                const sorted = sortConfedGroupClubs(group.clubs);

                return (
                  <div
                    key={group.name}
                    className="bg-[#180a03]/90 border border-amber-900/70 rounded-2xl p-4 shadow-xl flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-amber-900/50 mb-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <h4 className="font-black text-base text-amber-300 uppercase">{group.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-mono text-[10px] font-bold border border-amber-700/60">
                        Top 2 to Quarter-Finals
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-amber-400/80 border-b border-amber-900/40 text-[10px] font-mono">
                            <th className="py-1 px-1">POS</th>
                            <th className="py-1 px-2">CLUB</th>
                            <th className="py-1 px-1 text-center">MP</th>
                            <th className="py-1 px-1 text-center">W</th>
                            <th className="py-1 px-1 text-center">D</th>
                            <th className="py-1 px-1 text-center">L</th>
                            <th className="py-1 px-1 text-center">GD</th>
                            <th className="py-1 px-1 text-right font-bold text-amber-300">PTS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sorted.map((club, idx) => {
                            const isAdvancing = idx < 2;
                            return (
                              <tr
                                key={club.id}
                                className={`border-b border-amber-950/60 transition-colors ${
                                  isAdvancing ? 'bg-amber-950/30' : ''
                                }`}
                              >
                                <td className="py-2 px-1 font-mono">
                                  <span
                                    className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] ${
                                      isAdvancing
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-stone-800 text-stone-300'
                                    }`}
                                  >
                                    {idx + 1}
                                  </span>
                                </td>
                                <td className="py-2 px-2 font-bold text-white flex items-center gap-1.5">
                                  <span>{club.flag}</span>
                                  <span className="truncate max-w-[130px] sm:max-w-[170px]">{club.name}</span>
                                  {club.confedTitles > 0 && (
                                    <span className="text-[10px] text-amber-400 font-mono">
                                      ★{club.confedTitles}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-1 text-center font-mono text-amber-200">{club.matchesPlayed}</td>
                                <td className="py-2 px-1 text-center font-mono text-amber-400">{club.won}</td>
                                <td className="py-2 px-1 text-center font-mono text-amber-200">{club.drawn}</td>
                                <td className="py-2 px-1 text-center font-mono text-stone-400">{club.lost}</td>
                                <td className="py-2 px-1 text-center font-mono text-amber-200">
                                  {club.goalDiff > 0 ? `+${club.goalDiff}` : club.goalDiff}
                                </td>
                                <td className="py-2 px-1 text-right font-black font-mono text-amber-300 text-sm">
                                  {club.points}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ALL 32 AFRICAN CLUBS GALLERY */}
        {activeTab === 'ALL_CLUBS' && (
          <div className="bg-[#240d04]/90 border border-amber-900/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
            {/* Search & Country Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-5 border-b border-amber-900/60 mb-5">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search from 32 African clubs or stars..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#180a03] border border-amber-700/60 text-xs text-white placeholder-amber-400/60 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#180a03] border border-amber-700/60 text-xs text-amber-200 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {uniqueCountries.map((c) => (
                    <option key={c} value={c}>
                      {c === 'ALL' ? '🌍 All Nations (32)' : c}
                    </option>
                  ))}
                </select>

                <span className="text-xs font-mono text-amber-300">
                  Showing <strong className="text-white">{filteredClubs.length}</strong> of 32 clubs
                </span>
              </div>
            </div>

            {/* Club Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredClubs.map((club) => {
                const isSelected = userClub.id === club.id;
                const isOpponent = opponentClub.id === club.id;

                return (
                  <div
                    key={club.id}
                    className={`relative rounded-2xl p-4 transition-all flex flex-col justify-between shadow-lg ${
                      isSelected
                        ? 'bg-[#3b1706] border-2 border-amber-400 shadow-amber-900/40'
                        : isOpponent
                        ? 'bg-[#291206] border-2 border-orange-500 shadow-orange-900/40'
                        : 'bg-[#180a03] border border-amber-900/70 hover:border-amber-600/70 hover:bg-[#200e04]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow border border-white/20"
                            style={{
                              backgroundColor: club.primaryColor,
                              color: club.secondaryColor,
                            }}
                          >
                            {club.shortName}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-white">{club.name}</h4>
                            <div className="text-[11px] text-amber-300 flex items-center gap-1 font-medium">
                              <span>{club.flag}</span>
                              <span>{club.country}</span>
                            </div>
                          </div>
                        </div>

                        <div className="px-2 py-0.5 rounded-lg bg-amber-950 border border-amber-700/60 font-mono text-xs font-black text-amber-300">
                          {club.rating}
                        </div>
                      </div>

                      {/* Stat bars */}
                      <div className="grid grid-cols-3 gap-1.5 my-3 text-center text-[10px] font-mono">
                        <div className="p-1 rounded-lg bg-[#120702] border border-amber-900/40">
                          <div className="text-amber-400/80">ATT</div>
                          <div className="font-bold text-white text-xs">{club.attackRating}</div>
                        </div>
                        <div className="p-1 rounded-lg bg-[#120702] border border-amber-900/40">
                          <div className="text-amber-400/80">MID</div>
                          <div className="font-bold text-white text-xs">{club.midfieldRating}</div>
                        </div>
                        <div className="p-1 rounded-lg bg-[#120702] border border-amber-900/40">
                          <div className="text-amber-400/80">DEF</div>
                          <div className="font-bold text-white text-xs">{club.defenseRating}</div>
                        </div>
                      </div>

                      {/* Key Stars & Stadium */}
                      <div className="text-[11px] text-amber-200/80 space-y-1 my-2">
                        <div>
                          <strong className="text-amber-400">Stars:</strong> {club.keyPlayers.slice(0, 2).join(', ')}
                        </div>
                        <div className="truncate">
                          <strong className="text-amber-400">🏟️</strong> {club.stadium.split(',')[0]}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 pt-2.5 border-t border-amber-900/50 flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setUserClub(club);
                          soundFX.playKick(0.5);
                        }}
                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-extrabold cursor-pointer transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-amber-400 text-black shadow'
                            : 'bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/60'
                        }`}
                      >
                        {isSelected ? '✓ My Club' : 'Select Club'}
                      </button>

                      <button
                        onClick={() => {
                          setOpponentClub(club);
                          soundFX.playKick(0.4);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all active:scale-95 ${
                          isOpponent
                            ? 'bg-orange-500 text-black'
                            : 'bg-[#180a03] hover:bg-stone-800 text-amber-300 border border-amber-800/60'
                        }`}
                        title="Set as Match Opponent"
                      >
                        VS
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
          <div className="bg-[#240d04]/90 border border-amber-900/80 rounded-3xl p-6 shadow-2xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 font-mono text-xs font-bold border border-amber-600/60 shadow">
                TOTALENERGIES CAF CONFEDERATION CUP SHOWDOWN
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mt-2">
                CONTINENTAL MATCH PREVIEW
              </h3>
              <p className="text-xs text-amber-200/90 mt-1">
                Play head-to-head with complete 3D graphics, PSP handheld controls, and the official 2026 match ball.
              </p>
            </div>

            {/* Versus Card */}
            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 items-center gap-6 p-6 rounded-3xl bg-[#180a03]/90 border border-amber-900/80 shadow-2xl">
              {/* Home Club */}
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl border-4 border-white/20"
                  style={{
                    backgroundColor: userClub.primaryColor,
                    color: userClub.secondaryColor,
                  }}
                >
                  {userClub.shortName}
                </div>
                <div>
                  <h4 className="font-black text-lg text-white">{userClub.name}</h4>
                  <div className="text-xs text-amber-400 font-bold">
                    {userClub.flag} {userClub.country} • OVR {userClub.rating}
                  </div>
                  <div className="text-[11px] text-amber-200/70 mt-1">
                    Manager: {userClub.manager}
                  </div>
                </div>
              </div>

              {/* VS Center Pillar */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-black text-base shadow-lg">
                  VS
                </div>
                <div className="text-[11px] font-mono text-amber-400">
                  {userClub.stadium.split(',')[0]}
                </div>
                <button
                  onClick={() => handleStartConfedMatch(userClub, opponentClub, 'Showdown Match')}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase shadow-[0_0_25px_rgba(245,158,11,0.6)] cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>KICK OFF MATCH</span>
                </button>
              </div>

              {/* Away Club */}
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl border-4 border-white/20"
                  style={{
                    backgroundColor: opponentClub.primaryColor,
                    color: opponentClub.secondaryColor,
                  }}
                >
                  {opponentClub.shortName}
                </div>
                <div>
                  <h4 className="font-black text-lg text-white">{opponentClub.name}</h4>
                  <div className="text-xs text-amber-400 font-bold">
                    {opponentClub.flag} {opponentClub.country} • OVR {opponentClub.rating}
                  </div>
                  <div className="text-[11px] text-amber-200/70 mt-1">
                    Manager: {opponentClub.manager}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ROAD TO THE FINAL */}
        {activeTab === 'ROAD_TO_FINAL' && (
          <div className="bg-[#240d04]/90 border border-amber-900/80 rounded-3xl p-6 shadow-2xl">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 font-mono text-xs font-bold border border-amber-600/60 shadow">
                TOTALENERGIES CAF CONFEDERATION CUP BRACKET
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mt-2">
                ROAD TO CONTINENTAL IMMORTALITY
              </h3>
              <p className="text-xs text-amber-200/90 mt-1">
                From the 16 Qualifying Round ties to the Group Stage, Quarter-Finals, Semi-Finals, and Grand Final.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              {/* STAGE 1: 2nd Qualifying Round */}
              <div className="p-4 rounded-2xl bg-[#180a03] border border-amber-900/70 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center mx-auto mb-2 text-xs">
                  1
                </div>
                <h4 className="font-extrabold text-white text-sm">2nd Preliminary Round</h4>
                <p className="text-xs text-amber-300 font-mono mt-1">32 Clubs • 16 Two-Legged Ties</p>
                <div className="mt-3 text-[11px] text-amber-200/80">
                  Home &amp; Away aggregate qualifiers with away goals &amp; penalties.
                </div>
              </div>

              {/* STAGE 2: Group Stage */}
              <div className="p-4 rounded-2xl bg-[#180a03] border border-amber-900/70 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center mx-auto mb-2 text-xs">
                  2
                </div>
                <h4 className="font-extrabold text-white text-sm">Group Stage</h4>
                <p className="text-xs text-amber-300 font-mono mt-1">16 Qualified Winners</p>
                <div className="mt-3 text-[11px] text-amber-200/80">
                  4 Groups (A, B, C, D) of 4 clubs. Top 2 teams advance to knockouts.
                </div>
              </div>

              {/* STAGE 3: Quarter & Semi Finals */}
              <div className="p-4 rounded-2xl bg-[#180a03] border border-amber-900/70 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center mx-auto mb-2 text-xs">
                  3
                </div>
                <h4 className="font-extrabold text-white text-sm">Quarter &amp; Semi Finals</h4>
                <p className="text-xs text-amber-300 font-mono mt-1">Elite 8 Contenders</p>
                <div className="mt-3 text-[11px] text-amber-200/80">
                  High-stakes two-legged knockout ties leading to the Grand Final.
                </div>
              </div>

              {/* STAGE 4: Grand Final */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#3b1706] to-[#1f0d04] border-2 border-amber-400 shadow-xl">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-black font-black flex items-center justify-center mx-auto mb-2 text-xs">
                  🏆
                </div>
                <h4 className="font-black text-amber-300 text-sm">CAF Confederation Final</h4>
                <p className="text-xs text-white font-mono mt-1">$2,000,000 Champion Prize</p>
                <div className="mt-3 text-[11px] text-amber-100">
                  Winners lift the Confederation Cup and contest the CAF Super Cup!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
