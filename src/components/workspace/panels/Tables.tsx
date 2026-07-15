import Icon from '@/components/Icon';

const TABLES = [
  { name: 'users',        rows: '14,823', size: '2.1 MB',  cols: 8,  indexes: 3, modified: '2 min ago' },
  { name: 'posts',        rows: '4,291',  size: '892 KB',  cols: 12, indexes: 4, modified: '15 min ago' },
  { name: 'comments',     rows: '28,443', size: '4.7 MB',  cols: 7,  indexes: 2, modified: '1 hr ago' },
  { name: 'tags',         rows: '156',    size: '48 KB',   cols: 4,  indexes: 2, modified: '3 days ago' },
  { name: 'post_tags',    rows: '9,104',  size: '720 KB',  cols: 2,  indexes: 2, modified: '1 hr ago' },
  { name: 'sessions',     rows: '3,201',  size: '640 KB',  cols: 6,  indexes: 2, modified: '5 min ago' },
  { name: 'media',        rows: '2,018',  size: '1.2 MB',  cols: 9,  indexes: 2, modified: '2 days ago' },
  { name: 'analytics',    rows: '182,934',size: '38.4 MB', cols: 11, indexes: 5, modified: '20 min ago' },
  { name: 'audit_logs',   rows: '45,012', size: '8.9 MB',  cols: 8,  indexes: 3, modified: '2 min ago' },
];

export default function Tables() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Tables</h2>
        <p className="panel-header__desc">All tables in the current schema with row counts, sizes, and metadata.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
        <div className="ws-search">
          <Icon icon="lucide:search" style={{ fontSize: '0.875rem' }} className="ws-search__icon" />
          <input className="ws-search__input" placeholder="Search tables…" />
        </div>
        <button className="ws-btn ws-btn--primary">
          <Icon icon="lucide:plus" style={{ fontSize: '0.75rem' }} />
          New Table
        </button>
      </div>

      <div className="ws-table-wrap">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Table Name</th>
              <th>Rows</th>
              <th>Size</th>
              <th>Columns</th>
              <th>Indexes</th>
              <th>Last Modified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {TABLES.map((t) => (
              <tr key={t.name}>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon icon="lucide:table-2" style={{ fontSize: '0.75rem', color: 'var(--text-quaternary)' }} />
                    {t.name}
                  </span>
                </td>
                <td>{t.rows}</td>
                <td>{t.size}</td>
                <td>{t.cols}</td>
                <td>{t.indexes}</td>
                <td style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{t.modified}</td>
                <td>
                  <button className="ws-btn ws-btn--ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    <Icon icon="lucide:more-horizontal" style={{ fontSize: '0.75rem' }} />
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
