/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Sliders,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Shield,
  Eye,
  Scissors,
  Check,
  Zap,
  TrendingUp,
  Award,
  Shirt,
  Compass,
} from 'lucide-react';
import type {
  CustomManagerCharacter,
  ManagerBuild,
  ManagerArmBuild,
  ManagerNoseType,
  ManagerEyeShape,
  ManagerHairStyle,
  ManagerFacialHair,
  ManagerAttire,
  ManagerCoachingSkill,
} from '../logic/managerCareerLogic.ts';
import { createDefaultCustomManager } from '../logic/managerCareerLogic.ts';

interface ManagerCharacterCreatorProps {
  onConfirm: (character: CustomManagerCharacter) => void;
  onCancel: () => void;
}

const EYE_COLORS = [
  { name: 'Deep Brown', hex: '#3E2723' },
  { name: 'Ocean Blue', hex: '#1E88E5' },
  { name: 'Emerald Green', hex: '#2E7D32' },
  { name: 'Golden Hazel', hex: '#8D6E63' },
  { name: 'Amber Gold', hex: '#FFB300' },
  { name: 'Steel Gray', hex: '#78909C' },
];

const HAIR_COLORS = [
  { name: 'Jet Black', hex: '#1C1C1C' },
  { name: 'Espresso Brown', hex: '#4E342E' },
  { name: 'Golden Blonde', hex: '#E0A96D' },
  { name: 'Auburn / Red', hex: '#B71C1C' },
  { name: 'Silver Gray', hex: '#9E9E9E' },
  { name: 'Platinum White', hex: '#ECEFF1' },
];

const SUIT_COLORS = [
  { name: 'Midnight Navy', hex: '#0D1B2A' },
  { name: 'Carbon Black', hex: '#1A1A1A' },
  { name: 'Charcoal Grey', hex: '#374151' },
  { name: 'Royal Crimson', hex: '#881337' },
  { name: 'Forest Emerald', hex: '#064E3B' },
  { name: 'Camel Tan', hex: '#78350F' },
];

