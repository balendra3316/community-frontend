"use client"
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  return (
    <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ 
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          py: { xs: 1, sm: 0 }
        }}>
          {/* Logo and Text Container */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', // This ensures vertical alignment
            mb: { xs: 1, sm: 0 }
          }}>
            <Box 
              sx={{ 
                width: 66, 
                height: 66, 
                borderRadius: '50%', 
                overflow: 'hidden',
                mr: 2,
                display: 'flex',
                alignItems: 'center', // Center logo vertically in its container
                justifyContent: 'center'
              }}
            >
              <Image 
                src="/mylogo.png"
                alt="Logo"
                width={66}
                height={66}
                style={{
                  objectFit: 'contain', // Ensures image fits properly
                  width: '100%',
                  height: '100%'
                }}
              />
            </Box>
            <Typography
              variant="h5"
              component="div"
              sx={{ 
                fontWeight: 700, 
                color: '#333',
                display: { xs: 'none', sm: 'block' },
                lineHeight: 1, // Adjust line height if needed
                alignSelf: 'center' // Align text vertically with logo
              }}
            >
               Community classes
            </Typography>
          </Box>

          {/* Login/Signup Button */}
          <Button 
            variant="outlined"
            onClick={onLoginClick}
            sx={{ 
              borderRadius: 28, 
              px: 3, 
              fontWeight: 600,
              borderColor: '#FFD700',
              color: '#333',
              '&:hover': {
                borderColor: '#FFC400',
                backgroundColor: 'rgba(255, 215, 0, 0.1)'
              },
              alignSelf: { xs: 'flex-end', sm: 'center' },
              mt: { xs: -7, sm: 0 }
            }}
          >
            Login / Signup
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}