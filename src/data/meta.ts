export type Lane = 'EXP' | 'Jungle' | 'Mid' | 'Gold Lane' | 'Roam' | 'Support';

export type ChampionMeta = {
  id: string;
  name: string;
  lane: Lane;
  role: string;
  tier: 'S+' | 'S' | 'A+' | 'A';
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  winRate: number;
  pickRate: number;
  banRate: number;
  build: string[];
  runes: string[];
  items: string[];
  counters: string[];
  counteredBy: string[];
  notes: string;
};

export const laneGroups = ['All', 'EXP', 'Jungle', 'Mid', 'Gold Lane', 'Roam', 'Support'] as const;

export const championBase: ChampionMeta[] = [
  {
    id: 'akai',
    name: 'Akai',
    lane: 'Roam',
    role: 'Tank',
    tier: 'S+',
    difficulty: 'Média',
    winRate: 58.7,
    pickRate: 39.4,
    banRate: 27.1,
    build: ['Manto do Guerreiro', 'Proteção de equipe', 'Rota segura'],
    runes: ['Fúria da Selva', 'Recuperação', 'Vigor'],
    items: ['Bracer de Ferro', 'Capa de Agilidade', 'Gelo do Touro', 'Gelo Imperial'],
    counters: ['Balmond', 'Lancelot'],
    counteredBy: ['Cecilion', 'Karrie'],
    notes: 'Ótimo para proteger o carry e evitar que o time entre em desvantagem.',
  },
  {
    id: 'chou',
    name: 'Chou',
    lane: 'EXP',
    role: 'Fighter',
    tier: 'S+',
    difficulty: 'Difícil',
    winRate: 57.9,
    pickRate: 33.8,
    banRate: 21.9,
    build: ['Combo de entrada', 'Controle de multidão', 'Burst de dano'],
    runes: ['Vigor', 'Precisão', 'Agressão'],
    items: ['Lâmina de Guerra', 'Braçadeira de Ferro', 'Machado de Fúria', 'Pulseira do Titã'],
    counters: ['Liu Ling', 'Lancelot'],
    counteredBy: ['Karrie', 'Johnson'],
    notes: 'Excelente em duelos e em eliminacões rápidas com combo bem executado.',
  },
  {
    id: 'tigreal',
    name: 'Tigreal',
    lane: 'EXP',
    role: 'Tank',
    tier: 'S',
    difficulty: 'Média',
    winRate: 54.8,
    pickRate: 28.4,
    banRate: 18.4,
    build: ['Defesa da linha', 'Resistência', 'Ponto de agressão'],
    runes: ['Fortitude', 'Proteção', 'Ação de defesa'],
    items: ['Proteção de Bronze', 'Escudo do Guardião', 'Manto de Reforço', 'Cota de Aço'],
    counters: ['Masha', 'Balmond'],
    counteredBy: ['Eudora', 'Selena'],
    notes: 'Muito forte em defesa de torre e em engajamentos de equipe.',
  },
  {
    id: 'hayabusa',
    name: 'Hayabusa',
    lane: 'Jungle',
    role: 'Assassin',
    tier: 'S+',
    difficulty: 'Difícil',
    winRate: 58.2,
    pickRate: 31.7,
    banRate: 24.3,
    build: ['Pulo rápido', 'Burst inicial', 'Velocidade de dano'],
    runes: ['Sombra', 'Velocidade ao matar', 'Subida rápida'],
    items: ['Lâmina da Sombra', 'Anel da Fúria', 'Tomo de Escuridão', 'Poder da Lâmina'],
    counters: ['Lancelot', 'Masha'],
    counteredBy: ['Akai', 'Tigreal'],
    notes: 'Assassino com alto burst e muito forte para eliminar alvos frágeis.',
  },
  {
    id: 'fanny',
    name: 'Fanny',
    lane: 'Jungle',
    role: 'Assassin',
    tier: 'S',
    difficulty: 'Difícil',
    winRate: 56.3,
    pickRate: 26.1,
    banRate: 22.1,
    build: ['Controle de mapa', 'Tempo de entrada', 'Alvo prioritário'],
    runes: ['Golpe rápido', 'Potência', 'Velocidade de ataque'],
    items: ['Lâmina Arcana', 'Anel de Chuva', 'Braçadeira da Lua', 'Tomo de Dano'],
    counters: ['Pharsa', 'Nana'],
    counteredBy: ['Tigreal', 'Liu Ling'],
    notes: 'Ótima em pressões rápidas e rota agressiva em início de partida.',
  },
  {
    id: 'lancelot',
    name: 'Lancelot',
    lane: 'Mid',
    role: 'Assassin',
    tier: 'S+',
    difficulty: 'Difícil',
    winRate: 59.3,
    pickRate: 36.2,
    banRate: 29.8,
    build: ['Pulo de impacto', 'Burst', 'Poder de rotação'],
    runes: ['Sombra de reação', 'Velocidade de combate', 'Golpe contínuo'],
    items: ['Lâmina do Caçador', 'Caldeirão do Rei', 'Poder de Aço', 'Adaga da Noite'],
    counters: ['Aurora', 'Cyclops'],
    counteredBy: ['Karrie', 'Balmond'],
    notes: 'Muito forte para entrar em rota e matar alvos essenciais.',
  },
  {
    id: 'cyclops',
    name: 'Cyclops',
    lane: 'Mid',
    role: 'Mage',
    tier: 'S',
    difficulty: 'Média',
    winRate: 56.7,
    pickRate: 27.1,
    banRate: 17.8,
    build: ['Burst de área', 'Controle de toque', 'Poder de dano'],
    runes: ['Destreza Arcana', 'Cura por dano', 'Fluxo mágico'],
    items: ['Cetro Arcano', 'Orbe de Gelo', 'Pêndulo de Luz', 'Capa de Brasa'],
    counters: ['Balmond', 'Khufra'],
    counteredBy: ['Lancelot', 'Fanny'],
    notes: 'Muito forte em dano em área e pressões rápidas em equipe.',
  },
  {
    id: 'lesley',
    name: 'Lesley',
    lane: 'Gold Lane',
    role: 'Marksman',
    tier: 'S+',
    difficulty: 'Média',
    winRate: 58.8,
    pickRate: 34.5,
    banRate: 26.1,
    build: ['Dano de ataque', 'Velocidade de ataque', 'Tempo de pressão'],
    runes: ['Dono da rota', 'Fogo de ampla escala', 'Gelo de tiro'],
    items: ['Arco do Povo', 'Luva de Fogo', 'Lâmina da Vingança', 'Flecha de Ouro'],
    counters: ['Grock', 'Hayabusa'],
    counteredBy: ['Lancelot', 'Karrie'],
    notes: 'Excelente em dano de longa distância e mapa aberto.',
  },
  {
    id: 'karrie',
    name: 'Karrie',
    lane: 'Gold Lane',
    role: 'Marksman',
    tier: 'S+',
    difficulty: 'Média',
    winRate: 59.1,
    pickRate: 32.4,
    banRate: 23.2,
    build: ['Dano de saída', 'Dano em alvo', 'Poder de acerto'],
    runes: ['Poder de punição', 'Flecha contínua', 'Velocidade de ataque'],
    items: ['Flecha de Ferro', 'Lâmina do Corona', 'Bastão de Guerra', 'Matadora de Ferro'],
    counters: ['Selena', 'Aurora'],
    counteredBy: ['Akai', 'Tigreal'],
    notes: 'Muita força em rota e pressão por dano constante.',
  },
  {
    id: 'estes',
    name: 'Estes',
    lane: 'Support',
    role: 'Support',
    tier: 'S+',
    difficulty: 'Fácil',
    winRate: 57.7,
    pickRate: 31.8,
    banRate: 20.1,
    build: ['Cura sustentada', 'Controle de equipe', 'Proteção do carry'],
    runes: ['Recuperação', 'Mobilidade', 'Poder de suporte'],
    items: ['Bastão de Revitalização', 'Relógio de Pressão', 'Amuleto de Cura', 'Capa de Santa'],
    counters: ['Headhunter', 'Fanny'],
    counteredBy: ['Lancelot', 'Balmond'],
    notes: 'Ótimo suporte para partidas longas e para manter o carry vivo.',
  },
  {
    id: 'rafaela',
    name: 'Rafaela',
    lane: 'Support',
    role: 'Support',
    tier: 'S',
    difficulty: 'Média',
    winRate: 55.4,
    pickRate: 27.6,
    banRate: 13.7,
    build: ['Mecânica de cura e recuo', 'Proteção de rota', 'Suporte ao carry'],
    runes: ['Cura', 'Equilíbrio', 'Recuperação'],
    items: ['Coroa de Cura', 'Tomo de Amor', 'Manto de Batalha', 'Poder do Guardião'],
    counters: ['Masha', 'Balmond'],
    counteredBy: ['Diesel', 'Fanny'],
    notes: 'Muito boa para sustentar dano em time e virar lutas longas.',
  },
  {
    id: 'khufra',
    name: 'Khufra',
    lane: 'Roam',
    role: 'Tank',
    tier: 'A+',
    difficulty: 'Fácil',
    winRate: 53.9,
    pickRate: 22.4,
    banRate: 11.8,
    build: ['Poder de disparo', 'Entradas no combate', 'Voleio de equipe'],
    runes: ['Resistência', 'Foco', 'Agressão'],
    items: ['Escudo de Fogo', 'Manto de Aço', 'Gola de Aço', 'Cota de Resina'],
    counters: ['Balmond', 'Masha'],
    counteredBy: ['Aurora', 'Eudora'],
    notes: 'Boa capacidade de abrir rota e atrair atenção do time inimigo.',
  },
  {
    id: 'diggie',
    name: 'Diggie',
    lane: 'Support',
    role: 'Support',
    tier: 'S',
    difficulty: 'Fácil',
    winRate: 56.2,
    pickRate: 29.1,
    banRate: 14.2,
    build: ['Controle de equipe', 'Supressão', 'Segurança do carry'],
    runes: ['Resistência', 'Benevolência', 'Poder de suporte'],
    items: ['Anel de Proteção', 'Capa de Cura', 'Relógio de Velocidade', 'Minhoca da Lua'],
    counters: ['Karrie', 'Lesley'],
    counteredBy: ['Jungles agressivos', 'Fanny'],
    notes: 'Excelente para segurar e proteger o alvo principal em rotação.',
  },
  {
    id: 'alpha',
    name: 'Alpha',
    lane: 'Jungle',
    role: 'Fighter',
    tier: 'A+',
    difficulty: 'Média',
    winRate: 52.9,
    pickRate: 18.4,
    banRate: 9.3,
    build: ['Empurrão de alvo', 'Guerra de limite', 'Agressão no mapa'],
    runes: ['Fúria', 'Energia', 'Combate de base'],
    items: ['Machado do Imperador', 'Anel de Guerra', 'Poder do Guerreiro', 'Bastão do Destino'],
    counters: ['Fanny', 'Hayabusa'],
    counteredBy: ['Cyclops', 'Eudora'],
    notes: 'Bom para pressionar alvos lentos com alto dano na frente.',
  },
];

export function refreshMeta(list: ChampionMeta[]): ChampionMeta[] {
  const now = Date.now();

  return list.map((champion, index) => {
    const wave = Math.sin(now / 3600000 + index) * 1.7;
    const nextWin = Math.min(64, Math.max(48, champion.winRate + wave * 0.72));
    const nextPick = Math.min(42, Math.max(15, champion.pickRate + wave * 0.58));
    const nextBan = Math.min(32, Math.max(7, champion.banRate + wave * 0.48));

    return {
      ...champion,
      winRate: Number(nextWin.toFixed(1)),
      pickRate: Number(nextPick.toFixed(1)),
      banRate: Number(nextBan.toFixed(1)),
    };
  });
}

export function buildRanking(list: ChampionMeta[]) {
  return [...list].sort((a, b) => b.winRate - a.winRate);
}
