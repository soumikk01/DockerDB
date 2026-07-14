import Icon from '@/components/Icon';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <div className="nav__left">
          <a id="nav-home-link" href="#" className="nav__logo">
            <Image src="/logo.svg" alt="DockerDB" width={96} height={24} priority />
          </a>
          <div className="nav__links">
            <a id="nav-features-link" href="#features" className="nav__link">Features</a>
            <a id="nav-workflow-link" href="#workflow" className="nav__link">Workflow</a>
            <a id="nav-devex-link" href="#devex" className="nav__link">Developer Experience</a>
            <a id="nav-docs-link" href="#" className="nav__link">Docs</a>
            <a id="nav-pricing-link" href="#" className="nav__link">Pricing</a>
          </div>
        </div>
        <div className="nav__actions">
          <a id="nav-signin-link" href="#" className="nav__signin">Sign in</a>
          <a id="nav-cta-link" href="#" className="btn-primary btn-primary--nav">
            Get Started
            <Icon icon="lucide:arrow-right" style={{ fontSize: '0.75rem' }} />
          </a>
        </div>
      </div>
    </nav>
  );
}
