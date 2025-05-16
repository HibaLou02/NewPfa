import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  Room as RoomIcon,
  Description as DescriptionIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const getStatusColor = (status) => {
  switch (status) {
    case 'PLANIFIE':
      return 'info';
    case 'CONFIRME':
      return 'success';
    case 'EN_COURS':
      return 'warning';
    case 'TERMINE':
      return 'default';
    case 'ANNULE':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'PLANIFIE':
      return 'Planifié';
    case 'CONFIRME':
      return 'Confirmé';
    case 'EN_COURS':
      return 'En cours';
    case 'TERMINE':
      return 'Terminé';
    case 'ANNULE':
      return 'Annulé';
    default:
      return status;
  }
};

const getTypeLabel = (type) => {
  switch (type) {
    case 'CONSULTATION':
      return 'Consultation';
    case 'SUIVI':
      return 'Suivi';
    case 'URGENCE':
      return 'Urgence';
    case 'EXAMEN':
      return 'Examen';
    default:
      return type;
  }
};

const AppointmentCard = ({ appointment, patient, onEdit, onDelete }) => {
  const {
    date,
    duration,
    type,
    reason,
    notes,
    status,
    room,
    reminder,
  } = appointment;

  // Safely parse the date
  const appointmentDate = date ? parseISO(date) : new Date();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* En-tête avec patient et statut */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
              fontSize: '1.5rem',
              mr: 2,
            }}
          >
            {patient?.firstName?.[0] || ''}{patient?.lastName?.[0] || ''}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {patient?.lastName} {patient?.firstName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip
                label={getStatusLabel(status)}
                color={getStatusColor(status)}
                size="small"
              />
              <Chip
                label={getTypeLabel(type)}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Informations du rendez-vous */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon color="action" fontSize="small" />
            <Box>
              <Typography variant="body2">
                {format(appointmentDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(appointmentDate, 'HH:mm')} - {duration} minutes
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RoomIcon color="action" fontSize="small" />
            <Typography variant="body2">
              Salle {room}
            </Typography>
          </Box>

          {reason && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <DescriptionIcon color="action" fontSize="small" />
              <Typography variant="body2">
                {reason}
              </Typography>
            </Box>
          )}

          {notes && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                fontStyle: 'italic',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {notes}
            </Typography>
          )}
        </Box>
      </CardContent>

      <Divider />

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'space-between' }}>
        {reminder && (
          <IconButton size="small" color="primary">
            <NotificationsActiveIcon />
          </IconButton>
        )}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onEdit(appointment)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(appointment)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default AppointmentCard; 