import { auth } from '../config/api';

class AuthService {
  async login({ email, password }) {
    try {
      const response = await auth.login({ email, password });
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response.user;
      }
      throw new Error(response.message || 'Échec de la connexion');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Identifiants invalides');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Erreur de connexion au serveur');
      }
    }
  }

  async register(userData) {
    try {
      const response = await auth.register(userData);
      if (response.data.success) {
        const { token, ...user } = response.data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  async getProfile() {
    try {
      const response = await auth.getProfile();
      return response.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du profil');
    }
  }

  async updateProfile(data) {
    try {
      const response = await auth.updateProfile(data);
      if (response.data.success) {
        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await auth.changePassword({ currentPassword, newPassword });
      return response.data.success;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    }
  }
}

export default new AuthService(); 