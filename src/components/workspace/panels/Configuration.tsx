import Icon from '@/components/Icon';

const CONFIGS = [
  { key: 'max_connections',            value: '100',           unit: '',      category: 'Connections', desc: 'Maximum number of concurrent connections.' },
  { key: 'shared_buffers',             value: '128',           unit: 'MB',    category: 'Memory',      desc: 'Amount of memory for shared memory buffers.' },
  { key: 'effective_cache_size',       value: '4096',          unit: 'MB',    category: 'Memory',      desc: 'Planner assumption about the effective size of disk cache.' },
  { key: 'work_mem',                   value: '4',             unit: 'MB',    category: 'Memory',      desc: 'Memory used for sort operations and hash tables.' },
  { key: 'maintenance_work_mem',       value: '64',            unit: 'MB',    category: 'Memory',      desc: 'Memory used for maintenance operations.' },
  { key: 'wal_level',                  value: 'replica',       unit: '',      category: 'WAL',         desc: 'Level of information written to WAL.' },
  { key: 'max_wal_size',               value: '1024',          unit: 'MB',    category: 'WAL',         desc: 'Maximum WAL size that triggers a checkpoint.' },
  { key: 'checkpoint_completion_target', value: '0.9',         unit: '',      category: 'WAL',         desc: 'Target for checkpoint completion as fraction of checkpoint interval.' },
  { key: 'log_min_duration_statement', value: '1000',          unit: 'ms',    category: 'Logging',     desc: 'Logs statements that run longer than this value.' },
  { key: 'log_connections',            value: 'off',           unit: '',      category: 'Logging',     desc: 'Log each successful connection.' },
  { key: 'autovacuum',                 value: 'on',            unit: '',      category: 'Autovacuum',  desc: 'Enables autovacuum subprocess.' },
  { key: 'autovacuum_max_workers',     value: '3',             unit: '',      category: 'Autovacuum',  desc: 'Maximum number of autovacuum worker processes.' },
];

const categories = [...new Set(CONFIGS.map(c => c.category))];

export default function Configuration() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Configuration</h2>
        <p className="panel-header__desc">Runtime PostgreSQL configuration parameters. Changes require a server reload or restart.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div className="ws-search">
          <Icon icon="lucide:search" style={{ fontSize: '0.875rem' }} className="ws-search__icon" />
          <input className="ws-search__input" placeholder="Search parameters…" />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <span key={cat} className="ws-badge ws-badge--gray">{cat}</span>
          ))}
        </div>
      </div>

      <div className="ws-table-wrap">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {CONFIGS.map((cfg) => (
              <tr key={cfg.key}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>{cfg.key}</td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-70)' }}>
                    {cfg.value}{cfg.unit && <span style={{ color: 'var(--text-quaternary)' }}>{cfg.unit}</span>}
                  </span>
                </td>
                <td><span className="ws-badge ws-badge--gray">{cfg.category}</span></td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', maxWidth: '300px' }}>{cfg.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
