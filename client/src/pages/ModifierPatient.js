import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientForm from '../components/PatientForm';

const ModifierPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // TODO: Appeler l'API pour récupérer les données du patient
        // Simulation d'un appel API
        const mockPatient = {
          id: 1,
          nom: "Dupont",
          prenom: "Jean",
          dateNaissance: "1985-04-12",
          sexe: "M",
          adresse: "123 rue de la Paix",
          codePostal: "75000",
          ville: "Paris",
          telephone: "0612345678",
          email: "jean.dupont@email.com",
          numeroSecu: "185047523456789",
          groupeSanguin: "A+",
          allergies: "Pénicilline",
          antecedents: "Hypertension",
          status: "actif"
        };
        
        setPatient(mockPatient);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération du patient:', error);
        setError("Impossible de charger les informations du patient");
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      // TODO: Appeler l'API pour mettre à jour le patient
      console.log('Mise à jour patient:', formData);
      
      // Rediriger vers la liste des patients
      navigate('/dossiers-patients');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du patient:', error);
      // TODO: Gérer l'erreur (afficher un message d'erreur)
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Modifier le dossier patient
        </h1>
        <p className="mt-2 text-gray-600">
          Modifiez les informations du patient ci-dessous.
        </p>
      </div>

      <PatientForm
        patient={patient}
        onSubmit={handleSubmit}
        isEditing={true}
      />
    </div>
  );
};

export default ModifierPatient; 