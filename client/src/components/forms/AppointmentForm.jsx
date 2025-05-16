import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { fr } from 'date-fns/locale';

const AppointmentForm = ({ onSubmit, patients = [], initialData = {} }) => {
  const [formData, setFormData] = useState({
    patient: initialData.patient || null,
    dateHeure: initialData.dateHeure || null,
    duree: initialData.duree || 30,
    type: initialData.type || '',
    statut: initialData.statut || 'planifie',
    notes: initialData.notes || '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (newValue) => {
    setFormData(prev => ({
      ...prev,
      dateHeure: newValue
    }));
  };

  const handlePatientChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      patient: newValue
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const typesRendezVous = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'suivi', label: 'Suivi' },
    { value: 'urgence', label: 'Urgence' },
    { value: 'examen', label: 'Examen' },
    { value: 'operation', label: 'Opération' },
  ];

  const statutsRendezVous = [
    { value: 'planifie', label: 'Planifié' },
    { value: 'confirme', label: 'Confirmé' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'termine', label: 'Terminé' },
    { value: 'annule', label: 'Annulé' },
  ];

  const durees = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 heure' },
    { value: 90, label: '1 heure 30' },
    { value: 120, label: '2 heures' },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Rendez-vous
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              value={formData.patient}
              onChange={handlePatientChange}
              options={patients}
              getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Patient"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <DateTimePicker
                label="Date et heure"
                value={formData.dateHeure}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField {...params} required fullWidth />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Durée</InputLabel>
              <Select
                name="duree"
                value={formData.duree}
                onChange={handleChange}
                label="Durée"
              >
                {durees.map((duree) => (
                  <MenuItem key={duree.value} value={duree.value}>
                    {duree.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Type de rendez-vous</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type de rendez-vous"
              >
                {typesRendezVous.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Statut</InputLabel>
              <Select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                label="Statut"
              >
                {statutsRendezVous.map((statut) => (
                  <MenuItem key={statut.value} value={statut.value}>
                    {statut.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="notes"
              label="Notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => window.history.back()}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Enregistrer
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AppointmentForm; 