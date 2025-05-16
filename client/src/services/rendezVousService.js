import api from './api';

const rendezVousService = {
  getAllRendezVous: async () => {
    const response = await api.get('/rendez-vous');
    return response.data;
  },

  getRendezVousById: async (id) => {
    const response = await api.get(`/rendez-vous/${id}`);
    return response.data;
  },

  createRendezVous: async (rendezVousData) => {
    const response = await api.post('/rendez-vous', rendezVousData);
    return response.data;
  },

  updateRendezVous: async (id, rendezVousData) => {
    const response = await api.put(`/rendez-vous/${id}`, rendezVousData);
    return response.data;
  },

  deleteRendezVous: async (id) => {
    const response = await api.delete(`/rendez-vous/${id}`);
    return response.data;
  },

  getRendezVousByPatient: async (patientId) => {
    const response = await api.get(`/rendez-vous/patient/${patientId}`);
    return response.data;
  },

  getRendezVousByDate: async (date) => {
    const response = await api.get(`/rendez-vous/date/${date}`);
    return response.data;
  }
};

export default rendezVousService; 