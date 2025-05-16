import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  MenuItem
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fr } from 'date-fns/locale';

const PatientRegister = () => {
  const navigate = useNavigate();
  const { registerPatient } = useAuth();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: null,
    sexe: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    adresse: {
      rue: '',
      ville: '',
      codePostal: '',
      pays: 'Maroc'
    },
    numeroSecuriteSociale: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (formData.password !== formData.confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }
    
    if (formData.password.length < 8) {
      return setError('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (!formData.sexe) {
      return setError('Veuillez sélectionner votre sexe');
    }

    try {
      setError('');
      setLoading(true);
      
      // Préparer les données à envoyer
      const patientData = {
        ...formData,
        dateNaissance: formData.dateNaissance.toISOString(),
      };
      
      // Supprimer le champ confirmPassword avant l'envoi
      delete patientData.confirmPassword;
      
      await registerPatient(patientData);
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
      if (err.response?.data?.details) {
        setError(err.response.data.details.join('\n'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
      <Container component="main" maxWidth="md">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Inscription Patient
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Informations personnelles */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Prénom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de naissance"
                    value={formData.dateNaissance}
                    onChange={(newValue) => {
                      setFormData(prev => ({
                        ...prev,
                        dateNaissance: newValue
                      }));
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    required
                    fullWidth
                    label="Sexe"
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleChange}
                  >
                    <MenuItem value="M">Homme</MenuItem>
                    <MenuItem value="F">Femme</MenuItem>
                  </TextField>
                </Grid>

                {/* Contact */}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Téléphone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Adresse */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Rue"
                    name="adresse.rue"
                    value={formData.adresse.rue}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ville"
                    name="adresse.ville"
                    value={formData.adresse.ville}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Code postal"
                    name="adresse.codePostal"
                    value={formData.adresse.codePostal}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Sécurité sociale */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Numéro de sécurité sociale"
                    name="numeroSecuriteSociale"
                    value={formData.numeroSecuriteSociale}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Mot de passe */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Mot de passe"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    helperText="Minimum 8 caractères"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Confirmer le mot de passe"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                S'inscrire
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Déjà inscrit ?{' '}
                  <Link to="/patient/login" style={{ color: 'primary.main' }}>
                    Se connecter
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default PatientRegister; 