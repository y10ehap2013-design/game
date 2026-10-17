import test from 'node:test';
import assert from 'node:assert/strict';
import { CAF_CLUBS, generateDefaultCAFPairings, generateDefaultCAFGroupStage } from '../data/cafTeams.ts';
import {
  simulateCAFMatch,
  simulateCAFTie,
  getQualifiedWinners,
  sortGroupClubs,
  filterCAFClubs,
} from './cafCompetition.ts';

test('CAF Champions League 2026/27 contains exactly 32 participating clubs as specified', () => {
  assert.equal(CAF_CLUBS.length, 32, 'CAF Round 2 must contain exactly 32 clubs');

  // Verify all 32 clubs requested are present
  const requiredClubs = [
    'Zamalek',
    'APR',
    'Pyramids',
    'Al Merreikh FC (Bentiu)',
    'Espérance de Tunis',
    'Asswehly',
    'TP Mazembe',
    'Club Africain',
    'MC Alger',
    'Rangers International',
    'RS Berkane',
    'Star Sport Academy',
    'Al-Hilal',
    'Sidama Coffee',
    'Horoya',
    'Al Merrikh SC (Omdurman)',
    'Mamelodi Sundowns',
    'Wiliete',
    'Orlando Pirates',
    'African Stars',
    'Young Africans',
    'CFF Andoharanofotsy',
    'Simba',
    'FC 15 de Agosto de Akonibe',
    'ASEC Mimosas',
    'Maghreb de Fès',
    'FC San-Pédro',
    'FC Nouadhibou',
    'Atlético Petróleos de Luanda',
    'Scottland',
    'Teungueth',
    'Colombe Sportive',
  ];

  requiredClubs.forEach((reqName) => {
    const found = CAF_CLUBS.some((c) => c.name.toLowerCase().includes(reqName.toLowerCase()));
    assert.ok(found, `Club "${reqName}" must be present in CAF_CLUBS`);
  });

  // Unique IDs check
  const ids = new Set(CAF_CLUBS.map((c) => c.id));
  assert.equal(ids.size, 32, 'All 32 club IDs must be unique');
});

test('generateDefaultCAFPairings contains all 16 official head-to-head pairings', () => {
  const pairings = generateDefaultCAFPairings();
  assert.equal(pairings.length, 16, 'Must generate exactly 16 pairings');

  // Verify specific pairings
  const pair1 = pairings[0];
  assert.equal(pair1.homeTeam.name, 'Zamalek SC');
  assert.equal(pair1.awayTeam.name, 'APR F.C.');

  const pair2 = pairings[1];
  assert.equal(pair2.homeTeam.name, 'Pyramids FC');
  assert.equal(pair2.awayTeam.name, 'Al Merreikh FC (Bentiu)');

  const pair9 = pairings[8];
  assert.equal(pair9.homeTeam.name, 'Mamelodi Sundowns F.C.');
  assert.equal(pair9.awayTeam.name, 'Wiliete S.C.');
});

test('simulateCAFTie calculates aggregate scores across Leg 1 and Leg 2 and sets winner', () => {
  const pairings = generateDefaultCAFPairings();
  const testPair = pairings[0];
  const simulated = simulateCAFTie(testPair, 0.42);

  assert.ok(simulated.isCompleted);
  assert.equal(typeof simulated.aggHomeScore, 'number');
  assert.equal(typeof simulated.aggAwayScore, 'number');
  assert.ok(simulated.winnerId === simulated.homeTeam.id || simulated.winnerId === simulated.awayTeam.id);
});

test('getQualifiedWinners returns exactly 16 aggregate winners for the Group Stage', () => {
  const pairings = generateDefaultCAFPairings();
  const winners = getQualifiedWinners(pairings);
  assert.equal(winners.length, 16, 'Exactly 16 teams qualify for the Group Stage');
});

test('generateDefaultCAFGroupStage partitions the 16 qualified teams into 4 groups of 4', () => {
  const pairings = generateDefaultCAFPairings();
  const groups = generateDefaultCAFGroupStage(pairings);
  assert.equal(groups.length, 4, 'Must have 4 groups (A, B, C, D)');
  groups.forEach((g) => {
    assert.equal(g.clubs.length, 4, `Group ${g.name} must have 4 teams`);
  });
});

test('sortGroupClubs ranks clubs by points and goal difference', () => {
  const sample = [
    { ...CAF_CLUBS[0], id: 'C1', points: 3, goalDiff: 1, goalsFor: 2 },
    { ...CAF_CLUBS[1], id: 'C2', points: 6, goalDiff: 4, goalsFor: 5 },
    { ...CAF_CLUBS[2], id: 'C3', points: 3, goalDiff: 2, goalsFor: 3 },
  ];
  const sorted = sortGroupClubs(sample);
  assert.equal(sorted[0].id, 'C2');
  assert.equal(sorted[1].id, 'C3');
  assert.equal(sorted[2].id, 'C1');
});

test('filterCAFClubs filters by query and country', () => {
  const egyptian = filterCAFClubs(CAF_CLUBS, '', 'Egypt');
  assert.equal(egyptian.length, 2, 'Should find Zamalek and Pyramids');

  const zamalek = filterCAFClubs(CAF_CLUBS, 'Zizo');
  assert.equal(zamalek.length, 1);
  assert.equal(zamalek[0].name, 'Zamalek SC');
});
