
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
                  content: '"💻"',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  fontSize: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
              About Our Tech Community
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
            Our Tech Community Hub is a vibrant platform connecting thousands of developers, programmers, and tech enthusiasts worldwide. We're building a space where knowledge is shared freely, ideas flourish, and innovation thrives.
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
          Whether you're taking your first steps in coding or you're an experienced developer looking to stay ahead, our community provides the resources, mentorship, and collaborative opportunities you need to succeed. We believe in learning together, growing together, and building amazing things together.
            </Typography>
            
            <Typography variant="body1" sx={{ color: '#555' }}>
             Join our community today and be part of a global movement of developers passionate about technology, innovation, and continuous learning. Share your thoughts, collaborate on projects, and let's code the future together!
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}