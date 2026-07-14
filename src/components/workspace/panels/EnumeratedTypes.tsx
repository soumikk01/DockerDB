import Icon from '@/components/Icon';

const ENUMS = [
  { name: 'user_status',    values: ['active', 'inactive', 'banned', 'pending'],                schema: 'public' },
  { name: 'post_status',    values: ['draft', 'published', 'archived', 'scheduled'],            schema: 'public' },
  { name: 'media_type',     values: ['image', 'video', 'audio', 'document'],                    schema: 'public' },
  { name: 'role_level',     values: ['admin', 'moderator', 'editor', 'viewer', 'guest'],        schema: 'public' },
  { name: 'notification_t', values: ['email', 'push', 'sms', 'in_app'],                         schema: 'public' },
];

export default function EnumeratedTypes() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Enumerated Types</h2>
        <p className="panel-header__desc">Custom enumeration types that constrain column values to a predefined set.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="ws-search">
          <Icon icon="lucide:search" style={{ fontSize: '0.875rem' }} className="ws-search__icon" />
          <input className="ws-search__input" placeholder="Search enum types…" />
        </div>
        <button className="ws-btn ws-btn--primary">
          <Icon icon="lucide:plus" style={{ fontSize: '0.75rem' }} />
          New Type
        </button>
      </div>

      <div className="ws-table-wrap">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Type Name</th>
              <th>Schema</th>
              <th>Values</th>
              <th>Count</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ENUMS.map((e) => (
              <tr key={e.name}>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon icon="lucide:list" style={{ fontSize: '0.75rem', color: 'var(--text-quaternary)' }} />
                    {e.name}
                  </span>
                </td>
                <td style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{e.schema}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    {e.values.map((v) => (
                      <span key={v} className="ws-badge ws-badge--gray">{v}</span>
                    ))}
                  </div>
                </td>
                <td>{e.values.length}</td>
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
