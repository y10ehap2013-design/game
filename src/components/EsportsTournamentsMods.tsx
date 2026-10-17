/**
 * eSports Pro Leaderboards, Tournament Tracking & Integrated Modder Forums.
 * Allows modders to share custom assets, tactics, and rosters with one-click import.
 */

import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  MessageSquare,
  Download,
  ThumbsUp,
  Sparkles,
  Share2,
  CheckCircle2,
  Award,
  Users,
} from 'lucide-react';
import { COMMUNITY_MODS, ESPORTS_LEADERBOARD, TOURNAMENT_BRACKETS } from '../data/communityMods.ts';
import type { ModItem } from '../data/communityMods.ts';

export const EsportsTournamentsMods: React.FC = () => {
  const [modsList, setModsList] = useState<ModItem[]>(COMMUNITY_MODS);
  const [importedModId, setImportedModId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'MODS' | 'TOURNAMENTS' | 'LEADERBOARD'>('MODS');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  const handleUpvote = (id: string) => {
    const next = new Set(upvotedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setUpvotedIds(next);
  };

  const handleImportMod = (mod: ModItem) => {
    setImportedModId(mod.id);
    setTimeout(() => {
      setImportedModId(null);
    }, 3500);
  };

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>eSports Pro Hub &amp; Modders Community</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Competitive tournament brackets, eSports leaderboards, and modder forums for custom kits, face packs &amp; tactics.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('MODS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === 'MODS' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Modders Forum &amp; Assets
          </button>
          <button
            onClick={() => setActiveSubTab('TOURNAMENTS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === 'TOURNAMENTS' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tournament Brackets
          </button>
          <button
            onClick={() => setActiveSubTab('LEADERBOARD')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === 'LEADERBOARD' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            eSports Pro Rankings
          </button>
        </div>
      </div>

      {importedModId && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Mod asset imported successfully! Applied directly into the active match engine and roster database.</span>
        </div>
      )}

      {/* 1. MODDERS FORUM & ASSETS */}
      {activeSubTab === 'MODS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {modsList.map((mod) => {
            const isUpvoted = upvotedIds.has(mod.id);
            return (
              <div
                key={mod.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {mod.category}
                    </span>
                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                      ★ {mod.rating.toFixed(2)} ({mod.downloads.toLocaleString()} dl)
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{mod.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{mod.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {mod.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-mono">By {mod.author}</div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpvote(mod.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                        isUpvoted
                          ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{isUpvoted ? 'Upvoted' : 'Upvote'}</span>
                    </button>

                    <button
                      onClick={() => handleImportMod(mod)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>One-Click Import</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TOURNAMENT BRACKETS */}
      {activeSubTab === 'TOURNAMENTS' && (
        <div className="flex flex-col gap-4 mt-6">
          <div className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>2027 Continental &amp; Global eSports Tournament Championship</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOURNAMENT_BRACKETS.map((match) => (
              <div
                key={match.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pb-2 border-b border-slate-800">
                  <span>{match.round}</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded ${
                      match.status === 'LIVE'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                        : match.status === 'COMPLETED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {match.status}
                  </span>
                </div>

                <div className="flex flex-col gap-2 my-4">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{match.teamA}</span>
                    <span className="font-mono text-cyan-400 text-sm">
                      {match.scoreA !== undefined ? match.scoreA : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{match.teamB}</span>
                    <span className="font-mono text-cyan-400 text-sm">
                      {match.scoreB !== undefined ? match.scoreB : '-'}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono text-right">
                  Match Date: {match.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ESPORTS LEADERBOARD */}
      {activeSubTab === 'LEADERBOARD' && (
        <div className="flex flex-col gap-3 mt-6">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="grid grid-cols-12 gap-2 text-xs font-mono font-bold text-slate-500 pb-2 border-b border-slate-800 uppercase">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Pro Player</div>
              <div className="col-span-3">Affiliated Club</div>
              <div className="col-span-2">Platform</div>
              <div className="col-span-2 text-right">Points / WR</div>
            </div>

            <div className="flex flex-col gap-2 mt-3">
              {ESPORTS_LEADERBOARD.map((row) => (
                <div
                  key={row.rank}
                  className="grid grid-cols-12 gap-2 text-xs items-center p-2 rounded-xl bg-slate-950/60 border border-slate-800/60"
                >
                  <div className="col-span-1 font-mono font-black text-cyan-400">#{row.rank}</div>
                  <div className="col-span-4 font-bold text-white">{row.player}</div>
                  <div className="col-span-3 text-slate-300">{row.club}</div>
                  <div className="col-span-2 text-slate-400 font-mono text-[11px]">{row.platform}</div>
                  <div className="col-span-2 text-right font-mono font-bold text-emerald-400">
                    {row.points} pts ({row.winRate})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
