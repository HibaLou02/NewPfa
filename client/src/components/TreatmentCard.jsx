import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import IllustrationIcon from './IllustrationIcon';

const statusColors = {
  EN_COURS: 'info',
  TERMINE: 'success',
  EN_PAUSE: 'warning',
  ANNULE: 'error',
};

const statusLabels = {
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
  EN_PAUSE: 'En pause',
  ANNULE: 'Annulé',
};

const TreatmentCard = ({ treatment, onEdit, onDelete }) => {
  const {
    name,
    description,
    startDate,
    endDate,
    status,
    progress,
    medication,
    dosage,
    frequency,
    notes,
    sideEffects,
  } = treatment;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDurationText = () => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    if (!end) return `Depuis le ${formatDate(startDate)}`;
    return `Du ${formatDate(startDate)} au ${formatDate(endDate)}`;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <IllustrationIcon name="treatment" size="medium" color="#2196f3" />
          <Box sx={{ ml: 2, flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" gutterBottom>
                {name}
              </Typography>
              <Chip
                label={statusLabels[status]}
                color={statusColors[status]}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {description}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon fontSize="small" />
            {getDurationText()}
          </Typography>
        </Box>

        {progress !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progression
              </Typography>
              <Typography variant="body2" color="text.primary">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Posologie :
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {medication} - {dosage}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fréquence : {frequency}
          </Typography>
        </Box>

        {sideEffects && sideEffects.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Effets secondaires potentiels :
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {sideEffects.map((effect, index) => (
                <Chip
                  key={index}
                  label={effect}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {notes && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Notes :
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {notes}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 'auto' }}>
          <Tooltip title="Modifier">
            <IconButton size="small" onClick={() => onEdit(treatment)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton size="small" color="error" onClick={() => onDelete(treatment)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TreatmentCard; 