const NATIONALITIES = [
  { name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Spain', code: 'ESP', flag: '🇪🇸' },
  { name: 'Italy', code: 'ITA', flag: '🇮🇹' },
  { name: 'Germany', code: 'GER', flag: '🇩🇪' },
  { name: 'France', code: 'FRA', flag: '🇫🇷' },
  { name: 'Argentina', code: 'ARG', flag: '🇦🇷' },
  { name: 'Brazil', code: 'BRA', flag: '🇧🇷' },
  { name: 'Portugal', code: 'POR', flag: '🇵🇹' },
  { name: 'Netherlands', code: 'NED', flag: '🇳🇱' },
  { name: 'Egypt', code: 'EGY', flag: '🇪🇬' },
  { name: 'Morocco', code: 'MAR', flag: '🇲🇦' },
  { name: 'South Africa', code: 'RSA', flag: '🇿🇦' },
  { name: 'Nigeria', code: 'NGA', flag: '🇳🇬' },
  { name: 'USA', code: 'USA', flag: '🇺🇸' },
  { name: 'Japan', code: 'JPN', flag: '🇯🇵' },
  { name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦' },
];

const COACHING_SKILLS: {
  id: ManagerCoachingSkill;
  title: string;
  badge: string;
  icon: typeof Zap;
  description: string;
  perks: string[];
}[] = [
  {
    id: 'tactical_genius',
    title: 'Tactical Genius',
    badge: 'Tactics Maestro',
    icon: Compass,
    description: 'Master of in-game fluid adjustments, asymmetric pressing, and counter-measures.',
    perks: ['+4 Tactical Chemistry', '+15% Adaptability in Second Half', 'Unlocks Inverted Roles'],
  },
  {
    id: 'master_motivator',
    title: 'Master Motivator',
    badge: 'Mental Titan',
    icon: Zap,
    description: 'Charismatic sideline leadership that sparks dramatic late comebacks and high squad morale.',
    perks: ['+5 Squad Morale Boost', 'Clutch 80th-Min Comeback Multiplier', 'Zero Dressing Room Conflict'],
  },
  {
    id: 'youth_developer',
    title: 'Youth Academy Developer',
    badge: 'Wonderkid Guru',
    icon: TrendingUp,
    description: 'Specializes in uncovering raw talent and skyrocketing teenager development curves.',
    perks: ['+25% Youth Rating Growth', 'Lower Scouting Costs', 'Homegrown Squad Bonus'],
  },
  {
    id: 'transfer_maestro',
    title: 'Transfer Market Maestro',
    badge: 'Chief Negotiator',
    icon: Award,
    description: 'Unmatched negotiation charm and deep agent networks that secure discounts on elite players.',
    perks: ['-15% Player Purchase Fees', '+10% Wage Budget Flexibility', 'Priority Target Signing'],
  },
  {
    id: 'fitness_guru',
    title: 'Fitness & Stamina Guru',
    badge: 'Athletic Dominance',
    icon: Sparkles,
    description: 'Peak conditioning methodologies preventing burnout across congested European schedules.',
    perks: ['-30% Stamina Decay in Matches', '-50% Muscle Injury Frequency', 'Fast Recovery Between Ties'],
  },
  {
    id: 'setpiece_specialist',
    title: 'Set-Piece Specialist',
    badge: 'Dead-Ball Architect',
    icon: Shield,
    description: 'Choreographs unstoppable corner routines and near-post flick designs.',
    perks: ['+25% Corner Conversion Rate', '+20% Defensive Header Clearance', 'Direct Free-Kick Threat'],
  },
];

export const ManagerCharacterCreator: React.FC<ManagerCharacterCreatorProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [character, setCharacter] = useState<CustomManagerCharacter>(createDefaultCustomManager);
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'BODY_SKELETON' | 'FACE_HAIR' | 'WARDROBE' | 'PHILOSOPHY'>('IDENTITY');

  // Height display helper
  const feet = Math.floor(character.heightCm / 30.48);
  const inches = Math.round((character.heightCm % 30.48) / 2.54);

  // SVG dimensions for preview
  const scale = character.heightCm / 185;
  const isMuscular = character.bodyBuild === 'muscular';
  const isStocky = character.bodyBuild === 'stocky';
  const isSlender = character.bodyBuild === 'slender';
  const shoulderWidth = isMuscular ? 90 : isStocky ? 86 : isSlender ? 68 : 78;
  const chestWidth = isMuscular ? 74 : isStocky ? 72 : isSlender ? 54 : 64;

  return (
    <div className="w-full min-h-screen bg-[#03091e] text-white flex flex-col">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-[#051336]/90 backdrop-blur-md border-b border-blue-900/60 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-300 text-xs font-bold border border-blue-800 transition cursor-pointer"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              <span>Manager Creation Studio</span>
            </h1>
            <p className="text-[11px] text-blue-300">
              Sculpt your custom touchline persona • Skeleton, muscles, facial features &amp; tactical philosophy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCharacter(createDefaultCustomManager())}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900 text-blue-300 text-xs font-semibold border border-blue-800/80 cursor-pointer"
            title="Reset to default template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={() => onConfirm(character)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            <span>Proceed to Team Choice</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual 3D/2D Avatar Viewport */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#091b40] via-[#05112e] to-[#020716] border border-blue-800/80 p-6 flex flex-col items-center justify-between shadow-2xl min-h-[460px] overflow-hidden">
            {/* Ambient stadium lights glow behind manager */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-cyan-500/20 via-blue-600/10 to-transparent blur-2xl pointer-events-none" />

            {/* Manager Nameplate */}
            <div className="w-full flex items-center justify-between z-10">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/60 text-xs font-mono">
                <span>{character.flag}</span>
                <span className="font-bold text-white">{character.name}</span>
                <span className="text-blue-300">({character.age} yrs)</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/50 text-[11px] font-mono text-cyan-300 font-bold">
                {character.heightCm} cm • {feet}&apos;{inches}&quot;
              </div>
            </div>

            {/* Live Interactive SVG Avatar Graphic */}
            <div className="relative w-full max-w-[280px] h-[340px] flex items-center justify-center my-auto z-10">
              <svg
                viewBox="0 0 200 320"
                className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] transition-all duration-300"
                style={{ transform: `scale(${Math.max(0.85, Math.min(1.15, scale))})` }}
              >
                <defs>
                  <linearGradient id="bodySkin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f5c6a5" />
                    <stop offset="100%" stopColor="#d49b78" />
                  </linearGradient>
                  <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={character.suitColor} />
                    <stop offset="100%" stopColor="#0a0a0a" />
                  </linearGradient>
                </defs>

                {/* Pedestal Shadow */}
                <ellipse cx="100" cy="305" rx="60" ry="10" fill="#000000" opacity="0.6" />

                {/* Legs & Trousers */}
                <path
                  d="M78 200 L74 290 L90 290 L92 205 Z"
                  fill={character.touchlineAttire === 'tracksuit' ? '#1e293b' : character.suitColor}
                />
                <path
                  d="M122 200 L126 290 L110 290 L108 205 Z"
                  fill={character.touchlineAttire === 'tracksuit' ? '#1e293b' : character.suitColor}
                />
                {/* Formal Shoes */}
                <path d="M70 290 L90 290 L94 298 L66 298 Z" fill="#111827" />
                <path d="M130 290 L110 290 L106 298 L134 298 Z" fill="#111827" />

                {/* Torso & Suit / Coat */}
                <path
                  d={`M${100 - shoulderWidth / 2} 110 L${100 - chestWidth / 2} 210 L${100 + chestWidth / 2} 210 L${100 + shoulderWidth / 2} 110 Z`}
                  fill="url(#suitGrad)"
                />

                {/* White Shirt Collar & Tie */}
                <polygon points="90,110 110,110 100,140" fill="#ffffff" />
                <polygon points="97,120 103,120 101,175 99,175" fill="#c026d3" />

                {/* Suit Lapels */}
                <polygon points={`90,110 75,150 95,190 100,150`} fill={character.suitColor} stroke="#000000" strokeWidth="0.5" />
                <polygon points={`110,110 125,150 105,190 100,150`} fill={character.suitColor} stroke="#000000" strokeWidth="0.5" />

                {/* Arms (scaled by armBuild) */}
                {character.armBuild === 'muscular' ? (
                  <>
                    <path d="M54 115 Q40 155 48 190 L58 190 Q52 155 64 118 Z" fill="url(#suitGrad)" />
                    <path d="M146 115 Q160 155 152 190 L142 190 Q148 155 136 118 Z" fill="url(#suitGrad)" />
                  </>
                ) : character.armBuild === 'long' ? (
                  <>
                    <path d="M58 115 Q45 165 48 205 L56 205 Q56 165 66 118 Z" fill="url(#suitGrad)" />
                    <path d="M142 115 Q155 165 152 205 L144 205 Q144 165 134 118 Z" fill="url(#suitGrad)" />
                  </>
                ) : (
                  <>
                    <path d="M58 115 Q48 155 52 188 L60 188 Q58 155 66 118 Z" fill="url(#suitGrad)" />
                    <path d="M142 115 Q152 155 148 188 L140 188 Q142 155 134 118 Z" fill="url(#suitGrad)" />
                  </>
                )}

                {/* Hands */}
                <circle cx={character.armBuild === 'long' ? 52 : 55} cy={character.armBuild === 'long' ? 208 : 192} r="5" fill="url(#bodySkin)" />
                <circle cx={character.armBuild === 'long' ? 148 : 145} cy={character.armBuild === 'long' ? 208 : 192} r="5" fill="url(#bodySkin)" />

                {/* Neck */}
                <rect x="94" y="96" width="12" height="18" fill="url(#bodySkin)" rx="2" />

                {/* Head Base */}
                <ellipse cx="100" cy="74" rx="22" ry="26" fill="url(#bodySkin)" />

                {/* Eyes & Eyeballs */}
                <ellipse cx="91" cy="72" rx="4" ry={character.eyeShape === 'wide' ? 4 : 2.5} fill="#ffffff" />
                <ellipse cx="109" cy="72" rx="4" ry={character.eyeShape === 'wide' ? 4 : 2.5} fill="#ffffff" />
                <circle cx="91" cy="72" r="2" fill={character.eyeColor} />
                <circle cx="109" cy="72" r="2" fill={character.eyeColor} />
                <circle cx="91.5" cy="71.5" r="0.7" fill="#ffffff" />
                <circle cx="109.5" cy="71.5" r="0.7" fill="#ffffff" />

                {/* Eyebrows */}
                <path d="M86 67 Q91 65 96 67" stroke={character.hairColor} strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M104 67 Q109 65 114 67" stroke={character.hairColor} strokeWidth="2" strokeLinecap="round" fill="none" />

                {/* Nose Shapes */}
                {character.noseType === 'aquiline' && (
                  <path d="M100 70 L97 80 L102 82 L100 83" stroke="#b07d5b" strokeWidth="1.5" fill="none" />
                )}
                {character.noseType === 'button' && (
                  <circle cx="100" cy="80" r="2" fill="#b07d5b" />
                )}
                {character.noseType === 'broad' && (
                  <path d="M96 79 Q100 76 104 79 L100 82 Z" fill="#b07d5b" opacity="0.6" />
                )}
                {(character.noseType === 'straight' || character.noseType === 'curved') && (
                  <path d="M99 71 L99 80 L103 81" stroke="#b07d5b" strokeWidth="1.5" fill="none" />
                )}

                {/* Mouth & Lips */}
                <path d="M94 88 Q100 91 106 88" stroke="#934d43" strokeWidth="1.8" strokeLinecap="round" fill="none" />

                {/* Facial Hair */}
                {character.facialHair === 'stubble' && (
                  <path d="M90 84 Q100 98 110 84 Q100 95 90 84" fill="#000000" opacity="0.25" />
                )}
                {character.facialHair === 'beard' && (
                  <path d="M88 80 Q100 102 112 80 L110 90 Q100 104 90 90 Z" fill={character.hairColor} opacity="0.9" />
                )}
                {character.facialHair === 'goatee' && (
                  <path d="M95 86 Q100 98 105 86 Z" fill={character.hairColor} />
                )}
                {character.facialHair === 'mustache' && (
                  <path d="M93 86 Q100 84 107 86 Q100 88 93 86" fill={character.hairColor} />
                )}

                {/* Hair Styles */}
                {character.hairStyle === 'buzz' && (
                  <path d="M78 68 Q100 48 122 68 Q100 52 78 68" fill={character.hairColor} />
                )}
                {character.hairStyle === 'sidepart' && (
                  <path d="M76 68 Q100 44 124 66 Q116 52 88 56 Z" fill={character.hairColor} />
                )}
                {character.hairStyle === 'slick' && (
                  <path d="M78 65 Q100 46 122 65 Q100 50 78 65 Z" fill={character.hairColor} />
                )}
                {character.hairStyle === 'afro' && (
                  <ellipse cx="100" cy="64" rx="27" ry="24" fill={character.hairColor} />
                )}
                {character.hairStyle === 'fade' && (
                  <path d="M80 66 Q100 47 120 66 Q100 52 80 66" fill={character.hairColor} />
                )}
                {character.hairStyle === 'wavy' && (
                  <path d="M76 72 Q100 42 124 72 Q115 54 85 54 Z" fill={character.hairColor} />
                )}
                {character.hairStyle === 'ponytail' && (
                  <>
                    <path d="M78 66 Q100 46 122 66 Z" fill={character.hairColor} />
                    <path d="M118 70 Q130 85 125 105 Q120 90 115 75 Z" fill={character.hairColor} />
                  </>
                )}
                {character.hairStyle === 'bald' && null}
              </svg>
            </div>

            {/* Tactical Style & Specialty Badge */}
            <div className="w-full bg-[#030d22]/90 border border-blue-900 rounded-2xl p-3 z-10 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-mono text-cyan-400 font-bold">Selected Philosophy</div>
                <div className="text-xs font-black text-white capitalize">
                  {character.coachingSkill.replace('_', ' ')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono text-blue-300 font-bold">Body Build</div>
                <div className="text-xs font-bold text-cyan-300 capitalize">
                  {character.bodyBuild} • {character.armBuild} arms
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls & Skill Trees */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Navigation Category Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#051336] border border-blue-800 rounded-2xl overflow-x-auto">
            {[
              { id: 'IDENTITY' as const, label: 'Identity', icon: User },
              { id: 'BODY_SKELETON' as const, label: 'Body & Build', icon: Sliders },
              { id: 'FACE_HAIR' as const, label: 'Face & Hair', icon: Scissors },
              { id: 'WARDROBE' as const, label: 'Wardrobe', icon: Shirt },
              { id: 'PHILOSOPHY' as const, label: 'Coaching Skill', icon: Zap },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md border border-cyan-400'
                      : 'text-blue-300 hover:text-white hover:bg-blue-900/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: IDENTITY & NATIONALITY */}
          {activeTab === 'IDENTITY' && (
            <div className="p-5 rounded-3xl bg-[#06163a]/90 border border-blue-800/80 flex flex-col gap-5 shadow-xl">
              <div>
                <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                  Manager Full Name
                </label>
                <input
                  type="text"
                  value={character.name}
                  onChange={e => setCharacter({ ...character, name: e.target.value })}
                  placeholder="e.g. Victor Hernandez"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#030d22] border border-blue-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                    Age ({character.age} Years Old)
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="72"
                    value={character.age}
                    onChange={e => setCharacter({ ...character, age: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                    Gender Style
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCharacter({ ...character, gender: 'male' })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        character.gender === 'male'
                          ? 'bg-blue-600 text-white border-cyan-400'
                          : 'bg-[#030d22] text-blue-300 border-blue-800'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setCharacter({ ...character, gender: 'female' })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        character.gender === 'female'
                          ? 'bg-blue-600 text-white border-cyan-400'
                          : 'bg-[#030d22] text-blue-300 border-blue-800'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                  Nationality &amp; Flag ({character.nationality} {character.flag})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                  {NATIONALITIES.map(nat => (
                    <button
                      key={nat.code}
                      onClick={() =>
                        setCharacter({
                          ...character,
                          nationality: nat.name,
                          countryCode: nat.code,
                          flag: nat.flag,
                        })
                      }
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border transition text-left cursor-pointer ${
                        character.nationality === nat.name
                          ? 'bg-blue-600/90 text-white border-cyan-400'
                          : 'bg-[#030d22] text-blue-200 border-blue-800 hover:bg-blue-900/60'
                      }`}
                    >
                      <span className="text-base">{nat.flag}</span>
                      <span className="truncate">{nat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BODY BUILD & SKELETON (Height, Muscles, Arms) */}
          {activeTab === 'BODY_SKELETON' && (
            <div className="p-5 rounded-3xl bg-[#06163a]/90 border border-blue-800/80 flex flex-col gap-5 shadow-xl">
              {/* Height Slider (Tall or Short) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-blue-300 font-bold uppercase">
                    Height Stature (Tall or Short)
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold">
                    {character.heightCm} cm ({feet}&apos;{inches}&quot;) •{' '}
                    {character.heightCm >= 190 ? 'Towering' : character.heightCm <= 170 ? 'Compact' : 'Balanced'}
                  </span>
                </div>
                <input
                  type="range"
                  min="160"
                  max="205"
                  value={character.heightCm}
                  onChange={e => setCharacter({ ...character, heightCm: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-blue-400 font-mono mt-1">
                  <span>160 cm (Short)</span>
                  <span>182 cm (Average)</span>
                  <span>205 cm (Tall Titan)</span>
                </div>
              </div>

              {/* Muscular & Skeleton Frame */}
              <div>
                <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                  Muscular &amp; Skeleton Frame
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['slender', 'athletic', 'muscular', 'stocky'] as ManagerBuild[]).map(b => (
                    <button
                      key={b}
                      onClick={() => setCharacter({ ...character, bodyBuild: b })}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer capitalize ${
                        character.bodyBuild === b
                          ? 'bg-blue-600 text-white border-cyan-400 shadow-md font-black'
                          : 'bg-[#030d22] text-blue-300 border-blue-800 hover:bg-blue-900/60 font-semibold'
                      }`}
                    >
                      <div className="text-sm">{b}</div>
                      <div className="text-[10px] text-blue-300 font-normal mt-0.5">
                        {b === 'slender' && 'Lean silhouette'}
                        {b === 'athletic' && 'Toned shoulders'}
                        {b === 'muscular' && 'Broad chest & traps'}
                        {b === 'stocky' && 'Solid powerhouse'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arm Build & Reach */}
              <div>
                <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                  Arm Build &amp; Wingspan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['lean', 'toned', 'muscular', 'long'] as ManagerArmBuild[]).map(a => (
                    <button
                      key={a}
                      onClick={() => setCharacter({ ...character, armBuild: a })}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer capitalize ${
                        character.armBuild === a
                          ? 'bg-blue-600 text-white border-cyan-400 shadow-md font-black'
                          : 'bg-[#030d22] text-blue-300 border-blue-800 hover:bg-blue-900/60 font-semibold'
                      }`}
                    >
                      <div className="text-sm">{a} Arms</div>
                      <div className="text-[10px] text-blue-300 font-normal mt-0.5">
                        {a === 'lean' && 'Streamlined'}
                        {a === 'toned' && 'Athletic cut'}
                        {a === 'muscular' && 'Vigorous bulk'}
                        {a === 'long' && 'Wide wingspan'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FACE & HAIR (Nose, Eye, Hair & Color) */}
          {activeTab === 'FACE_HAIR' && (
            <div className="p-5 rounded-3xl bg-[#06163a]/90 border border-blue-800/80 flex flex-col gap-5 shadow-xl max-h-[500px] overflow-y-auto">
              {/* Nose Type */}
              <div>
                <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                  Nose Anatomy
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['straight', 'aquiline', 'button', 'broad', 'curved'] as ManagerNoseType[]).map(n => (
                    <button
                      key={n}
                      onClick={() => setCharacter({ ...character, noseType: n })}
                      className={`py-2 px-3 rounded-xl border text-center text-xs transition cursor-pointer capitalize ${
                        character.noseType === n
                          ? 'bg-blue-600 text-white border-cyan-400 font-bold'
                          : 'bg-[#030d22] text-blue-300 border-blue-800 hover:bg-blue-900/60'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eye Shape & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Eye Shape</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['almond', 'wide', 'deep', 'sharp'] as ManagerEyeShape[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setCharacter({ ...character, eyeShape: s })}
                        className={`py-2 px-3 rounded-xl border text-center text-xs transition cursor-pointer capitalize ${
                          character.eyeShape === s
                            ? 'bg-blue-600 text-white border-cyan-400 font-bold'
                            : 'bg-[#030d22] text-blue-300 border-blue-800'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                    Eye Iris Color
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {EYE_COLORS.map(c => (
                      <button
                        key={c.name}
                        onClick={() => setCharacter({ ...character, eyeColor: c.hex })}
                        className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-[11px] font-semibold transition cursor-pointer ${
                          character.eyeColor === c.hex
                            ? 'border-cyan-400 bg-blue-900 text-white'
                            : 'border-blue-800 bg-[#030d22] text-blue-300'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ backgroundColor: c.hex }} />
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hair Style & Color */}
              <div>
                <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                  Hairstyle
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['sidepart', 'slick', 'buzz', 'fade', 'wavy', 'ponytail', 'afro', 'bald'] as ManagerHairStyle[]).map(h => (
                    <button
                      key={h}
                      onClick={() => setCharacter({ ...character, hairStyle: h })}
                      className={`py-2 px-3 rounded-xl border text-center text-xs transition cursor-pointer capitalize ${
                        character.hairStyle === h
                          ? 'bg-blue-600 text-white border-cyan-400 font-bold'
                          : 'bg-[#030d22] text-blue-300 border-blue-800 hover:bg-blue-900/60'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                  Hair &amp; Beard Color
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {HAIR_COLORS.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setCharacter({ ...character, hairColor: c.hex })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[10px] font-semibold transition cursor-pointer ${
                        character.hairColor === c.hex
                          ? 'border-cyan-400 bg-blue-900 text-white font-bold'
                          : 'border-blue-800 bg-[#030d22] text-blue-300'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-white/40" style={{ backgroundColor: c.hex }} />
                      <span className="truncate text-center w-full">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Facial Hair */}
              <div>
                <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                  Facial Hair
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['clean', 'stubble', 'beard', 'goatee', 'mustache'] as ManagerFacialHair[]).map(f => (
                    <button
                      key={f}
                      onClick={() => setCharacter({ ...character, facialHair: f })}
                      className={`py-2 px-3 rounded-xl border text-center text-xs transition cursor-pointer capitalize ${
                        character.facialHair === f
                          ? 'bg-blue-600 text-white border-cyan-400 font-bold'
                          : 'bg-[#030d22] text-blue-300 border-blue-800 hover:bg-blue-900/60'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TOUCHLINE WARDROBE */}
          {activeTab === 'WARDROBE' && (
            <div className="p-5 rounded-3xl bg-[#06163a]/90 border border-blue-800/80 flex flex-col gap-5 shadow-xl">
              <div>
                <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                  Touchline Attire Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['suit', 'blazer', 'tracksuit', 'raincoat'] as ManagerAttire[]).map(a => (
                    <button
                      key={a}
                      onClick={() => setCharacter({ ...character, touchlineAttire: a })}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer capitalize ${
                        character.touchlineAttire === a
                          ? 'bg-blue-600 text-white border-cyan-400 font-black shadow-md'
                          : 'bg-[#030d22] text-blue-300 border-blue-800 hover:bg-blue-900/60 font-semibold'
                      }`}
                    >
                      <div className="text-sm">{a === 'suit' ? 'Tailored Suit' : a === 'blazer' ? 'Smart Blazer' : a === 'tracksuit' ? 'Club Tracksuit' : 'Storm Raincoat'}</div>
                      <div className="text-[10px] text-blue-300 font-normal mt-0.5">
                        {a === 'suit' && 'Formal European elegance'}
                        {a === 'blazer' && 'Modern casual chic'}
                        {a === 'tracksuit' && 'High-intensity sideline drill'}
                        {a === 'raincoat' && 'Winter tactical coat'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-blue-300 font-bold mb-2 uppercase">
                  Attire Color Palette
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SUIT_COLORS.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setCharacter({ ...character, suitColor: c.hex })}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        character.suitColor === c.hex
                          ? 'border-cyan-400 bg-blue-900 text-white font-bold'
                          : 'border-blue-800 bg-[#030d22] text-blue-300 hover:bg-blue-900/60'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-lg border border-white/40 shrink-0" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COACHING SKILL TREE & PHILOSOPHY */}
          {activeTab === 'PHILOSOPHY' && (
            <div className="p-5 rounded-3xl bg-[#06163a]/90 border border-blue-800/80 flex flex-col gap-3 shadow-xl max-h-[500px] overflow-y-auto">
              <div className="text-xs font-mono text-cyan-300 font-bold uppercase mb-1">
                Select Your Core Coaching Specialty (Permanent Career Perk)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COACHING_SKILLS.map(skill => {
                  const Icon = skill.icon;
                  const isSelected = character.coachingSkill === skill.id;
                  return (
                    <div
                      key={skill.id}
                      onClick={() => setCharacter({ ...character, coachingSkill: skill.id })}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-600/90 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg'
                          : 'bg-[#030d22] border-blue-800 hover:border-blue-700 hover:bg-blue-900/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black">
                              <Icon className="w-4 h-4 text-black" />
                            </div>
                            <span className="text-xs font-black uppercase text-white">{skill.title}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-cyan-300 stroke-[3]" />}
                        </div>
                        <p className="text-[11px] text-blue-200 mb-2 leading-relaxed">
                          {skill.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-blue-800/60 flex flex-col gap-1">
                        {skill.perks.map((p, idx) => (
                          <div key={idx} className="text-[10px] text-cyan-200 flex items-center gap-1 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
