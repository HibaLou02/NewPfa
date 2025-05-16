import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  MedicalServices as MedicalIcon,
  Description as DocumentIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientData, setPatientData] = useState({
    prochainRdv: [],
    traitements: [],
    documents: [],
    notifications: []
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/patient-auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Pour le moment, on utilise des données fictives
        setPatientData({
          prochainRdv: [
            {
              id: 1,
              date: '2024-03-20',
              heure: '14:30',
              medecin: 'Dr. Mohammed Alami',
              type: 'Consultation'
            }
          ],
          traitements: [
            {
              id: 1,
              nom: 'Paracétamol',
              dosage: '1000mg',
              frequence: '3x par jour',
              dateDebut: '2024-03-15',
              dateFin: '2024-03-22'
            }
          ],
          documents: [
            {
              id: 1,
              nom: 'Résultats analyse sang',
              date: '2024-03-10',
              type: 'Analyse'
            }
          ],
          notifications: [
            {
              id: 1,
              message: 'Rappel: Prochain rendez-vous dans 2 jours',
              date: '2024-03-18',
              lu: false
            }
          ]
        });
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Bonjour, {currentUser.prenom}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Bienvenue dans votre espace patient
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Prochain rendez-vous */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Prochain rendez-vous</Typography>
              </Box>
              {patientData.prochainRdv.length > 0 ? (
                <List>
                  {patientData.prochainRdv.map((rdv) => (
                    <ListItem key={rdv.id}>
                      <ListItemText
                        primary={`${rdv.type} avec ${rdv.medecin}`}
                        secondary={`Le ${new Date(rdv.date).toLocaleDateString()} à ${rdv.heure}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Aucun rendez-vous programmé
                </Typography>
              )}
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                Prendre rendez-vous
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Traitements en cours */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MedicalIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Traitements en cours</Typography>
              </Box>
              {patientData.traitements.map((traitement) => (
                <Box key={traitement.id} mb={2}>
                  <Typography variant="subtitle1">{traitement.nom}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {traitement.dosage} - {traitement.frequence}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Du {new Date(traitement.dateDebut).toLocaleDateString()} 
                    au {new Date(traitement.dateFin).toLocaleDateString()}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Documents récents */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DocumentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Documents récents</Typography>
              </Box>
              <List>
                {patientData.documents.map((doc) => (
                  <ListItem key={doc.id}>
                    <ListItemText
                      primary={doc.nom}
                      secondary={new Date(doc.date).toLocaleDateString()}
                    />
                    <Chip label={doc.type} size="small" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <NotificationIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              <List>
                {patientData.notifications.map((notif) => (
                  <ListItem key={notif.id}>
                    <ListItemText
                      primary={notif.message}
                      secondary={new Date(notif.date).toLocaleDateString()}
                    />
                    {!notif.lu && (
                      <Chip label="Nouveau" color="primary" size="small" />
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard; 