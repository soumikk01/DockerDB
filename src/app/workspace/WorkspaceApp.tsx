'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/Icon';

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

// ── DB metadata ───────────────────────────────────────────────
const DB_META: Record<string, { name: string; version: string; host: string; icon: string; iconColor: string; iconBg: string }> = {
  postgresql: { name: 'PostgreSQL',  version: '16.2', host: 'localhost:5432', icon: 'simple-icons:postgresql', iconColor: '#336791', iconBg: 'rgba(51,103,145,0.2)' },
  mysql:      { name: 'MySQL',       version: '8.0',  host: 'localhost:3306', icon: 'simple-icons:mysql',      iconColor: '#4479A1', iconBg: 'rgba(68,121,161,0.2)' },
  mongodb:    { name: 'MongoDB',     version: '7.0',  host: 'localhost:27017',icon: 'simple-icons:mongodb',    iconColor: '#47A248', iconBg: 'rgba(71,162,72,0.2)'  },
  redis:      { name: 'Redis',       version: '7.2',  host: 'localhost:6379', icon: 'simple-icons:redis',      iconColor: '#DC382D', iconBg: 'rgba(220,56,45,0.2)'  },
};

// ── Nav structure ─────────────────────────────────────────────
type PanelId =
  | 'db-management' | 'schema' | 'tables' | 'functions' | 'triggers'
  | 'enum-types' | 'extensions' | 'indexes' | 'publications'
  | 'access-control' | 'policies' | 'roles'
  | 'configuration' | 'settings';

const NAV_GROUPS: { label: string; items: { id: PanelId; label: string; icon: string; badge?: string }[] }[] = [
  {
    label: 'Database',
    items: [
      { id: 'db-management', label: 'Database Management', icon: 'lucide:database' },
      { id: 'schema',        label: 'Schema Visualizer',   icon: 'lucide:git-branch' },
      { id: 'tables',        label: 'Tables',              icon: 'lucide:table-2',    badge: '23' },
      { id: 'functions',     label: 'Functions',           icon: 'lucide:code-2',     badge: '6' },
      { id: 'triggers',      label: 'Triggers',            icon: 'lucide:zap',        badge: '5' },
      { id: 'enum-types',    label: 'Enumerated Types',    icon: 'lucide:list',       badge: '5' },
      { id: 'extensions',    label: 'Extensions',          icon: 'lucide:puzzle',     badge: '4' },
      { id: 'indexes',       label: 'Indexes',             icon: 'lucide:search',     badge: '8' },
      { id: 'publications',  label: 'Publications',        icon: 'lucide:rss',        badge: '3' },
    ],
  },
  {
    label: 'Security',
    items: [
      { id: 'access-control', label: 'Access Control', icon: 'lucide:shield' },
      { id: 'policies',       label: 'Policies',       icon: 'lucide:file-lock', badge: '5' },
      { id: 'roles',          label: 'Roles',          icon: 'lucide:users',     badge: '6' },
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

export default function WorkspaceApp() {
  const router = useRouter();
  const params = useSearchParams();
  const dbKey = (params.get('db') ?? 'postgresql') as string;
  const db = DB_META[dbKey] ?? DB_META['postgresql'];

  const [activePanel, setActivePanel] = useState<PanelId>('db-management');

  function renderPanel() {
    switch (activePanel) {
      case 'db-management':  return <DatabaseManagement dbName={db.name} />;
      case 'schema':         return <SchemaVisualizer />;
      case 'tables':         return <Tables />;
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

  return (
    <div className="workspace">
      {/* ── Sidebar ─────────────────────────── */}
      <aside className="ws-sidebar">
        <div className="ws-sidebar-header">
          {/* Back link */}
          <button className="ws-sidebar-header__back" onClick={() => router.push('/select-database')}>
            <Icon icon="lucide:arrow-left" style={{ fontSize: '0.75rem' }} />
            Change database
          </button>

          {/* DB identity */}
          <div className="ws-sidebar-header__db">
            <div className="ws-sidebar-header__icon" style={{ background: db.iconBg }}>
              <Icon icon={db.icon} style={{ fontSize: '1.125rem', color: db.iconColor }} />
            </div>
            <div>
              <div className="ws-sidebar-header__name">{db.name}</div>
              <div className="ws-sidebar-header__host">{db.host}</div>
              <div className="ws-sidebar-header__status">
                <span className="ws-sidebar-header__status-dot" />
                Connected
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
                  {item.badge && <span className="ws-nav-item__badge">{item.badge}</span>}
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

      {/* ── Main ────────────────────────────── */}
      <div className="ws-main">
        {/* Top bar */}
        <header className="ws-topbar">
          <div className="ws-topbar__breadcrumb">
            <span>{db.name}</span>
            <span className="ws-topbar__sep">/</span>
            <span>{PANEL_LABELS[activePanel]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>v{db.version}</span>
            <span className="ws-badge ws-badge--green">● Connected</span>
          </div>
        </header>

        {/* Panel content */}
        <main className="ws-panel">
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}
