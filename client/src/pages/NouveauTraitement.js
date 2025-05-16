import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Données temporaires pour le développement
const MOCK_PATIENTS = [
  {
    id: 1,
    nom: "El Amrani",
    prenom: "Youssef"
  },
  {
    id: 2,
    nom: "Benali",
    prenom: "Salma"
  }
];

const MOCK_DOCTORS = [
  {
    id: 1,
    nom: "Dr. Lahlou",
    specialite: "Médecin généraliste"
  },
  {
    id: 2,
    nom: "Dr. Aït Taleb",
    specialite: "Cardiologue"
  }
];

const MOCK_MEDICATIONS = [
  {
    id: 1,
    nom: "Amoxicilline",
    formes: ["comprimé", "gélule", "suspension"],
    dosages: ["500mg", "1000mg"]
  },
  {
    id: 2,
    nom: "Ibuprofène",
    formes: ["comprimé", "gélule"],
    dosages: ["200mg", "400mg"]
  }
];

const NouveauTraitement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('patient');

  const [formData, setFormData] = useState({
    patientId: patientIdFromUrl || '',
    medecinId: '',
    medicamentId: '',
    forme: '',
    posologie: '',
    frequence: '',
    duree: '',
    dateDebut: '',
    dateFin: '',
    instructions: '',
    notes: '',
    status: 'en_cours'
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedication, setSelectedMedication] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Appeler l'API pour récupérer les données
        setPatients(MOCK_PATIENTS);
        setDoctors(MOCK_DOCTORS);
        setMedications(MOCK_MEDICATIONS);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'medicamentId') {
      const medication = medications.find(m => m.id === parseInt(value));
      setSelectedMedication(medication);
      setFormData(prev => ({
        ...prev,
        forme: '',
        posologie: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Appeler l'API pour créer le traitement
      console.log('Nouveau traitement:', formData);
      
      navigate('/traitements');
    } catch (error) {
      console.error('Erreur lors de la création du traitement:', error);
    }
  };

  const calculateDateFin = () => {
    if (formData.dateDebut && formData.duree) {
      const debut = new Date(formData.dateDebut);
      const dureeJours = parseInt(formData.duree);
      const fin = new Date(debut);
      fin.setDate(fin.getDate() + dureeJours);
      return fin.toISOString().split('T')[0];
    }
    return '';
  };

  useEffect(() => {
    const dateFin = calculateDateFin();
    if (dateFin) {
      setFormData(prev => ({
        ...prev,
        dateFin
      }));
    }
  }, [formData.dateDebut, formData.duree]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nouveau traitement</h1>
        <p className="mt-2 text-gray-600">
          Prescrivez un nouveau traitement pour un patient
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          {/* Patient et Médecin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="patientId" className="label">Patient</label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.nom} {patient.prenom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="medecinId" className="label">Médecin prescripteur</label>
              <select
                id="medecinId"
                name="medecinId"
                value={formData.medecinId}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Sélectionner un médecin</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.nom} - {doctor.specialite}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Médicament et Posologie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="medicamentId" className="label">Médicament</label>
              <select
                id="medicamentId"
                name="medicamentId"
                value={formData.medicamentId}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Sélectionner un médicament</option>
                {medications.map(medication => (
                  <option key={medication.id} value={medication.id}>
                    {medication.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="forme" className="label">Forme</label>
              <select
                id="forme"
                name="forme"
                value={formData.forme}
                onChange={handleChange}
                className="input"
                required
                disabled={!selectedMedication}
              >
                <option value="">Sélectionner une forme</option>
                {selectedMedication?.formes.map((forme, index) => (
                  <option key={index} value={forme}>
                    {forme}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Posologie et Fréquence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="posologie" className="label">Posologie</label>
              <select
                id="posologie"
                name="posologie"
                value={formData.posologie}
                onChange={handleChange}
                className="input"
                required
                disabled={!selectedMedication}
              >
                <option value="">Sélectionner un dosage</option>
                {selectedMedication?.dosages.map((dosage, index) => (
                  <option key={index} value={dosage}>
                    {dosage}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="frequence" className="label">Fréquence</label>
              <input
                type="text"
                id="frequence"
                name="frequence"
                value={formData.frequence}
                onChange={handleChange}
                className="input"
                placeholder="Ex: 3 fois par jour"
                required
              />
            </div>
          </div>

          {/* Durée et Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="dateDebut" className="label">Date de début</label>
              <input
                type="date"
                id="dateDebut"
                name="dateDebut"
                value={formData.dateDebut}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="duree" className="label">Durée (jours)</label>
              <input
                type="number"
                id="duree"
                name="duree"
                value={formData.duree}
                onChange={handleChange}
                className="input"
                min="1"
                required
              />
            </div>
            <div>
              <label htmlFor="dateFin" className="label">Date de fin</label>
              <input
                type="date"
                id="dateFin"
                name="dateFin"
                value={formData.dateFin}
                className="input bg-gray-50"
                disabled
              />
            </div>
          </div>

          {/* Instructions et Notes */}
          <div className="space-y-6">
            <div>
              <label htmlFor="instructions" className="label">Instructions de prise</label>
              <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                className="input h-24"
                placeholder="Ex: À prendre pendant les repas..."
                required
              />
            </div>
            <div>
              <label htmlFor="notes" className="label">Notes supplémentaires</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input h-24"
                placeholder="Notes ou observations supplémentaires..."
              />
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/traitements')}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            Créer le traitement
          </button>
        </div>
      </form>
    </div>
  );
};

export default NouveauTraitement; 