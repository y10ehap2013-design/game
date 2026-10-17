/**
 * Career Mode Youth Academy & AI-Powered Injury Prediction Model.
 * Manages youth scouting network, potential progression curves,
 * and biomechanical player load injury risk analysis.
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  HeartPulse,
  AlertTriangle,
  TrendingUp,
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  Dumbbell,
  Clock,
  Zap,
} from 'lucide-react';
import { predictInjuryRisk, projectYouthGrowth } from '../logic/stats.ts';
import type { PlayerLoadProfile, InjuryPredictionResult } from '../logic/stats.ts';

interface YouthProspect {
  id: string;
  name: string;
  age: number;
  position: 'CF' | 'AMF' | 'LWF' | 'CB' | 'GK';
  nationality: string;
  currentRating: number;
  potential: number;
  specialTrait: string;
  drillFocus: string;
  growthProgress: number; // 0 - 100
}

export const CareerYouthAcademy: React.FC = () => {
  const [prospects, setProspects] = useState<YouthProspect[]>([
    {
      id: 'YOUTH_1',
      name: 'Omar Marmoush Jr.',
      age: 16,
      position: 'LWF',
      nationality: 'Egypt',
      currentRating: 69,
      potential: 91,
      specialTrait: 'Speed Dribbler & Long Ranger',
      drillFocus: 'Clinical Finishing & Pace Drills',
      growthProgress: 65,
    },
    {
      id: 'YOUTH_2',
      name: 'Yassine Benali',
      age: 17,
      position: 'AMF',
      nationality: 'Morocco',
      currentRating: 72,
      potential: 93,
      specialTrait: 'Tiki-Taka Vision Maestro',
      drillFocus: 'Precision Through-Passing',
      growthProgress: 80,
    },
    {
      id: 'YOUTH_3',
      name: 'Lucas Nogueira',
      age: 16,
      position: 'CF',
      nationality: 'Brazil',
      currentRating: 71,
      potential: 92,
      specialTrait: 'Acrobatic Finisher',
      drillFocus: 'Inside Box Poaching',
      growthProgress: 50,
    },
    {
      id: 'YOUTH_4',
      name: 'Tariq Al-Muwallad',
      age: 17,
      position: 'CB',
      nationality: 'Saudi Arabia',
      currentRating: 67,
      potential: 88,
      specialTrait: 'Aggressive Interceptor',
      drillFocus: 'Aerial Duels & Tactical Marking',
      growthProgress: 75,
    },
    {
      id: 'YOUTH_5',
      name: 'Kenzo Tanaka',
      age: 16,
      position: 'GK',
      nationality: 'Japan',
      currentRating: 66,
      potential: 87,
      specialTrait: 'Sweeper Keeper Agility',
      drillFocus: 'Reflex Diving & Distribution',
      growthProgress: 40,
    },
  ]);

  // AI-Powered Injury Prediction Model inputs
  const [playerLoad, setPlayerLoad] = useState<PlayerLoadProfile>({
    matchesLast14Days: 4,
    minutesPlayedLast14Days: 345,
    highIntensitySprintKm: 18.2,
    currentStamina: 52,
    recoveryDays: 2,
    priorInjuriesCount: 2,
    age: 28,
  });

  const injuryAssessment: InjuryPredictionResult = predictInjuryRisk(playerLoad);

  // Train youth prospect
  const handleTrainProspect = (id: string) => {
    setProspects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newOvr = projectYouthGrowth(p.currentRating, p.potential, p.age, 1.25);
          return {
            ...p,
            currentRating: newOvr,
            growthProgress: Math.min(100, p.growthProgress + 20),
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
            <span>Career Youth Academy &amp; AI Injury Prediction</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Scout global prodigies from Africa, Middle East, Europe &amp; South America, and monitor squad physiological fatigue.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 flex-1">
        {/* Left: Youth Academy Management (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold tracking-wide text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>YOUTH ACADEMY ROSTER ({prospects.length} PROSPECTS)</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
              Scouting Network: 5 Continents Active
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {prospects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center font-bold text-base text-white">
                    {p.position}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{p.name}</span>
                      <span className="text-xs text-slate-400 font-normal">({p.age} yrs • {p.nationality})</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Trait: <span className="text-cyan-300 font-medium">{p.specialTrait}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Focus: {p.drillFocus}
                    </div>
                  </div>
                </div>

                {/* Rating & Potential Bars + Action */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">
                      OVR <span className="text-base font-black font-mono text-white">{p.currentRating}</span>
                      {' / '}
                      POT <span className="text-base font-black font-mono text-cyan-400">{p.potential}</span>
                    </div>
                    <div className="w-24 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                        style={{ width: `${p.growthProgress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleTrainProspect(p.id)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>Train Drill</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI-Powered Injury Prediction Model (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold tracking-wide text-rose-400 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" />
                <span>AI INJURY PREDICTION MODEL</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">ACWR Biomechanical Engine</span>
            </div>

            {/* Risk Tier Badge Display */}
            <div
              className={`mt-4 p-4 rounded-xl border flex items-center justify-between ${
                injuryAssessment.riskTier === 'CRITICAL'
                  ? 'bg-rose-950/80 border-rose-500/60 text-rose-200'
                  : injuryAssessment.riskTier === 'HIGH'
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-200'
                  : injuryAssessment.riskTier === 'MODERATE'
                  ? 'bg-yellow-950/80 border-yellow-500/60 text-yellow-200'
                  : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <HeartPulse className="w-8 h-8 shrink-0 animate-pulse" />
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider">
                    Assessed Risk Level: {injuryAssessment.riskTier}
                  </div>
                  <div className="text-xs font-semibold mt-0.5">
                    {injuryAssessment.vulnerableMuscleGroup}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black font-mono">
                  {injuryAssessment.riskScore}%
                </span>
                <div className="text-[10px] font-mono opacity-80">RISK INDEX</div>
              </div>
            </div>

            {/* Coaching Recommendation */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Sports Science Coaching Recommendation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {injuryAssessment.recommendedAction}
              </p>
            </div>

            {/* Interactive Player Load Pattern Sliders */}
            <div className="mt-4 flex flex-col gap-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Adjust Match Load Parameters
              </div>

              {/* Sprint Km */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">High-Intensity Sprint Distance (14d)</span>
                  <span className="font-mono font-bold text-white">
                    {playerLoad.highIntensitySprintKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="35"
                  step="0.5"
                  value={playerLoad.highIntensitySprintKm}
                  onChange={(e) =>
                    setPlayerLoad({ ...playerLoad, highIntensitySprintKm: parseFloat(e.target.value) })
                  }
                  className="w-full accent-rose-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              {/* Minutes in last 14 days */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Minutes Played (Last 14d)</span>
                  <span className="font-mono font-bold text-white">
                    {playerLoad.minutesPlayedLast14Days} mins
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="540"
                  step="15"
                  value={playerLoad.minutesPlayedLast14Days}
                  onChange={(e) =>
                    setPlayerLoad({ ...playerLoad, minutesPlayedLast14Days: parseInt(e.target.value) })
                  }
                  className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              {/* Recovery Days */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Days Since Last Match</span>
                  <span className="font-mono font-bold text-white">
                    {playerLoad.recoveryDays} days
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={playerLoad.recoveryDays}
                  onChange={(e) =>
                    setPlayerLoad({ ...playerLoad, recoveryDays: parseInt(e.target.value) })
                  }
                  className="w-full accent-cyan-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
            Integrated with FIFA Medical Protocol &amp; ACWR Acute/Chronic Workload Ratios
          </div>
        </div>
      </div>
    </div>
  );
};
