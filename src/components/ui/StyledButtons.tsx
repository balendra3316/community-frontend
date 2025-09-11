// src/components/ui/StyledButtons.tsx
'use client';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const YellowButton = styled(Button)(({ theme, variant }) => ({
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: 'none',
  
  ...(variant === 'contained' && {
    background: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #F59E0B 100%)',
    color: '#92400E',
    border: '1px solid #F59E0B',
    '&:hover': {
      background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)',
      boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
    },
    '&:disabled': {
      background: '#F9FAFB',
      color: '#9CA3AF',
      border: '1px solid #E5E7EB',
      transform: 'none',
    },
  }),
}));

export const AccessButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '10px',
  padding: '10px 20px',
  background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
  color: '#065F46',
  border: '1px solid #10B981',
  '&:hover': {
    background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)',
    transform: 'translateY(-1px)',
  },
}));