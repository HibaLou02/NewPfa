import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { fr } from 'date-fns/locale';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import FilterListIcon from '@mui/icons-material/FilterList';

const reportTypes = [
  { value: 'consultation', label: 'Rapport de Consultation' },
  { value: 'treatment', label: 'Suivi de Traitement' },
  { value: 'patient', label: 'Dossier Patient' },
  { value: 'stats', label: 'Statistiques Médicales' },
];

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Mock data for demonstration
  const recentReports = [
    {
      id: 1,
      title: 'Rapport Mensuel - Consultations',
      date: '2024-03-01',
      type: 'consultation',
      status: 'Généré',
    },
    {
      id: 2,
      title: 'Statistiques Trimestrielles',
      date: '2024-02-28',
      type: 'stats',
      status: 'En attente',
    },
    // Add more mock reports as needed
  ];

  const handleGenerateReport = () => {
    // Logique de génération de rapport à implémenter
    console.log('Generating report:', { selectedReport, startDate, endDate });
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6">
        Gestion des Rapports
      </Typography>

      {/* Filtres et recherche */}
      <Box className="mb-8 p-4 bg-gray-50 rounded-lg">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Type de Rapport"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              {reportTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
              <DatePicker
                label="Date de début"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
              <DatePicker
                label="Date de fin"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleGenerateReport}
              startIcon={<FilterListIcon />}
            >
              Générer le Rapport
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Liste des rapports récents */}
      <Typography variant="h6" className="mb-4">
        Rapports Récents
      </Typography>
      <Grid container spacing={3}>
        {recentReports.map((report) => (
          <Grid item xs={12} md={6} key={report.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {report.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Date: {report.date}
                </Typography>
                <Typography color="textSecondary">
                  Type: {reportTypes.find((t) => t.value === report.type)?.label}
                </Typography>
                <Typography color="textSecondary">
                  Status: {report.status}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" title="Télécharger">
                  <DownloadIcon />
                </IconButton>
                <IconButton color="primary" title="Imprimer">
                  <PrintIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Reports; 