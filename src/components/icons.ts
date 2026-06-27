/**
 * Pre-registers all icons used in the app from locally-installed icon data packages.
 * This ensures icons render immediately without needing CDN fetch requests.
 *
 * Import this file once at the app root (layout or page) before any Icon component renders.
 */
import { addIcon } from '@iconify/react';

// Lucide icons
import {
  default as lucideIcons
} from '@iconify-json/lucide/icons.json';

// Simple Icons (brand logos)
import {
  default as simpleIcons
} from '@iconify-json/simple-icons/icons.json';

// Helper: extract a single icon from an Iconify JSON icon set
function registerIcon(
  iconSet: { prefix: string; icons: Record<string, { body: string }>; width?: number; height?: number },
  iconName: string
) {
  const data = iconSet.icons[iconName];
  if (data) {
    addIcon(`${iconSet.prefix}:${iconName}`, {
      body: data.body,
      width: iconSet.width ?? 24,
      height: iconSet.height ?? 24,
    });
  }
}

// Register all Lucide icons used in the app
const lucideNames = [
  'zap', 'link', 'cloud-upload', 'table-2', 'code-2',
  'arrow-up-down', 'arrow-right', 'play', 'check', 'github',
  'folder-open', 'box', 'database', 'plug', 'rocket',
];
lucideNames.forEach((name) => registerIcon(lucideIcons, name));

// Register all Simple Icons used in the app
const simpleNames = ['docker', 'postgresql', 'mongodb', 'prisma'];
simpleNames.forEach((name) => registerIcon(simpleIcons, name));
