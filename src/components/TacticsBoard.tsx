/**
 * Tactical Board & Real-Time Coaching Insights.
 * Drag-and-drop / positionable fluid formation visualizer,
 * pressing intensity, defensive line, and attacking instructions.
 */

import React, { useState } from 'react';
import {
  Compass,
  Zap,
  Shield,
  Sliders,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
} from 'lucide-react';

interface TacticalRole {
  pos: string;
  name: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  roleInstruction: string;
}

const FORMATION_PRESETS: Record<string, TacticalRole[]> = {
  '4-3-3 Attack': [
    { pos: 'GK', name: 'El Shenawy', x: 50, y: 92, roleInstruction: 'Sweeper Keeper' },
    { pos: 'RB', name: 'Akram Tawfik', x: 86, y: 72, roleInstruction: 'Inverted Wingback' },
    { pos: 'CB', name: 'Abdelmonem', x: 62, y: 78, roleInstruction: 'Ball Playing Defender' },
    { pos: 'CB', name: 'Ramy Rabia', x: 38, y: 78, roleInstruction: 'Covering Stopper' },
    { pos: 'LB', name: 'Ali Maâloul', x: 14, y: 72, roleInstruction: 'Attacking Fullback' },
    { pos: 'DMF', name: 'Marwan Attia', x: 50, y: 55, roleInstruction: 'Anchor Man' },
    { pos: 'CMF', name: 'Emam Ashour', x: 30, y: 42, roleInstruction: 'Box to Box Engine' },
    { pos: 'AMF', name: 'Afsha', x: 70, y: 40, roleInstruction: 'Shadow Striker' },
    { pos: 'RWF', name: 'Percy Tau', x: 84, y: 20, roleInstruction: 'Inside Forward' },
    { pos: 'CF', name: 'Abou Ali', x: 50, y: 15, roleInstruction: 'Target Forward' },
    { pos: 'LWF', name: 'El Shahat', x: 16, y: 20, roleInstruction: 'Roaming Flank' },
  ],
  '4-2-3-1 Gegenpress': [
    { pos: 'GK', name: 'Keeper', x: 50, y: 92, roleInstruction: 'Sweeper Keeper' },
    { pos: 'RB', name: 'RB', x: 85, y: 72, roleInstruction: 'Wingback' },
    { pos: 'CB', name: 'CB-R', x: 62, y: 78, roleInstruction: 'Defend' },
    { pos: 'CB', name: 'CB-L', x: 38, y: 78, roleInstruction: 'Defend' },
    { pos: 'LB', name: 'LB', x: 15, y: 72, roleInstruction: 'Wingback' },
    { pos: 'DMF', name: 'DM-1', x: 36, y: 60, roleInstruction: 'Destroyer' },
    { pos: 'DMF', name: 'DM-2', x: 64, y: 60, roleInstruction: 'Deep Lying Playmaker' },
    { pos: 'RAMF', name: 'RW', x: 82, y: 35, roleInstruction: 'High Press Winger' },
    { pos: 'AMF', name: 'CAM', x: 50, y: 35, roleInstruction: 'Enganche' },
    { pos: 'LAMF', name: 'LW', x: 18, y: 35, roleInstruction: 'High Press Winger' },
    { pos: 'CF', name: 'ST', x: 50, y: 16, roleInstruction: 'Pressing Forward' },
  ],
  '3-5-2 Fluid Wing': [
    { pos: 'GK', name: 'Keeper', x: 50, y: 92, roleInstruction: 'Defensive Keeper' },
    { pos: 'CB', name: 'CB-R', x: 74, y: 78, roleInstruction: 'Wide Centerback' },
    { pos: 'CB', name: 'CB-C', x: 50, y: 82, roleInstruction: 'Libero' },
    { pos: 'CB', name: 'CB-L', x: 26, y: 78, roleInstruction: 'Wide Centerback' },
    { pos: 'RWB', name: 'RWB', x: 88, y: 48, roleInstruction: 'Complete Wingback' },
    { pos: 'LWB', name: 'LWB', x: 12, y: 48, roleInstruction: 'Complete Wingback' },
    { pos: 'CMF', name: 'CM-1', x: 36, y: 45, roleInstruction: 'Carrilero' },
    { pos: 'CMF', name: 'CM-2', x: 64, y: 45, roleInstruction: 'Mezzala' },
    { pos: 'AMF', name: 'AMF', x: 50, y: 32, roleInstruction: 'Classic No. 10' },
    { pos: 'CF', name: 'CF-1', x: 38, y: 16, roleInstruction: 'Poacher' },
    { pos: 'CF', name: 'CF-2', x: 62, y: 16, roleInstruction: 'Advanced Forward' },
  ],
};

