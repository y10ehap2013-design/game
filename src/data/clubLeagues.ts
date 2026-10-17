/**
 * Comprehensive domestic club leagues database.
 * Includes Middle Eastern & African leagues, missing European leagues,
 * Latin American leagues, Asian/Oceanian leagues, and European giants.
 */

import { calculateOverallRating } from '../logic/stats.ts';
import type { PlayerAttributes, PlayerPosition, PlayerLoadProfile } from '../logic/stats.ts';

export interface ClubPlayer {
  id: string;
  name: string;
  position: PlayerPosition;
  age: number;
  kitNumber: number;
  attributes: PlayerAttributes;
  overallRating: number;
  marketValueM: number;
  wageK: number;
  nationality: string;
  loadProfile: PlayerLoadProfile;
}

export interface ClubTeam {
  id: string;
  name: string;
  shortName: string;
  leagueId: string;
  country: string;
  stadiumName: string;
  stadiumAtmosphere: {
    crowdChantType: string;
    weatherPreset: 'Sunny Day' | 'Floodlit Night' | 'Rainy Slick' | 'Golden Hour';
    capacity: number;
  };
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  tactics: {
    formation: string;
    style: 'Tiki-Taka' | 'Gegenpress' | 'Fast Counter' | 'Wing Play' | 'Long Ball';
    pressingIntensity: number;
    defensiveLine: number;
  };
  players: ClubPlayer[];
}

export interface ClubLeague {
  id: string;
  name: string;
  region: 'Middle East & Africa' | 'Top-Flight European' | 'Latin America' | 'Asia & Oceania' | 'Fully Licensed Europe';
  country: string;
  licensingTier: 'Full License' | 'EvoWeb Patched' | 'Rest of World Added' | 'Community Master';
  teams: ClubTeam[];
}

function makePlayer(
  id: string,
  name: string,
  pos: PlayerPosition,
  age: number,
  kitNumber: number,
  nationality: string,
  attrs: PlayerAttributes,
  marketValueM: number,
  overrides?: Partial<PlayerLoadProfile>
): ClubPlayer {
  const overallRating = calculateOverallRating(pos, attrs);
  const defaultLoad: PlayerLoadProfile = {
    matchesLast14Days: 2,
    minutesPlayedLast14Days: 170,
    highIntensitySprintKm: 8.5,
    currentStamina: 88,
    recoveryDays: 4,
    priorInjuriesCount: 1,
    age,
    ...overrides,
  };

  return {
    id,
    name,
    position: pos,
    age,
    kitNumber,
    attributes: attrs,
    overallRating,
    marketValueM,
    wageK: Math.round(overallRating * 1.5),
    nationality,
    loadProfile: defaultLoad,
  };
}

