import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const mockPatients = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    age: 45,
    gender: 'M',
    phone: '06 12 34 56 78',
    lastVisit: '2024-03-15',
    nextAppointment: '2024-04-01',
    status: 'Actif',
    conditions: ['Diabète', 'Hypertension'],
  },
  {
    id: 2,
    firstName: 'Marie',
    lastName: 'Martin',
    age: 32,
    gender: 'F',
    phone: '06 98 76 54 32',
    lastVisit: '2024-03-10',
    status: 'Actif',
    conditions: ['Asthme'],
  },
  // Ajoutez plus de patients ici
];

const PatientList = () => {
  const navigate = useNavigate();

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Grid container spacing={2}>
      {mockPatients.map((patient) => (
        <Grid item xs={12} md={6} lg={4} key={patient.id}>
          <Card
            sx={{
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'primary.main',
                    fontSize: '1.2rem',
                  }}
                >
                  {getInitials(patient.firstName, patient.lastName)}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6">
                    {patient.firstName} {patient.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {patient.age} ans • {patient.gender === 'M' ? 'Homme' : 'Femme'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Dernière visite : {formatDate(patient.lastVisit)}
                </Typography>
                {patient.nextAppointment && (
                  <Typography variant="body2" color="text.secondary">
                    Prochain RDV : {formatDate(patient.nextAppointment)}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                {patient.conditions.map((condition, index) => (
                  <Chip
                    key={index}
                    label={condition}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/appointments/new?patientId=${patient.id}`)}
                >
                  <CalendarIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/patients/${patient.id}/edit`)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => console.log('Delete patient:', patient.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PatientList; 