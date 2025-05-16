import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import IllustrationIcon from '../components/IllustrationIcon';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentCard from '../components/AppointmentCard';

// Données de test
const mockPatients = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    // ... autres informations patient
  },
  // Ajoutez d'autres patients de test
];

const mockAppointments = [
  {
    id: 1,
    patientId: 1,
    date: new Date('2024-03-20T10:00:00'),
    duration: 30,
    type: 'CONSULTATION',
    reason: 'Consultation de routine',
    notes: 'Patient à jeun',
    status: 'PLANIFIE',
    room: 'A101',
    reminder: true,
  },
  // Ajoutez d'autres rendez-vous de test
];

const Appointments = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setFormOpen(true);
  };

  const handleDeleteAppointment = (appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setAppointments(appointments.filter(a => a.id !== appointmentToDelete.id));
    setDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  const handleFormSubmit = (formData) => {
    if (selectedAppointment) {
      // Modification
      setAppointments(appointments.map(a => 
        a.id === selectedAppointment.id ? { ...formData, id: a.id } : a
      ));
    } else {
      // Création
      setAppointments([
        ...appointments,
        {
          ...formData,
          id: Math.max(...appointments.map(a => a.id)) + 1,
        },
      ]);
    }
    setFormOpen(false);
    setSelectedAppointment(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedAppointment(null);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const searchText = searchQuery.toLowerCase();
    const patient = mockPatients.find(p => p.id === appointment.patientId);
    
    // Filtre par recherche
    const searchMatch = patient && (
      patient.firstName.toLowerCase().includes(searchText) ||
      patient.lastName.toLowerCase().includes(searchText) ||
      appointment.reason.toLowerCase().includes(searchText) ||
      appointment.room.toLowerCase().includes(searchText)
    );

    // Filtre par onglet
    let statusMatch = true;
    if (currentTab === 1) statusMatch = appointment.status === 'PLANIFIE';
    if (currentTab === 2) statusMatch = appointment.status === 'CONFIRME';
    if (currentTab === 3) statusMatch = appointment.status === 'TERMINE';
    if (currentTab === 4) statusMatch = appointment.status === 'ANNULE';

    return searchMatch && statusMatch;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IllustrationIcon name="calendar" size="large" color="#2196f3" />
          <Typography variant="h4" component="h1">
            Rendez-vous
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Nouveau Rendez-vous
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un rendez-vous..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Tous" />
            <Tab label="Planifiés" />
            <Tab label="Confirmés" />
            <Tab label="Terminés" />
            <Tab label="Annulés" />
          </Tabs>
        </CardContent>
      </Card>

      {/* Liste des rendez-vous */}
      <Grid container spacing={3}>
        {filteredAppointments.map((appointment) => (
          <Grid item xs={12} md={6} lg={4} key={appointment.id}>
            <AppointmentCard
              appointment={appointment}
              patient={mockPatients.find(p => p.id === appointment.patientId)}
              onEdit={handleEditAppointment}
              onDelete={handleDeleteAppointment}
            />
          </Grid>
        ))}
      </Grid>

      {/* Formulaire de rendez-vous */}
      <AppointmentForm
        open={formOpen}
        onClose={handleFormClose}
        appointment={selectedAppointment}
        onSubmit={handleFormSubmit}
        patients={mockPatients}
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments; 