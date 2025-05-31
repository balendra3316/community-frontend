



































           

            


















import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import { PostStateProvider } from '../types/PostStateContext';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Anyone Can Dance Community',
  description: 'Connect, share, and learn dance in your own private community. Join fellow dancers, share your moves, and grow together.',
  keywords: ['dance', 'community', 'learning', 'choreography', 'dancers'],
  authors: [{ name: 'DanceHub Team' }],
  creator: 'Anyone Can Dance Community',
  publisher: 'Anyone Can Dance Community',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo acd.png',
    shortcut: '/logo acd.png',
    apple: '/logo acd.png',
  },
  openGraph: {
    title: 'Anyone Can Dance Community',
    description: 'Connect, share, and learn dance in your own private community.',
    url: 'https://community.acdwithsameer.com', // Replace with your actual domain
    siteName: 'Anyone Can Dance Community',
    images: [
      {
        url: '/logo acd.png', // Replace with your og image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anyone Can Dance Community',
    description: 'Connect, share, and learn dance in your own private community.',
    images: ['/logo acd.png'], // Replace with your twitter image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {


  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* Favicon and apple touch icons */}
        <link rel="icon" type="image/png" href="/logo acd.png" />
        <link rel="apple-touch-icon" href="/logo acd.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        
        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-Arial">
        <PostStateProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </PostStateProvider>
      </body>
    </html>
  );
}