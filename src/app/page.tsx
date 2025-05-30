


// // src/app/page.tsx
// "use client"
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { Box } from '@mui/material';

// // Import components
// import Navbar from './_components/Navbar';
// import HeroSection from './_components/HeroSection';
// import FeaturesSection from './_components/FeaturesSection';
// import AboutSection from './_components/AboutSection';
// import TestimonialsSection from './_components/TestimonialsSection';
// import CtaSection from './_components/CtaSection';
// import Footer from './_components/Footer';
// import AuthModal from './_components/AuthModal';

// export default function LandingPage() {
//   const [openModal, setOpenModal] = useState(false);
//   const { user, loading, loginWithGoogle } = useAuth();
//   const router = useRouter();
  
//   // Redirect to community page if user is already logged in
//   useEffect(() => {
//     if (user && !loading) {
//       router.push('/community');
//     }
//   }, [user, loading, router]);

//   const handleOpenModal = () => {
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   const handleGoogleLogin = async () => {
//     await loginWithGoogle();
//     // The redirection will be handled by the useEffect hook above
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Box sx={{ textAlign: 'center' }}>
//           <Box 
//             component="span" 
//             sx={{ 
//               display: 'inline-block',
//               width: 50,
//               height: 50,
//               borderRadius: '50%',
//               border: '5px solid #FFD700',
//               borderTopColor: 'transparent',
//               animation: 'spin 1s linear infinite',
//               '@keyframes spin': {
//                 '0%': {
//                   transform: 'rotate(0deg)',
//                 },
//                 '100%': {
//                   transform: 'rotate(360deg)',
//                 },
//               },
//             }}
//           />
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       {/* Navbar */}
//       <Navbar onLoginClick={handleOpenModal} />
      
//       {/* Main Content */}
//       <Box sx={{ flexGrow: 1 }}>
//         {/* Hero Section */}
//         <HeroSection onJoinClick={handleOpenModal} />
        
//         {/* Features Section */}
//         <FeaturesSection />
        
//         {/* About Section */}
//         <AboutSection />
        
//         {/* Testimonials Section */}
//         <TestimonialsSection />
        
//         {/* CTA Section */}
//         <CtaSection onJoinClick={handleOpenModal} />
//       </Box>
      
//       {/* Footer */}
//       <Footer />
      
//       {/* Auth Modal */}
//       <AuthModal 
//         open={openModal} 
//         onClose={handleCloseModal} 
//         onGoogleLogin={handleGoogleLogin} 
//       />
//     </Box>
//   );
// }










// src/app/page.tsx
"use client"
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { Box } from '@mui/material';

// Import critical components immediately
import Navbar from './_components/Navbar';
import HeroSection from './_components/HeroSection';
import LoadingSpinner from './_components/LoadingSpinner';

// Lazy load non-critical components to improve initial page load
const FeaturesSection = dynamic(() => import('./_components/FeaturesSection'), {
  loading: () => <Box sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>
});

const AboutSection = dynamic(() => import('./_components/AboutSection'), {
  loading: () => <Box sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>
});

const TestimonialsSection = dynamic(() => import('./_components/TestimonialsSection'), {
  loading: () => <Box sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>
});

const CtaSection = dynamic(() => import('./_components/CtaSection'), {
  loading: () => <Box sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>
});

const Footer = dynamic(() => import('./_components/Footer'), {
  loading: () => <Box sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>
});

const AuthModal = dynamic(() => import('./_components/AuthModal'), {
  ssr: false 
});

// Types for better TypeScript support
interface LandingPageProps {}

export default function LandingPage({}: LandingPageProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [hasRedirected, setHasRedirected] = useState<boolean>(false);
  
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();
  
  // Memoize redirect logic to prevent unnecessary re-renders
  const shouldRedirect = useMemo(() => {
    return user && !loading && !hasRedirected;
  }, [user, loading, hasRedirected]);

  // Redirect to community page if user is already logged in
  useEffect(() => {
    if (shouldRedirect) {
      setHasRedirected(true);
      router.prefetch('/community'); // Prefetch the community page
      router.push('/community');
    }
  }, [shouldRedirect, router]);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    try {
      await loginWithGoogle();
      // The redirection will be handled by the useEffect hook above
    } catch (error) {
      console.error('Login failed:', error);
      // You might want to show an error message to the user here
    }
  }, [loginWithGoogle]);

  // Prefetch critical pages on component mount
  useEffect(() => {
    router.prefetch('/community');
  }, [router]);

  // Show loading spinner while authentication is being checked
  if (loading) {
    return <LoadingSpinner />;
  }

  // Don't render the page if user is authenticated to prevent flash
  if (user && !hasRedirected) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* SEO Meta Tags - These should ideally be in layout.tsx or metadata */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          // Performance optimization: use transform instead of changing layout properties
          '& *': {
            willChange: 'auto', // Reset will-change to prevent memory issues
          }
        }}
        role="main"
        aria-label="Landing page content"
      >
        {/* Navbar - Critical, loads immediately */}
        <Box component="header" role="banner">
          <Navbar onLoginClick={handleOpenModal} />
        </Box>
        
        {/* Main Content */}
        <Box 
          sx={{ flexGrow: 1 }}
          component="section"
          aria-label="Main content sections"
        >
          {/* Hero Section - Critical, loads immediately */}
          <HeroSection onJoinClick={handleOpenModal} />
          
          {/* Features Section - Lazy loaded */}
          <FeaturesSection />
          
          {/* About Section - Lazy loaded */}
          <AboutSection />
          
          {/* Testimonials Section - Lazy loaded */}
          <TestimonialsSection />
          
          {/* CTA Section - Lazy loaded */}
          <CtaSection onJoinClick={handleOpenModal} />
        </Box>
        
        {/* Footer - Lazy loaded */}
        <Box component="footer" role="contentinfo">
          <Footer />
        </Box>
        
        {/* Auth Modal - Lazy loaded and only rendered when needed */}
        {openModal && (
          <AuthModal 
            open={openModal} 
            onClose={handleCloseModal} 
            onGoogleLogin={handleGoogleLogin}
            aria-describedby="authentication-modal"
          />
        )}
      </Box>
    </>
  );
}