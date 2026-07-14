import Icon from '@/components/Icon';

const INDEXES = [
  { name: 'users_pkey',             table: 'users',     columns: 'id',                    type: 'btree',  size: '136 KB', scans: 28400, unique: true },
  { name: 'users_email_idx',        table: 'users',     columns: 'email',                 type: 'btree',  size: '88 KB',  scans: 14210, unique: true },
  { name: 'posts_pkey',             table: 'posts',     columns: 'id',                    type: 'btree',  size: '72 KB',  scans: 9820,  unique: true },
  { name: 'posts_user_id_idx',      table: 'posts',     columns: 'user_id',               type: 'btree',  size: '56 KB',  scans: 4320,  unique: false },
  { name: 'posts_title_fts_idx',    table: 'posts',     columns: 'title, body',           type: 'gin',    size: '320 KB', scans: 2100,  unique: false },
  { name: 'comments_post_id_idx',   table: 'comments',  columns: 'post_id',               type: 'btree',  size: '224 KB', scans: 5680,  unique: false },
  { name: 'analytics_created_idx',  table: 'analytics', columns: 'created_at DESC',       type: 'btree',  size: '1.4 MB', scans: 18920, unique: false },
  { name: 'sessions_token_idx',     table: 'sessions',  columns: 'token',                 type: 'hash',   size: '48 KB',  scans: 31200, unique: true },
];

const TYPE_COLOR: Record<string, string> = { btree: 'blue', gin: 'amber', hash: 'green', gist: 'gray' };

export default function Indexes() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Indexes</h2>
        <p className="panel-header__desc">All indexes across database tables — type, size and usage statistics.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div className="ws-search">
          <Icon icon="lucide:search" style={{ fontSize: '0.875rem' }} className="ws-search__icon" />
          <input className="ws-search__input" placeholder="Search indexes…" />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="ws-badge ws-badge--gray">{INDEXES.length} total</span>
          <span className="ws-badge ws-badge--blue">{INDEXES.filter(i => i.type === 'btree').length} btree</span>
        </div>
      </div>

      <div className="ws-table-wrap">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Index Name</th>
              <th>Table</th>
              <th>Columns</th>
              <th>Type</th>
              <th>Size</th>
              <th>Scans</th>
              <th>Unique</th>
            </tr>
          </thead>
          <tbody>
            {INDEXES.map((idx) => (
              <tr key={idx.name}>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon icon="lucide:search" style={{ fontSize: '0.75rem', color: 'var(--text-quaternary)' }} />
                    {idx.name}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{idx.table}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{idx.columns}</td>
                <td><span className={`ws-badge ws-badge--${TYPE_COLOR[idx.type] ?? 'gray'}`}>{idx.type}</span></td>
                <td>{idx.size}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{idx.scans.toLocaleString()}</td>
                <td>
                  {idx.unique
                    ? <Icon icon="lucide:check" style={{ fontSize: '0.875rem', color: 'var(--emerald-400-70)' }} />
                    : <Icon icon="lucide:minus" style={{ fontSize: '0.875rem', color: 'var(--text-quaternary)' }} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
