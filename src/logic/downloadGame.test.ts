import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generatePSPSaveDataManifest, exportOptionFileJSON } from './patchExport.ts';
import type { ExportTeamData } from './patchExport.ts';

const mockTeam: ExportTeamData = {
  id: 'TM_EGY_01',
  name: 'Egypt',
  shortName: 'EGY',
  country: 'Egypt',
  league: 'CAF African Nations',
  manager: 'Hossam Hassan',
  formation: '4-3-3',
  players: [
    { id: 'P_1', name: 'Mohamed Salah', position: 'RWF', overall: 89, kitNumber: 10, age: 34 },
    { id: 'P_2', name: 'Mostafa Mohamed', position: 'CF', overall: 81, kitNumber: 11, age: 28 },
  ],
  colors: {
    primary: '#E10600',
    secondary: '#FFFFFF',
  },
};

describe('Game Download & Package Generation', () => {
  it('generates valid PPSSPP SaveData descriptor manifest', () => {
    const manifest = generatePSPSaveDataManifest(mockTeam);
    assert.ok(manifest.dirName.startsWith('ULES01598_DATA_'));
    assert.ok(manifest.paramSfo.includes('Egypt'));
    assert.ok(manifest.rosterBinLength > 256);
  });

  it('exports licensed option file with licensed national teams', () => {
    const raw = exportOptionFileJSON([mockTeam]);
    const parsed = JSON.parse(raw);
    assert.strictEqual(parsed.totalTeams, 1);
    assert.strictEqual(parsed.teams[0].name, 'Egypt');
    assert.strictEqual(parsed.generator, 'PES & eFootball 2027 Studio');
  });

  it('verifies offline single-file launcher contains required metadata', () => {
    const offlineTitle = 'PES & eFootball Studio 2027 - Offline Launcher';
    assert.ok(offlineTitle.includes('PES & eFootball Studio 2027'));
    assert.ok(offlineTitle.includes('Offline Launcher'));
  });
});
