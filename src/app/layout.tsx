import type { Metadata } from 'next';
import './globals.css';
import CssLoader from '@/components/providers/CssLoader';
import AntdProvider from '@/components/providers/AntdProvider';
import { Noto_Sans_SC } from 'next/font/google';
import { RouteTabsProvider } from '@/components/layouts/RouteTabsContext';
import RouteTabsListener from '@/components/layouts/RouteTabsListener';
import PageTransition from '@/components/layouts/PageTransition';
import PageProgressBar from '@/components/layouts/PageProgressBar';
import LayoutController from '@/components/layouts/LayoutController';

const notoSans = Noto_Sans_SC({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Next Admin Starter',
  description: 'Next.js 15 Admin Starter Template',
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={notoSans.variable} style={{ height: '100%' }}>
      <body
        style={{ visibility: 'hidden', margin: 0, padding: 0, height: '100%', overflow: 'hidden' }}
      >
        <CssLoader />
        <AntdProvider>
          <RouteTabsProvider>
            <RouteTabsListener>
              <PageProgressBar />
              <LayoutController>
                <PageTransition>{children}</PageTransition>
              </LayoutController>
            </RouteTabsListener>
          </RouteTabsProvider>
        </AntdProvider>
      </body>
    </html>
  );
}
