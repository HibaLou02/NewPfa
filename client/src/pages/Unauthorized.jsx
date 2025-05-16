import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock as LockIcon } from '@mui/icons-material';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <LockIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          
          <Typography component="h1" variant="h4" gutterBottom>
            Accès non autorisé
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Retour
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
            >
              Retour au tableau de bord
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized; 