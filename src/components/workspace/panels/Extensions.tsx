import Icon from '@/components/Icon';

const EXTENSIONS = [
  { name: 'uuid-ossp',    version: '1.1',  schema: 'public',      desc: 'Generate universally unique identifiers (UUIDs).', installed: true },
  { name: 'pg_stat_statements', version: '1.10', schema: 'public', desc: 'Track planning and execution statistics of all SQL statements.', installed: true },
  { name: 'pgcrypto',    version: '1.3',  schema: 'public',      desc: 'Cryptographic functions (hashing, encryption, random data).', installed: true },
  { name: 'pg_trgm',     version: '1.6',  schema: 'public',      desc: 'Text similarity measurement and index searching based on trigrams.', installed: true },
  { name: 'hstore',      version: '1.8',  schema: 'public',      desc: 'Store key/value pairs within a single PostgreSQL value.', installed: false },
  { name: 'PostGIS',     version: '3.4',  schema: 'public',      desc: 'Spatial and geographic objects for PostgreSQL.', installed: false },
  { name: 'pg_partman',  version: '5.0',  schema: 'partman',     desc: 'Partition management extension for PostgreSQL.', installed: false },
];

export default function Extensions() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Extensions</h2>
        <p className="panel-header__desc">PostgreSQL extensions that add extra functionality to the database engine.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="ws-search">
          <Icon icon="lucide:search" style={{ fontSize: '0.875rem' }} className="ws-search__icon" />
          <input className="ws-search__input" placeholder="Search extensions…" />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="ws-badge ws-badge--green">{EXTENSIONS.filter(e => e.installed).length} installed</span>
          <span className="ws-badge ws-badge--gray">{EXTENSIONS.filter(e => !e.installed).length} available</span>
        </div>
      </div>

      <div className="ws-table-wrap">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Extension</th>
              <th>Version</th>
              <th>Schema</th>
              <th>Description</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {EXTENSIONS.map((ext) => (
              <tr key={ext.name}>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon icon="lucide:puzzle" style={{ fontSize: '0.75rem', color: 'var(--text-quaternary)' }} />
                    {ext.name}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>v{ext.version}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{ext.schema}</td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', maxWidth: '260px' }}>{ext.desc}</td>
                <td>
                  <span className={`ws-badge ws-badge--${ext.installed ? 'green' : 'gray'}`}>
                    {ext.installed ? 'Installed' : 'Available'}
                  </span>
                </td>
                <td>
                  <button className="ws-btn ws-btn--ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    {ext.installed ? 'Remove' : 'Install'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
