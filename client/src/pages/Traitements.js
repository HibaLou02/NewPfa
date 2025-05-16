import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Données temporaires pour le développement
const MOCK_TREATMENTS = [
  {
    id: 1,
    patientId: 1,
    patientNom: "El Amrani",
    patientPrenom: "Youssef",
    medicament: "Amoxicilline",
    posologie: "1000mg",
    frequence: "3 fois par jour",
    duree: "7 jours",
    dateDebut: "2024-03-15",
    dateFin: "2024-03-22",
    status: "en_cours",
    medecin: "Dr. Lahlou",
    notes: "À prendre pendant les repas"
  },
  {
    id: 2,
    patientId: 2,
    patientNom: "Benali",
    patientPrenom: "Salma",
    medicament: "Ibuprofène",
    posologie: "400mg",
    frequence: "2 fois par jour",
    duree: "5 jours",
    dateDebut: "2024-03-10",
    dateFin: "2024-03-15",
    status: "termine",
    medecin: "Dr. Lahlou",
    notes: "En cas de douleur"
  }
];

const Traitements = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        // TODO: Appeler l'API pour récupérer les traitements
        setTreatments(MOCK_TREATMENTS);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_cours':
        return 'bg-green-100 text-green-800';
      case 'termine':
        return 'bg-gray-100 text-gray-800';
      case 'interrompu':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'en_cours':
        return 'En cours';
      case 'termine':
        return 'Terminé';
      case 'interrompu':
        return 'Interrompu';
      default:
        return status;
    }
  };

  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = (
      treatment.patientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.patientPrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.medicament.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesFilter = filterStatus === 'tous' || treatment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Traitements</h1>
          <p className="mt-2 text-gray-600">
            Gérez les traitements et prescriptions des patients
          </p>
        </div>
        <Link
          to="/traitements/nouveau"
          className="btn-primary"
        >
          Nouveau traitement
        </Link>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Rechercher un patient ou un médicament..."
              className="input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="tous">Tous les traitements</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminés</option>
            <option value="interrompu">Interrompus</option>
          </select>
        </div>
      </div>

      {/* Liste des traitements */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Traitement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTreatments.map((treatment) => (
                <tr key={treatment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {treatment.patientNom} {treatment.patientPrenom}
                        </div>
                        <div className="text-sm text-gray-500">
                          Prescrit par {treatment.medecin}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{treatment.medicament}</div>
                    <div className="text-sm text-gray-500">
                      {treatment.posologie} - {treatment.frequence}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Du {new Date(treatment.dateDebut).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Au {new Date(treatment.dateFin).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getStatusColor(treatment.status)
                    }`}>
                      {getStatusLabel(treatment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/traitements/${treatment.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Voir
                    </Link>
                    <Link
                      to={`/traitements/${treatment.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Traitements; 