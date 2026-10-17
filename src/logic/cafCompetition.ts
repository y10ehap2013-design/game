/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CAFClub, CAFRound2Pairing } from '../data/cafTeams.ts';
import { CAF_CLUBS } from '../data/cafTeams.ts';

/**
 * Simulates a realistic African Champions League match between two clubs
 */
export function simulateCAFMatch(
  home: CAFClub,
  away: CAFClub,
  seedRandom: number = Math.random()
): { homeGoals: number; awayGoals: number; scorer: string } {
  // African home ground advantage factor (+3 rating in CAF atmosphere)
  const homeEffective = home.attackRating + 3 - away.defenseRating;
  const awayEffective = away.attackRating - (home.defenseRating + 3);

  const homeBase = Math.max(0, Math.floor((homeEffective + 10) / 7 + seedRandom * 2));
  const awayBase = Math.max(0, Math.floor((awayEffective + 10) / 7 + ((seedRandom * 11) % 1) * 2));

  const homeGoals = Math.min(6, Math.max(0, homeBase));
  const awayGoals = Math.min(5, Math.max(0, awayBase));

  const scorerPool = homeGoals >= awayGoals ? home.keyPlayers : away.keyPlayers;
  const scorer = scorerPool[Math.floor((seedRandom * 7) % scorerPool.length)] || 'Striker';

  return { homeGoals, awayGoals, scorer };
}

/**
 * Simulates a 2-legged CAF Champions League Round 2 tie with aggregate scoring
 */
export function simulateCAFTie(
  pairing: CAFRound2Pairing,
  seedRandom: number = Math.random()
): CAFRound2Pairing {
  // Leg 1: homeTeam hosts awayTeam
  const leg1 = simulateCAFMatch(pairing.homeTeam, pairing.awayTeam, seedRandom);

  // Leg 2: awayTeam hosts homeTeam
  const leg2 = simulateCAFMatch(pairing.awayTeam, pairing.homeTeam, (seedRandom * 1.618) % 1);

  const aggHome = leg1.homeGoals + leg2.awayGoals; // homeTeam total goals
  const aggAway = leg1.awayGoals + leg2.homeGoals; // awayTeam total goals

  let winnerId: string;
  if (aggHome > aggAway) {
    winnerId = pairing.homeTeam.id;
  } else if (aggAway > aggHome) {
    winnerId = pairing.awayTeam.id;
  } else {
    // Away goals rule or penalty shootout tie-breaker
    const awayGoalsHomeTeam = leg2.awayGoals;
    const awayGoalsAwayTeam = leg1.awayGoals;
    if (awayGoalsHomeTeam > awayGoalsAwayTeam) {
      winnerId = pairing.homeTeam.id;
    } else if (awayGoalsAwayTeam > awayGoalsHomeTeam) {
      winnerId = pairing.awayTeam.id;
    } else {
      // Penalty shootout winner based on higher team rating
      winnerId = pairing.homeTeam.rating >= pairing.awayTeam.rating ? pairing.homeTeam.id : pairing.awayTeam.id;
    }
  }

  return {
    ...pairing,
    leg1HomeScore: leg1.homeGoals,
    leg1AwayScore: leg1.awayGoals,
    leg2HomeScore: leg2.homeGoals,
    leg2AwayScore: leg2.awayGoals,
    aggHomeScore: aggHome,
    aggAwayScore: aggAway,
    isCompleted: true,
    winnerId,
  };
}

/**
 * Returns the 16 qualified clubs from the 16 Round 2 ties
 */
export function getQualifiedWinners(pairings: CAFRound2Pairing[]): CAFClub[] {
  return pairings.map((p) => {
    return p.winnerId === p.awayTeam.id ? p.awayTeam : p.homeTeam;
  });
}

/**
 * Sorts group clubs by CAF official tie-break: Points > GD > GF > Rating > Name
 */
export function sortGroupClubs(clubs: CAFClub[]): CAFClub[] {
  return [...clubs].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    if (b.rating !== a.rating) return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Filter CAF clubs by name, stars, or country
 */
export function filterCAFClubs(
  clubs: CAFClub[],
  query: string,
  selectedCountry: string = 'ALL'
): CAFClub[] {
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
