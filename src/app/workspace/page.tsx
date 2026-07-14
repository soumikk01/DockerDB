import { Suspense } from 'react';
import WorkspaceApp from './WorkspaceApp';

export const metadata = {
  title: 'Workspace — DockerDB',
  description: 'Manage your database — tables, schemas, functions, indexes and more.',
};

function WorkspaceFallback() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-0)',
      color: 'var(--text-tertiary)',
      fontFamily: 'var(--font-sans)',
      fontSize: '0.875rem',
      gap: '0.75rem',
    }}>
      <div style={{
        width: '1rem',
        height: '1rem',
        border: '2px solid var(--border-default)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      Connecting…
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<WorkspaceFallback />}>
      <WorkspaceApp />
    </Suspense>
  );
}
