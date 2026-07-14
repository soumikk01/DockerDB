import Icon from '@/components/Icon';

export default function CtaSection() {
  return (
    <section className="section section--cta">
      <div className="container container--narrow cta-section reveal">
        <h2 className="section-title">Ready to start?</h2>
        <p className="cta-section__desc">
          Your first workspace takes 30 seconds. No credit card. No complex setup.
        </p>

        <div className="cta-buttons">
          <a id="cta-bottom-start" href="/select-database" className="btn-primary">
            Start Free Workspace
            <Icon icon="lucide:arrow-right" style={{ fontSize: '0.875rem' }} />
          </a>
          <a id="cta-bottom-github" href="#" className="btn-secondary">
            <Icon icon="lucide:github" style={{ fontSize: '0.875rem' }} />
            GitHub
          </a>
        </div>

        <div className="cta-trust">
          <span className="cta-trust__item">
            <Icon icon="lucide:check" style={{ color: 'var(--emerald-400-50)', fontSize: '0.75rem' }} />Free forever
          </span>
          <span className="cta-trust__item">
            <Icon icon="lucide:check" style={{ color: 'var(--emerald-400-50)', fontSize: '0.75rem' }} />No credit card
          </span>
          <span className="cta-trust__item">
            <Icon icon="lucide:check" style={{ color: 'var(--emerald-400-50)', fontSize: '0.75rem' }} />Open source
          </span>
        </div>
      </div>
    </section>
  );
}
