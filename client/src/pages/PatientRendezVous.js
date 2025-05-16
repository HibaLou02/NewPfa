import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import axios from 'axios';

const PatientRendezVous = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [medecins, setMedecins] = useState([]);
  const [mesRendezVous, setMesRendezVous] = useState([]);
  const [formData, setFormData] = useState({
    date: null,
    medecinId: '',
    motif: ''
  });

  useEffect(() => {
    fetchMedecins();
    fetchMesRendezVous();
  }, []);

  const fetchMedecins = async () => {
    try {
      const response = await axios.get('/api/users/medecins');
      setMedecins(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des médecins');
    }
  };

  const fetchMesRendezVous = async () => {
    try {
      const response = await axios.get('/api/rendez-vous/patient');
      setMesRendezVous(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération de vos rendez-vous');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('/api/rendez-vous/request', formData);
      setSuccess('Demande de rendez-vous envoyée avec succès');
      setFormData({
        date: null,
        medecinId: '',
        motif: ''
      });
      fetchMesRendezVous();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la demande de rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      en_attente: 'warning',
      confirme: 'success',
      annule: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      en_attente: 'En attente',
      confirme: 'Confirmé',
      annule: 'Annulé'
    };
    return labels[status] || status;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Formulaire de demande de rendez-vous */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Demander un rendez-vous
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Médecin"
                      value={formData.medecinId}
                      onChange={(e) => setFormData({
                        ...formData,
                        medecinId: e.target.value
                      })}
                      required
                    >
                      {medecins.map((medecin) => (
                        <MenuItem key={medecin._id} value={medecin._id}>
                          Dr. {medecin.prenom} {medecin.nom} - {medecin.specialite}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <DateTimePicker
                      label="Date et heure"
                      value={formData.date}
                      onChange={(newValue) => setFormData({
                        ...formData,
                        date: newValue
                      })}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth required />
                      )}
                      minDate={new Date()}
                      minutesStep={15}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Motif de la consultation"
                      multiline
                      rows={3}
                      value={formData.motif}
                      onChange={(e) => setFormData({
                        ...formData,
                        motif: e.target.value
                      })}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                    >
                      Demander le rendez-vous
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Liste des rendez-vous */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Mes rendez-vous
              </Typography>

              <List>
                {mesRendezVous.map((rdv) => (
                  <ListItem key={rdv._id} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1">
                            Dr. {rdv.medecin.prenom} {rdv.medecin.nom}
                          </Typography>
                          <Chip
                            label={getStatusLabel(rdv.status)}
                            color={getStatusColor(rdv.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">
                            {new Date(rdv.date).toLocaleString('fr-FR')}
                          </Typography>
                          {rdv.motif && (
                            <Typography variant="body2" color="text.secondary">
                              Motif : {rdv.motif}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}

                {mesRendezVous.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="Aucun rendez-vous"
                      secondary="Vous n'avez pas encore de rendez-vous programmé"
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default PatientRendezVous; 