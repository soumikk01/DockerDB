'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Icon from '@/components/Icon';
import { api, type Engine } from '@/lib/api';

type TabId = 'sql' | 'nosql';

interface DbOption {
  id: Engine;
  name: string;
  version: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  desc: string;
  tags: string[];
}

const SQL_DBS: DbOption[] = [
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    version: '16',
    icon: 'simple-icons:postgresql',
    iconColor: '#336791',
    iconBg: 'rgba(51,103,145,0.15)',
    desc: "The world's most advanced open-source relational database. Full ACID compliance, JSONB, advanced indexing and full-text search.",
    tags: ['ACID', 'JSONB', 'Extensions', 'Full-text'],
  },
  {
    id: 'mysql',
    name: 'MySQL',
    version: '8',
    icon: 'simple-icons:mysql',
    iconColor: '#4479A1',
    iconBg: 'rgba(68,121,161,0.15)',
    desc: "The world's most popular open source database. Reliable, easy to use and proven at scale for web applications.",
    tags: ['InnoDB', 'Replication', 'Partitioning', 'JSON'],
  },
];

const NOSQL_DBS: DbOption[] = [
  {
    id: 'mongodb',
    name: 'MongoDB',
    version: '7',
    icon: 'simple-icons:mongodb',
    iconColor: '#47A248',
    iconBg: 'rgba(71,162,72,0.15)',
    desc: 'Flexible document database built for modern application developers. Schema-less, horizontally scalable, with rich query language.',
    tags: ['Documents', 'Aggregation', 'Sharding', 'Atlas'],
  },
  {
    id: 'redis',
    name: 'Redis',
    version: '7',
    icon: 'simple-icons:redis',
    iconColor: '#DC382D',
    iconBg: 'rgba(220,56,45,0.15)',
    desc: 'In-memory data structure store used as a database, cache, message broker and queue. Blazing fast with sub-millisecond latency.',
    tags: ['In-memory', 'Pub/Sub', 'Streams', 'Lua'],
  },
];

export default function SelectDatabasePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('sql');
  const [loading, setLoading] = useState<Engine | null>(null);
  const [error, setError] = useState<string | null>(null);

  const databases = activeTab === 'sql' ? SQL_DBS : NOSQL_DBS;

  const handleSelect = async (db: DbOption) => {
    setLoading(db.id);
    setError(null);
    try {
      const created = await api.databases.create({
        name: `${db.name} Dev DB`,
        engine: db.id,
        version: db.version,
        db_name: 'dockerdb',
      });
      router.push(`/workspace?db=${db.id}&id=${created.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to backend';
      setError(msg);
      setLoading(null);
    }
  };

  return (
    <div className="select-db-page">
      {/* Header */}
      <header className="select-db-header">
        <a href="/" className="select-db-header__logo">
          <Image src="/logo.svg" alt="DockerDB" width={88} height={22} priority />
        </a>
        <a href="/" className="select-db-header__back">
          <Icon icon="lucide:arrow-left" style={{ fontSize: '0.75rem' }} />
          Back to home
        </a>
      </header>

      {/* Glow */}
      <div className="select-db-glow" aria-hidden="true" />

      {/* Main */}
      <main className="select-db-main">
        <div className="select-db-content">
          {/* Eyebrow */}
          <div className="select-db-eyebrow">
            <Icon icon="lucide:database" style={{ fontSize: '0.75rem' }} />
            Step 1 of 2 — Choose Database
          </div>

          {/* Title */}
          <h1 className="select-db-title">
            Which database will you<br />
            <span>spin up?</span>
          </h1>
          <p className="select-db-subtitle">
            Select a database engine. DockerDB will pull the image and start a container on your machine instantly.
          </p>

          {/* Error banner */}
          {error && (
            <div style={{
              background: 'rgba(220,56,45,0.1)',
              border: '1px solid rgba(220,56,45,0.3)',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              color: '#f87171',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <Icon icon="lucide:alert-circle" style={{ fontSize: '1rem', flexShrink: 0 }} />
              <span>{error} — Make sure the backend is running: <code>go run ./cmd/server</code></span>
            </div>
          )}

          {/* Tabs */}
          <div className="select-db-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'sql'}
              className={`select-db-tab${activeTab === 'sql' ? ' select-db-tab--active' : ''}`}
              onClick={() => setActiveTab('sql')}
            >
              SQL
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'nosql'}
              className={`select-db-tab${activeTab === 'nosql' ? ' select-db-tab--active' : ''}`}
              onClick={() => setActiveTab('nosql')}
            >
              NoSQL
            </button>
          </div>

          {/* Database cards */}
          <div className="db-cards-grid">
            {databases.map((db) => {
              const isLoading = loading === db.id;
              return (
                <button
                  key={db.id}
                  className="db-card"
                  onClick={() => handleSelect(db)}
                  disabled={loading !== null}
                  aria-label={`Select ${db.name}`}
                  aria-busy={isLoading}
                >
                  {/* Arrow / spinner */}
                  <span className="db-card__arrow">
                    {isLoading
                      ? <Icon icon="lucide:loader" style={{ fontSize: '0.875rem', animation: 'spin 1s linear infinite' }} />
                      : <Icon icon="lucide:arrow-up-right" style={{ fontSize: '0.875rem' }} />
                    }
                  </span>

                  {/* Icon */}
                  <div className="db-card__icon" style={{ background: db.iconBg }}>
                    <Icon icon={db.icon} style={{ fontSize: '1.5rem', color: db.iconColor }} />
                  </div>

                  {/* Header */}
                  <div className="db-card__header">
                    <span className="db-card__name">{db.name}</span>
                  </div>
                  <span className="db-card__version">v{db.version}</span>

                  {/* Description */}
                  <p className="db-card__desc">{db.desc}</p>

                  {/* Tags */}
                  <div className="db-card__tags">
                    {db.tags.map((tag) => (
                      <span key={tag} className="db-card__tag">{tag}</span>
                    ))}
                  </div>

                  {/* Loading overlay text */}
                  {isLoading && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(10,10,15,0.7)',
                      borderRadius: 'inherit',
                      gap: '0.5rem',
                    }}>
                      <Icon icon="lucide:loader" style={{ fontSize: '1.5rem', animation: 'spin 1s linear infinite', color: db.iconColor }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Pulling Docker image…
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
