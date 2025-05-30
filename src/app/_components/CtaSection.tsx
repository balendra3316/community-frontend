// src/app/_components/CtaSection.tsx
"use client"
import { Box, Button, Container, Typography, useMediaQuery, useTheme } from '@mui/material';

interface CtaSectionProps {
  onJoinClick: () => void;
}

export default function CtaSection({ onJoinClick }: CtaSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 10 }, 
        backgroundColor: '#FFF9C4', // Light yellow background
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <Box 
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          backgroundColor: '#FFD700',
          opacity: 0.2,
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: '#FFD700',
          opacity: 0.2,
        }}
      />
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box 
          sx={{ 
            textAlign: 'center',
            p: { xs: 3, md: 5 },
            borderRadius: 4,
          }}
        >
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 3,
              color: '#333'
            }}
          >
            Ready to Start Your Dance Journey?
          </Typography>
          
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              maxWidth: 600, 
              mb: 4,
              mx: 'auto',
              color: '#555'
            }}
          >
            Join our community today and discover the joy of dance with thousands of enthusiasts just like you
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
              backgroundColor: '#FFD700',
              color: '#333',
              boxShadow: '0 4px 14px rgba(255, 215, 0, 0.4)',
              '&:hover': {
                backgroundColor: '#FFC400'
              }
            }}
          >
            Join Our Community
          </Button>
        </Box>
      </Container>
    </Box>
  );
}