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
  Divider,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fr } from 'date-fns/locale';

const PatientForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: initialData.nom || '',
    prenom: initialData.prenom || '',
    dateNaissance: initialData.dateNaissance || null,
    sexe: initialData.sexe || '',
    adresse: initialData.adresse || '',
    telephone: initialData.telephone || '',
    email: initialData.email || '',
    
    // Informations médicales
    groupeSanguin: initialData.groupeSanguin || '',
    allergies: initialData.allergies || '',
    antecedents: initialData.antecedents || '',
    
    // Contact d'urgence
    contactUrgenceNom: initialData.contactUrgenceNom || '',
    contactUrgenceTelephone: initialData.contactUrgenceTelephone || '',
    contactUrgenceRelation: initialData.contactUrgenceRelation || '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dateNaissance: date
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Informations du Patient
        </Typography>
        
        <Grid container spacing={3}>
          {/* Informations personnelles */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>
              Informations Personnelles
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="nom"
              label="Nom"
              value={formData.nom}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="prenom"
              label="Prénom"
              value={formData.prenom}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <DatePicker
                label="Date de naissance"
                value={formData.dateNaissance}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sexe</InputLabel>
              <Select
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                label="Sexe"
              >
                <MenuItem value="M">Masculin</MenuItem>
                <MenuItem value="F">Féminin</MenuItem>
                <MenuItem value="A">Autre</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="adresse"
              label="Adresse"
              multiline
              rows={2}
              value={formData.adresse}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="telephone"
              label="Téléphone"
              value={formData.telephone}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Informations médicales */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>
              Informations Médicales
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Groupe Sanguin</InputLabel>
              <Select
                name="groupeSanguin"
                value={formData.groupeSanguin}
                onChange={handleChange}
                label="Groupe Sanguin"
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
              name="allergies"
              label="Allergies"
              multiline
              rows={2}
              value={formData.allergies}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="antecedents"
              label="Antécédents médicaux"
              multiline
              rows={3}
              value={formData.antecedents}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Contact d'urgence */}
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>
              Contact d'Urgence
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="contactUrgenceNom"
              label="Nom du contact"
              value={formData.contactUrgenceNom}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="contactUrgenceTelephone"
              label="Téléphone du contact"
              value={formData.contactUrgenceTelephone}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="contactUrgenceRelation"
              label="Relation avec le patient"
              value={formData.contactUrgenceRelation}
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

export default PatientForm; 