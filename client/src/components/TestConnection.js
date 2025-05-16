import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';

const TestConnection = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test de la route de base de l'API
        const response = await api.get('/');
        setMessage(response.data.message);
        setStatus('success');
      } catch (error) {
        console.error('Erreur de connexion:', error);
        setMessage(error.message || 'Erreur de connexion au serveur');
        setStatus('error');
      }
    };

    testConnection();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Test de Connexion API
      </Typography>
      
      {status === 'loading' && (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={20} />
          <Typography>Test de la connexion en cours...</Typography>
        </Box>
      )}

      {status === 'success' && (
        <Alert severity="success">
          Connexion réussie ! Message du serveur : {message}
        </Alert>
      )}

      {status === 'error' && (
        <Alert severity="error">
          Erreur de connexion : {message}
        </Alert>
      )}
    </Box>
  );
};

export default TestConnection; 