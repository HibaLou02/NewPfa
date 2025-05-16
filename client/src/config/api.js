import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  withCredentials: false // Changed to false since we're using token-based auth
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('Erreur de réponse:', error);

    // Network error
    if (!error.response) {
      throw {
        message: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.'
      };
    }
    
    // Authentication error
    if (error.response.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw {
        message: error.response.data?.message || 'Identifiants invalides'
      };
    }
    
    // Validation error
    if (error.response.status === 400) {
      throw {
        message: error.response.data?.message || 'Données invalides',
        errors: error.response.data?.errors
      };
    }

    // Server error
    if (error.response.status === 500) {
      throw {
        message: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.'
      };
    }
    
    // Other errors
    throw {
      message: error.response?.data?.message || error.message || 'Une erreur est survenue'
    };
  }
);

// Auth endpoints
export const auth = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response && response.token) {
        return response;
      }
      throw new Error('Format de réponse invalide');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (passwords) => api.post('/auth/change-password', passwords),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default api; 