import test from 'node:test';
import assert from 'node:assert/strict';
import { UEL_CLUBS } from '../data/uelTeams.ts';
import {
  getUELQualificationStatus,
  sortUELTable,
  simulateUELMatch,
  applyMatchResult,
  simulateFullMatchdayRound,
  filterUELClubs,
} from './uelCompetition.ts';

test('UEL 2026/27 contains exactly 36 participating clubs as specified', () => {
  assert.equal(UEL_CLUBS.length, 36, 'Europa League phase must contain exactly 36 clubs');

  // Verify all 36 requested clubs are present
  const requiredClubNames = [
    'Anderlecht',
    'Ararat-Armenia',
    'AZ Alkmaar',
    'Bayer Leverkusen',
    'Benfica',
    'Beşiktaş',
    'Bournemouth',
    'Celje',
    'Celta Vigo',
    'Celtic',
    'Crystal Palace',
    'Ferencváros',
    'GNK Dinamo',
    'Hapoel Beer-Sheva',
    'Hoffenheim',
    'Jagiellonia Białystok',
    'Juventus',
    'Lech Poznań',
    'Levski Sofia',
    'Lillestrøm',
    'Lyon',
    'Marseille',
    'Milan',
    'N.E.C. Nijmegen',
    'OFI Crete',
    'Olympiacos',
    'Omonia Nicosia',
    'Real Sociedad',
    'Rennes',
    'Salzburg',
    'Sparta Praha',
    'Sturm Graz',
    'Sunderland',
    'Torreense',
    'Union SG',
    'Viktoria Plzeň',
  ];

  requiredClubNames.forEach((reqName) => {
    const found = UEL_CLUBS.some((c) => c.name.toLowerCase().includes(reqName.toLowerCase()));
    assert.ok(found, `Club "${reqName}" must be present in UEL_CLUBS`);
  });

  // Unique IDs check
  const ids = new Set(UEL_CLUBS.map((c) => c.id));
  assert.equal(ids.size, 36, 'All 36 club IDs must be unique');
});

test('getUELQualificationStatus maps positions to official UEFA Europa League phase tiers', () => {
  assert.equal(getUELQualificationStatus(1), 'TOP_8');
  assert.equal(getUELQualificationStatus(8), 'TOP_8');
  assert.equal(getUELQualificationStatus(9), 'PLAYOFF');
  assert.equal(getUELQualificationStatus(24), 'PLAYOFF');
  assert.equal(getUELQualificationStatus(25), 'ELIMINATED');
  assert.equal(getUELQualificationStatus(36), 'ELIMINATED');
});

test('sortUELTable ranks clubs by points, goal difference, and goals scored', () => {
  const sample = [
    { ...UEL_CLUBS[0], id: 'T1', points: 12, goalDiff: 5, goalsFor: 10 },
    { ...UEL_CLUBS[1], id: 'T2', points: 15, goalDiff: 4, goalsFor: 11 },
    { ...UEL_CLUBS[2], id: 'T3', points: 12, goalDiff: 7, goalsFor: 9 },
  ];
  const sorted = sortUELTable(sample);
  assert.equal(sorted[0].id, 'T2', 'T2 with 15 points should be 1st');
  assert.equal(sorted[1].id, 'T3', 'T3 with +7 GD should be 2nd ahead of T1 with +5 GD');
  assert.equal(sorted[2].id, 'T1', 'T1 should be 3rd');
});

test('applyMatchResult updates win, points, goals, and goal difference correctly', () => {
  const initial = [
    { ...UEL_CLUBS[0], id: 'H1', points: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, matchesPlayed: 0 },
    { ...UEL_CLUBS[1], id: 'A1', points: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, matchesPlayed: 0 },
  ];

  const updated = applyMatchResult(initial, 'H1', 'A1', 3, 1);
  const home = updated.find((c) => c.id === 'H1')!;
  const away = updated.find((c) => c.id === 'A1')!;

  assert.equal(home.points, 3);
  assert.equal(home.won, 1);
  assert.equal(home.goalsFor, 3);
  assert.equal(home.goalsAgainst, 1);
  assert.equal(home.goalDiff, 2);
  assert.equal(home.matchesPlayed, 1);

  assert.equal(away.points, 0);
  assert.equal(away.lost, 1);
  assert.equal(away.goalsFor, 1);
  assert.equal(away.goalsAgainst, 3);
  assert.equal(away.goalDiff, -2);
  assert.equal(away.matchesPlayed, 1);
});

test('simulateFullMatchdayRound generates 18 fixtures for all 36 teams and updates standings', () => {
  const result = simulateFullMatchdayRound(UEL_CLUBS);
  assert.equal(result.roundResults.length, 18, 'Must generate 18 fixtures for 36 teams');
  assert.equal(result.updatedClubs.length, 36, 'Must maintain 36 clubs in table');
});

test('filterUELClubs filters by search query and country', () => {
  const german = filterUELClubs(UEL_CLUBS, '', 'Germany');
  assert.ok(german.length >= 2, 'Should find at least 2 German clubs (Bayer Leverkusen, Hoffenheim)');

  const searched = filterUELClubs(UEL_CLUBS, 'Juventus');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].name, 'Juventus');
});
