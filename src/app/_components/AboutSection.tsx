
"use client"
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';

export default function AboutSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#fffde7' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mx: -2, alignItems: 'center' }}>
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2, mb: { xs: 4, md: 0 } }}>
            <Box 
              sx={{
                width: '100%',
                height: { xs: 300, md: 400 },
                backgroundColor: '#fffde7',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url("/logo acd.png")',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  opacity: 0.85,
                }
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2 }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                color: '#333'
              }}
            >
              About Anyone Can Dance
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
            Anyone Can Dance is India’s leading online dance training platform, helping over 1 lakh people transform from hesitant beginners into confident dancers.
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
          I’m Tiru Sameer – a Dance Coach, Choreo Specialist, Dance Therapist, and Nutrition Consultant. Above all, I’m a devoted husband to my amazing wife, Sandhya Venigalla, and a proud father to our wonderful daughter, Gamya.
            </Typography>
            
            <Typography variant="body1" sx={{ color: '#555' }}>
             Through our community-driven approach, we’ve helped thousands rediscover the joy of dance and overcome their inhibitions. The stage is set. The music is calling. Are you ready to dance your way to joy?
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}