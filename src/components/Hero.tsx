import Icon from '@/components/Icon';
import WindowDots from '@/components/WindowDots';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__glow" />
      <div className="container">
        <div className="hero__grid">
          {/* Left: Content */}
          <div className="hero__content">
            <div className="hero__badge fade-in-up">
              <span className="hero__badge-dot" />
              <span className="hero__badge-text">Now in Public Beta</span>
            </div>

            <h1 className="hero__headline fade-in-up delay-1">
              Local Databases.<br />
              <span>Cloud-Level Experience.</span>
            </h1>

            <p className="hero__subheadline fade-in-up delay-2">
              Create Docker-powered database workspaces in seconds — PostgreSQL, MongoDB, MySQL and more. The operating system for your data layer.
            </p>

            <div className="hero__cta-group fade-in-up delay-3">
              <a id="cta-start-workspace" href="#" className="btn-primary">
                <Icon icon="lucide:play" style={{ fontSize: '0.875rem' }} />
                Start Workspace
              </a>
              <a id="cta-explore" href="#features" className="btn-secondary">
                Explore Platform
              </a>
            </div>

            <div className="hero__trust fade-in-up delay-4">
              <span>PostgreSQL</span>
              <span className="hero__trust-sep">·</span>
              <span>MongoDB</span>
              <span className="hero__trust-sep">·</span>
              <span>MySQL</span>
              <span className="hero__trust-sep">·</span>
              <span>Redis</span>
            </div>
          </div>

          {/* Right: Workspace Illustration */}
          <div className="hero__illustration fade-in-up delay-3">
            <div className="workspace-card">
              <div className="window-bar">
                <WindowDots />
                <span className="window-title">my-project — DockerDB</span>
                <div className="window-spacer" />
              </div>

              <div className="editor-content">
                <div className="tab-bar">
                  <div className="tab tab--active">SQL Editor</div>
                  <div className="tab tab--inactive">Schema</div>
                  <div className="tab tab--inactive">Tables</div>
                </div>

                <div className="sql-block">
                  <div><span className="syn-keyword">SELECT</span> <span className="syn-text">u.name, u.email, count(p.id)</span></div>
                  <div><span className="syn-keyword">FROM</span> <span className="syn-table">users</span> <span className="syn-muted">u</span></div>
                  <div><span className="syn-keyword">LEFT JOIN</span> <span className="syn-table">posts</span> <span className="syn-muted">p</span> <span className="syn-keyword">ON</span> <span className="syn-muted">p.user_id = u.id</span></div>
                  <div><span className="syn-keyword">WHERE</span> <span className="syn-muted">u.status =</span> <span className="syn-string">&apos;active&apos;</span></div>
                  <div><span className="syn-keyword">GROUP BY</span> <span className="syn-muted">u.id</span></div>
                  <div><span className="syn-keyword">LIMIT</span> <span className="syn-number">10</span><span className="syn-muted cursor-blink">▎</span></div>
                </div>

                <div className="results-table">
                  <div className="results-grid">
                    <div className="results-header">name</div>
                    <div className="results-header">email</div>
                    <div className="results-header">count</div>
                    <div className="results-cell results-cell--border">Sarah Chen</div>
                    <div className="results-cell results-cell--muted results-cell--border">sarah@dev.io</div>
                    <div className="results-cell results-cell--border">24</div>
                    <div className="results-cell">Alex Kim</div>
                    <div className="results-cell results-cell--muted">alex@app.co</div>
                    <div className="results-cell">18</div>
                  </div>
                </div>

                <div className="status-bar">
                  <div className="status-bar__left">
                    <span className="status-indicator">
                      <span className="status-dot" />Connected
                    </span>
                    <span className="status-info">PostgreSQL 16</span>
                  </div>
                  <span className="status-info">2 rows · 4ms</span>
                </div>
              </div>
            </div>

            <div className="floating-cards">
              <div className="floating-card floating-card--left fade-in-up delay-5">
                <div className="floating-card__inner">
                  <div className="floating-card__icon">
                    <Icon icon="simple-icons:postgresql" style={{ color: 'var(--accent)', fontSize: '10px' }} />
                  </div>
                  <div>
                    <div className="floating-card__name">PostgreSQL</div>
                    <div className="floating-card__status">
                      <span className="floating-card__status-dot" />Running
                    </div>
                  </div>
                </div>
              </div>
              <div className="floating-card floating-card--right fade-in-up delay-6">
                <div className="floating-card__inner">
                  <div className="floating-card__icon">
                    <Icon icon="simple-icons:mongodb" style={{ color: 'var(--emerald-500-70)', fontSize: '10px' }} />
                  </div>
                  <div>
                    <div className="floating-card__name">MongoDB</div>
                    <div className="floating-card__status">
                      <span className="floating-card__status-dot" />Running
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
