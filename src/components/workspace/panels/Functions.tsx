import Icon from '@/components/Icon';

const FUNCTIONS = [
  { name: 'get_user_posts',      lang: 'plpgsql', returns: 'SETOF posts',    desc: 'Returns all published posts for a given user ID.' },
  { name: 'update_timestamp',    lang: 'plpgsql', returns: 'TRIGGER',        desc: 'Auto-updates updated_at column on row modification.' },
  { name: 'slugify',             lang: 'sql',     returns: 'VARCHAR',        desc: 'Converts a string into a URL-safe slug.' },
  { name: 'calculate_post_rank', lang: 'plpgsql', returns: 'FLOAT',          desc: 'Computes post relevance score based on views and likes.' },
  { name: 'clean_expired_sessions', lang: 'plpgsql', returns: 'INTEGER',    desc: 'Deletes expired sessions and returns count removed.' },
  { name: 'full_text_search',    lang: 'sql',     returns: 'SETOF users',    desc: 'Full-text search across user name and email fields.' },
];

const LANG_COLOR: Record<string, string> = {
  plpgsql: 'blue',
  sql: 'green',
};

export default function Functions() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Functions</h2>
        <p className="panel-header__desc">Stored functions and procedures defined in this database.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="ws-search">
          <Icon icon="lucide:search" style={{ fontSize: '0.875rem' }} className="ws-search__icon" />
          <input className="ws-search__input" placeholder="Search functions…" />
        </div>
        <button className="ws-btn ws-btn--primary">
          <Icon icon="lucide:plus" style={{ fontSize: '0.75rem' }} />
          New Function
        </button>
      </div>

      <div className="ws-table-wrap">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Function Name</th>
              <th>Language</th>
              <th>Returns</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {FUNCTIONS.map((fn) => (
              <tr key={fn.name}>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon icon="lucide:code-2" style={{ fontSize: '0.75rem', color: 'var(--text-quaternary)' }} />
                    {fn.name}
                  </span>
                </td>
                <td>
                  <span className={`ws-badge ws-badge--${LANG_COLOR[fn.lang] ?? 'gray'}`}>{fn.lang}</span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{fn.returns}</td>
                <td style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', maxWidth: '280px' }}>{fn.desc}</td>
                <td>
                  <button className="ws-btn ws-btn--ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    Edit
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
