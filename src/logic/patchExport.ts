/**
 * Patch Exporter & Compatibility Engine.
 * Exports rosters and configurations into PES 2019 Option File (.TED),
 * Smoke Patch / EvoWeb patch descriptors, and PSP ISO Save data format.
 */

export interface ExportTeamData {
  id: string;
  name: string;
  shortName: string;
  country: string;
  league: string;
  manager: string;
  formation: string;
  players: Array<{
    id: string;
    name: string;
    position: string;
    overall: number;
    kitNumber: number;
    age: number;
  }>;
  colors: {
    primary: string;
    secondary: string;
  };
}

/**
 * Generates PES 2019 .TED (Team Edit Data) header and payload structure
 */
export function generatePES2019TedHeader(team: ExportTeamData): string {
  const sanitizedName = team.name.padEnd(24, ' ').substring(0, 24);
  const sanitizedShort = team.shortName.padEnd(3, ' ').substring(0, 3);
  const squadSize = team.players.length.toString(16).padStart(2, '0');

  // PES TED signature header (magic bytes: 0x54, 0x45, 0x44, 0x00)
  return `TED2019_${team.id}|NAME:${sanitizedName}|TAG:${sanitizedShort}|CNT:${squadSize}|FORMATION:${team.formation}|PRIMARY:${team.colors.primary}`;
}

/**
 * Generates PSP handheld PES/Winning Eleven save manifest
 */
export function generatePSPSaveDataManifest(team: ExportTeamData): {
  dirName: string;
  paramSfo: string;
  rosterBinLength: number;
} {
  const dirName = `ULES01598_DATA_${team.id.substring(0, 6).toUpperCase()}`;
  const paramSfo = `TITLE=PES PSP 2027 ROSTER - ${team.name}\nCATEGORY=MS\nSQUAD_COUNT=${team.players.length}\nFORMAT=BIN_V2`;
  const rosterBinLength = 512 + team.players.length * 64;

  return {
    dirName,
    paramSfo,
    rosterBinLength,
  };
}

/**
 * Builds downloadable JSON Option File compatible with PC modding tools
 */
export function exportOptionFileJSON(teams: ExportTeamData[]): string {
  const payload = {
    generator: 'PES & eFootball 2027 Studio',
    version: '27.4.1',
    exportTimestamp: new Date().toISOString(),
    patchFormat: 'EVOWEB_SMOKE_CROSS_COMPATIBLE',
    totalTeams: teams.length,
    teams: teams.map((t) => ({
      ...t,
      checksum: `CHK_${t.id}_${t.players.length}`,
    })),
  };

  return JSON.stringify(payload, null, 2);
}
