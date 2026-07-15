import Icon from '@/components/Icon';

const ROLES = [
  { name: 'postgres',    attrs: ['SUPERUSER', 'CREATEDB', 'LOGIN'], children: [
    { name: 'admin',     attrs: ['CREATEDB', 'LOGIN'],              children: [
      { name: 'app_user',    attrs: ['LOGIN'],             children: [] },
      { name: 'analytics',   attrs: ['LOGIN'],             children: [] },
    ]},
    { name: 'replicator', attrs: ['REPLICATION', 'LOGIN'],         children: [] },
    { name: 'readonly',  attrs: ['LOGIN'],                          children: [] },
  ]},
];

const ATTR_COLOR: Record<string, string> = {
  SUPERUSER: 'red',
  CREATEDB: 'amber',
  LOGIN: 'green',
  REPLICATION: 'blue',
};

function RoleItem({ role, depth = 0 }: { role: typeof ROLES[0]; depth?: number }) {
  return (
    <>
      <div className={`role-item${depth > 0 ? ' role-item--child' : ''}`}>
        <div className="role-item__icon">
          <Icon icon="lucide:user" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }} />
        </div>
        <span className="role-item__name">{role.name}</span>
        <div className="role-item__attrs">
          {role.attrs.map((attr) => (
            <span key={attr} className={`ws-badge ws-badge--${ATTR_COLOR[attr] ?? 'gray'}`}>{attr}</span>
          ))}
        </div>
      </div>
      {role.children?.map((child) => (
        <RoleItem key={child.name} role={child as typeof ROLES[0]} depth={depth + 1} />
      ))}
    </>
  );
}

export default function Roles() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Roles</h2>
        <p className="panel-header__desc">Database roles and their inheritance hierarchy, attributes and login permissions.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="ws-badge ws-badge--green">6 roles</span>
          <span className="ws-badge ws-badge--blue">5 with LOGIN</span>
        </div>
        <button className="ws-btn ws-btn--primary">
          <Icon icon="lucide:plus" style={{ fontSize: '0.75rem' }} />
          New Role
        </button>
      </div>

      <div className="role-tree">
        {ROLES.map((role) => (
          <RoleItem key={role.name} role={role} />
        ))}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {Object.entries(ATTR_COLOR).map(([attr, color]) => (
          <div key={attr} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <span className={`ws-badge ws-badge--${color}`}>{attr}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
