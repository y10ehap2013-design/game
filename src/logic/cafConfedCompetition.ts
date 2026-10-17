/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CAFConfedClub, CAFConfedPairing } from '../data/cafConfedTeams.ts';
import { CAF_CONFED_CLUBS } from '../data/cafConfedTeams.ts';

export interface CAFConfedMatchResult {
  homeGoals: number;
  awayGoals: number;
  scorers: { team: 'home' | 'away'; player: string; minute: number }[];
}

/**
 * Simulate single match between two CAF Confederation Cup clubs
 */
export function simulateCAFConfedMatch(
  home: CAFConfedClub,
  away: CAFConfedClub,
  randomSeed = Math.random()
): CAFConfedMatchResult {
  const homeAdvantage = 4;
  const ratingDiff = (home.rating + homeAdvantage) - away.rating;

  // Expected goals base
  let expectedHome = 1.35 + ratingDiff * 0.08;
  let expectedAway = 0.95 - ratingDiff * 0.06;

  expectedHome = Math.max(0.4, Math.min(4.5, expectedHome));
  expectedAway = Math.max(0.2, Math.min(3.5, expectedAway));

  const pseudoRandom1 = (randomSeed * 9301 + 49297) % 233280 / 233280;
  const pseudoRandom2 = ((randomSeed + 0.37) * 9301 + 49297) % 233280 / 233280;

  const homeGoals = Math.max(0, Math.round(expectedHome + (pseudoRandom1 - 0.5) * 2.2));
  const awayGoals = Math.max(0, Math.round(expectedAway + (pseudoRandom2 - 0.5) * 1.8));

  const scorers: { team: 'home' | 'away'; player: string; minute: number }[] = [];

  for (let i = 0; i < homeGoals; i++) {
    const player = home.keyPlayers[i % home.keyPlayers.length] || 'Striker';
    const minute = Math.floor(10 + (80 / (homeGoals + 1)) * (i + 1) + (pseudoRandom1 * 5));
    scorers.push({ team: 'home', player, minute: Math.min(90, minute) });
  }

  for (let i = 0; i < awayGoals; i++) {
    const player = away.keyPlayers[i % away.keyPlayers.length] || 'Forward';
    const minute = Math.floor(15 + (75 / (awayGoals + 1)) * (i + 1) + (pseudoRandom2 * 5));
    scorers.push({ team: 'away', player, minute: Math.min(90, minute) });
  }

  return { homeGoals, awayGoals, scorers };
}

/**
 * Simulate a 2-legged tie between Team A and Team B
 */
export function simulateCAFConfedTie(
  pairing: CAFConfedPairing,
  randomSeed = Math.random()
): CAFConfedPairing {
  // Leg 1: Team A vs Team B
  const leg1 = simulateCAFConfedMatch(pairing.teamA, pairing.teamB, randomSeed);
  // Leg 2: Team B hosts Team A
  const leg2 = simulateCAFConfedMatch(pairing.teamB, pairing.teamA, (randomSeed + 0.5) % 1);

  // In Leg 2, Team B is host (leg2Home) and Team A is visitor (leg2Away)
  const l1A = leg1.homeGoals;
  const l1B = leg1.awayGoals;
  const l2B = leg2.homeGoals;
  const l2A = leg2.awayGoals;

  let aggA = l1A + l2A;
  let aggB = l1B + l2B;

  let winnerId: string;
  if (aggA > aggB) {
    winnerId = pairing.teamA.id;
  } else if (aggB > aggA) {
    winnerId = pairing.teamB.id;
  } else {
    // Away goals tie-breaker or penalty shootout
    const awayA = l2A;
    const awayB = l1B;
    if (awayA > awayB) {
      winnerId = pairing.teamA.id;
    } else if (awayB > awayA) {
      winnerId = pairing.teamB.id;
    } else {
      // Penalty shootout deciding tie: higher rated team or seed favored
      winnerId = pairing.teamA.rating >= pairing.teamB.rating ? pairing.teamA.id : pairing.teamB.id;
      if (winnerId === pairing.teamA.id) aggA += 1; // Mark penalty victory
      else aggB += 1;
    }
  }

  return {
    ...pairing,
    leg1HomeScore: l1A,
    leg1AwayScore: l1B,
    leg2HomeScore: l2B,
    leg2AwayScore: l2A,
    aggScoreTeamA: aggA,
    aggScoreTeamB: aggB,
    isCompleted: true,
    winnerId,
  };
}

/**
 * Simulate all 16 ties
 */
export function simulateAllCAFConfedTies(
  pairings: CAFConfedPairing[],
  randomSeed = Math.random()
): CAFConfedPairing[] {
  return pairings.map((p, idx) => simulateCAFConfedTie(p, (randomSeed + idx * 0.061) % 1));
}

/**
 * Extract qualified winners from 16 ties
 */
export function getQualifiedConfedWinners(pairings: CAFConfedPairing[]): CAFConfedClub[] {
  return pairings.map((p) => {
    return p.winnerId === p.teamA.id ? p.teamA : p.teamB;
  });
}

/**
 * Sort group stage table by points, goal diff, goals for, rating
 */
export function sortConfedGroupClubs(clubs: CAFConfedClub[]): CAFConfedClub[] {
  return [...clubs].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return b.rating - a.rating;
  });
}

/**
 * Filter clubs by search term and country
 */
export function filterCAFConfedClubs(
  clubs: CAFConfedClub[],
  query: string,
  country: string
): CAFConfedClub[] {
  const q = query.trim().toLowerCase();
  return clubs.filter((club) => {
    const matchesCountry = country === 'ALL' || club.country.toLowerCase() === country.toLowerCase();
    const matchesQuery =
      !q ||
      club.name.toLowerCase().includes(q) ||
      club.shortName.toLowerCase().includes(q) ||
      club.country.toLowerCase().includes(q) ||
      club.keyPlayers.some((p) => p.toLowerCase().includes(q)) ||
      club.manager.toLowerCase().includes(q) ||
      club.stadium.toLowerCase().includes(q);

    return matchesCountry && matchesQuery;
  });
}
