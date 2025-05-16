import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../components/PatientForm';

const NouveauPatient = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // TODO: Appeler l'API pour créer un nouveau patient
      console.log('Nouveau patient:', formData);
      
      // Rediriger vers la liste des patients
      navigate('/dossiers-patients');
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
      // TODO: Gérer l'erreur (afficher un message d'erreur)
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nouveau Patient</h1>
        <p className="mt-2 text-gray-600">
          Remplissez le formulaire ci-dessous pour créer un nouveau dossier patient.
        </p>
      </div>

      <PatientForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NouveauPatient; 