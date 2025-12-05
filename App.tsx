import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Trophy, Calendar, Shield, Crown, Menu, X, Plus, CheckCircle, MapPin, 
  Home, Newspaper, Layout, Map, ArrowLeft, Filter, Save, Trash2, User, Activity, 
  MessageCircle, Settings, LogOut, Bell, Heart, UserPlus, Lock, ChevronDown, ChevronUp, AlertTriangle, Mail, Key,
  Camera, Briefcase, Whistle, Target, Grid, List as ListIcon, Play
} from 'lucide-react';
import { 
  UserRole, Team, Match, Arena, MatchStatus, MatchType, AppView, Tournament, MatchEventType, Player, TacticalPosition, ChatMessage, CurrentUser, Notification, SocialConnection, UserAccount, PlayerStats, SportType, MatchMedia
} from './types';
import { 
  INITIAL_ARENAS, INITIAL_MATCHES, INITIAL_TEAMS, INITIAL_TOURNAMENTS, MOCK_NEWS, ROLE_DESCRIPTIONS, DEFAULT_DIRECTOR_ID, INITIAL_NOTIFICATIONS, INITIAL_SOCIAL, MOCK_USERS, SAFE_TEAM, SPORT_TYPE_DETAILS
} from './constants';

import MatchCard from './components/MatchCard';
import StandingsTable from './components/StandingsTable';
import TacticsBoard from './components/TacticsBoard';
import MatchDetailView from './components/MatchDetailView';
import TournamentDetailView from './components/TournamentDetailView';
import UserProfileView from './components/UserProfileView';
import ArenasMapView from './components/ArenasMapView';

// --- Safe Fallback Objects (Prevents crash when data is empty) ---
const SAFE_ARENA: Arena = {
  id: 'ghost',
  name: 'Local Indefinido',
  address: '',
  lat: 0,
  lng: 0
};

// --- Page Transition Component ---
// Replaced Lottie with pure CSS animation for robustness
const PageTransition = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative">
         <div className="w-24 h-24 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"></div>
         <div className="absolute inset-0 flex items-center justify-center">
             <Trophy size={32} className="text-emerald-600 animate-bounce" />
         </div>
      </div>
      <p className="mt-4 text-emerald-800 font-bold tracking-widest animate-pulse">CARREGANDO...</p>
    </div>
  );
};

