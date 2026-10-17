/**
 * All 211 full FIFA Member Associations organized by Confederation
 * Includes UEFA (55), CAF (54), AFC (47), CONCACAF (35), CONMEBOL (10), OFC (11).
 */

export interface NationalTeam {
  id: string;
  name: string;
  confederation: 'UEFA' | 'CAF' | 'AFC' | 'CONCACAF' | 'CONMEBOL' | 'OFC';
  fifaRank: number;
  rating: number;
  starPlayer: string;
  homeColors: { primary: string; secondary: string };
  flagEmoji: string;
}

export const UEFA_TEAMS: string[] = [
  'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium',
  'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'England', 'Estonia', 'Faroe Islands', 'Finland', 'France', 'Georgia',
  'Germany', 'Gibraltar', 'Greece', 'Hungary', 'Iceland', 'Israel', 'Italy',
  'Kazakhstan', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Malta', 'Moldova', 'Montenegro', 'Netherlands', 'North Macedonia', 'Northern Ireland',
  'Norway', 'Poland', 'Portugal', 'Republic of Ireland', 'Romania', 'Russia',
  'San Marino', 'Scotland', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden',
  'Switzerland', 'Turkey', 'Ukraine', 'Wales'
];

export const CAF_TEAMS: string[] = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon',
  'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'DR Congo',
  'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia',
  'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya',
  'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania',
  'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda',
  'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia',
  'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda',
  'Zambia', 'Zimbabwe'
];

export const AFC_TEAMS: string[] = [
  'Afghanistan', 'Australia', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia',
  'China', 'Chinese Taipei', 'Guam', 'Hong Kong', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Japan', 'Jordan', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Macau',
  'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman',
  'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore',
  'South Korea', 'Sri Lanka', 'Syria', 'Tajikistan', 'Thailand', 'East Timor',
  'Turkmenistan', 'UAE', 'Uzbekistan', 'Vietnam', 'Yemen'
];

export const CONCACAF_TEAMS: string[] = [
  'Anguilla', 'Antigua and Barbuda', 'Aruba', 'Bahamas', 'Barbados', 'Belize',
  'Bermuda', 'British Virgin Islands', 'Canada', 'Cayman Islands', 'Costa Rica',
  'Cuba', 'Curaçao', 'Dominica', 'Dominican Republic', 'El Salvador', 'Grenada',
  'Guatemala', 'Guyana', 'Haiti', 'Honduras', 'Jamaica', 'Mexico', 'Montserrat',
  'Nicaragua', 'Panama', 'Puerto Rico', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Suriname', 'Trinidad and Tobago',
  'Turks and Caicos Islands', 'US Virgin Islands', 'USA'
];

export const CONMEBOL_TEAMS: string[] = [
  'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Paraguay',
  'Peru', 'Uruguay', 'Venezuela'
];

export const OFC_TEAMS: string[] = [
  'American Samoa', 'Cook Islands', 'Fiji', 'New Caledonia', 'New Zealand',
  'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tahiti', 'Tonga', 'Vanuatu'
];

