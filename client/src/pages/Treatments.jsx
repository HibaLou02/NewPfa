import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
} from '@mui/icons-material';

import IllustrationIcon from '../components/IllustrationIcon';
import TreatmentCard from '../components/TreatmentCard';
import TreatmentForm from '../components/TreatmentForm';
import StatsCard from '../components/StatsCard';

const mockTreatments = [
  {
    id: 1,
    name: 'Traitement Hypertension',
    description: 'Traitement pour réguler la tension artérielle',
    startDate: '2024-03-01',
    endDate: '2024-06-01',
    status: 'EN_COURS',
    progress: 45,
    medication: 'Amlodipine',
    dosage: '5mg',
    frequency: '1 comprimé par jour',
    notes: 'Prendre le matin à jeun',
    sideEffects: ['Maux de tête', 'Vertiges', 'Fatigue'],
  },
  {
    id: 2,
    name: 'Traitement Diabète',
    description: 'Contrôle glycémique',
    startDate: '2024-02-15',
    endDate: null,
    status: 'EN_COURS',
    progress: 75,
    medication: 'Metformine',
    dosage: '850mg',
    frequency: '2 comprimés par jour',
    notes: 'Prendre pendant les repas',
    sideEffects: ['Nausées', 'Troubles digestifs'],
  },
  {
    id: 3,
    name: 'Antibiothérapie',
    description: 'Traitement infection respiratoire',
    startDate: '2024-03-10',
    endDate: '2024-03-17',
    status: 'TERMINE',
    progress: 100,
    medication: 'Amoxicilline',
    dosage: '1000mg',
    frequency: '3 fois par jour',
    notes: 'Cure terminée avec succès',
    sideEffects: ['Diarrhée', 'Rash cutané'],
  },
];

const mockChartData = Array(7).fill().map((_, i) => ({
  name: `Jour ${i + 1}`,
  value: Math.floor(Math.random() * 100)
}));

const Treatments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [treatments, setTreatments] = useState(mockTreatments);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState(null);

  const handleEditTreatment = (treatment) => {
    setSelectedTreatment(treatment);
    setFormOpen(true);
  };

  const handleDeleteTreatment = (treatment) => {
    setTreatmentToDelete(treatment);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setTreatments(treatments.filter(t => t.id !== treatmentToDelete.id));
    setDeleteDialogOpen(false);
    setTreatmentToDelete(null);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleCloseMenus = () => {
    setFilterAnchorEl(null);
    setSortAnchorEl(null);
  };

  const handleFormSubmit = (formData) => {
    if (selectedTreatment) {
      // Modification
      setTreatments(treatments.map(t => 
        t.id === selectedTreatment.id ? { ...formData, id: t.id } : t
      ));
    } else {
      // Création
      setTreatments([
        ...treatments,
        {
          ...formData,
          id: Math.max(...treatments.map(t => t.id)) + 1,
        },
      ]);
    }
    setFormOpen(false);
    setSelectedTreatment(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedTreatment(null);
  };

  const filteredTreatments = treatments.filter(treatment => {
    // Filtre par recherche
    const searchMatch = treatment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      treatment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      treatment.medication.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtre par onglet
    let statusMatch = true;
    if (currentTab === 1) statusMatch = treatment.status === 'EN_COURS';
    if (currentTab === 2) statusMatch = treatment.status === 'TERMINE';
    if (currentTab === 3) statusMatch = treatment.status === 'EN_PAUSE';

    return searchMatch && statusMatch;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IllustrationIcon name="treatment" size="large" color="#2196f3" />
          <Typography variant="h4" component="h1">
            Traitements
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => setFormOpen(true)}
        >
          Nouveau Traitement
        </Button>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Traitements"
            value={treatments.length.toString()}
            change={8}
            changeType="increase"
            data={mockChartData}
            color="#2196f3"
            progress={85}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="En cours"
            value={treatments.filter(t => t.status === 'EN_COURS').length.toString()}
            change={12}
            changeType="increase"
            data={mockChartData}
            color="#26a69a"
            progress={90}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Terminés"
            value={treatments.filter(t => t.status === 'TERMINE').length.toString()}
            change={5}
            changeType="increase"
            data={mockChartData}
            color="#66bb6a"
            progress={100}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="En pause"
            value={treatments.filter(t => t.status === 'EN_PAUSE').length.toString()}
            change={-2}
            changeType="decrease"
            data={mockChartData}
            color="#ff9800"
            progress={45}
          />
        </Grid>
      </Grid>

      {/* Filtres et recherche */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un traitement..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <IconButton onClick={handleFilterClick}>
              <FilterListIcon />
            </IconButton>
            <IconButton onClick={handleSortClick}>
              <SortIcon />
            </IconButton>
          </Box>

          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Tous" />
            <Tab label="En cours" />
            <Tab label="Terminés" />
            <Tab label="En pause" />
          </Tabs>
        </CardContent>
      </Card>

      {/* Menus */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleCloseMenus}
      >
        <MenuItem onClick={handleCloseMenus}>Par statut</MenuItem>
        <MenuItem onClick={handleCloseMenus}>Par date</MenuItem>
        <MenuItem onClick={handleCloseMenus}>Par médicament</MenuItem>
      </Menu>

      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleCloseMenus}
      >
        <MenuItem onClick={handleCloseMenus}>Plus récents</MenuItem>
        <MenuItem onClick={handleCloseMenus}>Plus anciens</MenuItem>
        <MenuItem onClick={handleCloseMenus}>Alphabétique</MenuItem>
      </Menu>

      {/* Liste des traitements */}
      <Grid container spacing={3}>
        {filteredTreatments.map((treatment) => (
          <Grid item xs={12} md={6} lg={4} key={treatment.id}>
            <TreatmentCard
              treatment={treatment}
              onEdit={handleEditTreatment}
              onDelete={handleDeleteTreatment}
            />
          </Grid>
        ))}
      </Grid>

      {/* Formulaire de traitement */}
      <TreatmentForm
        open={formOpen}
        onClose={handleFormClose}
        treatment={selectedTreatment}
        onSubmit={handleFormSubmit}
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce traitement ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Treatments; 