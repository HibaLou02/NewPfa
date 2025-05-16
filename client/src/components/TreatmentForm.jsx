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
  Chip,
  IconButton,
  Typography,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import {
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import IllustrationIcon from './IllustrationIcon';

const initialTreatment = {
  name: '',
  description: '',
  startDate: null,
  endDate: null,
  status: 'EN_COURS',
  progress: 0,
  medication: '',
  dosage: '',
  frequency: '',
  notes: '',
  sideEffects: [],
};

const TreatmentForm = ({ open, onClose, treatment = null, onSubmit }) => {
  const [formData, setFormData] = useState(treatment || initialTreatment);
  const [newSideEffect, setNewSideEffect] = useState('');

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (field) => (date) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  const handleAddSideEffect = () => {
    if (newSideEffect.trim()) {
      setFormData({
        ...formData,
        sideEffects: [...formData.sideEffects, newSideEffect.trim()],
      });
      setNewSideEffect('');
    }
  };

  const handleDeleteSideEffect = (indexToDelete) => {
    setFormData({
      ...formData,
      sideEffects: formData.sideEffects.filter((_, index) => index !== indexToDelete),
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
          <IllustrationIcon name="treatment" size="medium" color="#2196f3" />
          <Typography variant="h6">
            {treatment ? 'Modifier le traitement' : 'Nouveau traitement'}
          </Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du traitement"
                value={formData.name}
                onChange={handleChange('name')}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DatePicker
                  label="Date de début"
                  value={formData.startDate}
                  onChange={handleDateChange('startDate')}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DatePicker
                  label="Date de fin (optionnelle)"
                  value={formData.endDate}
                  onChange={handleDateChange('endDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange('status')}
                  label="Statut"
                  required
                >
                  <MenuItem value="EN_COURS">En cours</MenuItem>
                  <MenuItem value="TERMINE">Terminé</MenuItem>
                  <MenuItem value="EN_PAUSE">En pause</MenuItem>
                  <MenuItem value="ANNULE">Annulé</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Progression (%)"
                value={formData.progress}
                onChange={handleChange('progress')}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Médicament"
                value={formData.medication}
                onChange={handleChange('medication')}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dosage"
                value={formData.dosage}
                onChange={handleChange('dosage')}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fréquence"
                value={formData.frequency}
                onChange={handleChange('frequency')}
                required
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

            <Grid item xs={12}>
              <Stack spacing={2}>
                <Typography variant="subtitle2">Effets secondaires potentiels</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={newSideEffect}
                    onChange={(e) => setNewSideEffect(e.target.value)}
                    placeholder="Ajouter un effet secondaire"
                  />
                  <IconButton onClick={handleAddSideEffect} color="primary">
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.sideEffects.map((effect, index) => (
                    <Chip
                      key={index}
                      label={effect}
                      onDelete={() => handleDeleteSideEffect(index)}
                      color="error"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">
            {treatment ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TreatmentForm; 