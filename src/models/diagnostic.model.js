const mongoose = require('mongoose');

const diagnosticSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Le patient est requis'],
  },
  type: {
    type: String,
    enum: ['VITAL_SIGNS', 'IMAGERY', 'LAB_RESULTS'],
    required: [true, 'Le type de diagnostic est requis'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'La date du diagnostic ne peut pas être dans le futur',
    },
  },
  data: {
    // Pour les signes vitaux
    heartRate: {
      type: Number,
      min: [0, 'Le rythme cardiaque ne peut pas être négatif'],
      max: [300, 'Le rythme cardiaque est trop élevé'],
    },
    bloodPressure: {
      systolic: {
        type: Number,
        min: [0, 'La pression systolique ne peut pas être négative'],
        max: [300, 'La pression systolique est trop élevée'],
      },
      diastolic: {
        type: Number,
        min: [0, 'La pression diastolique ne peut pas être négative'],
        max: [200, 'La pression diastolique est trop élevée'],
      },
    },
    temperature: {
      type: Number,
      min: [30, 'La température est trop basse'],
      max: [45, 'La température est trop élevée'],
    },
    oxygenSaturation: {
      type: Number,
      min: [0, 'La saturation en oxygène ne peut pas être négative'],
      max: [100, 'La saturation en oxygène ne peut pas dépasser 100%'],
    },
    respiratoryRate: {
      type: Number,
      min: [0, 'Le rythme respiratoire ne peut pas être négatif'],
      max: [100, 'Le rythme respiratoire est trop élevé'],
    },
    
    // Pour l'imagerie
    imageUrl: {
      type: String,
      trim: true,
    },
    imageType: {
      type: String,
      trim: true,
      enum: ['XRAY', 'MRI', 'CT', 'ULTRASOUND', 'OTHER'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
    },
    
    // Pour les résultats de laboratoire
    testName: {
      type: String,
      trim: true,
      maxlength: [100, 'Le nom du test ne peut pas dépasser 100 caractères'],
    },
    testResults: mongoose.Schema.Types.Mixed,
    normalRange: mongoose.Schema.Types.Mixed,
  },
  device: {
    id: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
  },
  metadata: {
    capturedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'utilisateur qui a capturé les données est requis'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'La localisation ne peut pas dépasser 100 caractères'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
    },
  },
}, {
  timestamps: true,
});

// Validation personnalisée pour la pression artérielle
diagnosticSchema.path('data.bloodPressure').validate(function(value) {
  if (value.systolic && value.diastolic) {
    return value.systolic > value.diastolic;
  }
  return true;
}, 'La pression systolique doit être supérieure à la pression diastolique');

// Index pour optimiser les recherches
diagnosticSchema.index({ patient: 1, timestamp: -1 });
diagnosticSchema.index({ type: 1, timestamp: -1 });
diagnosticSchema.index({ 'metadata.capturedBy': 1 });

const Diagnostic = mongoose.model('Diagnostic', diagnosticSchema);

module.exports = Diagnostic; 