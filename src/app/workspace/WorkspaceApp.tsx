'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Icon from '@/components/Icon';
import { api, type Database, type DBStatus } from '@/lib/api';

// Panels
import DatabaseManagement from '@/components/workspace/panels/DatabaseManagement';
import SchemaVisualizer from '@/components/workspace/panels/SchemaVisualizer';
import Tables from '@/components/workspace/panels/Tables';
import Functions from '@/components/workspace/panels/Functions';
import Triggers from '@/components/workspace/panels/Triggers';
import EnumeratedTypes from '@/components/workspace/panels/EnumeratedTypes';
import Extensions from '@/components/workspace/panels/Extensions';
import Indexes from '@/components/workspace/panels/Indexes';
import Publications from '@/components/workspace/panels/Publications';
import AccessControl from '@/components/workspace/panels/AccessControl';
import Policies from '@/components/workspace/panels/Policies';
import Roles from '@/components/workspace/panels/Roles';
import Configuration from '@/components/workspace/panels/Configuration';
import Settings from '@/components/workspace/panels/Settings';

// ── DB metadata (display only) ────────────────────────────────────────────────
const DB_META: Record<string, { icon: string; iconColor: string; iconBg: string }> = {
  postgresql: { icon: 'simple-icons:postgresql', iconColor: '#336791', iconBg: 'rgba(51,103,145,0.2)' },
  mysql:      { icon: 'simple-icons:mysql',      iconColor: '#4479A1', iconBg: 'rgba(68,121,161,0.2)' },
  mongodb:    { icon: 'simple-icons:mongodb',    iconColor: '#47A248', iconBg: 'rgba(71,162,72,0.2)'  },
  redis:      { icon: 'simple-icons:redis',      iconColor: '#DC382D', iconBg: 'rgba(220,56,45,0.2)'  },
};

// ── Nav structure ─────────────────────────────────────────────────────────────
type PanelId =
  | 'db-management' | 'schema' | 'tables' | 'functions' | 'triggers'
  | 'enum-types' | 'extensions' | 'indexes' | 'publications'
  | 'access-control' | 'policies' | 'roles'
  | 'configuration' | 'settings';

const NAV_GROUPS: { label: string; items: { id: PanelId; label: string; icon: string }[] }[] = [
  {
    label: 'Database',
    items: [
      { id: 'db-management', label: 'Database Management', icon: 'lucide:database' },
      { id: 'schema',        label: 'Schema Visualizer',   icon: 'lucide:git-branch' },
      { id: 'tables',        label: 'Tables',              icon: 'lucide:table-2' },
      { id: 'functions',     label: 'Functions',           icon: 'lucide:code-2' },
      { id: 'triggers',      label: 'Triggers',            icon: 'lucide:zap' },
      { id: 'enum-types',    label: 'Enumerated Types',    icon: 'lucide:list' },
      { id: 'extensions',    label: 'Extensions',          icon: 'lucide:puzzle' },
      { id: 'indexes',       label: 'Indexes',             icon: 'lucide:search' },
      { id: 'publications',  label: 'Publications',        icon: 'lucide:rss' },
    ],
  },
  {
    label: 'Security',
    items: [
      { id: 'access-control', label: 'Access Control', icon: 'lucide:shield' },
      { id: 'policies',       label: 'Policies',       icon: 'lucide:file-lock' },
      { id: 'roles',          label: 'Roles',          icon: 'lucide:users' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'configuration', label: 'Configuration', icon: 'lucide:sliders' },
      { id: 'settings',      label: 'Settings',      icon: 'lucide:settings' },
    ],
  },
];

const PANEL_LABELS: Record<PanelId, string> = {
  'db-management':  'Database Management',
  'schema':         'Schema Visualizer',
  'tables':         'Tables',
  'functions':      'Functions',
  'triggers':       'Triggers',
  'enum-types':     'Enumerated Types',
  'extensions':     'Extensions',
  'indexes':        'Indexes',
  'publications':   'Publications',
  'access-control': 'Access Control',
  'policies':       'Policies',
  'roles':          'Roles',
  'configuration':  'Configuration',
  'settings':       'Settings',
};

function statusColor(status: DBStatus): string {
  switch (status) {
    case 'running':  return 'var(--emerald-400-70, #34d399)';
    case 'creating': return '#f59e0b';
    case 'stopped':  return 'var(--text-tertiary)';
    case 'error':    return '#f87171';
    default:         return 'var(--text-tertiary)';
  }
}

function statusLabel(status: DBStatus): string {
  switch (status) {
    case 'running':  return '● Running';
    case 'creating': return '◌ Creating…';
    case 'stopped':  return '○ Stopped';
    case 'error':    return '✕ Error';
    default:         return status;
  }
}

