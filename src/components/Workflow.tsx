'use client';

import Icon from '@/components/Icon';

const steps = [
  { icon: 'lucide:folder-open', title: 'Workspace', label: 'Create space', accent: true },
  { icon: 'lucide:box', title: 'Project', label: 'Initialize', accent: false },
  { icon: 'lucide:database', title: 'Database', label: 'Choose engine', accent: false },
  { icon: 'simple-icons:docker', title: 'Container', label: 'Auto-deploy', accent: false },
  { icon: 'lucide:plug', title: 'Connect', label: 'localhost URL', accent: false },
  { icon: 'lucide:rocket', title: 'Production', label: 'Push live', accent: true, isLast: true },
];

export default function Workflow() {
  return (
    <section id="workflow" className="section">
      <div className="container">
        <div className="workflow__header reveal">
          <p className="section-label">Workflow</p>
          <h2 className="section-title">
            From zero to production.
            <span> Six steps.</span>
          </h2>
        </div>

        <div className="flow-grid reveal">
          {steps.map((step) => (
            <div key={step.title} className={`flow-step${step.isLast ? ' flow-step--accent' : ''}`}>
              <Icon
                icon={step.icon}
                className="flow-step__icon"
                style={{ color: step.accent ? 'var(--accent)' : 'var(--text-secondary)' }}
              />
              <div className="flow-step__title">{step.title}</div>
              <div className="flow-step__label">{step.label}</div>
            </div>
          ))}
        </div>

        <div className="flow-line reveal">
          <div className="flow-line__inner">
            <div className="flow-dot" />
            <div className="flow-segment flow-segment--start" />
            <div className="flow-dot flow-dot--sm" />
            <div className="flow-segment" />
            <div className="flow-dot flow-dot--sm" />
            <div className="flow-segment" />
            <div className="flow-dot flow-dot--sm" />
            <div className="flow-segment" />
            <div className="flow-dot flow-dot--sm" />
            <div className="flow-segment flow-segment--end" />
            <div className="flow-dot" />
          </div>
        </div>
      </div>
    </section>
  );
}
