import Icon from '@/components/Icon';

const TABLES = [
  { name: 'users',       cols: [{ n: 'id', t: 'SERIAL', pk: true }, { n: 'email', t: 'VARCHAR' }, { n: 'name', t: 'VARCHAR' }, { n: 'created_at', t: 'TIMESTAMP' }] },
  { name: 'posts',       cols: [{ n: 'id', t: 'SERIAL', pk: true }, { n: 'title', t: 'TEXT' }, { n: 'user_id', t: 'INT', fk: true }, { n: 'published', t: 'BOOL' }] },
  { name: 'comments',    cols: [{ n: 'id', t: 'SERIAL', pk: true }, { n: 'body', t: 'TEXT' }, { n: 'post_id', t: 'INT', fk: true }, { n: 'user_id', t: 'INT', fk: true }] },
  { name: 'tags',        cols: [{ n: 'id', t: 'SERIAL', pk: true }, { n: 'name', t: 'VARCHAR' }, { n: 'slug', t: 'VARCHAR' }] },
  { name: 'post_tags',   cols: [{ n: 'post_id', t: 'INT', fk: true }, { n: 'tag_id', t: 'INT', fk: true }] },
];

export default function SchemaVisualizer() {
  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Schema Visualizer</h2>
        <p className="panel-header__desc">Entity-relationship diagram of your database schema — tables, columns and foreign key relationships.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
        <span className="ws-badge ws-badge--gray">public schema</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{TABLES.length} tables</span>
      </div>

      <div className="schema-canvas">
        {TABLES.map((table) => (
          <div key={table.name} className="schema-table-card">
            <div className="schema-table-card__header">
              <Icon icon="lucide:table-2" style={{ fontSize: '0.75rem', color: 'var(--accent)' }} />
              {table.name}
            </div>
            {table.cols.map((col) => (
              <div key={col.n} className="schema-table-card__row">
                <span className="schema-table-card__col-name">{col.n}</span>
                <span className="schema-table-card__col-type">{col.t}</span>
                {'pk' in col && col.pk && <span className="schema-table-card__pk">PK</span>}
                {'fk' in col && col.fk && <span className="schema-table-card__fk">FK</span>}
              </div>
            ))}
          </div>
        ))}

        {/* Relation lines legend */}
        <div style={{ marginLeft: 'auto', alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <span className="schema-table-card__pk">PK</span> Primary Key
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <span className="schema-table-card__fk">FK</span> Foreign Key
          </div>
        </div>
      </div>
    </div>
  );
}
