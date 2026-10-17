/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Trophy,
  Globe,
  Gamepad2,
  Settings,
  ArrowRight,
  Shield,
  Sparkles,
  Users,
  Shirt,
  Compass,
  GraduationCap,
  Award,
  Crown,
  Play,
  Download,
  Star,
  Flame,
  Briefcase,
} from 'lucide-react';
import { Official2026Logo } from './Official2026Ball.tsx';

interface ModeChooseHubProps {
  onSelectLeagues: () => void;
  onSelectCups: () => void;
  onSelectUCL: () => void;
  onSelectUEL: () => void;
  onSelectCAF: () => void;
  onSelectCAFConfed: () => void;
  onSelectManagerCareer: () => void;
  onSelectQuickMatch: () => void;
  onSelectStudioTab: (tab: 'DATABASE' | 'KITS' | 'TACTICS' | 'YOUTH_AI' | 'PATCH_EXPORT') => void;
  onOpenControlsModal: () => void;
  onSelectDownload: () => void;
}

export const ModeChooseHub: React.FC<ModeChooseHubProps> = ({
  onSelectLeagues,
  onSelectCups,
  onSelectUCL,
  onSelectUEL,
  onSelectCAF,
  onSelectCAFConfed,
  onSelectManagerCareer,
  onSelectQuickMatch,
  onSelectStudioTab,
  onOpenControlsModal,
  onSelectDownload,
}) => {
  return (
    <div className="w-full h-full bg-[#030d22] text-white flex flex-col justify-between p-6 sm:p-10 overflow-y-auto font-sans select-none bg-gradient-to-b from-[#061536] via-[#040f29] to-[#020713]">
      {/* Top Header & System Indicator */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-blue-900/60">
        <div className="flex items-center gap-3.5">
          <Official2026Logo ballSize={52} showSubtitles={false} />
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow flex items-center gap-2">
              <span>PES &amp; eFootball Studio 2027</span>
            </h1>
            <p className="text-xs text-blue-200 font-medium">
              PSP Match Simulator • Official 2026 Triunfo Ball • دعنا نلعب كرة القدم
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSelectDownload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/60 text-white font-extrabold text-xs shadow-lg cursor-pointer transition-all active:scale-95"
            title="Download the Game to Play on Mobile, PC, or PPSSPP Handheld"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>DOWNLOAD GAME 📥</span>
          </button>

          <button
            onClick={onOpenControlsModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#091b40] hover:bg-blue-900 border border-blue-700/80 text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95"
            title="Configure Xbox, PlayStation, Mobile Touch, and Keyboard controls"
          >
            <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
              <Settings className="w-3.5 h-3.5 text-black" />
            </div>
            <span>CONTROLS ⚙️</span>
          </button>
        </div>
      </div>

      {/* Center Mode Selection Hero Header with Official 2026 Logo */}
      <div className="w-full max-w-7xl mx-auto text-center my-6 flex flex-col items-center">
        {/* Official 2026 Match Ball with دعنا نلعب كرة القدم / LET'S PLAY FOOTBALL */}
        <Official2026Logo ballSize={135} layout="vertical" className="mb-4" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/90 border border-blue-800 text-xs font-mono text-cyan-300 mb-2 shadow">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>OFFICIAL COMPETITIONS • CHOOSE YOUR MODE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md">
          CHOOSE GAME MODE
        </h2>
        <p className="text-xs sm:text-base text-blue-200 max-w-2xl mx-auto mt-2 font-medium">
          Compete in licensed domestic leagues with full career &amp; technical tactics, conquer continental &amp; international cups, or jump right into the 3D PSP pitch.
        </p>
      </div>

      {/* Main 6 Primary Hub Cards: LEAGUES vs UCL vs UEL vs CAF vs CAF CONFED vs CUPS */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-auto">
        {/* CARD 1: TOURNAMENT / LEAGUES MODE */}
        <div
          onClick={onSelectLeagues}
          className="group relative bg-gradient-to-br from-[#0c2452] to-[#071738] hover:from-[#13377c] hover:to-[#0a2355] border-2 border-blue-600 hover:border-cyan-400 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle glowing ambient lighting */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/30 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black shadow-xl">
                <Trophy className="w-7 h-7 text-black fill-black" />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-950 text-cyan-300 font-mono text-xs font-bold border border-blue-800">
                TIERS 1–5 PYRAMIDS
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors uppercase">
              DOMESTIC LEAGUES
            </h3>
            <p className="text-xs font-semibold text-blue-100 mt-1">
              Global directory across UEFA, CAF, AFC, CONMEBOL, CONCACAF, and OFC with full pyramids.
            </p>

            {/* Included features list */}
            <div className="mt-4 flex flex-col gap-2 text-xs text-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Play className="w-2.5 h-2.5 text-black fill-black" />
                </div>
                <span className="font-bold text-white">Play The Match:</span> 3D simulation with PSP controls
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Trophy className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Leaderboard:</span> Standings, form &amp; golden boot
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Users className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">The Career:</span> Manager budget &amp; youth gems
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Compass className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Tactics:</span> 4-3-3 Attack &amp; 4-2-2-4 Defence
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-800/80 flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300 font-bold">
              OPEN ALL LEAGUES
            </span>
            <div className="flex items-center gap-2 text-xs font-black text-white group-hover:text-cyan-300">
              <span>ENTER LEAGUES</span>
              <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-black">
                <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: DEDICATED UEFA CHAMPIONS LEAGUE STANDALONE MODE */}
        <div
          onClick={onSelectUCL}
          className="group relative bg-gradient-to-br from-[#06174a] via-[#030f33] to-[#010921] hover:from-[#0a2675] hover:to-[#041647] border-2 border-indigo-400 hover:border-cyan-300 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden ring-1 ring-cyan-500/30 hover:ring-cyan-400"
        >
          {/* Subtle glowing starball ambient lighting */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/30 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black shadow-xl">
                <Star className="w-7 h-7 text-black fill-black" />
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/50 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>36-TEAM FORMAT</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors uppercase">
              UEFA CHAMPIONS LEAGUE
            </h3>
            <p className="text-xs font-semibold text-indigo-100 mt-1">
              Europe&apos;s ultimate club competition. Unified 36-team single league phase, play-offs &amp; final.
            </p>

            {/* Included features list */}
            <div className="mt-4 flex flex-col gap-2 text-xs text-indigo-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Play className="w-2.5 h-2.5 text-black fill-black" />
                </div>
                <span className="font-bold text-white">European Clash:</span> Real, City, Bayern, PSG, Barça
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Star className="w-2.5 h-2.5 text-black fill-black" />
                </div>
                <span className="font-bold text-white">Starry Nights:</span> Official Starball &amp; anthem fanfare
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Trophy className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Standings:</span> Top 8 direct to R16, 9–24 play-offs
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Crown className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Big Ears Trophy:</span> €100M purse &amp; Grand Final
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-800/80 flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300 font-bold">
              OPEN CHAMPIONS LEAGUE
            </span>
            <div className="flex items-center gap-2 text-xs font-black text-white group-hover:text-cyan-300">
              <span>ENTER UCL</span>
              <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-black">
                <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: DEDICATED UEFA EUROPA LEAGUE STANDALONE MODE */}
        <div
          onClick={onSelectUEL}
          className="group relative bg-gradient-to-br from-[#291307] via-[#170c06] to-[#0a0d13] hover:from-[#3a1b0a] hover:to-[#1c0f08] border-2 border-orange-500 hover:border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden ring-1 ring-orange-500/30 hover:ring-orange-400"
        >
          {/* Subtle glowing orange energy ambient lighting */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/30 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-black shadow-xl">
                <Trophy className="w-7 h-7 text-black fill-black" />
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-950 text-orange-300 font-mono text-xs font-bold border border-orange-500/50 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                <span>36 OFFICIAL CLUBS</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-orange-300 transition-colors uppercase">
              UEFA EUROPA LEAGUE
            </h3>
            <p className="text-xs font-semibold text-orange-100/90 mt-1">
              The orange energy wave. Complete 36-team single league phase, knockout play-offs &amp; Grand Final.
            </p>

            {/* Included features list */}
            <div className="mt-4 flex flex-col gap-2 text-xs text-orange-200/90">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Play className="w-2.5 h-2.5 text-black fill-black" />
                </div>
                <span className="font-bold text-white">European Clash:</span> Leverkusen, Juve, Milan, Benfica, OM
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Flame className="w-2.5 h-2.5 text-black fill-black" />
                </div>
                <span className="font-bold text-white">Energy Wave:</span> Official anthem fanfare &amp; 36 clubs
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Trophy className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Standings:</span> Top 8 direct to R16, 9–24 play-offs
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Award className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Silver Trophy:</span> €45M purse &amp; UCL direct ticket
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-orange-900/80 flex items-center justify-between">
            <span className="text-xs font-mono text-orange-300 font-bold">
              OPEN EUROPA LEAGUE
            </span>
            <div className="flex items-center gap-2 text-xs font-black text-white group-hover:text-orange-300">
              <span>ENTER UEL</span>
              <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center text-black">
                <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: DEDICATED CAF CHAMPIONS LEAGUE STANDALONE MODE */}
        <div
          onClick={onSelectCAF}
          className="group relative bg-gradient-to-br from-[#062916] via-[#041d0f] to-[#020d07] hover:from-[#0a3820] hover:to-[#062413] border-2 border-emerald-500 hover:border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden ring-1 ring-emerald-500/30 hover:ring-emerald-400"
        >
          {/* Subtle glowing emerald ambient lighting */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/30 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-amber-500 flex items-center justify-center text-black shadow-xl">
                <Trophy className="w-7 h-7 text-black fill-black" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/50 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>32 CLUBS • 16 TIES</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors uppercase">
              CAF CHAMPIONS LEAGUE
            </h3>
            <p className="text-xs font-semibold text-emerald-100/90 mt-1">
              دوري أبطال أفريقيا. Complete 32 clubs, 16 second round pairings &amp; 4-group stage.
            </p>

            {/* Included features list */}
            <div className="mt-4 flex flex-col gap-2 text-xs text-emerald-200/90">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Play className="w-2.5 h-2.5 text-black fill-black" />
                </div>
                <span className="font-bold text-white">African Clash:</span> Zamalek, Pyramids, Sundowns, Espérance
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Flame className="w-2.5 h-2.5 text-black fill-black" />
                </div>
                <span className="font-bold text-white">16 Pairings:</span> 2-legged ties &amp; aggregate qualifiers
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Trophy className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Group Stage:</span> 4 Groups of 4 (16 aggregate winners)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Award className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Crown of Africa:</span> $4M purse &amp; Club World Cup
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-900/80 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-300 font-bold">
              OPEN CAF CHAMPIONS
            </span>
            <div className="flex items-center gap-2 text-xs font-black text-white group-hover:text-emerald-300">
              <span>ENTER CAF</span>
              <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-black">
                <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 5: DEDICATED CAF CONFEDERATION CUP STANDALONE MODE */}
        <div
          onClick={onSelectCAFConfed}
          className="group relative bg-gradient-to-br from-[#291004] via-[#1a0a03] to-[#0d0502] hover:from-[#3b1706] hover:to-[#220c03] border-2 border-amber-600 hover:border-orange-400 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden ring-1 ring-amber-500/30 hover:ring-orange-400"
        >
          {/* Subtle glowing amber ambient lighting */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/30 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center text-black shadow-xl">
                <Trophy className="w-7 h-7 text-black fill-black" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 font-mono text-xs font-bold border border-amber-500/50 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>32 CLUBS • 16 TIES</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors uppercase">
              CAF CONFEDERATION CUP
            </h3>
            <p className="text-xs font-semibold text-amber-100/90 mt-1">
              كأس الكونفيدرالية الأفريقية. Complete 32 clubs, 16 second round ties with first-leg scores &amp; group stage.
            </p>

            {/* Included features list */}
            <div className="mt-4 flex flex-col gap-2 text-xs text-amber-200/90">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Play className="w-2.5 h-2.5 text-black fill-black" />
                </div>
                <span className="font-bold text-white">Continental Giants:</span> Al Ahly, USM Alger, Raja, Kaizer Chiefs
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Flame className="w-2.5 h-2.5 text-black fill-black" />
                </div>
                <span className="font-bold text-white">16 Ties Tracked:</span> Kitara 1-2 Ahly, Welwalo 0-4 Ahli, ZED 1-1
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Trophy className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Group Stage:</span> 4 Groups of 4 (16 aggregate winners)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Award className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Confed Trophy:</span> $2M prize &amp; CAF Super Cup ticket
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-900/80 flex items-center justify-between">
            <span className="text-xs font-mono text-amber-300 font-bold">
              OPEN CONFEDERATION CUP
            </span>
            <div className="flex items-center gap-2 text-xs font-black text-white group-hover:text-amber-300">
              <span>ENTER CONFED CUP</span>
              <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-black">
                <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 6: CHAMPIONSHIP CUPS MODE */}
        <div
          onClick={onSelectCups}
          className="group relative bg-gradient-to-br from-[#121c4a] to-[#09153a] hover:from-[#1b2b6e] hover:to-[#0f2154] border-2 border-indigo-500 hover:border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/30 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black shadow-xl">
                <Crown className="w-7 h-7 text-black fill-black" />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-950 text-amber-300 font-mono text-xs font-bold border border-blue-800">
                7 TOURNAMENT CUPS
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors uppercase">
              CHAMPIONSHIP CUPS
            </h3>
            <p className="text-xs font-semibold text-blue-100 mt-1">
              International national tournaments, continental cups, Super Cup, and Custom Owner Cup.
            </p>

            {/* Included cups badges */}
            <div className="mt-4 grid grid-cols-2 gap-1.5 text-[11px] text-blue-200">
              <div className="p-1.5 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center gap-1.5">
                <span>🌐</span>
                <span className="font-bold text-white truncate">World Cup 2026</span>
              </div>
              <div className="p-1.5 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center gap-1.5">
                <span>🇪🇺</span>
                <span className="font-bold text-white truncate">Euro 2024</span>
              </div>
              <div className="p-1.5 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center gap-1.5">
                <span>🌎</span>
                <span className="font-bold text-white truncate">Copa América</span>
              </div>
              <div className="p-1.5 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center gap-1.5">
                <span>🌍</span>
                <span className="font-bold text-white truncate">CAF 2025 Cup</span>
              </div>
              <div className="p-1.5 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center gap-1.5">
                <span>🏆</span>
                <span className="font-bold text-white truncate">Arab Cup</span>
              </div>
              <div className="p-1.5 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center gap-1.5">
                <span>👑</span>
                <span className="font-bold text-white truncate">Super Cup</span>
              </div>
              <div className="col-span-2 p-1.5 rounded-xl bg-gradient-to-r from-amber-950/80 to-blue-950/80 border border-amber-500/60 flex items-center gap-1.5">
                <span>🛠️</span>
                <span className="font-bold text-amber-200 truncate">Owner Mode (Make Your Cup)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-800/80 flex items-center justify-between">
            <span className="text-xs font-mono text-amber-300 font-bold">
              KNOCKOUT &amp; BRACKETS
            </span>
            <div className="flex items-center gap-2 text-xs font-black text-white group-hover:text-amber-300">
              <span>ENTER CUPS</span>
              <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-black">
                <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 7: DEDICATED MANAGER CAREER MODE */}
        <div
          onClick={onSelectManagerCareer}
          className="group relative bg-gradient-to-br from-[#1c0e3a] via-[#120726] to-[#080214] hover:from-[#2a1458] hover:to-[#170831] border-2 border-purple-500 hover:border-pink-400 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden ring-1 ring-purple-500/30 hover:ring-pink-400"
        >
          {/* Subtle glowing ambient lighting */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/30 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-black shadow-xl">
                <Briefcase className="w-7 h-7 text-black stroke-[2.5]" />
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-950 text-pink-300 font-mono text-xs font-bold border border-purple-500/50 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                <span>32 BOSSES • CREATE AVATAR</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-pink-300 transition-colors uppercase">
              MANAGER CAREER MODE
            </h3>
            <p className="text-xs font-semibold text-purple-100/90 mt-1">
              وضع المهنة التدريبية. Take the dugout with 32 world-class managers or build your custom avatar from skeleton to skills.
            </p>

            {/* Included features list */}
            <div className="mt-4 flex flex-col gap-2 text-xs text-purple-200/90">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Play className="w-2.5 h-2.5 text-black fill-black" />
                </div>
                <span className="font-bold text-white">32 Curated Bosses:</span> Ancelotti, Pep, Flick, Mourinho, Zidane, Klopp
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Flame className="w-2.5 h-2.5 text-black fill-black" />
                </div>
                <span className="font-bold text-white">Create Character:</span> Skeleton, muscles, arms, nose, eyes, hair &amp; height
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Trophy className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Simulation Engine:</span> Instant simulator or watch team play from sideline
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Award className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="font-bold text-white">Squad &amp; Transfers:</span> Squad Hub, budget money &amp; difficulty settings
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-purple-900/80 flex items-center justify-between">
            <span className="text-xs font-mono text-pink-300 font-bold">
              OPEN MANAGER CAREER
            </span>
            <div className="flex items-center gap-2 text-xs font-black text-white group-hover:text-pink-300">
              <span>ENTER CAREER</span>
              <div className="w-6 h-6 rounded-lg bg-pink-500 flex items-center justify-center text-black">
                <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Bottom Row: Instant Match & Studio Features */}
      <div className="w-full max-w-7xl mx-auto mt-6 pt-6 border-t border-blue-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectQuickMatch}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase shadow transition-all active:scale-95 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
              <Play className="w-3.5 h-3.5 text-black fill-black" />
            </div>
            <span>Instant Exhibition Match</span>
          </button>

          <button
            onClick={onSelectDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase shadow transition-all active:scale-95 cursor-pointer"
            title="Download the Game to Play on Mobile, PC, or PPSSPP"
          >
            <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
              <Download className="w-3.5 h-3.5 text-black" />
            </div>
            <span>Download Game 📥</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-blue-200">Studio &amp; Editing:</span>
          {[
            { id: 'DATABASE' as const, label: '211 Nations DB', icon: Globe },
            { id: 'KITS' as const, label: 'Kit Studio', icon: Shirt },
            { id: 'TACTICS' as const, label: 'Tactics Board', icon: Compass },
            { id: 'YOUTH_AI' as const, label: 'Youth Academy', icon: GraduationCap },
            { id: 'PATCH_EXPORT' as const, label: 'Patch Exporter', icon: Shield },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectStudioTab(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#091b40] hover:bg-blue-900 text-blue-100 hover:text-white border border-blue-800 text-xs font-bold transition-all cursor-pointer"
              >
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <Icon className="w-3 h-3 text-black" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
