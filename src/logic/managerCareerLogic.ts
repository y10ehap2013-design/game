/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ManagerProfile } from '../data/managersData.ts';

export type ManagerBuild = 'slender' | 'athletic' | 'muscular' | 'stocky';
export type ManagerArmBuild = 'lean' | 'toned' | 'muscular' | 'long';
export type ManagerNoseType = 'straight' | 'aquiline' | 'button' | 'broad' | 'curved';
export type ManagerEyeShape = 'almond' | 'wide' | 'deep' | 'sharp';
export type ManagerHairStyle = 'buzz' | 'slick' | 'sidepart' | 'wavy' | 'ponytail' | 'bald' | 'afro' | 'fade';
export type ManagerFacialHair = 'clean' | 'stubble' | 'beard' | 'goatee' | 'mustache';
export type ManagerAttire = 'suit' | 'tracksuit' | 'blazer' | 'raincoat';
export type ManagerCoachingSkill =
  | 'tactical_genius'
  | 'master_motivator'
  | 'youth_developer'
  | 'transfer_maestro'
  | 'fitness_guru'
  | 'setpiece_specialist';

export type CareerDifficulty = 'SEMI_PRO' | 'PROFESSIONAL' | 'WORLD_CLASS' | 'LEGENDARY';
export type TacticalMentality = 'ULTRA_DEFENSIVE' | 'DEFENSIVE' | 'BALANCED' | 'ATTACKING' | 'ALL_OUT_ATTACK';

export interface CustomManagerCharacter {
  name: string;
  nationality: string;
  countryCode: string;
  flag: string;
  age: number;
  gender: 'male' | 'female';
  // Physical / Skeleton & Muscle
  bodyBuild: ManagerBuild;
  heightCm: number; // 160 - 205 cm
  armBuild: ManagerArmBuild;
  noseType: ManagerNoseType;
  eyeShape: ManagerEyeShape;
  eyeColor: string;
  hairStyle: ManagerHairStyle;
  hairColor: string;
  facialHair: ManagerFacialHair;
  touchlineAttire: ManagerAttire;
  suitColor: string;
  coachingSkill: ManagerCoachingSkill;
}

export interface SquadPlayer {
  id: string;
  name: string;
  position: 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'RW' | 'LW' | 'ST';
  overall: number;
  age: number;
  nationality: string;
  flag: string;
  valueMillions: number;
  weeklyWageK: number;
  stamina: number; // 0 - 100
  morale: 'Ecstatic' | 'High' | 'Good' | 'Neutral' | 'Unhappy';
  isStarting: boolean;
  goalsThisSeason: number;
  assistsThisSeason: number;
}

export interface CareerClub {
  id: string;
  name: string;
  shortName: string;
  country: string;
  league: string;
  stadiumName: string;
  primaryColor: string;
  secondaryColor: string;
  isCustom: boolean;
}

export interface ManagerCareerState {
  id: string;
  managerType: 'REAL' | 'CUSTOM';
  realManager?: ManagerProfile;
  customManager?: CustomManagerCharacter;
  club: CareerClub;
  transferBudgetMillions: number;
  wageBudgetWeeklyK: number;
  difficulty: CareerDifficulty;
  boardConfidence: number; // 0 - 100
  mentality: TacticalMentality;
  formation: '4-3-3' | '4-2-3-1' | '3-5-2' | '4-4-2' | '5-3-2';
  seasonStats: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  };
  squad: SquadPlayer[];
  transferMarket: SquadPlayer[];
}

export interface MatchEvent {
  minute: number;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'SAVE' | 'WOODWORK';
  team: 'HOME' | 'AWAY';
  playerName: string;
  detail: string;
}

export interface MatchSimulationResult {
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  homeShots: number;
  awayShots: number;
  homePossession: number;
  awayPossession: number;
  events: MatchEvent[];
  playerRatings: Record<string, number>;
  manOfTheMatch: string;
  boardConfidenceChange: number;
  financialPrizeK: number;
}

export function createDefaultCustomManager(): CustomManagerCharacter {
  return {
    name: 'Alexander Cross',
    nationality: 'England',
    countryCode: 'ENG',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    age: 44,
    gender: 'male',
    bodyBuild: 'athletic',
    heightCm: 184,
    armBuild: 'toned',
    noseType: 'straight',
    eyeShape: 'sharp',
    eyeColor: '#2B65EC',
    hairStyle: 'sidepart',
    hairColor: '#4A3728',
    facialHair: 'stubble',
    touchlineAttire: 'suit',
    suitColor: '#1A2238',
    coachingSkill: 'tactical_genius',
  };
}

