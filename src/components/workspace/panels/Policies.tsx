import Icon from '@/components/Icon';

const POLICIES = [
  { name: 'users_own_rows',         table: 'users',     cmd: 'ALL',    type: 'PERMISSIVE',   using: 'id = current_user_id()' },
  { name: 'posts_published_only',   table: 'posts',     cmd: 'SELECT', type: 'PERMISSIVE',   using: "status = 'published' OR user_id = current_user_id()" },
  { name: 'comments_own_rows',      table: 'comments',  cmd: 'ALL',    type: 'PERMISSIVE',   using: 'user_id = current_user_id()' },
  { name: 'admin_full_access',      table: 'audit_logs', cmd: 'ALL',   type: 'PERMISSIVE',   using: 'is_admin()' },
  { name: 'analytics_read_only',    table: 'analytics', cmd: 'SELECT', type: 'RESTRICTIVE',  using: 'TRUE' },
];

export default function Policies() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Policies</h2>
        <p className="panel-header__desc">Row-level security (RLS) policies that control access to individual table rows.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="ws-search">
          <Icon icon="lucide:search" style={{ fontSize: '0.875rem' }} className="ws-search__icon" />
          <input className="ws-search__input" placeholder="Search policies…" />
        </div>
        <button className="ws-btn ws-btn--primary">
          <Icon icon="lucide:plus" style={{ fontSize: '0.75rem' }} />
          New Policy
        </button>
      </div>

      <div className="ws-table-wrap">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Table</th>
              <th>Command</th>
              <th>Type</th>
              <th>USING Expression</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {POLICIES.map((p) => (
              <tr key={p.name}>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon icon="lucide:file-lock" style={{ fontSize: '0.75rem', color: 'var(--text-quaternary)' }} />
                    {p.name}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{p.table}</td>
                <td><span className="ws-badge ws-badge--blue">{p.cmd}</span></td>
                <td>
                  <span className={`ws-badge ws-badge--${p.type === 'PERMISSIVE' ? 'green' : 'amber'}`}>
                    {p.type}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.using}
                </td>
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
