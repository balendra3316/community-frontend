// src/app/_components/FeaturesSection.tsx
"use client"
import { Box, Card, CardContent, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function FeaturesSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const features = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: '#FFD700' }} />,
      title: 'Personalized Learning',
      description: 'Get dance routines tailored to your skill level and preferences'
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40, color: '#FFD700' }} />,
      title: 'Community Support',
      description: 'Connect with fellow dancers, share experiences, and grow together'
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#FFD700' }} />,
      title: 'Expert Tutorials',
      description: 'Learn from professional dancer Sameer ACD Coach with detailed Live classes'
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#FFD700' }} />,
      title: 'Challenges & Events',
      description: 'Participate in weekly challenges and virtual dance competitions'
    }
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'white' }}>
      <Container maxWidth="lg">
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          align="center" 
          sx={{ 
            fontWeight: 700, 
            mb: 6,
            color: '#333'
          }}
        >
          Why Join Our Community
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          {features.map((feature, index) => (
            <Box 
              key={index} 
              sx={{ 
                width: { xs: '100%', sm: '50%', md: '25%' }, 
                px: 2, 
                mb: 4 
              }}
            >
           <Card 
  sx={{ 
    height: '100%', 
    borderRadius: 4,
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid rgba(0, 0, 0, 0.24)' ,
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
       border: '1px solid rgba(61, 58, 58, 0.24)'  // Slightly stronger shadow on hover
    } 
  }}
>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}