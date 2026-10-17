/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * COMPLETE GLOBAL FOOTBALL LEAGUES DIRECTORY & MULTI-TIER PYRAMIDS
 * Comprehensive mapping of domestic football structures across UEFA, CAF, AFC,
 * CONMEBOL, CONCACAF, and OFC spanning multiple tiers (Tier 1 to Tier 5),
 * official countries, and key featured member clubs.
 */

export interface DirectoryTier {
  tierNumber: number;
  tierName: string;
  popularLevel: 'Top-Flight' | 'Second Division' | 'Third Division' | 'Lower League / Semi-Pro' | 'Grassroots / National';
  featuredTeams: string[];
}

export interface DirectoryCountry {
  country: string;
  confederation: 'UEFA' | 'CAF' | 'AFC' | 'CONMEBOL' | 'CONCACAF' | 'OFC';
  flag: string;
  pyramidTiers: DirectoryTier[];
}

export const GLOBAL_LEAGUES_DIRECTORY: DirectoryCountry[] = [
  // =========================================================================
  // 1. UEFA (Europe)
  // =========================================================================
  {
    country: 'England',
    confederation: 'UEFA',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Premier League',
        popularLevel: 'Top-Flight',
        featuredTeams: [
          'Manchester City', 'Arsenal', 'Liverpool', 'Aston Villa', 'Tottenham Hotspur',
          'Chelsea', 'Manchester United', 'Newcastle United', 'West Ham', 'Brighton'
        ],
      },
      {
        tierNumber: 2,
        tierName: 'EFL Championship',
        popularLevel: 'Second Division',
        featuredTeams: [
          'Leeds United', 'Burnley', 'Luton Town', 'Sheffield United', 'West Bromwich Albion',
          'Coventry City', 'Middlesbrough', 'Sunderland', 'Norwich City'
        ],
      },
      {
        tierNumber: 3,
        tierName: 'EFL League One',
        popularLevel: 'Third Division',
        featuredTeams: [
          'Birmingham City', 'Bolton Wanderers', 'Huddersfield Town', 'Charlton Athletic',
          'Wrexham', 'Barnsley', 'Peterborough United', 'Blackpool'
        ],
      },
      {
        tierNumber: 4,
        tierName: 'EFL League Two',
        popularLevel: 'Lower League / Semi-Pro',
        featuredTeams: [
          'Notts County', 'Milton Keynes Dons', 'Doncaster Rovers', 'Gillingham',
          'Bradford City', 'Chesterfield', 'Salford City'
        ],
      },
      {
        tierNumber: 5,
        tierName: 'National League',
        popularLevel: 'Grassroots / National',
        featuredTeams: [
          'Oldham Athletic', 'Southend United', 'Forest Green Rovers', 'Barnet',
          'Rochdale', 'York City', 'Gateshead'
        ],
      },
    ],
  },
  {
    country: 'Spain',
    confederation: 'UEFA',
    flag: '🇪🇸',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'La Liga',
        popularLevel: 'Top-Flight',
        featuredTeams: [
          'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Girona', 'Athletic Bilbao',
          'Real Sociedad', 'Real Betis', 'Villarreal', 'Valencia', 'Sevilla'
        ],
      },
      {
        tierNumber: 2,
        tierName: 'Segunda División (La Liga 2)',
        popularLevel: 'Second Division',
        featuredTeams: [
          'Granada', 'Cadiz', 'Almeria', 'Real Zaragoza', 'Real Oviedo',
          'Sporting Gijon', 'Levante', 'Eibar', 'Tenerife', 'Deportivo La Coruna'
        ],
      },
      {
        tierNumber: 3,
        tierName: 'Primera Federación',
        popularLevel: 'Third Division',
        featuredTeams: [
          'Deportivo Alaves B', 'Barcelona Atletic', 'Real Madrid Castilla', 'Malaga CF',
          'Ibiza', 'Murcia', 'Recreativo Huelva', 'Ceuta', 'Ponferradina'
        ],
      },
      {
        tierNumber: 4,
        tierName: 'Segunda Federación',
        popularLevel: 'Lower League / Semi-Pro',
        featuredTeams: [
          'Numancia', 'Pontevedra', 'Hercules CF', 'Badajoz', 'Sant Andreu', 'Zamora CF'
        ],
      },
    ],
  },
  {
    country: 'Italy',
    confederation: 'UEFA',
    flag: '🇮🇹',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Serie A',
        popularLevel: 'Top-Flight',
        featuredTeams: [
          'Inter Milan', 'AC Milan', 'Juventus', 'Atalanta', 'Bologna',
          'AS Roma', 'Lazio', 'Fiorentina', 'Napoli', 'Torino', 'Hellas Verona'
        ],
      },
      {
        tierNumber: 2,
        tierName: 'Serie B',
        popularLevel: 'Second Division',
        featuredTeams: [
          'Sassuolo', 'Salernitana', 'Frosinone', 'Palermo', 'Cremonese',
          'Sampdoria', 'Brescia', 'Bari', 'Pisa', 'Spezia', 'Modena'
        ],
      },
      {
        tierNumber: 3,
        tierName: 'Serie C',
        popularLevel: 'Third Division',
        featuredTeams: [
          'Vicenza', 'Padova', 'Catania', 'SPAL', 'Pescara',
          'Avellino', 'Benevento', 'Foggia', 'Triestina', 'Perugia', 'Juventus Next Gen'
        ],
      },
      {
        tierNumber: 4,
        tierName: 'Serie D',
        popularLevel: 'Lower League / Semi-Pro',
        featuredTeams: [
          'Siena', 'Chievo Verona', 'Campobasso', 'Sanremese', 'Casale', 'Varese'
        ],
      },
    ],
  },
  {
    country: 'Germany',
    confederation: 'UEFA',
    flag: '🇩🇪',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Bundesliga',
        popularLevel: 'Top-Flight',
        featuredTeams: [
          'Bayer Leverkusen', 'Stuttgart', 'Bayern Munich', 'RB Leipzig', 'Borussia Dortmund',
          'Eintracht Frankfurt', 'Hoffenheim', 'Heidenheim', 'Werder Bremen'
        ],
      },
      {
        tierNumber: 2,
        tierName: '2. Bundesliga',
        popularLevel: 'Second Division',
        featuredTeams: [
          'FC Koln', 'SV Darmstadt', 'Hamburg SV', 'Fortuna Dusseldorf', 'Hertha BSC',
          'Schalke 04', 'Hannover 96', 'Paderborn', 'Kaiserslautern'
        ],
      },
      {
        tierNumber: 3,
        tierName: '3. Liga',
        popularLevel: 'Third Division',
        featuredTeams: [
          'Dynamo Dresden', 'Hansa Rostock', 'VfL Osnabruck', 'TSV 1860 Munich',
          'Arminia Bielefeld', 'Saarbrücken', 'Rot-Weiss Essen', 'SV Sandhausen'
        ],
      },
      {
        tierNumber: 4,
        tierName: 'Regionalliga',
        popularLevel: 'Lower League / Semi-Pro',
        featuredTeams: [
          'Energie Cottbus', 'Würzburger Kickers', 'Alemannia Aachen', 'Stuttgarter Kickers', 'Lokomotive Leipzig'
        ],
      },
    ],
  },
  {
    country: 'France',
    confederation: 'UEFA',
    flag: '🇫🇷',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Ligue 1',
        popularLevel: 'Top-Flight',
        featuredTeams: [
          'Paris Saint-Germain', 'Monaco', 'Brest', 'Lille', 'Nice',
          'Lyon', 'Lens', 'Marseille', 'Reims', 'Rennes', 'Toulouse', 'Nantes'
        ],
      },
      {
        tierNumber: 2,
        tierName: 'Ligue 2',
        popularLevel: 'Second Division',
        featuredTeams: [
          'Metz', 'Lorient', 'Clermont Foot', 'Auxerre', 'Angers',
          'Saint-Etienne', 'Bordeaux', 'Paris FC', 'Troyes', 'Caen', 'Guingamp'
        ],
      },
      {
        tierNumber: 3,
        tierName: 'Championnat National',
        popularLevel: 'Third Division',
        featuredTeams: [
          'Red Star FC', 'Niort', 'Martigues', 'Dijon FCO', 'Sochaux',
          'Nimes Olympique', 'Nancy', 'Le Mans FC', 'Versailles'
        ],
      },
      {
        tierNumber: 4,
        tierName: 'Championnat National 2',
        popularLevel: 'Lower League / Semi-Pro',
        featuredTeams: [
          'Cannes', 'Sedan', 'Toulon', 'Beauvais', 'Racing CFF'
        ],
      },
    ],
  },
  {
    country: 'Netherlands',
    confederation: 'UEFA',
    flag: '🇳🇱',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Eredivisie',
        popularLevel: 'Top-Flight',
        featuredTeams: ['PSV Eindhoven', 'Feyenoord', 'Ajax', 'AZ Alkmaar', 'FC Twente', 'FC Utrecht'],
      },
      {
        tierNumber: 2,
        tierName: 'Eerste Divisie',
        popularLevel: 'Second Division',
        featuredTeams: ['Vitesse', 'Willem II', 'FC Groningen', 'De Graafschap', 'Roda JC', 'SC Cambuur'],
      },
      {
        tierNumber: 3,
        tierName: 'Tweede Divisie',
        popularLevel: 'Third Division',
        featuredTeams: ['Spakenburg', 'Katwijk', 'Quick Boys', 'AFC Amsterdam', 'HHC Hardenberg'],
      },
    ],
  },
  {
    country: 'Portugal',
    confederation: 'UEFA',
    flag: '🇵🇹',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Liga Portugal',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Sporting CP', 'Benfica', 'FC Porto', 'SC Braga', 'Vitoria Guimaraes'],
      },
      {
        tierNumber: 2,
        tierName: 'Liga Portugal 2',
        popularLevel: 'Second Division',
        featuredTeams: ['Maritimo', 'Pacos de Ferreira', 'Portimonense', 'Vizela', 'Chaves', 'Leixoes'],
      },
      {
        tierNumber: 3,
        tierName: 'Liga 3',
        popularLevel: 'Third Division',
        featuredTeams: ['Belenenses', 'Varzim', 'Académica de Coimbra', 'Sporting Covilha', 'Amora'],
      },
    ],
  },
  {
    country: 'Turkey',
    confederation: 'UEFA',
    flag: '🇹🇷',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Süper Lig',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Galatasaray', 'Fenerbahce', 'Besiktas', 'Trabzonspor', 'Basaksehir'],
      },
      {
        tierNumber: 2,
        tierName: 'TFF 1. Lig',
        popularLevel: 'Second Division',
        featuredTeams: ['Ankaragucu', 'Pendikspor', 'Fatih Karagumruk', 'Genclerbirligi', 'Sakaryaspor', 'Kocaelispor'],
      },
      {
        tierNumber: 3,
        tierName: 'TFF 2. Lig',
        popularLevel: 'Third Division',
        featuredTeams: ['Bursaspor', 'Eskisehirspor', 'Altay', 'Giresunspor', 'Batman Petrolspor'],
      },
    ],
  },
  {
    country: 'Scotland',
    confederation: 'UEFA',
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Scottish Premiership',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Celtic', 'Rangers', 'Hearts of Midlothian', 'Aberdeen', 'Hibernian'],
      },
      {
        tierNumber: 2,
        tierName: 'Scottish Championship',
        popularLevel: 'Second Division',
        featuredTeams: ['Partick Thistle', 'Livingston', 'Falkirk', 'Dunfermline Athletic', 'Raith Rovers', 'Ayr United'],
      },
      {
        tierNumber: 3,
        tierName: 'Scottish League One',
        popularLevel: 'Third Division',
        featuredTeams: ['Inverness Caledonian Thistle', 'Queen of the South', 'Alloa Athletic', 'Montrose'],
      },
      {
        tierNumber: 4,
        tierName: 'Scottish League Two',
        popularLevel: 'Lower League / Semi-Pro',
        featuredTeams: ['East Fife', 'Edinburgh City', 'Spartans', 'Stranraer', 'Elgin City'],
      },
    ],
  },
  {
    country: 'Greece',
    confederation: 'UEFA',
    flag: '🇬🇷',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Super League Greece',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Olympiacos', 'Panathinaikos', 'AEK Athens', 'PAOK Thessaloniki', 'Aris'],
      },
      {
        tierNumber: 2,
        tierName: 'Super League 2',
        popularLevel: 'Second Division',
        featuredTeams: ['PAS Giannina', 'Kifisia', 'AEL Larissa', 'Iraklis', 'Ionikos', 'Chania'],
      },
      {
        tierNumber: 3,
        tierName: 'Gamma Ethniki',
        popularLevel: 'Third Division',
        featuredTeams: ['Panachaiki', 'Proodeftiki', 'Apollon Smyrnis', 'Doxa Drama'],
      },
    ],
  },
  {
    country: 'Croatia',
    confederation: 'UEFA',
    flag: '🇭🇷',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'HNL',
        popularLevel: 'Top-Flight',
        featuredTeams: ['GNK Dinamo Zagreb', 'HNK Hajduk Split', 'HNK Rijeka', 'NK Osijek'],
      },
      {
        tierNumber: 2,
        tierName: 'Prva NL',
        popularLevel: 'Second Division',
        featuredTeams: ['NK Rudes', 'HNK Vukovar 1991', 'HNK Sibenik', 'NK Sesvete', 'Cibalia Vinkovci'],
      },
      {
        tierNumber: 3,
        tierName: 'Druga NL',
        popularLevel: 'Third Division',
        featuredTeams: ['NK Marsonia', 'NK Karlovac 1919', 'NK Kustosija', 'Hrvace'],
      },
    ],
  },
  {
    country: 'Ukraine',
    confederation: 'UEFA',
    flag: '🇺🇦',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Ukrainian Premier League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Shakhtar Donetsk', 'Dynamo Kyiv', 'Kryvbas Kryvyi Rih', 'Dnipro-1', 'Polissya Zhytomyr'],
      },
      {
        tierNumber: 2,
        tierName: 'First League',
        popularLevel: 'Second Division',
        featuredTeams: ['Metalist 1925 Kharkiv', 'FC Mynai', 'Inhulets Petrove', 'Karpaty Lviv'],
      },
      {
        tierNumber: 3,
        tierName: 'Second League',
        popularLevel: 'Third Division',
        featuredTeams: ['Chaika', 'Zviahel', 'YUKSA Tarasivka', 'Kudrivka'],
      },
    ],
  },
  {
    country: 'Belgium',
    confederation: 'UEFA',
    flag: '🇧🇪',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Jupiler Pro League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Club Brugge', 'RSC Anderlecht', 'Union Saint-Gilloise', 'KRC Genk', 'Royal Antwerp'],
      },
      {
        tierNumber: 2,
        tierName: 'Challenger Pro League',
        popularLevel: 'Second Division',
        featuredTeams: ['KAS Eupen', 'RWD Molenbeek', 'Zulte Waregem', 'Beveren', 'Lommel SK'],
      },
      {
        tierNumber: 3,
        tierName: 'National Division 1',
        popularLevel: 'Third Division',
        featuredTeams: ['Olympic Charleroi', 'RFC Liege', 'URSL Vise', 'Heist'],
      },
    ],
  },
  {
    country: 'Austria',
    confederation: 'UEFA',
    flag: '🇦🇹',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Austrian Bundesliga',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Sturm Graz', 'Red Bull Salzburg', 'LASK Linz', 'Rapid Wien', 'Austria Wien'],
      },
      {
        tierNumber: 2,
        tierName: '2. Liga',
        popularLevel: 'Second Division',
        featuredTeams: ['Austria Lustenau', 'SV Ried', 'Grazer AK', 'Admira Wacker', 'St. Polten'],
      },
      {
        tierNumber: 3,
        tierName: 'Regionalliga',
        popularLevel: 'Third Division',
        featuredTeams: ['Wacker Innsbruck', 'First Vienna FC', 'Wiener Sport-Club', 'SV Leobendorf'],
      },
    ],
  },
  {
    country: 'Poland',
    confederation: 'UEFA',
    flag: '🇵🇱',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Ekstraklasa',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Jagiellonia Bialystok', 'Slask Wroclaw', 'Legia Warsaw', 'Lech Poznan', 'Rakow Czestochowa'],
      },
      {
        tierNumber: 2,
        tierName: 'I liga',
        popularLevel: 'Second Division',
        featuredTeams: ['Warta Poznan', 'Ruch Chorzow', 'LKS Lodz', 'Wisla Krakow', 'Arka Gdynia'],
      },
      {
        tierNumber: 3,
        tierName: 'II liga',
        popularLevel: 'Third Division',
        featuredTeams: ['Polonia Bytom', 'Kotwica Kolobrzeg', 'KKS Kalisz', 'Radunia Stezyca'],
      },
    ],
  },
  {
    country: 'Sweden',
    confederation: 'UEFA',
    flag: '🇸🇪',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Allsvenskan',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Malmo FF', 'AIK Stockholm', 'Djurgardens IF', 'IF Elfsborg', 'BK Hacken'],
      },
      {
        tierNumber: 2,
        tierName: 'Superettan',
        popularLevel: 'Second Division',
        featuredTeams: ['Varbergs BoIS', 'Degerfors IF', 'Osters IF', 'Landskrona BoIS', 'Helsingborgs IF'],
      },
      {
        tierNumber: 3,
        tierName: 'Ettan',
        popularLevel: 'Third Division',
        featuredTeams: ['Jonkopings Sodra', 'Falkenbergs FF', 'Vasalunds IF', 'Trollhattan'],
      },
    ],
  },
  {
    country: 'Norway',
    confederation: 'UEFA',
    flag: '🇳🇴',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Eliteserien',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Bodo/Glimt', 'SK Brann', 'Molde FK', 'Viking FK', 'Rosenborg BK'],
      },
      {
        tierNumber: 2,
        tierName: 'First Division (OBOS-ligaen)',
        popularLevel: 'Second Division',
        featuredTeams: ['Valerenga', 'Aalesunds FK', 'Stabaek', 'Kongsvinger', 'Moss FK'],
      },
      {
        tierNumber: 3,
        tierName: 'Second Division (PostNord-ligaen)',
        popularLevel: 'Third Division',
        featuredTeams: ['Skeid', 'Jerv', 'Hodd', 'Kjelsas', 'Tromsdalen'],
      },
    ],
  },
  {
    country: 'Denmark',
    confederation: 'UEFA',
    flag: '🇩🇰',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Danish Superliga',
        popularLevel: 'Top-Flight',
        featuredTeams: ['FC Midtjylland', 'Brondby IF', 'FC Copenhagen', 'FC Nordsjaelland', 'AGF Aarhus'],
      },
      {
        tierNumber: 2,
        tierName: '1st Division (NordicBet Liga)',
        popularLevel: 'Second Division',
        featuredTeams: ['Odense Boldklub (OB)', 'Hvidovre IF', 'AaB Aalborg', 'Sonderjyske', 'Horsens'],
      },
      {
        tierNumber: 3,
        tierName: '2nd Division',
        popularLevel: 'Third Division',
        featuredTeams: ['Naestved BK', 'FC Helsingor', 'Aarhus Fremad', 'Middelfart'],
      },
    ],
  },
  {
    country: 'Switzerland',
    confederation: 'UEFA',
    flag: '🇨🇭',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Swiss Super League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['BSC Young Boys', 'FC Lugano', 'Servette FC', 'FC Zurich', 'FC Basel'],
      },
      {
        tierNumber: 2,
        tierName: 'Challenge League',
        popularLevel: 'Second Division',
        featuredTeams: ['Stade Lausanne Ouchy', 'FC Aarau', 'FC Thun', 'FC Vaduz', 'Neuchatel Xamax', 'FC Wil'],
      },
      {
        tierNumber: 3,
        tierName: 'Promotion League',
        popularLevel: 'Third Division',
        featuredTeams: ['FC Schaffhausen', 'FC Biel-Bienne', 'Etoile Carouge', 'SC Kriens', 'Brevite'],
      },
    ],
  },
  {
    country: 'Czech Republic',
    confederation: 'UEFA',
    flag: '🇨🇿',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Czech First League (Chance Liga)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Sparta Prague', 'Slavia Prague', 'Viktoria Plzen', 'Banik Ostrava', 'Mlada Boleslav'],
      },
      {
        tierNumber: 2,
        tierName: 'Czech National Football League (FNL)',
        popularLevel: 'Second Division',
        featuredTeams: ['FC Zlin', 'Dukla Prague', 'Vysocina Jihlava', 'Zbrojovka Brno', 'Viktoria Zizkov'],
      },
    ],
  },
  {
    country: 'Republic of Ireland',
    confederation: 'UEFA',
    flag: '🇮🇪',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'LOI Premier Division',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Shamrock Rovers', 'Shelbourne', 'Derry City', 'St Patrick\'s Athletic', 'Bohemians'],
      },
      {
        tierNumber: 2,
        tierName: 'LOI First Division',
        popularLevel: 'Second Division',
        featuredTeams: ['Cork City', 'Bray Wanderers', 'UCD', 'Finn Harps', 'Cobh Ramblers'],
      },
    ],
  },
  {
    country: 'Northern Ireland',
    confederation: 'UEFA',
    flag: '🇬🇧',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'NIFL Premiership',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Larne FC', 'Linfield FC', 'Cliftonville', 'Glentoran', 'Crusaders'],
      },
      {
        tierNumber: 2,
        tierName: 'NIFL Championship',
        popularLevel: 'Second Division',
        featuredTeams: ['Newry City', 'Portadown', 'Bangor FC', 'Institute', 'Ballyclare Comrades'],
      },
    ],
  },
  {
    country: 'Romania',
    confederation: 'UEFA',
    flag: '🇷🇴',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Liga I (SuperLiga)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['FCSB (Steaua)', 'CFR Cluj', 'Universitatea Craiova', 'Farul Constanta', 'Rapid Bucuresti'],
      },
      {
        tierNumber: 2,
        tierName: 'Liga II',
        popularLevel: 'Second Division',
        featuredTeams: ['FC U Craiova 1948', 'FC Voluntari', 'Corvinul Hunedoara', 'CS Mioveni', 'Chindia Targoviste'],
      },
      {
        tierNumber: 3,
        tierName: 'Liga III',
        popularLevel: 'Third Division',
        featuredTeams: ['Progresul Spartac', 'CS Dinamo', 'Foresta Suceava', 'Poli Timisoara'],
      },
    ],
  },
  {
    country: 'Bulgaria',
    confederation: 'UEFA',
    flag: '🇧🇬',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'First League (efbet Liga)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Ludogorets Razgrad', 'CSKA Sofia', 'Cherno More', 'Levski Sofia', 'Lokomotiv Plovdiv'],
      },
      {
        tierNumber: 2,
        tierName: 'Second League',
        popularLevel: 'Second Division',
        featuredTeams: ['Etar Veliko Tarnovo', 'Pirin Blagoevgrad', 'Spartak Varna', 'Montana', 'Marek Dupnitsa'],
      },
      {
        tierNumber: 3,
        tierName: 'Third League',
        popularLevel: 'Third Division',
        featuredTeams: ['Chernomorets Burgas', 'Litex Lovech', 'Balkan Botevgrad'],
      },
    ],
  },
  {
    country: 'Serbia',
    confederation: 'UEFA',
    flag: '🇷🇸',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Serbian SuperLiga',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Red Star Belgrade (Crvena zvezda)', 'Partizan Belgrade', 'TSC Backa Topola', 'Vojvodina'],
      },
      {
        tierNumber: 2,
        tierName: 'Serbian First League (Prva Liga)',
        popularLevel: 'Second Division',
        featuredTeams: ['Radnik Surdulica', 'Javor Ivanjica', 'OFK Beograd', 'Indjija', 'Macva Sabac'],
      },
    ],
  },
  {
    country: 'Hungary',
    confederation: 'UEFA',
    flag: '🇭🇺',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Nemzeti Bajnokság I (NB I)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Ferencváros', 'Paks', 'Fehérvár FC', 'Debrecen', 'Puskás Akadémia', 'Újpest'],
      },
      {
        tierNumber: 2,
        tierName: 'Nemzeti Bajnokság II (NB II)',
        popularLevel: 'Second Division',
        featuredTeams: ['Kisvárda', 'Mezőkövesd', 'Vasas FC', 'Honvéd', 'Szeged-Csanád', 'Győri ETO'],
      },
    ],
  },
  {
    country: 'Cyprus',
    confederation: 'UEFA',
    flag: '🇨🇾',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Cypriot First Division',
        popularLevel: 'Top-Flight',
        featuredTeams: ['APOEL Nicosia', 'AEK Larnaca', 'Omonia Nicosia', 'Aris Limassol', 'Pafos FC', 'Anorthosis'],
      },
      {
        tierNumber: 2,
        tierName: 'Cypriot Second Division',
        popularLevel: 'Second Division',
        featuredTeams: ['Othellos Athienou', 'AEZ Zakakiou', 'Doxa Katokopias', 'Olympiakos Nicosia'],
      },
    ],
  },

  // =========================================================================
  // 2. CAF (Africa)
  // =========================================================================
  {
    country: 'Egypt',
    confederation: 'CAF',
    flag: '🇪🇬',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Egyptian Premier League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Al Ahly', 'Zamalek', 'Pyramids FC', 'Modern Future', 'Al Masry', 'Smouha'],
      },
      {
        tierNumber: 2,
        tierName: 'Egyptian Second Division A',
        popularLevel: 'Second Division',
        featuredTeams: ['Baladiyat El Mahalla', 'El Dakhleya', 'Al Mokawloon Al Arab', 'Petrojet', 'Haras El Hodoud', 'Ghazl El Mahalla'],
      },
      {
        tierNumber: 3,
        tierName: 'Egyptian Second Division B',
        popularLevel: 'Third Division',
        featuredTeams: ['El Mansoura', 'Aswan SC', 'Tersana SC', 'Olympic Club Alexandria', 'Suez SC'],
      },
    ],
  },
  {
    country: 'Morocco',
    confederation: 'CAF',
    flag: '🇲🇦',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Botola Pro 1',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Wydad AC', 'Raja CA', 'AS FAR Rabat', 'RS Berkane', 'FUS Rabat', 'Olympic Safi'],
      },
      {
        tierNumber: 2,
        tierName: 'Botola Pro 2',
        popularLevel: 'Second Division',
        featuredTeams: ['Moghreb Tetouan', 'Youssoufia Berrechid', 'CODM Meknes', 'Kawkab Marrakech', 'Difaâ El Jadidi'],
      },
      {
        tierNumber: 3,
        tierName: 'National Amateur League',
        popularLevel: 'Third Division',
        featuredTeams: ['KAC Kenitra', 'TAS Casablanca', 'Chabab Rif Al Hoceima', 'Rachad Bernoussi'],
      },
    ],
  },
  {
    country: 'Tunisia',
    confederation: 'CAF',
    flag: '🇹🇳',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Tunisian Ligue Professionnelle 1',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Espérance de Tunis', 'Étoile du Sahel', 'Club Africain', 'CS Sfaxien', 'US Monastir'],
      },
      {
        tierNumber: 2,
        tierName: 'Tunisian Ligue Professionnelle 2',
        popularLevel: 'Second Division',
        featuredTeams: ['Stade Tunisien', 'JS Kairouan', 'AS Marsa', 'CS Hammam-Lif', 'EGS Gafsa'],
      },
    ],
  },
  {
    country: 'Algeria',
    confederation: 'CAF',
    flag: '🇩🇿',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Algerian Ligue Professionnelle 1',
        popularLevel: 'Top-Flight',
        featuredTeams: ['MC Alger', 'CR Belouizdad', 'JS Kabylie', 'USM Alger', 'ES Sétif', 'CS Constantine'],
      },
      {
        tierNumber: 2,
        tierName: 'Algerian Ligue 2',
        popularLevel: 'Second Division',
        featuredTeams: ['US Souf', 'ES Ben Aknoun', 'RC Kouba', 'Olympique Akbou', 'MSP Batna', 'WA Tlemcen'],
      },
    ],
  },
  {
    country: 'South Africa',
    confederation: 'CAF',
    flag: '🇿🇦',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'South African Premier Division (PSL)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Mamelodi Sundowns', 'Orlando Pirates', 'Kaizer Chiefs', 'Stellenbosch FC', 'SuperSport United'],
      },
      {
        tierNumber: 2,
        tierName: 'National First Division (Motsepe Foundation)',
        popularLevel: 'Second Division',
        featuredTeams: ['Cape Town Spurs', 'Black Leopards', 'Pretoria Callies', 'JDR Stars', 'Baroka FC', 'Milford FC'],
      },
    ],
  },
  {
    country: 'Nigeria',
    confederation: 'CAF',
    flag: '🇳🇬',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Nigeria Professional Football League (NPFL)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Enyimba FC', 'Remo Stars', 'Enugu Rangers', 'Rivers United', 'Shooting Stars', 'Kano Pillars'],
      },
      {
        tierNumber: 2,
        tierName: 'Nigeria National League (NNL)',
        popularLevel: 'Second Division',
        featuredTeams: ['Gombe United', 'Heartland FC', 'Warri Wolves', 'Gateway United', 'Vandrezzer FC'],
      },
    ],
  },
  {
    country: 'Ghana',
    confederation: 'CAF',
    flag: '🇬🇭',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Ghana Premier League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Asante Kotoko', 'Hearts of Oak', 'Aduana Stars', 'Medeama SC', 'Samartex 1996'],
      },
      {
        tierNumber: 2,
        tierName: 'National Division One',
        popularLevel: 'Second Division',
        featuredTeams: ['Real Tamale United', 'Bofoakwa Tano', 'Great Olympics', 'Liberty Professionals'],
      },
    ],
  },
  {
    country: 'Ivory Coast',
    confederation: 'CAF',
    flag: '🇨🇮',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Ligue 1',
        popularLevel: 'Top-Flight',
        featuredTeams: ['ASEC Mimosas', 'San Pédro', 'Africa Sports', 'Stade d\'Abidjan', 'Racing Club d\'Abidjan'],
      },
      {
        tierNumber: 2,
        tierName: 'Ligue 2',
        popularLevel: 'Second Division',
        featuredTeams: ['Stella Club d\'Adjamé', 'Bouaké FC', 'USC Bassam', 'Issia Wazi'],
      },
    ],
  },
  {
    country: 'Cameroon',
    confederation: 'CAF',
    flag: '🇨🇲',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Elite One',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Coton Sport FC', 'Canon Yaoundé', 'Union Douala', 'Colombe Sportive', 'Victoria United'],
      },
      {
        tierNumber: 2,
        tierName: 'Elite Two',
        popularLevel: 'Second Division',
        featuredTeams: ['Tonnerre Yaoundé', 'Panthère du Ndé', 'Racing Bafoussam', 'Unisport Bafang'],
      },
    ],
  },
  {
    country: 'Senegal',
    confederation: 'CAF',
    flag: '🇸🇳',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Ligue 1',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Teungueth FC', 'Génération Foot', 'Jaraaf', 'Casa Sports', 'Guédiawaye FC'],
      },
      {
        tierNumber: 2,
        tierName: 'Ligue 2',
        popularLevel: 'Second Division',
        featuredTeams: ['Stade de Mbour', 'Diambars FC', 'AS Douanes Dakar', 'NGB ASC Niary Tally'],
      },
    ],
  },
  {
    country: 'DR Congo',
    confederation: 'CAF',
    flag: '🇨🇩',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Linafoot Ligue 1',
        popularLevel: 'Top-Flight',
        featuredTeams: ['TP Mazembe', 'AS Vita Club', 'FC Saint-Éloi Lupopo', 'DC Motema Pembe', 'Maniema Union'],
      },
      {
        tierNumber: 2,
        tierName: 'Ligue 2',
        popularLevel: 'Second Division',
        featuredTeams: ['AS Dragons Bilima', 'Renaissance du Congo', 'AC Rangers', 'Sanga Balende'],
      },
    ],
  },
  {
    country: 'Angola',
    confederation: 'CAF',
    flag: '🇦🇴',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Girabola',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Petro de Luanda', 'Primeiro de Agosto', 'Sagrada Esperança', 'Interclube', 'Bravos do Maquis'],
      },
      {
        tierNumber: 2,
        tierName: 'Gira Angola',
        popularLevel: 'Second Division',
        featuredTeams: ['Recreativo do Libolo', 'Sporting de Cabinda', 'Progresso do Sambizanga', 'Académica do Lobito'],
      },
    ],
  },
  {
    country: 'Kenya',
    confederation: 'CAF',
    flag: '🇰🇪',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Kenyan Premier League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Gor Mahia', 'AFC Leopards', 'Tusker FC', 'Bandari FC', 'Kenya Commercial Bank'],
      },
      {
        tierNumber: 2,
        tierName: 'National Super League',
        popularLevel: 'Second Division',
        featuredTeams: ['Wazito FC', 'Muhoroni Youth', 'Nzoia Sugar', 'Shabana FC'],
      },
    ],
  },
  {
    country: 'Tanzania',
    confederation: 'CAF',
    flag: '🇹🇿',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Tanzanian Premier League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Young Africans (Yanga)', 'Simba SC', 'Azam FC', 'Singida Black Stars', 'Coastal Union'],
      },
      {
        tierNumber: 2,
        tierName: 'Championship',
        popularLevel: 'Second Division',
        featuredTeams: ['Mtibwa Sugar', 'Geita Gold', 'Stand United', 'Mbeya City'],
      },
    ],
  },
  {
    country: 'Zambia',
    confederation: 'CAF',
    flag: '🇿🇲',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Zambia Super League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['ZESCO United', 'Red Arrows', 'Power Dynamos', 'Nkana FC', 'Green Buffaloes'],
      },
      {
        tierNumber: 2,
        tierName: 'National Division One',
        popularLevel: 'Second Division',
        featuredTeams: ['Kansanshi Dynamos', 'Prison Leopards', 'Kabwe Warriors', 'Buildcon FC'],
      },
    ],
  },

  // =========================================================================
  // 3. AFC (Asia & Oceania)
  // =========================================================================
  {
    country: 'Saudi Arabia',
    confederation: 'AFC',
    flag: '🇸🇦',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Roshn Saudi League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Al Hilal', 'Al Nassr', 'Al Ittihad', 'Al Ahli Saudi', 'Al Taawoun', 'Al Shabab'],
      },
      {
        tierNumber: 2,
        tierName: 'Yelo League (First Division)',
        popularLevel: 'Second Division',
        featuredTeams: ['Al Hazem', 'Al Tai', 'Abha Club', 'Al Faisaly', 'Al Batin', 'Al Adalah', 'Al Najma'],
      },
      {
        tierNumber: 3,
        tierName: 'Second Division League',
        popularLevel: 'Third Division',
        featuredTeams: ['Al Shoalah', 'Hajer Club', 'Al Jeel', 'Al Qaisumah', 'Al Rawdhah'],
      },
      {
        tierNumber: 4,
        tierName: 'Third Division League',
        popularLevel: 'Lower League / Semi-Pro',
        featuredTeams: ['Al Qous', 'Mudhar', 'Afif', 'Al Ula FC', 'Qilwah'],
      },
    ],
  },
  {
    country: 'Japan',
    confederation: 'AFC',
    flag: '🇯🇵',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'J1 League (Meiji Yasuda)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Vissel Kobe', 'Yokohama F. Marinos', 'Kawasaki Frontale', 'Sanfrecce Hiroshima', 'Urawa Red Diamonds', 'Machida Zelvia'],
      },
      {
        tierNumber: 2,
        tierName: 'J2 League',
        popularLevel: 'Second Division',
        featuredTeams: ['Shimizu S-Pulse', 'Yokohama FC', 'V-Varen Nagasaki', 'Vegalta Sendai', 'JEF United Chiba', 'Montedio Yamagata'],
      },
      {
        tierNumber: 3,
        tierName: 'J3 League',
        popularLevel: 'Third Division',
        featuredTeams: ['Omiya Ardija', 'Matsumoto Yamaga', 'FC Gifu', 'Kataller Toyama', 'Zweigen Kanazawa'],
      },
      {
        tierNumber: 4,
        tierName: 'Japan Football League (JFL)',
        popularLevel: 'Lower League / Semi-Pro',
        featuredTeams: ['Honda FC', 'Briobecca Urayasu', 'Verspah Oita', 'ReinMeer Aomori'],
      },
    ],
  },
  {
    country: 'South Korea',
    confederation: 'AFC',
    flag: '🇰🇷',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'K League 1',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Ulsan HD', 'Jeonbuk Hyundai Motors', 'Pohang Steelers', 'FC Seoul', 'Gwangju FC', 'Incheon United'],
      },
      {
        tierNumber: 2,
        tierName: 'K League 2',
        popularLevel: 'Second Division',
        featuredTeams: ['Suwon Samsung Bluewings', 'Busan IPark', 'Seoul E-Land', 'Jeonnam Dragons', 'Seongnam FC'],
      },
      {
        tierNumber: 3,
        tierName: 'K3 League',
        popularLevel: 'Third Division',
        featuredTeams: ['Hwaseong FC', 'Gimhae FC', 'Daejeon Korail', 'Siheung Citizen'],
      },
    ],
  },
  {
    country: 'United Arab Emirates',
    confederation: 'AFC',
    flag: '🇦🇪',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'UAE Pro League (ADNOC)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Al Ain FC', 'Al Wasl', 'Shabab Al Ahli', 'Sharjah FC', 'Al Wahda', 'Al Jazira'],
      },
      {
        tierNumber: 2,
        tierName: 'First Division League',
        popularLevel: 'Second Division',
        featuredTeams: ['Emirates Club', 'Hatta Club', 'Dibba Al Fujairah', 'Al Dhafra', 'Dubai United'],
      },
    ],
  },
  {
    country: 'Qatar',
    confederation: 'AFC',
    flag: '🇶🇦',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Qatar Stars League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Al Sadd SC', 'Al Rayyan', 'Al Duhail', 'Al Gharafa', 'Al Arabi', 'Al Wakrah'],
      },
      {
        tierNumber: 2,
        tierName: 'Second Division League',
        popularLevel: 'Second Division',
        featuredTeams: ['Al Markhiya', 'Al Muaither', 'Al Sailiya', 'Al Kharaitiyat', 'Lusail City'],
      },
    ],
  },
  {
    country: 'Australia',
    confederation: 'AFC',
    flag: '🇦🇺',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'A-League Men',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Central Coast Mariners', 'Melbourne Victory', 'Sydney FC', 'Melbourne City', 'Wellington Phoenix', 'Western Sydney Wanderers'],
      },
      {
        tierNumber: 2,
        tierName: 'National Premier Leagues (NPL)',
        popularLevel: 'Second Division',
        featuredTeams: ['Sydney Olympic', 'South Melbourne FC', 'Heidelberg United', 'Adelaide City', 'APIA Leichhardt'],
      },
    ],
  },
  {
    country: 'China',
    confederation: 'AFC',
    flag: '🇨🇳',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Chinese Super League (CSL)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Shanghai Port', 'Shanghai Shenhua', 'Shandong Taishan', 'Beijing Guoan', 'Chengdu Rongcheng'],
      },
      {
        tierNumber: 2,
        tierName: 'China League One',
        popularLevel: 'Second Division',
        featuredTeams: ['Dalian Young Boy', 'Yunnan Yukun', 'Guangzhou FC', 'Suzhou Dongwu', 'Nanjing City'],
      },
      {
        tierNumber: 3,
        tierName: 'China League Two',
        popularLevel: 'Third Division',
        featuredTeams: ['Shaanxi Union', 'Guangdong GZ-Power', 'Hunan Billows', 'Langfang Glory City'],
      },
    ],
  },
  {
    country: 'India',
    confederation: 'AFC',
    flag: '🇮🇳',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Indian Super League (ISL)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Mohun Bagan SG', 'Mumbai City FC', 'Kerala Blasters', 'FC Goa', 'East Bengal FC', 'Bengaluru FC'],
      },
      {
        tierNumber: 2,
        tierName: 'I-League',
        popularLevel: 'Second Division',
        featuredTeams: ['Mohammedan SC', 'Gokulam Kerala', 'Sreenidi Deccan', 'Churchill Brothers', 'Aizawl FC'],
      },
      {
        tierNumber: 3,
        tierName: 'I-League 2',
        popularLevel: 'Third Division',
        featuredTeams: ['Sporting Clube de Goa', 'Dempo SC', 'Sudeva Delhi', 'Bengaluru United'],
      },
    ],
  },
  {
    country: 'Iran',
    confederation: 'AFC',
    flag: '🇮🇷',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Persian Gulf Pro League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Persepolis FC', 'Esteghlal FC', 'Sepahan SC', 'Tractor SC', 'Gol Gohar Sirjan'],
      },
      {
        tierNumber: 2,
        tierName: 'Azadegan League',
        popularLevel: 'Second Division',
        featuredTeams: ['Sanat Naft Abadan', 'Paykan FC', 'Fajr Sepasi', 'Kheybar Khorramabad', 'Saipa FC'],
      },
    ],
  },
  {
    country: 'Uzbekistan',
    confederation: 'AFC',
    flag: '🇺🇿',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Uzbekistan Super League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Pakhtakor Tashkent', 'Navbahor Namangan', 'Nasaf Qarshi', 'Bunyodkor', 'AGMK Almalyk'],
      },
      {
        tierNumber: 2,
        tierName: 'Pro League',
        popularLevel: 'Second Division',
        featuredTeams: ['Buxoro (Bukhara)', 'Kokand 1912', 'Mash\'al Mubarek', 'Shurtan Guzar', 'Olympic Mobiuz'],
      },
    ],
  },
  {
    country: 'Iraq',
    confederation: 'AFC',
    flag: '🇮🇶',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Iraq Stars League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Al-Shorta SC', 'Al-Quwa Al-Jawiya', 'Al-Zawraa', 'Al-Talaba', 'Erbil SC', 'Duhok SC'],
      },
      {
        tierNumber: 2,
        tierName: 'Iraqi Premier League',
        popularLevel: 'Second Division',
        featuredTeams: ['Amanat Baghdad', 'Al-Mina\'a', 'Al-Sinaa', 'Naft Al-Wasat', 'Al-Karkh'],
      },
    ],
  },
  {
    country: 'Jordan',
    confederation: 'AFC',
    flag: '🇯🇴',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Jordan Premier League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Al-Hussein Irbid', 'Al-Wehdat', 'Al-Faisaly Amman', 'Al-Ramtha', 'Shabab Al-Ordon'],
      },
      {
        tierNumber: 2,
        tierName: 'League Division 1',
        popularLevel: 'Second Division',
        featuredTeams: ['Sahab SC', 'Al-Jalil', 'Al-Baqa\'a', 'That Ras', 'Al-Yarmouk'],
      },
    ],
  },
  {
    country: 'Kuwait',
    confederation: 'AFC',
    flag: '🇰🇼',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Kuwait Premier League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Kuwait SC', 'Al-Arabi SC', 'Al-Qadsia', 'Al-Salmiya', 'Kazma SC'],
      },
      {
        tierNumber: 2,
        tierName: 'Division One',
        popularLevel: 'Second Division',
        featuredTeams: ['Al-Shabab Kuwait', 'Al-Jahra', 'Yarmouk SC', 'Khaitan SC', 'Al-Sahel'],
      },
    ],
  },
  {
    country: 'Oman',
    confederation: 'AFC',
    flag: '🇴🇲',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Oman Professional League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Al-Seeb Club', 'Dhofar Club', 'Al-Nahda', 'Oman Club', 'Sohar SC'],
      },
      {
        tierNumber: 2,
        tierName: 'First Division League',
        popularLevel: 'Second Division',
        featuredTeams: ['Al-Suwaiq', 'Mirbat SC', 'Muscat Club', 'Al-Taliya', 'Fanja SC'],
      },
    ],
  },

  // =========================================================================
  // 4. CONMEBOL (South America)
  // =========================================================================
  {
    country: 'Brazil',
    confederation: 'CONMEBOL',
    flag: '🇧🇷',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Campeonato Brasileiro Série A',
        popularLevel: 'Top-Flight',
        featuredTeams: ['CR Flamengo', 'Palmeiras', 'Botafogo', 'Atlético Mineiro', 'São Paulo FC', 'Grêmio', 'Internacional', 'Fluminense'],
      },
      {
        tierNumber: 2,
        tierName: 'Série B',
        popularLevel: 'Second Division',
        featuredTeams: ['Santos FC', 'América Mineiro', 'Coritiba', 'Goiás', 'Sport Recife', 'Ceará', 'Ponte Preta'],
      },
      {
        tierNumber: 3,
        tierName: 'Série C',
        popularLevel: 'Third Division',
        featuredTeams: ['Náutico', 'Figueirense', 'Londrina', 'Remo', 'Paysandu', 'Sampaio Corrêa', 'Volta Redonda'],
      },
      {
        tierNumber: 4,
        tierName: 'Série D',
        popularLevel: 'Lower League / Semi-Pro',
        featuredTeams: ['Portuguesa', 'Treze FC', 'América de Natal', 'Santa Cruz FC', 'Brasil de Pelotas'],
      },
    ],
  },
  {
    country: 'Argentina',
    confederation: 'CONMEBOL',
    flag: '🇦🇷',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Liga Profesional de Fútbol',
        popularLevel: 'Top-Flight',
        featuredTeams: ['River Plate', 'Boca Juniors', 'Racing Club', 'Independiente', 'San Lorenzo', 'Estudiantes de La Plata', 'Vélez Sarsfield'],
      },
      {
        tierNumber: 2,
        tierName: 'Primera Nacional',
        popularLevel: 'Second Division',
        featuredTeams: ['Colón de Santa Fe', 'Arsenal de Sarandí', 'Quilmes', 'San Martín de Tucumán', 'Chacarita Juniors', 'Ferro Carril Oeste'],
      },
      {
        tierNumber: 3,
        tierName: 'Primera B Metropolitana / Torneo Federal A',
        popularLevel: 'Third Division',
        featuredTeams: ['Los Andes', 'Villa Dálmine', 'Olimpo de Bahía Blanca', 'Douglas Haig', 'Comunicaciones'],
      },
    ],
  },
  {
    country: 'Uruguay',
    confederation: 'CONMEBOL',
    flag: '🇺🇾',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Primera División',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Peñarol', 'Club Nacional de Football', 'Defensor Sporting', 'Danubio FC', 'Liverpool FC Montevideo'],
      },
      {
        tierNumber: 2,
        tierName: 'Segunda División Profesional',
        popularLevel: 'Second Division',
        featuredTeams: ['Montevideo City Torque', 'Plaza Colonia', 'Albion FC', 'Rentistas', 'Juventud de Las Piedras'],
      },
      {
        tierNumber: 3,
        tierName: 'Primera División Amateur',
        popularLevel: 'Third Division',
        featuredTeams: ['Villa Española', 'Bella Vista', 'Central Español', 'Basáñez'],
      },
    ],
  },
  {
    country: 'Colombia',
    confederation: 'CONMEBOL',
    flag: '🇨🇴',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Categoría Primera A (Liga BetPlay)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Atlético Nacional', 'Millonarios', 'América de Cali', 'Junior FC Barranquilla', 'Independiente Santa Fe', 'Deportivo Cali'],
      },
      {
        tierNumber: 2,
        tierName: 'Categoría Primera B (Torneo BetPlay)',
        popularLevel: 'Second Division',
        featuredTeams: ['Unión Magdalena', 'Atlético Huila', 'Cúcuta Deportivo', 'Deportes Quindío', 'Real Cartagena'],
      },
    ],
  },
  {
    country: 'Chile',
    confederation: 'CONMEBOL',
    flag: '🇨🇱',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Primera División',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Colo-Colo', 'Universidad de Chile', 'Universidad Católica', 'Cobreloa', 'Unión Española', 'Palestino'],
      },
      {
        tierNumber: 2,
        tierName: 'Primera B',
        popularLevel: 'Second Division',
        featuredTeams: ['Curicó Unido', 'Magallanes', 'Santiago Wanderers', 'Deportes La Serena', 'Rangers de Talca'],
      },
      {
        tierNumber: 3,
        tierName: 'Segunda División',
        popularLevel: 'Third Division',
        featuredTeams: ['Deportes Puerto Montt', 'Fernández Vial', 'San Antonio Unido', 'Deportes Melipilla'],
      },
    ],
  },
  {
    country: 'Ecuador',
    confederation: 'CONMEBOL',
    flag: '🇪🇨',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'LigaPro Serie A',
        popularLevel: 'Top-Flight',
        featuredTeams: ['LDU Quito', 'Independiente del Valle', 'Barcelona SC Guayaquil', 'Emelec', 'El Nacional Quito'],
      },
      {
        tierNumber: 2,
        tierName: 'Serie B',
        popularLevel: 'Second Division',
        featuredTeams: ['Gualaceo SC', 'Guayaquil City', 'Cuniburo FC', 'Chacaritas FC', '9 de Octubre'],
      },
    ],
  },
  {
    country: 'Paraguay',
    confederation: 'CONMEBOL',
    flag: '🇵🇾',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Primera División',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Olimpia Asunción', 'Cerro Porteño', 'Libertad', 'Guaraní', 'Nacional Asunción'],
      },
      {
        tierNumber: 2,
        tierName: 'División Intermedia',
        popularLevel: 'Second Division',
        featuredTeams: ['Guaireña FC', 'Resistencia SC', 'Deportivo Recoleta', 'San Lorenzo', 'Rubio Ñu'],
      },
    ],
  },
  {
    country: 'Peru',
    confederation: 'CONMEBOL',
    flag: '🇵🇪',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Liga 1',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Universitario de Deportes', 'Alianza Lima', 'Sporting Cristal', 'FBC Melgar', 'Cienciano'],
      },
      {
        tierNumber: 2,
        tierName: 'Liga 2',
        popularLevel: 'Second Division',
        featuredTeams: ['Deportivo Municipal', 'Academia Cantolao', 'Santos FC Nazca', 'Juan Aurich', 'Pirata FC'],
      },
    ],
  },
  {
    country: 'Bolivia',
    confederation: 'CONMEBOL',
    flag: '🇧🇴',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Primera División',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Club Bolívar', 'The Strongest', 'Always Ready', 'Wilstermann', 'Oriente Petrolero'],
      },
      {
        tierNumber: 2,
        tierName: 'Copa Simón Bolívar',
        popularLevel: 'Second Division',
        featuredTeams: ['Libertad Gran Mamoré', 'Vaca Díez', 'Real Potosí', 'Destroyers', 'Universitario de Sucre'],
      },
    ],
  },
  {
    country: 'Venezuela',
    confederation: 'CONMEBOL',
    flag: '🇻🇪',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Liga FUTVE',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Deportivo Táchira', 'Caracas FC', 'Carabobo FC', 'Monagas SC', 'Academia Puerto Cabello', 'Zamora FC'],
      },
      {
        tierNumber: 2,
        tierName: 'Liga FUTVE 2',
        popularLevel: 'Second Division',
        featuredTeams: ['Mineros de Guayana', 'Hermanos Colmenárez', 'Deportivo Miranda', 'Marítimo de La Guaira'],
      },
    ],
  },

  // =========================================================================
  // 5. CONCACAF (North & Central America)
  // =========================================================================
  {
    country: 'United States & Canada',
    confederation: 'CONCACAF',
    flag: '🇺🇸',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Major League Soccer (MLS)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Inter Miami CF', 'Columbus Crew', 'LAFC', 'LA Galaxy', 'FC Cincinnati', 'Seattle Sounders', 'New York Red Bulls'],
      },
      {
        tierNumber: 2,
        tierName: 'USL Championship',
        popularLevel: 'Second Division',
        featuredTeams: ['Louisville City FC', 'Tampa Bay Rowdies', 'Charleston Battery', 'Sacramento Republic', 'Phoenix Rising', 'San Antonio FC', 'Indy Eleven'],
      },
      {
        tierNumber: 3,
        tierName: 'USL League One / MLS NEXT Pro',
        popularLevel: 'Third Division',
        featuredTeams: ['Richmond Kickers', 'Forward Madison', 'Greenville Triumph', 'Chattanooga Red Wolves', 'North Texas SC', 'Crown Legacy FC'],
      },
    ],
  },
  {
    country: 'Mexico',
    confederation: 'CONCACAF',
    flag: '🇲🇽',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Liga MX',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Club América', 'Chivas Guadalajara', 'CF Monterrey (Rayados)', 'Tigres UANL', 'Cruz Azul', 'Toluca', 'Pumas UNAM'],
      },
      {
        tierNumber: 2,
        tierName: 'Liga de Expansión MX',
        popularLevel: 'Second Division',
        featuredTeams: ['Atlante FC', 'Leones Negros UdeG', 'Celaya FC', 'Cancún FC', 'Atlético Morelia', 'Venados FC', 'Mineros de Zacatecas'],
      },
      {
        tierNumber: 3,
        tierName: 'Liga Premier (Segunda División)',
        popularLevel: 'Third Division',
        featuredTeams: ['Tampico Madero', 'Irapuato', 'Tecos FC', 'Gavilanes de Matamoros', 'Inter Playa del Carmen'],
      },
    ],
  },
  {
    country: 'Costa Rica',
    confederation: 'CONCACAF',
    flag: '🇨🇷',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Liga FPD (Promerica)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Deportivo Saprissa', 'LD Alajuelense', 'CS Herediano', 'CS Cartaginés', 'AD San Carlos'],
      },
      {
        tierNumber: 2,
        tierName: 'Liga de Ascenso',
        popularLevel: 'Second Division',
        featuredTeams: ['AD Santos de Guápiles', 'Puntarenas FC', 'Municipal Grecia', 'Uruguay de Coronado'],
      },
    ],
  },
  {
    country: 'Honduras',
    confederation: 'CONCACAF',
    flag: '🇭🇳',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Liga Nacional de Honduras',
        popularLevel: 'Top-Flight',
        featuredTeams: ['CD Olimpia', 'FC Motagua', 'Real CD España', 'CD Marathón', 'Olancho FC'],
      },
      {
        tierNumber: 2,
        tierName: 'Liga de Ascenso',
        popularLevel: 'Second Division',
        featuredTeams: ['Platense FC', 'CD Honduras Progreso', 'Real Juventud', 'Juticalpa FC'],
      },
    ],
  },
  {
    country: 'Panama',
    confederation: 'CONCACAF',
    flag: '🇵🇦',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Liga Panameña de Fútbol (LPF)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Tauro FC', 'CA Independiente (CAI)', 'CD Plaza Amador', 'San Francisco FC', 'Sporting San Miguelito'],
      },
      {
        tierNumber: 2,
        tierName: 'Liga Prom',
        popularLevel: 'Second Division',
        featuredTeams: ['Atlético Chiriquí', 'Alianza FC B', 'Colón C-3', 'Veraguas United'],
      },
    ],
  },
  {
    country: 'Guatemala',
    confederation: 'CONCACAF',
    flag: '🇬🇹',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Liga Nacional de Guatemala',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Comunicaciones FC', 'CSD Municipal', 'Antigua GFC', 'Cobán Imperial', 'Xelajú MC'],
      },
      {
        tierNumber: 2,
        tierName: 'Primera División',
        popularLevel: 'Second Division',
        featuredTeams: ['Deportivo Coatepeque', 'CSD Zacapa', 'Universidad SC', 'Aurora FC'],
      },
    ],
  },
  {
    country: 'Jamaica',
    confederation: 'CONCACAF',
    flag: '🇯🇲',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Jamaica Premier League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Cavalier FC', 'Mount Pleasant FA', 'Arnett Gardens', 'Waterhouse FC', 'Portmore United'],
      },
      {
        tierNumber: 2,
        tierName: 'Super Leagues (KSAFA / Western)',
        popularLevel: 'Second Division',
        featuredTeams: ['Harbour View FC', 'Humble Lions', 'Boys\' Town FC', 'Tivoli Gardens'],
      },
    ],
  },

  // =========================================================================
  // 6. OFC (Oceania Minor)
  // =========================================================================
  {
    country: 'New Zealand',
    confederation: 'OFC',
    flag: '🇳🇿',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'New Zealand National League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Auckland City FC', 'Wellington Olympic', 'Eastern Suburbs', 'Cashmere Technical', 'Napier City Rovers'],
      },
      {
        tierNumber: 2,
        tierName: 'Regional Leagues (Northern, Central, Southern)',
        popularLevel: 'Second Division',
        featuredTeams: ['Birkenhead United', 'Western Suburbs', 'Christchurch United', 'Miramar Rangers'],
      },
    ],
  },
  {
    country: 'Fiji',
    confederation: 'OFC',
    flag: '🇫🇯',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Fiji Premier League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Rewa FC', 'Ba FC', 'Suva FC', 'Lautoka FC', 'Labasa FC', 'Nadi FC'],
      },
      {
        tierNumber: 2,
        tierName: 'Senior League',
        popularLevel: 'Second Division',
        featuredTeams: ['Tavua FC', 'Navua FC', 'Tailevu Naitasiri', 'Dreketi FC'],
      },
    ],
  },
  {
    country: 'Solomon Islands',
    confederation: 'OFC',
    flag: '🇸🇧',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Telekom S-League',
        popularLevel: 'Top-Flight',
        featuredTeams: ['Central Coast FC', 'Solomon Warriors', 'Kossa FC', 'Marist FC', 'Henderson Eels'],
      },
    ],
  },
  {
    country: 'Tahiti (French Polynesia)',
    confederation: 'OFC',
    flag: '🇵🇫',
    pyramidTiers: [
      {
        tierNumber: 1,
        tierName: 'Tahiti Ligue 1 (Vini)',
        popularLevel: 'Top-Flight',
        featuredTeams: ['AS Pirae', 'AS Vénus', 'AS Tefana', 'AS Dragon', 'AS Central Sport'],
      },
      {
        tierNumber: 2,
        tierName: 'Ligue 2',
        popularLevel: 'Second Division',
        featuredTeams: ['AS Manu Ura', 'AS Tamarii Punaruu', 'AS Excelsior', 'AS Olympic Mahina'],
      },
    ],
  },
];

