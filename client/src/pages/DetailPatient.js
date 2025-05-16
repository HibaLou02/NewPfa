import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Données temporaires pour le développement
const MOCK_CONSULTATIONS = [
  {
    id: 1,
    date: "2024-03-15",
    motif: "Consultation de routine",
    diagnostic: "RAS",
    prescriptions: ["Paracétamol 1000mg", "Vitamine D"],
    medecin: "Dr. Martin"
  },
  {
    id: 2,
    date: "2024-02-01",
    motif: "Douleurs dorsales",
    diagnostic: "Lombalgie aiguë",
    prescriptions: ["Ibuprofène 400mg", "Myorelaxant"],
    medecin: "Dr. Martin"
  }
];

const MOCK_DOCUMENTS = [
  {
    id: 1,
    nom: "Radiographie Thorax",
    date: "2024-03-15",
    type: "Imagerie",
    format: "PDF"
  },
  {
    id: 2,
    nom: "Analyse Sanguine",
    date: "2024-02-01",
    type: "Biologie",
    format: "PDF"
  }
];

const DetailPatient = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('infos');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // TODO: Appeler l'API pour récupérer les données du patient
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
          status: "actif",
          consultations: MOCK_CONSULTATIONS,
          documents: MOCK_DOCUMENTS
        };
        
        setPatient(mockPatient);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading || !patient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const TabButton = ({ tab, label }) => (
    <button
      className={`px-4 py-2 font-medium text-sm rounded-lg ${
        activeTab === tab
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {patient.nom} {patient.prenom}
          </h1>
          <p className="mt-2 text-gray-600">
            Né(e) le {new Date(patient.dateNaissance).toLocaleDateString()} • {patient.sexe === 'M' ? 'Homme' : 'Femme'} • {patient.age} ans
          </p>
        </div>
        <Link
          to={`/dossiers-patients/${patient.id}/edit`}
          className="btn-primary"
        >
          Modifier le dossier
        </Link>
      </div>

      {/* Navigation par onglets */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <TabButton tab="infos" label="Informations générales" />
          <TabButton tab="consultations" label="Consultations" />
          <TabButton tab="documents" label="Documents" />
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="space-y-6">
        {activeTab === 'infos' && (
          <>
            {/* Informations personnelles */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="text-gray-900">{patient.adresse}</p>
                  <p className="text-gray-900">{patient.codePostal} {patient.ville}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="text-gray-900">{patient.telephone}</p>
                  <p className="text-gray-900">{patient.email}</p>
                </div>
              </div>
            </div>

            {/* Informations médicales */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Informations médicales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Numéro de sécurité sociale</p>
                  <p className="text-gray-900">{patient.numeroSecu}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Groupe sanguin</p>
                  <p className="text-gray-900">{patient.groupeSanguin}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Allergies</p>
                  <p className="text-gray-900">{patient.allergies || 'Aucune allergie connue'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Antécédents médicaux</p>
                  <p className="text-gray-900">{patient.antecedents || 'Aucun antécédent'}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'consultations' && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Historique des consultations</h2>
                <Link to={`/rendez-vous/nouveau?patient=${patient.id}`} className="btn-primary">
                  Nouvelle consultation
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {patient.consultations.map((consultation) => (
                <div key={consultation.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {consultation.motif}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(consultation.date).toLocaleDateString()} • {consultation.medecin}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Diagnostic</p>
                      <p className="mt-1">{consultation.diagnostic}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Prescriptions</p>
                      <ul className="mt-1 list-disc list-inside">
                        {consultation.prescriptions.map((prescription, index) => (
                          <li key={index} className="text-gray-700">{prescription}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Documents médicaux</h2>
                <button className="btn-primary">
                  Ajouter un document
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {patient.documents.map((document) => (
                <div key={document.id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {document.nom}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(document.date).toLocaleDateString()} • {document.type}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPatient; 