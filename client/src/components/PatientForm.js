import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientForm = ({ patient, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: '',
    adresse: '',
    codePostal: '',
    ville: '',
    telephone: '',
    email: '',
    numeroSecu: '',
    groupeSanguin: '',
    allergies: '',
    antecedents: '',
    status: 'actif'
  });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Informations personnelles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom et Prénom */}
          <div>
            <label htmlFor="nom" className="label">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="prenom" className="label">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Date de naissance et Sexe */}
          <div>
            <label htmlFor="dateNaissance" className="label">Date de naissance</label>
            <input
              type="date"
              id="dateNaissance"
              name="dateNaissance"
              value={formData.dateNaissance}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="sexe" className="label">Sexe</label>
            <select
              id="sexe"
              name="sexe"
              value={formData.sexe}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
              <option value="A">Autre</option>
            </select>
          </div>

          {/* Adresse */}
          <div className="md:col-span-2">
            <label htmlFor="adresse" className="label">Adresse</label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Code postal et Ville */}
          <div>
            <label htmlFor="codePostal" className="label">Code postal</label>
            <input
              type="text"
              id="codePostal"
              name="codePostal"
              value={formData.codePostal}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="ville" className="label">Ville</label>
            <input
              type="text"
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="telephone" className="label">Téléphone</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Informations médicales */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Informations médicales
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="numeroSecu" className="label">Numéro de sécurité sociale</label>
            <input
              type="text"
              id="numeroSecu"
              name="numeroSecu"
              value={formData.numeroSecu}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="groupeSanguin" className="label">Groupe sanguin</label>
            <select
              id="groupeSanguin"
              name="groupeSanguin"
              value={formData.groupeSanguin}
              onChange={handleChange}
              className="input"
            >
              <option value="">Sélectionner</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="allergies" className="label">Allergies</label>
            <textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="input h-24"
              placeholder="Liste des allergies..."
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="antecedents" className="label">Antécédents médicaux</label>
            <textarea
              id="antecedents"
              name="antecedents"
              value={formData.antecedents}
              onChange={handleChange}
              className="input h-24"
              placeholder="Antécédents médicaux importants..."
            />
          </div>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/dossiers-patients')}
          className="btn-secondary"
        >
          Annuler
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Mettre à jour' : 'Créer le dossier'}
        </button>
      </div>
    </form>
  );
};

export default PatientForm; 