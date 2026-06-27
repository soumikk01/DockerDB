'use client';

import { Icon } from '@iconify/react';

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="features__header reveal">
          <p className="section-label">Features</p>
          <h2 className="section-title">
            Everything you need.
            <span> Nothing you don&apos;t.</span>
          </h2>
          <p className="section-desc">A complete toolkit for local database management — from schema design to production deployment.</p>
        </div>

        <div className="bento-grid">
          {/* Card 1: One-click setup (3-col) */}
          <div className="bento-card bento-card--3col reveal">
            <div className="card-icon card-icon--accent">
              <Icon icon="lucide:zap" style={{ color: 'var(--accent)', fontSize: '1rem' }} />
            </div>
            <h3 className="card-title">One-Click Database Setup</h3>
            <p className="card-desc">Spin up PostgreSQL, MongoDB, or MySQL instantly. Zero config required.</p>
            <div className="card-tags">
              <span className="card-tag">PostgreSQL</span>
              <span className="card-tag">MongoDB</span>
              <span className="card-tag">MySQL</span>
              <span className="card-tag">Redis</span>
            </div>
          </div>

          {/* Card 2: Docker-powered (3-col) */}
          <div className="bento-card bento-card--3col reveal">
            <div className="card-icon card-icon--neutral">
              <Icon icon="simple-icons:docker" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }} />
            </div>
            <h3 className="card-title">Docker-Powered Environments</h3>
            <p className="card-desc">Every database runs in an isolated container. Reproducible, portable, fully under your control.</p>
            <div className="card-terminal">
              <span className="syn-dim">$</span> <span className="syn-text">docker ps</span>
              <div style={{ marginTop: '0.25rem', color: 'var(--text-quaternary)' }}>CONTAINER  IMAGE          STATUS</div>
              <div className="syn-muted">users-db   postgres:16    <span className="syn-string">Up 2h</span></div>
              <div className="syn-muted">logs-db    mongo:7        <span className="syn-string">Up 1h</span></div>
            </div>
          </div>

          {/* Card 3: ORM-Ready (2-col) */}
          <div className="bento-card bento-card--2col reveal">
            <div className="card-icon card-icon--neutral">
              <Icon icon="lucide:link" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }} />
            </div>
            <h3 className="card-title">ORM-Ready Connections</h3>
            <p className="card-desc card-desc--no-mb">Auto-generated configs for Prisma, Drizzle, TypeORM. Copy and go.</p>
          </div>

          {/* Card 4: Local to Prod (2-col) */}
          <div className="bento-card bento-card--2col reveal">
            <div className="card-icon card-icon--neutral">
              <Icon icon="lucide:cloud-upload" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }} />
            </div>
            <h3 className="card-title">Local → Production</h3>
            <p className="card-desc card-desc--no-mb">Push local schemas to cloud databases with a single command. Zero downtime.</p>
          </div>

          {/* Card 5: Visual Tables (2-col) */}
          <div className="bento-card bento-card--2col reveal">
            <div className="card-icon card-icon--neutral">
              <Icon icon="lucide:table-2" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }} />
            </div>
            <h3 className="card-title">Visual Table Builder</h3>
            <p className="card-desc card-desc--no-mb">Design tables visually. Add columns, set types, define relations intuitively.</p>
          </div>

          {/* Card 6: SQL Editor (4-col) */}
          <div className="bento-card bento-card--4col reveal">
            <div className="card-wide-inner">
              <div className="card-icon card-icon--accent">
                <Icon icon="lucide:code-2" style={{ color: 'var(--accent)', fontSize: '1rem' }} />
              </div>
              <div className="card-wide-content">
                <h3 className="card-title">Built-in SQL Editor</h3>
                <p className="card-desc">Syntax highlighting, autocomplete, query history, and saved snippets.</p>
                <div className="card-code-block">
                  <span className="syn-comment">-- create &amp; query instantly</span><br />
                  <span className="syn-keyword">CREATE TABLE</span> <span className="syn-text">posts</span> <span className="syn-dim">(</span><br />
                  <span className="syn-dim" style={{ paddingLeft: '1rem' }}>id</span> <span className="syn-muted">SERIAL PRIMARY KEY</span>,<br />
                  <span className="syn-dim" style={{ paddingLeft: '1rem' }}>title</span> <span className="syn-muted">VARCHAR(255)</span>,<br />
                  <span className="syn-dim" style={{ paddingLeft: '1rem' }}>published</span> <span className="syn-muted">BOOLEAN DEFAULT false</span><br />
                  <span className="syn-dim">);</span>
                  <div style={{ marginTop: '0.375rem', color: 'var(--emerald-400-50)' }}>✓ Table created — 2ms</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 7: Import/Export (2-col) */}
          <div className="bento-card bento-card--2col reveal">
            <div className="card-icon card-icon--neutral">
              <Icon icon="lucide:arrow-up-down" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }} />
            </div>
            <h3 className="card-title">Import / Export</h3>
            <p className="card-desc card-desc--no-mb">JSON, CSV, SQL dumps. Move data freely between formats.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
