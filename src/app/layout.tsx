import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'DockerDB — Local Databases. Cloud-Level Experience.',
  description:
    'Create Docker-powered database workspaces in seconds — PostgreSQL, MongoDB, MySQL and more. The operating system for your data layer.',
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
