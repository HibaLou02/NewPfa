const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  dateHeure: {
    type: Date,
    required: [true, 'La date et l\'heure sont requises'],
  },
  duree: {
    type: Number,
    default: 30, // durée en minutes
    min: [15, 'La durée minimum est de 15 minutes'],
    max: [120, 'La durée maximum est de 120 minutes'],
  },
  type: {
    type: String,
    enum: ['CONSULTATION', 'SUIVI', 'URGENCE', 'AUTRE'],
    default: 'CONSULTATION',
  },
  motif: {
    type: String,
    required: [true, 'Le motif est requis'],
    trim: true,
  },
  statut: {
    type: String,
    enum: ['PLANIFIE', 'CONFIRME', 'EN_COURS', 'TERMINE', 'ANNULE'],
    default: 'PLANIFIE',
  },
  notes: {
    type: String,
    trim: true,
  },
  rappelEnvoye: {
    type: Boolean,
    default: false,
  },
  creePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index pour optimiser les recherches par date
appointmentSchema.index({ dateHeure: 1, medecin: 1 });
appointmentSchema.index({ dateHeure: 1, patient: 1 });

// Méthode pour vérifier les conflits d'horaire
appointmentSchema.statics.verifierConflit = async function(medecinId, dateHeure, duree) {
  const debutRdv = new Date(dateHeure);
  const finRdv = new Date(dateHeure);
  finRdv.setMinutes(finRdv.getMinutes() + duree);

  const conflit = await this.findOne({
    medecin: medecinId,
    statut: { $nin: ['ANNULE', 'TERMINE'] },
    $or: [
      {
        dateHeure: {
          $gte: debutRdv,
          $lt: finRdv,
        },
      },
      {
        $and: [
          { dateHeure: { $lte: debutRdv } },
          {
            $expr: {
              $gt: {
                $add: ['$dateHeure', { $multiply: ['$duree', 60000] }],
              },
              debutRdv,
            },
          },
        ],
      },
    ],
  });

  return conflit !== null;
};

// Middleware pour vérifier les conflits avant la sauvegarde
appointmentSchema.pre('save', async function(next) {
  if (this.isModified('dateHeure') || this.isModified('duree') || this.isModified('medecin')) {
    const conflit = await this.constructor.verifierConflit(
      this.medecin,
      this.dateHeure,
      this.duree
    );
    
    if (conflit) {
      next(new Error('Il y a un conflit d\'horaire avec un autre rendez-vous'));
    }
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 