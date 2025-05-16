import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import diagnosticService from '../services/diagnosticService';

const DiagnosticData = ({ patientId }) => {
  const [diagnosticData, setDiagnosticData] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedType, setSelectedType] = useState('VITAL_SIGNS');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadDiagnosticData();
    loadStats();
  }, [patientId, selectedType, dateRange]);

  const loadDiagnosticData = async () => {
    try {
      const data = await diagnosticService.getPatientDiagnosticData(patientId, {
        type: selectedType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      setDiagnosticData(data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Gérer l'erreur (afficher une notification, etc.)
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await diagnosticService.getDiagnosticStats({
        patientId,
        type: selectedType
      });
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleDateChange = (event) => {
    setDateRange({
      ...dateRange,
      [event.target.name]: event.target.value
    });
  };

  const renderVitalSigns = () => {
    if (selectedType !== 'VITAL_SIGNS') return null;

    return (
      <Paper elevation={3} sx={{ p: 2, my: 2 }}>
        <Typography variant="h6" gutterBottom>
          Signes Vitaux
        </Typography>
        <LineChart width={600} height={300} data={diagnosticData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="data.heartRate" name="Fréquence cardiaque" stroke="#8884d8" />
          <Line type="monotone" dataKey="data.bloodPressure.systolic" name="Tension systolique" stroke="#82ca9d" />
          <Line type="monotone" dataKey="data.bloodPressure.diastolic" name="Tension diastolique" stroke="#ffc658" />
        </LineChart>
      </Paper>
    );
  };

  const renderImagery = () => {
    if (selectedType !== 'IMAGERY') return null;

    return (
      <Paper elevation={3} sx={{ p: 2, my: 2 }}>
        <Typography variant="h6" gutterBottom>
          Imagerie Médicale
        </Typography>
        <Grid container spacing={2}>
          {diagnosticData.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={2} sx={{ p: 1 }}>
                <img
                  src={image.data.imageUrl}
                  alt={image.data.description}
                  style={{ width: '100%', height: 'auto' }}
                />
                <Typography variant="body2" color="textSecondary">
                  {image.data.description}
                </Typography>
                <Typography variant="caption" display="block">
                  {new Date(image.timestamp).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  const renderLabResults = () => {
    if (selectedType !== 'LAB_RESULTS') return null;

    return (
      <Paper elevation={3} sx={{ p: 2, my: 2 }}>
        <Typography variant="h6" gutterBottom>
          Résultats de Laboratoire
        </Typography>
        <Grid container spacing={2}>
          {diagnosticData.map((result, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  {result.data.testName}
                </Typography>
                <Typography variant="body2">
                  Résultat: {result.data.testResults}
                </Typography>
                <Typography variant="body2">
                  Plage normale: {result.data.normalRange}
                </Typography>
                <Typography variant="caption" display="block">
                  Date: {new Date(result.timestamp).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Données Diagnostiques
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Type de diagnostic</InputLabel>
              <Select
                value={selectedType}
                onChange={handleTypeChange}
                label="Type de diagnostic"
              >
                <MenuItem value="VITAL_SIGNS">Signes vitaux</MenuItem>
                <MenuItem value="IMAGERY">Imagerie</MenuItem>
                <MenuItem value="LAB_RESULTS">Résultats de laboratoire</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              name="startDate"
              label="Date de début"
              value={dateRange.startDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              name="endDate"
              label="Date de fin"
              value={dateRange.endDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Box>

      {renderVitalSigns()}
      {renderImagery()}
      {renderLabResults()}
    </Container>
  );
};

export default DiagnosticData; 