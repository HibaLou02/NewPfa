import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Switch,
  FormGroup,
  FormControlLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Divider,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Today as TodayIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    desktopNotifications: true,
    reminderNotifications: true,

    // Apparence
    theme: 'light',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',

    // Calendrier
    defaultView: 'week',
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
    slotDuration: 30,

    // Sécurité
    twoFactorAuth: false,
    sessionTimeout: 30,
    lastPasswordChange: new Date().toISOString().split('T')[0],
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (section, setting) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };

  const handleSwitchChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const handleSimpleChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.value
    }));
  };

  const TabPanel = ({ children, value, index }) => (
    <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
      {value === index && children}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Paramètres
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<PaletteIcon />} label="Apparence" />
            <Tab icon={<TodayIcon />} label="Calendrier" />
            <Tab icon={<SecurityIcon />} label="Sécurité" />
          </Tabs>
        </Box>

        {/* Section Notifications */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleSwitchChange('emailNotifications')}
                />
              }
              label="Notifications par email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.smsNotifications}
                  onChange={handleSwitchChange('smsNotifications')}
                />
              }
              label="Notifications par SMS"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.desktopNotifications}
                  onChange={handleSwitchChange('desktopNotifications')}
                />
              }
              label="Notifications bureau"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.reminderNotifications}
                  onChange={handleSwitchChange('reminderNotifications')}
                />
              }
              label="Rappels"
            />
          </FormGroup>
        </TabPanel>

        {/* Section Apparence */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Apparence
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Thème</InputLabel>
                <Select
                  value={settings.theme}
                  onChange={handleSimpleChange('theme')}
                  label="Thème"
                >
                  <MenuItem value="light">Clair</MenuItem>
                  <MenuItem value="dark">Sombre</MenuItem>
                  <MenuItem value="system">Système</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Langue</InputLabel>
                <Select
                  value={settings.language}
                  onChange={handleSimpleChange('language')}
                  label="Langue"
                >
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Format de date</InputLabel>
                <Select
                  value={settings.dateFormat}
                  onChange={handleSimpleChange('dateFormat')}
                  label="Format de date"
                >
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Format de l'heure</InputLabel>
                <Select
                  value={settings.timeFormat}
                  onChange={handleSimpleChange('timeFormat')}
                  label="Format de l'heure"
                >
                  <MenuItem value="24h">24h</MenuItem>
                  <MenuItem value="12h">12h</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Section Calendrier */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Calendrier
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Vue par défaut</InputLabel>
                <Select
                  value={settings.defaultView}
                  onChange={handleSimpleChange('defaultView')}
                  label="Vue par défaut"
                >
                  <MenuItem value="day">Jour</MenuItem>
                  <MenuItem value="week">Semaine</MenuItem>
                  <MenuItem value="month">Mois</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Durée des créneaux</InputLabel>
                <Select
                  value={settings.slotDuration}
                  onChange={handleSimpleChange('slotDuration')}
                  label="Durée des créneaux"
                >
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={60}>1 heure</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Début des horaires de travail"
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  workingHours: {
                    ...prev.workingHours,
                    start: e.target.value
                  }
                }))}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fin des horaires de travail"
                type="time"
                value={settings.workingHours.end}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  workingHours: {
                    ...prev.workingHours,
                    end: e.target.value
                  }
                }))}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Section Sécurité */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Sécurité
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={handleSwitchChange('twoFactorAuth')}
                  />
                }
                label="Authentification à deux facteurs"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Expiration de session</InputLabel>
                <Select
                  value={settings.sessionTimeout}
                  onChange={handleSimpleChange('sessionTimeout')}
                  label="Expiration de session"
                >
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={60}>1 heure</MenuItem>
                  <MenuItem value={120}>2 heures</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Dernier changement de mot de passe : {settings.lastPasswordChange}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {/* Implémenter la logique de changement de mot de passe */}}
              >
                Changer le mot de passe
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="secondary">
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // Implémenter la logique de sauvegarde
              console.log('Settings saved:', settings);
            }}
          >
            Enregistrer les modifications
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings; 