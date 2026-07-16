'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import { api, type Database, type ConnectionInfo } from '@/lib/api';

interface Props {
  db: Database;
  onRefresh: () => void;
}

export default function DatabaseManagement({ db, onRefresh }: Props) {
  const [connInfo, setConnInfo]       = useState<ConnectionInfo | null>(null);
  const [history, setHistory]         = useState<{ query_text: string; duration_ms: number; executed_at: string }[]>([]);
  const [loadingConn, setLoadingConn] = useState(false);
  const [copiedKey, setCopiedKey]     = useState<string | null>(null);
  const [stopping, setStopping]       = useState(false);
  const [starting, setStarting]       = useState(false);

  // Load connection info + history when DB is running
  useEffect(() => {
    if (db.status !== 'running') return;
    setLoadingConn(true);
    Promise.all([
      api.databases.connect(db.id).then(setConnInfo).catch(() => {}),
      api.query.history(db.id).then(setHistory).catch(() => {}),
    ]).finally(() => setLoadingConn(false));
  }, [db.id, db.status]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleStop = async () => {
    setStopping(true);
    try { await api.databases.stop(db.id); onRefresh(); }
    finally { setStopping(false); }
  };

  const handleStart = async () => {
    setStarting(true);
    try { await api.databases.start(db.id); onRefresh(); }
    finally { setStarting(false); }
  };

  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Database Management</h2>
        <p className="panel-header__desc">
          Overview, connection details and controls for <strong>{db.name}</strong>.
        </p>
      </div>

      {/* Stats */}
      <div className="ws-stats-grid">
        <div className="ws-stat-card">
          <div className="ws-stat-card__label">Engine</div>
          <div className="ws-stat-card__value" style={{ fontSize: '1.25rem', textTransform: 'capitalize' }}>{db.engine}</div>
          <div className="ws-stat-card__sub">v{db.version}</div>
        </div>
        <div className="ws-stat-card">
          <div className="ws-stat-card__label">Port</div>
          <div className="ws-stat-card__value">{db.host_port}</div>
          <div className="ws-stat-card__sub">localhost</div>
        </div>
        <div className="ws-stat-card">
          <div className="ws-stat-card__label">Status</div>
          <div className="ws-stat-card__value" style={{
            fontSize: '1rem',
            color: db.status === 'running' ? '#34d399' : db.status === 'error' ? '#f87171' : 'var(--text-secondary)',
            textTransform: 'capitalize',
          }}>
            {db.status}
          </div>
          <div className="ws-stat-card__sub">container</div>
        </div>
        <div className="ws-stat-card">
          <div className="ws-stat-card__label">DB Name</div>
          <div className="ws-stat-card__value" style={{ fontSize: '1rem' }}>{db.db_name}</div>
          <div className="ws-stat-card__sub">database</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="panel-section-header">
        <h3>Controls</h3>
      </div>
      <div className="ws-actions-row">
        {db.status === 'running' ? (
          <button className="ws-action-card" onClick={handleStop} disabled={stopping}>
            <Icon icon={stopping ? 'lucide:loader' : 'lucide:square'} style={{ fontSize: '0.875rem', animation: stopping ? 'spin 1s linear infinite' : undefined }} className="ws-action-card__icon" />
            {stopping ? 'Stopping…' : 'Stop Container'}
          </button>
        ) : (
          <button className="ws-action-card" onClick={handleStart} disabled={starting || db.status === 'creating'}>
            <Icon icon={starting ? 'lucide:loader' : 'lucide:play'} style={{ fontSize: '0.875rem', animation: starting ? 'spin 1s linear infinite' : undefined }} className="ws-action-card__icon" />
            {starting ? 'Starting…' : 'Start Container'}
          </button>
        )}
        <button className="ws-action-card" onClick={onRefresh}>
          <Icon icon="lucide:refresh-cw" style={{ fontSize: '0.875rem' }} className="ws-action-card__icon" />
          Refresh Status
        </button>
      </div>

      {/* Connection string section */}
      <div className="panel-section-header" style={{ marginTop: '1.5rem' }}>
        <h3>Connection Details</h3>
        {db.status !== 'running' && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            (available when running)
          </span>
        )}
      </div>

      {db.status === 'running' && loadingConn && (
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Icon icon="lucide:loader" style={{ animation: 'spin 1s linear infinite' }} /> Loading…
        </div>
      )}

      {connInfo && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Connection URL */}
          <div className="ws-code-block">
            <div className="ws-code-block__header">
              <span>Connection URL</span>
              <button className="ws-code-block__copy" onClick={() => copy(connInfo.connection_url, 'url')}>
                <Icon icon={copiedKey === 'url' ? 'lucide:check' : 'lucide:copy'} style={{ fontSize: '0.75rem' }} />
                {copiedKey === 'url' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <code className="ws-code-block__content">{connInfo.connection_url}</code>
          </div>

          {/* Credentials grid */}
          <div className="ws-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="ws-stat-card">
              <div className="ws-stat-card__label">Host</div>
              <div className="ws-stat-card__value" style={{ fontSize: '0.9rem' }}>localhost</div>
            </div>
            <div className="ws-stat-card">
              <div className="ws-stat-card__label">Port</div>
              <div className="ws-stat-card__value" style={{ fontSize: '0.9rem' }}>{connInfo.port}</div>
            </div>
            <div className="ws-stat-card">
              <div className="ws-stat-card__label">Database</div>
              <div className="ws-stat-card__value" style={{ fontSize: '0.9rem' }}>{connInfo.database_name}</div>
            </div>
            {connInfo.username && (
              <div className="ws-stat-card">
                <div className="ws-stat-card__label">Username</div>
                <div className="ws-stat-card__value" style={{ fontSize: '0.9rem' }}>{connInfo.username}</div>
              </div>
            )}
            <div className="ws-stat-card" style={{ gridColumn: connInfo.username ? 'auto' : '1 / -1' }}>
              <div className="ws-stat-card__label">Password</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="ws-stat-card__value" style={{ fontSize: '0.85rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  {connInfo.password}
                </div>
                <button onClick={() => copy(connInfo.password, 'pwd')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '0.125rem' }}>
                  <Icon icon={copiedKey === 'pwd' ? 'lucide:check' : 'lucide:copy'} style={{ fontSize: '0.75rem' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Prisma schema */}
          {connInfo.prisma_schema && (
            <div className="ws-code-block">
              <div className="ws-code-block__header">
                <span>Prisma Schema</span>
                <button className="ws-code-block__copy" onClick={() => copy(connInfo.prisma_schema!, 'prisma')}>
                  <Icon icon={copiedKey === 'prisma' ? 'lucide:check' : 'lucide:copy'} style={{ fontSize: '0.75rem' }} />
                  {copiedKey === 'prisma' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="ws-code-block__content">{connInfo.prisma_schema}</pre>
            </div>
          )}

          {/* Drizzle config */}
          {connInfo.drizzle_config && (
            <div className="ws-code-block">
              <div className="ws-code-block__header">
                <span>Drizzle ORM</span>
                <button className="ws-code-block__copy" onClick={() => copy(connInfo.drizzle_config!, 'drizzle')}>
                  <Icon icon={copiedKey === 'drizzle' ? 'lucide:check' : 'lucide:copy'} style={{ fontSize: '0.75rem' }} />
                  {copiedKey === 'drizzle' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="ws-code-block__content">{connInfo.drizzle_config}</pre>
            </div>
          )}
        </div>
      )}

      {/* Query history */}
      {history.length > 0 && (
        <>
          <div className="panel-section-header" style={{ marginTop: '1.5rem' }}>
            <h3>Recent Queries</h3>
            <span className="ws-badge ws-badge--gray">{history.length}</span>
          </div>
          <div className="ws-activity-log">
            {history.slice(0, 8).map((q, i) => (
              <div key={i} className="ws-activity-item">
                <span className="ws-activity-item__dot ws-activity-item__dot--blue" />
                <span className="ws-activity-item__text" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {q.query_text.slice(0, 80)}{q.query_text.length > 80 ? '…' : ''}
                </span>
                <span className="ws-activity-item__time">{q.duration_ms}ms</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
