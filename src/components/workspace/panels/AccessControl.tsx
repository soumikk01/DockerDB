import Icon from '@/components/Icon';

const USERS = ['admin', 'app_user', 'readonly', 'analytics', 'replicator'];
const TABLES_ACL = ['users', 'posts', 'comments', 'analytics', 'audit_logs'];
const PRIVS = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE'];

const ACL: Record<string, Record<string, boolean>> = {
  admin:      { SELECT: true,  INSERT: true,  UPDATE: true,  DELETE: true,  TRUNCATE: true  },
  app_user:   { SELECT: true,  INSERT: true,  UPDATE: true,  DELETE: false, TRUNCATE: false },
  readonly:   { SELECT: true,  INSERT: false, UPDATE: false, DELETE: false, TRUNCATE: false },
  analytics:  { SELECT: true,  INSERT: false, UPDATE: false, DELETE: false, TRUNCATE: false },
  replicator: { SELECT: true,  INSERT: false, UPDATE: false, DELETE: false, TRUNCATE: false },
};

export default function AccessControl() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Access Control</h2>
        <p className="panel-header__desc">Table-level privilege grants for all database users and roles.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div className="ws-search">
          <Icon icon="lucide:search" style={{ fontSize: '0.875rem' }} className="ws-search__icon" />
          <input className="ws-search__input" placeholder="Filter by user or table…" />
        </div>
        <button className="ws-btn ws-btn--primary">
          <Icon icon="lucide:plus" style={{ fontSize: '0.75rem' }} />
          Grant Privilege
        </button>
      </div>

      <div className="ws-table-wrap">
        <table className="ws-acl-table">
          <thead>
            <tr>
              <th>User / Role</th>
              {PRIVS.map((p) => <th key={p}>{p}</th>)}
            </tr>
          </thead>
          <tbody>
            {USERS.map((user) => (
              <tr key={user}>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon icon="lucide:user" style={{ fontSize: '0.75rem', color: 'var(--text-quaternary)' }} />
                    {user}
                  </span>
                </td>
                {PRIVS.map((priv) => (
                  <td key={priv}>
                    <div className={`ws-perm-check ws-perm-check--${ACL[user]?.[priv] ? 'yes' : 'no'}`}>
                      <Icon
                        icon={ACL[user]?.[priv] ? 'lucide:check' : 'lucide:minus'}
                        style={{ fontSize: '0.875rem' }}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
        Showing privileges for table: <strong style={{ color: 'var(--text-secondary)' }}>users</strong> — select a different table from the dropdown to inspect others.
      </p>
    </div>
  );
}
