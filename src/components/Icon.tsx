/**
 * Custom Icon component that renders SVG icons directly from bundled @iconify-json data.
 * Replaces @iconify/react entirely — no CDN requests, no hydration mismatches.
 */
import lucideSet from '@iconify-json/lucide/icons.json';
import simpleSet from '@iconify-json/simple-icons/icons.json';
import type { CSSProperties } from 'react';

type IconSet = {
  prefix: string;
  icons: Record<string, { body: string }>;
  aliases?: Record<string, { parent: string }>;
  width?: number;
  height?: number;
};

const sets: Record<string, IconSet> = {
  lucide: lucideSet as IconSet,
  'simple-icons': simpleSet as IconSet,
};

function resolveIcon(set: IconSet, name: string): string | null {
  if (set.icons[name]) return set.icons[name].body;
  // Check aliases
  const alias = set.aliases?.[name];
  if (alias && set.icons[alias.parent]) return set.icons[alias.parent].body;
  return null;
}

interface IconProps {
  icon: string;
  style?: CSSProperties;
  className?: string;
}

export default function Icon({ icon, style, className }: IconProps) {
  const [prefix, name] = icon.split(':');
  const set = sets[prefix];
  if (!set) return null;

  const body = resolveIcon(set, name);
  if (!body) return null;

  const size = style?.fontSize ?? '1em';
  const w = set.width ?? 24;
  const h = set.height ?? 24;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${w} ${h}`}
      style={{ ...style, fontSize: undefined }}
      className={className}
      role="img"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
