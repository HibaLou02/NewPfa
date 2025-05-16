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
  Autocomplete,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import IllustrationIcon from './IllustrationIcon';

const initialAppointment = {
  patientId: null,
  date: null,
  duration: 30,
  type: '',
  reason: '',
  notes: '',
  status: 'PLANIFIE',
  room: '',
  reminder: true,
};

const AppointmentForm = ({ 
  open, 
  onClose, 
  appointment = null, 
  onSubmit,
  patients = [], // Liste des patients pour l'autocomplétion
}) => {
  const [formData, setFormData] = useState(appointment || initialAppointment);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };

  const handlePatientChange = (event, newValue) => {
    setFormData({
      ...formData,
      patientId: newValue ? newValue.id : null,
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
          <IllustrationIcon name="calendar" size="medium" color="#2196f3" />
          <Typography variant="h6">
            {appointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Informations de base */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Informations du rendez-vous
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={patients}
                getOptionLabel={(patient) => `${patient.lastName} ${patient.firstName}`}
                onChange={handlePatientChange}
                value={patients.find(p => p.id === formData.patientId) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Patient"
                    required
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DateTimePicker
                  label="Date et heure"
                  value={formData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Durée (minutes)"
                value={formData.duration}
                onChange={handleChange('duration')}
                required
                inputProps={{ min: 15, step: 15 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type de rendez-vous</InputLabel>
                <Select
                  value={formData.type}
                  onChange={handleChange('type')}
                  label="Type de rendez-vous"
                >
                  <MenuItem value="CONSULTATION">Consultation</MenuItem>
                  <MenuItem value="SUIVI">Suivi</MenuItem>
                  <MenuItem value="URGENCE">Urgence</MenuItem>
                  <MenuItem value="EXAMEN">Examen</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange('status')}
                  label="Statut"
                >
                  <MenuItem value="PLANIFIE">Planifié</MenuItem>
                  <MenuItem value="CONFIRME">Confirmé</MenuItem>
                  <MenuItem value="EN_COURS">En cours</MenuItem>
                  <MenuItem value="TERMINE">Terminé</MenuItem>
                  <MenuItem value="ANNULE">Annulé</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salle"
                value={formData.room}
                onChange={handleChange('room')}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motif"
                value={formData.reason}
                onChange={handleChange('reason')}
                required
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={handleChange('notes')}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Rappel</InputLabel>
                <Select
                  value={formData.reminder}
                  onChange={handleChange('reminder')}
                  label="Rappel"
                >
                  <MenuItem value={true}>Oui</MenuItem>
                  <MenuItem value={false}>Non</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">
            {appointment ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AppointmentForm; 