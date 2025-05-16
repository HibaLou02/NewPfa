import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const PatientCard = ({
  patient,
  onEdit,
  onDelete,
  onAddAppointment,
  onViewHistory,
}) => {
  const {
    nom,
    prenom,
    dateNaissance,
    sexe,
    telephone,
    email,
    groupeSanguin,
    photoUrl,
  } = patient;

  const getAge = (dateNaissance) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getInitials = (nom, prenom) => {
    return `${prenom[0]}${nom[0]}`.toUpperCase();
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Avatar
            src={photoUrl}
            sx={{
              width: 56,
              height: 56,
              mr: 2,
              bgcolor: 'primary.main',
            }}
          >
            {!photoUrl && getInitials(nom, prenom)}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {prenom} {nom}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getAge(dateNaissance)} ans - {sexe === 'M' ? 'Homme' : sexe === 'F' ? 'Femme' : 'Autre'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          {groupeSanguin && (
            <Chip
              label={`Groupe ${groupeSanguin}`}
              color="error"
              size="small"
              sx={{ mr: 1 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {telephone && (
            <Typography variant="body2" color="text.secondary">
              📞 {telephone}
            </Typography>
          )}
          {email && (
            <Typography variant="body2" color="text.secondary">
              ✉️ {email}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          <Tooltip title="Modifier">
            <IconButton
              size="small"
              onClick={onEdit}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton
              size="small"
              onClick={onDelete}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title="Historique">
            <Button
              size="small"
              startIcon={<DescriptionIcon />}
              onClick={onViewHistory}
              sx={{ mr: 1 }}
            >
              Historique
            </Button>
          </Tooltip>
          <Tooltip title="Nouveau rendez-vous">
            <Button
              size="small"
              variant="contained"
              startIcon={<EventIcon />}
              onClick={onAddAppointment}
            >
              RDV
            </Button>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default PatientCard; 