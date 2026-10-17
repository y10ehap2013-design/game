import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generatePES2019TedHeader,
  generatePSPSaveDataManifest,
  exportOptionFileJSON,
} from './patchExport.ts';
import type { ExportTeamData } from './patchExport.ts';

const mockTeam: ExportTeamData = {
  id: 'TM_ALAHLY_01',
  name: 'Al Ahly SC',
  shortName: 'AHL',
  country: 'Egypt',
  league: 'Egyptian Premier League',
  manager: 'Marcel Koller',
  formation: '4-3-3',
  players: [
    { id: 'P_1', name: 'Mohamed El Shenawy', position: 'GK', overall: 84, kitNumber: 1, age: 35 },
    { id: 'P_2', name: 'Percy Tau', position: 'RWF', overall: 81, kitNumber: 10, age: 30 },
  ],
  colors: {
    primary: '#E10600',
    secondary: '#FFFFFF',
  },
};

test('generatePES2019TedHeader creates valid TED descriptor header', () => {
  const header = generatePES2019TedHeader(mockTeam);
  assert.ok(header.startsWith('TED2019_TM_ALAHLY_01'));
  assert.ok(header.includes('TAG:AHL'));
  assert.ok(header.includes('PRIMARY:#E10600'));
});

test('generatePSPSaveDataManifest prepares PSP handheld directory structure', () => {
  const manifest = generatePSPSaveDataManifest(mockTeam);
  assert.ok(manifest.dirName.startsWith('ULES01598_DATA_'));
  assert.ok(manifest.paramSfo.includes('Al Ahly SC'));
  assert.ok(manifest.rosterBinLength > 512);
});

test('exportOptionFileJSON serializes clean cross-compatible option file', () => {
  const jsonStr = exportOptionFileJSON([mockTeam]);
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.totalTeams, 1);
  assert.equal(parsed.teams[0].name, 'Al Ahly SC');
  assert.equal(parsed.generator, 'PES & eFootball 2027 Studio');
});