// Helper functions for search & filter
export function filterDirectory(
  query: string,
  confedFilter: string,
  tierFilter: number | 'ALL'
): DirectoryCountry[] {
  const q = query.trim().toLowerCase();

  return GLOBAL_LEAGUES_DIRECTORY.filter((countryItem) => {
    // Confed filter
    if (confedFilter !== 'ALL' && countryItem.confederation !== confedFilter) {
      return false;
    }

    // Match query against country
    const countryMatch = countryItem.country.toLowerCase().includes(q);

    // Filter tiers
    const matchingTiers = countryItem.pyramidTiers.filter((tier) => {
      if (tierFilter !== 'ALL' && tier.tierNumber !== tierFilter) {
        return false;
      }
      if (!q) return true;

      const tierMatch = tier.tierName.toLowerCase().includes(q);
      const teamMatch = tier.featuredTeams.some((t) => t.toLowerCase().includes(q));
      return countryMatch || tierMatch || teamMatch;
    });

    return matchingTiers.length > 0;
  }).map((countryItem) => {
    // If filtering by tier, prune non-matching tiers
    if (tierFilter === 'ALL' && !q) return countryItem;

    const filteredTiers = countryItem.pyramidTiers.filter((tier) => {
      if (tierFilter !== 'ALL' && tier.tierNumber !== tierFilter) return false;
      if (!q) return true;
      const tierMatch = tier.tierName.toLowerCase().includes(q);
      const teamMatch = tier.featuredTeams.some((t) => t.toLowerCase().includes(q));
      return countryItem.country.toLowerCase().includes(q) || tierMatch || teamMatch;
    });

    return {
      ...countryItem,
      pyramidTiers: filteredTiers,
    };
  });
}
