'use client';

// Pre-register all icons from local data (runs once on import)
import '@/components/icons';

export default function IconProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