// --- Login & Registration Screen Component ---
interface LoginScreenProps {
  users: UserAccount[];
  teams: Team[];
  onLogin: (user: UserAccount) => void;
  onRegister: (newUser: UserAccount) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ users, teams, onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.FAN);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegistering) {
      // Registration Logic
      if (!name || !email || !password) {
        setError("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
      
      const emailExists = users.some(u => u.email === email);
      if (emailExists) {
        setError("Este email já está cadastrado.");
        return;
      }

      // Validate Team Selection
      if ((role === UserRole.COACH || role === UserRole.PLAYER || role === UserRole.FAN) && !selectedTeamId) {
         if (teams.length === 0) {
            setError("Não existem times cadastrados. Registre-se como DIRETOR primeiro para criar um time.");
            return;
         }
         setError("Por favor, selecione um time.");
         return;
      }

      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        email,
        password,
        name,
        role,
        location: location || 'Desconhecida',
        teamId: (role === UserRole.COACH || role === UserRole.PLAYER || role === UserRole.FAN) && selectedTeamId ? selectedTeamId : null
      };

      onRegister(newUser);
      onLogin(newUser); // Auto login after register
    } else {
      // Login Logic
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError("Email ou senha incorretos.");
      }
    }
  };

  const needsTeamSelection = role === UserRole.COACH || role === UserRole.PLAYER || role === UserRole.FAN;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 z-0"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div className="max-w-4xl w-full glass-panel-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 animate-in zoom-in-95 duration-500">
        
        {/* Brand Side */}
        <div className="md:w-1/2 p-12 text-white flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-emerald-600/80 to-teal-800/80 backdrop-blur-md">
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-inner border border-white/20">
                  <Trophy size={36} className="text-white drop-shadow-md icon-hover" />
                </div>
                <h1 className="text-4xl font-black tracking-tight drop-shadow-lg">LocalLegends</h1>
             </div>
             <p className="text-emerald-50 text-lg leading-relaxed mb-8 font-light">
               Eleve o nível do seu jogo. A plataforma definitiva para gestão esportiva.
             </p>
          </div>
          
          <div className="relative z-10 space-y-4">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-600 bg-slate-200 shadow-md">
                        <img src={`https://i.pravatar.cc/150?u=${i+20}`} alt="" className="w-full h-full rounded-full" />
                    </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-emerald-600 bg-white flex items-center justify-center text-xs font-bold text-emerald-800 shadow-md">+10k</div>
             </div>
             <p className="text-sm text-emerald-100/80 font-medium">Junte-se a milhares de atletas e diretores.</p>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>
        </div>

        {/* Form Side */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white/90 backdrop-blur-xl relative">
           <div className="max-w-sm w-full mx-auto">
             <h2 className="text-3xl font-bold text-slate-800 mb-2">
               {isRegistering ? 'Criar Conta' : 'Bem-vindo'}
             </h2>
             <p className="text-slate-500 mb-8 text-sm">
               {isRegistering ? 'Preencha seus dados para começar.' : 'Entre com suas credenciais para continuar.'}
             </p>
             
             {error && (
               <div className="mb-6 p-4 bg-red-50/80 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-3 backdrop-blur-sm animate-pulse">
                 <AlertTriangle size={18} /> {error}
               </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-5">
               {isRegistering && (
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Nome Completo</label>
                   <div className="relative group">
                     <User className="absolute left-3 top-3 text-slate-400 group-hover:text-emerald-500 transition-colors" size={18} />
                     <input 
                       type="text" 
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm shadow-inner input-focus-effect"
                       placeholder="Seu nome"
                       required
                     />
                   </div>
                 </div>
               )}

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email</label>
                 <div className="relative group">
                   <Mail className="absolute left-3 top-3 text-slate-400 group-hover:text-emerald-500 transition-colors" size={18} />
                   <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm shadow-inner input-focus-effect"
                     placeholder="seu@email.com"
                     required
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Senha</label>
                 <div className="relative group">
                   <Key className="absolute left-3 top-3 text-slate-400 group-hover:text-emerald-500 transition-colors" size={18} />
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm shadow-inner input-focus-effect"
                     placeholder="******"
                     required
                   />
                 </div>
               </div>

               {isRegistering && (
                 <>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Sua Cidade</label>
                     <div className="relative group">
                        <MapPin className="absolute left-3 top-3 text-slate-400 group-hover:text-emerald-500 transition-colors" size={18} />
                        <input 
                           type="text" 
                           value={location}
                           onChange={(e) => setLocation(e.target.value)}
                           className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm shadow-inner input-focus-effect"
                           placeholder="Ex: São Paulo, SP"
                        />
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Tipo de Conta</label>
                     <select 
                       value={role} 
                       onChange={(e) => setRole(e.target.value as UserRole)}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm cursor-pointer input-focus-effect"
                     >
                       <option value={UserRole.FAN}>Torcedor</option>
                       <option value={UserRole.PLAYER}>Jogador</option>
                       <option value={UserRole.COACH}>Técnico</option>
                       <option value={UserRole.DIRECTOR}>Diretor Esportivo</option>
                       <option value={UserRole.REFEREE}>Árbitro</option>
                     </select>
                   </div>

                   {needsTeamSelection && (
                     <div className="animate-in fade-in slide-in-from-top-2">
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                         {role === UserRole.FAN ? 'Time do Coração' : 'Time'}
                       </label>
                       {teams.length > 0 ? (
                         <div className="relative">
                            <select 
                                value={selectedTeamId}
                                onChange={(e) => setSelectedTeamId(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm cursor-pointer input-focus-effect"
                                required
                            >
                                <option value="">Selecione um time...</option>
                                {teams.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                         </div>
                       ) : (
                         <div className="text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                            Nenhum time disponível. Registre-se como <strong>Diretor</strong> primeiro para criar um time.
                         </div>
                       )}
                     </div>
                   )}
                 </>
               )}

               <button 
                 type="submit" 
                 className="btn-feedback w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 mt-6 tracking-wide text-sm uppercase"
               >
                 {isRegistering ? 'Cadastrar' : 'Entrar'}
               </button>
             </form>

             <div className="mt-8 text-center">
               <p className="text-xs text-slate-400 mb-2">
                 {isRegistering ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
               </p>
               <button 
                 onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
                 className="text-emerald-600 font-bold text-sm hover:text-emerald-700 transition btn-feedback"
               >
                 {isRegistering ? 'Fazer Login' : 'Criar Conta Grátis'}
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // --- Global State ---
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [isLoading, setIsLoading] = useState(false); // Transition state

  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [arenas, setArenas] = useState<Arena[]>(INITIAL_ARENAS);
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  
  // Social Graph & Notifications State
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [socialGraph, setSocialGraph] = useState<SocialConnection[]>(INITIAL_SOCIAL);

  // Navigation / UI State
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [isArenasMapMode, setIsArenasMapMode] = useState(false);
  
  // Home Feed Specific State
  const [homeFeedTournamentId, setHomeFeedTournamentId] = useState<string | null>(null);
  const [homeFeaturedStatus, setHomeFeaturedStatus] = useState<MatchStatus | 'ALL'>('ALL');
  
  // MATCH LIST FILTERS
  const [matchContextFilter, setMatchContextFilter] = useState<string>('ALL'); // Type/Tournament
  const [matchStatusFilter, setMatchStatusFilter] = useState<MatchStatus | 'ALL'>('ALL'); // Status
  const [showOtherGames, setShowOtherGames] = useState(false);

  const [viewingTeamId, setViewingTeamId] = useState<string | null>(null);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [teamMatchFilter, setTeamMatchFilter] = useState<'UPCOMING' | 'FINISHED'>('UPCOMING');

  // Modals / Detail Views State
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false); 
  const [isArenaModalOpen, setIsArenaModalOpen] = useState(false); // Arena Creation
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedTeamIdForInvite, setSelectedTeamIdForInvite] = useState<string | null>(null);
  
  // FAB State
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'MATCH' | 'TEAM' | 'TOURNAMENT' | 'USER'} | null>(null);

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState<{player: Player, teamName: string} | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  // --- View Transition Handler ---
  const changeView = (newView: AppView) => {
    if (newView === currentView) return;
    setIsLoading(true);
    setTimeout(() => {
        setCurrentView(newView);
        setSelectedTournamentId(null); 
        setSelectedMatchId(null); 
        setViewingTeamId(null);
        setIsLoading(false);
    }, 800); // 800ms fake load for effect
  };

  // --- Derived Data ---
  // Filter out deleted items (Soft Delete)
  const activeMatches = useMemo(() => matches.filter(m => !m.isDeleted), [matches]);
  const activeTeams = useMemo(() => teams.filter(t => !t.isDeleted), [teams]);
  const activeTournaments = useMemo(() => tournaments.filter(t => !t.isDeleted), [tournaments]);

  const upcomingMatches = useMemo(() => 
    activeMatches.filter(m => m.status !== MatchStatus.FINISHED).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()), 
  [activeMatches]);

  const unreadNotifications = notifications.filter(n => n.toUserId === currentUser?.id && !n.isRead);

  // --- Helpers (Safe Accessors) ---
  const getTeam = (id: string) => teams.find(t => t.id === id) || { ...SAFE_TEAM, id: id };
  const getArena = (id: string) => arenas.find(a => a.id === id) || { ...SAFE_ARENA, id: id };
  const canManage = currentUser?.role === UserRole.DIRECTOR;
  
  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  // --- Session Management ---
  const handleLogin = (user: UserAccount) => {
    setIsLoading(true);
    setTimeout(() => {
        setCurrentUser({
        id: user.id,
        name: user.name,
        role: user.role,
        teamId: user.teamId,
        email: user.email,
        location: user.location,
        avatar: user.avatar
        });
        
        if (user.role === UserRole.DIRECTOR) setCurrentView('HOME');
        else if (user.role === UserRole.COACH || user.role === UserRole.PLAYER) setCurrentView('TEAMS');
        else setCurrentView('HOME');
        setIsLoading(false);
    }, 1000);
  };

  const handleRegister = (newUser: UserAccount) => {
    setUserAccounts(prev => [...prev, newUser]);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
        setCurrentUser(null);
        setSelectedMatchId(null);
        setCurrentView('HOME');
        setViewingProfileId(null);
        setHomeFeedTournamentId(null);
        setIsLoading(false);
    }, 800);
  };

  const handleTeamClick = (teamId: string) => {
    setViewingTeamId(teamId);
    setCurrentView('TEAMS');
    setSelectedMatchId(null);
    setSelectedTournamentId(null);
    setIsEditingTeam(false);
  };

  const handleUpdateProfile = (updatedUser: UserAccount) => {
    setUserAccounts(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(prev => prev ? ({
            ...prev,
            name: updatedUser.name,
            location: updatedUser.location,
            avatar: updatedUser.avatar,
            teamId: updatedUser.teamId, // Update context if changed
            role: updatedUser.role // Ensure role is updated in session
        }) : null);
    }
    alert("Perfil atualizado com sucesso!");
  };

  // --- Actions ---

  // MATCH CRUD
  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSaveMatch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    const formData = new FormData(event.currentTarget);
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const videoId = youtubeUrl ? extractYoutubeId(youtubeUrl) : undefined;
    
    const newMatch: Match = {
      id: editingMatch ? editingMatch.id : `m${Date.now()}`,
      createdBy: editingMatch ? editingMatch.createdBy : currentUser.id,
      isDeleted: false,
      homeTeamId: formData.get('homeTeamId') as string,
      awayTeamId: formData.get('awayTeamId') as string,
      date: formData.get('date') as string,
      arenaId: formData.get('arenaId') as string,
      type: formData.get('type') as MatchType,
      sportType: formData.get('sportType') as SportType,
      status: editingMatch ? editingMatch.status : MatchStatus.SCHEDULED,
      tournamentId: formData.get('tournamentId') ? formData.get('tournamentId') as string : undefined,
      round: formData.get('round') as string,
      homeScore: editingMatch?.homeScore || 0,
      awayScore: editingMatch?.awayScore || 0,
      events: editingMatch?.events || [],
      chatMessages: editingMatch?.chatMessages || [],
      homeTactics: editingMatch?.homeTactics,
      awayTactics: editingMatch?.awayTactics,
      youtubeVideoId: videoId || editingMatch?.youtubeVideoId,
      media: editingMatch?.media || []
    };

    if (editingMatch) {
      setMatches(prev => prev.map(m => m.id === editingMatch.id ? newMatch : m));
    } else {
      setMatches(prev => [...prev, newMatch]);
    }
    
    setIsMatchModalOpen(false);
    setEditingMatch(null);
  };

  const handleAddMatchMedia = (matchId: string, type: 'IMAGE' | 'VIDEO', url: string) => {
     if (!currentUser) return;
     const newMedia: MatchMedia = {
        id: `med-${Date.now()}`,
        type,
        url,
        uploadedBy: currentUser.name,
        createdAt: new Date().toISOString()
     };

     setMatches(prev => prev.map(m => {
        if (m.id === matchId) {
           return { ...m, media: [...m.media, newMedia] };
        }
        return m;
     }));
     alert("Mídia adicionada com sucesso!");
  };

  const openDeleteModal = (id: string, type: 'MATCH' | 'TEAM' | 'TOURNAMENT' | 'USER') => {
      setItemToDelete({ id, type });
  };

  const executeDeletion = () => {
    if (!itemToDelete || !currentUser) return;
    
    const { id, type } = itemToDelete;

    if (type === 'MATCH') {
        const item = matches.find(m => m.id === id);
        if (item && item.createdBy === currentUser.id) {
            setMatches(prev => prev.map(m => m.id === id ? { ...m, isDeleted: true } : m));
            setSelectedMatchId(null);
            setIsMatchModalOpen(false);
        } else {
            alert("Você não tem permissão para excluir este item.");
        }
    } else if (type === 'TEAM') {
        const item = teams.find(t => t.id === id);
        if (item && item.createdBy === currentUser.id) {
            setTeams(prev => prev.map(t => t.id === id ? { ...t, isDeleted: true } : t));
            setViewingTeamId(null);
        } else {
            alert("Você não tem permissão para excluir este time.");
        }
    } else if (type === 'TOURNAMENT') {
        const item = tournaments.find(t => t.id === id);
        if (item && item.createdBy === currentUser.id) {
            setTournaments(prev => prev.map(t => t.id === id ? { ...t, isDeleted: true } : t));
            setSelectedTournamentId(null);
        } else {
             alert("Você não tem permissão para excluir este campeonato.");
        }
    } else if (type === 'USER') {
        // Mock User Deletion (Admin only)
        if (currentUser.role === UserRole.DIRECTOR) {
             // In real app, we would mark account deleted
             setUserAccounts(prev => prev.filter(u => u.id !== id));
             alert("Usuário removido.");
        }
    }

    setItemToDelete(null);
  };

  const handleUpdateScore = (matchId: string, homeScore: number, awayScore: number, status: MatchStatus) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return { ...m, homeScore, awayScore, status };
      }
      return m;
    }));
  };

  const handleAddEvent = (type: MatchEventType, teamId: string | null, playerId: string | null, minute: number) => {
    if (!selectedMatchId) return;

    const matchToUpdate = matches.find(m => m.id === selectedMatchId);
    if (!matchToUpdate) return;

    const newEvent = {
      id: `evt-${Date.now()}`,
      type,
      minute,
      teamId: teamId || undefined,
      playerId: playerId || undefined,
      playerName: playerId ? teams.flatMap(t => t.roster).find(p => p.id === playerId)?.name : undefined,
      description: type === MatchEventType.START ? 'Início' : type === MatchEventType.END ? 'Fim' : undefined
    };

    let newHomeScore = matchToUpdate.homeScore;
    let newAwayScore = matchToUpdate.awayScore;

    if (type === MatchEventType.GOAL && teamId) {
      if (teamId === matchToUpdate.homeTeamId) newHomeScore++;
      if (teamId === matchToUpdate.awayTeamId) newAwayScore++;
    }

    setMatches(prev => prev.map(m => m.id === selectedMatchId ? {
      ...m,
      homeScore: newHomeScore,
      awayScore: newAwayScore,
      status: type === MatchEventType.START ? MatchStatus.LIVE : type === MatchEventType.END ? MatchStatus.FINISHED : MatchStatus.LIVE,
      events: [...m.events, newEvent]
    } : m));

    if (playerId && teamId) {
      setTeams(prevTeams => prevTeams.map(team => {
        if (team.id !== teamId) return team;
        
        return {
          ...team,
          roster: team.roster.map(player => {
            if (player.id !== playerId) return player;
            const newStats = { ...player.stats };
            if (type === MatchEventType.GOAL) newStats.goals++;
            if (type === MatchEventType.YELLOW_CARD) newStats.yellowCards++;
            if (type === MatchEventType.RED_CARD) newStats.redCards++;
            if (type === MatchEventType.START) newStats.matchesPlayed++;
            return { ...player, stats: newStats };
          })
        };
      }));
    }
  };

  const handleSendMessage = (matchId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      text,
      timestamp: new Date().toISOString(),
      teamId: currentUser.teamId || undefined
    };

    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return { ...m, chatMessages: [...m.chatMessages, newMessage] };
      }
      return m;
    }));
  };

  const handleSaveMatchTactics = (matchId: string, teamId: string, newPositions: TacticalPosition[]) => {
      setMatches(prev => prev.map(m => {
          if (m.id !== matchId) return m;
          
          if (teamId === m.homeTeamId) {
              return { ...m, homeTactics: newPositions };
          } else if (teamId === m.awayTeamId) {
              return { ...m, awayTactics: newPositions };
          }
          return m;
      }));
      alert("Tática salva para esta partida!");
  };

  const handleSaveTeamTactics = (teamId: string, newPositions: TacticalPosition[]) => {
     setTeams(prev => prev.map(t => t.id === teamId ? { ...t, tacticalFormation: newPositions } : t));
     alert("Formação padrão atualizada!");
  };

  const applyTacticalPreset = (teamId: string, formation: '4-4-2' | '4-3-3' | '3-5-2') => {
      const team = getTeam(teamId);
      let newPositions: TacticalPosition[] = [];
      const rosterIds = team.roster.map(p => p.id);
      
      if (rosterIds.length === 0) return;

      const getPos = (idx: number, x: number, y: number) => {
          if (idx < rosterIds.length) newPositions.push({ playerId: rosterIds[idx], x, y });
      };

      // Always GK at 0
      getPos(0, 50, 90);

      if (formation === '4-4-2') {
          // Def
          getPos(1, 15, 70); getPos(2, 40, 70); getPos(3, 60, 70); getPos(4, 85, 70);
          // Mid
          getPos(5, 15, 45); getPos(6, 40, 45); getPos(7, 60, 45); getPos(8, 85, 45);
          // Fwd
          getPos(9, 35, 20); getPos(10, 65, 20);
      } else if (formation === '4-3-3') {
          // Def
          getPos(1, 15, 70); getPos(2, 40, 70); getPos(3, 60, 70); getPos(4, 85, 70);
          // Mid
          getPos(5, 50, 50); getPos(6, 30, 40); getPos(7, 70, 40);
          // Fwd
          getPos(8, 15, 20); getPos(9, 50, 20); getPos(10, 85, 20);
      } else if (formation === '3-5-2') {
          // Def
          getPos(1, 30, 75); getPos(2, 50, 75); getPos(3, 70, 75);
          // Mid
          getPos(4, 15, 50); getPos(5, 35, 50); getPos(6, 50, 45); getPos(7, 65, 50); getPos(8, 85, 50);
          // Fwd
          getPos(9, 40, 20); getPos(10, 60, 20);
      }

      handleSaveTeamTactics(teamId, newPositions);
  };

  // TEAM CRUD (Simplified for Director)
  const handleCreateTeam = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;
    const formData = new FormData(event.currentTarget);
    const teamName = formData.get('teamName') as string;
    const shortName = formData.get('shortName') as string || teamName.substring(0,3).toUpperCase();
    const city = formData.get('city') as string || 'Desconhecida';
    const logoColor = formData.get('logoColor') as string || '#10b981';
    
    // Create new Team
    const newTeam: Team = {
      id: `t-${Date.now()}`,
      name: teamName,
      shortName: shortName,
      city,
      logoColor: logoColor,
      cover: 'https://picsum.photos/1200/400',
      wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0,
      roster: [], 
      tacticalFormation: [],
      createdBy: currentUser.id,
      isDeleted: false
    };

    setTeams([...teams, newTeam]);
    setIsTeamModalOpen(false);
  };

  const handleUpdateTeam = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!viewingTeamId) return;
      const formData = new FormData(event.currentTarget);
      
      const updatedName = formData.get('name') as string;
      const updatedColor = formData.get('logoColor') as string;
      const updatedCover = formData.get('cover') as string;

      setTeams(prev => prev.map(t => t.id === viewingTeamId ? {
          ...t,
          name: updatedName,
          logoColor: updatedColor,
          cover: updatedCover
      } : t));
      setIsEditingTeam(false);
  };

  // ARENA CRUD
  const handleCreateArena = (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     const formData = new FormData(event.currentTarget);
     const newArena: Arena = {
        id: `arena-${Date.now()}`,
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        lat: parseFloat(formData.get('lat') as string) || 0,
        lng: parseFloat(formData.get('lng') as string) || 0
     };
     setArenas([...arenas, newArena]);
     setIsArenaModalOpen(false);
  };

  // TOURNAMENT CRUD
  const handleSaveTournament = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    const formData = new FormData(event.currentTarget);
    
    const newTournament: Tournament = {
      id: `tour-${Date.now()}`,
      createdBy: currentUser.id,
      isDeleted: false,
      name: formData.get('name') as string,
      format: formData.get('format') as 'LEAGUE' | 'KNOCKOUT',
      sportType: formData.get('sportType') as SportType,
      status: 'ACTIVE',
      currentRound: 1,
      totalRounds: parseInt(formData.get('totalRounds') as string) || 1,
      participatingTeamIds: [] // Populate later or add selector
    };

    setTournaments([...tournaments, newTournament]);
    setIsTournamentModalOpen(false);
  };

  const handleUpdateTournament = (updatedTournament: Tournament) => {
      setTournaments(prev => prev.map(t => t.id === updatedTournament.id ? updatedTournament : t));
      alert("Campeonato atualizado!");
  };

  // --- Social Logic ---
  const handleFollow = (targetId: string) => {
    if (!currentUser) return;
    const existing = socialGraph.find(s => s.followerId === currentUser.id && s.targetId === targetId);
    
    if (existing) {
      // Unfollow
      setSocialGraph(prev => prev.filter(s => s.id !== existing.id));
    } else {
      // Follow
      setSocialGraph(prev => [...prev, {
        id: `sc-${Date.now()}`,
        followerId: currentUser.id,
        targetId,
        targetType: 'TEAM' // Simplified for this demo
      }]);
    }
  };

  const handleSendInvite = (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     if (!currentUser || !selectedTeamIdForInvite) return;
     
     const formData = new FormData(event.currentTarget);
     const inviteEmail = formData.get('email') as string;

     // Mock check if user exists
     const targetUser = userAccounts.find(u => u.email === inviteEmail);
     const inviteTeam = getTeam(selectedTeamIdForInvite);
     
     if (targetUser) {
        const newNotif: Notification = {
           id: `not-${Date.now()}`,
           type: 'TEAM_INVITE',
           fromId: currentUser.id,
           fromName: currentUser.name,
           toUserId: targetUser.id,
           data: { teamId: selectedTeamIdForInvite, teamName: inviteTeam.name },
           isRead: false
        };
        setNotifications([...notifications, newNotif]);
        alert(`Convite enviado para ${targetUser.name}!`);
     } else {
        alert("Usuário não encontrado (Simulação: Convite enviado por email).");
     }
     setIsInviteModalOpen(false);
     setSelectedTeamIdForInvite(null);
  };

  const handleSendTournamentInvite = (tournamentId: string, teamId: string) => {
    if (!currentUser) return;
    
    const tournament = activeTournaments.find(t => t.id === tournamentId);
    const team = getTeam(teamId);
    
    // Find Team Owner (Director)
    const teamOwner = userAccounts.find(u => u.id === team.createdBy);
    
    if (teamOwner) {
       const newNotif: Notification = {
          id: `not-tour-${Date.now()}`,
          type: 'TOURNAMENT_INVITE',
          fromId: currentUser.id,
          fromName: currentUser.name,
          toUserId: teamOwner.id,
          data: { 
             tournamentId: tournament?.id, 
             tournamentName: tournament?.name,
             teamId: team.id,
             teamName: team.name
          },
          isRead: false
       };
       setNotifications(prev => [...prev, newNotif]);
       alert(`Convite enviado para o diretor do ${team.name}!`);
    } else {
       alert("Não foi possível encontrar o diretor deste time para enviar o convite.");
    }
  };

  const handleAcceptInvite = (notificationId: string) => {
    const notif = notifications.find(n => n.id === notificationId);
    if (!notif || !currentUser) return;

    if (notif.type === 'TEAM_INVITE') {
        // Simulate joining team
        setCurrentUser(prev => prev ? ({ ...prev, teamId: notif.data?.teamId || null }) : null);
        alert(`Você aceitou o convite para entrar no ${notif.data?.teamName}!`);
    } else if (notif.type === 'TOURNAMENT_INVITE') {
        // Add team to tournament
        if (notif.data?.tournamentId && notif.data?.teamId) {
           setTournaments(prev => prev.map(t => {
              if (t.id === notif.data?.tournamentId) {
                  return { ...t, participatingTeamIds: [...t.participatingTeamIds, notif.data?.teamId as string] };
              }
              return t;
           }));
           alert(`O time ${notif.data.teamName} foi inscrito no ${notif.data.tournamentName}!`);
        }
    }
    
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  // --- Views Renders ---

  if (!currentUser) {
    if (isLoading) return <PageTransition />;
    return <LoginScreen users={userAccounts} teams={activeTeams} onLogin={handleLogin} onRegister={handleRegister} />;
  }
  
  // Show transition if Loading
  if (isLoading) return <PageTransition />;

  // PROFILE VIEW (Replaces other views if set)
  if (viewingProfileId) {
     const profileUser = userAccounts.find(u => u.id === viewingProfileId);
     
     if (!profileUser) return <div>Usuário não encontrado</div>;

     return (
        <UserProfileView 
           viewingUser={profileUser}
           currentUser={currentUser}
           teams={teams}
           socialGraph={socialGraph}
           onClose={() => setViewingProfileId(null)}
           onUpdateProfile={handleUpdateProfile}
           onFollow={handleFollow}
           onTeamClick={handleTeamClick}
           onDeleteUser={(id) => openDeleteModal(id, 'USER')}
        />
     );
  }

  if (selectedMatchId && selectedMatch) {
    return (
      <MatchDetailView 
        match={selectedMatch}
        homeTeam={getTeam(selectedMatch.homeTeamId)}
        awayTeam={getTeam(selectedMatch.awayTeamId)}
        currentUser={currentUser}
        onClose={() => setSelectedMatchId(null)}
        onAddEvent={handleAddEvent}
        onViewPlayer={(player, teamName) => setSelectedPlayerForProfile({ player, teamName })}
        onSendMessage={handleSendMessage}
        onSaveMatchTactics={handleSaveMatchTactics}
        onAddMedia={handleAddMatchMedia}
      />
    );
  }

  const renderHomeView = () => {
    // 1. North Star Logic: Fan Feed
    let fanMatches = upcomingMatches;
    let fanNews = MOCK_NEWS;
    
    // Filter news/matches based on followed teams + user's team
    const followedTeamIds = socialGraph.filter(s => s.followerId === currentUser.id).map(s => s.targetId);
    if (currentUser.teamId) followedTeamIds.push(currentUser.teamId);

    if (currentUser.role === UserRole.FAN && followedTeamIds.length > 0) {
       fanMatches = upcomingMatches.filter(m => followedTeamIds.includes(m.homeTeamId) || followedTeamIds.includes(m.awayTeamId));
       fanNews = MOCK_NEWS.filter(n => !n.teamId || followedTeamIds.includes(n.teamId));
    }
    
    // FILTER FEATURED MATCH BY STATUS (NEW)
    const featuredMatchToDisplay = (fanMatches.length > 0 ? fanMatches : upcomingMatches).filter(m => {
       if (homeFeaturedStatus === 'ALL') return true;
       return m.status === homeFeaturedStatus;
    })[0];

    // 2. North Star Logic: Referee Insights
    const refereeAssignedMatches = currentUser.role === UserRole.REFEREE ? upcomingMatches.slice(0, 3) : []; // Simulate assignments
    
    const getTeamForm = (teamId: string) => {
       return matches
        .filter(m => m.status === MatchStatus.FINISHED && (m.homeTeamId === teamId || m.awayTeamId === teamId))
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
        .map(m => {
           const isHome = m.homeTeamId === teamId;
           const teamScore = isHome ? m.homeScore : m.awayScore;
           const oppScore = isHome ? m.awayScore : m.homeScore;
           if (teamScore > oppScore) return { res: 'W', color: 'bg-emerald-500' };
           if (teamScore < oppScore) return { res: 'L', color: 'bg-red-500' };
           return { res: 'D', color: 'bg-slate-500' };
        });
    };

    // 3. Dropdown for Championships (Context Aware)
    let visibleTournaments = activeTournaments;
    if (currentUser.teamId) {
      visibleTournaments = activeTournaments.filter(t => t.participatingTeamIds?.includes(currentUser.teamId!));
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel-dark rounded-3xl p-8 text-white shadow-xl relative overflow-hidden bg-gradient-to-r from-emerald-600/90 to-teal-800/90 interactive-card">
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-2 tracking-tight">
                Olá, {currentUser.name}
              </h2>
              <p className="opacity-90 mb-6 text-emerald-100 font-medium">{ROLE_DESCRIPTIONS[currentUser.role]}</p>
              
              {currentUser.teamId && (
                 <div className="mb-6 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors cursor-pointer interactive-card">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Seu Time</span>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
                       <span className="font-bold text-xl">{getTeam(currentUser.teamId).name}</span>
                    </div>
                 </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => changeView('MATCHES')} className="btn-feedback bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold shadow-lg shadow-black/10 text-sm">
                  Ver Jogos
                </button>
                {canManage && (
                  <button onClick={() => setIsMatchModalOpen(true)} className="btn-feedback bg-emerald-700/50 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600/50 transition text-sm flex items-center gap-2 border border-emerald-400/30 backdrop-blur-md">
                    <Plus size={18} /> Criar Jogo
                  </button>
                )}
              </div>
            </div>
            {/* Background decoration */}
            <Trophy className="absolute -bottom-8 -right-8 text-white opacity-10 rotate-12" size={240} />
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-[100px] opacity-30"></div>
          </div>

          {/* REFEREE INSIGHTS */}
          {currentUser.role === UserRole.REFEREE && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Shield className="text-purple-600 icon-hover" size={20} />
                Jogos Atribuídos & Insights
              </h3>
              {refereeAssignedMatches.length > 0 ? refereeAssignedMatches.map(match => (
                <div key={match.id} className="glass-panel p-5 rounded-2xl border-l-4 border-l-purple-500 relative overflow-hidden interactive-card">
                   <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl">Atribuído</div>
                   <div className="flex justify-between items-center mb-4 mt-2">
                      <div className="flex flex-col items-center gap-2">
                         <span className="font-bold text-lg">{getTeam(match.homeTeamId).shortName}</span>
                         <div className="flex gap-1">
                           {getTeamForm(match.homeTeamId).map((f, i) => <div key={i} className={`w-2 h-2 rounded-full ${f.color}`}></div>)}
                         </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">VS</span>
                      <div className="flex flex-col items-center gap-2">
                         <span className="font-bold text-lg">{getTeam(match.awayTeamId).shortName}</span>
                         <div className="flex gap-1">
                           {getTeamForm(match.awayTeamId).map((f, i) => <div key={i} className={`w-2 h-2 rounded-full ${f.color}`}></div>)}
                         </div>
                      </div>
                   </div>
                   <button onClick={() => setSelectedMatchId(match.id)} className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-bold text-slate-700 transition btn-feedback">
                     Abrir Súmula Digital
                   </button>
                </div>
              )) : (
                <div className="p-6 glass-panel rounded-2xl text-slate-400 text-sm text-center">Nenhum jogo atribuído para hoje.</div>
              )}
            </div>
          )}

          {/* FEATURED MATCHES (Fan/Normal) */}
          {currentUser.role !== UserRole.REFEREE && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <Calendar className="text-emerald-500 icon-hover" size={24} />
                    {currentUser.role === UserRole.FAN && currentUser.teamId ? 'Próximo Jogo' : 'Destaque'}
                  </h3>
                  <select 
                     value={homeFeaturedStatus} 
                     onChange={(e) => setHomeFeaturedStatus(e.target.value as MatchStatus | 'ALL')}
                     className="text-xs border-none bg-white/50 backdrop-blur rounded-lg p-2 font-bold text-slate-600 shadow-sm focus:ring-0 cursor-pointer input-focus-effect"
                  >
                     <option value="ALL">Todos</option>
                     <option value={MatchStatus.LIVE}>Ao Vivo</option>
                     <option value={MatchStatus.SCHEDULED}>Agendado</option>
                     <option value={MatchStatus.WAITING_ACCEPTANCE}>Pendente</option>
                  </select>
              </div>
              
              {featuredMatchToDisplay ? (
                <div onClick={() => setSelectedMatchId(featuredMatchToDisplay.id)} className="cursor-pointer transition">
                  <MatchCard 
                    match={featuredMatchToDisplay} homeTeam={getTeam(featuredMatchToDisplay.homeTeamId)} awayTeam={getTeam(featuredMatchToDisplay.awayTeamId)} arena={getArena(featuredMatchToDisplay.arenaId)} 
                    userRole={currentUser.role} onUpdateScore={handleUpdateScore} onEditDetails={(m) => { setEditingMatch(m); setIsMatchModalOpen(true); }}
                    onTeamClick={handleTeamClick}
                  />
                </div>
              ) : (
                <div className="p-8 glass-panel rounded-2xl text-center text-slate-400 flex flex-col items-center">
                   <Calendar size={32} className="mb-2 opacity-50"/>
                   Nenhum jogo encontrado com este status.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Context Aware Championship Dropdown */}
          <div className="glass-panel p-6 rounded-3xl interactive-card">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
               <Trophy size={20} className="text-amber-500 icon-hover" />
               Campeonatos
             </h3>
             {visibleTournaments.length > 0 ? (
                <>
                <div className="relative mb-4">
                    <select 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-medium shadow-inner focus:ring-2 focus:ring-emerald-500 cursor-pointer input-focus-effect"
                    onChange={(e) => setHomeFeedTournamentId(e.target.value)}
                    value={homeFeedTournamentId || ''}
                    >
                        <option value="">Selecione um campeonato...</option>
                        {visibleTournaments.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
                </div>
                
                {/* STRICT LOGIC: ONLY SHOW TABLE IF ID IS SELECTED */}
                {homeFeedTournamentId ? (
                   <div className="animate-in fade-in slide-in-from-top-2">
                      <div className="rounded-xl overflow-hidden shadow-sm">
                        <StandingsTable 
                            teams={activeTeams.filter(t => activeTournaments.find(tour => tour.id === homeFeedTournamentId)?.participatingTeamIds.includes(t.id))} 
                            matches={activeMatches.filter(m => m.tournamentId === homeFeedTournamentId)} 
                            onTeamClick={handleTeamClick} 
                        />
                      </div>
                      <button 
                        onClick={() => { setSelectedTournamentId(homeFeedTournamentId); setCurrentView('TOURNAMENTS'); }}
                        className="w-full mt-3 py-2 text-xs text-center text-emerald-600 hover:bg-emerald-50 rounded-lg font-bold transition btn-feedback"
                      >
                        Ver Campeonato Completo
                      </button>
                   </div>
                ) : (
                   <div className="p-6 bg-slate-50/50 text-center text-slate-400 text-sm rounded-xl border border-dashed border-slate-200">
                      Selecione um campeonato acima para ver a tabela.
                   </div>
                )}
                </>
             ) : (
                <div className="text-sm text-slate-400">Nenhum campeonato ativo.</div>
             )}
          </div>

          <div className="glass-panel p-6 rounded-3xl interactive-card">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
              <Newspaper size={20} className="text-blue-500 icon-hover" />
              Notícias
            </h3>
            <div className="space-y-4">
              {fanNews.length > 0 ? fanNews.slice(0, 3).map(news => (
                <div key={news.id} className="group cursor-pointer">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded-full">{news.category}</span>
                  <h4 className="font-bold text-sm text-slate-800 mt-1 group-hover:text-emerald-700 transition">{news.title}</h4>
                  <div className="h-px bg-slate-100 w-full mt-3 group-last:hidden"></div>
                </div>
              )) : (
                 <div className="text-sm text-slate-400">Nenhuma notícia recente.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTeamSection = (title: string, teams: Team[], icon: React.ElementType, emptyMsg: string) => (
        <div className="space-y-4">
           <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2 pb-2">
             <div className="bg-white p-2 rounded-lg shadow-sm">{React.createElement(icon, { size: 20, className: "text-emerald-600 icon-hover" })}</div>
             {title}
           </h3>
           {teams.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {teams.map(team => {
                   const isFollowing = socialGraph.some(s => s.followerId === currentUser!.id && s.targetId === team.id);
                   const isCreator = team.createdBy === currentUser!.id;
                   const isMyCoachTeam = currentUser!.role === UserRole.COACH && currentUser!.teamId === team.id;
                   const canInvite = isCreator || isMyCoachTeam;

                   return (
                     <div key={team.id} onClick={() => { changeView('TEAMS'); setViewingTeamId(team.id); }} className="glass-panel rounded-2xl overflow-hidden interactive-card cursor-pointer group">
                         <div className="h-28 bg-slate-100 relative flex items-end p-4 overflow-hidden">
                             {team.cover ? (
                                <img src={team.cover} alt="cover" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-700" />
                             ) : (
                                <div className="absolute top-0 bottom-0 left-0 right-0 opacity-20 bg-current" style={{ color: team.logoColor }}></div>
                             )}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                             
                             <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg border-4 border-white/20 backdrop-blur-md z-10 relative icon-hover" style={{ backgroundColor: team.logoColor }}>
                                 {team.shortName}
                             </div>
                             {isCreator && <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/10 shadow-lg">ADMIN</div>}
                         </div>
                         <div className="p-5 pt-3">
                             <div className="flex justify-between items-start">
                               <div>
                                 <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">{team.name}</h3>
                                 <p className="text-xs text-slate-500 flex items-center gap-1 font-medium mt-1"><MapPin size={12} /> {team.city}</p>
                               </div>
                               {(currentUser!.role === UserRole.FAN || currentUser!.role === UserRole.REFEREE || currentUser!.role === UserRole.PLAYER) && !isCreator && (
                                  <button onClick={(e) => { e.stopPropagation(); handleFollow(team.id); }} className="text-slate-300 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full btn-feedback">
                                     <Heart size={20} className={isFollowing ? 'fill-red-500 text-red-500' : ''} />
                                  </button>
                                )}
                             </div>
                             
                             <div className="grid grid-cols-3 gap-2 mt-5 text-center">
                                 <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                     <div className="text-lg font-black text-slate-800">{team.points}</div>
                                     <div className="text-[10px] uppercase text-slate-400 font-bold">Pts</div>
                                 </div>
                                 <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                     <div className="text-lg font-black text-emerald-600">{team.wins}</div>
                                     <div className="text-[10px] uppercase text-slate-400 font-bold">Vit</div>
                                 </div>
                                 <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                     <div className="text-lg font-black text-blue-600">{team.goalsFor}</div>
                                     <div className="text-[10px] uppercase text-slate-400 font-bold">GP</div>
                                 </div>
                             </div>

                             {/* Management Actions */}
                             <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                                {canInvite && (
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedTeamIdForInvite(team.id); setIsInviteModalOpen(true); }} className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition btn-feedback">
                                      <UserPlus size={14} /> Convidar
                                  </button>
                                )}
                                {isCreator && (
                                  <button onClick={(e) => { e.stopPropagation(); openDeleteModal(team.id, 'TEAM'); }} className="text-slate-400 hover:text-red-600 transition p-1.5 hover:bg-red-50 rounded-lg btn-feedback" title="Excluir">
                                     <Trash2 size={16} />
                                  </button>
                                )}
                             </div>
                         </div>
                     </div>
                 )})}
             </div>
           ) : (
             <div className="p-8 text-sm text-slate-400 glass-panel rounded-2xl italic text-center border-dashed border-2 border-slate-200">{emptyMsg}</div>
           )}
        </div>
  );

  const renderTeamsView = () => {
     // Case 0: Viewing a Specific Team (Detail Page) - Accessible by click
     if (viewingTeamId) {
       const myTeam = getTeam(viewingTeamId);
       const isMyManagedTeam = (currentUser!.role === UserRole.COACH || currentUser!.role === UserRole.PLAYER) && currentUser!.teamId === viewingTeamId;
       const isDirectorOwner = currentUser!.role === UserRole.DIRECTOR && myTeam.createdBy === currentUser!.id;
       const isEditable = (isMyManagedTeam && currentUser!.role === UserRole.COACH) || isDirectorOwner;
       
       // Calculate Top Scorers for this team
       const teamScorers = [...myTeam.roster].sort((a,b) => b.stats.goals - a.stats.goals).slice(0, 5);
       
       // Filter Staff
       const staffMembers = userAccounts.filter(u => u.teamId === myTeam.id && (u.role === UserRole.DIRECTOR || u.role === UserRole.COACH));
       
       // Filter Matches
       const teamMatches = activeMatches.filter(m => m.homeTeamId === myTeam.id || m.awayTeamId === myTeam.id);
       const displayedMatches = teamMatchFilter === 'UPCOMING'
        ? teamMatches.filter(m => m.status !== MatchStatus.FINISHED).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        : teamMatches.filter(m => m.status === MatchStatus.FINISHED).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

       // Counts
       const fanCount = socialGraph.filter(s => s.targetId === myTeam.id).length;

       return (
         <div className="space-y-8 animate-in fade-in duration-500 pb-20">
             <button onClick={() => setViewingTeamId(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 btn-feedback bg-white px-4 py-2 rounded-full shadow-sm">
                <ArrowLeft size={16} /> Voltar
             </button>

             {/* HERO BANNER & HEADER */}
             <div className="glass-panel rounded-3xl overflow-hidden relative interactive-card">
                <div className="h-48 md:h-72 bg-slate-200 relative group">
                    {myTeam.cover ? (
                        <img src={myTeam.cover} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-slate-800"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {isEditable && (
                        <button onClick={() => setIsEditingTeam(true)} className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white p-2 rounded-full hover:bg-white/40 transition btn-feedback">
                            <Camera size={18} />
                        </button>
                    )}
                </div>

                <div className="px-6 md:px-10 pb-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-end -mt-20 mb-4 gap-6">
                        <div className="w-36 h-36 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-4xl font-bold text-white relative group bg-white overflow-hidden icon-hover" style={{ backgroundColor: myTeam.logoColor }}>
                            {myTeam.shortName}
                        </div>
                        <div className="flex-1 mb-2 text-white md:text-slate-900 md:pt-20">
                             {isEditingTeam ? (
                                 <form onSubmit={handleUpdateTeam} className="flex flex-col gap-2 max-w-md bg-white p-4 rounded-xl shadow-lg mt-10 md:mt-0">
                                     <input type="text" name="name" defaultValue={myTeam.name} className="text-2xl font-bold border-b border-slate-300 focus:outline-none bg-transparent text-slate-900 input-focus-effect" />
                                     <div className="flex gap-2">
                                        <input type="color" name="logoColor" defaultValue={myTeam.logoColor} className="h-8 w-20 cursor-pointer rounded" />
                                        <input type="text" name="cover" defaultValue={myTeam.cover || ''} placeholder="URL da Capa" className="text-sm border rounded p-1 flex-1 text-slate-800 input-focus-effect" />
                                     </div>
                                     <div className="flex gap-2 mt-2">
                                         <button type="submit" className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold btn-feedback">Salvar</button>
                                         <button type="button" onClick={() => setIsEditingTeam(false)} className="bg-slate-200 text-slate-600 px-3 py-1 rounded text-xs font-bold btn-feedback">Cancelar</button>
                                     </div>
                                 </form>
                             ) : (
                                <>
                                    <h1 className="text-4xl md:text-5xl font-black md:text-slate-900 text-white drop-shadow-md md:drop-shadow-none">{myTeam.name}</h1>
                                    <div className="flex items-center gap-4 md:text-slate-500 text-white/90 font-medium mt-2">
                                        <span className="flex items-center gap-1 bg-white/20 md:bg-slate-100 px-2 py-1 rounded-full text-xs backdrop-blur-sm"><MapPin size={14} /> {myTeam.city}</span>
                                        <span className="flex items-center gap-1 bg-white/20 md:bg-slate-100 px-2 py-1 rounded-full text-xs backdrop-blur-sm"><Heart size={14} /> {fanCount} Torcedores</span>
                                        <span className="flex items-center gap-1 bg-white/20 md:bg-slate-100 px-2 py-1 rounded-full text-xs backdrop-blur-sm"><Users size={14} /> {myTeam.roster.length} Jogadores</span>
                                    </div>
                                </>
                             )}
                        </div>
                        <div className="mb-2 flex gap-3 self-end md:self-auto">
                            <button onClick={() => handleFollow(myTeam.id)} className="btn-feedback bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 shadow-lg">
                                <Heart size={18} className={socialGraph.some(s => s.followerId === currentUser!.id && s.targetId === myTeam.id) ? 'fill-red-500 text-red-500' : ''} />
                                {socialGraph.some(s => s.followerId === currentUser!.id && s.targetId === myTeam.id) ? 'Seguindo' : 'Seguir'}
                            </button>
                            {canManage && (
                               <button onClick={() => { setSelectedTeamIdForInvite(myTeam.id); setIsInviteModalOpen(true); }} className="btn-feedback bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-500 shadow-lg flex items-center gap-2">
                                  <UserPlus size={18} />
                               </button>
                            )}
                        </div>
                    </div>
                    
                    {/* STAFF SECTION */}
                    <div className="border-t border-slate-200 pt-6 mt-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Briefcase size={14} /> Comissão Técnica & Diretoria
                        </h4>
                        <div className="flex flex-wrap gap-4">
                            {staffMembers.length > 0 ? staffMembers.map(staff => (
                                <div key={staff.id} className="flex items-center gap-3 bg-slate-50 p-2 pr-4 rounded-full border border-slate-100 shadow-sm interactive-card">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                        {staff.avatar ? <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" /> : <User size={20} className="m-2.5 text-slate-400" />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 leading-tight">{staff.name}</div>
                                        <div className="text-[10px] uppercase font-bold text-emerald-600">{staff.role === UserRole.DIRECTOR ? 'Diretor' : 'Técnico'}</div>
                                    </div>
                                </div>
                            )) : (
                                <span className="text-sm text-slate-400 italic">Nenhum membro da comissão cadastrado.</span>
                            )}
                        </div>
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* LEFT COL: MATCHES */}
                 <div className="lg:col-span-1 space-y-6">
                     <div className="glass-panel rounded-3xl p-6 interactive-card">
                         <div className="flex justify-between items-center mb-6">
                             <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                 <Calendar size={20} className="text-blue-500 icon-hover" /> Agenda
                             </h3>
                             <div className="relative">
                                <select 
                                    value={teamMatchFilter} 
                                    onChange={(e) => setTeamMatchFilter(e.target.value as any)}
                                    className="text-xs border-none bg-slate-100 rounded-lg py-1 pl-2 pr-6 font-bold cursor-pointer appearance-none input-focus-effect"
                                >
                                    <option value="UPCOMING">Próximos</option>
                                    <option value="FINISHED">Anteriores</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-2 text-slate-500 pointer-events-none"/>
                             </div>
                         </div>
                         <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                             {displayedMatches.length > 0 ? displayedMatches.map(m => (
                                 <div key={m.id} onClick={() => setSelectedMatchId(m.id)} className="cursor-pointer hover:bg-emerald-50/50 p-3 rounded-xl border border-slate-100 transition group btn-feedback">
                                     <div className="text-[10px] text-slate-400 mb-2 flex justify-between font-bold uppercase">
                                         <span>{new Date(m.date).toLocaleDateString()}</span>
                                         <span className={`px-2 py-0.5 rounded-full ${m.status === MatchStatus.FINISHED ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {m.status === MatchStatus.FINISHED ? 'Encerrado' : 'Agendado'}
                                         </span>
                                     </div>
                                     <div className="flex justify-between items-center">
                                         <div className="flex items-center gap-2 w-[40%]">
                                             <span className="font-bold text-slate-800 truncate text-sm">{getTeam(m.homeTeamId).shortName}</span>
                                             {m.status === MatchStatus.FINISHED && <span className="text-lg font-bold ml-auto">{m.homeScore}</span>}
                                         </div>
                                         <span className="text-slate-300 text-xs font-light">VS</span>
                                         <div className="flex items-center gap-2 w-[40%] justify-end">
                                             {m.status === MatchStatus.FINISHED && <span className="text-lg font-bold mr-auto">{m.awayScore}</span>}
                                             <span className="font-bold text-slate-800 truncate text-sm">{getTeam(m.awayTeamId).shortName}</span>
                                         </div>
                                     </div>
                                 </div>
                             )) : (
                                 <div className="text-center py-8 text-slate-400 text-sm">Nenhum jogo encontrado.</div>
                             )}
                         </div>
                     </div>
                 </div>
                 
                 {/* RIGHT COL: STATS & TACTICS */}
                 <div className="lg:col-span-2 space-y-6">
                     {/* TOP SCORERS */}
                     <div className="glass-panel rounded-3xl p-6 interactive-card">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-800">
                             <Target size={20} className="text-red-500 icon-hover" /> Artilharia do Time
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                             {teamScorers.length > 0 ? teamScorers.map((p, idx) => (
                                 <div key={p.id} onClick={() => setSelectedPlayerForProfile({player: p, teamName: myTeam.name})} className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur rounded-xl border border-slate-100 hover:border-emerald-300 transition cursor-pointer hover:shadow-md btn-feedback">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-orange-400' : 'bg-slate-200 text-slate-500'}`}>
                                         {idx + 1}
                                     </div>
                                     <div className="flex-1">
                                         <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                                         <div className="text-[10px] text-slate-500 font-bold uppercase">{p.stats.matchesPlayed} Jogos</div>
                                     </div>
                                     <div className="text-xl font-black text-emerald-600">{p.stats.goals}</div>
                                 </div>
                             )) : (
                                 <div className="col-span-full text-slate-400 text-sm italic">Nenhum gol marcado ainda.</div>
                             )}
                        </div>
                     </div>

                     {/* TACTICS & SQUAD */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* TACTICS BOARD */}
                        <div className="glass-panel rounded-3xl p-6 interactive-card">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                    <Crown size={20} className="text-amber-500 icon-hover" /> Formação
                                </h3>
                                {isEditable && (
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        {['4-4-2', '4-3-3', '3-5-2'].map(form => (
                                            <button 
                                                key={form}
                                                onClick={() => applyTacticalPreset(myTeam.id, form as any)} 
                                                className="text-[10px] px-2 py-1 rounded font-bold text-slate-600 hover:bg-white hover:shadow-sm transition btn-feedback"
                                            >
                                                {form}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <TacticsBoard 
                                team={myTeam}
                                isEditable={isEditable}
                                onSave={(pos) => handleSaveTeamTactics(myTeam.id, pos)}
                            />
                        </div>

                        {/* ROSTER LIST */}
                        <div className="glass-panel rounded-3xl p-6 interactive-card">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                                <Users size={20} className="text-blue-500 icon-hover" /> Elenco Completo
                            </h3>
                            {myTeam.roster.length > 0 ? (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {myTeam.roster.map(p => (
                                        <div key={p.id} onClick={() => setSelectedPlayerForProfile({player: p, teamName: myTeam.name})} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer transition group btn-feedback">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-mono font-bold text-slate-400 text-sm group-hover:bg-emerald-200 group-hover:text-emerald-800 transition">{p.number}</div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm group-hover:text-emerald-700">{p.name}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{p.position}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 text-xs font-bold text-slate-400">
                                                {p.stats.goals > 0 && <span className="bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded">{p.stats.goals} G</span>}
                                                {p.stats.assists > 0 && <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">{p.stats.assists} A</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-slate-400">Nenhum jogador no elenco.</div>
                            )}
                        </div>
                     </div>
                 </div>
             </div>
         </div>
       );
     }

     // === UNIFIED TEAM LIST VIEW ===
     const myTeams = activeTeams.filter(t => 
        t.createdBy === currentUser!.id || 
        t.id === currentUser!.teamId
     );
     const followedTeamIds = socialGraph.filter(s => s.followerId === currentUser!.id && s.targetType === 'TEAM').map(s => s.targetId);
     const followedTeams = activeTeams.filter(t => followedTeamIds.includes(t.id) && !myTeams.includes(t));
     const localTeams = activeTeams.filter(t => t.city.toLowerCase() === (currentUser!.location || '').toLowerCase() && !myTeams.includes(t) && !followedTeams.includes(t));
     const exploreTeams = activeTeams.filter(t => !myTeams.includes(t) && !followedTeams.includes(t) && !localTeams.includes(t));

     return (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="flex justify-between items-center">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Times</h2>
               {currentUser!.role === UserRole.DIRECTOR && (
                  <button 
                     onClick={() => setIsTeamModalOpen(true)}
                     className="btn-feedback bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 flex items-center gap-2"
                  >
                     <Plus size={18} /> Novo Time
                  </button>
               )}
           </div>

           {/* 1. My Teams */}
           {renderTeamSection("Meus Times", myTeams, Crown, "Você não gerencia nem participa de nenhum time.")}
           {/* 2. Followed Teams */}
           {renderTeamSection("Seguindo", followedTeams, Heart, "Você ainda não segue nenhum time.")}
           {/* 3. Local Teams */}
           {renderTeamSection(`Times em ${currentUser!.location || 'sua região'}`, localTeams, MapPin, "Nenhum time encontrado na sua cidade.")}
           {/* 4. Explore */}
           {renderTeamSection("Explorar", exploreTeams, Map, "Não há outros times para exibir.")}

           {/* INVITE MODAL */}
           {isInviteModalOpen && selectedTeamIdForInvite && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <div className="glass-panel rounded-2xl p-8 max-w-sm w-full relative">
                    <button onClick={() => { setIsInviteModalOpen(false); setSelectedTeamIdForInvite(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 btn-feedback"><X size={20}/></button>
                    <h3 className="font-bold text-xl mb-2 text-slate-800">Convidar Membro</h3>
                    <p className="text-sm text-slate-500 mb-6">Para <strong>{getTeam(selectedTeamIdForInvite).name}</strong></p>
                    <form onSubmit={handleSendInvite}>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email do Usuário</label>
                        <input type="email" name="email" className="w-full border border-slate-300 rounded-xl p-3 text-sm mb-6 focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" placeholder="exemplo@email.com" required />
                        <button type="submit" className="btn-feedback w-full bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-200">Enviar Convite</button>
                    </form>
                </div>
                </div>
            )}
        </div>
     );
  };

  const renderMatchesView = () => {
    // 1. FILTER LOGIC
    let filtered = activeMatches;
    if (matchStatusFilter !== 'ALL') {
      filtered = filtered.filter(m => m.status === matchStatusFilter);
    }
    if (matchContextFilter === 'FRIENDLY') {
      filtered = filtered.filter(m => m.type === MatchType.FRIENDLY);
    } else if (matchContextFilter !== 'ALL') {
      const tour = activeTournaments.find(t => t.name === matchContextFilter);
      if (tour) filtered = filtered.filter(m => m.tournamentId === tour.id);
    }

    // 2. PRIORITY SPLIT LOGIC
    let myMatches: Match[] = [];
    let otherMatches: Match[] = [];

    if (currentUser!.role === UserRole.REFEREE) {
       const assignmentCount = 3; 
       myMatches = filtered.slice(0, assignmentCount);
       otherMatches = filtered.slice(assignmentCount);
    } else if (currentUser!.teamId) {
       myMatches = filtered.filter(m => m.homeTeamId === currentUser!.teamId || m.awayTeamId === currentUser!.teamId);
       otherMatches = filtered.filter(m => m.homeTeamId !== currentUser!.teamId && m.awayTeamId !== currentUser!.teamId);
       if (currentUser!.role === UserRole.FAN) {
          const followedTeamIds = socialGraph.filter(s => s.followerId === currentUser!.id).map(s => s.targetId);
          const followedMatches = otherMatches.filter(m => followedTeamIds.includes(m.homeTeamId) || followedTeamIds.includes(m.awayTeamId));
          myMatches = [...myMatches, ...followedMatches];
          otherMatches = otherMatches.filter(m => !followedTeamIds.includes(m.homeTeamId) && !followedTeamIds.includes(m.awayTeamId));
       }
    } else {
       otherMatches = filtered;
    }
    if (currentUser!.role === UserRole.DIRECTOR && matchStatusFilter === MatchStatus.WAITING_ACCEPTANCE) {
       myMatches = filtered;
       otherMatches = [];
    }
    myMatches.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    otherMatches.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Filters */}
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Jogos & Resultados</h2>
        
        {/* ROW 1: Context Filters (Tournaments/Friendly) */}
        {activeTournaments.length > 0 && (
            <div className="flex glass-panel p-2 rounded-2xl overflow-x-auto max-w-full gap-2 interactive-card">
            <button 
                onClick={() => setMatchContextFilter('ALL')}
                className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition btn-feedback ${matchContextFilter === 'ALL' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            >
                Geral
            </button>
            <button 
                onClick={() => setMatchContextFilter('FRIENDLY')}
                className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition btn-feedback ${matchContextFilter === 'FRIENDLY' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            >
                Amistosos
            </button>
            {activeTournaments.map(t => (
                <button
                key={t.id}
                onClick={() => setMatchContextFilter(t.name)}
                className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition btn-feedback ${matchContextFilter === t.name ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                {t.name}
                </button>
            ))}
            </div>
        )}

        {/* ROW 2: Status Filters */}
        <div className="flex flex-wrap gap-3">
           <button onClick={() => setMatchStatusFilter('ALL')} className={`px-4 py-2 rounded-full text-xs font-bold border transition shadow-sm btn-feedback ${matchStatusFilter === 'ALL' ? 'bg-slate-200 border-slate-300 text-slate-900' : 'bg-white border-white text-slate-500 hover:text-slate-900'}`}>
              Todos
           </button>
           <button onClick={() => setMatchStatusFilter(MatchStatus.LIVE)} className={`px-4 py-2 rounded-full text-xs font-bold border transition shadow-sm flex items-center gap-2 btn-feedback ${matchStatusFilter === MatchStatus.LIVE ? 'bg-red-500 border-red-600 text-white' : 'bg-white border-white text-slate-500 hover:text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${matchStatusFilter === MatchStatus.LIVE ? 'bg-white' : 'bg-red-500'} animate-pulse`}></div> Ao Vivo
           </button>
           <button onClick={() => setMatchStatusFilter(MatchStatus.SCHEDULED)} className={`px-4 py-2 rounded-full text-xs font-bold border transition shadow-sm btn-feedback ${matchStatusFilter === MatchStatus.SCHEDULED ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-white text-slate-500 hover:text-emerald-600'}`}>
              Agendados
           </button>
           <button onClick={() => setMatchStatusFilter(MatchStatus.FINISHED)} className={`px-4 py-2 rounded-full text-xs font-bold border transition shadow-sm btn-feedback ${matchStatusFilter === MatchStatus.FINISHED ? 'bg-slate-700 border-slate-800 text-white' : 'bg-white border-white text-slate-500 hover:text-slate-700'}`}>
              Encerrados
           </button>
           {currentUser!.role === UserRole.DIRECTOR && (
             <button onClick={() => setMatchStatusFilter(MatchStatus.WAITING_ACCEPTANCE)} className={`px-4 py-2 rounded-full text-xs font-bold border transition shadow-sm btn-feedback ${matchStatusFilter === MatchStatus.WAITING_ACCEPTANCE ? 'bg-amber-500 border-amber-600 text-white' : 'bg-white border-white text-slate-500 hover:text-amber-600'}`}>
               Pendentes
             </button>
           )}
        </div>
      </div>
      
      {/* SECTION 1: PRIORITY GAMES ("My Games") */}
      {myMatches.length > 0 && (
         <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 pl-2 border-l-4 border-emerald-500">
               {currentUser!.role === UserRole.REFEREE ? 'Seus Jogos Atribuídos' : 'Seus Jogos & Times Seguidos'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {myMatches.map(m => (
                  <div key={m.id} onClick={() => setSelectedMatchId(m.id)} className="cursor-pointer">
                     <MatchCard 
                        match={m} homeTeam={getTeam(m.homeTeamId)} awayTeam={getTeam(m.awayTeamId)} arena={getArena(m.arenaId)} 
                        userRole={currentUser!.role} onUpdateScore={handleUpdateScore} onEditDetails={(match) => { setEditingMatch(match); setIsMatchModalOpen(true); }}
                        onTeamClick={handleTeamClick}
                     />
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* SECTION 2: OTHER GAMES (Toggle) */}
      {otherMatches.length > 0 && (
         <div className="space-y-6 pt-6 border-t border-slate-200/50">
             {!showOtherGames ? (
                <button 
                  onClick={() => setShowOtherGames(true)}
                  className="w-full py-4 glass-panel rounded-2xl text-slate-500 font-bold hover:text-emerald-600 transition flex items-center justify-center gap-2 hover:shadow-lg interactive-card"
                >
                   Ver Outros Jogos da Liga <ChevronDown size={18} />
                </button>
             ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                   <div className="flex justify-between items-center px-2">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                         <Calendar size={18} className="text-slate-400" />
                         Outros Jogos
                      </h3>
                      <button onClick={() => setShowOtherGames(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm btn-feedback">
                         Ocultar <ChevronUp size={12} />
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {otherMatches.map(m => (
                         <div key={m.id} onClick={() => setSelectedMatchId(m.id)} className="cursor-pointer">
                           <MatchCard 
                              match={m} homeTeam={getTeam(m.homeTeamId)} awayTeam={getTeam(m.awayTeamId)} arena={getArena(m.arenaId)} 
                              userRole={currentUser!.role} onUpdateScore={handleUpdateScore} onEditDetails={(match) => { setEditingMatch(match); setIsMatchModalOpen(true); }}
                              onTeamClick={handleTeamClick}
                           />
                         </div>
                      ))}
                   </div>
                </div>
             )}
         </div>
      )}

      {myMatches.length === 0 && otherMatches.length === 0 && (
         <div className="text-center py-20 glass-panel rounded-3xl border-dashed border-2 border-slate-300 interactive-card">
            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Nenhum jogo encontrado.</p>
            {canManage && (
              <button onClick={() => setIsMatchModalOpen(true)} className="mt-4 text-emerald-600 font-bold hover:underline btn-feedback">
                Criar uma partida agora
              </button>
            )}
         </div>
      )}
    </div>
    );
  };

  const renderTournamentsView = () => {
    if (selectedTournamentId) {
      const tournament = activeTournaments.find(t => t.id === selectedTournamentId);
      if (!tournament) return null;

      return (
        <TournamentDetailView 
          tournament={tournament}
          matches={activeMatches}
          teams={activeTeams}
          news={MOCK_NEWS}
          arenas={arenas}
          currentUser={currentUser!}
          onClose={() => setSelectedTournamentId(null)}
          onMatchClick={(id) => setSelectedMatchId(id)}
          onUpdateScore={handleUpdateScore}
          onEditMatch={(m) => { setEditingMatch(m); setIsMatchModalOpen(true); }}
          onTeamClick={handleTeamClick}
          onInviteTeam={handleSendTournamentInvite}
          onDeleteTournament={(id) => openDeleteModal(id, 'TOURNAMENT')}
          onUpdateTournament={handleUpdateTournament}
        />
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Campeonatos</h2>
          {canManage && (
            <button 
              onClick={() => setIsTournamentModalOpen(true)}
              className="btn-feedback bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition flex items-center gap-2"
            >
              <Plus size={18} /> Novo
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTournaments.map(tour => {
             const isCreator = tour.createdBy === currentUser!.id;
             return (
            <div 
              key={tour.id}
              onClick={() => setSelectedTournamentId(tour.id)}
              className="glass-panel p-6 rounded-3xl hover:shadow-2xl transition-all duration-300 transform cursor-pointer group relative overflow-hidden interactive-card"
            >
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition"></div>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition group-hover:scale-110 duration-500">
                <Trophy size={80} />
              </div>
              
              <div className="relative z-10">
                <div className="flex gap-2 mb-4">
                   <span className="text-[10px] font-bold text-white uppercase tracking-wide bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-1 rounded shadow-sm">
                     {tour.format === 'LEAGUE' ? 'Liga' : 'Mata-Mata'}
                   </span>
                   <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${tour.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                     {tour.status === 'ACTIVE' ? 'Ativo' : 'Encerrado'}
                   </span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-emerald-700 transition-colors">{tour.name}</h3>
                <div className="flex justify-between items-end mt-4">
                    <div className="text-sm text-slate-500 font-medium bg-white/50 px-2 py-1 rounded-lg">
                        {SPORT_TYPE_DETAILS[tour.sportType]?.label}
                    </div>
                   {isCreator && (
                     <button 
                        onClick={(e) => { e.stopPropagation(); openDeleteModal(tour.id, 'TOURNAMENT'); }} 
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition btn-feedback"
                        title="Excluir"
                     >
                        <Trash2 size={16} />
                     </button>
                   )}
                </div>
                
                <div className="mt-6">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                        <span>Progresso</span>
                        <span>{(tour.currentRound / tour.totalRounds * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(tour.currentRound / tour.totalRounds) * 100}%` }}></div>
                    </div>
                </div>
              </div>
            </div>
          )})}
          {activeTournaments.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 glass-panel rounded-3xl border-dashed border-2 border-slate-200 interactive-card">
              <Trophy size={48} className="mx-auto text-slate-300 mb-2 opacity-50" />
              Nenhum campeonato ativo no momento.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderArenasView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
         <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Arenas</h2>
            <div className="glass-panel p-1 rounded-xl flex text-xs font-bold shadow-sm interactive-card">
               <button 
                  onClick={() => setIsArenasMapMode(false)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition btn-feedback ${!isArenasMapMode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
               >
                  <ListIcon size={14} /> Lista
               </button>
               <button 
                  onClick={() => setIsArenasMapMode(true)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition btn-feedback ${isArenasMapMode ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
               >
                  <Map size={14} /> Mapa
               </button>
            </div>
         </div>
         {canManage && (
            <button 
               onClick={() => setIsArenaModalOpen(true)} 
               className="btn-feedback bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 flex items-center gap-2"
            >
               <Plus size={18} /> Nova
            </button>
         )}
      </div>

      {isArenasMapMode ? (
         <ArenasMapView arenas={arenas} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {arenas.map(arena => (
            <div key={arena.id} className="glass-panel rounded-2xl overflow-hidden group hover:shadow-xl transition duration-300 interactive-card">
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                <img src={`https://picsum.photos/seed/${arena.id}/600/300`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Arena" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        {arena.name}
                    </h3>
                </div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${arena.lat},${arena.lng}`} target="_blank" rel="noreferrer" className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white p-2 rounded-full hover:bg-emerald-500 transition btn-feedback">
                    <MapPin size={20} />
                </a>
              </div>
              <div className="p-5">
                <p className="text-slate-600 text-sm flex items-start gap-2">
                    <MapPin size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    {arena.address}
                </p>
              </div>
            </div>
          ))}
          {arenas.length === 0 && (
             <div className="col-span-full py-12 text-center text-slate-400 glass-panel rounded-xl border-dashed border-2 border-slate-200 interactive-card">Nenhuma arena cadastrada.</div>
          )}
        </div>
      )}
    </div>
  );

  const renderNewsView = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8 text-center">Notícias da Liga</h2>
      <div className="grid grid-cols-1 gap-6">
        {MOCK_NEWS.map(news => (
            <div key={news.id} className="glass-panel p-8 rounded-3xl hover:shadow-xl transition duration-300 cursor-pointer group interactive-card">
            <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">{news.category}</span>
                <span className="text-slate-400 text-xs font-medium">{new Date(news.date).toLocaleDateString('pt-BR')}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition">{news.title}</h3>
            <p className="text-slate-600 leading-relaxed">{news.excerpt}</p>
            <div className="mt-6 flex items-center text-emerald-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">
                Ler mais <ArrowLeft className="rotate-180 ml-2" size={16} />
            </div>
            </div>
        ))}
      </div>
      {MOCK_NEWS.length === 0 && (
         <div className="py-20 text-center text-slate-400 glass-panel rounded-3xl border-dashed border-2 border-slate-200 interactive-card">Nenhuma notícia.</div>
      )}
    </div>
  );

  // --- Main Render ---

  return (
    <div className="min-h-screen font-sans relative">
      {/* Navbar */}
      {currentUser && (
        <nav className="glass-panel-dark text-white sticky top-4 z-40 mx-4 rounded-2xl mb-6 shadow-2xl backdrop-blur-xl">
            <div className="px-6">
            <div className="flex justify-between items-center h-20">
                
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => changeView('HOME')}>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg shadow-emerald-900/50 group-hover:scale-105 transition icon-hover">
                    <Trophy size={22} className="text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-xl tracking-tight leading-none">Local<span className="text-emerald-400">Legends</span></span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Sports Manager</span>
                </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-2">
                {[
                    { id: 'HOME', label: 'Início', icon: Home },
                    { id: 'TEAMS', label: 'Times', icon: Users }, 
                    { id: 'MATCHES', label: 'Jogos', icon: Calendar },
                    { id: 'TOURNAMENTS', label: 'Camp.', icon: Trophy },
                    { id: 'ARENAS', label: 'Arenas', icon: MapPin },
                    { id: 'NEWS', label: 'Notícias', icon: Newspaper },
                ].map((item) => {
                    const isActive = currentView === item.id && !selectedMatchId;
                    return (
                    <button
                        key={item.id}
                        onClick={() => changeView(item.id as AppView)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 btn-feedback ${
                        isActive ? 'bg-white text-emerald-900 shadow-lg scale-105' : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <item.icon size={18} className={isActive ? 'text-emerald-600' : ''} />
                        {item.label}
                    </button>
                    );
                })}
                </div>

                <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    <div className="relative">
                        <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition relative btn-feedback">
                        <Bell size={22} />
                        {unreadNotifications.length > 0 && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                        )}
                        </button>
                        {isNotificationsOpen && (
                        <div className="absolute right-0 mt-4 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl text-slate-800 p-2 z-50 border border-white/20 animate-in zoom-in-95 origin-top-right">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 px-3 pt-2">Notificações</h4>
                            {unreadNotifications.length === 0 ? (
                            <div className="text-sm text-slate-500 text-center py-6">Nenhuma notificação nova</div>
                            ) : (
                            unreadNotifications.map(n => (
                                <div key={n.id} className="p-3 hover:bg-emerald-50/50 rounded-xl mb-1 border-b border-slate-100 last:border-0 transition">
                                <p className="text-sm font-bold text-slate-800">{n.fromName}</p>
                                {n.type === 'TEAM_INVITE' && (
                                    <p className="text-xs text-slate-500 mb-3">Convidou você para entrar em <span className="font-bold text-emerald-600">{n.data?.teamName}</span></p>
                                )}
                                {n.type === 'TOURNAMENT_INVITE' && (
                                    <p className="text-xs text-slate-500 mb-3">Convidou <span className="font-bold">{n.data?.teamName}</span> para o campeonato <span className="font-bold">{n.data?.tournamentName}</span></p>
                                )}
                                <button onClick={() => handleAcceptInvite(n.id)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 rounded-lg font-bold shadow-md transition btn-feedback">
                                    Aceitar Convite
                                </button>
                                </div>
                            ))
                            )}
                        </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 cursor-pointer p-1.5 pl-2 pr-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition btn-feedback" onClick={() => setViewingProfileId(currentUser.id)}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white/20 shadow-md overflow-hidden">
                        {currentUser.avatar ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-xs font-bold text-white leading-tight">{currentUser.name}</span>
                        <span className="text-[9px] text-emerald-400 uppercase font-black tracking-wider">{currentUser.role}</span>
                    </div>
                    </div>
                    
                    <button onClick={handleLogout} className="hidden md:block p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition btn-feedback" title="Sair">
                    <LogOut size={20} />
                    </button>
                </div>
                </div>
            </div>
            </div>
        </nav>
      )}

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 pb-32 relative z-10">
        {currentView === 'HOME' && renderHomeView()}
        {currentView === 'TEAMS' && renderTeamsView()}
        {currentView === 'MATCHES' && renderMatchesView()}
        {currentView === 'TOURNAMENTS' && renderTournamentsView()}
        {currentView === 'ARENAS' && renderArenasView()}
        {currentView === 'NEWS' && renderNewsView()}
      </main>
      
      {/* --- Floating Action Button (Director) --- */}
      {canManage && !isMatchModalOpen && !isTournamentModalOpen && !selectedMatchId && !selectedTournamentId && currentUser && (
         <div className="fixed bottom-24 md:bottom-8 right-6 z-30 flex flex-col items-end gap-3">
            {isFabMenuOpen && (
               <div className="flex flex-col gap-3 items-end animate-in slide-in-from-bottom-10 duration-300 mb-2">
                  <button onClick={() => { setIsFabMenuOpen(false); setEditingMatch(null); setIsMatchModalOpen(true); }} className="flex items-center gap-3 bg-white/90 backdrop-blur-md text-slate-800 px-5 py-3 rounded-2xl shadow-xl hover:bg-white hover:scale-105 transition font-bold text-sm border border-white/40 btn-feedback">
                     Novo Jogo <Calendar size={20} className="text-emerald-600" />
                  </button>
                  <button onClick={() => { setIsFabMenuOpen(false); setIsTournamentModalOpen(true); }} className="flex items-center gap-3 bg-white/90 backdrop-blur-md text-slate-800 px-5 py-3 rounded-2xl shadow-xl hover:bg-white hover:scale-105 transition font-bold text-sm border border-white/40 btn-feedback">
                     Novo Campeonato <Trophy size={20} className="text-amber-500" />
                  </button>
                  <button onClick={() => { setIsFabMenuOpen(false); setIsArenaModalOpen(true); }} className="flex items-center gap-3 bg-white/90 backdrop-blur-md text-slate-800 px-5 py-3 rounded-2xl shadow-xl hover:bg-white hover:scale-105 transition font-bold text-sm border border-white/40 btn-feedback">
                     Nova Arena <MapPin size={20} className="text-blue-500" />
                  </button>
                   <button onClick={() => { setIsFabMenuOpen(false); setIsTeamModalOpen(true); }} className="flex items-center gap-3 bg-white/90 backdrop-blur-md text-slate-800 px-5 py-3 rounded-2xl shadow-xl hover:bg-white hover:scale-105 transition font-bold text-sm border border-white/40 btn-feedback">
                     Novo Time <Users size={20} className="text-purple-500" />
                  </button>
               </div>
            )}
            <button 
               onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
               className="btn-feedback bg-gradient-to-r from-emerald-500 to-teal-600 text-white w-16 h-16 rounded-full shadow-2xl shadow-emerald-400/50 flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 z-30"
            >
               {isFabMenuOpen ? <X size={32} /> : <Plus size={32} />}
            </button>
         </div>
      )}

      {/* --- Mobile Navigation --- */}
      {currentUser && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-6 py-4 z-40 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
           {[
              { id: 'HOME', label: 'Início', icon: Home },
              { id: 'MATCHES', label: 'Jogos', icon: Calendar },
              { id: 'TEAMS', label: 'Times', icon: Users },
              { id: 'TOURNAMENTS', label: 'Camp.', icon: Trophy },
           ].map((item) => {
               const isActive = currentView === item.id;
               return (
                  <button 
                    key={item.id}
                    onClick={() => changeView(item.id as AppView)}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 btn-feedback ${isActive ? 'text-emerald-600 -translate-y-2' : 'text-slate-400'}`}
                  >
                     <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-emerald-100 shadow-md' : 'bg-transparent'}`}>
                        <item.icon size={22} className={isActive ? 'fill-current' : ''} />
                     </div>
                     <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{item.label}</span>
                  </button>
               );
           })}
           <button onClick={() => changeView('NEWS')} className={`flex flex-col items-center gap-1 transition-all duration-300 btn-feedback ${currentView === 'NEWS' ? 'text-emerald-600 -translate-y-2' : 'text-slate-400'}`}>
                <div className={`p-2 rounded-xl transition-all ${currentView === 'NEWS' ? 'bg-emerald-100 shadow-md' : 'bg-transparent'}`}>
                  <Newspaper size={22} />
                </div>
                <span className={`text-[10px] font-bold ${currentView === 'NEWS' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>Notícias</span>
           </button>
        </nav>
      )}

      {/* --- Global Modals --- */}
      
      {/* 1. MATCH MODAL */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 interactive-card">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Calendar className="text-emerald-600 icon-hover" /> {editingMatch ? 'Editar Jogo' : 'Novo Jogo'}
              </h3>
              <button onClick={() => { setIsMatchModalOpen(false); setEditingMatch(null); }} className="text-slate-400 hover:text-slate-600 btn-feedback"><X size={20}/></button>
            </div>
            <form onSubmit={handleSaveMatch} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time da Casa</label>
                  <select name="homeTeamId" defaultValue={editingMatch?.homeTeamId} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" required>
                    {activeTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time Visitante</label>
                  <select name="awayTeamId" defaultValue={editingMatch?.awayTeamId} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" required>
                    {activeTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data e Hora</label>
                    <input type="datetime-local" name="date" defaultValue={editingMatch?.date ? new Date(editingMatch.date).toISOString().slice(0,16) : ''} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" required />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Local (Arena)</label>
                    <select name="arenaId" defaultValue={editingMatch?.arenaId} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" required>
                        {arenas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Jogo</label>
                    <select name="type" defaultValue={editingMatch?.type || MatchType.FRIENDLY} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect">
                        <option value={MatchType.FRIENDLY}>Amistoso</option>
                        <option value={MatchType.LEAGUE}>Liga</option>
                        <option value={MatchType.KNOCKOUT}>Mata-Mata</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Modalidade</label>
                    <select name="sportType" defaultValue={editingMatch?.sportType || SportType.FUT7} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect">
                        {Object.values(SportType).map((type) => (
                           <option key={type} value={type}>{SPORT_TYPE_DETAILS[type].label}</option>
                        ))}
                    </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Campeonato (Opcional)</label>
                    <select name="tournamentId" defaultValue={editingMatch?.tournamentId || ''} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect">
                        <option value="">Nenhum</option>
                        {activeTournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rodada / Fase</label>
                    <input type="text" name="round" defaultValue={editingMatch?.round} placeholder="Ex: Final, Rodada 1" className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" />
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link Transmissão (YouTube)</label>
                 <input 
                    type="url" 
                    name="youtubeUrl" 
                    defaultValue={editingMatch?.youtubeVideoId ? `https://youtube.com/watch?v=${editingMatch.youtubeVideoId}` : ''}
                    placeholder="https://youtube.com/watch?v=..." 
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" 
                 />
              </div>

              <div className="flex gap-3 pt-2">
                 {editingMatch && (
                    <button type="button" onClick={() => openDeleteModal(editingMatch.id, 'MATCH')} className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition btn-feedback">
                       Excluir
                    </button>
                 )}
                 <button type="submit" className="flex-[2] bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-200 transition btn-feedback">
                    Salvar Jogo
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. TOURNAMENT MODAL */}
      {isTournamentModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 interactive-card">
           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
               <Trophy className="text-amber-500 icon-hover" /> Novo Campeonato
             </h3>
             <button onClick={() => setIsTournamentModalOpen(false)} className="text-slate-400 hover:text-slate-600 btn-feedback"><X size={20}/></button>
           </div>
           <form onSubmit={handleSaveTournament} className="p-6 space-y-4">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Campeonato</label>
               <input type="text" name="name" className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" placeholder="Ex: Copa de Verão 2024" required />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Formato</label>
               <select name="format" className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect">
                 <option value="LEAGUE">Pontos Corridos (Liga)</option>
                 <option value="KNOCKOUT">Mata-Mata (Copa)</option>
               </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Modalidade</label>
                <select name="sportType" className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect">
                    {Object.values(SportType).map((type) => (
                        <option key={type} value={type}>{SPORT_TYPE_DETAILS[type].label}</option>
                    ))}
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total de Rodadas</label>
                <input type="number" name="totalRounds" className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" min="1" defaultValue="10" />
             </div>
             <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-200 mt-2 transition btn-feedback">
               Criar Campeonato
             </button>
           </form>
         </div>
       </div>
      )}

      {/* 3. TEAM MODAL */}
      {isTeamModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 interactive-card">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Users className="text-purple-500 icon-hover" /> Criar Novo Time
              </h3>
              <button onClick={() => setIsTeamModalOpen(false)} className="text-slate-400 hover:text-slate-600 btn-feedback"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Time</label>
                <input type="text" name="teamName" className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" placeholder="Ex: Real Madrid da Várzea" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sigla (3 letras)</label>
                   <input type="text" name="shortName" maxLength={3} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none uppercase input-focus-effect" placeholder="RMD" required />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cor Principal</label>
                   <div className="relative">
                      <input type="color" name="logoColor" className="w-full h-11 border rounded-xl p-1 cursor-pointer" defaultValue="#10b981" />
                   </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cidade Sede</label>
                <input type="text" name="city" className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" placeholder="Ex: São Paulo" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-200 mt-2 transition btn-feedback">
                Fundar Time
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. ARENA MODAL */}
      {isArenaModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 interactive-card">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <MapPin className="text-blue-500 icon-hover" /> Nova Arena
                  </h3>
                  <button onClick={() => setIsArenaModalOpen(false)} className="text-slate-400 hover:text-slate-600 btn-feedback"><X size={20}/></button>
               </div>
               <form onSubmit={handleCreateArena} className="p-6 space-y-4">
                  <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Local</label>
                  <input type="text" name="name" className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" placeholder="Ex: Quadra do Zé" required />
                  </div>
                  <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Endereço</label>
                  <input type="text" name="address" className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" placeholder="Rua Exemplo, 123" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Latitude</label>
                        <input type="number" step="any" name="lat" className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" placeholder="-23.55" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Longitude</label>
                        <input type="number" step="any" name="lng" className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none input-focus-effect" placeholder="-46.63" />
                     </div>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-200 mt-2 transition btn-feedback">
                  Cadastrar Arena
                  </button>
               </form>
            </div>
         </div>
      )}

      {/* 5. CONFIRMATION MODAL */}
      {itemToDelete && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 interactive-card">
                  <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-2">
                          <Trash2 size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Tem certeza?</h3>
                      <p className="text-slate-500 text-sm">
                          Esta ação excluirá o item permanentemente e não poderá ser desfeita.
                      </p>
                      <div className="flex gap-3 w-full mt-2">
                          <button 
                              onClick={() => setItemToDelete(null)}
                              className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition btn-feedback"
                          >
                              Cancelar
                          </button>
                          <button 
                              onClick={executeDeletion}
                              className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition btn-feedback"
                          >
                              Sim, Excluir
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;