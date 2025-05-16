const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Le patient est requis'],
  },
  medecin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le médecin est requis'],
  },
  dateDebut: {
    type: Date,
    required: [true, 'La date de début est requise'],
  },
  dateFin: {
    type: Date,
  },
  type: {
    type: String,
    enum: ['MEDICAMENT', 'PHYSIOTHERAPIE', 'CHIRURGIE', 'AUTRE'],
    required: [true, 'Le type de traitement est requis'],
  },
  nom: {
    type: String,
    required: [true, 'Le nom du traitement est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
  },
  posologie: {
    frequence: {
      type: String,
      trim: true,
    },
    dosage: {
      type: String,
      trim: true,
    },
    duree: {
      type: String,
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
    },
  },
  statut: {
    type: String,
    enum: ['EN_COURS', 'TERMINE', 'INTERROMPU', 'PLANIFIE'],
    default: 'PLANIFIE',
  },
  effetsSecondaires: [{
    type: String,
    trim: true,
  }],
  contrindications: [{
    type: String,
    trim: true,
  }],
  resultats: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  documents: [{
    nom: String,
    type: String,
    url: String,
    dateAjout: {
      type: Date,
      default: Date.now,
    },
  }],
  rappels: [{
    date: Date,
    message: String,
    envoye: {
      type: Boolean,
      default: false,
    },
  }],
  creePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index pour optimiser les recherches
treatmentSchema.index({ patient: 1, dateDebut: -1 });
treatmentSchema.index({ medecin: 1, dateDebut: -1 });
treatmentSchema.index({ statut: 1 });

// Méthode pour vérifier si le traitement est actif
treatmentSchema.methods.estActif = function() {
  const maintenant = new Date();
  return (
    this.statut === 'EN_COURS' &&
    maintenant >= this.dateDebut &&
    (!this.dateFin || maintenant <= this.dateFin)
  );
};

// Méthode pour calculer la durée du traitement en jours
treatmentSchema.methods.calculerDuree = function() {
  if (!this.dateFin) return null;
  
  const debut = new Date(this.dateDebut);
  const fin = new Date(this.dateFin);
  const diffTime = Math.abs(fin - debut);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const Treatment = mongoose.model('Treatment', treatmentSchema);

module.exports = Treatment; 