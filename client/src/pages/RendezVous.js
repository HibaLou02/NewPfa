import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Données temporaires pour le développement
const MOCK_APPOINTMENTS = [
  {
    id: 1,
    patientId: 1,
    patientNom: "El Amrani",
    patientPrenom: "Youssef",
    date: "2024-03-20T09:00:00",
    duree: 30,
    motif: "Consultation de routine",
    status: "confirmé"
  },
  {
    id: 2,
    patientId: 2,
    patientNom: "Benali",
    patientPrenom: "Salma",
    date: "2024-03-20T10:00:00",
    duree: 45,
    motif: "Suivi traitement",
    status: "en_attente"
  }
];


const RendezVous = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('jour'); // 'jour' ou 'semaine'

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // TODO: Appeler l'API pour récupérer les rendez-vous
        setAppointments(MOCK_APPOINTMENTS);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmé':
        return 'bg-green-100 text-green-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 19; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Rendez-vous</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos rendez-vous et consultations
          </p>
        </div>
        <Link
          to="/rendez-vous/nouveau"
          className="btn-primary"
        >
          Nouveau rendez-vous
        </Link>
      </div>

      {/* Contrôles du calendrier */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                view === 'jour' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
              }`}
              onClick={() => setView('jour')}
            >
              Jour
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                view === 'semaine' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
              }`}
              onClick={() => setView('semaine')}
            >
              Semaine
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
            >
              ←
            </button>
            <span className="text-lg font-medium">
              {selectedDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </span>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Grille des rendez-vous */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-[100px_1fr] divide-x divide-gray-200">
          {/* Colonne des heures */}
          <div className="divide-y divide-gray-200">
            {generateTimeSlots().map((time, index) => (
              <div key={index} className="h-20 p-2 text-sm text-gray-500">
                {time}
              </div>
            ))}
          </div>

          {/* Colonne des rendez-vous */}
          <div className="relative divide-y divide-gray-200">
            {generateTimeSlots().map((time, index) => (
              <div key={index} className="h-20 relative">
                {appointments
                  .filter(apt => formatTime(apt.date) === time)
                  .map(appointment => (
                    <div
                      key={appointment.id}
                      className={`absolute left-0 right-0 mx-2 p-2 rounded-lg ${
                        getStatusColor(appointment.status)
                      }`}
                      style={{
                        top: '0.25rem',
                        minHeight: `${(appointment.duree / 30) * 5}rem`
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {appointment.patientNom} {appointment.patientPrenom}
                          </p>
                          <p className="text-sm">
                            {formatTime(appointment.date)} - {appointment.motif}
                          </p>
                        </div>
                        <Link
                          to={`/rendez-vous/${appointment.id}`}
                          className="text-sm font-medium hover:underline"
                        >
                          Détails
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RendezVous; 