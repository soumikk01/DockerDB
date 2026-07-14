import Icon from '@/components/Icon';
import Image from 'next/image';

const footerLinks = {
  Product: [
    { id: 'footer-features-link', label: 'Features', href: '#features' },
    { id: 'footer-pricing-link', label: 'Pricing', href: '#' },
    { id: 'footer-changelog-link', label: 'Changelog', href: '#' },
    { id: 'footer-roadmap-link', label: 'Roadmap', href: '#' },
  ],
  Resources: [
    { id: 'footer-docs-link', label: 'Documentation', href: '#' },
    { id: 'footer-api-link', label: 'API Reference', href: '#' },
    { id: 'footer-guides-link', label: 'Guides', href: '#' },
    { id: 'footer-blog-link', label: 'Blog', href: '#' },
  ],
  Company: [
    { id: 'footer-about-link', label: 'About', href: '#' },
    { id: 'footer-github-link', label: 'GitHub', href: '#' },
    { id: 'footer-twitter-link', label: 'Twitter', href: '#' },
    { id: 'footer-discord-link', label: 'Discord', href: '#' },
  ],
};

const socialLinks = [
  { id: 'footer-social-github', icon: 'lucide:github', href: '#' },
  { id: 'footer-social-twitter', icon: 'lucide:twitter', href: '#' },
  { id: 'footer-social-discord', icon: 'simple-icons:discord', href: '#' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a id="footer-home-link" href="#" className="footer-brand__logo">
              <Image src="/logo.svg" alt="DockerDB" width={80} height={20} />
            </a>
            <p className="footer-brand__desc">
              The developer operating system for databases. Local-first, Docker-powered, cloud-ready.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="footer-column">
              <h4 className="footer-column__title">{title}</h4>
              <div className="footer-column__links">
                {links.map((link) => (
                  <a key={link.id} id={link.id} href={link.href} className="footer-column__link">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">© {new Date().getFullYear()} DockerDB. All rights reserved.</p>
          <div className="footer-socials">
            {socialLinks.map((social) => (
              <a key={social.id} id={social.id} href={social.href} className="footer-social">
                <Icon icon={social.icon} style={{ fontSize: '0.875rem' }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
