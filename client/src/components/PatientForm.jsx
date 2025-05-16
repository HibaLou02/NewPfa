import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import IllustrationIcon from './IllustrationIcon';

const initialPatient = {
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  gender: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  socialSecurityNumber: '',
  bloodType: '',
  allergies: '',
  medicalHistory: '',
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
  },
};

const PatientForm = ({ open, onClose, patient = null, onSubmit }) => {
  const [formData, setFormData] = useState(patient || initialPatient);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleEmergencyContactChange = (field) => (event) => {
    setFormData({
      ...formData,
      emergencyContact: {
        ...formData.emergencyContact,
        [field]: event.target.value,
      },
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dateOfBirth: date,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IllustrationIcon name="patient" size="medium" color="#2196f3" />
          <Typography variant="h6">
            {patient ? 'Modifier le patient' : 'Nouveau patient'}
          </Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Informations personnelles */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Informations personnelles
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DatePicker
                  label="Date de naissance"
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={handleChange('gender')}
                  label="Genre"
                >
                  <MenuItem value="M">Masculin</MenuItem>
                  <MenuItem value="F">Féminin</MenuItem>
                  <MenuItem value="O">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Coordonnées */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Coordonnées
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={formData.phone}
                onChange={handleChange('phone')}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                value={formData.address}
                onChange={handleChange('address')}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ville"
                value={formData.city}
                onChange={handleChange('city')}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code postal"
                value={formData.postalCode}
                onChange={handleChange('postalCode')}
                required
              />
            </Grid>

            {/* Informations médicales */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Informations médicales
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro de sécurité sociale"
                value={formData.socialSecurityNumber}
                onChange={handleChange('socialSecurityNumber')}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Groupe sanguin</InputLabel>
                <Select
                  value={formData.bloodType}
                  onChange={handleChange('bloodType')}
                  label="Groupe sanguin"
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Allergies"
                value={formData.allergies}
                onChange={handleChange('allergies')}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Antécédents médicaux"
                value={formData.medicalHistory}
                onChange={handleChange('medicalHistory')}
                multiline
                rows={3}
              />
            </Grid>

            {/* Contact d'urgence */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Contact d'urgence
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom du contact"
                value={formData.emergencyContact.name}
                onChange={handleEmergencyContactChange('name')}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lien de parenté"
                value={formData.emergencyContact.relationship}
                onChange={handleEmergencyContactChange('relationship')}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone du contact"
                value={formData.emergencyContact.phone}
                onChange={handleEmergencyContactChange('phone')}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">
            {patient ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PatientForm; 