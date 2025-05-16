import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

import IllustrationIcon from '../components/IllustrationIcon';
import StatsCard from '../components/StatsCard';
import PatientList from '../components/PatientList';
import PatientForm from '../components/PatientForm';
import PatientCard from '../components/PatientCard';

const mockChartData = Array(7).fill().map((_, i) => ({
  name: `Jour ${i + 1}`,
  value: Math.floor(Math.random() * 100)
}));

const mockPatients = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    dateOfBirth: new Date('1980-05-15'),
    gender: 'M',
    email: 'jean.dupont@email.com',
    phone: '0612345678',
    address: '123 Rue de Paris',
    city: 'Paris',
    postalCode: '75001',
    socialSecurityNumber: '180055512345678',
    bloodType: 'A+',
    allergies: 'Pénicilline',
    medicalHistory: 'Hypertension',
    emergencyContact: {
      name: 'Marie Dupont',
      relationship: 'Épouse',
      phone: '0687654321',
    },
  },
  // Ajoutez d'autres patients de test si nécessaire
];

const Patients = () => {
  const [patients, setPatients] = useState(mockPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setFormOpen(true);
  };

  const handleDeletePatient = (patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setPatients(patients.filter(p => p.id !== patientToDelete.id));
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  const handleFormSubmit = (formData) => {
    if (selectedPatient) {
      // Modification
      setPatients(patients.map(p => 
        p.id === selectedPatient.id ? { ...formData, id: p.id } : p
      ));
    } else {
      // Création
      setPatients([
        ...patients,
        {
          ...formData,
          id: Math.max(...patients.map(p => p.id)) + 1,
        },
      ]);
    }
    setFormOpen(false);
    setSelectedPatient(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter(patient => {
    const searchText = searchQuery.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(searchText) ||
      patient.lastName.toLowerCase().includes(searchText) ||
      patient.email.toLowerCase().includes(searchText) ||
      patient.phone.includes(searchText)
    );
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IllustrationIcon name="patient" size="large" color="#2196f3" />
          <Typography variant="h4" component="h1">
            Gestion des Patients
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Nouveau Patient
        </Button>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Total Patients"
            value="1,234"
            change={8}
            changeType="increase"
            data={mockChartData}
            color="#2196f3"
            progress={80}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Nouveaux Patients"
            value="48"
            change={12}
            changeType="increase"
            data={mockChartData}
            color="#26a69a"
            progress={65}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Consultations"
            value="856"
            change={-3}
            changeType="decrease"
            data={mockChartData}
            color="#ff9800"
            progress={75}
          />
        </Grid>
      </Grid>

      {/* Barre de recherche */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un patient par nom, prénom, téléphone..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </CardContent>
      </Card>

      {/* Liste des patients ou état vide */}
      {filteredPatients.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 8,
          }}
        >
          <IllustrationIcon name="empty" size="xlarge" color="#90caf9" />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Aucun résultat trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Essayez de modifier vos critères de recherche
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPatients.map((patient) => (
            <Grid item xs={12} md={6} lg={4} key={patient.id}>
              <PatientCard
                patient={patient}
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Formulaire patient */}
      <PatientForm
        open={formOpen}
        onClose={handleFormClose}
        patient={selectedPatient}
        onSubmit={handleFormSubmit}
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.
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

export default Patients; 