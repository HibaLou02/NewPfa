import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser && authService.isAuthenticated()) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const userData = await authService.login({ email, password });
      setUser(userData);
      return userData;
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la mise à jour du profil';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors du changement de mot de passe';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: () => !!user
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Ne pas exporter le contexte directement
export { AuthContext }; 