export const TacticsBoard: React.FC = () => {
  const [selectedFormation, setSelectedFormation] = useState<string>('4-3-3 Attack');
  const [tacticalStyle, setTacticalStyle] = useState<string>('Gegenpress');
  const [fluidPhase, setFluidPhase] = useState<'IN_POSSESSION' | 'OUT_OF_POSSESSION'>('IN_POSSESSION');
  const [pressingIntensity, setPressingIntensity] = useState<number>(85);
  const [defensiveLine, setDefensiveLine] = useState<number>(76);
  const [tempo, setTempo] = useState<number>(80);

  const players = FORMATION_PRESETS[selectedFormation] || FORMATION_PRESETS['4-3-3 Attack'];

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            <span>Tactics Board &amp; Coaching Insights</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time fluid tactical shapes, pressing lines, team compactness, and automated in-game coaching advice.
          </p>
        </div>

        {/* Fluid Formation Phase Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFluidPhase('IN_POSSESSION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              fluidPhase === 'IN_POSSESSION'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            In Possession
          </button>
          <button
            onClick={() => setFluidPhase('OUT_OF_POSSESSION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              fluidPhase === 'OUT_OF_POSSESSION'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Out of Possession (Compact)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 flex-1">
        {/* Left: 2D Interactive Tactical Pitch (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
            <span>Formation: <strong className="text-cyan-400">{selectedFormation}</strong></span>
            <span>Style: <strong className="text-emerald-400">{tacticalStyle}</strong></span>
          </div>

          {/* 2D Grass Pitch Container */}
          <div className="relative w-full max-w-[480px] aspect-[3/4.2] rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-[#1b4d24] via-[#235e2c] to-[#1b4d24] shadow-2xl p-4 overflow-hidden select-none">
            {/* Pitch Markings */}
            <div className="absolute inset-4 border-2 border-white/40 rounded pointer-events-none" />
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/40 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-white/40 pointer-events-none" />
            
            {/* Top Penalty Box */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-44 h-24 border-b-2 border-x-2 border-white/40 pointer-events-none" />
            {/* Bottom Penalty Box */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-44 h-24 border-t-2 border-x-2 border-white/40 pointer-events-none" />

            {/* Defensive Line Indicator */}
            <div
              className="absolute left-4 right-4 border-t-2 border-dashed border-amber-400/60 pointer-events-none transition-all duration-300"
              style={{ bottom: `${defensiveLine * 0.8}%` }}
            >
              <span className="text-[9px] font-mono text-amber-300 bg-black/60 px-1 rounded ml-2">
                Offside Trap Line ({defensiveLine}m)
              </span>
            </div>

            {/* Render 11 Players on Tactical Pitch */}
            {players.map((p, idx) => {
              // Adjust Y if out of possession (drop deeper)
              const displayY =
                fluidPhase === 'OUT_OF_POSSESSION' && p.pos !== 'GK'
                  ? Math.min(84, p.y + 12)
                  : p.y;

              return (
                <div
                  key={idx}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 cursor-pointer group"
                  style={{ left: `${p.x}%`, top: `${displayY}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-cyan-600 group-hover:bg-cyan-400 text-white font-black text-[10px] flex items-center justify-center border-2 border-white shadow-lg">
                    {p.pos}
                  </div>
                  <span className="text-[9px] font-bold text-white bg-black/80 px-1 rounded mt-0.5 whitespace-nowrap shadow">
                    {p.name}
                  </span>
                  <span className="text-[8px] text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {p.roleInstruction}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Tactical Directives & Coaching AI Insights (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-wide text-cyan-300 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>TEAM INSTRUCTIONS &amp; SLIDERS</span>
            </h3>

            {/* Formation Selector */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Preset Formation</label>
              <select
                value={selectedFormation}
                onChange={(e) => setSelectedFormation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              >
                <option value="4-3-3 Attack">4-3-3 Attack (Modern Dominance)</option>
                <option value="4-2-3-1 Gegenpress">4-2-3-1 High Gegenpress</option>
                <option value="3-5-2 Fluid Wing">3-5-2 Fluid Wingbacks</option>
              </select>
            </div>

            {/* Tactical Style */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Playing Style Philosophy</label>
              <div className="grid grid-cols-3 gap-2">
                {['Gegenpress', 'Tiki-Taka', 'Fast Counter', 'Wing Play', 'Long Ball'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setTacticalStyle(style)}
                    className={`py-1.5 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer ${
                      tacticalStyle === style
                        ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="flex flex-col gap-3 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Pressing Intensity</span>
                  <span className="font-mono font-bold text-white">{pressingIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={pressingIntensity}
                  onChange={(e) => setPressingIntensity(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Defensive Line Height</span>
                  <span className="font-mono font-bold text-white">{defensiveLine}m</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="85"
                  value={defensiveLine}
                  onChange={(e) => setDefensiveLine(parseInt(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Build-Up Tempo</span>
                  <span className="font-mono font-bold text-white">{tempo}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={tempo}
                  onChange={(e) => setTempo(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Real-time coaching insights AI */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="text-cyan-300 font-bold flex items-center gap-1.5 mb-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Real-Time Coaching Recommendation</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {defensiveLine > 70
                  ? 'High defensive line creates superior counter-pressing in the middle third, but watch for long balls over the top against fast wingers.'
                  : 'Deep defensive block protects against pace, but limits progressive passing outlets.'}
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center pt-3 border-t border-slate-800">
            Exportable to PES 2019 / eFootball Game Plan Tactical Presets
          </div>
        </div>
      </div>
    </div>
  );
};