export const CLUB_LEAGUES: ClubLeague[] = [
  // 1. Middle East & Africa
  {
    id: 'LEAGUE_EGY',
    name: 'Egyptian Premier League',
    region: 'Middle East & Africa',
    country: 'Egypt',
    licensingTier: 'EvoWeb Patched',
    teams: [
      {
        id: 'TEAM_ALAHLY',
        name: 'Al Ahly SC',
        shortName: 'AHL',
        leagueId: 'LEAGUE_EGY',
        country: 'Egypt',
        stadiumName: 'Cairo International Stadium',
        stadiumAtmosphere: {
          crowdChantType: 'Al Ahly Red Devils Ultras',
          weatherPreset: 'Floodlit Night',
          capacity: 75000,
        },
        primaryColor: '#C8102E',
        secondaryColor: '#FFFFFF',
        accentColor: '#DAA520',
        tactics: {
          formation: '4-3-3',
          style: 'Fast Counter',
          pressingIntensity: 85,
          defensiveLine: 72,
        },
        players: [
          makePlayer('AHL_1', 'Mohamed El Shenawy', 'GK', 35, 1, 'Egypt', { pace: 62, shooting: 20, passing: 68, dribbling: 55, defending: 70, physical: 84, gkReflexes: 86 }, 4.5),
          makePlayer('AHL_2', 'Mohamed Abdelmonem', 'CB', 25, 24, 'Egypt', { pace: 77, shooting: 45, passing: 72, dribbling: 68, defending: 85, physical: 83 }, 12.0),
          makePlayer('AHL_3', 'Ali Maâloul', 'LB', 34, 21, 'Tunisia', { pace: 78, shooting: 74, passing: 86, dribbling: 81, defending: 76, physical: 75 }, 3.5),
          makePlayer('AHL_4', 'Emam Ashour', 'CMF', 26, 22, 'Egypt', { pace: 82, shooting: 82, passing: 84, dribbling: 83, defending: 75, physical: 84 }, 8.5),
          makePlayer('AHL_5', 'Marwan Attia', 'DMF', 26, 14, 'Egypt', { pace: 75, shooting: 60, passing: 80, dribbling: 77, defending: 83, physical: 85 }, 6.0),
          makePlayer('AHL_6', 'Percy Tau', 'RWF', 30, 10, 'South Africa', { pace: 88, shooting: 79, passing: 78, dribbling: 86, defending: 44, physical: 73 }, 7.0),
          makePlayer('AHL_7', 'Hussein El Shahat', 'LWF', 32, 14, 'Egypt', { pace: 83, shooting: 78, passing: 81, dribbling: 84, defending: 50, physical: 74 }, 5.0),
          makePlayer('AHL_8', 'Wessam Abou Ali', 'CF', 25, 9, 'Palestine', { pace: 85, shooting: 84, passing: 70, dribbling: 78, defending: 40, physical: 82 }, 6.5),
          makePlayer('AHL_9', 'Ramy Rabia', 'CB', 31, 5, 'Egypt', { pace: 70, shooting: 40, passing: 68, dribbling: 60, defending: 80, physical: 81 }, 2.0),
          makePlayer('AHL_10', 'Akram Tawfik', 'RB', 26, 8, 'Egypt', { pace: 80, shooting: 62, passing: 74, dribbling: 75, defending: 82, physical: 87 }, 5.5),
          makePlayer('AHL_11', 'Afsha (Magdy)', 'AMF', 28, 19, 'Egypt', { pace: 74, shooting: 80, passing: 85, dribbling: 82, defending: 52, physical: 71 }, 4.8),
        ],
      },
      {
        id: 'TEAM_ZAMALEK',
        name: 'Zamalek SC',
        shortName: 'ZAM',
        leagueId: 'LEAGUE_EGY',
        country: 'Egypt',
        stadiumName: 'Cairo Stadium White Knights Arena',
        stadiumAtmosphere: {
          crowdChantType: 'White Knights Passion',
          weatherPreset: 'Floodlit Night',
          capacity: 65000,
        },
        primaryColor: '#FFFFFF',
        secondaryColor: '#C8102E',
        accentColor: '#C8102E',
        tactics: {
          formation: '4-2-3-1',
          style: 'Wing Play',
          pressingIntensity: 78,
          defensiveLine: 68,
        },
        players: [
          makePlayer('ZAM_1', 'Mohamed Awad', 'GK', 32, 1, 'Egypt', { pace: 60, shooting: 20, passing: 65, dribbling: 50, defending: 68, physical: 78, gkReflexes: 81 }, 2.0),
          makePlayer('ZAM_2', 'Ahmed Sayed Zizo', 'RWF', 28, 25, 'Egypt', { pace: 90, shooting: 87, passing: 88, dribbling: 88, defending: 60, physical: 82 }, 15.0),
          makePlayer('ZAM_3', 'Mahmoud Bentayg', 'LB', 25, 3, 'Morocco', { pace: 83, shooting: 65, passing: 76, dribbling: 78, defending: 77, physical: 79 }, 3.2),
          makePlayer('ZAM_4', 'Hamza Mathlouthi', 'CB', 32, 24, 'Tunisia', { pace: 72, shooting: 50, passing: 70, dribbling: 68, defending: 81, physical: 80 }, 2.5),
          makePlayer('ZAM_5', 'Nabil Donga', 'DMF', 28, 8, 'Egypt', { pace: 74, shooting: 70, passing: 79, dribbling: 75, defending: 81, physical: 83 }, 4.0),
          makePlayer('ZAM_6', 'Abdallah El Said', 'AMF', 39, 19, 'Egypt', { pace: 66, shooting: 82, passing: 90, dribbling: 82, defending: 55, physical: 68 }, 1.5),
          makePlayer('ZAM_7', 'Mostafa Shalaby', 'LWF', 29, 11, 'Egypt', { pace: 84, shooting: 77, passing: 75, dribbling: 82, defending: 48, physical: 76 }, 3.0),
          makePlayer('ZAM_8', 'Seifeddine Jaziri', 'CF', 31, 30, 'Tunisia', { pace: 82, shooting: 80, passing: 68, dribbling: 77, defending: 42, physical: 78 }, 3.5),
        ],
      },
    ],
  },
  {
    id: 'LEAGUE_MAR',
    name: 'Moroccan Botola Pro Inwi',
    region: 'Middle East & Africa',
    country: 'Morocco',
    licensingTier: 'EvoWeb Patched',
    teams: [
      {
        id: 'TEAM_WYDAD',
        name: 'Wydad AC Casablanca',
        shortName: 'WAC',
        leagueId: 'LEAGUE_MAR',
        country: 'Morocco',
        stadiumName: 'Stade Mohammed V',
        stadiumAtmosphere: {
          crowdChantType: 'Winners 2005 Casablanca',
          weatherPreset: 'Floodlit Night',
          capacity: 45891,
        },
        primaryColor: '#C8102E',
        secondaryColor: '#FFFFFF',
        accentColor: '#C8102E',
        tactics: {
          formation: '4-3-3',
          style: 'Gegenpress',
          pressingIntensity: 82,
          defensiveLine: 74,
        },
        players: [
          makePlayer('WAC_1', 'Youssef El Motie', 'GK', 29, 1, 'Morocco', { pace: 60, shooting: 15, passing: 66, dribbling: 50, defending: 70, physical: 80, gkReflexes: 80 }, 2.0),
          makePlayer('WAC_2', 'Jamal Harkass', 'CB', 28, 4, 'Morocco', { pace: 71, shooting: 42, passing: 68, dribbling: 62, defending: 81, physical: 84 }, 2.5),
          makePlayer('WAC_3', 'Ayoub Boucheta', 'RB', 25, 2, 'Morocco', { pace: 82, shooting: 58, passing: 72, dribbling: 74, defending: 76, physical: 78 }, 2.0),
          makePlayer('WAC_4', 'Cassius Mailula', 'CF', 23, 11, 'South Africa', { pace: 86, shooting: 80, passing: 74, dribbling: 82, defending: 40, physical: 75 }, 3.5),
          makePlayer('WAC_5', 'M Hamed Niang', 'DMF', 26, 6, 'Senegal', { pace: 75, shooting: 62, passing: 76, dribbling: 72, defending: 80, physical: 84 }, 2.2),
        ],
      },
      {
        id: 'TEAM_RAJA',
        name: 'Raja CA Casablanca',
        shortName: 'RCA',
        leagueId: 'LEAGUE_MAR',
        country: 'Morocco',
        stadiumName: 'Stade Mohammed V (Green Side)',
        stadiumAtmosphere: {
          crowdChantType: 'Curva Sud Green Boys',
          weatherPreset: 'Floodlit Night',
          capacity: 45891,
        },
        primaryColor: '#008751',
        secondaryColor: '#FFFFFF',
        accentColor: '#008751',
        tactics: {
          formation: '4-2-3-1',
          style: 'Tiki-Taka',
          pressingIntensity: 80,
          defensiveLine: 75,
        },
        players: [
          makePlayer('RCA_1', 'Anas Zniti', 'GK', 36, 1, 'Morocco', { pace: 58, shooting: 18, passing: 72, dribbling: 55, defending: 69, physical: 77, gkReflexes: 82 }, 1.8),
          makePlayer('RCA_2', 'Yousri Bouzok', 'RWF', 28, 26, 'Algeria', { pace: 85, shooting: 82, passing: 84, dribbling: 86, defending: 48, physical: 75 }, 4.5),
          makePlayer('RCA_3', 'Adam Ennafati', 'LWF', 30, 7, 'Morocco', { pace: 83, shooting: 78, passing: 81, dribbling: 84, defending: 50, physical: 73 }, 3.0),
        ],
      },
    ],
  },
  {
    id: 'LEAGUE_TUN',
    name: 'Tunisian Ligue Professionnelle 1',
    region: 'Middle East & Africa',
    country: 'Tunisia',
    licensingTier: 'EvoWeb Patched',
    teams: [
      {
        id: 'TEAM_EST',
        name: 'Espérance Sportive de Tunis',
        shortName: 'EST',
        leagueId: 'LEAGUE_TUN',
        country: 'Tunisia',
        stadiumName: 'Stade Olympique de Radès',
        stadiumAtmosphere: {
          crowdChantType: 'Taraji Blood & Gold',
          weatherPreset: 'Floodlit Night',
          capacity: 60000,
        },
        primaryColor: '#E60000',
        secondaryColor: '#FFD700',
        accentColor: '#000000',
        tactics: {
          formation: '4-3-3',
          style: 'Gegenpress',
          pressingIntensity: 84,
          defensiveLine: 70,
        },
        players: [
          makePlayer('EST_1', 'Amanallah Memmiche', 'GK', 20, 1, 'Tunisia', { pace: 64, shooting: 15, passing: 68, dribbling: 52, defending: 72, physical: 82, gkReflexes: 83 }, 4.0),
          makePlayer('EST_2', 'Yan Sasse', 'AMF', 27, 10, 'Brazil', { pace: 82, shooting: 81, passing: 85, dribbling: 86, defending: 46, physical: 76 }, 5.5),
          makePlayer('EST_3', 'Rodrigo Rodrigues', 'CF', 28, 9, 'Brazil', { pace: 81, shooting: 83, passing: 68, dribbling: 77, defending: 38, physical: 84 }, 4.5),
        ],
      },
    ],
  },
  {
    id: 'LEAGUE_ALG',
    name: 'Algerian Ligue Professionnelle 1',
    region: 'Middle East & Africa',
    country: 'Algeria',
    licensingTier: 'EvoWeb Patched',
    teams: [
      {
        id: 'TEAM_MCA',
        name: 'MC Alger (Mouloudia)',
        shortName: 'MCA',
        leagueId: 'LEAGUE_ALG',
        country: 'Algeria',
        stadiumName: 'Stade du 5 Juillet',
        stadiumAtmosphere: {
          crowdChantType: 'Chnaoua Pyro Echo',
          weatherPreset: 'Floodlit Night',
          capacity: 64000,
        },
        primaryColor: '#008000',
        secondaryColor: '#FF0000',
        accentColor: '#FFFFFF',
        tactics: {
          formation: '4-3-3',
          style: 'Fast Counter',
          pressingIntensity: 82,
          defensiveLine: 70,
        },
        players: [
          makePlayer('MCA_1', 'Youcef Belaïli', 'LWF', 32, 10, 'Algeria', { pace: 84, shooting: 85, passing: 87, dribbling: 89, defending: 45, physical: 78 }, 6.5),
          makePlayer('MCA_2', 'Zakaria Naidji', 'CF', 29, 9, 'Algeria', { pace: 83, shooting: 81, passing: 75, dribbling: 80, defending: 40, physical: 80 }, 3.2),
        ],
      },
    ],
  },
  {
    id: 'LEAGUE_UAE',
    name: 'UAE ADNOC Pro League',
    region: 'Middle East & Africa',
    country: 'United Arab Emirates',
    licensingTier: 'EvoWeb Patched',
    teams: [
      {
        id: 'TEAM_ALAIN',
        name: 'Al Ain FC (Asian Champions)',
        shortName: 'AIN',
        leagueId: 'LEAGUE_UAE',
        country: 'UAE',
        stadiumName: 'Hazza bin Zayed Stadium',
        stadiumAtmosphere: {
          crowdChantType: 'The Boss Purple Haze',
          weatherPreset: 'Floodlit Night',
          capacity: 25053,
        },
        primaryColor: '#4B0082',
        secondaryColor: '#FFD700',
        accentColor: '#FFFFFF',
        tactics: {
          formation: '4-3-3',
          style: 'Fast Counter',
          pressingIntensity: 81,
          defensiveLine: 72,
        },
        players: [
          makePlayer('AIN_1', 'Soufiane Rahimi', 'CF', 28, 21, 'Morocco', { pace: 91, shooting: 87, passing: 81, dribbling: 88, defending: 48, physical: 82 }, 18.0),
          makePlayer('AIN_2', 'Kaku Romero', 'AMF', 29, 10, 'Paraguay', { pace: 80, shooting: 82, passing: 88, dribbling: 85, defending: 50, physical: 74 }, 8.5),
          makePlayer('AIN_3', 'Kodjo Laba', 'CF', 32, 9, 'Togo', { pace: 82, shooting: 86, passing: 70, dribbling: 77, defending: 42, physical: 86 }, 7.0),
        ],
      },
    ],
  },
  {
    id: 'LEAGUE_QAT',
    name: 'Qatar Stars League',
    region: 'Middle East & Africa',
    country: 'Qatar',
    licensingTier: 'EvoWeb Patched',
    teams: [
      {
        id: 'TEAM_ALSADD',
        name: 'Al Sadd SC',
        shortName: 'SAD',
        leagueId: 'LEAGUE_QAT',
        country: 'Qatar',
        stadiumName: 'Jassim bin Hamad Stadium',
        stadiumAtmosphere: {
          crowdChantType: 'The Wolves Drum Beat',
          weatherPreset: 'Floodlit Night',
          capacity: 15000,
        },
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF',
        accentColor: '#808080',
        tactics: {
          formation: '4-2-3-1',
          style: 'Tiki-Taka',
          pressingIntensity: 79,
          defensiveLine: 76,
        },
        players: [
          makePlayer('SAD_1', 'Akram Afif', 'LWF', 27, 11, 'Qatar', { pace: 89, shooting: 84, passing: 88, dribbling: 90, defending: 48, physical: 76 }, 14.0),
          makePlayer('SAD_2', 'Guilherme Torres', 'DMF', 33, 8, 'Brazil', { pace: 72, shooting: 68, passing: 82, dribbling: 76, defending: 83, physical: 84 }, 4.0),
        ],
      },
    ],
  },
  {
    id: 'LEAGUE_RSA',
    name: 'South African Premier Soccer League (PSL)',
    region: 'Middle East & Africa',
    country: 'South Africa',
    licensingTier: 'EvoWeb Patched',
    teams: [
      {
        id: 'TEAM_SUNDOWNS',
        name: 'Mamelodi Sundowns',
        shortName: 'SUN',
        leagueId: 'LEAGUE_RSA',
        country: 'South Africa',
        stadiumName: 'Loftus Versfeld Stadium',
        stadiumAtmosphere: {
          crowdChantType: 'The Brazilians Brass Band & Vuvuzela',
          weatherPreset: 'Sunny Day',
          capacity: 51762,
        },
        primaryColor: '#FFD700',
        secondaryColor: '#0000CD',
        accentColor: '#FFFFFF',
        tactics: {
          formation: '4-3-3',
          style: 'Tiki-Taka',
          pressingIntensity: 84,
          defensiveLine: 78,
        },
        players: [
          makePlayer('SUN_1', 'Ronwen Williams', 'GK', 32, 1, 'South Africa', { pace: 62, shooting: 20, passing: 78, dribbling: 60, defending: 72, physical: 82, gkReflexes: 85 }, 5.0),
          makePlayer('SUN_2', 'Teboho Mokoena', 'CMF', 27, 4, 'South Africa', { pace: 81, shooting: 84, passing: 86, dribbling: 82, defending: 79, physical: 85 }, 7.5),
          makePlayer('SUN_3', 'Peter Shalulile', 'CF', 31, 38, 'Namibia', { pace: 87, shooting: 85, passing: 72, dribbling: 80, defending: 44, physical: 83 }, 4.5),
        ],
      },
    ],
  },

  // 2. Top-Flight European Missing Leagues
  {
    id: 'LEAGUE_GRE',
    name: 'Greek Super League',
    region: 'Top-Flight European',
    country: 'Greece',
    licensingTier: 'Rest of World Added',
    teams: [
      {
        id: 'TEAM_OLY',
        name: 'Olympiacos FC (Conference Champions)',
        shortName: 'OLY',
        leagueId: 'LEAGUE_GRE',
        country: 'Greece',
        stadiumName: 'Georgios Karaiskakis Stadium',
        stadiumAtmosphere: {
          crowdChantType: 'Gate 7 Piraeus Roar',
          weatherPreset: 'Floodlit Night',
          capacity: 32115,
        },
        primaryColor: '#C8102E',
        secondaryColor: '#FFFFFF',
        accentColor: '#C8102E',
        tactics: {
          formation: '4-2-3-1',
          style: 'Gegenpress',
          pressingIntensity: 85,
          defensiveLine: 74,
        },
        players: [
          makePlayer('OLY_1', 'Ayoub El Kaabi', 'CF', 31, 9, 'Morocco', { pace: 84, shooting: 87, passing: 72, dribbling: 79, defending: 45, physical: 83 }, 8.0),
          makePlayer('OLY_2', 'Daniel Podence', 'LWF', 28, 56, 'Portugal', { pace: 89, shooting: 78, passing: 82, dribbling: 88, defending: 40, physical: 68 }, 12.0),
        ],
      },
      {
        id: 'TEAM_PAO',
        name: 'Panathinaikos FC',
        shortName: 'PAO',
        leagueId: 'LEAGUE_GRE',
        country: 'Greece',
        stadiumName: 'Apostolos Nikolaidis Stadium',
        stadiumAtmosphere: {
          crowdChantType: 'Gate 13 Clover Chorus',
          weatherPreset: 'Floodlit Night',
          capacity: 16003,
        },
        primaryColor: '#007A3D',
        secondaryColor: '#FFFFFF',
        accentColor: '#007A3D',
        tactics: {
          formation: '4-3-3',
          style: 'Fast Counter',
          pressingIntensity: 80,
          defensiveLine: 71,
        },
        players: [
          makePlayer('PAO_1', 'Fotis Ioannidis', 'CF', 24, 7, 'Greece', { pace: 83, shooting: 84, passing: 76, dribbling: 81, defending: 48, physical: 85 }, 16.0),
          makePlayer('PAO_2', 'Tasos Bakasetas', 'AMF', 31, 11, 'Greece', { pace: 74, shooting: 86, passing: 85, dribbling: 81, defending: 55, physical: 80 }, 7.5),
        ],
      },
    ],
  },
  {
    id: 'LEAGUE_CRO',
    name: 'Croatian Football League (HNL)',
    region: 'Top-Flight European',
    country: 'Croatia',
    licensingTier: 'Rest of World Added',
    teams: [
      {
        id: 'TEAM_DINAMO',
        name: 'GNK Dinamo Zagreb',
        shortName: 'DIN',
        leagueId: 'LEAGUE_CRO',
        country: 'Croatia',
        stadiumName: 'Stadion Maksimir',
        stadiumAtmosphere: {
          crowdChantType: 'Bad Blue Boys Zagreb',
          weatherPreset: 'Floodlit Night',
          capacity: 35123,
        },
        primaryColor: '#003DA5',
        secondaryColor: '#FFFFFF',
        accentColor: '#003DA5',
        tactics: {
          formation: '4-3-3',
          style: 'Tiki-Taka',
          pressingIntensity: 81,
          defensiveLine: 73,
        },
        players: [
          makePlayer('DIN_1', 'Bruno Petković', 'CF', 30, 9, 'Croatia', { pace: 77, shooting: 85, passing: 83, dribbling: 84, defending: 45, physical: 88 }, 9.0),
          makePlayer('DIN_2', 'Martin Baturina', 'AMF', 21, 10, 'Croatia', { pace: 84, shooting: 81, passing: 87, dribbling: 88, defending: 52, physical: 76 }, 25.0),
        ],
      },
    ],
  },
  {
    id: 'LEAGUE_UKR',
    name: 'Ukrainian Premier League',
    region: 'Top-Flight European',
    country: 'Ukraine',
    licensingTier: 'Rest of World Added',
    teams: [
      {
        id: 'TEAM_SHAKHTAR',
        name: 'FC Shakhtar Donetsk',
        shortName: 'SHA',
        leagueId: 'LEAGUE_UKR',
        country: 'Ukraine',
        stadiumName: 'Donbas Arena (Relocated Arena Lviv)',
        stadiumAtmosphere: {
          crowdChantType: 'Miners Pride Donetsk',
          weatherPreset: 'Floodlit Night',
          capacity: 34915,
        },
        primaryColor: '#FF6600',
        secondaryColor: '#000000',
        accentColor: '#FF6600',
        tactics: {
          formation: '4-3-3',
          style: 'Fast Counter',
          pressingIntensity: 83,
          defensiveLine: 74,
        },
        players: [
          makePlayer('SHA_1', 'Georgiy Sudakov', 'AMF', 22, 10, 'Ukraine', { pace: 83, shooting: 82, passing: 87, dribbling: 87, defending: 55, physical: 77 }, 35.0),
          makePlayer('SHA_2', 'Danylo Sikan', 'CF', 23, 14, 'Ukraine', { pace: 82, shooting: 80, passing: 72, dribbling: 78, defending: 40, physical: 81 }, 10.0),
        ],
      },
    ],
  },

  // 3. Latin American Leagues
  {
    id: 'LEAGUE_BRA',
    name: 'Brazilian Serie A (Brasileirão)',
    region: 'Latin America',
    country: 'Brazil',
    licensingTier: 'Community Master', // Fully restored authentic rosters
    teams: [
      {
        id: 'TEAM_FLA',
        name: 'CR Flamengo',
        shortName: 'FLA',
        leagueId: 'LEAGUE_BRA',
        country: 'Brazil',
        stadiumName: 'Maracanã Stadium',
        stadiumAtmosphere: {
          crowdChantType: 'Nação Rubro-Negra 80k Samba',
          weatherPreset: 'Floodlit Night',
          capacity: 78838,
        },
        primaryColor: '#C8102E',
        secondaryColor: '#000000',
        accentColor: '#FFFFFF',
        tactics: {
          formation: '4-2-3-1',
          style: 'Tiki-Taka',
          pressingIntensity: 84,
          defensiveLine: 77,
        },
        players: [
          makePlayer('FLA_1', 'Agustín Rossi', 'GK', 29, 1, 'Argentina', { pace: 60, shooting: 18, passing: 70, dribbling: 55, defending: 72, physical: 83, gkReflexes: 84 }, 7.0),
          makePlayer('FLA_2', 'Léo Ortiz', 'CB', 28, 3, 'Brazil', { pace: 74, shooting: 48, passing: 78, dribbling: 70, defending: 85, physical: 84 }, 10.0),
          makePlayer('FLA_3', 'Giorgian de Arrascaeta', 'AMF', 30, 14, 'Uruguay', { pace: 81, shooting: 86, passing: 91, dribbling: 90, defending: 52, physical: 75 }, 18.0),
          makePlayer('FLA_4', 'Nicolás de la Cruz', 'CMF', 27, 18, 'Uruguay', { pace: 85, shooting: 83, passing: 86, dribbling: 87, defending: 76, physical: 84 }, 16.0),
          makePlayer('FLA_5', 'Pedro', 'CF', 27, 9, 'Brazil', { pace: 78, shooting: 90, passing: 76, dribbling: 83, defending: 42, physical: 86 }, 22.0),
          makePlayer('FLA_6', 'Gerson', 'CMF', 27, 8, 'Brazil', { pace: 82, shooting: 80, passing: 86, dribbling: 88, defending: 75, physical: 86 }, 15.0),
        ],
      },
      {
        id: 'TEAM_PAL',
        name: 'SE Palmeiras',
        shortName: 'PAL',
        leagueId: 'LEAGUE_BRA',
        country: 'Brazil',
        stadiumName: 'Allianz Parque',
        stadiumAtmosphere: {
          crowdChantType: 'Mancha Verde Roar',
          weatherPreset: 'Floodlit Night',
          capacity: 43713,
        },
        primaryColor: '#006437',
        secondaryColor: '#FFFFFF',
        accentColor: '#006437',
        tactics: {
          formation: '4-3-3',
          style: 'Gegenpress',
          pressingIntensity: 86,
          defensiveLine: 76,
        },
        players: [
          makePlayer('PAL_1', 'Weverton', 'GK', 36, 21, 'Brazil', { pace: 58, shooting: 20, passing: 72, dribbling: 52, defending: 72, physical: 82, gkReflexes: 85 }, 4.0),
          makePlayer('PAL_2', 'Gustavo Gómez', 'CB', 31, 15, 'Paraguay', { pace: 74, shooting: 60, passing: 72, dribbling: 65, defending: 88, physical: 89 }, 9.0),
          makePlayer('PAL_3', 'Raphael Veiga', 'AMF', 29, 23, 'Brazil', { pace: 80, shooting: 88, passing: 86, dribbling: 85, defending: 55, physical: 79 }, 17.0),
          makePlayer('PAL_4', 'Estêvão Willian (Messinho)', 'RWF', 17, 41, 'Brazil', { pace: 92, shooting: 82, passing: 84, dribbling: 93, defending: 40, physical: 68 }, 45.0),
          makePlayer('PAL_5', 'Richard Ríos', 'CMF', 24, 27, 'Colombia', { pace: 84, shooting: 78, passing: 82, dribbling: 85, defending: 78, physical: 85 }, 14.0),
        ],
      },
    ],
  },
  {
    id: 'LEAGUE_MEX',
    name: 'Mexican Liga MX',
    region: 'Latin America',
    country: 'Mexico',
    licensingTier: 'Community Master',
    teams: [
      {
        id: 'TEAM_AME',
        name: 'Club América',
        shortName: 'AME',
        leagueId: 'LEAGUE_MEX',
        country: 'Mexico',
        stadiumName: 'Estadio Azteca',
        stadiumAtmosphere: {
          crowdChantType: 'Aguilas Azteca Chorus',
          weatherPreset: 'Sunny Day',
          capacity: 87523,
        },
        primaryColor: '#FFFF99',
        secondaryColor: '#002B49',
        accentColor: '#C8102E',
        tactics: {
          formation: '4-2-3-1',
          style: 'Wing Play',
          pressingIntensity: 83,
          defensiveLine: 74,
        },
        players: [
          makePlayer('AME_1', 'Luis Malagón', 'GK', 27, 1, 'Mexico', { pace: 60, shooting: 15, passing: 70, dribbling: 50, defending: 70, physical: 80, gkReflexes: 84 }, 6.5),
          makePlayer('AME_2', 'Henry Martín', 'CF', 31, 21, 'Mexico', { pace: 81, shooting: 87, passing: 77, dribbling: 80, defending: 46, physical: 85 }, 6.0),
          makePlayer('AME_3', 'Álvaro Fidalgo', 'CMF', 27, 8, 'Spain', { pace: 80, shooting: 78, passing: 88, dribbling: 89, defending: 65, physical: 74 }, 9.0),
        ],
      },
    ],
  },

  // 4. Asian & Oceanian Leagues
  {
    id: 'LEAGUE_JPN',
    name: 'Japanese J1 League (Meiji Yasuda)',
    region: 'Asia & Oceania',
    country: 'Japan',
    licensingTier: 'Community Master',
    teams: [
      {
        id: 'TEAM_KOBE',
        name: 'Vissel Kobe',
        shortName: 'KOB',
        leagueId: 'LEAGUE_JPN',
        country: 'Japan',
        stadiumName: 'Noevir Stadium Kobe',
        stadiumAtmosphere: {
          crowdChantType: 'Kobe Port Taiko Drums',
          weatherPreset: 'Rainy Slick',
          capacity: 30132,
        },
        primaryColor: '#9B1B30',
        secondaryColor: '#FFFFFF',
        accentColor: '#000000',
        tactics: {
          formation: '4-3-3',
          style: 'Gegenpress',
          pressingIntensity: 85,
          defensiveLine: 75,
        },
        players: [
          makePlayer('KOB_1', 'Daiya Maekawa', 'GK', 30, 1, 'Japan', { pace: 60, shooting: 18, passing: 68, dribbling: 52, defending: 70, physical: 80, gkReflexes: 82 }, 2.0),
          makePlayer('KOB_2', 'Yuya Osako', 'CF', 34, 10, 'Japan', { pace: 78, shooting: 86, passing: 82, dribbling: 82, defending: 48, physical: 83 }, 3.5),
          makePlayer('KOB_3', 'Yoshinori Muto', 'RWF', 32, 11, 'Japan', { pace: 84, shooting: 82, passing: 78, dribbling: 83, defending: 55, physical: 81 }, 3.0),
          makePlayer('KOB_4', 'Hotaru Yamaguchi', 'DMF', 34, 5, 'Japan', { pace: 75, shooting: 72, passing: 81, dribbling: 77, defending: 83, physical: 84 }, 2.5),
        ],
      },
    ],
  },
  {
    id: 'LEAGUE_SAU',
    name: 'Roshn Saudi League',
    region: 'Asia & Oceania',
    country: 'Saudi Arabia',
    licensingTier: 'Full License',
    teams: [
      {
        id: 'TEAM_HILAL',
        name: 'Al Hilal SFC',
        shortName: 'HIL',
        leagueId: 'LEAGUE_SAU',
        country: 'Saudi Arabia',
        stadiumName: 'Kingdom Arena',
        stadiumAtmosphere: {
          crowdChantType: 'Blue Wave Riyadh Lights',
          weatherPreset: 'Floodlit Night',
          capacity: 30000,
        },
        primaryColor: '#003DA5',
        secondaryColor: '#FFFFFF',
        accentColor: '#00205B',
        tactics: {
          formation: '4-2-3-1',
          style: 'Fast Counter',
          pressingIntensity: 84,
          defensiveLine: 76,
        },
        players: [
          makePlayer('HIL_1', 'Yassine Bounou (Bono)', 'GK', 33, 37, 'Morocco', { pace: 64, shooting: 20, passing: 76, dribbling: 60, defending: 74, physical: 84, gkReflexes: 89 }, 10.0),
          makePlayer('HIL_2', 'Kalidou Koulibaly', 'CB', 33, 3, 'Senegal', { pace: 76, shooting: 45, passing: 75, dribbling: 68, defending: 88, physical: 90 }, 8.0),
          makePlayer('HIL_3', 'Rúben Neves', 'DMF', 27, 8, 'Portugal', { pace: 75, shooting: 84, passing: 89, dribbling: 82, defending: 82, physical: 83 }, 32.0),
          makePlayer('HIL_4', 'Sergej Milinković-Savić', 'CMF', 29, 22, 'Serbia', { pace: 78, shooting: 85, passing: 86, dribbling: 85, defending: 80, physical: 89 }, 30.0),
          makePlayer('HIL_5', 'Salem Al-Dawsari', 'LWF', 33, 29, 'Saudi Arabia', { pace: 88, shooting: 84, passing: 84, dribbling: 87, defending: 54, physical: 78 }, 7.5),
          makePlayer('HIL_6', 'Aleksandar Mitrović', 'CF', 30, 9, 'Serbia', { pace: 77, shooting: 89, passing: 74, dribbling: 78, defending: 46, physical: 92 }, 28.0),
          makePlayer('HIL_7', 'Malcom', 'RWF', 27, 77, 'Brazil', { pace: 87, shooting: 83, passing: 82, dribbling: 86, defending: 45, physical: 77 }, 28.0),
          makePlayer('HIL_8', 'João Cancelo', 'RB', 30, 20, 'Portugal', { pace: 86, shooting: 75, passing: 87, dribbling: 86, defending: 79, physical: 78 }, 20.0),
        ],
      },
      {
        id: 'TEAM_NASSR',
        name: 'Al Nassr FC',
        shortName: 'NAS',
        leagueId: 'LEAGUE_SAU',
        country: 'Saudi Arabia',
        stadiumName: 'Al-Awwal Park',
        stadiumAtmosphere: {
          crowdChantType: 'Al Awwal Yellow Knights Chants',
          weatherPreset: 'Floodlit Night',
          capacity: 25000,
        },
        primaryColor: '#FFD700',
        secondaryColor: '#002B7F',
        accentColor: '#FFD700',
        tactics: {
          formation: '4-2-3-1',
          style: 'Fast Counter',
          pressingIntensity: 81,
          defensiveLine: 74,
        },
        players: [
          makePlayer('NAS_1', 'Bento', 'GK', 25, 24, 'Brazil', { pace: 62, shooting: 15, passing: 72, dribbling: 55, defending: 70, physical: 82, gkReflexes: 85 }, 12.0),
          makePlayer('NAS_2', 'Aymeric Laporte', 'CB', 30, 27, 'Spain', { pace: 74, shooting: 55, passing: 83, dribbling: 72, defending: 87, physical: 85 }, 18.0),
          makePlayer('NAS_3', 'Marcelo Brozović', 'DMF', 31, 77, 'Croatia', { pace: 76, shooting: 78, passing: 88, dribbling: 83, defending: 83, physical: 87 }, 14.0),
          makePlayer('NAS_4', 'Otávio', 'AMF', 29, 25, 'Portugal', { pace: 84, shooting: 80, passing: 85, dribbling: 86, defending: 70, physical: 82 }, 22.0),
          makePlayer('NAS_5', 'Sadio Mané', 'LWF', 32, 10, 'Senegal', { pace: 89, shooting: 85, passing: 80, dribbling: 87, defending: 50, physical: 81 }, 15.0),
          makePlayer('NAS_6', 'Cristiano Ronaldo', 'CF', 41, 7, 'Portugal', { pace: 84, shooting: 93, passing: 79, dribbling: 83, defending: 38, physical: 86 }, 15.0),
        ],
      },
    ],
  },
  {
    id: 'LEAGUE_MLS',
    name: 'Major League Soccer (MLS)',
    region: 'Asia & Oceania',
    country: 'USA / Canada',
    licensingTier: 'Full License',
    teams: [
      {
        id: 'TEAM_MIA',
        name: 'Inter Miami CF',
        shortName: 'MIA',
        leagueId: 'LEAGUE_MLS',
        country: 'USA',
        stadiumName: 'Chase Stadium Fort Lauderdale',
        stadiumAtmosphere: {
          crowdChantType: 'La Familia Pink Smoke Samba',
          weatherPreset: 'Golden Hour',
          capacity: 21550,
        },
        primaryColor: '#F7B5CD',
        secondaryColor: '#231F20',
        accentColor: '#FFFFFF',
        tactics: {
          formation: '4-3-3',
          style: 'Tiki-Taka',
          pressingIntensity: 78,
          defensiveLine: 70,
        },
        players: [
          makePlayer('MIA_1', 'Drake Callender', 'GK', 27, 1, 'USA', { pace: 62, shooting: 20, passing: 70, dribbling: 52, defending: 69, physical: 81, gkReflexes: 81 }, 3.0),
          makePlayer('MIA_2', 'Sergio Busquets', 'DMF', 36, 5, 'Spain', { pace: 60, shooting: 65, passing: 91, dribbling: 84, defending: 83, physical: 78 }, 4.0),
          makePlayer('MIA_3', 'Jordi Alba', 'LB', 35, 18, 'Spain', { pace: 81, shooting: 72, passing: 86, dribbling: 83, defending: 77, physical: 75 }, 3.5),
          makePlayer('MIA_4', 'Lionel Messi', 'RWF', 39, 10, 'Argentina', { pace: 84, shooting: 94, passing: 96, dribbling: 95, defending: 36, physical: 73 }, 25.0),
          makePlayer('MIA_5', 'Luis Suárez', 'CF', 39, 9, 'Uruguay', { pace: 75, shooting: 91, passing: 83, dribbling: 82, defending: 44, physical: 80 }, 4.0),
        ],
      },
    ],
  },

  // 5. Fully Licensed European Top Tier
  {
    id: 'LEAGUE_EPL',
    name: 'Premier League',
    region: 'Fully Licensed Europe',
    country: 'England',
    licensingTier: 'Full License',
    teams: [
      {
        id: 'TEAM_MCI',
        name: 'Manchester City',
        shortName: 'MCI',
        leagueId: 'LEAGUE_EPL',
        country: 'England',
        stadiumName: 'Etihad Stadium',
        stadiumAtmosphere: {
          crowdChantType: 'Blue Moon Synth Roar',
          weatherPreset: 'Floodlit Night',
          capacity: 53400,
        },
        primaryColor: '#6CABDD',
        secondaryColor: '#1C2C5B',
        accentColor: '#FFFFFF',
        tactics: {
          formation: '4-3-3',
          style: 'Tiki-Taka',
          pressingIntensity: 90,
          defensiveLine: 82,
        },
        players: [
          makePlayer('MCI_1', 'Ederson', 'GK', 31, 31, 'Brazil', { pace: 68, shooting: 30, passing: 88, dribbling: 74, defending: 72, physical: 84, gkReflexes: 89 }, 35.0),
          makePlayer('MCI_2', 'Rúben Dias', 'CB', 27, 3, 'Portugal', { pace: 78, shooting: 45, passing: 80, dribbling: 72, defending: 91, physical: 89 }, 75.0),
          makePlayer('MCI_3', 'Rodri (Ballon d\'Or)', 'DMF', 28, 16, 'Spain', { pace: 77, shooting: 84, passing: 92, dribbling: 86, defending: 92, physical: 91 }, 120.0),
          makePlayer('MCI_4', 'Kevin De Bruyne', 'AMF', 33, 17, 'Belgium', { pace: 78, shooting: 88, passing: 96, dribbling: 88, defending: 64, physical: 80 }, 45.0),
          makePlayer('MCI_5', 'Erling Haaland', 'CF', 24, 9, 'Norway', { pace: 93, shooting: 95, passing: 74, dribbling: 82, defending: 45, physical: 94 }, 180.0),
          makePlayer('MCI_6', 'Phil Foden', 'RWF', 24, 47, 'England', { pace: 89, shooting: 87, passing: 88, dribbling: 91, defending: 55, physical: 76 }, 140.0),
        ],
      },
      {
        id: 'TEAM_RMA',
        name: 'Real Madrid CF',
        shortName: 'RMA',
        leagueId: 'LEAGUE_EPL',
        country: 'Spain',
        stadiumName: 'Santiago Bernabéu',
        stadiumAtmosphere: {
          crowdChantType: 'Hala Madrid y Nada Más',
          weatherPreset: 'Floodlit Night',
          capacity: 81044,
        },
        primaryColor: '#FFFFFF',
        secondaryColor: '#002F6C',
        accentColor: '#EAA900',
        tactics: {
          formation: '4-3-3',
          style: 'Fast Counter',
          pressingIntensity: 88,
          defensiveLine: 80,
        },
        players: [
          makePlayer('RMA_1', 'Thibaut Courtois', 'GK', 32, 1, 'Belgium', { pace: 60, shooting: 20, passing: 75, dribbling: 60, defending: 75, physical: 88, gkReflexes: 91 }, 30.0),
          makePlayer('RMA_2', 'Antonio Rüdiger', 'CB', 31, 22, 'Germany', { pace: 86, shooting: 52, passing: 76, dribbling: 70, defending: 90, physical: 91 }, 25.0),
          makePlayer('RMA_3', 'Jude Bellingham', 'AMF', 21, 5, 'England', { pace: 86, shooting: 89, passing: 89, dribbling: 90, defending: 81, physical: 88 }, 160.0),
          makePlayer('RMA_4', 'Vinícius Júnior', 'LWF', 24, 7, 'Brazil', { pace: 96, shooting: 89, passing: 84, dribbling: 95, defending: 42, physical: 80 }, 180.0),
          makePlayer('RMA_5', 'Kylian Mbappé', 'CF', 25, 9, 'France', { pace: 97, shooting: 94, passing: 83, dribbling: 94, defending: 40, physical: 82 }, 180.0),
          makePlayer('RMA_6', 'Federico Valverde', 'CMF', 26, 8, 'Uruguay', { pace: 90, shooting: 87, passing: 86, dribbling: 85, defending: 83, physical: 92 }, 120.0),
        ],
      },
    ],
  },
];