export default function WorkspaceApp() {
  const router = useRouter();
  const params = useSearchParams();
  const dbId   = params.get('id') ?? '';
  const dbKey  = params.get('db') ?? 'postgresql';

  const meta = DB_META[dbKey] ?? DB_META['postgresql'];

  const [db, setDb]           = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<PanelId>('db-management');

  // ── Load database from backend ─────────────────────────────────────────────
  const fetchDb = useCallback(async () => {
    if (!dbId) { setLoading(false); return; }
    try {
      const data = await api.databases.get(dbId);
      setDb(data);
    } catch {
      setDb(null);
    } finally {
      setLoading(false);
    }
  }, [dbId]);

  useEffect(() => { fetchDb(); }, [fetchDb]);

  // Poll status every 3 s while creating
  useEffect(() => {
    if (!dbId) return;
    if (db?.status === 'running' || db?.status === 'error') return;
    const t = setInterval(fetchDb, 3000);
    return () => clearInterval(t);
  }, [dbId, db?.status, fetchDb]);

  // ── Render panel ───────────────────────────────────────────────────────────
  function renderPanel() {
    if (!db) return null;
    switch (activePanel) {
      case 'db-management':  return <DatabaseManagement db={db} onRefresh={fetchDb} />;
      case 'schema':         return <SchemaVisualizer db={db} />;
      case 'tables':         return <Tables db={db} />;
      case 'functions':      return <Functions />;
      case 'triggers':       return <Triggers />;
      case 'enum-types':     return <EnumeratedTypes />;
      case 'extensions':     return <Extensions />;
      case 'indexes':        return <Indexes />;
      case 'publications':   return <Publications />;
      case 'access-control': return <AccessControl />;
      case 'policies':       return <Policies />;
      case 'roles':          return <Roles />;
      case 'configuration':  return <Configuration />;
      case 'settings':       return <Settings />;
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '0.75rem', color: 'var(--text-secondary)' }}>
        <Icon icon="lucide:loader" style={{ fontSize: '1.25rem', animation: 'spin 1s linear infinite' }} />
        Loading database…
      </div>
    );
  }

  // ── No ID in URL — redirect to select ─────────────────────────────────────
  if (!dbId) {
    router.replace('/select-database');
    return null;
  }

  const dbName    = db?.name ?? dbKey;
  const dbHost    = db ? `localhost:${db.host_port}` : '—';
  const dbStatus  = db?.status ?? 'error';
  const dbVersion = db?.version ?? '—';

  return (
    <div className="workspace">
      {/* ── Sidebar ────────────────────────────── */}
      <aside className="ws-sidebar">
        <div className="ws-sidebar-header">
          {/* Back link */}
          <button className="ws-sidebar-header__back" onClick={() => router.push('/select-database')}>
            <Icon icon="lucide:arrow-left" style={{ fontSize: '0.75rem' }} />
            Change database
          </button>

          {/* DB identity */}
          <div className="ws-sidebar-header__db">
            <div className="ws-sidebar-header__icon" style={{ background: meta.iconBg }}>
              <Icon icon={meta.icon} style={{ fontSize: '1.125rem', color: meta.iconColor }} />
            </div>
            <div>
              <div className="ws-sidebar-header__name">{dbName}</div>
              <div className="ws-sidebar-header__host">{dbHost}</div>
              <div className="ws-sidebar-header__status" style={{ color: statusColor(dbStatus) }}>
                <span className="ws-sidebar-header__status-dot" style={{ background: statusColor(dbStatus) }} />
                {statusLabel(dbStatus)}
              </div>
            </div>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="ws-sidebar-nav" aria-label="Workspace navigation">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="ws-nav-group">
              <div className="ws-nav-group__label">{group.label}</div>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={`ws-nav-item${activePanel === item.id ? ' ws-nav-item--active' : ''}`}
                  onClick={() => setActivePanel(item.id)}
                  aria-current={activePanel === item.id ? 'page' : undefined}
                >
                  <Icon icon={item.icon} style={{ fontSize: '0.875rem' }} className="ws-nav-item__icon" />
                  <span className="ws-nav-item__label">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Image src="/logo.svg" alt="DockerDB" width={72} height={18} />
          </a>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────── */}
      <div className="ws-main">
        {/* Top bar */}
        <header className="ws-topbar">
          <div className="ws-topbar__breadcrumb">
            <span>{dbName}</span>
            <span className="ws-topbar__sep">/</span>
            <span>{PANEL_LABELS[activePanel]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>v{dbVersion}</span>
            <span
              className="ws-badge"
              style={{
                background: dbStatus === 'running' ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)',
                color: statusColor(dbStatus),
                border: `1px solid ${statusColor(dbStatus)}33`,
              }}
            >
              {statusLabel(dbStatus)}
            </span>
          </div>
        </header>

        {/* Creating state overlay */}
        {dbStatus === 'creating' && (
          <div style={{
            background: 'rgba(245,158,11,0.06)',
            borderBottom: '1px solid rgba(245,158,11,0.2)',
            padding: '0.625rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            fontSize: '0.8125rem',
            color: '#f59e0b',
          }}>
            <Icon icon="lucide:loader" style={{ fontSize: '0.875rem', animation: 'spin 1s linear infinite' }} />
            Pulling Docker image and starting container — this may take a minute on first run…
          </div>
        )}

        {/* Panel content */}
        <main className="ws-panel">
          {db ? renderPanel() : (
            <div style={{ padding: '2rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
              <Icon icon="lucide:alert-triangle" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'block' }} />
              Could not load database. The backend may be offline.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
