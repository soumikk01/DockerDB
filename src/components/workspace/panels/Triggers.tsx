import Icon from '@/components/Icon';

const TRIGGERS = [
  { name: 'set_updated_at',     table: 'users',    event: 'UPDATE',            timing: 'BEFORE', fn: 'update_timestamp()', enabled: true },
  { name: 'set_post_updated_at',table: 'posts',    event: 'UPDATE',            timing: 'BEFORE', fn: 'update_timestamp()', enabled: true },
  { name: 'audit_user_changes', table: 'users',    event: 'INSERT OR UPDATE',  timing: 'AFTER',  fn: 'log_audit_event()',  enabled: true },
  { name: 'notify_new_post',    table: 'posts',    event: 'INSERT',            timing: 'AFTER',  fn: 'notify_channel()',   enabled: false },
  { name: 'delete_cascade_tags',table: 'tags',     event: 'DELETE',            timing: 'BEFORE', fn: 'cascade_delete()',   enabled: true },
];

export default function Triggers() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Triggers</h2>
        <p className="panel-header__desc">Database triggers that fire automatically on table events.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="ws-search">
          <Icon icon="lucide:search" style={{ fontSize: '0.875rem' }} className="ws-search__icon" />
          <input className="ws-search__input" placeholder="Search triggers…" />
        </div>
        <button className="ws-btn ws-btn--primary">
          <Icon icon="lucide:plus" style={{ fontSize: '0.75rem' }} />
          New Trigger
        </button>
      </div>

      <div className="ws-table-wrap">
        <table className="ws-table">
          <thead>
            <tr>
              <th>Trigger Name</th>
              <th>Table</th>
              <th>Event</th>
              <th>Timing</th>
              <th>Function</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {TRIGGERS.map((t) => (
              <tr key={t.name}>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon icon="lucide:zap" style={{ fontSize: '0.75rem', color: 'var(--text-quaternary)' }} />
                    {t.name}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{t.table}</td>
                <td><span className="ws-badge ws-badge--blue">{t.event}</span></td>
                <td><span className="ws-badge ws-badge--gray">{t.timing}</span></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{t.fn}</td>
                <td>
                  <span className={`ws-badge ws-badge--${t.enabled ? 'green' : 'gray'}`}>
                    {t.enabled ? 'Enabled' : 'Disabled'}
                  </span>
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
