import Icon from '@/components/Icon';

const PUBS = [
  { name: 'pub_all_tables', tables: 'All Tables',                 ops: ['INSERT', 'UPDATE', 'DELETE'], slot: 'pgoutput', active: true },
  { name: 'pub_users_posts', tables: 'users, posts',              ops: ['INSERT', 'UPDATE'],           slot: 'pgoutput', active: true },
  { name: 'pub_analytics',   tables: 'analytics, audit_logs',     ops: ['INSERT'],                     slot: 'wal2json', active: false },
];

export default function Publications() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Publications</h2>
        <p className="panel-header__desc">Logical replication publications that stream table changes to subscribers.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="ws-search">
          <Icon icon="lucide:search" style={{ fontSize: '0.875rem' }} className="ws-search__icon" />
          <input className="ws-search__input" placeholder="Search publications…" />
        </div>
        <button className="ws-btn ws-btn--primary">
          <Icon icon="lucide:plus" style={{ fontSize: '0.75rem' }} />
          New Publication
        </button>
      </div>

      <div className="ws-table-wrap">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Publication Name</th>
              <th>Tables</th>
              <th>Operations</th>
              <th>Output Plugin</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {PUBS.map((p) => (
              <tr key={p.name}>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon icon="lucide:rss" style={{ fontSize: '0.75rem', color: 'var(--text-quaternary)' }} />
                    {p.name}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{p.tables}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {p.ops.map((op) => <span key={op} className="ws-badge ws-badge--blue">{op}</span>)}
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{p.slot}</td>
                <td><span className={`ws-badge ws-badge--${p.active ? 'green' : 'gray'}`}>{p.active ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <button className="ws-btn ws-btn--ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
