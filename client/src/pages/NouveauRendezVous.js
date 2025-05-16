import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { fr } from 'date-fns/locale';

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

const NouveauRendezVous = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get('patient');

  const [formData, setFormData] = useState({
    patientId: patientIdFromUrl || '',
    medecinId: '',
    date: null,
    heure: null,
    duree: '30',
    motif: '',
    notes: '',
    status: 'en_attente'
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Appeler l'API pour récupérer la liste des patients et médecins
        setPatients(MOCK_PATIENTS);
        setDoctors(MOCK_DOCTORS);
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
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
  };

  const handleTimeChange = (newTime) => {
    setFormData(prev => ({
      ...prev,
      heure: newTime
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Appeler l'API pour créer le rendez-vous
      console.log('Nouveau rendez-vous:', formData);
      
      navigate('/rendez-vous');
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Nouveau Rendez-vous</h1>
        <p className="mt-2 text-gray-600">
          Planifiez un nouveau rendez-vous
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
              <label htmlFor="medecinId" className="label">Médecin</label>
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

          {/* Date et Heure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="label">Date</label>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
                <DatePicker
                  value={formData.date}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true, className: 'input' } }}
                  disablePast
                  format="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </div>
            <div>
              <label className="label">Heure</label>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
                <TimePicker
                  value={formData.heure}
                  onChange={handleTimeChange}
                  slotProps={{ textField: { fullWidth: true, className: 'input' } }}
                  ampm={false}
                  minutesStep={15}
                />
              </LocalizationProvider>
            </div>
            <div>
              <label htmlFor="duree" className="label">Durée (minutes)</label>
              <select
                id="duree"
                name="duree"
                value={formData.duree}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 heure</option>
              </select>
            </div>
          </div>

          {/* Motif et Notes */}
          <div className="space-y-6">
            <div>
              <label htmlFor="motif" className="label">Motif de la consultation</label>
              <input
                type="text"
                id="motif"
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                className="input"
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
                placeholder="Informations complémentaires..."
              />
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/rendez-vous')}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            Créer le rendez-vous
          </button>
        </div>
      </form>
    </div>
  );
};

export default NouveauRendezVous;
