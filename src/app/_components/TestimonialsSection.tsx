// src/app/_components/TestimonialsSection.tsx
"use client"
import { useState } from 'react';
import { Avatar, Box, Card, CardContent, Container, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';

export default function TestimonialsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      name: "Jessy Varghese",
      role: "Beginner Dancer",
      content: "Words cannot express my happiness and gratitude for Sameer and Sandhya. Sameer nurtured my dance and spirit with passion and wisdom. Sandhya’s compassion makes this journey special. Together, they’ve created a family, a blessing I cherish for a lifetime",
      rating: 5
    },
    {
      name: "Sheshaa Rathnam (51 year)",
      role: "Intermediate Dancer",
      content: "Thanks to Sameer for all the efforts he takes to do justice to every student by being patiently repeating and getting the best from every individual. Please join ACD with Sameer's workshop and get benefitted!",
      rating: 5
    },
    {
      name: "Emcee Thamizharasan",
      role: "Acidans",
      content: "I started exploring dance when I was 17 with countless attempts and many wonderful people trying to teach me. But I never truly learned-1 always ended up quitting. Then came Mr Tiru Sameer coach who changed everything for me His 5-day online workshop was a game-changer, not just for my dance skills but for my confidence",
      rating: 5
    }
  ];

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 }, 
        background: 'linear-gradient(135deg, #FFF9C4 0%, #FFEB3B 50%, #FFC107 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255, 193, 7, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 235, 59, 0.3) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h2" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              color: '#B8860B',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              background: 'linear-gradient(45deg, #B8860B, #8B4513)',
              backgroundClip: 'text',
            }}
          >
            What Our Community Says
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#8B4513',
              opacity: 0.8,
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            Real stories from our amazing dance community
          </Typography>
        </Box>
        
        {/* Main Testimonial Card */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mb: 4
        }}>
          {!isMobile && (
            <IconButton 
              onClick={handlePrev} 
              sx={{ 
                color: '#B8860B',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '2px solid rgba(255, 193, 7, 0.3)',
                '&:hover': {
                  backgroundColor: '#FFF',
                  transform: 'scale(1.1)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                },
                transition: 'all 0.3s ease',
                mr: 2
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}
          
          <Card 
            elevation={0}
            sx={{ 
              maxWidth: { xs: '100%', sm: 600, md: 700 }, 
              width: '100%',
              borderRadius: { xs: 3, md: 4 },
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 193, 7, 0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 8px 20px rgba(255, 193, 7, 0.15)',
              position: 'relative',
              overflow: 'visible',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 25px 70px rgba(0,0,0,0.15), 0 10px 25px rgba(255, 193, 7, 0.2)'
              }
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              {/* Quote Icon */}
              <FormatQuoteIcon 
                sx={{ 
                  fontSize: { xs: 40, md: 50 }, 
                  color: '#FFD700',
                  opacity: 0.6,
                  position: 'absolute',
                  top: { xs: -10, md: -15 },
                  left: { xs: 15, md: 20 },
                  transform: 'rotate(-10deg)'
                }} 
              />
              
              {/* Star Rating */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mb: 3,
                mt: 1
              }}>
                {[...Array(activeTestimonial.rating)].map((_, i) => (
                  <StarIcon 
                    key={i}
                    sx={{ 
                      color: '#FFD700', 
                      fontSize: { xs: 20, md: 24 },
                      mx: 0.2,
                      filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))'
                    }} 
                  />
                ))}
              </Box>
              
              {/* Testimonial Content */}
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }, 
                  mb: 4, 
                  fontStyle: 'italic',
                  textAlign: 'center',
                  color: '#2C2C2C',
                  lineHeight: 1.7,
                  fontWeight: 400
                }}
              >
                "{activeTestimonial.content}"
              </Typography>
              
              {/* User Info */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 3 }
              }}>
                <Avatar 
                  sx={{ 
                    background: 'linear-gradient(135deg, #FFD700, #FFA000)',
                    color: '#8B4513',
                    width: { xs: 50, md: 60 },
                    height: { xs: 50, md: 60 },
                    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                    border: '3px solid rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <PersonIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
                </Avatar>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#2C2C2C',
                      mb: 0.5,
                      fontSize: { xs: '1.1rem', md: '1.25rem' }
                    }}
                  >
                    {activeTestimonial.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#B8860B',
                      fontWeight: 500,
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}
                  >
                    {activeTestimonial.role}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          {!isMobile && (
            <IconButton 
              onClick={handleNext} 
              sx={{ 
                color: '#B8860B',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '2px solid rgba(255, 193, 7, 0.3)',
                '&:hover': {
                  backgroundColor: '#FFF',
                  transform: 'scale(1.1)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                },
                transition: 'all 0.3s ease',
                ml: 2
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
        
        {/* Mobile Navigation Arrows */}
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3,
            mb: 3
          }}>
            <IconButton 
              onClick={handlePrev}
              sx={{ 
                color: '#B8860B',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '2px solid rgba(255, 193, 7, 0.3)',
                '&:hover': {
                  backgroundColor: '#FFF',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton 
              onClick={handleNext}
              sx={{ 
                color: '#B8860B',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '2px solid rgba(255, 193, 7, 0.3)',
                '&:hover': {
                  backgroundColor: '#FFF',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        )}
        
        {/* Pagination Dots */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 1.5
        }}>
          {testimonials.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: 10, md: 12 },
                height: { xs: 10, md: 12 },
                borderRadius: '50%',
                backgroundColor: index === activeIndex ? '#B8860B' : 'rgba(184, 134, 11, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: index === activeIndex ? '0 4px 12px rgba(184, 134, 11, 0.4)' : 'none',
                '&:hover': {
                  transform: 'scale(1.2)',
                  backgroundColor: index === activeIndex ? '#B8860B' : 'rgba(184, 134, 11, 0.5)'
                }
              }}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}