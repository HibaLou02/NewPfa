const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  heure: {
    type: String,
    required: true
  },
  motif: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirme', 'annule', 'termine'],
    default: 'en_attente'
  },
  notes: {
    type: String
  },
  duree: {
    type: Number,
    default: 30 // durée en minutes
  },
  creePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
rendezVousSchema.index({ date: 1, medecin: 1 });
rendezVousSchema.index({ patient: 1, date: 1 });

const RendezVous = mongoose.model('RendezVous', rendezVousSchema);

module.exports = RendezVous; 