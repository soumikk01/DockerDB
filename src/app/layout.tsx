import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'DockerDB — Local Databases. Cloud-Level Experience.',
  description:
    'Create Docker-powered database workspaces in seconds — PostgreSQL, MongoDB, MySQL and more. The operating system for your data layer.',
  icons: {
    icon: [
      { url: '/logo.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/logo.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/logo.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    shortcut: [{ url: '/logo.svg', sizes: 'any', type: 'image/svg+xml' }],
    apple: [{ url: '/logo.svg', sizes: '180x180', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
