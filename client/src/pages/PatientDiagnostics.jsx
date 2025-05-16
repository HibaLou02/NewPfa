import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper } from '@mui/material';
import DiagnosticData from '../components/DiagnosticData';

const PatientDiagnostics = () => {
  const { patientId } = useParams();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Données Diagnostiques du Patient
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Visualisation et gestion des données diagnostiques
          </Typography>
        </Paper>

        <DiagnosticData patientId={patientId} />
      </Box>
    </Container>
  );
};

export default PatientDiagnostics; 