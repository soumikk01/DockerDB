'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import { api, type Database, type SchemaTable } from '@/lib/api';

export default function Tables({ db }: { db: Database }) {
  const [tables, setTables]     = useState<SchemaTable[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<SchemaTable | null>(null);

  useEffect(() => {
    if (db.status !== 'running') { setLoading(false); return; }
    api.schema.get(db.id)
      .then((s) => setTables(s.tables ?? []))
      .catch(() => setTables([]))
      .finally(() => setLoading(false));
  }, [db.id, db.status]);

  const filtered = tables.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Tables</h2>
        <p className="panel-header__desc">
          All tables in <strong>{db.db_name}</strong> with columns and structure.
        </p>
      </div>

      {db.status !== 'running' ? (
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '1rem 0' }}>
          <Icon icon="lucide:info" />
          Database must be running to inspect tables.
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
            <div className="ws-search">
              <Icon icon="lucide:search" style={{ fontSize: '0.875rem' }} className="ws-search__icon" />
              <input
                className="ws-search__input"
                placeholder="Search tables…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Icon icon="lucide:loader" style={{ animation: 'spin 1s linear infinite' }} /> Loading tables…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', padding: '2rem 0', textAlign: 'center' }}>
              {tables.length === 0 ? 'No tables yet — create one in the SQL editor.' : 'No tables match your search.'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1rem' }}>
              {/* Table list */}
              <div className="ws-table-wrap">
                <table className="ws-table">
                  <thead>
                    <tr>
                      <th>Table Name</th>
                      <th>Columns</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t) => (
                      <tr
                        key={t.name}
                        style={{ cursor: 'pointer', background: selected?.name === t.name ? 'rgba(59,130,246,0.07)' : undefined }}
                        onClick={() => setSelected(selected?.name === t.name ? null : t)}
                      >
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Icon icon="lucide:table-2" style={{ fontSize: '0.75rem', color: 'var(--text-quaternary)' }} />
                            {t.name}
                          </span>
                        </td>
                        <td>{t.columns?.length ?? 0}</td>
                        <td>
                          <Icon
                            icon={selected?.name === t.name ? 'lucide:chevron-right' : 'lucide:chevron-right'}
                            style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', transform: selected?.name === t.name ? 'rotate(90deg)' : undefined }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Column detail */}
              {selected && (
                <div>
                  <div className="panel-section-header" style={{ marginTop: 0 }}>
                    <h3>{selected.name}</h3>
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '0.25rem' }}
                      onClick={() => setSelected(null)}
                    >
                      <Icon icon="lucide:x" style={{ fontSize: '0.75rem' }} />
                    </button>
                  </div>
                  <div className="ws-table-wrap">
                    <table className="ws-table">
                      <thead>
                        <tr>
                          <th>Column</th>
                          <th>Type</th>
                          <th>PK</th>
                          <th>Nullable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.columns?.map((col) => (
                          <tr key={col.name}>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{col.name}</td>
                            <td style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{col.type}</td>
                            <td>{col.is_primary_key ? <Icon icon="lucide:key" style={{ fontSize: '0.75rem', color: '#f59e0b' }} /> : '—'}</td>
                            <td style={{ color: col.nullable ? 'var(--text-tertiary)' : '#34d399', fontSize: '0.75rem' }}>
                              {col.nullable ? 'YES' : 'NO'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
