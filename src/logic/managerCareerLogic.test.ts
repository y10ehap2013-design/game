import test from 'node:test';
import assert from 'node:assert/strict';
import { WORLD_CLASS_MANAGERS } from '../data/managersData.ts';
import {
  createDefaultCustomManager,
  POPULAR_CAREER_CLUBS,
  generateInitialSquad,
  generateTransferMarketPool,
  simulateInstantMatch,
  swapSquadPlayers,
  buyPlayerFromMarket,
} from './managerCareerLogic.ts';
import type { ManagerCareerState } from './managerCareerLogic.ts';

test('World-Class Managers database has all 32 curated managers', () => {
  assert.equal(WORLD_CLASS_MANAGERS.length, 32, 'Must contain all 32 curated managers');

  const eliteClubs = WORLD_CLASS_MANAGERS.filter(m => m.category === 'ELITE_CLUB');
  const nationalTeams = WORLD_CLASS_MANAGERS.filter(m => m.category === 'NATIONAL_TEAM');
  const legendary = WORLD_CLASS_MANAGERS.filter(m => m.category === 'LEGENDARY');

  assert.equal(eliteClubs.length, 17, 'Must have 17 elite club managers');
  assert.equal(nationalTeams.length, 12, 'Must have 12 national team managers');
  assert.equal(legendary.length, 3, 'Must have 3 legendary managers');

  // Verify key individuals requested by prompt
  const ancelotti = WORLD_CLASS_MANAGERS.find(m => m.name.includes('Ancelotti'));
  const guardiola = WORLD_CLASS_MANAGERS.find(m => m.name.includes('Guardiola'));
  const arteta = WORLD_CLASS_MANAGERS.find(m => m.name.includes('Arteta'));
  const flick = WORLD_CLASS_MANAGERS.find(m => m.name.includes('Flick'));
  const mourinho = WORLD_CLASS_MANAGERS.find(m => m.name.includes('Mourinho'));
  const scaloni = WORLD_CLASS_MANAGERS.find(m => m.name.includes('Scaloni'));
  const deLaFuente = WORLD_CLASS_MANAGERS.find(m => m.name.includes('de la Fuente'));
  const deschamps = WORLD_CLASS_MANAGERS.find(m => m.name.includes('Deschamps'));
  const zidane = WORLD_CLASS_MANAGERS.find(m => m.name.includes('Zidane'));
  const klopp = WORLD_CLASS_MANAGERS.find(m => m.name.includes('Klopp'));
  const allegri = WORLD_CLASS_MANAGERS.find(m => m.name.includes('Allegri'));

  assert.ok(ancelotti, 'Ancelotti must exist');
  assert.ok(guardiola, 'Guardiola must exist');
  assert.ok(arteta, 'Arteta must exist');
  assert.ok(flick, 'Flick must exist');
  assert.ok(mourinho, 'Mourinho must exist');
  assert.ok(scaloni, 'Scaloni must exist');
  assert.ok(deLaFuente, 'Luis de la Fuente must exist');
  assert.ok(deschamps, 'Deschamps must exist');
  assert.ok(zidane, 'Zidane must exist');
  assert.ok(klopp, 'Klopp must exist');
  assert.ok(allegri, 'Allegri must exist');
});

test('Custom Manager generator initializes with customizable physical attributes', () => {
  const custom = createDefaultCustomManager();
  assert.ok(custom.name);
  assert.ok(custom.nationality);
  assert.equal(typeof custom.heightCm, 'number');
  assert.ok(custom.heightCm >= 160 && custom.heightCm <= 205);
  assert.ok(['slender', 'athletic', 'muscular', 'stocky'].includes(custom.bodyBuild));
  assert.ok(['straight', 'aquiline', 'button', 'broad', 'curved'].includes(custom.noseType));
  assert.ok(['almond', 'wide', 'deep', 'sharp'].includes(custom.eyeShape));
  assert.ok(custom.eyeColor.startsWith('#'));
  assert.ok(custom.hairColor.startsWith('#'));
  assert.ok(['suit', 'tracksuit', 'blazer', 'raincoat'].includes(custom.touchlineAttire));
});

test('Initial squad generation produces full squad with 11 starters', () => {
  const squad = generateInitialSquad('Real Madrid CF', '#FFFFFF');
  assert.ok(squad.length >= 16);
  const starters = squad.filter(p => p.isStarting);
  assert.equal(starters.length, 11, 'Must have exactly 11 starting players');
});

test('Squad player swap correctly toggles starting status or reorders', () => {
  const squad = generateInitialSquad('Al Ahly SC', '#E4002B');
  const starter = squad.find(p => p.isStarting)!;
  const bench = squad.find(p => !p.isStarting)!;

  const swapped = swapSquadPlayers(squad, starter.id, bench.id);
  const newStarter = swapped.find(p => p.id === bench.id);
  const newBench = swapped.find(p => p.id === starter.id);

  assert.equal(newStarter?.isStarting, true);
  assert.equal(newBench?.isStarting, false);
});

test('Instant match simulator returns plausible scores and events', () => {
  const squad = generateInitialSquad('Manchester City', '#6CABDD');
  const mockState: ManagerCareerState = {
    id: 'career_1',
    managerType: 'REAL',
    realManager: WORLD_CLASS_MANAGERS[1], // Pep
    club: POPULAR_CAREER_CLUBS[1],
    transferBudgetMillions: 120,
    wageBudgetWeeklyK: 500,
    difficulty: 'PROFESSIONAL',
    boardConfidence: 85,
    mentality: 'ATTACKING',
    formation: '4-3-3',
    seasonStats: { matchesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    squad,
    transferMarket: generateTransferMarketPool(),
  };

  const sim = simulateInstantMatch(mockState, 'Chelsea FC', 84);
  assert.ok(typeof sim.homeScore === 'number' && sim.homeScore >= 0);
  assert.ok(typeof sim.awayScore === 'number' && sim.awayScore >= 0);
  assert.ok(sim.homePossession + sim.awayPossession === 100);
  assert.ok(sim.homeShots > 0);
  assert.ok(sim.manOfTheMatch);
  assert.ok(Array.isArray(sim.events));
});

test('Transfer market buy correctly debits budget and adds player to squad', () => {
  const squad = generateInitialSquad('Liverpool FC', '#C8102E');
  const market = generateTransferMarketPool();
  const playerToBuy = market[0];

  const state: ManagerCareerState = {
    id: 'career_test',
    managerType: 'CUSTOM',
    customManager: createDefaultCustomManager(),
    club: POPULAR_CAREER_CLUBS[3],
    transferBudgetMillions: 200,
    wageBudgetWeeklyK: 400,
    difficulty: 'WORLD_CLASS',
    boardConfidence: 80,
    mentality: 'BALANCED',
    formation: '4-3-3',
    seasonStats: { matchesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    squad,
    transferMarket: market,
  };

  const result = buyPlayerFromMarket(state, playerToBuy.id);
  assert.equal(result.success, true);
  assert.equal(result.newState.transferBudgetMillions, 200 - playerToBuy.valueMillions);
  assert.ok(result.newState.squad.some(p => p.id === playerToBuy.id));
  assert.ok(!result.newState.transferMarket.some(p => p.id === playerToBuy.id));
});