// Helper to seed national teams data
export function getNationalTeams(): NationalTeam[] {
  const result: NationalTeam[] = [];
  let rankCounter = 1;

  const addConfed = (
    teams: string[],
    confed: NationalTeam['confederation'],
    defaultColors: { primary: string; secondary: string }
  ) => {
    teams.forEach((name, idx) => {
      // Deterministic ratings and star players for top nations
      let rating = 72;
      let starPlayer = `${name} Ace`;
      let colors = { ...defaultColors };

      if (name === 'Argentina') { rating = 91; starPlayer = 'Lionel Messi'; colors = { primary: '#75AADB', secondary: '#FFFFFF' }; }
      else if (name === 'France') { rating = 90; starPlayer = 'Kylian Mbappé'; colors = { primary: '#002654', secondary: '#FFFFFF' }; }
      else if (name === 'Spain') { rating = 89; starPlayer = 'Lamine Yamal'; colors = { primary: '#AA151B', secondary: '#F1BF00' }; }
      else if (name === 'England') { rating = 89; starPlayer = 'Jude Bellingham'; colors = { primary: '#FFFFFF', secondary: '#002B7F' }; }
      else if (name === 'Brazil') { rating = 88; starPlayer = 'Vinícius Júnior'; colors = { primary: '#FEDF00', secondary: '#009739' }; }
      else if (name === 'Egypt') { rating = 84; starPlayer = 'Mohamed Salah'; colors = { primary: '#C8102E', secondary: '#000000' }; }
      else if (name === 'Morocco') { rating = 86; starPlayer = 'Achraf Hakimi'; colors = { primary: '#C1272D', secondary: '#006233' }; }
      else if (name === 'Senegal') { rating = 84; starPlayer = 'Sadio Mané'; colors = { primary: '#00853F', secondary: '#FDEF42' }; }
      else if (name === 'Nigeria') { rating = 83; starPlayer = 'Victor Osimhen'; colors = { primary: '#008751', secondary: '#FFFFFF' }; }
      else if (name === 'Algeria') { rating = 82; starPlayer = 'Riyad Mahrez'; colors = { primary: '#006633', secondary: '#FFFFFF' }; }
      else if (name === 'Tunisia') { rating = 80; starPlayer = 'Youssef Msakni'; colors = { primary: '#E70013', secondary: '#FFFFFF' }; }
      else if (name === 'Saudi Arabia') { rating = 81; starPlayer = 'Salem Al-Dawsari'; colors = { primary: '#006C35', secondary: '#FFFFFF' }; }
      else if (name === 'Japan') { rating = 84; starPlayer = 'Kaoru Mitoma'; colors = { primary: '#001E62', secondary: '#FFFFFF' }; }
      else if (name === 'South Korea') { rating = 83; starPlayer = 'Son Heung-min'; colors = { primary: '#C60C30', secondary: '#003478' }; }
      else if (name === 'Croatia') { rating = 84; starPlayer = 'Luka Modrić'; colors = { primary: '#ED1C24', secondary: '#FFFFFF' }; }
      else if (name === 'Portugal') { rating = 88; starPlayer = 'Cristiano Ronaldo'; colors = { primary: '#E42518', secondary: '#006600' }; }
      else if (name === 'Germany') { rating = 87; starPlayer = 'Florian Wirtz'; colors = { primary: '#FFFFFF', secondary: '#000000' }; }
      else if (name === 'Netherlands') { rating = 86; starPlayer = 'Virgil van Dijk'; colors = { primary: '#F36C21', secondary: '#000000' }; }
      else if (name === 'USA') { rating = 82; starPlayer = 'Christian Pulisic'; colors = { primary: '#FFFFFF', secondary: '#002868' }; }
      else if (name === 'Mexico') { rating = 81; starPlayer = 'Edson Álvarez'; colors = { primary: '#006847', secondary: '#CE1126' }; }
      else if (name === 'Uruguay') { rating = 85; starPlayer = 'Federico Valverde'; colors = { primary: '#5B92E5', secondary: '#000000' }; }
      else if (name === 'Colombia') { rating = 84; starPlayer = 'Luis Díaz'; colors = { primary: '#FCD116', secondary: '#003893' }; }
      else if (name === 'UAE') { rating = 77; starPlayer = 'Ali Mabkhout'; colors = { primary: '#FFFFFF', secondary: '#C8102E' }; }
      else if (name === 'Qatar') { rating = 78; starPlayer = 'Akram Afif'; colors = { primary: '#8A1538', secondary: '#FFFFFF' }; }
      else if (name === 'South Africa') { rating = 77; starPlayer = 'Percy Tau'; colors = { primary: '#FDB913', secondary: '#007A4D' }; }
      else if (name === 'Australia') { rating = 79; starPlayer = 'Jackson Irvine'; colors = { primary: '#FFCD00', secondary: '#00843D' }; }
      else {
        rating = Math.max(55, Math.min(78, 80 - Math.floor(idx * 0.45)));
      }

      result.push({
        id: `NAT_${confed}_${idx + 1}`,
        name,
        confederation: confed,
        fifaRank: rankCounter++,
        rating,
        starPlayer,
        homeColors: colors,
        flagEmoji: '⚽',
      });
    });
  };

  addConfed(UEFA_TEAMS, 'UEFA', { primary: '#1E3A8A', secondary: '#FFFFFF' });
  addConfed(CAF_TEAMS, 'CAF', { primary: '#047857', secondary: '#F59E0B' });
  addConfed(AFC_TEAMS, 'AFC', { primary: '#DC2626', secondary: '#FCD34D' });
  addConfed(CONCACAF_TEAMS, 'CONCACAF', { primary: '#2563EB', secondary: '#DC2626' });
  addConfed(CONMEBOL_TEAMS, 'CONMEBOL', { primary: '#EAB308', secondary: '#1D4ED8' });
  addConfed(OFC_TEAMS, 'OFC', { primary: '#0284C7', secondary: '#F8FAFC' });

  return result;
}

export const ARAB_TEAMS: string[] = [
  'Egypt', 'Morocco', 'Algeria', 'Tunisia', 'Saudi Arabia', 'UAE', 'Qatar',
  'Iraq', 'Jordan', 'Oman', 'Bahrain', 'Kuwait', 'Palestine', 'Syria',
  'Lebanon', 'Sudan', 'Libya', 'Mauritania', 'Yemen', 'Comoros', 'Djibouti', 'Somalia'
];

export function getTeamsForCup(cupType: 'WORLD_CUP' | 'EURO' | 'COPA_AMERICA' | 'CAF_CUP' | 'ARAB_CUP'): NationalTeam[] {
  const allNations = getNationalTeams();
  switch (cupType) {
    case 'EURO':
      return allNations.filter(t => t.confederation === 'UEFA');
    case 'CAF_CUP':
      return allNations.filter(t => t.confederation === 'CAF');
    case 'COPA_AMERICA':
      return allNations.filter(t => t.confederation === 'CONMEBOL' || t.confederation === 'CONCACAF');
    case 'ARAB_CUP':
      return allNations.filter(t => ARAB_TEAMS.includes(t.name));
    case 'WORLD_CUP':
    default:
      return allNations;
  }
}

