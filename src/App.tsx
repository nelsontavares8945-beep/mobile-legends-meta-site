import { useEffect, useMemo, useState } from 'react';
import { buildRanking, championBase, laneGroups, refreshMeta, type ChampionMeta } from './data/meta';

function App() {
  const [meta, setMeta] = useState<ChampionMeta[]>(() => championBase);
  const [selectedLane, setSelectedLane] = useState<(typeof laneGroups)[number]>('All');
  const [search, setSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setMeta((current) => refreshMeta(current));
      setLastUpdated(new Date());
    }, 10000);

    return () => clearInterval(timer);
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

  const averageWinRate =
    filteredChampions.length > 0
      ? (filteredChampions.reduce((sum, champion) => sum + champion.winRate, 0) / filteredChampions.length).toFixed(1)
      : '0.0';

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">MLBB Meta Lab</p>
          <h1>Meta semanal + builds + counters</h1>
        </div>
        <div className="status-pill">
          <span className="dot" />
          Atualizado: {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="hero-tag">Atualização automática</p>
          <h2>Veja os campeões mais fortes do meta, lane por lane, com build e runas sugeridas.</h2>
          <p>
            Sem uma API oficial do jogo, esta versão usa uma base de dados curada e atualização automática por refresh
            periódico para simular a meta semanal. Quando houver uma API confiável, o mesmo painel pode ser conectado
            diretamente a ela.
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
            <div key={champion.id} className="leader-row">
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
            </div>
          ))}
        </div>
      </section>

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
          </article>
        ))}
      </section>
    </div>
  );
}

export default App;
