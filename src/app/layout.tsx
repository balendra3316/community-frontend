
// // import type { Metadata } from 'next';
// // import { Inter } from 'next/font/google';
// // import './globals.css';

// // const inter = Inter({ subsets: ['latin'] });

// // export const metadata: Metadata = {
// //   title: 'Andynocode',
// //   description: 'Coding platform for learning and community',
// // };

// // export default function RootLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <html lang="en">
// //       <body className={inter.className}>{children}</body>
// //     </html>
// //   );
// // }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
//           rel="stylesheet"
//         />
//         <link rel="icon" href="/logo acd.png" />
//       </head>
//       <body className="font-Arial">
//         <PostStateProvider>
//           <AuthProvider>{children}</AuthProvider>
//         </PostStateProvider>
//       </body>
//     </html>
//   );
// }










"use client"
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import { PostStateProvider } from '../types/PostStateContext'; 







const metadata = {
  title: 'My Community App',
  description: 'Connect, share, and learn in your own private community.',
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
        <link rel="icon" href="/logo acd.png" />
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
