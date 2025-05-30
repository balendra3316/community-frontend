// src/app/_components/HeroSection.tsx
"use client"
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';

interface HeroSectionProps {
  onJoinClick: () => void;
}

export default function HeroSection({ onJoinClick }: HeroSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 }, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        backgroundImage: 'linear-gradient(to bottom, #fffde7, #ffffff)',
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
        onClick={onJoinClick}
        sx={{ 
          borderRadius: 28, 
          px: 6, 
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 600,
          backgroundColor: '#FFD700', // Changed to yellow
          color: '#333',
          boxShadow: '0 4px 14px rgba(255, 215, 0, 0.4)',
          '&:hover': {
            backgroundColor: '#FFC400'
          }
        }}
      >
        Join Now
      </Button>
    </Box>
  );
}