import React from 'react';
import { Grid, Container, Typography, Box } from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  CalendarMonth as CalendarMonthIcon,
  MedicalServices as MedicalServicesIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

import StatsCard from '../components/StatsCard';
import AppointmentCard from '../components/AppointmentCard';
import IllustrationIcon from '../components/IllustrationIcon';

const mockAppointment = {
  date: new Date().toISOString(),
  duration: 30,
  type: 'CONSULTATION',
  status: 'PLANIFIE',
  room: '204',
  reason: 'Consultation générale',
  notes: 'Patient régulier',
  reminder: true
};

const mockPatient = {
  firstName: 'Jean',
  lastName: 'Dupont'
};

const mockChartData = Array(7).fill().map((_, i) => ({
  name: `Jour ${i + 1}`,
  value: Math.floor(Math.random() * 100)
}));

const Dashboard = () => {
  const handleEditAppointment = (appointment) => {
    console.log('Edit appointment:', appointment);
  };

  const handleDeleteAppointment = (appointment) => {
    console.log('Delete appointment:', appointment);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IllustrationIcon name="diagnostic" size="large" color="#2196f3" />
        <Typography variant="h4" component="h1">
          Tableau de bord
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Cartes de statistiques */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Nouveaux Patients"
            value="24"
            change={12}
            changeType="increase"
            data={mockChartData}
            color="#2196f3"
            icon={PersonAddIcon}
            progress={75}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Rendez-vous"
            value="42"
            change={-5}
            changeType="decrease"
            data={mockChartData}
            color="#26a69a"
            icon={CalendarMonthIcon}
            progress={85}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Traitements"
            value="18"
            change={8}
            changeType="increase"
            data={mockChartData}
            color="#ef5350"
            icon={MedicalServicesIcon}
            progress={60}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Diagnostics"
            value="96"
            change={15}
            changeType="increase"
            data={mockChartData}
            color="#ff9800"
            icon={AnalyticsIcon}
            progress={90}
          />
        </Grid>

        {/* Section des rendez-vous */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IllustrationIcon name="appointment" size="small" />
            Prochains rendez-vous
          </Typography>
          <Grid container spacing={2}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} md={4} key={i}>
                <AppointmentCard
                  appointment={mockAppointment}
                  patient={mockPatient}
                  onEdit={handleEditAppointment}
                  onDelete={handleDeleteAppointment}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 