import React from 'react';
import { Box } from '@mui/material';

const illustrations = {
  appointment: '/assets/images/appointment.svg',
  patient: '/assets/images/patient.svg',
  treatment: '/assets/images/treatment.svg',
  diagnostic: '/assets/images/diagnostic.svg',
  doctor: '/assets/images/doctor.svg',
  empty: '/assets/images/empty-state.svg',
  success: '/assets/images/success.svg',
  error: '/assets/images/error.svg',
};

const IllustrationIcon = ({ name, size = 'medium', color, ...props }) => {
  const sizes = {
    small: 24,
    medium: 48,
    large: 96,
    xlarge: 192,
  };

  const finalSize = typeof size === 'number' ? size : sizes[size] || sizes.medium;

  return (
    <Box
      component="img"
      src={illustrations[name] || illustrations.empty}
      alt={name}
      sx={{
        width: finalSize,
        height: finalSize,
        filter: color ? `drop-shadow(0 0 8px ${color})` : 'none',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default IllustrationIcon; 