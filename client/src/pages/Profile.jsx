import React, { useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

// Données de test
const mockUser = {
  id: 1,
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@example.com',
  phone: '0612345678',
  role: 'Médecin',
  speciality: 'Cardiologie',
  avatar: null,
  address: '123 Rue de la Médecine',
  city: 'Paris',
  postalCode: '75001',
  registrationNumber: 'MED123456',
  bio: 'Cardiologue expérimenté avec plus de 10 ans de pratique...',
};

const Profile = ({ userData: initialUserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [tempUserData, setTempUserData] = useState(initialUserData);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  const handleEditClick = () => {
    setTempUserData(userData);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTempUserData(userData);
    setIsEditing(false);
    setSelectedImage(null);
  };

  const handleSaveClick = async () => {
    try {
      // Ici, vous devriez implémenter la logique pour sauvegarder les modifications
      // vers votre backend, y compris le téléchargement de l'image si elle a été modifiée
      setUserData(tempUserData);
      setIsEditing(false);
      setSelectedImage(null);
      setSnackbar({
        open: true,
        message: 'Profil mis à jour avec succès',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la mise à jour du profil',
        severity: 'error',
      });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setTempUserData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTempUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Colonne de gauche - Photo de profil et informations de base */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={isEditing ? selectedImage || tempUserData.avatar : userData.avatar}
                sx={{
                  width: 200,
                  height: 200,
                  mb: 2,
                  border: '3px solid',
                  borderColor: 'primary.main',
                }}
              />
              {isEditing && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: 0,
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="photo-upload">
                    <IconButton
                      color="primary"
                      component="span"
                      sx={{
                        backgroundColor: 'white',
                        '&:hover': { backgroundColor: 'grey.100' },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </label>
                </Box>
              )}
            </Box>

            <Typography variant="h5" gutterBottom>
              {isEditing ? (
                <TextField
                  name="firstName"
                  value={tempUserData.firstName}
                  onChange={handleInputChange}
                  variant="standard"
                />
              ) : (
                userData.firstName
              )}
            </Typography>

            <Typography color="textSecondary" gutterBottom>
              {isEditing ? (
                <TextField
                  name="lastName"
                  value={tempUserData.lastName}
                  onChange={handleInputChange}
                  variant="standard"
                />
              ) : (
                userData.lastName
              )}
            </Typography>

            {!isEditing ? (
              <Button
                startIcon={<EditIcon />}
                onClick={handleEditClick}
                variant="contained"
                sx={{ mt: 2 }}
              >
                Modifier le profil
              </Button>
            ) : (
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                  variant="contained"
                  color="primary"
                >
                  Enregistrer
                </Button>
                <Button
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  variant="outlined"
                  color="secondary"
                >
                  Annuler
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Colonne de droite - Informations détaillées */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations Personnelles
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  name="firstName"
                  value={isEditing ? tempUserData.firstName : userData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="lastName"
                  value={isEditing ? tempUserData.lastName : userData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={isEditing ? tempUserData.email : userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  name="phone"
                  value={isEditing ? tempUserData.phone : userData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Informations Professionnelles
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rôle"
                  name="role"
                  value={isEditing ? tempUserData.role : userData.role}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Spécialité"
                  name="speciality"
                  value={isEditing ? tempUserData.speciality : userData.speciality}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Numéro d'inscription"
                  name="registrationNumber"
                  value={isEditing ? tempUserData.registrationNumber : userData.registrationNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  value={isEditing ? tempUserData.bio : userData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 