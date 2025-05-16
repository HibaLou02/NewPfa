import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusConfig = {
  planifie: {
    color: 'info',
    label: 'Planifié',
  },
  confirme: {
    color: 'success',
    label: 'Confirmé',
  },
  en_cours: {
    color: 'warning',
    label: 'En cours',
  },
  termine: {
    color: 'default',
    label: 'Terminé',
  },
  annule: {
    color: 'error',
    label: 'Annulé',
  },
};

const typeConfig = {
  consultation: {
    label: 'Consultation',
    color: 'primary',
  },
  suivi: {
    label: 'Suivi',
    color: 'info',
  },
  urgence: {
    label: 'Urgence',
    color: 'error',
  },
  examen: {
    label: 'Examen',
    color: 'warning',
  },
  operation: {
    label: 'Opération',
    color: 'secondary',
  },
};

const AppointmentCard = ({
  appointment,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
}) => {
  const {
    dateHeure,
    duree,
    type,
    statut,
    patient,
    notes,
  } = appointment;

  const formatDate = (date) => {
    return format(new Date(date), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr });
  };

  const getInitials = (nom, prenom) => {
    return `${prenom[0]}${nom[0]}`.toUpperCase();
  };

  const isModifiable = !['termine', 'annule'].includes(statut);

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
        borderLeft: 6,
        borderColor: `${typeConfig[type]?.color}.main`,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={patient.photoUrl}
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                bgcolor: 'primary.main',
              }}
            >
              {!patient.photoUrl && getInitials(patient.nom, patient.prenom)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">
                {patient.prenom} {patient.nom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {typeConfig[type]?.label}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={statusConfig[statut]?.label}
            color={statusConfig[statut]?.color}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(dateHeure)}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Durée : {duree} minutes
        </Typography>

        {notes && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2,
              p: 1,
              bgcolor: 'grey.50',
              borderRadius: 1,
              fontSize: '0.875rem',
            }}
          >
            {notes}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          {isModifiable && (
            <>
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
            </>
          )}
        </Box>
        <Box>
          {statut === 'planifie' && (
            <>
              <Tooltip title="Confirmer">
                <Button
                  size="small"
                  startIcon={<CheckCircleIcon />}
                  onClick={onConfirm}
                  color="success"
                  sx={{ mr: 1 }}
                >
                  Confirmer
                </Button>
              </Tooltip>
              <Tooltip title="Annuler">
                <Button
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={onCancel}
                  color="error"
                  variant="outlined"
                >
                  Annuler
                </Button>
              </Tooltip>
            </>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default AppointmentCard; 