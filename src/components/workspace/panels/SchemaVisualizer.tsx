'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import { api, type Database, type Schema } from '@/lib/api';

export default function SchemaVisualizer({ db }: { db: Database }) {
  const [schema, setSchema]   = useState<Schema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db.status !== 'running') { setLoading(false); return; }
    api.schema.get(db.id)
      .then(setSchema)
      .catch(() => setSchema(null))
      .finally(() => setLoading(false));
  }, [db.id, db.status]);

  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-header__title">Schema Visualizer</h2>
        <p className="panel-header__desc">
          Visual representation of all tables in <strong>{db.db_name}</strong>.
        </p>
      </div>

      {db.status !== 'running' ? (
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Icon icon="lucide:info" /> Database must be running to view schema.
        </div>
      ) : loading ? (
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Icon icon="lucide:loader" style={{ animation: 'spin 1s linear infinite' }} /> Loading schema…
        </div>
      ) : !schema || schema.tables.length === 0 ? (
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', padding: '2rem', textAlign: 'center' }}>
          No tables found — create tables in your database to see the schema here.
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {schema.tables.map((table) => (
            <div
              key={table.name}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '0.75rem',
                minWidth: '200px',
                overflow: 'hidden',
              }}
            >
              {/* Table header */}
              <div style={{
                padding: '0.625rem 0.875rem',
                background: 'rgba(59,130,246,0.08)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <Icon icon="lucide:table-2" style={{ fontSize: '0.75rem', color: '#60a5fa' }} />
                <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{table.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  {table.columns?.length ?? 0} cols
                </span>
              </div>
              {/* Columns */}
              <div style={{ padding: '0.375rem 0' }}>
                {table.columns?.map((col) => (
                  <div
                    key={col.name}
                    style={{
                      padding: '0.25rem 0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                    }}
                  >
                    {col.is_primary_key
                      ? <Icon icon="lucide:key" style={{ fontSize: '0.625rem', color: '#f59e0b', flexShrink: 0 }} />
                      : <span style={{ width: '0.625rem', flexShrink: 0 }} />
                    }
                    <span style={{ color: col.is_primary_key ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      {col.name}
                    </span>
                    <span style={{ marginLeft: 'auto', color: 'var(--text-quaternary)', fontSize: '0.7rem' }}>
                      {col.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
