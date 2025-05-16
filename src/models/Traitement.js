const mongoose = require('mongoose');

const traitementSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medecin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  medicaments: [{
    nom: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequence: {
      type: String,
      required: true
    },
    duree: {
      type: Number, // en jours
      required: true
    },
    instructions: String
  }],
  diagnostic: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  statut: {
    type: String,
    enum: ['en_cours', 'termine', 'interrompu'],
    default: 'en_cours'
  },
  effetsSecondaires: [{
    description: String,
    dateSignalement: {
      type: Date,
      default: Date.now
    },
    gravite: {
      type: String,
      enum: ['leger', 'modere', 'severe'],
      required: true
    }
  }],
  suiviProgression: [{
    date: {
      type: Date,
      default: Date.now
    },
    observations: String,
    amelioration: {
      type: String,
      enum: ['aucune', 'legere', 'moderee', 'significative'],
      required: true
    }
  }]
}, {
  timestamps: true
});

// Index pour optimiser les recherches
traitementSchema.index({ patient: 1, dateDebut: -1 });
traitementSchema.index({ medecin: 1, dateDebut: -1 });
traitementSchema.index({ statut: 1 });

const Traitement = mongoose.model('Traitement', traitementSchema);

module.exports = Traitement; 