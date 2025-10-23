import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from '../lib/theme-provider';

export const metadata: Metadata = {
  title: 'SMTP OAuth2 Gateway',
  description: 'Administration de la passerelle SMTP vers Microsoft Graph'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
