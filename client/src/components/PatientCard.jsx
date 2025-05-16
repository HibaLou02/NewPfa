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
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PatientCard = ({ patient, onEdit, onDelete }) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    email,
    phone,
    address,
    city,
    postalCode,
    bloodType,
    allergies,
  } = patient;

  const getGenderLabel = (gender) => {
    switch (gender) {
      case 'M':
        return 'Masculin';
      case 'F':
        return 'Féminin';
      case 'O':
        return 'Autre';
      default:
        return 'Non spécifié';
    }
  };

  const getAgeFromBirthDate = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

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
        {/* En-tête avec nom et actions */}
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
            {firstName[0]}{lastName[0]}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {lastName} {firstName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getAgeFromBirthDate(dateOfBirth)} ans - {getGenderLabel(gender)}
            </Typography>
          </Box>
        </Box>

        {/* Groupe sanguin et allergies */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {bloodType && (
            <Chip
              icon={<LocalHospitalIcon />}
              label={`Groupe ${bloodType}`}
              color="error"
              variant="outlined"
              size="small"
            />
          )}
          {allergies && (
            <Tooltip title={allergies}>
              <Chip
                label="Allergies"
                color="warning"
                variant="outlined"
                size="small"
              />
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Informations de contact */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CakeIcon color="action" fontSize="small" />
            <Typography variant="body2">
              {format(new Date(dateOfBirth), 'dd MMMM yyyy', { locale: fr })}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="action" fontSize="small" />
            <Typography variant="body2">{phone}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="action" fontSize="small" />
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {email}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <LocationIcon color="action" fontSize="small" />
            <Typography variant="body2">
              {address}
              <br />
              {postalCode} {city}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider />

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => onEdit(patient)}
          color="primary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(patient)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PatientCard; 