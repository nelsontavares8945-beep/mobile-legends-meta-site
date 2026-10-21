import { useEffect, useMemo, useState } from 'react';
import { buildRanking, championBase, laneGroups, refreshMeta, type ChampionMeta } from './data/meta';

const getNestedValue = (source: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null) return value;
  }

  return undefined;
};

const normalizeTier = (value: unknown): ChampionMeta['tier'] => {
  const text = String(value ?? 'A').toUpperCase().replace(/\s+/g, '');

  if (text.includes('S+')) return 'S+';
  if (text.includes('S')) return 'S';
  if (text.includes('A+')) return 'A+';
  return 'A';
};

const normalizeDifficulty = (value: unknown): ChampionMeta['difficulty'] => {
  const text = String(value ?? 'Média').toLowerCase();

  if (text.includes('facil')) return 'Fácil';
  if (text.includes('dificil')) return 'Difícil';
  return 'Média';
};

const normalizeLane = (value: unknown): ChampionMeta['lane'] => {
  const text = String(value ?? 'EXP').toLowerCase();

  if (text.includes('gold')) return 'Gold Lane';
  if (text.includes('jungle')) return 'Jungle';
  if (text.includes('mid')) return 'Mid';
  if (text.includes('roam')) return 'Roam';
  if (text.includes('support')) return 'Support';
  return 'EXP';
};

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry ?? '').trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[|,]/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeNumber = (value: unknown, fallback: number) => {
  const raw = String(value ?? '').replace(/[%]/g, '').replace(/,/g, '');
  const numberValue = Number(raw);
  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const fetchMetaData = async (): Promise<ChampionMeta[]> => {
  try {
    const response = await fetch('/api/heroes', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const payload = await response.json();
    const rawList = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.heroes)
          ? payload.heroes
          : Array.isArray(payload?.results)
            ? payload.results
            : [];

    if (!rawList.length) {
      return championBase;
    }

    return rawList.map((item: Record<string, unknown>, index: number) => {
      const name = String(
        getNestedValue(item, ['name', 'hero_name', 'displayName', 'title', 'heroName']) ?? `Champion ${index + 1}`,
      );
      const lane = normalizeLane(
        getNestedValue(item, ['lane', 'role', 'role_name', 'roleName', 'line', 'position', 'position_name']),
      );

      return {
        id: String(getNestedValue(item, ['id', 'hero_id', 'slug', 'key']) ?? name)
          .toLowerCase()
          .replace(/\s+/g, '-'),
        name,
        lane,
        role: String(getNestedValue(item, ['role', 'role_name', 'roleName', 'type']) ?? 'Fighter'),
        tier: normalizeTier(getNestedValue(item, ['tier', 'rank', 'meta_tier', 'metaTier'])),
        difficulty: normalizeDifficulty(getNestedValue(item, ['difficulty', 'complexity', 'hardness'])),
        winRate: normalizeNumber(getNestedValue(item, ['win_rate', 'winRate', 'winRatePct', 'winrate']), 50),
        pickRate: normalizeNumber(getNestedValue(item, ['pick_rate', 'pickRate', 'pickRatePct', 'pickrate']), 20),
        banRate: normalizeNumber(getNestedValue(item, ['ban_rate', 'banRate', 'banRatePct', 'banrate']), 10),
        build: normalizeStringArray(getNestedValue(item, ['build', 'bestBuild', 'recommendedBuild', 'recommended_build'])),
        runes: normalizeStringArray(
          getNestedValue(item, ['runes', 'runeBuild', 'emblems', 'recommendedRunes', 'recommended_runes']),
        ),
        items: normalizeStringArray(
          getNestedValue(item, ['items', 'itemBuild', 'bestItems', 'recommendedItems', 'recommended_items']),
        ),
        counters: normalizeStringArray(getNestedValue(item, ['counters', 'strongAgainst', 'strong_against'])),
        counteredBy: normalizeStringArray(
          getNestedValue(item, ['counteredBy', 'weakAgainst', 'weak_against', 'countered_by']),
        ),
        notes: String(
          getNestedValue(item, ['notes', 'description', 'summary', 'meta_note', 'metaNote']) ??
            'Dados carregados da API com atualização contínua.',
        ),
      };
    });
  } catch (error) {
    console.warn('Erro ao buscar dados da API. Usando fallback local.', error);
    return championBase;
  }
};

function App() {
  const [meta, setMeta] = useState<ChampionMeta[]>(() => championBase);
  const [selectedLane, setSelectedLane] = useState<(typeof laneGroups)[number]>('All');
  const [search, setSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedChampionId, setSelectedChampionId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      const data = await fetchMetaData();
      if (isMounted) {
        setMeta(data);
        setSelectedChampionId((current) => current ?? data[0]?.id ?? null);
        setLastUpdated(new Date());
        setLoading(false);
      }
    };

    loadData();

    const timer = setInterval(() => {
      setMeta((current) => refreshMeta(current));
      setLastUpdated(new Date());
    }, 12000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const filteredChampions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return meta.filter((champion) => {
      const matchesLane = selectedLane === 'All' || champion.lane === selectedLane;
      const matchesSearch =
        !query ||
        champion.name.toLowerCase().includes(query) ||
        champion.role.toLowerCase().includes(query) ||
        champion.lane.toLowerCase().includes(query);

      return matchesLane && matchesSearch;
    });
  }, [meta, search, selectedLane]);

  const topMeta = useMemo(() => buildRanking(filteredChampions).slice(0, 5), [filteredChampions]);
  const mostBanned = useMemo(
    () => [...filteredChampions].sort((a, b) => b.banRate - a.banRate).slice(0, 4),
    [filteredChampions],
  );

  const selectedChampion = useMemo(
    () => filteredChampions.find((champion) => champion.id === selectedChampionId) ?? filteredChampions[0] ?? null,
    [filteredChampions, selectedChampionId],
  );

  const averageWinRate =
    filteredChampions.length > 0
      ? (filteredChampions.reduce((sum, champion) => sum + champion.winRate, 0) / filteredChampions.length).toFixed(1)
      : '0.0';

  const laneSummary = useMemo(() => {
    const summary = laneGroups
      .filter((lane) => lane !== 'All')
      .map((lane) => {
        const champions = filteredChampions.filter((champion) => champion.lane === lane);
        return {
          lane,
          winRate:
            champions.length > 0
              ? (champions.reduce((sum, champion) => sum + champion.winRate, 0) / champions.length).toFixed(1)
              : '0.0',
          count: champions.length,
        };
      })
      .filter((entry) => entry.count > 0)
      .sort((a, b) => Number(b.winRate) - Number(a.winRate));

    return summary.slice(0, 3);
  }, [filteredChampions]);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">MLBB Meta Lab</p>
          <h1>Meta semanal + builds + counters</h1>
        </div>
        <div className="status-pill">
          <span className="dot" />
          {loading ? 'Carregando dados...' : `Atualizado: ${lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="hero-tag">Atualização automática</p>
          <h2>Veja os campeões mais fortes do meta, lane por lane, com build e runas sugeridas.</h2>
          <p>
            Os dados podem vir de uma API externa ou cair em fallback local. Assim o site continua funcionando mesmo
            que a fonte externa esteja indisponível.
          </p>
        </div>

        <div className="hero-panel">
          <div className="mini-stat">
            <span>Taxa média de vitória</span>
            <strong>{averageWinRate}%</strong>
          </div>
          <div className="mini-stat">
            <span>Campeões ativos</span>
            <strong>{filteredChampions.length}</strong>
          </div>
          <div className="mini-stat">
            <span>Mais forte hoje</span>
            <strong>{topMeta[0]?.name ?? '—'}</strong>
          </div>
        </div>
      </section>

      <section className="lane-spotlight">
        {laneSummary.map((lane) => (
          <div key={lane.lane} className="lane-box">
            <span>{lane.lane}</span>
            <strong>{lane.winRate}%</strong>
            <small>{lane.count} campeões</small>
          </div>
        ))}
      </section>

      <section className="filters">
        <div className="chip-group">
          {laneGroups.map((lane) => (
            <button
              key={lane}
              className={selectedLane === lane ? 'chip active' : 'chip'}
              onClick={() => setSelectedLane(lane)}
            >
              {lane}
            </button>
          ))}
        </div>

        <label className="search-box">
          <span>Buscar campeão</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Procure por nome, lane ou role"
          />
        </label>
      </section>

      <section className="summary-grid">
        <article className="summary-card accent-blue">
          <p>Top meta</p>
          <h3>{topMeta[0]?.name ?? 'Em preparação'}</h3>
          <strong>{topMeta[0]?.winRate ?? 0}% win rate</strong>
        </article>

        <article className="summary-card accent-gold">
          <p>Mais banido</p>
          <h3>{mostBanned[0]?.name ?? '—'}</h3>
          <strong>{mostBanned[0]?.banRate ?? 0}% ban</strong>
        </article>

        <article className="summary-card accent-pink">
          <p>Lane atual</p>
          <h3>{selectedLane === 'All' ? 'Geral' : selectedLane}</h3>
          <strong>{filteredChampions.length} campeões</strong>
        </article>
      </section>

      <section className="meta-section">
        <div className="section-head">
          <h3>Ranking da semana</h3>
          <span>Win rate</span>
        </div>

        <div className="leaderboard">
          {topMeta.map((champion, index) => (
            <button key={champion.id} className="leader-row" onClick={() => setSelectedChampionId(champion.id)}>
              <div className="rank-number">#{index + 1}</div>
              <div className="leader-info">
                <strong>{champion.name}</strong>
                <span>
                  {champion.lane} • {champion.role}
                </span>
              </div>
              <div className="leader-stats">
                <span>{champion.winRate}%</span>
                <small>win rate</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedChampion && (
        <aside className="featured-panel">
          <div className="featured-header">
            <div>
              <p className="eyebrow">Campeão em destaque</p>
              <h3>{selectedChampion.name}</h3>
            </div>
            <span className={`tier tier-${selectedChampion.tier.replace('+', '')}`}>{selectedChampion.tier}</span>
          </div>

          <div className="featured-body">
            <div className="stat-grid">
              <div>
                <span>Lane</span>
                <strong>{selectedChampion.lane}</strong>
              </div>
              <div>
                <span>Role</span>
                <strong>{selectedChampion.role}</strong>
              </div>
              <div>
                <span>Win rate</span>
                <strong>{selectedChampion.winRate}%</strong>
              </div>
              <div>
                <span>Ban rate</span>
                <strong>{selectedChampion.banRate}%</strong>
              </div>
            </div>

            <div className="feature-list">
              <h4>Build recomendada</h4>
              <ul>
                {selectedChampion.build.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="feature-list">
              <h4>Runas</h4>
              <ul>
                {selectedChampion.runes.map((rune) => (
                  <li key={rune}>{rune}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      )}

      <section className="champions-grid">
        {filteredChampions.map((champion) => (
          <article key={champion.id} className="champion-card">
            <div className="champion-head">
              <div className="avatar">{champion.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <h3>{champion.name}</h3>
                <p>
                  {champion.lane} • {champion.role}
                </p>
              </div>
              <span className={`tier tier-${champion.tier.replace('+', '')}`}>{champion.tier}</span>
            </div>

            <div className="stat-grid">
              <div>
                <span>Win rate</span>
                <strong>{champion.winRate}%</strong>
              </div>
              <div>
                <span>Pick</span>
                <strong>{champion.pickRate}%</strong>
              </div>
              <div>
                <span>Ban</span>
                <strong>{champion.banRate}%</strong>
              </div>
              <div>
                <span>Dificuldade</span>
                <strong>{champion.difficulty}</strong>
              </div>
            </div>

            <div className="detail-block">
              <h4>Build recomendada</h4>
              <ul>
                {champion.build.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-block">
              <h4>Runas</h4>
              <ul>
                {champion.runes.map((rune) => (
                  <li key={rune}>{rune}</li>
                ))}
              </ul>
            </div>

            <div className="detail-block">
              <h4>Itens</h4>
              <div className="tags">
                {champion.items.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-block">
              <h4>Counter / contra-counter</h4>
              <div className="counter-list">
                <div>
                  <span>Countera</span>
                  <p>{champion.counters.join(', ') || '—'}</p>
                </div>
                <div>
                  <span>É counterado por</span>
                  <p>{champion.counteredBy.join(', ') || '—'}</p>
                </div>
              </div>
            </div>

            <div className="notes">
              <strong>Observação</strong>
              <p>{champion.notes}</p>
            </div>

            <button className="cta-button" onClick={() => setSelectedChampionId(champion.id)}>
              Ver detalhes
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

export default App;
