
import { Arena, Match, MatchEvent, MatchEventType, MatchStatus, MatchType, NewsItem, Team, Tournament, UserRole, Player, TacticalPosition, Notification, SocialConnection, UserAccount, SportType } from './types';

// Default "Super User" ID for mock data ownership (kept for type safety reference)
export const DEFAULT_DIRECTOR_ID = 'user-dir-1';

// --- CONFIG ---
export const SPORT_TYPE_DETAILS = {
  [SportType.FUTSAL]: { label: 'Futsal', players: 5 },
  [SportType.FUT6]: { label: 'Fut6', players: 6 },
  [SportType.FUT7]: { label: 'Fut7 Society', players: 7 },
  [SportType.FUT8]: { label: 'Fut8', players: 8 },
  [SportType.AMATEUR]: { label: 'Futebol Amador (Campo)', players: 11 },
  [SportType.PROFESSIONAL]: { label: 'Futebol Profissional', players: 11 }
};

// --- DATA GENERATORS ---

// 1. ARENAS
const GENERATED_ARENAS: Arena[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `arena-${i + 1}`,
  name: `Arena ${i + 1}`,
  address: `Rua do Esporte, ${100 + i}`,
  lat: -23.55052 + (Math.random() * 0.1),
  lng: -46.633308 + (Math.random() * 0.1)
}));
export const INITIAL_ARENAS = GENERATED_ARENAS;

// 2. TEAMS
const CITIES = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 'Curitiba', 'Salvador', 'Recife', 'Fortaleza', 'Brasília', 'Manaus'];
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#1e293b'];

const GENERATED_TEAMS: Team[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `t-${i + 1}`,
  name: `Time ${i + 1} FC`,
  shortName: `T${i + 1}`,
  city: CITIES[i % CITIES.length],
  logoColor: COLORS[i % COLORS.length],
  cover: `https://picsum.photos/seed/team${i}/1200/400`,
  wins: Math.floor(Math.random() * 10),
  draws: Math.floor(Math.random() * 5),
  losses: Math.floor(Math.random() * 5),
  goalsFor: Math.floor(Math.random() * 30),
  goalsAgainst: Math.floor(Math.random() * 20),
  points: 0, // Calculated later
  roster: Array.from({ length: 15 }).map((_, j) => ({
    id: `p-${i}-${j}`,
    name: `Jogador ${i}-${j}`,
    number: j + 1,
    position: (j === 0 ? 'GK' : j < 5 ? 'DEF' : j < 10 ? 'MID' : 'FWD') as Player['position'],
    stats: { goals: Math.floor(Math.random() * 5), assists: Math.floor(Math.random() * 3), yellowCards: 0, redCards: 0, matchesPlayed: 0 }
  })),
  tacticalFormation: [],
  createdBy: DEFAULT_DIRECTOR_ID,
  isDeleted: false
})).map(t => ({ ...t, points: (t.wins * 3) + t.draws }));

export const INITIAL_TEAMS = GENERATED_TEAMS;

// 3. USERS
export const MOCK_USERS: UserAccount[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `user-${i + 1}`,
  email: `user${i + 1}@example.com`,
  password: '123',
  name: `Usuário ${i + 1}`,
  role: i < 5 ? UserRole.DIRECTOR : i < 25 ? UserRole.COACH : i < 60 ? UserRole.PLAYER : i < 65 ? UserRole.REFEREE : UserRole.FAN,
  teamId: i < 60 && i >= 5 ? `t-${Math.floor((i - 5) / 2) + 1}` : null, // Assign coaches/players to teams
  location: CITIES[i % CITIES.length],
  avatar: `https://i.pravatar.cc/150?u=${i}`,
  cover: `https://picsum.photos/seed/user${i}/1200/400`
}));

// 4. TOURNAMENTS
export const INITIAL_TOURNAMENTS: Tournament[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `tour-${i + 1}`,
  name: `Copa ${i + 1}`,
  format: i % 2 === 0 ? 'LEAGUE' : 'KNOCKOUT',
  sportType: SportType.FUT7,
  status: 'ACTIVE',
  currentRound: 3,
  totalRounds: 10,
  createdBy: DEFAULT_DIRECTOR_ID,
  isDeleted: false,
  participatingTeamIds: GENERATED_TEAMS.slice(i * 4, (i * 4) + 4).map(t => t.id)
}));

// 5. MATCHES
export const INITIAL_MATCHES: Match[] = Array.from({ length: 40 }).map((_, i) => {
  const isFinished = i < 20;
  const isLive = i === 20;
  return {
    id: `m-${i + 1}`,
    homeTeamId: GENERATED_TEAMS[i % 20].id,
    awayTeamId: GENERATED_TEAMS[(i + 1) % 20].id,
    date: new Date(Date.now() + (i - 20) * 86400000).toISOString(),
    status: isFinished ? MatchStatus.FINISHED : isLive ? MatchStatus.LIVE : MatchStatus.SCHEDULED,
    type: i % 5 === 0 ? MatchType.FRIENDLY : MatchType.LEAGUE,
    sportType: SportType.FUT7,
    arenaId: GENERATED_ARENAS[i % 10].id,
    homeScore: isFinished ? Math.floor(Math.random() * 5) : 0,
    awayScore: isFinished ? Math.floor(Math.random() * 5) : 0,
    tournamentId: i % 5 !== 0 ? `tour-${(i % 5) + 1}` : undefined,
    round: i % 5 !== 0 ? 'Rodada 3' : undefined,
    events: [],
    chatMessages: [],
    createdBy: DEFAULT_DIRECTOR_ID,
    isDeleted: false,
    media: isFinished ? [
       { id: `med-${i}-1`, type: 'IMAGE', url: 'https://picsum.photos/seed/match1/400/300', uploadedBy: 'Admin', createdAt: new Date().toISOString() },
       { id: `med-${i}-2`, type: 'IMAGE', url: 'https://picsum.photos/seed/match2/400/300', uploadedBy: 'Admin', createdAt: new Date().toISOString() }
    ] : [],
    youtubeVideoId: isLive ? 'jfKfPfyJRdk' : undefined // Lofi Girl as mock live stream
  };
});

// 6. NEWS
export const MOCK_NEWS: NewsItem[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `news-${i}`,
  title: `Notícia Importante ${i + 1}`,
  excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  date: new Date().toISOString(),
  category: i % 2 === 0 ? 'Destaque' : 'Transferências',
  tournamentId: i < 5 ? `tour-${i + 1}` : undefined
}));

// 7. SOCIAL
export const INITIAL_NOTIFICATIONS: Notification[] = [];
export const INITIAL_SOCIAL: SocialConnection[] = [];

export const ROLE_DESCRIPTIONS = {
  [UserRole.DIRECTOR]: 'Gerenciar times, agendar jogos e aprovar desafios.',
  [UserRole.COACH]: 'Definir táticas, escalações e treinos.',
  [UserRole.PLAYER]: 'Ver estatísticas pessoais e calendário.',
  [UserRole.REFEREE]: 'Registrar resultados de partidas e súmulas.',
  [UserRole.FAN]: 'Acompanhar tabela, resultados e notícias.'
};

export const SAFE_TEAM: Team = {
  id: 'ghost',
  name: 'Time Desconhecido',
  shortName: '???',
  city: 'Desconhecida',
  logoColor: '#cbd5e1',
  cover: 'https://via.placeholder.com/1200x400',
  wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0,
  roster: [],
  tacticalFormation: [],
  createdBy: '',
  isDeleted: false
};
