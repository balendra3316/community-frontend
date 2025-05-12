
// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Andynocode',
//   description: 'Coding platform for learning and community',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   );
// }










// src/app/layout.tsx
"use client"
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import { PostStateProvider } from '../types/PostStateContext'; 


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <PostStateProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
        </PostStateProvider>
      </body>
    </html>
  );
}