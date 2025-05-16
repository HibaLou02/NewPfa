import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import theme from './theme';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Treatments from './pages/Treatments';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

// Constantes pour les rôles
export const ROLES = {
  ADMIN: 'ADMIN',
  MEDECIN: 'MEDECIN',
  SECRETAIRE: 'SECRETAIRE',
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Routes protégées */}
              <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/treatments" element={<Treatments />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute requiredRoles={[ROLES.ADMIN, ROLES.MEDECIN]}>
                      <Settings />
                    </PrivateRoute>
                  }
                />
              </Route>

              {/* Route par défaut - redirige vers le dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
