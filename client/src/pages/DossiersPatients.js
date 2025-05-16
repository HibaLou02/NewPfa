import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Données temporaires pour le développement
const MOCK_PATIENTS = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
    dateNaissance: "1985-04-12",
    telephone: "0612345678",
    email: "jean.dupont@email.com",
    dernierRdv: "2024-03-15",
    status: "actif"
  },
  // Ajoutez d'autres patients fictifs ici
];

const DossiersPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');

  const filteredPatients = MOCK_PATIENTS.filter(patient => {
    const matchesSearch = (
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesFilter = filterStatus === 'tous' || patient.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dossiers Patients</h1>
        <Link
          to="/dossiers-patients/nouveau"
          className="btn-primary flex items-center"
        >
          <span className="mr-2">+</span>
          Nouveau Patient
        </Link>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Rechercher un patient..."
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
            <option value="tous">Tous les patients</option>
            <option value="actif">Patients actifs</option>
            <option value="inactif">Patients inactifs</option>
          </select>
        </div>
      </div>

      {/* Liste des patients */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernier RDV
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
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {patient.nom} {patient.prenom}
                        </div>
                        <div className="text-sm text-gray-500">
                          Né(e) le {new Date(patient.dateNaissance).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.telephone}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(patient.dernierRdv).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === 'actif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/dossiers-patients/${patient.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Voir
                    </Link>
                    <Link
                      to={`/dossiers-patients/${patient.id}/edit`}
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

export default DossiersPatients; 