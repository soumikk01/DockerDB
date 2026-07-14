'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Icon from '@/components/Icon';

type DbId = 'postgresql' | 'mysql' | 'mongodb' | 'redis';
type TabId = 'sql' | 'nosql';

interface DbOption {
  id: DbId;
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
    version: 'v16.2',
    icon: 'simple-icons:postgresql',
    iconColor: '#336791',
    iconBg: 'rgba(51,103,145,0.15)',
    desc: 'The world\'s most advanced open-source relational database. Full ACID compliance, JSONB, advanced indexing and full-text search.',
    tags: ['ACID', 'JSONB', 'Extensions', 'Full-text'],
  },
  {
    id: 'mysql',
    name: 'MySQL',
    version: 'v8.0',
    icon: 'simple-icons:mysql',
    iconColor: '#4479A1',
    iconBg: 'rgba(68,121,161,0.15)',
    desc: 'The world\'s most popular open source database. Reliable, easy to use and proven at scale for web applications.',
    tags: ['InnoDB', 'Replication', 'Partitioning', 'JSON'],
  },
];

const NOSQL_DBS: DbOption[] = [
  {
    id: 'mongodb',
    name: 'MongoDB',
    version: 'v7.0',
    icon: 'simple-icons:mongodb',
    iconColor: '#47A248',
    iconBg: 'rgba(71,162,72,0.15)',
    desc: 'Flexible document database built for modern application developers. Schema-less, horizontally scalable, with rich query language.',
    tags: ['Documents', 'Aggregation', 'Sharding', 'Atlas'],
  },
  {
    id: 'redis',
    name: 'Redis',
    version: 'v7.2',
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

  const databases = activeTab === 'sql' ? SQL_DBS : NOSQL_DBS;

  const handleSelect = (db: DbOption) => {
    router.push(`/workspace?db=${db.id}`);
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
            <span>connect to?</span>
          </h1>
          <p className="select-db-subtitle">
            Select a database engine to spin up a Docker-powered local workspace in seconds.
          </p>

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
            {databases.map((db) => (
              <button
                key={db.id}
                className="db-card"
                onClick={() => handleSelect(db)}
                aria-label={`Select ${db.name}`}
              >
                {/* Arrow */}
                <span className="db-card__arrow">
                  <Icon icon="lucide:arrow-up-right" style={{ fontSize: '0.875rem' }} />
                </span>

                {/* Icon */}
                <div
                  className="db-card__icon"
                  style={{ background: db.iconBg }}
                >
                  <Icon
                    icon={db.icon}
                    style={{ fontSize: '1.5rem', color: db.iconColor }}
                  />
                </div>

                {/* Header */}
                <div className="db-card__header">
                  <span className="db-card__name">{db.name}</span>
                </div>
                <span className="db-card__version">{db.version}</span>

                {/* Description */}
                <p className="db-card__desc">{db.desc}</p>

                {/* Tags */}
                <div className="db-card__tags">
                  {db.tags.map((tag) => (
                    <span key={tag} className="db-card__tag">{tag}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
