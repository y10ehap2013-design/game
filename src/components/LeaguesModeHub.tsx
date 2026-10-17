/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Trophy,
  Play,
  Users,
  Compass,
  ArrowRight,
  ChevronLeft,
  Briefcase,
  Shield,
  Activity,
  Sliders,
  DollarSign,
  Calendar,
  Sparkles,
  Shuffle,
  Star,
  Award,
  Zap,
  Target,
  Flame,
  CheckCircle2,
  RefreshCw,
  Globe,
  Search,
  Filter,
  Layers,
  Trash2,
  Plus,
  Edit3,
  ArrowLeftRight,
  Settings2,
  X,
  AlertTriangle,
  Check,
  Building,
  Type,
} from 'lucide-react';
import { CLUB_LEAGUES, ClubLeague, ClubTeam, ClubPlayer } from '../data/clubLeagues.ts';
import {
  GLOBAL_LEAGUES_DIRECTORY,
  filterDirectory,
  DirectoryCountry,
  DirectoryTier,
} from '../data/globalLeaguesDirectory.ts';
import { Official2026Logo } from './Official2026Ball.tsx';

interface LeaguesModeHubProps {
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

type LeagueSubTab = 'PLAY_MATCH' | 'LEADERBOARD' | 'CAREER' | 'THE_TEAM' | 'CUSTOMIZE_LEAGUE';

// Technical Formations including 4-3-3 Attack and 4-2-2-4 Defence
export const TECHNICAL_FORMATIONS = [
  {
    id: '4-3-3 Attack',
    name: '4-3-3 Attack',
    category: 'Attacking Overload',
    description: 'High-octane offensive setup with inverted wingers, attacking CAM in half spaces, and aggressive high press.',
    mentality: 'Attacking',
    pressingIntensity: 88,
    defensiveLine: 82,
    tempo: 84,
    width: 'Wide',
    roles: [
      { pos: 'GK', label: 'Goalkeeper', x: 50, y: 92 },
      { pos: 'RB', label: 'Inverted Wingback', x: 86, y: 72 },
      { pos: 'CB', label: 'Ball Playing Defender', x: 62, y: 78 },
      { pos: 'CB', label: 'Covering Stopper', x: 38, y: 78 },
      { pos: 'LB', label: 'Attacking Fullback', x: 14, y: 72 },
      { pos: 'DMF', label: 'Anchor Man', x: 50, y: 55 },
      { pos: 'CMF', label: 'Box-to-Box', x: 32, y: 44 },
      { pos: 'AMF', label: 'Shadow Striker', x: 68, y: 38 },
      { pos: 'RWF', label: 'Inside Forward', x: 85, y: 22 },
      { pos: 'CF', label: 'Target Poacher', x: 50, y: 16 },
      { pos: 'LWF', label: 'Roaming Winger', x: 15, y: 22 },
    ],
  },
  {
    id: '4-2-2-4 Defence',
    name: '4-2-2-4 Defence',
    category: 'Ultra-Compact Low Block',
    description: 'Disciplined deep defensive shell with twin holding anchors, compact wide midfielders, and lethal counter outlets.',
    mentality: 'Defensive',
    pressingIntensity: 58,
    defensiveLine: 35,
    tempo: 68,
    width: 'Narrow',
    roles: [
      { pos: 'GK', label: 'Sweeper Keeper', x: 50, y: 92 },
      { pos: 'RB', label: 'Defensive Fullback', x: 85, y: 78 },
      { pos: 'CB', label: 'Stopper CB', x: 62, y: 82 },
      { pos: 'CB', label: 'Covering CB', x: 38, y: 82 },
      { pos: 'LB', label: 'Defensive Fullback', x: 15, y: 78 },
      { pos: 'DMF', label: 'Deep Destroyer', x: 38, y: 64 },
      { pos: 'DMF', label: 'Anchor Shield', x: 62, y: 64 },
      { pos: 'RMF', label: 'Defensive Winger', x: 82, y: 50 },
      { pos: 'LMF', label: 'Defensive Winger', x: 18, y: 50 },
      { pos: 'CF', label: 'Counter Target', x: 40, y: 22 },
      { pos: 'SS', label: 'Second Striker', x: 60, y: 24 },
    ],
  },
  {
    id: '4-2-3-1 Gegenpress',
    name: '4-2-3-1 Gegenpress',
    category: 'High Pressure Counter',
    description: 'Relentless gegenpressing system that wins the ball high and swarms opponent transitions.',
    mentality: 'Attacking',
    pressingIntensity: 92,
    defensiveLine: 78,
    tempo: 86,
    width: 'Balanced',
    roles: [
      { pos: 'GK', label: 'Sweeper Keeper', x: 50, y: 92 },
      { pos: 'RB', label: 'Wingback', x: 86, y: 70 },
      { pos: 'CB', label: 'Stopper', x: 63, y: 76 },
      { pos: 'CB', label: 'Covering', x: 37, y: 76 },
      { pos: 'LB', label: 'Wingback', x: 14, y: 70 },
      { pos: 'DMF', label: 'Destroyer', x: 36, y: 56 },
      { pos: 'DMF', label: 'Deep Playmaker', x: 64, y: 56 },
      { pos: 'RAMF', label: 'Pressing Winger', x: 82, y: 35 },
      { pos: 'CAM', label: 'Enganche No.10', x: 50, y: 36 },
      { pos: 'LAMF', label: 'Pressing Winger', x: 18, y: 35 },
      { pos: 'CF', label: 'Pressing Forward', x: 50, y: 16 },
    ],
  },
  {
    id: '4-4-2 Classic Flat',
    name: '4-4-2 Classic Flat',
    category: 'Balanced Traditional',
    description: 'Time-tested two banks of four with paired strikers, wide crosses, and balanced central coverage.',
    mentality: 'Balanced',
    pressingIntensity: 72,
    defensiveLine: 60,
    tempo: 75,
    width: 'Balanced',
    roles: [
      { pos: 'GK', label: 'Goalkeeper', x: 50, y: 92 },
      { pos: 'RB', label: 'Fullback', x: 86, y: 74 },
      { pos: 'CB', label: 'Central Defender', x: 62, y: 78 },
      { pos: 'CB', label: 'Central Defender', x: 38, y: 78 },
      { pos: 'LB', label: 'Fullback', x: 14, y: 74 },
      { pos: 'RMF', label: 'Wide Midfielder', x: 84, y: 48 },
      { pos: 'CMF', label: 'Box-to-Box', x: 62, y: 52 },
      { pos: 'CMF', label: 'Ball Winner', x: 38, y: 52 },
      { pos: 'LMF', label: 'Wide Midfielder', x: 16, y: 48 },
      { pos: 'CF', label: 'Target Man', x: 40, y: 18 },
      { pos: 'CF', label: 'Advanced Forward', x: 60, y: 18 },
    ],
  },
  {
    id: '3-5-2 Wing Control',
    name: '3-5-2 Wing Control',
    category: 'Midfield Overload',
    description: 'Dominates central midfield with three centerbacks and energetic full-length wingbacks providing width.',
    mentality: 'Balanced',
    pressingIntensity: 80,
    defensiveLine: 70,
    tempo: 78,
    width: 'Wide',
    roles: [
      { pos: 'GK', label: 'Goalkeeper', x: 50, y: 92 },
      { pos: 'CB', label: 'Right Centerback', x: 74, y: 80 },
      { pos: 'CB', label: 'Libero / Sweeper', x: 50, y: 83 },
      { pos: 'CB', label: 'Left Centerback', x: 26, y: 80 },
      { pos: 'RWB', label: 'Complete Wingback', x: 88, y: 48 },
      { pos: 'LWB', label: 'Complete Wingback', x: 12, y: 48 },
      { pos: 'CMF', label: 'Deep Playmaker', x: 50, y: 56 },
      { pos: 'CMF', label: 'Carrilero', x: 68, y: 44 },
      { pos: 'CMF', label: 'Mezzala', x: 32, y: 44 },
      { pos: 'CF', label: 'Poacher', x: 40, y: 18 },
      { pos: 'CF', label: 'Speed Forward', x: 60, y: 18 },
    ],
  },
  {
    id: '5-3-2 Park The Bus',
    name: '5-3-2 Park The Bus',
    category: 'Iron Fortress',
    description: 'Five defenders holding the penalty box perimeter, absorbing pressure, and launching sudden long balls.',
    mentality: 'Ultra-Defensive',
    pressingIntensity: 45,
    defensiveLine: 28,
    tempo: 60,
    width: 'Narrow',
    roles: [
      { pos: 'GK', label: 'Goalkeeper', x: 50, y: 92 },
      { pos: 'RWB', label: 'Defensive Wingback', x: 88, y: 78 },
      { pos: 'CB', label: 'Right Stopper', x: 68, y: 82 },
      { pos: 'CB', label: 'Central Anchor CB', x: 50, y: 84 },
      { pos: 'CB', label: 'Left Stopper', x: 32, y: 82 },
      { pos: 'LWB', label: 'Defensive Wingback', x: 12, y: 78 },
      { pos: 'CMF', label: 'Destroyer', x: 34, y: 60 },
      { pos: 'DMF', label: 'Central Shield', x: 50, y: 64 },
      { pos: 'CMF', label: 'Hard Tackler', x: 66, y: 60 },
      { pos: 'CF', label: 'Long Ball Target', x: 40, y: 24 },
      { pos: 'CF', label: 'Fast Runner', x: 60, y: 22 },
    ],
  },
];

// Popular preset teams for instant swap ("Put This & Delete This")
const POPULAR_SWAP_PRESETS = [
  { name: 'Real Madrid CF', short: 'RMA', country: 'Spain', color: '#FFFFFF', secondary: '#0C2340', stadium: 'Santiago Bernabéu' },
  { name: 'FC Barcelona', short: 'BAR', country: 'Spain', color: '#004D98', secondary: '#A50044', stadium: 'Spotify Camp Nou' },
  { name: 'Manchester City', short: 'MCI', country: 'England', color: '#6CABDD', secondary: '#FFFFFF', stadium: 'Etihad Stadium' },
  { name: 'Arsenal FC', short: 'ARS', country: 'England', color: '#EF0107', secondary: '#FFFFFF', stadium: 'Emirates Stadium' },
  { name: 'Liverpool FC', short: 'LIV', country: 'England', color: '#C8102E', secondary: '#00B2A9', stadium: 'Anfield' },
  { name: 'Bayern Munich', short: 'BAY', country: 'Germany', color: '#DC052D', secondary: '#FFFFFF', stadium: 'Allianz Arena' },
  { name: 'Paris Saint-Germain', short: 'PSG', country: 'France', color: '#004170', secondary: '#DA291C', stadium: 'Parc des Princes' },
  { name: 'Inter Milan', short: 'INT', country: 'Italy', color: '#010E80', secondary: '#000000', stadium: 'San Siro' },
  { name: 'Juventus FC', short: 'JUV', country: 'Italy', color: '#000000', secondary: '#FFFFFF', stadium: 'Allianz Stadium' },
  { name: 'Al Ahly SC', short: 'AHL', country: 'Egypt', color: '#E30613', secondary: '#FFFFFF', stadium: 'Cairo International Stadium' },
  { name: 'Zamalek SC', short: 'ZAM', country: 'Egypt', color: '#FFFFFF', secondary: '#E30613', stadium: 'Cairo Stadium' },
  { name: 'Pyramids FC', short: 'PYR', country: 'Egypt', color: '#1B365D', secondary: '#A2C523', stadium: '30 June Stadium' },
  { name: 'Wydad AC', short: 'WAC', country: 'Morocco', color: '#D40000', secondary: '#FFFFFF', stadium: 'Stade Mohammed V' },
  { name: 'Raja CA', short: 'RCA', country: 'Morocco', color: '#008751', secondary: '#FFFFFF', stadium: 'Stade Mohammed V' },
  { name: 'Al Hilal SFC', short: 'HIL', country: 'Saudi Arabia', color: '#002B7F', secondary: '#FFFFFF', stadium: 'Kingdom Arena' },
  { name: 'Al Nassr FC', short: 'NAS', country: 'Saudi Arabia', color: '#FCD116', secondary: '#002B7F', stadium: 'Al-Awwal Park' },
  { name: 'Al Ittihad', short: 'ITT', country: 'Saudi Arabia', color: '#FEE100', secondary: '#000000', stadium: 'King Abdullah Sports City' },
  { name: 'Boca Juniors', short: 'BOC', country: 'Argentina', color: '#003366', secondary: '#FCB514', stadium: 'La Bombonera' },
  { name: 'River Plate', short: 'RIV', country: 'Argentina', color: '#FFFFFF', secondary: '#D81E05', stadium: 'El Monumental' },
  { name: 'Flamengo', short: 'FLA', country: 'Brazil', color: '#C8102E', secondary: '#000000', stadium: 'Maracanã' },
  { name: 'Inter Miami CF', short: 'MIA', country: 'USA', color: '#F7B5CD', secondary: '#000000', stadium: 'Chase Stadium' },
  { name: 'Wrexham AFC', short: 'WRX', country: 'Wales', color: '#D71920', secondary: '#FFFFFF', stadium: 'Racecourse Ground' },
];

// Helper to create a custom team
function makeCustomTeam(
  name: string,
  shortName: string,
  country: string,
  stadiumName: string,
  primaryColor: string,
  secondaryColor: string,
  rating: number = 84
): ClubTeam {
  const teamId = `CUSTOM_${name.replace(/\s+/g, '_').toUpperCase()}_${Date.now().toString(36)}`;
  return {
    id: teamId,
    name,
    shortName: (shortName || name.slice(0, 3)).slice(0, 3).toUpperCase(),
    leagueId: 'CUSTOM',
    country: country || 'International',
    stadiumName: stadiumName || `${name} Arena`,
    stadiumAtmosphere: {
      crowdChantType: `${name} Ultras Roar`,
      weatherPreset: 'Floodlit Night',
      capacity: 45000,
    },
    primaryColor: primaryColor || '#1e40af',
    secondaryColor: secondaryColor || '#ffffff',
    accentColor: primaryColor || '#1e40af',
    tactics: {
      formation: '4-3-3 Attack',
      style: 'Fast Counter',
      pressingIntensity: 85,
      defensiveLine: 78,
    },
    players: [
      {
        id: `P_${teamId}_1`,
        name: `${name} Goalkeeper`,
        position: 'GK',
        age: 28,
        kitNumber: 1,
        attributes: { pace: 62, shooting: 20, passing: 70, dribbling: 55, defending: 72, physical: 84, gkReflexes: rating },
        overallRating: rating,
        marketValueM: 18,
        wageK: 70,
        nationality: country || 'International',
        loadProfile: { matchesLast14Days: 2, minutesPlayedLast14Days: 180, highIntensitySprintKm: 4, currentStamina: 95, recoveryDays: 3, priorInjuriesCount: 0, age: 28 },
      },
      {
        id: `P_${teamId}_4`,
        name: `${name} Leader CB`,
        position: 'CB',
        age: 29,
        kitNumber: 4,
        attributes: { pace: 78, shooting: 40, passing: 76, dribbling: 68, defending: rating, physical: 86 },
        overallRating: rating,
        marketValueM: 22,
        wageK: 85,
        nationality: country || 'International',
        loadProfile: { matchesLast14Days: 2, minutesPlayedLast14Days: 180, highIntensitySprintKm: 7.2, currentStamina: 90, recoveryDays: 4, priorInjuriesCount: 1, age: 29 },
      },
      {
        id: `P_${teamId}_6`,
        name: `${name} Anchor Mid`,
        position: 'DMF',
        age: 26,
        kitNumber: 6,
        attributes: { pace: 80, shooting: 72, passing: 86, dribbling: 80, defending: rating, physical: 83 },
        overallRating: rating,
        marketValueM: 26,
        wageK: 90,
        nationality: country || 'International',
        loadProfile: { matchesLast14Days: 2, minutesPlayedLast14Days: 175, highIntensitySprintKm: 9.0, currentStamina: 91, recoveryDays: 3, priorInjuriesCount: 0, age: 26 },
      },
      {
        id: `P_${teamId}_10`,
        name: `${name} Playmaker No.10`,
        position: 'AMF',
        age: 25,
        kitNumber: 10,
        attributes: { pace: 85, shooting: 84, passing: 90, dribbling: 89, defending: 50, physical: 76 },
        overallRating: Math.min(99, rating + 2),
        marketValueM: 38,
        wageK: 110,
        nationality: country || 'International',
        loadProfile: { matchesLast14Days: 2, minutesPlayedLast14Days: 170, highIntensitySprintKm: 8.5, currentStamina: 92, recoveryDays: 4, priorInjuriesCount: 0, age: 25 },
      },
      {
        id: `P_${teamId}_9`,
        name: `${name} Ace Striker`,
        position: 'CF',
        age: 26,
        kitNumber: 9,
        attributes: { pace: 89, shooting: 91, passing: 80, dribbling: 88, defending: 42, physical: 84 },
        overallRating: Math.min(99, rating + 3),
        marketValueM: 48,
        wageK: 140,
        nationality: country || 'International',
        loadProfile: { matchesLast14Days: 2, minutesPlayedLast14Days: 175, highIntensitySprintKm: 9.8, currentStamina: 90, recoveryDays: 4, priorInjuriesCount: 1, age: 26 },
      },
    ],
  };
}

// Helper to convert any directory tier into a fully interactive ClubLeague
function createLeagueFromDirectoryTier(country: string, tier: DirectoryTier): ClubLeague {
  const primaryColors = [
    '#1e40af', '#dc2626', '#047857', '#b45309', '#6b21a8',
    '#0e7490', '#c2410c', '#374151', '#4338ca', '#15803d',
    '#e11d48', '#0891b2', '#ca8a04', '#475569', '#2563eb'
  ];

  const teams: ClubTeam[] = tier.featuredTeams.map((teamName, idx) => {
    const color = primaryColors[idx % primaryColors.length];
    return {
      id: `DIR_${teamName.replace(/\s+/g, '_').toUpperCase()}`,
      name: teamName,
      shortName: teamName.slice(0, 3).toUpperCase(),
      leagueId: `DIR_${tier.tierName.replace(/\s+/g, '_')}`,
      country,
      stadiumName: `${teamName} Arena`,
      stadiumAtmosphere: {
        crowdChantType: `${teamName} Faithful Choir`,
        weatherPreset: 'Floodlit Night',
        capacity: 35000 + (idx * 5000),
      },
      primaryColor: color,
      secondaryColor: '#ffffff',
      accentColor: color,
      tactics: {
        formation: idx % 2 === 0 ? '4-3-3 Attack' : '4-2-2-4 Defence',
        style: 'Fast Counter',
        pressingIntensity: 85,
        defensiveLine: 75,
      },
      players: [
        {
          id: `P_${teamName}_1`,
          name: `${teamName} Goalkeeper`,
          position: 'GK',
          age: 28,
          kitNumber: 1,
          attributes: { pace: 62, shooting: 20, passing: 68, dribbling: 50, defending: 70, physical: 82, gkReflexes: 85 },
          overallRating: 84,
          marketValueM: 10,
          wageK: 50,
          nationality: country,
          loadProfile: { matchesLast14Days: 2, minutesPlayedLast14Days: 180, highIntensitySprintKm: 4, currentStamina: 95, recoveryDays: 3, priorInjuriesCount: 0, age: 28 },
        },
        {
          id: `P_${teamName}_9`,
          name: `${teamName} Ace Striker`,
          position: 'CF',
          age: 26,
          kitNumber: 9,
          attributes: { pace: 88, shooting: 89, passing: 80, dribbling: 86, defending: 42, physical: 83 },
          overallRating: 87,
          marketValueM: 35,
          wageK: 120,
          nationality: country,
          loadProfile: { matchesLast14Days: 2, minutesPlayedLast14Days: 175, highIntensitySprintKm: 9.5, currentStamina: 90, recoveryDays: 4, priorInjuriesCount: 1, age: 26 },
        },
        {
          id: `P_${teamName}_10`,
          name: `${teamName} Playmaker`,
          position: 'AMF',
          age: 25,
          kitNumber: 10,
          attributes: { pace: 84, shooting: 83, passing: 90, dribbling: 89, defending: 55, physical: 76 },
          overallRating: 86,
          marketValueM: 28,
          wageK: 95,
          nationality: country,
          loadProfile: { matchesLast14Days: 2, minutesPlayedLast14Days: 170, highIntensitySprintKm: 8, currentStamina: 92, recoveryDays: 3, priorInjuriesCount: 0, age: 25 },
        },
        {
          id: `P_${teamName}_4`,
          name: `${teamName} Captain CB`,
          position: 'CB',
          age: 29,
          kitNumber: 4,
          attributes: { pace: 78, shooting: 45, passing: 76, dribbling: 70, defending: 88, physical: 87 },
          overallRating: 85,
          marketValueM: 20,
          wageK: 80,
          nationality: country,
          loadProfile: { matchesLast14Days: 2, minutesPlayedLast14Days: 180, highIntensitySprintKm: 7, currentStamina: 88, recoveryDays: 4, priorInjuriesCount: 1, age: 29 },
        },
      ],
    };
  });

  return {
    id: `DIR_${tier.tierName.replace(/\s+/g, '_')}`,
    name: `${tier.tierName} (${country})`,
    region: 'Fully Licensed Europe',
    country,
    licensingTier: 'Full License',
    teams,
  };
}

export const LeaguesModeHub: React.FC<LeaguesModeHubProps> = ({
  onBackToModeChoose,
  onLaunchMatch,
}) => {
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [customDirectoryLeague, setCustomDirectoryLeague] = useState<ClubLeague | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<LeagueSubTab>('PLAY_MATCH');

  // Directory Search & Filters
  const [directorySearch, setDirectorySearch] = useState<string>('');
  const [directoryConfed, setDirectoryConfed] = useState<string>('ALL');
  const [directoryTier, setDirectoryTier] = useState<number | 'ALL'>('ALL');

  // Local storage customization cache
  const [leagueOverrides, setLeagueOverrides] = useState<Record<string, ClubLeague>>(() => {
    try {
      const saved = localStorage.getItem('fifa_customized_leagues_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Base league computation
  const baseLeague = useMemo(() => {
    if (customDirectoryLeague) return customDirectoryLeague;
    return CLUB_LEAGUES.find((l) => l.id === selectedLeagueId) || null;
  }, [selectedLeagueId, customDirectoryLeague]);

  // Active league with customizations applied
  const selectedLeague = useMemo(() => {
    if (!baseLeague) return null;
    return leagueOverrides[baseLeague.id] || baseLeague;
  }, [baseLeague, leagueOverrides]);

  const [homeTeamIdx, setHomeTeamIdx] = useState<number>(0);
  const [awayTeamIdx, setAwayTeamIdx] = useState<number>(1);
  const [matchLength, setMatchLength] = useState<string>('5 Mins');
  const [difficulty, setDifficulty] = useState<string>('World Class');
  const [simResult, setSimResult] = useState<{
    scoreA: number;
    scoreB: number;
    events: string[];
  } | null>(null);

  // Career state
  const [careerClubIdx, setCareerClubIdx] = useState<number>(0);
  const [careerWeek, setCareerWeek] = useState<number>(1);
  const [transferBudget, setTransferBudget] = useState<number>(45.5);
  const [careerNotification, setCareerNotification] = useState<string | null>(null);

  // Technical Tactics state
  const [currentFormationId, setCurrentFormationId] = useState<string>('4-3-3 Attack');
  const [mentality, setMentality] = useState<string>('Attacking');
  const [pressingValue, setPressingValue] = useState<number>(88);
  const [defensiveLineValue, setDefensiveLineValue] = useState<number>(82);
  const [buildUpStyle, setBuildUpStyle] = useState<string>('Fast Counter');
  const [compactness, setCompactness] = useState<string>('Standard');

  // Customization & Text Editor States
  const [customToast, setCustomToast] = useState<string | null>(null);
  const [customizeSubMode, setCustomizeSubMode] = useState<'SWAP' | 'DELETE' | 'ADD' | 'TEXT_EDITOR'>('SWAP');

  // "Put this and delete this" state
  const [swapDeleteTeamId, setSwapDeleteTeamId] = useState<string>('');
  const [swapPutOption, setSwapPutOption] = useState<'PRESET' | 'CUSTOM'>('PRESET');
  const [selectedSwapPresetIdx, setSelectedSwapPresetIdx] = useState<number>(0);
  const [customPutName, setCustomPutName] = useState<string>('');
  const [customPutShort, setCustomPutShort] = useState<string>('');
  const [customPutCountry, setCustomPutCountry] = useState<string>('');
  const [customPutStadium, setCustomPutStadium] = useState<string>('');
  const [customPutColor, setCustomPutColor] = useState<string>('#1E40AF');

  // "Put this" (Add Team) state
  const [addTeamName, setAddTeamName] = useState<string>('');
  const [addTeamShort, setAddTeamShort] = useState<string>('');
  const [addTeamCountry, setAddTeamCountry] = useState<string>('');
  const [addTeamStadium, setAddTeamStadium] = useState<string>('');
  const [addTeamColor, setAddTeamColor] = useState<string>('#DC2626');
  const [addTeamRating, setAddTeamRating] = useState<number>(85);

  // "Delete this text and add this text" state
  const [textEditTarget, setTextEditTarget] = useState<'LEAGUE' | 'TEAM' | 'PLAYER'>('LEAGUE');
  const [textEditTeamId, setTextEditTeamId] = useState<string>('');
  const [textEditPlayerId, setTextEditPlayerId] = useState<string>('');
  const [newTextLeagueName, setNewTextLeagueName] = useState<string>('');
  const [newTextCountry, setNewTextCountry] = useState<string>('');
  const [newTextTeamName, setNewTextTeamName] = useState<string>('');
  const [newTextTeamShort, setNewTextTeamShort] = useState<string>('');
  const [newTextStadium, setNewTextStadium] = useState<string>('');
  const [newTextPlayerName, setNewTextPlayerName] = useState<string>('');

  const activeFormation =
    TECHNICAL_FORMATIONS.find((f) => f.id === currentFormationId) || TECHNICAL_FORMATIONS[0];

  // Filtered Global Directory
  const filteredDirectoryCountries = useMemo(() => {
    return filterDirectory(directorySearch, directoryConfed, directoryTier);
  }, [directorySearch, directoryConfed, directoryTier]);

  // Synchronize swap target team default when league changes
  useEffect(() => {
    if (selectedLeague && selectedLeague.teams.length > 0) {
      if (!swapDeleteTeamId || !selectedLeague.teams.some(t => t.id === swapDeleteTeamId)) {
        setSwapDeleteTeamId(selectedLeague.teams[0].id);
      }
      if (!textEditTeamId || !selectedLeague.teams.some(t => t.id === textEditTeamId)) {
        setTextEditTeamId(selectedLeague.teams[0].id);
      }
      setNewTextLeagueName(selectedLeague.name);
      setNewTextCountry(selectedLeague.country);
      setNewTextTeamName(selectedLeague.teams[0].name);
      setNewTextTeamShort(selectedLeague.teams[0].shortName);
      setNewTextStadium(selectedLeague.teams[0].stadiumName);
      if (selectedLeague.teams[0].players.length > 0) {
        setTextEditPlayerId(selectedLeague.teams[0].players[0].id);
        setNewTextPlayerName(selectedLeague.teams[0].players[0].name);
      }
    }
  }, [selectedLeague]);

  const showNotification = (msg: string) => {
    setCustomToast(msg);
    setTimeout(() => {
      setCustomToast((current) => (current === msg ? null : current));
    }, 3800);
  };

  // Helper to persist league edits
  const saveLeagueOverride = (updated: ClubLeague) => {
    setLeagueOverrides((prev) => {
      const nextMap = { ...prev, [updated.id]: updated };
      try {
        localStorage.setItem('fifa_customized_leagues_v2', JSON.stringify(nextMap));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }
      return nextMap;
    });
  };

  // 1. "delete this from the league"
  const handleDeleteTeamFromLeague = (teamId: string) => {
    if (!selectedLeague) return;
    if (selectedLeague.teams.length <= 2) {
      showNotification('⚠️ Cannot delete: League requires at least 2 clubs to play!');
      return;
    }
    const targetTeam = selectedLeague.teams.find((t) => t.id === teamId);
    const filteredTeams = selectedLeague.teams.filter((t) => t.id !== teamId);
    const updatedLeague: ClubLeague = {
      ...selectedLeague,
      teams: filteredTeams,
    };
    saveLeagueOverride(updatedLeague);
    setHomeTeamIdx(0);
    setAwayTeamIdx(Math.min(1, filteredTeams.length - 1));
    setSimResult(null);
    showNotification(`🗑️ Deleted "${targetTeam?.name || 'Club'}" from ${selectedLeague.name}!`);
  };

  // 2. "put this" (Add Team to League)
  const handlePutTeamIntoLeague = () => {
    if (!selectedLeague) return;
    if (!addTeamName.trim()) {
      showNotification('⚠️ Please enter a team name to put!');
      return;
    }
    const newTeam = makeCustomTeam(
      addTeamName.trim(),
      addTeamShort.trim() || addTeamName.trim().slice(0, 3),
      addTeamCountry.trim() || selectedLeague.country,
      addTeamStadium.trim(),
      addTeamColor,
      '#FFFFFF',
      addTeamRating
    );
    const updatedLeague: ClubLeague = {
      ...selectedLeague,
      teams: [...selectedLeague.teams, newTeam],
    };
    saveLeagueOverride(updatedLeague);
    setAddTeamName('');
    setAddTeamShort('');
    setAddTeamStadium('');
    showNotification(`✨ Put new team "${newTeam.name}" into ${selectedLeague.name}!`);
  };

  // 3. "put this and delete this" (Swap Team)
  const handlePutThisAndDeleteThis = () => {
    if (!selectedLeague) return;
    const teamToDelete = selectedLeague.teams.find((t) => t.id === swapDeleteTeamId) || selectedLeague.teams[0];
    if (!teamToDelete) return;

    let replacementTeam: ClubTeam;
    if (swapPutOption === 'PRESET') {
      const preset = POPULAR_SWAP_PRESETS[selectedSwapPresetIdx];
      replacementTeam = makeCustomTeam(
        preset.name,
        preset.short,
        preset.country,
        preset.stadium,
        preset.color,
        preset.secondary,
        87
      );
    } else {
      if (!customPutName.trim()) {
        showNotification('⚠️ Please enter what team name to put!');
        return;
      }
      replacementTeam = makeCustomTeam(
        customPutName.trim(),
        customPutShort.trim() || customPutName.trim().slice(0, 3),
        customPutCountry.trim() || selectedLeague.country,
        customPutStadium.trim(),
        customPutColor,
        '#FFFFFF',
        86
      );
    }

    const updatedTeams = selectedLeague.teams.map((t) => (t.id === teamToDelete.id ? replacementTeam : t));
    const updatedLeague: ClubLeague = {
      ...selectedLeague,
      teams: updatedTeams,
    };
    saveLeagueOverride(updatedLeague);
    showNotification(`🔁 Put "${replacementTeam.name}" & deleted "${teamToDelete.name}" successfully!`);
    setCustomPutName('');
    setCustomPutShort('');
  };

  // 4. "delete this text and add this text"
  const handleDeleteTextAndAddText = (
    field: 'LEAGUE_NAME' | 'LEAGUE_COUNTRY' | 'TEAM_NAME' | 'TEAM_SHORT' | 'STADIUM_NAME' | 'PLAYER_NAME'
  ) => {
    if (!selectedLeague) return;
    const updatedLeague: ClubLeague = { ...selectedLeague };

    if (field === 'LEAGUE_NAME') {
      if (!newTextLeagueName.trim()) return;
      const old = updatedLeague.name;
      updatedLeague.name = newTextLeagueName.trim();
      saveLeagueOverride(updatedLeague);
      showNotification(`✏️ Deleted text "${old}" and added text "${newTextLeagueName.trim()}"!`);
    } else if (field === 'LEAGUE_COUNTRY') {
      if (!newTextCountry.trim()) return;
      const old = updatedLeague.country;
      updatedLeague.country = newTextCountry.trim();
      saveLeagueOverride(updatedLeague);
      showNotification(`✏️ Deleted country text "${old}" and added "${newTextCountry.trim()}"!`);
    } else if (field === 'TEAM_NAME') {
      if (!newTextTeamName.trim()) return;
      const t = updatedLeague.teams.find((item) => item.id === textEditTeamId);
      const old = t?.name || '';
      updatedLeague.teams = updatedLeague.teams.map((item) =>
        item.id === textEditTeamId ? { ...item, name: newTextTeamName.trim() } : item
      );
      saveLeagueOverride(updatedLeague);
      showNotification(`✏️ Deleted team text "${old}" and added "${newTextTeamName.trim()}"!`);
    } else if (field === 'TEAM_SHORT') {
      if (!newTextTeamShort.trim()) return;
      updatedLeague.teams = updatedLeague.teams.map((item) =>
        item.id === textEditTeamId
          ? { ...item, shortName: newTextTeamShort.trim().slice(0, 3).toUpperCase() }
          : item
      );
      saveLeagueOverride(updatedLeague);
      showNotification(`✏️ Updated short abbreviation to "${newTextTeamShort.trim().toUpperCase()}"!`);
    } else if (field === 'STADIUM_NAME') {
      if (!newTextStadium.trim()) return;
      updatedLeague.teams = updatedLeague.teams.map((item) =>
        item.id === textEditTeamId ? { ...item, stadiumName: newTextStadium.trim() } : item
      );
      saveLeagueOverride(updatedLeague);
      showNotification(`✏️ Updated stadium text to "${newTextStadium.trim()}"!`);
    } else if (field === 'PLAYER_NAME') {
      if (!newTextPlayerName.trim()) return;
      updatedLeague.teams = updatedLeague.teams.map((item) => ({
        ...item,
        players: item.players.map((p) =>
          p.id === textEditPlayerId ? { ...p, name: newTextPlayerName.trim() } : p
        ),
      }));
      saveLeagueOverride(updatedLeague);
      showNotification(`✏️ Updated player name to "${newTextPlayerName.trim()}"!`);
    }
  };

  // Reset to original factory league
  const handleResetLeague = () => {
    if (!selectedLeague || !baseLeague) return;
    setLeagueOverrides((prev) => {
      const copy = { ...prev };
      delete copy[baseLeague.id];
      try {
        localStorage.setItem('fifa_customized_leagues_v2', JSON.stringify(copy));
      } catch {}
      return copy;
    });
    setHomeTeamIdx(0);
    setAwayTeamIdx(Math.min(1, baseLeague.teams.length - 1));
    showNotification(`🔄 Reset "${baseLeague.name}" back to default!`);
  };

  // Select tier from Global Directory to open in League Hub
  const handleSelectDirectoryTier = (countryName: string, tier: DirectoryTier) => {
    const createdLeague = createLeagueFromDirectoryTier(countryName, tier);
    setCustomDirectoryLeague(createdLeague);
    setSelectedLeagueId(createdLeague.id);
    setActiveSubTab('PLAY_MATCH');
    setHomeTeamIdx(0);
    setAwayTeamIdx(Math.min(1, createdLeague.teams.length - 1));
    setSimResult(null);
  };

  // Simulate Instant League Match
  const handleSimulateMatch = () => {
    if (!selectedLeague || !selectedLeague.teams[homeTeamIdx]) return;
    const homeTeam = selectedLeague.teams[homeTeamIdx];
    const awayTeam = selectedLeague.teams[awayTeamIdx] || selectedLeague.teams[0];

    const scoreA = Math.floor(Math.random() * 4);
    const scoreB = Math.floor(Math.random() * 3);
    const events: string[] = [
      `Kick-off at ${homeTeam.stadiumName}! Atmosphere is electric.`,
    ];
    if (scoreA > 0) {
      events.push(`GOAL! ${homeTeam.name} strikes with precision finish!`);
    }
    if (scoreB > 0) {
      events.push(`GOAL! ${awayTeam.name} answers back with a thunderbolt!`);
    }
    events.push(
      `Full Time: ${homeTeam.name} ${scoreA} - ${scoreB} ${awayTeam.name}. Points recorded.`
    );
    setSimResult({ scoreA, scoreB, events });
  };

  return (
    <div className="w-full h-full bg-[#030d22] text-white flex flex-col overflow-hidden font-sans select-none relative">
      {/* Dynamic Action Notification Toast */}
      {customToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-blue-600 border-2 border-cyan-300 text-white shadow-[0_0_35px_rgba(37,99,235,0.8)] animate-bounce font-black text-xs sm:text-sm">
          <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
            <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
          </div>
          <span>{customToast}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="w-full bg-[#061536] border-b border-blue-900/60 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (selectedLeagueId || customDirectoryLeague) {
                setSelectedLeagueId(null);
                setCustomDirectoryLeague(null);
              } else {
                onBackToModeChoose();
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-white border border-blue-700/60 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow"
          >
            <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
              <ChevronLeft className="w-4 h-4 text-black stroke-[3]" />
            </div>
            <span>{selectedLeague ? 'Back to Global Directory' : 'Mode Select'}</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black shadow-sm">
              <Globe className="w-4 h-4 text-black" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase flex items-center gap-2">
                <span>GLOBAL FOOTBALL LEAGUES</span>
                {selectedLeague && (
                  <>
                    <span className="text-blue-400 font-normal">/</span>
                    <span className="text-cyan-300 font-black">{selectedLeague.name}</span>
                  </>
                )}
              </h1>
              <p className="text-[11px] text-blue-200">
                {selectedLeague
                  ? `${selectedLeague.teams.length} Licensed Clubs • Put & Delete Teams • Edit Texts • Leaderboard & Tactics`
                  : 'Comprehensive Multi-Tier Pyramid Mapping • UEFA, CAF, AFC, CONMEBOL, CONCACAF, OFC'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Header Badges & Actions */}
        <div className="flex items-center gap-2">
          {selectedLeague && (
            <>
              {leagueOverrides[selectedLeague.id] && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-400/80 text-[11px] font-mono font-bold text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  CUSTOMIZED
                </span>
              )}

              <button
                onClick={handleResetLeague}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-200 hover:text-white border border-blue-800 text-xs font-bold transition-all cursor-pointer"
                title="Reset this league back to default teams and original texts"
              >
                <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                  <RefreshCw className="w-2.5 h-2.5 text-black" />
                </div>
                <span className="hidden sm:inline">Reset League</span>
              </button>
            </>
          )}

          {!selectedLeague && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950 border border-blue-800 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{filteredDirectoryCountries.length} COUNTRIES &amp; PYRAMIDS</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-[#040f28] via-[#020b1f] to-[#010612]">
        {/* =========================================================================
            STATE 1: COMPLETE GLOBAL FOOTBALL LEAGUES DIRECTORY (MULTI-TIER PYRAMIDS)
        ========================================================================== */}
        {!selectedLeague && (
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {/* Directory Header Hero */}
            <div className="bg-[#091b40]/90 border border-blue-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-blue-800/80">
                <div className="flex items-center gap-4">
                  <Official2026Logo ballSize={68} layout="horizontal" />
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                      <span>GLOBAL FOOTBALL LEAGUES DIRECTORY</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-200 mt-0.5 max-w-2xl leading-relaxed">
                      A comprehensive mapping of domestic football structures across major and minor nations, spanning multiple tiers (Tier 1 to Tier 5), official domestic pyramids, and key featured member clubs.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950 border border-blue-800 text-xs font-mono text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ALL CONTINENTS ACTIVE</span>
                </div>
              </div>

              {/* Search Bar & Confederation / Tier Filters */}
              <div className="flex flex-col gap-4 mt-5">
                {/* Search Bar */}
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <div className="w-5 h-5 rounded bg-white flex items-center justify-center text-black">
                      <Search className="w-3.5 h-3.5 text-black" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    placeholder="Search country, league, or team (e.g. Wrexham, Schalke 04, Palermo, Pyramids, Al Ahly, Sunderland, Würzburg)..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#05112c] border border-blue-700/80 text-white placeholder-blue-300 text-sm font-semibold focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
                  />
                  {directorySearch && (
                    <button
                      onClick={() => setDirectorySearch('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-blue-300 hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Confederation Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-blue-200 flex items-center gap-1.5 mr-1">
                    <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                      <Filter className="w-2.5 h-2.5 text-black" />
                    </div>
                    <span>Confederation:</span>
                  </span>
                  {[
                    { id: 'ALL', label: 'All Continents' },
                    { id: 'UEFA', label: 'UEFA (Europe)' },
                    { id: 'CAF', label: 'CAF (Africa)' },
                    { id: 'AFC', label: 'AFC (Asia & Oceania)' },
                    { id: 'CONMEBOL', label: 'CONMEBOL (South America)' },
                    { id: 'CONCACAF', label: 'CONCACAF (North & Central America)' },
                    { id: 'OFC', label: 'OFC (Oceania Minor)' },
                  ].map((conf) => (
                    <button
                      key={conf.id}
                      onClick={() => setDirectoryConfed(conf.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        directoryConfed === conf.id
                          ? 'bg-white text-black font-black shadow-md'
                          : 'bg-[#05112c] text-blue-200 hover:text-white border border-blue-800'
                      }`}
                    >
                      {conf.label}
                    </button>
                  ))}
                </div>

                {/* Tier Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-blue-200 flex items-center gap-1.5 mr-1">
                    <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                      <Layers className="w-2.5 h-2.5 text-black" />
                    </div>
                    <span>Pyramid Tier:</span>
                  </span>
                  {[
                    { id: 'ALL', label: 'All Tiers' },
                    { id: 1, label: 'Tier 1 (Top-Flight)' },
                    { id: 2, label: 'Tier 2 (Championship / 2nd Div)' },
                    { id: 3, label: 'Tier 3 (League One / 3rd Div)' },
                    { id: 4, label: 'Tier 4 (League Two / 4th Div)' },
                    { id: 5, label: 'Tier 5 (National / 5th Div)' },
                  ].map((t) => (
                    <button
                      key={String(t.id)}
                      onClick={() => setDirectoryTier(t.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        directoryTier === t.id
                          ? 'bg-cyan-400 text-black font-black shadow-md'
                          : 'bg-[#05112c] text-blue-200 hover:text-white border border-blue-800'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Access to Popular Domestic Leagues */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black">
                  <Trophy className="w-3.5 h-3.5 text-black fill-black" />
                </div>
                <span>FEATURED PRESET DOMESTIC LEAGUES</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {CLUB_LEAGUES.map((league) => (
                  <button
                    key={league.id}
                    onClick={() => {
                      setSelectedLeagueId(league.id);
                      setCustomDirectoryLeague(null);
                      setActiveSubTab('PLAY_MATCH');
                      setHomeTeamIdx(0);
                      setAwayTeamIdx(1);
                      setSimResult(null);
                    }}
                    className="p-3.5 rounded-2xl bg-[#091b40] hover:bg-blue-900 border border-blue-800 hover:border-cyan-400 flex flex-col justify-between text-left transition-all group cursor-pointer shadow-lg"
                  >
                    <div>
                      <div className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
                        {league.country}
                      </div>
                      <div className="font-black text-sm text-white group-hover:text-cyan-300 transition-colors mt-0.5 line-clamp-1">
                        {league.name}
                      </div>
                      <div className="text-[11px] text-blue-200 mt-1">
                        {league.teams.length} Licensed Clubs
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-cyan-300 font-bold">
                      <span>Open League</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Multi-Tier Pyramid Explorer Grid */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black">
                    <Globe className="w-3.5 h-3.5 text-black" />
                  </div>
                  <span>GLOBAL PYRAMID DIRECTORY ({filteredDirectoryCountries.length} NATIONS)</span>
                </h3>
                <span className="text-xs text-blue-300 font-mono">
                  Click any Tier to open it into League Match Hub!
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDirectoryCountries.map((countryItem) => (
                  <div
                    key={countryItem.country}
                    className="bg-[#091b40]/90 border border-blue-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-blue-800/80 pb-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{countryItem.flag}</span>
                          <div>
                            <h4 className="font-black text-base text-white">{countryItem.country}</h4>
                            <span className="text-[10px] font-mono text-cyan-300 font-bold">
                              {countryItem.confederation} PYRAMID
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-200">
                          {countryItem.pyramidTiers.length} Tiers
                        </span>
                      </div>

                      {/* Tiers List */}
                      <div className="flex flex-col gap-2">
                        {countryItem.pyramidTiers.map((tier) => (
                          <div
                            key={tier.tierName}
                            onClick={() => handleSelectDirectoryTier(countryItem.country, tier)}
                            className="p-2.5 rounded-xl bg-[#05112c] hover:bg-blue-900/60 border border-blue-900/80 hover:border-cyan-400 transition-all cursor-pointer group flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono font-black text-[10px]">
                                  T{tier.tierNumber}
                                </span>
                                <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                                  {tier.tierName}
                                </span>
                              </div>
                              <span className="text-[10px] text-blue-300 font-mono">
                                {tier.popularLevel}
                              </span>
                            </div>

                            {/* Featured Teams Preview Chips */}
                            <div className="text-[10px] text-blue-200 line-clamp-1 italic">
                              Featured: {tier.featuredTeams.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: SELECTED LEAGUE VIEW
            (Buttons: Play Match, Leaderboard, Career, The Team, Customize League)
        ========================================================================== */}
        {selectedLeague && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {/* League Navigation 5 Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#071638] p-2 rounded-3xl border border-blue-800 shadow-2xl">
              {[
                {
                  id: 'PLAY_MATCH' as const,
                  label: 'PLAY THE MATCH',
                  subtitle: 'Kick-off / Simulator',
                  icon: Play,
                },
                {
                  id: 'LEADERBOARD' as const,
                  label: 'LEADERBOARD',
                  subtitle: 'Standings & Scorers',
                  icon: Trophy,
                },
                {
                  id: 'CAREER' as const,
                  label: 'THE CAREER',
                  subtitle: 'Manager & Transfers',
                  icon: Briefcase,
                },
                {
                  id: 'THE_TEAM' as const,
                  label: 'THE TEAM',
                  subtitle: 'Tactics & Formations',
                  icon: Users,
                },
                {
                  id: 'CUSTOMIZE_LEAGUE' as const,
                  label: 'CUSTOMIZE LEAGUE',
                  subtitle: 'Put / Delete / Text',
                  icon: Sliders,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.5)] border-2 border-cyan-400'
                        : 'bg-[#091b40] text-blue-100 hover:text-white hover:bg-blue-900/60 border border-blue-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black shadow-md shrink-0">
                      <Icon className="w-4 h-4 text-black stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-wide text-white uppercase line-clamp-1">
                        {tab.label}
                      </div>
                      <div className="text-[9px] text-blue-200 font-medium hidden sm:block line-clamp-1">
                        {tab.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* -------------------------------------------------------------
                SUB-TAB 1: PLAY THE MATCH
            -------------------------------------------------------------- */}
            {activeSubTab === 'PLAY_MATCH' && (
              <div className="flex flex-col gap-6">
                <div className="bg-[#091b40]/90 border border-blue-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex items-center justify-between pb-4 border-b border-blue-800/80 mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black">
                          <Play className="w-4 h-4 text-black fill-black" />
                        </div>
                        <span>LEAGUE FIXTURE MATCH CENTER</span>
                      </h3>
                      <p className="text-xs text-blue-200 mt-0.5">
                        Choose your matchup from {selectedLeague.name} and launch into the 3D Match Engine with PSP handheld controls!
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveSubTab('CUSTOMIZE_LEAGUE')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950 text-cyan-300 hover:text-white hover:bg-blue-900 border border-blue-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                          <Sliders className="w-3 h-3 text-black" />
                        </div>
                        <span>Customize Teams</span>
                      </button>

                      <button
                        onClick={() => {
                          const count = selectedLeague.teams.length;
                          if (count <= 1) return;
                          const r1 = Math.floor(Math.random() * count);
                          let r2 = Math.floor(Math.random() * count);
                          if (r2 === r1) r2 = (r1 + 1) % count;
                          setHomeTeamIdx(r1);
                          setAwayTeamIdx(r2);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950 text-white hover:bg-blue-900 border border-blue-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                          <Shuffle className="w-3 h-3 text-black" />
                        </div>
                        <span>Random Matchup</span>
                      </button>
                    </div>
                  </div>

                  {/* Matchup Teams Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Home Team Card */}
                    <div className="md:col-span-2 bg-[#05112c] border border-blue-800/80 rounded-2xl p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-blue-900 text-cyan-300 text-[10px] font-mono font-bold">
                          HOME TEAM
                        </span>
                        <div
                          className="w-4 h-4 rounded-full border border-white"
                          style={{
                            backgroundColor:
                              selectedLeague.teams[homeTeamIdx]?.primaryColor || '#ffffff',
                          }}
                        />
                      </div>

                      <select
                        value={homeTeamIdx}
                        onChange={(e) => setHomeTeamIdx(Number(e.target.value))}
                        className="w-full bg-[#091b40] border border-blue-700 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        {selectedLeague.teams.map((t, idx) => (
                          <option key={t.id} value={idx}>
                            {t.name} ({t.shortName})
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center justify-between text-xs text-blue-200">
                        <span>Stadium: <span className="text-white font-bold">{selectedLeague.teams[homeTeamIdx]?.stadiumName}</span></span>
                      </div>

                      {/* Quick Action Buttons for Home Team */}
                      <div className="flex items-center gap-2 pt-2 border-t border-blue-900/60">
                        <button
                          onClick={() => {
                            if (!selectedLeague.teams[homeTeamIdx]) return;
                            handleDeleteTeamFromLeague(selectedLeague.teams[homeTeamIdx].id);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-[11px] font-bold text-rose-300 cursor-pointer"
                          title="Delete this team from the league"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveSubTab('CUSTOMIZE_LEAGUE');
                            setCustomizeSubMode('SWAP');
                            if (selectedLeague.teams[homeTeamIdx]) {
                              setSwapDeleteTeamId(selectedLeague.teams[homeTeamIdx].id);
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800 text-[11px] font-bold text-cyan-300 cursor-pointer"
                          title="Swap: Put this and delete this"
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                          <span>Swap</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveSubTab('CUSTOMIZE_LEAGUE');
                            setCustomizeSubMode('TEXT_EDITOR');
                            setTextEditTarget('TEAM');
                            if (selectedLeague.teams[homeTeamIdx]) {
                              setTextEditTeamId(selectedLeague.teams[homeTeamIdx].id);
                              setNewTextTeamName(selectedLeague.teams[homeTeamIdx].name);
                              setNewTextTeamShort(selectedLeague.teams[homeTeamIdx].shortName);
                              setNewTextStadium(selectedLeague.teams[homeTeamIdx].stadiumName);
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800 text-[11px] font-bold text-blue-200 cursor-pointer"
                          title="Delete this text and add this text"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Text</span>
                        </button>
                      </div>
                    </div>

                    {/* Center VS Indicator */}
                    <div className="md:col-span-1 flex flex-col items-center justify-center text-center my-2 md:my-0">
                      <div className="w-14 h-14 rounded-full bg-blue-900/80 border-2 border-cyan-400 flex items-center justify-center font-black text-lg text-white shadow-lg">
                        VS
                      </div>
                      <span className="text-[10px] font-mono text-cyan-300 mt-2">
                        {difficulty} • {matchLength}
                      </span>
                    </div>

                    {/* Away Team Card */}
                    <div className="md:col-span-2 bg-[#05112c] border border-blue-800/80 rounded-2xl p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-blue-900 text-cyan-300 text-[10px] font-mono font-bold">
                          AWAY TEAM
                        </span>
                        <div
                          className="w-4 h-4 rounded-full border border-white"
                          style={{
                            backgroundColor:
                              selectedLeague.teams[awayTeamIdx]?.primaryColor || '#ffffff',
                          }}
                        />
                      </div>

                      <select
                        value={awayTeamIdx}
                        onChange={(e) => setAwayTeamIdx(Number(e.target.value))}
                        className="w-full bg-[#091b40] border border-blue-700 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        {selectedLeague.teams.map((t, idx) => (
                          <option key={t.id} value={idx}>
                            {t.name} ({t.shortName})
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center justify-between text-xs text-blue-200">
                        <span>Stadium: <span className="text-white font-bold">{selectedLeague.teams[awayTeamIdx]?.stadiumName}</span></span>
                      </div>

                      {/* Quick Action Buttons for Away Team */}
                      <div className="flex items-center gap-2 pt-2 border-t border-blue-900/60">
                        <button
                          onClick={() => {
                            if (!selectedLeague.teams[awayTeamIdx]) return;
                            handleDeleteTeamFromLeague(selectedLeague.teams[awayTeamIdx].id);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-[11px] font-bold text-rose-300 cursor-pointer"
                          title="Delete this team from the league"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveSubTab('CUSTOMIZE_LEAGUE');
                            setCustomizeSubMode('SWAP');
                            if (selectedLeague.teams[awayTeamIdx]) {
                              setSwapDeleteTeamId(selectedLeague.teams[awayTeamIdx].id);
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800 text-[11px] font-bold text-cyan-300 cursor-pointer"
                          title="Swap: Put this and delete this"
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                          <span>Swap</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveSubTab('CUSTOMIZE_LEAGUE');
                            setCustomizeSubMode('TEXT_EDITOR');
                            setTextEditTarget('TEAM');
                            if (selectedLeague.teams[awayTeamIdx]) {
                              setTextEditTeamId(selectedLeague.teams[awayTeamIdx].id);
                              setNewTextTeamName(selectedLeague.teams[awayTeamIdx].name);
                              setNewTextTeamShort(selectedLeague.teams[awayTeamIdx].shortName);
                              setNewTextStadium(selectedLeague.teams[awayTeamIdx].stadiumName);
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800 text-[11px] font-bold text-blue-200 cursor-pointer"
                          title="Delete this text and add this text"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Text</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Settings Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-blue-800/80">
                    <div>
                      <label className="text-[11px] font-bold text-blue-200 uppercase">Match Length</label>
                      <select
                        value={matchLength}
                        onChange={(e) => setMatchLength(e.target.value)}
                        className="w-full mt-1 bg-[#05112c] border border-blue-800 rounded-xl px-3 py-1.5 text-xs text-white font-semibold cursor-pointer"
                      >
                        <option value="3 Mins">3 Minutes (Fast)</option>
                        <option value="5 Mins">5 Minutes (Standard)</option>
                        <option value="10 Mins">10 Minutes (Full Match)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-blue-200 uppercase">Match Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full mt-1 bg-[#05112c] border border-blue-800 rounded-xl px-3 py-1.5 text-xs text-white font-semibold cursor-pointer"
                      >
                        <option value="Amateur">Amateur</option>
                        <option value="Professional">Professional</option>
                        <option value="World Class">World Class</option>
                        <option value="Legend">Legend (PES 2027)</option>
                      </select>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[11px] font-bold text-blue-200 uppercase">Match Camera</label>
                      <div className="mt-1 px-3 py-1.5 rounded-xl bg-[#05112c] border border-blue-800 text-xs font-semibold text-cyan-300">
                        Broadcast TV &amp; PSP Cam
                      </div>
                    </div>
                  </div>

                  {/* Kickoff CTA buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
                    <button
                      onClick={() => {
                        const homeTeam = selectedLeague.teams[homeTeamIdx];
                        const awayTeam =
                          selectedLeague.teams[awayTeamIdx] || selectedLeague.teams[0];
                        onLaunchMatch({
                          homeTeamName: homeTeam.name,
                          homeTeamColor: homeTeam.primaryColor,
                          awayTeamName: awayTeam.name,
                          awayTeamColor: awayTeam.primaryColor,
                          homeTeamShort: homeTeam.shortName,
                          awayTeamShort: awayTeam.shortName,
                          stadiumName: homeTeam.stadiumName,
                          tournamentName: selectedLeague.name,
                        });
                      }}
                      className="w-full sm:flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-black">
                        <Play className="w-4 h-4 text-black fill-black" />
                      </div>
                      <span>PLAY MATCH IN 3D (PSP CONTROLS)</span>
                    </button>

                    <button
                      onClick={handleSimulateMatch}
                      className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#05112c] hover:bg-blue-900/80 border border-blue-700 text-white font-bold text-sm tracking-wider uppercase shadow transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black">
                        <Activity className="w-3.5 h-3.5 text-black" />
                      </div>
                      <span>Instant Simulation</span>
                    </button>
                  </div>

                  {/* Simulation Result Box */}
                  {simResult && (
                    <div className="mt-6 p-4 rounded-2xl bg-blue-950 border border-cyan-400/60 flex flex-col gap-2">
                      <div className="flex items-center justify-between font-black text-base text-white">
                        <span>{selectedLeague.teams[homeTeamIdx]?.name}</span>
                        <span className="font-mono text-xl text-cyan-300">
                          {simResult.scoreA} - {simResult.scoreB}
                        </span>
                        <span>{selectedLeague.teams[awayTeamIdx]?.name}</span>
                      </div>
                      <div className="border-t border-blue-800/80 pt-2 flex flex-col gap-1 text-xs text-blue-200">
                        {simResult.events.map((ev, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>{ev}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                SUB-TAB 2: LEADERBOARD (Standings & Top Scorers)
            -------------------------------------------------------------- */}
            {activeSubTab === 'LEADERBOARD' && (
              <div className="flex flex-col gap-6">
                {/* Standings Table Card */}
                <div className="bg-[#091b40]/90 border border-blue-800 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between pb-4 border-b border-blue-800/80 mb-4">
                    <div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black">
                          <Trophy className="w-4 h-4 text-black fill-black" />
                        </div>
                        <span>OFFICIAL LEAGUE TABLE STANDINGS</span>
                      </h3>
                      <p className="text-xs text-blue-200 mt-0.5">
                        {selectedLeague.name} • Season 2026/2027 Leaderboard
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveSubTab('CUSTOMIZE_LEAGUE');
                          setCustomizeSubMode('ADD');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Put Team</span>
                      </button>
                    </div>
                  </div>

                  {/* Table with In-Row Quick Put/Delete & Edit Text Actions */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-blue-800 text-[11px] font-mono text-blue-300 uppercase">
                          <th className="py-2.5 px-3">POS</th>
                          <th className="py-2.5 px-3">CLUB</th>
                          <th className="py-2.5 px-2 text-center">P</th>
                          <th className="py-2.5 px-2 text-center">W</th>
                          <th className="py-2.5 px-2 text-center">D</th>
                          <th className="py-2.5 px-2 text-center">L</th>
                          <th className="py-2.5 px-2 text-center">GF</th>
                          <th className="py-2.5 px-2 text-center">GA</th>
                          <th className="py-2.5 px-2 text-center">GD</th>
                          <th className="py-2.5 px-3 text-center font-black text-cyan-300">PTS</th>
                          <th className="py-2.5 px-3 text-center">MANAGE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-800/60 font-medium">
                        {selectedLeague.teams.map((team, idx) => {
                          const p = 14;
                          const w = Math.max(0, 11 - idx * 2);
                          const d = 2;
                          const l = Math.max(0, p - w - d);
                          const gf = 28 - idx * 2;
                          const ga = 8 + idx * 2;
                          const gd = gf - ga;
                          const pts = w * 3 + d;

                          return (
                            <tr
                              key={team.id}
                              className={`hover:bg-blue-900/40 transition-colors ${
                                idx === 0 ? 'bg-blue-950/60 font-bold' : ''
                              }`}
                            >
                              <td className="py-3 px-3">
                                <span
                                  className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                                    idx === 0
                                      ? 'bg-amber-400 text-black'
                                      : idx < 3
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-blue-950 text-blue-200 border border-blue-800'
                                  }`}
                                >
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className="w-3.5 h-3.5 rounded-full border border-white shrink-0"
                                    style={{ backgroundColor: team.primaryColor }}
                                  />
                                  <span className="font-bold text-white text-sm">
                                    {team.name}
                                  </span>
                                  <span className="text-[10px] text-blue-300 font-mono">
                                    ({team.shortName})
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-center text-blue-200">{p}</td>
                              <td className="py-3 px-2 text-center text-emerald-400">{w}</td>
                              <td className="py-3 px-2 text-center text-blue-200">{d}</td>
                              <td className="py-3 px-2 text-center text-rose-400">{l}</td>
                              <td className="py-3 px-2 text-center text-blue-200">{gf}</td>
                              <td className="py-3 px-2 text-center text-blue-200">{ga}</td>
                              <td className="py-3 px-2 text-center font-mono">
                                {gd > 0 ? `+${gd}` : gd}
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-black text-cyan-300 text-base">
                                {pts}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* Delete this from league */}
                                  <button
                                    onClick={() => handleDeleteTeamFromLeague(team.id)}
                                    className="p-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 cursor-pointer"
                                    title={`Delete ${team.name} from league`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  {/* Swap team */}
                                  <button
                                    onClick={() => {
                                      setActiveSubTab('CUSTOMIZE_LEAGUE');
                                      setCustomizeSubMode('SWAP');
                                      setSwapDeleteTeamId(team.id);
                                    }}
                                    className="p-1 rounded bg-blue-950 hover:bg-blue-900 text-cyan-300 border border-blue-800/80 cursor-pointer"
                                    title={`Swap ${team.name}: Put this and delete this`}
                                  >
                                    <ArrowLeftRight className="w-3.5 h-3.5" />
                                  </button>
                                  {/* Edit text */}
                                  <button
                                    onClick={() => {
                                      setActiveSubTab('CUSTOMIZE_LEAGUE');
                                      setCustomizeSubMode('TEXT_EDITOR');
                                      setTextEditTarget('TEAM');
                                      setTextEditTeamId(team.id);
                                      setNewTextTeamName(team.name);
                                      setNewTextTeamShort(team.shortName);
                                      setNewTextStadium(team.stadiumName);
                                    }}
                                    className="p-1 rounded bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-800/80 cursor-pointer"
                                    title={`Edit text for ${team.name}`}
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Golden Boot Top Scorers */}
                <div className="bg-[#091b40]/90 border border-blue-800 rounded-3xl p-6 shadow-2xl">
                  <h4 className="text-base font-black text-white flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black">
                      <Star className="w-3.5 h-3.5 text-black" />
                    </div>
                    <span>GOLDEN BOOT TOP SCORERS</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedLeague.teams.slice(0, 3).map((team, idx) => {
                      const striker =
                        team.players.find((p) => p.position === 'CF' || p.position === 'RWF') ||
                        team.players[0];
                      const goals = 16 - idx * 3;
                      return (
                        <div
                          key={team.id}
                          className="p-4 rounded-2xl bg-[#05112c] border border-blue-800 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs text-blue-300">{team.name}</div>
                            <div className="text-sm font-black text-white">{striker?.name || 'Striker'}</div>
                            <div className="text-[11px] text-blue-200">
                              OVR {striker?.overallRating || 85} • {striker?.position || 'CF'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black font-mono text-cyan-300">{goals}</div>
                            <div className="text-[10px] uppercase font-mono text-blue-200">Goals</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                SUB-TAB 3: THE CAREER
            -------------------------------------------------------------- */}
            {activeSubTab === 'CAREER' && (
              <div className="flex flex-col gap-6">
                <div className="bg-[#091b40]/90 border border-blue-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-blue-800/80 mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black">
                          <Briefcase className="w-4 h-4 text-black" />
                        </div>
                        <span>CAREER MODE MANAGER HUB</span>
                      </h3>
                      <p className="text-xs text-blue-200 mt-0.5">
                        Manage your club across the season, execute scouting, and lead them to championship glory!
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-200 font-bold">Managing:</span>
                      <select
                        value={careerClubIdx}
                        onChange={(e) => setCareerClubIdx(Number(e.target.value))}
                        className="bg-[#05112c] border border-blue-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold cursor-pointer"
                      >
                        {selectedLeague.teams.map((t, idx) => (
                          <option key={t.id} value={idx}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Career Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="p-4 rounded-2xl bg-[#05112c] border border-blue-800">
                      <div className="text-xs text-blue-300 font-bold">CURRENT WEEK</div>
                      <div className="text-2xl font-black text-white mt-1">Week {careerWeek} / 38</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#05112c] border border-blue-800">
                      <div className="text-xs text-blue-300 font-bold">TRANSFER BUDGET</div>
                      <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                        ${transferBudget.toFixed(1)}M
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#05112c] border border-blue-800">
                      <div className="text-xs text-blue-300 font-bold">BOARD CONFIDENCE</div>
                      <div className="text-2xl font-black text-cyan-300 mt-1">94% (Very High)</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#05112c] border border-blue-800">
                      <div className="text-xs text-blue-300 font-bold">SQUAD MORALE</div>
                      <div className="text-2xl font-black text-amber-300 mt-1">Excellent</div>
                    </div>
                  </div>

                  {/* Advance Week Action */}
                  <div className="p-5 rounded-2xl bg-blue-950/60 border border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-white text-base">Advance Simulation Calendar</div>
                      <div className="text-xs text-blue-200">
                        Simulate training session, scout reports, and next league round fixtures.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCareerWeek((w) => (w < 38 ? w + 1 : 1));
                        setCareerNotification(`Week ${careerWeek} simulated! Player recovery completed.`);
                      }}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Simulate Week {careerWeek}</span>
                    </button>
                  </div>

                  {careerNotification && (
                    <div className="mt-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{careerNotification}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                SUB-TAB 4: THE TEAM (Tactics & Formations)
            -------------------------------------------------------------- */}
            {activeSubTab === 'THE_TEAM' && (
              <div className="flex flex-col gap-6">
                <div className="bg-[#091b40]/90 border border-blue-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-blue-800/80 mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black">
                          <Users className="w-4 h-4 text-black" />
                        </div>
                        <span>TEAM TECHNICAL &amp; TACTICAL SUITE</span>
                      </h3>
                      <p className="text-xs text-blue-200 mt-0.5">
                        Configure advanced formations (4-3-3 Attack, 4-2-2-4 Defence), pressing depth, and squad roles.
                      </p>
                    </div>

                    {/* Managed Team Switcher */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-200 font-bold">Squad:</span>
                      <select
                        value={homeTeamIdx}
                        onChange={(e) => setHomeTeamIdx(Number(e.target.value))}
                        className="bg-[#05112c] border border-blue-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold cursor-pointer"
                      >
                        {selectedLeague.teams.map((t, idx) => (
                          <option key={t.id} value={idx}>
                            {t.name}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          setActiveSubTab('CUSTOMIZE_LEAGUE');
                          setCustomizeSubMode('TEXT_EDITOR');
                          setTextEditTarget('TEAM');
                          if (selectedLeague.teams[homeTeamIdx]) {
                            setTextEditTeamId(selectedLeague.teams[homeTeamIdx].id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-200 cursor-pointer"
                        title="Edit team texts"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Formation Select Buttons (including 4-3-3 Attack and 4-2-2-4 Defence) */}
                  <div className="flex flex-col gap-3 mb-6">
                    <label className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                        <Compass className="w-3 h-3 text-black" />
                      </div>
                      <span>Select Technical Formation:</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {TECHNICAL_FORMATIONS.map((form) => (
                        <button
                          key={form.id}
                          onClick={() => {
                            setCurrentFormationId(form.id);
                            setMentality(form.mentality);
                            setPressingValue(form.pressingIntensity);
                            setDefensiveLineValue(form.defensiveLine);
                          }}
                          className={`p-3 rounded-2xl transition-all text-left border cursor-pointer ${
                            currentFormationId === form.id
                              ? 'bg-blue-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(37,99,235,0.6)]'
                              : 'bg-[#05112c] text-blue-100 hover:text-white hover:bg-blue-900/60 border-blue-800'
                          }`}
                        >
                          <div className="font-black text-sm text-white">{form.name}</div>
                          <div className="text-[10px] text-blue-200 mt-0.5 line-clamp-1">{form.category}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2-Column Pitch & Technical Sliders */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Column A: Interactive Pitch Board with 11 Players */}
                    <div className="lg:col-span-7 bg-[#05112c] border border-blue-800 rounded-3xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs text-blue-200 font-bold px-2">
                        <span>FORMATION: {activeFormation.name}</span>
                        <span className="text-cyan-300 font-mono">TACTICAL FLUID SHAPE</span>
                      </div>

                      {/* 2D Pitch Representation */}
                      <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-[#0b381b] to-[#072411] rounded-2xl border-2 border-white/20 p-4 overflow-hidden shadow-inner">
                        {/* Turf Mowing stripes */}
                        <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-col justify-between">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className={`w-full h-8 ${i % 2 === 0 ? 'bg-black/30' : 'bg-white/10'}`} />
                          ))}
                        </div>

                        {/* Pitch Markings */}
                        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none border border-white/30 rounded-xl">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-white/30" />
                          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 border-b border-x border-white/30" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 border-t border-x border-white/30" />
                        </div>

                        {/* 11 Players Nodes */}
                        {activeFormation.roles.map((player, idx) => (
                          <div
                            key={idx}
                            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                            style={{ left: `${player.x}%`, top: `${player.y}%` }}
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white text-white font-black text-xs flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-cyan-400 group-hover:text-black transition-transform">
                              {player.pos}
                            </div>
                            <span className="text-[10px] font-bold text-white bg-black/80 px-1.5 py-0.5 rounded mt-0.5 shadow whitespace-nowrap">
                              {player.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-blue-200 text-center italic">
                        {activeFormation.description}
                      </div>
                    </div>

                    {/* Column B: Technical Controls & Sliders */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                      {/* Technical Mentality */}
                      <div className="p-4 rounded-2xl bg-[#05112c] border border-blue-800 flex flex-col gap-2.5">
                        <label className="text-xs font-bold text-blue-200 uppercase flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-black">
                            <Flame className="w-3.5 h-3.5 text-black" />
                          </div>
                          <span>Technical Mentality:</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {['Ultra-Defensive', 'Defensive', 'Balanced', 'Attacking', 'Ultra-Attacking'].map((m) => (
                            <button
                              key={m}
                              onClick={() => setMentality(m)}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                mentality === m
                                  ? 'bg-blue-600 text-white shadow'
                                  : 'bg-blue-950 text-blue-300 hover:text-white'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pressing Intensity Slider */}
                      <div className="p-4 rounded-2xl bg-[#05112c] border border-blue-800 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-blue-200">PRESSING INTENSITY</span>
                          <span className="font-mono text-cyan-300">{pressingValue}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="98"
                          value={pressingValue}
                          onChange={(e) => setPressingValue(Number(e.target.value))}
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-blue-300 font-mono">
                          <span>Low Block / Stand Off</span>
                          <span>Heavy Gegenpress</span>
                        </div>
                      </div>

                      {/* Defensive Line Depth */}
                      <div className="p-4 rounded-2xl bg-[#05112c] border border-blue-800 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-blue-200">DEFENSIVE LINE DEPTH</span>
                          <span className="font-mono text-cyan-300">{defensiveLineValue}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="95"
                          value={defensiveLineValue}
                          onChange={(e) => setDefensiveLineValue(Number(e.target.value))}
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-blue-300 font-mono">
                          <span>Deep Drop (Penalty Box)</span>
                          <span>High Offside Trap</span>
                        </div>
                      </div>

                      {/* Build-Up Play Style */}
                      <div className="p-4 rounded-2xl bg-[#05112c] border border-blue-800 flex flex-col gap-2">
                        <label className="text-xs font-bold text-blue-200 uppercase">
                          Build-Up Passing Style
                        </label>
                        <select
                          value={buildUpStyle}
                          onChange={(e) => setBuildUpStyle(e.target.value)}
                          className="w-full bg-blue-950 border border-blue-700 rounded-xl px-3 py-2 text-xs text-white font-bold cursor-pointer"
                        >
                          <option value="Short Tiki-Taka">Short Passing (Tiki-Taka)</option>
                          <option value="Fast Counter">Direct Fast Counter (FC 27)</option>
                          <option value="Wing Play">Wide Crossing &amp; Flank Overload</option>
                          <option value="Long Ball">Target Man Direct Long Ball</option>
                        </select>
                      </div>

                      {/* Team Width */}
                      <div className="p-4 rounded-2xl bg-[#05112c] border border-blue-800 flex flex-col gap-2">
                        <label className="text-xs font-bold text-blue-200 uppercase">
                          Defensive Compactness &amp; Width
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Narrow', 'Standard', 'Wide'].map((w) => (
                            <button
                              key={w}
                              onClick={() => setCompactness(w)}
                              className={`py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                                compactness === w
                                  ? 'bg-white text-black font-black'
                                  : 'bg-blue-950 text-blue-200 hover:text-white'
                              }`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Squad Roster Table */}
                  <div className="mt-8 pt-6 border-t border-blue-800">
                    <h4 className="text-base font-black text-white flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black">
                        <Users className="w-3.5 h-3.5 text-black" />
                      </div>
                      <span>
                        {selectedLeague.teams[homeTeamIdx]?.name} SQUAD SPREADSHEET &amp; ATTRIBUTES
                      </span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {selectedLeague.teams[homeTeamIdx]?.players.map((player) => (
                        <div
                          key={player.id}
                          className="p-3 rounded-2xl bg-[#05112c] border border-blue-800 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-blue-900 border border-blue-700 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center">
                              {player.kitNumber}
                            </span>
                            <div>
                              <div className="text-sm font-bold text-white">{player.name}</div>
                              <div className="text-[11px] text-blue-200">
                                {player.position} • {player.nationality} • Age {player.age}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 rounded-lg bg-emerald-950 border border-emerald-500/80 text-emerald-300 font-mono font-black text-sm">
                              {player.overallRating}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                SUB-TAB 5: CUSTOMIZE LEAGUE (PUT & DELETE TEAMS & TEXTS)
                Directly fulfills user request:
                "delete this from the league and put this"
                "put this and delete this and delete this text and add this text"
            -------------------------------------------------------------- */}
            {activeSubTab === 'CUSTOMIZE_LEAGUE' && (
              <div className="flex flex-col gap-6">
                <div className="bg-[#091b40]/90 border border-blue-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  {/* Mode Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-blue-800/80 mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black shadow-md">
                          <Sliders className="w-5 h-5 text-black stroke-[2.5]" />
                        </div>
                        <span>LEAGUE CUSTOMIZER &amp; PUT/DELETE MANAGER</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl">
                        Customise {selectedLeague.name}. Delete clubs from the league, put new clubs, swap clubs (put this and delete that), or edit/replace any text in the database.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-xs font-mono text-cyan-300">
                        {selectedLeague.teams.length} CLUBS REGISTERED
                      </span>
                    </div>
                  </div>

                  {/* 4 Sub-Action Selector Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                    {[
                      {
                        id: 'SWAP' as const,
                        title: 'PUT THIS & DELETE THIS',
                        desc: 'Swap an existing team with another',
                        icon: ArrowLeftRight,
                      },
                      {
                        id: 'DELETE' as const,
                        title: 'DELETE FROM LEAGUE',
                        desc: 'Remove any club from this tournament',
                        icon: Trash2,
                      },
                      {
                        id: 'ADD' as const,
                        title: 'PUT THIS (ADD TEAM)',
                        desc: 'Create & put a new club in league',
                        icon: Plus,
                      },
                      {
                        id: 'TEXT_EDITOR' as const,
                        title: 'DELETE & ADD TEXT',
                        desc: 'Replace title, team, or player texts',
                        icon: Type,
                      },
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isCur = customizeSubMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setCustomizeSubMode(mode.id)}
                          className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                            isCur
                              ? 'bg-blue-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(37,99,235,0.6)]'
                              : 'bg-[#05112c] text-blue-200 hover:text-white hover:bg-blue-900/60 border-blue-800'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black mb-2 shadow">
                            <Icon className="w-4 h-4 text-black stroke-[2.5]" />
                          </div>
                          <div className="font-black text-xs sm:text-sm text-white uppercase tracking-wider">
                            {mode.title}
                          </div>
                          <div className="text-[10px] text-blue-200 mt-0.5 line-clamp-1">{mode.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* -------------------------------------------------------------------
                      SECTION 1: PUT THIS AND DELETE THIS (SWAP TEAM)
                  -------------------------------------------------------------------- */}
                  {customizeSubMode === 'SWAP' && (
                    <div className="bg-[#05112c] border border-blue-800/80 rounded-2xl p-6 flex flex-col gap-6">
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <ArrowLeftRight className="w-5 h-5 text-cyan-300" />
                          <span>PUT THIS AND DELETE THIS (TEAM SWAPPER)</span>
                        </h4>
                        <p className="text-xs text-blue-200 mt-1">
                          Select which club you want to delete from {selectedLeague.name}, and specify which team to put in its position!
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Step A: Select Team to Delete */}
                        <div className="p-4 rounded-xl bg-[#091b40] border border-rose-900/60 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-rose-300 uppercase flex items-center gap-1.5">
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>1. DELETE THIS FROM LEAGUE:</span>
                            </span>
                            <span className="text-[10px] font-mono text-rose-300/80">Removal Target</span>
                          </div>

                          <select
                            value={swapDeleteTeamId}
                            onChange={(e) => setSwapDeleteTeamId(e.target.value)}
                            className="w-full bg-[#05112c] border border-rose-700/80 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-rose-400 cursor-pointer"
                          >
                            {selectedLeague.teams.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.shortName}) - {t.stadiumName}
                              </option>
                            ))}
                          </select>

                          {/* Preview Card of Deleted Team */}
                          {(() => {
                            const delTeam = selectedLeague.teams.find((t) => t.id === swapDeleteTeamId) || selectedLeague.teams[0];
                            if (!delTeam) return null;
                            return (
                              <div className="p-3 rounded-xl bg-[#030a1c] border border-rose-950 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className="w-4 h-4 rounded-full border border-white"
                                    style={{ backgroundColor: delTeam.primaryColor }}
                                  />
                                  <div>
                                    <div className="text-sm font-bold text-white line-through opacity-80">{delTeam.name}</div>
                                    <div className="text-[10px] text-rose-300">{delTeam.country} • {delTeam.stadiumName}</div>
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-rose-900 text-white font-mono text-[10px] font-bold">
                                  Will Be Removed
                                </span>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Step B: Select or Create Team to Put */}
                        <div className="p-4 rounded-xl bg-[#091b40] border border-cyan-800/80 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-cyan-300 uppercase flex items-center gap-1.5">
                              <Plus className="w-3.5 h-3.5" />
                              <span>2. PUT THIS TEAM INSTEAD:</span>
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setSwapPutOption('PRESET')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                  swapPutOption === 'PRESET' ? 'bg-cyan-400 text-black' : 'bg-blue-950 text-blue-300'
                                }`}
                              >
                                Global Giants
                              </button>
                              <button
                                onClick={() => setSwapPutOption('CUSTOM')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                  swapPutOption === 'CUSTOM' ? 'bg-cyan-400 text-black' : 'bg-blue-950 text-blue-300'
                                }`}
                              >
                                Custom Team
                              </button>
                            </div>
                          </div>

                          {swapPutOption === 'PRESET' ? (
                            <div className="flex flex-col gap-2">
                              <label className="text-[11px] text-blue-200">Pick from Global Club Roster:</label>
                              <select
                                value={selectedSwapPresetIdx}
                                onChange={(e) => setSelectedSwapPresetIdx(Number(e.target.value))}
                                className="w-full bg-[#05112c] border border-cyan-600 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
                              >
                                {POPULAR_SWAP_PRESETS.map((p, idx) => (
                                  <option key={p.name} value={idx}>
                                    {p.name} ({p.short}) - {p.country} [{p.stadium}]
                                  </option>
                                ))}
                              </select>

                              {/* Preview Card of Put Team */}
                              {(() => {
                                const preset = POPULAR_SWAP_PRESETS[selectedSwapPresetIdx];
                                return (
                                  <div className="p-3 rounded-xl bg-[#030a1c] border border-cyan-950 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <div
                                        className="w-4 h-4 rounded-full border border-white"
                                        style={{ backgroundColor: preset.color }}
                                      />
                                      <div>
                                        <div className="text-sm font-bold text-cyan-300">{preset.name}</div>
                                        <div className="text-[10px] text-blue-200">{preset.country} • {preset.stadium}</div>
                                      </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 font-mono text-[10px] font-bold">
                                      Will Be Added
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="col-span-2">
                                <label className="text-[10px] text-blue-200">Team Name to Put</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Real Madrid, Sporting CP, Inter Miami"
                                  value={customPutName}
                                  onChange={(e) => setCustomPutName(e.target.value)}
                                  className="w-full mt-1 px-3 py-2 bg-[#05112c] border border-blue-700 rounded-xl text-white font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-blue-200">Short Name (3 Letters)</label>
                                <input
                                  type="text"
                                  maxLength={3}
                                  placeholder="e.g. RMA"
                                  value={customPutShort}
                                  onChange={(e) => setCustomPutShort(e.target.value.toUpperCase())}
                                  className="w-full mt-1 px-3 py-2 bg-[#05112c] border border-blue-700 rounded-xl text-white font-bold uppercase"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-blue-200">Kit Primary Color</label>
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="color"
                                    value={customPutColor}
                                    onChange={(e) => setCustomPutColor(e.target.value)}
                                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                                  />
                                  <span className="font-mono text-[11px] text-cyan-300">{customPutColor}</span>
                                </div>
                              </div>
                              <div className="col-span-2">
                                <label className="text-[10px] text-blue-200">Stadium Name</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Santiago Bernabéu"
                                  value={customPutStadium}
                                  onChange={(e) => setCustomPutStadium(e.target.value)}
                                  className="w-full mt-1 px-3 py-2 bg-[#05112c] border border-blue-700 rounded-xl text-white"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Execute Swap Button */}
                      <button
                        onClick={handlePutThisAndDeleteThis}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-3"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black">
                          <ArrowLeftRight className="w-4 h-4 text-black stroke-[3]" />
                        </div>
                        <span>PUT THIS &amp; DELETE THIS (EXECUTE SWAP)</span>
                      </button>
                    </div>
                  )}

                  {/* -------------------------------------------------------------------
                      SECTION 2: DELETE FROM LEAGUE
                  -------------------------------------------------------------------- */}
                  {customizeSubMode === 'DELETE' && (
                    <div className="bg-[#05112c] border border-blue-800/80 rounded-2xl p-6 flex flex-col gap-5">
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <Trash2 className="w-5 h-5 text-rose-400" />
                          <span>DELETE THIS FROM THE LEAGUE</span>
                        </h4>
                        <p className="text-xs text-blue-200 mt-1">
                          Click "Delete This" on any club to instantly remove it from {selectedLeague.name}. Standings and fixture matchmakers update automatically.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {selectedLeague.teams.map((team) => (
                          <div
                            key={team.id}
                            className="p-4 rounded-2xl bg-[#091b40] border border-blue-800 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-5 h-5 rounded-full border border-white shrink-0"
                                style={{ backgroundColor: team.primaryColor }}
                              />
                              <div>
                                <div className="font-bold text-sm text-white">{team.name}</div>
                                <div className="text-[11px] text-blue-200">
                                  {team.shortName} • {team.stadiumName}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteTeamFromLeague(team.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* -------------------------------------------------------------------
                      SECTION 3: PUT THIS (ADD NEW TEAM)
                  -------------------------------------------------------------------- */}
                  {customizeSubMode === 'ADD' && (
                    <div className="bg-[#05112c] border border-blue-800/80 rounded-2xl p-6 flex flex-col gap-5">
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <Plus className="w-5 h-5 text-emerald-400" />
                          <span>PUT THIS (ADD NEW CLUB TO LEAGUE)</span>
                        </h4>
                        <p className="text-xs text-blue-200 mt-1">
                          Create and put a new club directly into {selectedLeague.name} with custom roster, kit colors, and stadium.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-blue-200">Team Name to Put *</label>
                          <input
                            type="text"
                            placeholder="e.g. Sporting CP, Zamalek SC, Inter Miami"
                            value={addTeamName}
                            onChange={(e) => setAddTeamName(e.target.value)}
                            className="w-full mt-1 px-4 py-2.5 bg-[#091b40] border border-blue-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-blue-200">Short Name (3 Letters)</label>
                          <input
                            type="text"
                            maxLength={3}
                            placeholder="e.g. SPO"
                            value={addTeamShort}
                            onChange={(e) => setAddTeamShort(e.target.value.toUpperCase())}
                            className="w-full mt-1 px-4 py-2.5 bg-[#091b40] border border-blue-700 rounded-xl text-white font-bold text-sm uppercase focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-blue-200">Country of Origin</label>
                          <input
                            type="text"
                            placeholder={selectedLeague.country}
                            value={addTeamCountry}
                            onChange={(e) => setAddTeamCountry(e.target.value)}
                            className="w-full mt-1 px-4 py-2.5 bg-[#091b40] border border-blue-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-blue-200">Home Stadium</label>
                          <input
                            type="text"
                            placeholder="e.g. Estádio José Alvalade"
                            value={addTeamStadium}
                            onChange={(e) => setAddTeamStadium(e.target.value)}
                            className="w-full mt-1 px-4 py-2.5 bg-[#091b40] border border-blue-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-blue-200">Primary Color</label>
                          <div className="flex items-center gap-3 mt-1">
                            <input
                              type="color"
                              value={addTeamColor}
                              onChange={(e) => setAddTeamColor(e.target.value)}
                              className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                            />
                            <span className="font-mono text-xs text-cyan-300 font-bold">{addTeamColor}</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-blue-200">Roster Overall Rating Tier</label>
                          <div className="flex items-center gap-3 mt-2">
                            {[
                              { label: 'Standard (78)', val: 78 },
                              { label: 'Elite (84)', val: 84 },
                              { label: 'World Class (89)', val: 89 },
                            ].map((tier) => (
                              <button
                                key={tier.val}
                                onClick={() => setAddTeamRating(tier.val)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  addTeamRating === tier.val
                                    ? 'bg-cyan-400 text-black font-black'
                                    : 'bg-[#091b40] text-blue-200 border border-blue-800'
                                }`}
                              >
                                {tier.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handlePutTeamIntoLeague}
                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5 stroke-[3]" />
                        <span>PUT THIS TEAM INTO {selectedLeague.name.toUpperCase()}</span>
                      </button>
                    </div>
                  )}

                  {/* -------------------------------------------------------------------
                      SECTION 4: DELETE THIS TEXT AND ADD THIS TEXT (TEXT EDITOR)
                  -------------------------------------------------------------------- */}
                  {customizeSubMode === 'TEXT_EDITOR' && (
                    <div className="bg-[#05112c] border border-blue-800/80 rounded-2xl p-6 flex flex-col gap-6">
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <Type className="w-5 h-5 text-cyan-300" />
                          <span>DELETE THIS TEXT AND ADD THIS TEXT</span>
                        </h4>
                        <p className="text-xs text-blue-200 mt-1">
                          Rename and customize any text string: League titles, countries, club names, short abbreviations, home stadiums, and player rosters.
                        </p>
                      </div>

                      {/* Text Edit Category Select */}
                      <div className="flex items-center gap-2 border-b border-blue-800/80 pb-3">
                        {[
                          { id: 'LEAGUE' as const, label: 'League & Country Text' },
                          { id: 'TEAM' as const, label: 'Club Names & Stadiums' },
                          { id: 'PLAYER' as const, label: 'Player Name Texts' },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setTextEditTarget(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              textEditTarget === cat.id
                                ? 'bg-white text-black font-black shadow'
                                : 'bg-[#091b40] text-blue-200 hover:text-white'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* A: League Text Editor */}
                      {textEditTarget === 'LEAGUE' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-[#091b40] border border-blue-800 flex flex-col gap-2">
                            <span className="text-[10px] font-mono text-rose-300">
                              DELETE THIS TEXT: <span className="font-bold underline">{selectedLeague.name}</span>
                            </span>
                            <label className="text-xs font-bold text-white">ADD THIS TEXT (LEAGUE NAME):</label>
                            <input
                              type="text"
                              value={newTextLeagueName}
                              onChange={(e) => setNewTextLeagueName(e.target.value)}
                              className="px-3 py-2 bg-[#05112c] border border-blue-700 rounded-xl text-white font-bold text-sm"
                            />
                            <button
                              onClick={() => handleDeleteTextAndAddText('LEAGUE_NAME')}
                              className="mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase cursor-pointer"
                            >
                              Update League Name Text
                            </button>
                          </div>

                          <div className="p-4 rounded-xl bg-[#091b40] border border-blue-800 flex flex-col gap-2">
                            <span className="text-[10px] font-mono text-rose-300">
                              DELETE THIS TEXT: <span className="font-bold underline">{selectedLeague.country}</span>
                            </span>
                            <label className="text-xs font-bold text-white">ADD THIS TEXT (COUNTRY / REGION):</label>
                            <input
                              type="text"
                              value={newTextCountry}
                              onChange={(e) => setNewTextCountry(e.target.value)}
                              className="px-3 py-2 bg-[#05112c] border border-blue-700 rounded-xl text-white font-bold text-sm"
                            />
                            <button
                              onClick={() => handleDeleteTextAndAddText('LEAGUE_COUNTRY')}
                              className="mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase cursor-pointer"
                            >
                              Update Country Text
                            </button>
                          </div>
                        </div>
                      )}

                      {/* B: Club Name & Stadium Editor */}
                      {textEditTarget === 'TEAM' && (
                        <div className="flex flex-col gap-4">
                          <div>
                            <label className="text-xs font-bold text-blue-200">Select Club to Edit Text:</label>
                            <select
                              value={textEditTeamId}
                              onChange={(e) => {
                                setTextEditTeamId(e.target.value);
                                const t = selectedLeague.teams.find((item) => item.id === e.target.value);
                                if (t) {
                                  setNewTextTeamName(t.name);
                                  setNewTextTeamShort(t.shortName);
                                  setNewTextStadium(t.stadiumName);
                                }
                              }}
                              className="w-full mt-1 bg-[#091b40] border border-blue-700 rounded-xl px-3 py-2 text-white font-bold text-sm cursor-pointer"
                            >
                              {selectedLeague.teams.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} ({t.shortName})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-xl bg-[#091b40] border border-blue-800 flex flex-col gap-1.5">
                              <span className="text-[10px] font-mono text-rose-300">
                                DELETE TEXT: {selectedLeague.teams.find((t) => t.id === textEditTeamId)?.name}
                              </span>
                              <label className="text-xs font-bold text-white">ADD THIS TEAM NAME TEXT:</label>
                              <input
                                type="text"
                                value={newTextTeamName}
                                onChange={(e) => setNewTextTeamName(e.target.value)}
                                className="px-3 py-1.5 bg-[#05112c] border border-blue-700 rounded-xl text-white font-bold text-xs"
                              />
                              <button
                                onClick={() => handleDeleteTextAndAddText('TEAM_NAME')}
                                className="mt-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                              >
                                Replace Team Name
                              </button>
                            </div>

                            <div className="p-3.5 rounded-xl bg-[#091b40] border border-blue-800 flex flex-col gap-1.5">
                              <span className="text-[10px] font-mono text-rose-300">
                                DELETE TEXT: {selectedLeague.teams.find((t) => t.id === textEditTeamId)?.shortName}
                              </span>
                              <label className="text-xs font-bold text-white">ADD THIS SHORT TAG TEXT:</label>
                              <input
                                type="text"
                                maxLength={3}
                                value={newTextTeamShort}
                                onChange={(e) => setNewTextTeamShort(e.target.value.toUpperCase())}
                                className="px-3 py-1.5 bg-[#05112c] border border-blue-700 rounded-xl text-white font-bold text-xs uppercase"
                              />
                              <button
                                onClick={() => handleDeleteTextAndAddText('TEAM_SHORT')}
                                className="mt-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                              >
                                Replace Short Tag
                              </button>
                            </div>

                            <div className="p-3.5 rounded-xl bg-[#091b40] border border-blue-800 flex flex-col gap-1.5">
                              <span className="text-[10px] font-mono text-rose-300">
                                DELETE TEXT: {selectedLeague.teams.find((t) => t.id === textEditTeamId)?.stadiumName}
                              </span>
                              <label className="text-xs font-bold text-white">ADD THIS STADIUM TEXT:</label>
                              <input
                                type="text"
                                value={newTextStadium}
                                onChange={(e) => setNewTextStadium(e.target.value)}
                                className="px-3 py-1.5 bg-[#05112c] border border-blue-700 rounded-xl text-white font-bold text-xs"
                              />
                              <button
                                onClick={() => handleDeleteTextAndAddText('STADIUM_NAME')}
                                className="mt-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                              >
                                Replace Stadium
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* C: Player Name Text Editor */}
                      {textEditTarget === 'PLAYER' && (
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-bold text-blue-200">Select Club:</label>
                              <select
                                value={textEditTeamId}
                                onChange={(e) => {
                                  setTextEditTeamId(e.target.value);
                                  const t = selectedLeague.teams.find((item) => item.id === e.target.value);
                                  if (t && t.players.length > 0) {
                                    setTextEditPlayerId(t.players[0].id);
                                    setNewTextPlayerName(t.players[0].name);
                                  }
                                }}
                                className="w-full mt-1 bg-[#091b40] border border-blue-700 rounded-xl px-3 py-2 text-white font-bold text-sm cursor-pointer"
                              >
                                {selectedLeague.teams.map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-xs font-bold text-blue-200">Select Player to Edit Text:</label>
                              <select
                                value={textEditPlayerId}
                                onChange={(e) => {
                                  setTextEditPlayerId(e.target.value);
                                  const curTeam = selectedLeague.teams.find((t) => t.id === textEditTeamId);
                                  const p = curTeam?.players.find((pl) => pl.id === e.target.value);
                                  if (p) setNewTextPlayerName(p.name);
                                }}
                                className="w-full mt-1 bg-[#091b40] border border-blue-700 rounded-xl px-3 py-2 text-white font-bold text-sm cursor-pointer"
                              >
                                {selectedLeague.teams
                                  .find((t) => t.id === textEditTeamId)
                                  ?.players.map((pl) => (
                                    <option key={pl.id} value={pl.id}>
                                      #{pl.kitNumber} {pl.name} ({pl.position})
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-[#091b40] border border-blue-800 flex flex-col gap-2">
                            <label className="text-xs font-bold text-white">ADD THIS TEXT (PLAYER NAME):</label>
                            <input
                              type="text"
                              value={newTextPlayerName}
                              onChange={(e) => setNewTextPlayerName(e.target.value)}
                              className="px-3 py-2 bg-[#05112c] border border-blue-700 rounded-xl text-white font-bold text-sm"
                            />
                            <button
                              onClick={() => handleDeleteTextAndAddText('PLAYER_NAME')}
                              className="mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase cursor-pointer"
                            >
                              Replace Player Name Text
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
