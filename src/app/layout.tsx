


import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import { PostStateProvider } from '../types/PostStateContext';
import type { Metadata } from 'next';
import { Providers } from '../lib/ReduxProvider'


export const metadata: Metadata = {
  title: 'Tech Community Hub - Learn & Collaborate',
  description: 'Connect with developers, share your knowledge, and grow together. Join our thriving tech community for coding resources, mentorship, and collaboration.',
  keywords: ['tech community', 'coding', 'developers', 'learning', 'collaboration', 'programming'],
  authors: [{ name: 'Tech Community Hub Team' }],
  creator: 'Tech Community Hub',
  publisher: 'Tech Community Hub',
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
    title: 'Tech Community Hub - Learn & Collaborate',
    description: 'Connect with developers, share knowledge, and grow together in our tech community.',
    url: 'https://techcommunityhub.com', // Replace with your actual domain
    siteName: 'Tech Community Hub',
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
    title: 'Tech Community Hub - Learn & Collaborate',
    description: 'Connect with developers, share knowledge, and grow together in our tech community.',
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
        {/* and apple touch icons */}
        <link rel="icon" type="image/png" href="/mylogo.png" />
        <link rel="apple-touch-icon" href="/mylogo.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        
        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-Arial">
        <PostStateProvider>
          <AuthProvider>
            <Providers> {children}</Providers>
           
          </AuthProvider>
        </PostStateProvider>
      </body>
    </html>
  );
}





