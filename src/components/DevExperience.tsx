import Icon from '@/components/Icon';
import WindowDots from '@/components/WindowDots';

export default function DevExperience() {
  return (
    <section id="devex" className="section">
      <div className="container">
        <div className="devex__header reveal">
          <p className="section-label">Developer Experience</p>
          <h2 className="section-title">
            Built for developers
            <span> who ship fast.</span>
          </h2>
        </div>

        <div className="devex-grid">
          {/* Terminal */}
          <div className="terminal-window reveal">
            <div className="terminal-bar">
              <WindowDots />
              <span className="terminal-bar__label">Terminal</span>
            </div>
            <div className="terminal-body terminal-cascade reveal">
              <div className="terminal-line"><span className="syn-dim">$</span> <span className="syn-text">dockerdb create workspace my-saas</span></div>
              <div className="terminal-output syn-success">✓ Workspace &quot;my-saas&quot; created</div>
              <div className="terminal-line terminal-gap"><span className="syn-dim">$</span> <span className="syn-text">dockerdb add postgres --name users-db</span></div>
              <div className="terminal-output syn-dim">Pulling postgres:16-alpine…</div>
              <div className="terminal-output syn-success">✓ PostgreSQL running on localhost:5432</div>
              <div className="terminal-line terminal-gap"><span className="syn-dim">$</span> <span className="syn-text">dockerdb connect --orm prisma</span></div>
              <div className="terminal-output syn-success">✓ Connection string copied</div>
              <div className="terminal-output syn-dim" style={{ fontSize: '10px' }}>DATABASE_URL=&quot;postgresql://admin:***@localhost:5432/users-db&quot;</div>
              <div className="terminal-line terminal-gap"><span className="syn-dim">$</span> <span className="syn-muted cursor-blink">▎</span></div>
            </div>
          </div>

          {/* Prisma config */}
          <div className="prisma-window reveal">
            <div className="prisma-bar">
              <div className="prisma-bar__left">
                <Icon icon="simple-icons:prisma" style={{ color: 'var(--text-quaternary)', fontSize: '0.75rem' }} />
                <span className="prisma-bar__file">schema.prisma</span>
              </div>
              <span className="prisma-bar__status">
                <span className="prisma-bar__status-dot" />Synced
              </span>
            </div>
            <div className="prisma-body code-cascade reveal">
              <div><span className="syn-keyword">datasource</span> <span className="syn-text">db</span> <span className="syn-dim">{'{'}</span></div>
              <div style={{ paddingLeft: '1rem' }}><span className="syn-dim">provider =</span> <span className="syn-string">&quot;postgresql&quot;</span></div>
              <div style={{ paddingLeft: '1rem' }}><span className="syn-dim">url      =</span> <span className="syn-string">env(&quot;DATABASE_URL&quot;)</span></div>
              <div><span className="syn-dim">{'}'}</span></div>
              <div style={{ paddingTop: '0.375rem' }}><span className="syn-keyword">model</span> <span className="syn-text">User</span> <span className="syn-dim">{'{'}</span></div>
              <div style={{ paddingLeft: '1rem' }}><span className="syn-muted">id</span>    <span className="syn-dim">Int</span>      <span className="syn-annotation">@id @default(autoincrement())</span></div>
              <div style={{ paddingLeft: '1rem' }}><span className="syn-muted">email</span> <span className="syn-dim">String</span>   <span className="syn-annotation">@unique</span></div>
              <div style={{ paddingLeft: '1rem' }}><span className="syn-muted">name</span>  <span className="syn-dim">String?</span></div>
              <div style={{ paddingLeft: '1rem' }}><span className="syn-muted">posts</span> <span className="syn-dim">Post[]</span></div>
              <div><span className="syn-dim">{'}'}</span></div>
              <div style={{ paddingTop: '0.375rem' }}><span className="syn-keyword">model</span> <span className="syn-text">Post</span> <span className="syn-dim">{'{'}</span></div>
              <div style={{ paddingLeft: '1rem' }}><span className="syn-muted">id</span>     <span className="syn-dim">Int</span>     <span className="syn-annotation">@id @default(autoincrement())</span></div>
              <div style={{ paddingLeft: '1rem' }}><span className="syn-muted">title</span>  <span className="syn-dim">String</span></div>
              <div style={{ paddingLeft: '1rem' }}><span className="syn-muted">author</span> <span className="syn-dim">User</span>    <span className="syn-annotation">@relation(fields: [userId])</span></div>
              <div><span className="syn-dim">{'}'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
