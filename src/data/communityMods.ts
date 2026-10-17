/**
 * Community modding assets, forum discussions, and esports tournament brackets.
 */

export interface ModItem {
  id: string;
  title: string;
  author: string;
  category: 'Kit Pack' | 'Face & Hair Pack' | 'Stadium & Weather' | 'Database / TED' | 'Audio Commentary';
  rating: number;
  downloads: number;
  description: string;
  previewUrl: string;
  compatVersion: string;
  tags: string[];
}

export interface TournamentMatch {
  id: string;
  round: string;
  teamA: string;
  teamB: string;
  scoreA?: number;
  scoreB?: number;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED';
  date: string;
}

export const COMMUNITY_MODS: ModItem[] = [
  {
    id: 'MOD_1',
    title: 'EvoWeb Patch 2027 v4.0 - All African & Middle East Leagues',
    author: 'ZizouModder & SmokeTeam',
    category: 'Database / TED',
    rating: 4.9,
    downloads: 148200,
    description: 'Complete overhaul adding full kits, real faces, chants and accurate stats for Egyptian Premier League, Botola Pro, Roshn Saudi League and J1 League.',
    previewUrl: 'kit_pack_badge',
    compatVersion: 'PES 2019 / eFootball 2027 / PSP ISO',
    tags: ['Ahly', 'Zamalek', 'Hilal', 'Botola', 'HD Kits'],
  },
  {
    id: 'MOD_2',
    title: '4K Ultra Turf & Dynamic Night Floodlight Shader Pack',
    author: 'EndoStadiums',
    category: 'Stadium & Weather',
    rating: 4.8,
    downloads: 92400,
    description: 'Hyper-realistic grass pitch mower strips, 3D net physics bounce, and atmospheric floodlight volumetric glow matching Santiago Bernabéu and Cairo Stadium.',
    previewUrl: 'stadium_turf',
    compatVersion: 'PC / Handheld Emulator',
    tags: ['4K Grass', 'Volumetric Lights', 'Realistic Nets'],
  },
  {
    id: 'MOD_3',
    title: 'Authentic Arabic & English Dual Commentary Pack',
    author: 'Chawali & Drury FX',
    category: 'Audio Commentary',
    rating: 4.95,
    downloads: 120500,
    description: 'Bespoke match commentary lines, electric scream on screamers, goal roar, tactical analysis, and crowd ultra flares audio.',
    previewUrl: 'audio_tape',
    compatVersion: 'All Platforms',
    tags: ['Issam Chawali', 'Peter Drury', 'Crowd Chants'],
  },
  {
    id: 'MOD_4',
    title: 'Brasileirão 2027 Real Squads & Official Badges Pack',
    author: 'BrazukasPES',
    category: 'Kit Pack',
    rating: 4.7,
    downloads: 78900,
    description: 'Replaces generic Brazilian players with authentic Flamengo, Palmeiras, Fluminense, and São Paulo full squads and vector crests.',
    previewUrl: 'brazil_flag',
    compatVersion: 'PES 2019 / PSP',
    tags: ['Flamengo', 'Palmeiras', 'Real Players'],
  },
];

export const ESPORTS_LEADERBOARD = [
  { rank: 1, player: 'xPro_Fahed', club: 'Al Hilal eSports', points: 2840, winRate: '88%', platform: 'PSP / PC' },
  { rank: 2, player: 'Cairo_Legend99', club: 'Al Ahly eSports', points: 2790, winRate: '86%', platform: 'PC Master' },
  { rank: 3, player: 'Tokyo_Striker', club: 'Vissel Kobe Pro', points: 2710, winRate: '83%', platform: 'Handheld' },
  { rank: 4, player: 'Rio_Samba10', club: 'Flamengo Gaming', points: 2680, winRate: '81%', platform: 'PC Master' },
  { rank: 5, player: 'London_Ace', club: 'Man City eSports', points: 2640, winRate: '80%', platform: 'PC Master' },
];

export const TOURNAMENT_BRACKETS: TournamentMatch[] = [
  { id: 'T_1', round: 'Quarter-Final 1', teamA: 'Al Ahly SC', teamB: 'Wydad AC', scoreA: 2, scoreB: 1, status: 'COMPLETED', date: 'Oct 14' },
  { id: 'T_2', round: 'Quarter-Final 2', teamA: 'Al Hilal SFC', teamB: 'Al Ain FC', scoreA: 3, scoreB: 2, status: 'COMPLETED', date: 'Oct 14' },
  { id: 'T_3', round: 'Quarter-Final 3', teamA: 'CR Flamengo', teamB: 'Club América', scoreA: 2, scoreB: 0, status: 'COMPLETED', date: 'Oct 15' },
  { id: 'T_4', round: 'Quarter-Final 4', teamA: 'Real Madrid CF', teamB: 'Manchester City', scoreA: 1, scoreB: 1, status: 'LIVE', date: 'Oct 15' },
  { id: 'T_5', round: 'Semi-Final 1', teamA: 'Al Ahly SC', teamB: 'Al Hilal SFC', status: 'SCHEDULED', date: 'Oct 17' },
  { id: 'T_6', round: 'Semi-Final 2', teamA: 'CR Flamengo', teamB: 'Winner QF4', status: 'SCHEDULED', date: 'Oct 17' },
];
