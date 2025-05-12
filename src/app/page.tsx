


// // src/app/page.tsx
// "use client"
// import { useState } from 'react';
// import { 
//   AppBar, 
//   Box, 
//   Button, 
//   Container, 
//   Dialog, 
//   DialogContent, 
//   DialogTitle, 
//   IconButton, Toolbar,  Typography, 
//   useMediaQuery,  useTheme 
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import GoogleIcon from '@mui/icons-material/Google';

// export default function LandingPage() {
//   const [openModal, setOpenModal] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const handleOpenModal = () => {
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   return (
//     <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
//       {/* Navbar */}
//       <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white' }}>
//         <Container maxWidth="xl">
//           <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
//             {/* Logo */}
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <Typography
//                 variant="h5"
//                 component="div"
//                 sx={{ 
//                   fontWeight: 700, 
//                   color: '#333',
//                   display: 'flex',
//                   alignItems: 'center'
//                 }}
//               >
//                 <Box 
//                   component="span" 
//                   sx={{ 
//                     backgroundColor: '#d94d9b', 
//                     width: 36, 
//                     height: 36, 
//                     borderRadius: '50%', 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     justifyContent: 'center',
//                     color: 'white',
//                     mr: 1
//                   }}
//                 >
//                   A
//                 </Box>
//                 Anyone Can Dance
//               </Typography>
//             </Box>

//             {/* Login/Signup Button */}
//             <Button 
//               variant="outlined"
//               onClick={handleOpenModal}
//               sx={{ 
//                 borderRadius: 28, 
//                 px: 3, 
//                 fontWeight: 600,
//                 borderColor: '#d94d9b',
//                 color: '#d94d9b',
//                 '&:hover': {
//                   borderColor: '#c03b87',
//                   backgroundColor: 'rgba(217, 77, 155, 0.04)'
//                 }
//               }}
//             >
//               Login / Signup
//             </Button>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       {/* Main Content */}
//       <Box 
//         sx={{ 
//           flexGrow: 1, 
//           display: 'flex', 
//           flexDirection: 'column', 
//           justifyContent: 'center', 
//           alignItems: 'center',
//           textAlign: 'center',
//           backgroundImage: 'linear-gradient(to bottom, #f9f9f9, #ffffff)',
//           px: 3
//         }}
//       >
//         <Typography 
//           variant={isMobile ? "h3" : "h2"} 
//           component="h1" 
//           sx={{ 
//             fontWeight: 700, 
//             mb: 2,
//             color: '#333'
//           }}
//         >
//           Connect with the Dance Community
//         </Typography>
        
//         <Typography 
//           variant="h6" 
//           component="p" 
//           sx={{ 
//             maxWidth: 600, 
//             mb: 6,
//             color: '#666'
//           }}
//         >
//           Join thousands of Dance enthusiasts, share automations, and learn together in our vibrant community
//         </Typography>
        
//         <Button 
//           variant="contained" 
//           size="large"
//           onClick={handleOpenModal}
//           sx={{ 
//             borderRadius: 28, 
//             px: 6, 
//             py: 1.5,
//             fontSize: '1.1rem',
//             fontWeight: 600,
//             backgroundColor: '#d94d9b',
//             boxShadow: '0 4px 14px rgba(217, 77, 155, 0.4)',
//             '&:hover': {
//               backgroundColor: '#c03b87'
//             }
//           }}
//         >
//           Join Now
//         </Button>
//       </Box>

//       {/* Footer */}
//       <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'white' }}>
//         <Typography variant="body2" color="text.secondary">
//           © 2025 soulskool Community. All rights reserved.
//         </Typography>
//       </Box>

//       {/* Auth Modal */}
//       <Dialog 
//         open={openModal} 
//         onClose={handleCloseModal}
//         fullWidth
//         maxWidth="xs"
//       >
//         <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
//           <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
//             Welcome to ACD
//           </Typography>
//           <IconButton
//             aria-label="close"
//             onClick={handleCloseModal}
//             sx={{
//               position: 'absolute',
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ textAlign: 'center', px: 4, pb: 5 }}>
//           <Typography variant="body1" sx={{ mb: 4 }}>
//             To get started, please continue with Google
//           </Typography>
          
//           <Button
//             variant="outlined"
//             startIcon={<GoogleIcon />}
//             fullWidth
//             size="large"
//             sx={{ 
//               borderRadius: 28, 
//               py: 1.5,
//               fontSize: '1rem',
//               fontWeight: 500,
//               borderColor: '#ddd',
//               color: '#444',
//               '&:hover': {
//                 borderColor: '#ccc',
//                 backgroundColor: '#f9f9f9'
//               }
//             }}
//           >
//             Continue with Google
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// }














// src/app/page.tsx
"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  AppBar, 
  Box, 
  Button, 
  Container, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, Toolbar, Typography, 
  useMediaQuery, useTheme 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import { PostStateProvider } from '../types/PostStateContext'; 


export default function LandingPage() {
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();
  
  // Redirect to community page if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/community');
    }
  }, [user, loading, router]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    // The redirection will be handled by the loginWithGoogle function
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h5"
                component="div"
                sx={{ 
                  fontWeight: 700, 
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    backgroundColor: '#d94d9b', 
                    width: 36, 
                    height: 36, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    mr: 1
                  }}
                >
                  A
                </Box>
                Anyone Can Dance
              </Typography>
            </Box>

            {/* Login/Signup Button */}
            <Button 
              variant="outlined"
              onClick={handleOpenModal}
              sx={{ 
                borderRadius: 28, 
                px: 3, 
                fontWeight: 600,
                borderColor: '#d94d9b',
                color: '#d94d9b',
                '&:hover': {
                  borderColor: '#c03b87',
                  backgroundColor: 'rgba(217, 77, 155, 0.04)'
                }
              }}
            >
              Login / Signup
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(to bottom, #f9f9f9, #ffffff)',
          px: 3
        }}
      >
        <Typography 
          variant={isMobile ? "h3" : "h2"} 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            color: '#333'
          }}
        >
          Connect with the Dance Community
        </Typography>
        
        <Typography 
          variant="h6" 
          component="p" 
          sx={{ 
            maxWidth: 600, 
            mb: 6,
            color: '#666'
          }}
        >
          Join thousands of Dance enthusiasts, share automations, and learn together in our vibrant community
        </Typography>
        
        <Button 
          variant="contained" 
          size="large"
          onClick={handleOpenModal}
          sx={{ 
            borderRadius: 28, 
            px: 6, 
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            backgroundColor: '#d94d9b',
            boxShadow: '0 4px 14px rgba(217, 77, 155, 0.4)',
            '&:hover': {
              backgroundColor: '#c03b87'
            }
          }}
        >
          Join Now
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'white' }}>
        <Typography variant="body2" color="text.secondary">
          © 2025 soulskool Community. All rights reserved.
        </Typography>
      </Box>

      {/* Auth Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
            Welcome to ACD
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', px: 4, pb: 5 }}>
          <Typography variant="body1" sx={{ mb: 4 }}>
            To get started, please continue with Google
          </Typography>
          
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            size="large"
            onClick={handleGoogleLogin}
            sx={{ 
              borderRadius: 28, 
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 500,
              borderColor: '#ddd',
              color: '#444',
              '&:hover': {
                borderColor: '#ccc',
                backgroundColor: '#f9f9f9'
              }
            }}
          >
            Continue with Google
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}