export const POPULAR_CAREER_CLUBS: CareerClub[] = [
  { id: 'rma', name: 'Real Madrid CF', shortName: 'RMA', country: 'Spain', league: 'La Liga', stadiumName: 'Santiago Bernabéu', primaryColor: '#FFFFFF', secondaryColor: '#00529F', isCustom: false },
  { id: 'mci', name: 'Manchester City', shortName: 'MCI', country: 'England', league: 'Premier League', stadiumName: 'Etihad Stadium', primaryColor: '#6CABDD', secondaryColor: '#1C2C5B', isCustom: false },
  { id: 'fcb', name: 'FC Barcelona', shortName: 'BAR', country: 'Spain', league: 'La Liga', stadiumName: 'Spotify Camp Nou', primaryColor: '#A50044', secondaryColor: '#004D98', isCustom: false },
  { id: 'liv', name: 'Liverpool FC', shortName: 'LIV', country: 'England', league: 'Premier League', stadiumName: 'Anfield', primaryColor: '#C8102E', secondaryColor: '#00B2A9', isCustom: false },
  { id: 'ars', name: 'Arsenal FC', shortName: 'ARS', country: 'England', league: 'Premier League', stadiumName: 'Emirates Stadium', primaryColor: '#EF0107', secondaryColor: '#063672', isCustom: false },
  { id: 'bay', name: 'Bayern Munich', shortName: 'BAY', country: 'Germany', league: 'Bundesliga', stadiumName: 'Allianz Arena', primaryColor: '#DC052D', secondaryColor: '#0066B2', isCustom: false },
  { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', country: 'France', league: 'Ligue 1', stadiumName: 'Parc des Princes', primaryColor: '#004170', secondaryColor: '#DA291C', isCustom: false },
  { id: 'int', name: 'Inter Milan', shortName: 'INT', country: 'Italy', league: 'Serie A', stadiumName: 'San Siro', primaryColor: '#0066B2', secondaryColor: '#000000', isCustom: false },
  { id: 'b04', name: 'Bayer Leverkusen', shortName: 'B04', country: 'Germany', league: 'Bundesliga', stadiumName: 'BayArena', primaryColor: '#E32221', secondaryColor: '#000000', isCustom: false },
  { id: 'ahl', name: 'Al Ahly SC (Cairo)', shortName: 'AHL', country: 'Egypt', league: 'CAF Champions League', stadiumName: 'Cairo International Stadium', primaryColor: '#E4002B', secondaryColor: '#FFFFFF', isCustom: false },
  { id: 'zam', name: 'Zamalek SC', shortName: 'ZAM', country: 'Egypt', league: 'CAF Champions League', stadiumName: 'Cairo International Stadium', primaryColor: '#FFFFFF', secondaryColor: '#FF0000', isCustom: false },
  { id: 'sun', name: 'Mamelodi Sundowns', shortName: 'SUN', country: 'South Africa', league: 'CAF Champions League', stadiumName: 'Loftus Versfeld', primaryColor: '#FFD700', secondaryColor: '#0055A5', isCustom: false },
  { id: 'raj', name: 'Raja Club Athletic', shortName: 'RCA', country: 'Morocco', league: 'CAF Confederation Cup', stadiumName: 'Stade Mohammed V', primaryColor: '#00853F', secondaryColor: '#FFFFFF', isCustom: false },
  { id: 'usm', name: 'USM Alger', shortName: 'USM', country: 'Algeria', league: 'CAF Confederation Cup', stadiumName: 'Stade du 5 Juillet', primaryColor: '#E4002B', secondaryColor: '#000000', isCustom: false },
  { id: 'kch', name: 'Kaizer Chiefs FC', shortName: 'KZC', country: 'South Africa', league: 'CAF Confederation Cup', stadiumName: 'FNB Stadium', primaryColor: '#FFC72C', secondaryColor: '#000000', isCustom: false },
];

export function generateInitialSquad(clubName: string, primaryColor: string): SquadPlayer[] {
  // Balanced starting squad generator based on club stature
  const isGlobalGiant = ['Real Madrid', 'Manchester City', 'FC Barcelona', 'Liverpool', 'Bayern Munich', 'Arsenal', 'Paris Saint-Germain', 'Inter Milan'].some(g => clubName.includes(g));
  const baseOvr = isGlobalGiant ? 85 : 79;

  return [
    { id: 'p1', name: 'Marcus Vane', position: 'GK', overall: baseOvr + 2, age: 28, nationality: 'Germany', flag: '🇩🇪', valueMillions: 38, weeklyWageK: 110, stamina: 100, morale: 'Ecstatic', isStarting: true, goalsThisSeason: 0, assistsThisSeason: 0 },
    { id: 'p2', name: 'Lucas Sterling', position: 'RB', overall: baseOvr, age: 24, nationality: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', valueMillions: 32, weeklyWageK: 85, stamina: 96, morale: 'High', isStarting: true, goalsThisSeason: 1, assistsThisSeason: 4 },
    { id: 'p3', name: 'Alessandro Silva', position: 'CB', overall: baseOvr + 3, age: 27, nationality: 'Brazil', flag: '🇧🇷', valueMillions: 48, weeklyWageK: 135, stamina: 95, morale: 'High', isStarting: true, goalsThisSeason: 2, assistsThisSeason: 0 },
    { id: 'p4', name: 'Kouassi Traore', position: 'CB', overall: baseOvr + 1, age: 26, nationality: 'Ivory Coast', flag: '🇨🇮', valueMillions: 36, weeklyWageK: 95, stamina: 98, morale: 'Good', isStarting: true, goalsThisSeason: 1, assistsThisSeason: 1 },
    { id: 'p5', name: 'Theo Mendy', position: 'LB', overall: baseOvr + 1, age: 25, nationality: 'France', flag: '🇫🇷', valueMillions: 40, weeklyWageK: 105, stamina: 94, morale: 'High', isStarting: true, goalsThisSeason: 0, assistsThisSeason: 5 },
    { id: 'p6', name: 'Eduardo Camara', position: 'CDM', overall: baseOvr + 2, age: 23, nationality: 'France', flag: '🇫🇷', valueMillions: 55, weeklyWageK: 120, stamina: 92, morale: 'Ecstatic', isStarting: true, goalsThisSeason: 2, assistsThisSeason: 3 },
    { id: 'p7', name: 'Federico Navarro', position: 'CM', overall: baseOvr + 2, age: 26, nationality: 'Uruguay', flag: '🇺🇾', valueMillions: 50, weeklyWageK: 115, stamina: 97, morale: 'High', isStarting: true, goalsThisSeason: 4, assistsThisSeason: 6 },
    { id: 'p8', name: 'Jamal Osei', position: 'CAM', overall: baseOvr + 4, age: 22, nationality: 'Ghana', flag: '🇬🇭', valueMillions: 72, weeklyWageK: 140, stamina: 95, morale: 'Ecstatic', isStarting: true, goalsThisSeason: 8, assistsThisSeason: 9 },
    { id: 'p9', name: 'Amine El-Khatib', position: 'RW', overall: baseOvr + 3, age: 24, nationality: 'Morocco', flag: '🇲🇦', valueMillions: 65, weeklyWageK: 130, stamina: 93, morale: 'High', isStarting: true, goalsThisSeason: 9, assistsThisSeason: 7 },
    { id: 'p10', name: 'Victor Osimbo', position: 'ST', overall: baseOvr + 5, age: 25, nationality: 'Nigeria', flag: '🇳🇬', valueMillions: 88, weeklyWageK: 165, stamina: 96, morale: 'Ecstatic', isStarting: true, goalsThisSeason: 14, assistsThisSeason: 3 },
    { id: 'p11', name: 'Diego Carvajal', position: 'LW', overall: baseOvr + 2, age: 23, nationality: 'Spain', flag: '🇪🇸', valueMillions: 58, weeklyWageK: 120, stamina: 91, morale: 'High', isStarting: true, goalsThisSeason: 7, assistsThisSeason: 8 },
    // Bench Players
    { id: 'p12', name: 'Daniel Becker', position: 'GK', overall: baseOvr - 5, age: 31, nationality: 'Germany', flag: '🇩🇪', valueMillions: 9, weeklyWageK: 45, stamina: 100, morale: 'Neutral', isStarting: false, goalsThisSeason: 0, assistsThisSeason: 0 },
    { id: 'p13', name: 'Omar Abdelkader', position: 'CB', overall: baseOvr - 2, age: 21, nationality: 'Egypt', flag: '🇪🇬', valueMillions: 16, weeklyWageK: 38, stamina: 100, morale: 'High', isStarting: false, goalsThisSeason: 0, assistsThisSeason: 0 },
    { id: 'p14', name: 'Mateo Kovac', position: 'CM', overall: baseOvr - 1, age: 29, nationality: 'Croatia', flag: '🇭🇷', valueMillions: 22, weeklyWageK: 65, stamina: 100, morale: 'Good', isStarting: false, goalsThisSeason: 1, assistsThisSeason: 2 },
    { id: 'p15', name: 'Kenji Takahashi', position: 'RW', overall: baseOvr - 2, age: 20, nationality: 'Japan', flag: '🇯🇵', valueMillions: 18, weeklyWageK: 35, stamina: 100, morale: 'High', isStarting: false, goalsThisSeason: 2, assistsThisSeason: 2 },
    { id: 'p16', name: 'Carlos Mendez', position: 'ST', overall: baseOvr - 1, age: 30, nationality: 'Argentina', flag: '🇦🇷', valueMillions: 20, weeklyWageK: 60, stamina: 100, morale: 'Neutral', isStarting: false, goalsThisSeason: 3, assistsThisSeason: 1 },
    { id: 'p17', name: 'Bongani Ndlovu', position: 'LB', overall: baseOvr - 3, age: 22, nationality: 'South Africa', flag: '🇿🇦', valueMillions: 14, weeklyWageK: 30, stamina: 100, morale: 'High', isStarting: false, goalsThisSeason: 0, assistsThisSeason: 1 },
  ];
}

export function generateTransferMarketPool(): SquadPlayer[] {
  return [
    { id: 'tm1', name: 'Kylian Moreau', position: 'ST', overall: 91, age: 25, nationality: 'France', flag: '🇫🇷', valueMillions: 130, weeklyWageK: 260, stamina: 100, morale: 'High', isStarting: false, goalsThisSeason: 18, assistsThisSeason: 5 },
    { id: 'tm2', name: 'Jude Bellingham-Smith', position: 'CM', overall: 90, age: 21, nationality: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', valueMillions: 125, weeklyWageK: 220, stamina: 100, morale: 'High', isStarting: false, goalsThisSeason: 12, assistsThisSeason: 9 },
    { id: 'tm3', name: 'Achraf Hakimi-Zouari', position: 'RB', overall: 87, age: 25, nationality: 'Morocco', flag: '🇲🇦', valueMillions: 68, weeklyWageK: 150, stamina: 100, morale: 'Good', isStarting: false, goalsThisSeason: 3, assistsThisSeason: 8 },
    { id: 'tm4', name: 'Florian Wirtz-Kaiser', position: 'CAM', overall: 89, age: 21, nationality: 'Germany', flag: '🇩🇪', valueMillions: 110, weeklyWageK: 190, stamina: 100, morale: 'Ecstatic', isStarting: false, goalsThisSeason: 11, assistsThisSeason: 14 },
    { id: 'tm5', name: 'Lamine Yamal-Nasraoui', position: 'RW', overall: 88, age: 18, nationality: 'Spain', flag: '🇪🇸', valueMillions: 115, weeklyWageK: 140, stamina: 100, morale: 'Ecstatic', isStarting: false, goalsThisSeason: 10, assistsThisSeason: 16 },
    { id: 'tm6', name: 'William Saliba-Diallo', position: 'CB', overall: 88, age: 23, nationality: 'France', flag: '🇫🇷', valueMillions: 80, weeklyWageK: 160, stamina: 100, morale: 'High', isStarting: false, goalsThisSeason: 2, assistsThisSeason: 1 },
    { id: 'tm7', name: 'Emiliano Martinez-Torres', position: 'GK', overall: 87, age: 31, nationality: 'Argentina', flag: '🇦🇷', valueMillions: 45, weeklyWageK: 130, stamina: 100, morale: 'High', isStarting: false, goalsThisSeason: 0, assistsThisSeason: 0 },
    { id: 'tm8', name: 'Rodri Hernandez-Cascante', position: 'CDM', overall: 91, age: 28, nationality: 'Spain', flag: '🇪🇸', valueMillions: 120, weeklyWageK: 240, stamina: 100, morale: 'Ecstatic', isStarting: false, goalsThisSeason: 6, assistsThisSeason: 7 },
  ];
}

/**
 * Pure simulation of an Instant Match with coach specialties, difficulty, and mentality
 */
export function simulateInstantMatch(
  state: ManagerCareerState,
  opponentName: string,
  opponentOvr: number = 82
): MatchSimulationResult {
  const startingXI = state.squad.filter(p => p.isStarting);
  const teamOvr = startingXI.length > 0
    ? Math.round(startingXI.reduce((acc, p) => acc + p.overall, 0) / startingXI.length)
    : 80;

  // Calculate manager bonus
  let managerBonus = 0;
  if (state.managerType === 'REAL' && state.realManager) {
    managerBonus = (state.realManager.coachingBonus.attackBonus + state.realManager.coachingBonus.defenseBonus) / 2;
  } else if (state.managerType === 'CUSTOM' && state.customManager) {
    if (state.customManager.coachingSkill === 'tactical_genius') managerBonus = 4;
    else if (state.customManager.coachingSkill === 'master_motivator') managerBonus = 3.5;
    else managerBonus = 2.5;
  }

  // Difficulty adjustment
  let difficultyModifier = 0;
  if (state.difficulty === 'SEMI_PRO') difficultyModifier = 6;
  else if (state.difficulty === 'PROFESSIONAL') difficultyModifier = 2;
  else if (state.difficulty === 'WORLD_CLASS') difficultyModifier = -3;
  else if (state.difficulty === 'LEGENDARY') difficultyModifier = -7;

  // Mentality adjustment
  let attackBias = 0;
  let defenseBias = 0;
  if (state.mentality === 'ALL_OUT_ATTACK') { attackBias = 4; defenseBias = -4; }
  else if (state.mentality === 'ATTACKING') { attackBias = 2; defenseBias = -2; }
  else if (state.mentality === 'DEFENSIVE') { attackBias = -2; defenseBias = 3; }
  else if (state.mentality === 'ULTRA_DEFENSIVE') { attackBias = -4; defenseBias = 5; }

  const homeStrength = teamOvr + managerBonus + difficultyModifier + attackBias;
  const awayStrength = opponentOvr - defenseBias;

  const strengthDiff = homeStrength - awayStrength;
  const baseHomeExp = Math.max(0.4, Math.min(3.6, 1.6 + strengthDiff * 0.08));
  const baseAwayExp = Math.max(0.2, Math.min(3.2, 1.2 - strengthDiff * 0.07));

  // Poisson-like distribution for realistic goals
  const homeScore = Math.floor(Math.max(0, baseHomeExp + (Math.random() * 2 - 0.8)));
  const awayScore = Math.floor(Math.max(0, baseAwayExp + (Math.random() * 1.8 - 0.8)));

  const homeShots = Math.round(9 + homeScore * 2.5 + Math.random() * 4);
  const awayShots = Math.round(6 + awayScore * 2.2 + Math.random() * 3);

  const homePossession = Math.min(76, Math.max(32, Math.round(50 + (homeStrength - awayStrength) * 1.2)));
  const awayPossession = 100 - homePossession;

  const events: MatchEvent[] = [];
  const scorersPool = startingXI.filter(p => ['ST', 'RW', 'LW', 'CAM', 'CM'].includes(p.position));

  // Generate Home Goal Events
  for (let g = 0; g < homeScore; g++) {
    const min = Math.floor(Math.random() * 88) + 2;
    const scorer = scorersPool.length > 0
      ? scorersPool[Math.floor(Math.random() * scorersPool.length)].name
      : 'Striker';
    events.push({
      minute: min,
      type: 'GOAL',
      team: 'HOME',
      playerName: scorer,
      detail: `Spectacular finish into the bottom corner by ${scorer}!`,
    });
  }

  // Generate Away Goal Events
  for (let g = 0; g < awayScore; g++) {
    const min = Math.floor(Math.random() * 88) + 2;
    events.push({
      minute: min,
      type: 'GOAL',
      team: 'AWAY',
      playerName: `${opponentName} Forward`,
      detail: `Clinical counter-attack converted by ${opponentName}.`,
    });
  }

  // Add yellow cards & key moments
  const numCards = Math.floor(Math.random() * 3) + 1;
  for (let c = 0; c < numCards; c++) {
    const min = Math.floor(Math.random() * 85) + 5;
    const isHome = Math.random() > 0.5;
    const player = isHome && startingXI[c % startingXI.length]
      ? startingXI[c % startingXI.length].name
      : `${opponentName} Midfielder`;
    events.push({
      minute: min,
      type: 'YELLOW_CARD',
      team: isHome ? 'HOME' : 'AWAY',
      playerName: player,
      detail: `Cautioned for a tactical foul breaking a promising break.`,
    });
  }

  // Sort events chronologically
  events.sort((a, b) => a.minute - b.minute);

  // Calculate player ratings
  const playerRatings: Record<string, number> = {};
  let bestRating = 6.0;
  let motm = startingXI[0]?.name || 'Captain';

  startingXI.forEach(p => {
    let r = 6.5 + (Math.random() * 1.8 - 0.7);
    if (events.some(e => e.type === 'GOAL' && e.playerName === p.name)) {
      r += 1.8;
    }
    if (homeScore > awayScore) r += 0.5;
    r = Math.min(10, Math.max(5.0, Math.round(r * 10) / 10));
    playerRatings[p.id] = r;

    if (r > bestRating) {
      bestRating = r;
      motm = p.name;
    }
  });

  // Board confidence adjustment
  let boardChange = 0;
  if (homeScore > awayScore) boardChange = 3;
  else if (homeScore === awayScore) boardChange = 0;
  else boardChange = -4;

  const financialPrize = homeScore > awayScore ? 180 : (homeScore === awayScore ? 75 : 30);

  return {
    homeTeamName: state.club.name,
    awayTeamName: opponentName,
    homeScore,
    awayScore,
    homeShots,
    awayShots,
    homePossession,
    awayPossession,
    events,
    playerRatings,
    manOfTheMatch: motm,
    boardConfidenceChange: boardChange,
    financialPrizeK: financialPrize,
  };
}

/**
 * Handle squad lineup swap (starting vs bench or position swap)
 */
export function swapSquadPlayers(squad: SquadPlayer[], playerAId: string, playerBId: string): SquadPlayer[] {
  const pA = squad.find(p => p.id === playerAId);
  const pB = squad.find(p => p.id === playerBId);
  if (!pA || !pB) return squad;

  const startingCount = squad.filter(p => p.isStarting).length;
  // If one is starting and one is bench, toggle isStarting
  if (pA.isStarting !== pB.isStarting) {
    return squad.map(p => {
      if (p.id === playerAId) return { ...p, isStarting: pB.isStarting };
      if (p.id === playerBId) return { ...p, isStarting: pA.isStarting };
      return p;
    });
  }

  // Both are either starting or bench, swap order
  const indexA = squad.findIndex(p => p.id === playerAId);
  const indexB = squad.findIndex(p => p.id === playerBId);
  const copy = [...squad];
  copy[indexA] = pB;
  copy[indexB] = pA;
  return copy;
}

/**
 * Handle buying a player from the transfer market
 */
export function buyPlayerFromMarket(
  state: ManagerCareerState,
  playerId: string
): { success: boolean; newState: ManagerCareerState; error?: string } {
  const player = state.transferMarket.find(p => p.id === playerId);
  if (!player) return { success: false, newState: state, error: 'Player not found in market' };

  if (state.transferBudgetMillions < player.valueMillions) {
    return {
      success: false,
      newState: state,
      error: `Insufficient transfer funds! Required $${player.valueMillions}M, current budget is $${state.transferBudgetMillions.toFixed(1)}M`,
    };
  }

  const updatedBudget = state.transferBudgetMillions - player.valueMillions;
  const newSquadPlayer: SquadPlayer = {
    ...player,
    isStarting: false,
    morale: 'Ecstatic',
  };

  const updatedSquad = [...state.squad, newSquadPlayer];
  const updatedMarket = state.transferMarket.filter(p => p.id !== playerId);

  return {
    success: true,
    newState: {
      ...state,
      transferBudgetMillions: Math.round(updatedBudget * 10) / 10,
      squad: updatedSquad,
      transferMarket: updatedMarket,
      boardConfidence: Math.min(100, state.boardConfidence + 2),
    },
  };
}
