import axios from 'axios';

const API_URL = '/api/diagnostic';

class DiagnosticService {
  // Créer de nouvelles données diagnostiques
  async createDiagnosticData(diagnosticData) {
    try {
      const response = await axios.post(API_URL, diagnosticData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Récupérer les données diagnostiques d'un patient
  async getPatientDiagnosticData(patientId, filters = {}) {
    try {
      const params = new URLSearchParams({
        ...filters,
        patientId
      });
      const response = await axios.get(`${API_URL}/patient/${patientId}?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mettre à jour des données diagnostiques
  async updateDiagnosticData(id, updates) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updates);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Supprimer des données diagnostiques
  async deleteDiagnosticData(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir des statistiques sur les données diagnostiques
  async getDiagnosticStats(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/stats?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Gérer les erreurs de manière uniforme
  handleError(error) {
    if (error.response) {
      // Erreur du serveur avec réponse
      return {
        status: error.response.status,
        message: error.response.data.message || 'Une erreur est survenue',
        details: error.response.data
      };
    } else if (error.request) {
      // Erreur de réseau
      return {
        status: 0,
        message: 'Impossible de contacter le serveur',
        details: error.request
      };
    } else {
      // Autre type d'erreur
      return {
        status: 0,
        message: 'Une erreur est survenue',
        details: error.message
      };
    }
  }
}

export default new DiagnosticService(); 