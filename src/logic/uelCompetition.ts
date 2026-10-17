/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { UELClub } from '../data/uelTeams.ts';
import { UEL_CLUBS } from '../data/uelTeams.ts';

export type UELQualificationStatus = 'TOP_8' | 'PLAYOFF' | 'ELIMINATED';

/**
 * Returns UEFA Europa League qualification tier:
 * 1..8: Direct Round of 16 (Top 8)
 * 9..24: Knockout Play-off round
 * 25..36: Eliminated from Europe
 */
export function getUELQualificationStatus(position: number): UELQualificationStatus {
  if (position >= 1 && position <= 8) return 'TOP_8';
  if (position >= 9 && position <= 24) return 'PLAYOFF';
  return 'ELIMINATED';
}

/**
 * Pure function: Sorts UEL league table according to official UEFA criteria:
 * 1. Points (Desc)
 * 2. Goal Difference (Desc)
 * 3. Goals For (Desc)
 * 4. Club Overall Rating (Desc)
 * 5. Name (Asc)
 */
export function sortUELTable(clubs: UELClub[]): UELClub[] {
  return [...clubs].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    if (b.rating !== a.rating) return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Simulates a realistic European fixture between two clubs based on team attack/defense ratings
 */
export function simulateUELMatch(
  home: UELClub,
  away: UELClub,
  seedRandom: number = Math.random()
): { homeGoals: number; awayGoals: number; scorer: string } {
  // Home advantage factor (+2 rating)
  const homeEffective = home.attackRating + 2 - away.defenseRating;
  const awayEffective = away.attackRating - (home.defenseRating + 2);

  const homeBase = Math.max(0, Math.floor((homeEffective + 10) / 7 + seedRandom * 2));
  const awayBase = Math.max(0, Math.floor((awayEffective + 10) / 7 + ((seedRandom * 13) % 1) * 2));

  const homeGoals = Math.min(6, Math.max(0, homeBase));
  const awayGoals = Math.min(5, Math.max(0, awayBase));

  const scorerPool = homeGoals >= awayGoals ? home.keyPlayers : away.keyPlayers;
  const scorer = scorerPool[Math.floor((seedRandom * 7) % scorerPool.length)] || 'Star Striker';

  return { homeGoals, awayGoals, scorer };
}

/**
 * Pure function: applies match result to table and recalculates stats
 */
export function applyMatchResult(
  clubs: UELClub[],
  homeId: string,
  awayId: string,
  homeGoals: number,
  awayGoals: number
): UELClub[] {
  const updated = clubs.map((club) => {
    if (club.id === homeId) {
      const won = homeGoals > awayGoals ? 1 : 0;
      const drawn = homeGoals === awayGoals ? 1 : 0;
      const lost = homeGoals < awayGoals ? 1 : 0;
      const pts = won * 3 + drawn;
      return {
        ...club,
        matchesPlayed: club.matchesPlayed + 1,
        won: club.won + won,
        drawn: club.drawn + drawn,
        lost: club.lost + lost,
        goalsFor: club.goalsFor + homeGoals,
        goalsAgainst: club.goalsAgainst + awayGoals,
        goalDiff: club.goalDiff + (homeGoals - awayGoals),
        points: club.points + pts,
      };
    }
    if (club.id === awayId) {
      const won = awayGoals > homeGoals ? 1 : 0;
      const drawn = homeGoals === awayGoals ? 1 : 0;
      const lost = awayGoals < homeGoals ? 1 : 0;
      const pts = won * 3 + drawn;
      return {
        ...club,
        matchesPlayed: club.matchesPlayed + 1,
        won: club.won + won,
        drawn: club.drawn + drawn,
        lost: club.lost + lost,
        goalsFor: club.goalsFor + awayGoals,
        goalsAgainst: club.goalsAgainst + homeGoals,
        goalDiff: club.goalDiff + (awayGoals - homeGoals),
        points: club.points + pts,
      };
    }
    return club;
  });

  return sortUELTable(updated);
}

/**
 * Simulates a full matchday round of 18 fixtures for all 36 clubs
 */
export function simulateFullMatchdayRound(clubs: UELClub[]): {
  updatedClubs: UELClub[];
  roundResults: Array<{
    home: UELClub;
    away: UELClub;
    homeGoals: number;
    awayGoals: number;
    scorer: string;
  }>;
} {
  let workingClubs = [...clubs];
  const roundResults: Array<{
    home: UELClub;
    away: UELClub;
    homeGoals: number;
    awayGoals: number;
    scorer: string;
  }> = [];

  // Pair adjacent teams
  for (let i = 0; i < workingClubs.length - 1; i += 2) {
    const home = workingClubs[i];
    const away = workingClubs[i + 1];
    const sim = simulateUELMatch(home, away, Math.random());
    roundResults.push({
      home,
      away,
      homeGoals: sim.homeGoals,
      awayGoals: sim.awayGoals,
      scorer: sim.scorer,
    });
    workingClubs = applyMatchResult(workingClubs, home.id, away.id, sim.homeGoals, sim.awayGoals);
  }

  return {
    updatedClubs: workingClubs,
    roundResults,
  };
}

/**
 * Filter clubs by country or query
 */
export function filterUELClubs(
  clubs: UELClub[],
  query: string,
  selectedCountry: string = 'ALL'
): UELClub[] {
  return clubs.filter((club) => {
    const matchQuery =
      query.trim() === '' ||
      club.name.toLowerCase().includes(query.toLowerCase()) ||
      club.shortName.toLowerCase().includes(query.toLowerCase()) ||
      club.keyPlayers.some((p) => p.toLowerCase().includes(query.toLowerCase()));
    const matchCountry = selectedCountry === 'ALL' || club.country === selectedCountry;
    return matchQuery && matchCountry;
  });
}
