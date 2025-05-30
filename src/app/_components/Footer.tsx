// src/app/_components/Footer.tsx
"use client"
import { Box, Container, Link, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
  return (
    <Box sx={{ py: 6, backgroundColor: '#333' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 2, mb: { xs: 4, md: 0 } }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Anyone Can Dance
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
              Empowering everyone to express themselves through dance since 2020.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="https://www.facebook.com/fitnessashobby?mibextid=LQQJ4d&rdid=XOZC9eolIlf694Ix&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FSi9QWCfQqF2c4jXY%2F%3Fmibextid%3DLQQJ4d#" color="inherit" sx={{ color: '#FFD700' }}>
                <FacebookIcon />
              </Link>
              
              <Link href="https://www.instagram.com/acdwithsameer?igsh=cXc1NGgxMHEyb2E%3D" color="inherit" sx={{ color: '#FFD700' }}>
                <InstagramIcon />
              </Link>
              <Link href="https://www.youtube.com/@acdbysameer" color="inherit" sx={{ color: '#FFD700' }}>
                <YouTubeIcon />
              </Link>
            </Box>
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 2, mb: { xs: 4, md: 0 } }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="https://anyonecandance.in/" underline="hover" sx={{ color: '#ccc' }}>
               Shop
              </Link>
              
              <Link href="https://acdwithsameer.com/" underline="hover" sx={{ color: '#ccc' }}>
                Refer & Earn
              </Link>
              <Link href="https://learn.anyonecandance.in/acd" underline="hover" sx={{ color: '#ccc' }}>
                 Our main website
              </Link>
            </Box>
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 2, mb: { xs: 4, md: 0 } }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="https://www.youtube.com/@acdbysameer" underline="hover" sx={{ color: '#ccc' }}>
                Tutorials
              </Link>
              <Link href="https://learn.anyonecandance.in/acd" underline="hover" sx={{ color: '#ccc' }}>
                Events
              </Link>

              <Link href="https://learn.anyonecandance.in/acd" underline="hover" sx={{ color: '#ccc' }}>
                FAQ
              </Link>
            </Box>
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 2 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Email: support@soulskool.in
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Phone: +91 9642087790
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Flat No 301, TVH Vista Heights, Tower 6, Trichy Rd, Kallimadai, Coimbatore, Tamil Nadu, Coimbatore - 641048
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #444', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#ccc' }}>
            © 2025 Soul Skool All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}