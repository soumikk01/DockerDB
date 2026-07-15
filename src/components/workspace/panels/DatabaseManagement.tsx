import Icon from '@/components/Icon';

export default function DatabaseManagement({ dbName }: { dbName: string }) {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Database Management</h2>
        <p className="panel-header__desc">Overview, statistics and quick actions for <strong>{dbName}</strong>.</p>
      </div>

      {/* Stats */}
      <div className="ws-stats-grid">
        <div className="ws-stat-card">
          <div className="ws-stat-card__label">Total Size</div>
          <div className="ws-stat-card__value">2.4<span style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>GB</span></div>
          <div className="ws-stat-card__trend">↑ 12% this week</div>
        </div>
        <div className="ws-stat-card">
          <div className="ws-stat-card__label">Tables</div>
          <div className="ws-stat-card__value">23</div>
          <div className="ws-stat-card__sub">in public schema</div>
        </div>
        <div className="ws-stat-card">
          <div className="ws-stat-card__label">Connections</div>
          <div className="ws-stat-card__value" style={{ color: 'var(--emerald-400-70)' }}>7</div>
          <div className="ws-stat-card__sub">of 100 max</div>
        </div>
        <div className="ws-stat-card">
          <div className="ws-stat-card__label">Uptime</div>
          <div className="ws-stat-card__value" style={{ fontSize: '1.25rem' }}>14d 6h</div>
          <div className="ws-stat-card__sub">since last restart</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="panel-section-header">
        <h3>Quick Actions</h3>
      </div>
      <div className="ws-actions-row">
        {[
          { icon: 'lucide:database-backup', label: 'Backup Database' },
          { icon: 'lucide:refresh-cw', label: 'Vacuum' },
          { icon: 'lucide:bar-chart-2', label: 'Analyze' },
          { icon: 'lucide:upload', label: 'Restore' },
          { icon: 'lucide:terminal', label: 'Open SQL Editor' },
        ].map((action) => (
          <button key={action.label} className="ws-action-card">
            <Icon icon={action.icon} style={{ fontSize: '0.875rem' }} className="ws-action-card__icon" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Activity log */}
      <div className="panel-section-header">
        <h3>Recent Activity</h3>
        <span className="ws-badge ws-badge--gray">Live</span>
      </div>
      <div className="ws-activity-log">
        {[
          { dot: 'green',  text: <><strong>VACUUM ANALYZE</strong> completed on <strong>users</strong> table — 14,823 rows</>, time: '2m ago' },
          { dot: 'blue',   text: <><strong>Connection</strong> opened from <strong>127.0.0.1:54821</strong></>, time: '5m ago' },
          { dot: 'green',  text: <><strong>INSERT</strong> — 1 row added to <strong>posts</strong></>, time: '12m ago' },
          { dot: 'amber',  text: <><strong>Slow query</strong> detected (1.2s) on <strong>analytics</strong></>, time: '18m ago' },
          { dot: 'blue',   text: <><strong>Connection</strong> closed from <strong>127.0.0.1:54810</strong></>, time: '24m ago' },
          { dot: 'green',  text: <><strong>Checkpoint</strong> completed — 423 buffers written</>, time: '31m ago' },
        ].map((item, i) => (
          <div key={i} className="ws-activity-item">
            <span className={`ws-activity-item__dot ws-activity-item__dot--${item.dot}`} />
            <span className="ws-activity-item__text">{item.text}</span>
            <span className="ws-activity-item__time">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
