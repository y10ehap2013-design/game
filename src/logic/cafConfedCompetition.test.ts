import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CAF_CONFED_CLUBS,
  generateDefaultCAFConfedPairings,
  generateDefaultCAFConfedGroupStage,
} from '../data/cafConfedTeams.ts';
import {
  simulateCAFConfedMatch,
  simulateCAFConfedTie,
  simulateAllCAFConfedTies,
  getQualifiedConfedWinners,
  sortConfedGroupClubs,
  filterCAFConfedClubs,
} from './cafConfedCompetition.ts';

test('CAF Confederation Cup contains exactly 32 clubs across 16 pairings', () => {
  assert.equal(CAF_CONFED_CLUBS.length, 32);

  // Check key clubs requested by user
  const clubNames = CAF_CONFED_CLUBS.map((c) => c.name);
  assert.ok(clubNames.includes('Al Ahly SC (Cairo)'));
  assert.ok(clubNames.includes('Kitara FC'));
  assert.ok(clubNames.includes('ZED FC'));
  assert.ok(clubNames.includes('Azam F.C.'));
  assert.ok(clubNames.includes('Al Ahli SC (Tripoli)'));
  assert.ok(clubNames.includes('Welwalo Adigrat'));
  assert.ok(clubNames.includes('USM Alger'));
  assert.ok(clubNames.includes('The Panthers FC'));
  assert.ok(clubNames.includes('CR Belouizdad'));
  assert.ok(clubNames.includes('AS Douanes'));
  assert.ok(clubNames.includes('Raja Club Athletic'));
  assert.ok(clubNames.includes('El-Kanemi Warriors'));
  assert.ok(clubNames.includes('AS FAR'));
  assert.ok(clubNames.includes('CO Korhogo'));
  assert.ok(clubNames.includes('CS Sfaxien'));
  assert.ok(clubNames.includes('AFAD Plateau'));
  assert.ok(clubNames.includes('ES Zarzis'));
  assert.ok(clubNames.includes('AS Real Bamako'));
  assert.ok(clubNames.includes('Kaizer Chiefs F.C.'));
  assert.ok(clubNames.includes('Red Arrows F.C.'));
  assert.ok(clubNames.includes('Durban City FC'));
  assert.ok(clubNames.includes('AS Port-Louis 2000'));
  assert.ok(clubNames.includes('Rayon Sports F.C.'));
  assert.ok(clubNames.includes('Associação Black Bulls'));
  assert.ok(clubNames.includes('Singida Black Stars'));
  assert.ok(clubNames.includes('Tusker F.C.'));
  assert.ok(clubNames.includes('C.D. Primeiro de Agosto'));
  assert.ok(clubNames.includes('DC Virunga'));
  assert.ok(clubNames.includes('AS Maniema Union'));
  assert.ok(clubNames.includes('Kabuscorp S.C.P.'));
  assert.ok(clubNames.includes('FC Diarra'));
  assert.ok(clubNames.includes('ASKO Kara'));
});

test('generateDefaultCAFConfedPairings creates all 16 specified matchups with initial first-leg statuses', () => {
  const pairings = generateDefaultCAFConfedPairings();
  assert.equal(pairings.length, 16);

  // Check pairing 1: Al Ahly SC (Cairo) vs Kitara FC (Kitara 1-2 Al Ahly SC)
  assert.equal(pairings[0].teamA.name, 'Al Ahly SC (Cairo)');
  assert.equal(pairings[0].teamB.name, 'Kitara FC');
  assert.equal(pairings[0].firstLegStatus, 'Kitara 1–2 Al Ahly SC');

  // Check pairing 2: ZED FC vs Azam F.C. (ZED 1-1 Azam)
  assert.equal(pairings[1].teamA.name, 'ZED FC');
  assert.equal(pairings[1].teamB.name, 'Azam F.C.');
  assert.equal(pairings[1].firstLegStatus, 'ZED 1–1 Azam');

  // Check pairing 3: Al Ahli SC (Tripoli) vs Welwalo Adigrat (Welwalo 0-4 Al Ahli)
  assert.equal(pairings[2].teamA.name, 'Al Ahli SC (Tripoli)');
  assert.equal(pairings[2].teamB.name, 'Welwalo Adigrat');
  assert.equal(pairings[2].firstLegStatus, 'Welwalo 0–4 Al Ahli');

  // Check pairing 10: Kaizer Chiefs F.C. vs Red Arrows F.C. (Red Arrows 1-0 Kaizer Chiefs)
  assert.equal(pairings[9].teamA.name, 'Kaizer Chiefs F.C.');
  assert.equal(pairings[9].teamB.name, 'Red Arrows F.C.');
  assert.equal(pairings[9].firstLegStatus, 'Red Arrows 1–0 Kaizer Chiefs');
});

test('generateDefaultCAFConfedGroupStage builds 4 groups of 4 from 16 qualified aggregate winners', () => {
  const pairings = generateDefaultCAFConfedPairings();
  const groups = generateDefaultCAFConfedGroupStage(pairings);

  assert.equal(groups.length, 4);
  assert.equal(groups[0].name, 'Group A');
  assert.equal(groups[0].clubs.length, 4);
  assert.equal(groups[1].clubs.length, 4);
  assert.equal(groups[2].clubs.length, 4);
  assert.equal(groups[3].clubs.length, 4);

  // Group A should contain winners like Al Ahly SC
  const groupAIds = groups[0].clubs.map((c) => c.id);
  assert.ok(groupAIds.includes('CC_AHL'));
});

test('simulateCAFConfedTie simulates 2-legged tie and produces valid aggregate score and winner', () => {
  const pairings = generateDefaultCAFConfedPairings();
  const simulated = simulateCAFConfedTie(pairings[0], 0.42);

  assert.ok(simulated.isCompleted);
  assert.ok(typeof simulated.aggScoreTeamA === 'number');
  assert.ok(typeof simulated.aggScoreTeamB === 'number');
  assert.ok(simulated.winnerId === simulated.teamA.id || simulated.winnerId === simulated.teamB.id);
});

test('simulateAllCAFConfedTies updates all 16 pairings with winners', () => {
  const pairings = generateDefaultCAFConfedPairings();
  const updated = simulateAllCAFConfedTies(pairings, 0.77);

  assert.equal(updated.length, 16);
  updated.forEach((p) => {
    assert.ok(p.isCompleted);
    assert.ok(p.winnerId);
  });
});

test('sortConfedGroupClubs correctly ranks teams by points and goal difference', () => {
  const clubs = [
    { ...CAF_CONFED_CLUBS[0], points: 3, goalDiff: 1 },
    { ...CAF_CONFED_CLUBS[1], points: 6, goalDiff: 4 },
    { ...CAF_CONFED_CLUBS[2], points: 3, goalDiff: 2 },
  ];
  const sorted = sortConfedGroupClubs(clubs);
  assert.equal(sorted[0].points, 6);
  assert.equal(sorted[1].goalDiff, 2);
  assert.equal(sorted[2].goalDiff, 1);
});

test('filterCAFConfedClubs filters by query and country', () => {
  const cairoClubs = filterCAFConfedClubs(CAF_CONFED_CLUBS, 'Cairo', 'ALL');
  assert.ok(cairoClubs.some((c) => c.name.includes('Cairo')));

  const egyptClubs = filterCAFConfedClubs(CAF_CONFED_CLUBS, '', 'Egypt');
  assert.equal(egyptClubs.length, 2); // Al Ahly and ZED FC
  assert.ok(egyptClubs.every((c) => c.country === 'Egypt'));
});
