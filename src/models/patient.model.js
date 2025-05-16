const mongoose = require('mongoose');
const { SEXE, GROUPE_SANGUIN, TYPE_ANTECEDENT, REGEX } = require('./constants');

const patientSchema = new mongoose.Schema({
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    minlength: [2, 'Le prénom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères'],
  },
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères'],
  },
  dateNaissance: {
    type: Date,
    required: [true, 'La date de naissance est requise'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'La date de naissance ne peut pas être dans le futur',
    },
  },
  sexe: {
    type: String,
    enum: Object.values(SEXE),
    required: [true, 'Le sexe est requis'],
  },
  adresse: {
    rue: {
      type: String,
      trim: true,
      maxlength: [100, 'L\'adresse ne peut pas dépasser 100 caractères'],
    },
    ville: {
      type: String,
      trim: true,
      maxlength: [50, 'La ville ne peut pas dépasser 50 caractères'],
    },
    codePostal: {
      type: String,
      trim: true,
      match: [REGEX.CODE_POSTAL, 'Le code postal doit contenir 5 chiffres'],
    },
    pays: {
      type: String,
      default: 'Maroc',
      trim: true,
    },
  },
  telephone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    match: [REGEX.TELEPHONE, 'Le format du numéro de téléphone est invalide'],
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    unique: true,
    match: [REGEX.EMAIL, 'Veuillez fournir un email valide'],
  },
  groupeSanguin: {
    type: String,
    enum: GROUPE_SANGUIN,
  },
  allergies: [{
    type: String,
    trim: true,
    maxlength: [100, 'La description de l\'allergie ne peut pas dépasser 100 caractères'],
  }],
  antecedentsMedicaux: [{
    type: {
      type: String,
      enum: Object.values(TYPE_ANTECEDENT),
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    date: {
      type: Date,
      validate: {
        validator: function(date) {
          return date <= new Date();
        },
        message: 'La date de l\'antécédent ne peut pas être dans le futur',
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
    },
  }],
  medecinTraitant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le médecin traitant est requis'],
  },
  numeroAssurance: {
    type: String,
    trim: true,
    maxlength: [50, 'Le numéro d\'assurance ne peut pas dépasser 50 caractères'],
  },
  typeAssurance: {
    type: String,
    trim: true,
    maxlength: [50, 'Le type d\'assurance ne peut pas dépasser 50 caractères'],
  },
  contactUrgence: {
    nom: {
      type: String,
      trim: true,
      maxlength: [100, 'Le nom du contact d\'urgence ne peut pas dépasser 100 caractères'],
    },
    telephone: {
      type: String,
      match: [REGEX.TELEPHONE, 'Le format du numéro de téléphone d\'urgence est invalide'],
    },
    relation: {
      type: String,
      trim: true,
      maxlength: [50, 'La relation ne peut pas dépasser 50 caractères'],
    },
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Les notes ne peuvent pas dépasser 2000 caractères'],
  },
  actif: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Méthode pour obtenir l'âge
patientSchema.virtual('age').get(function() {
  if (!this.dateNaissance) return null;
  const today = new Date();
  const birthDate = new Date(this.dateNaissance);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Méthode pour obtenir le nom complet
patientSchema.virtual('nomComplet').get(function() {
  return `${this.prenom} ${this.nom}`;
});

// Middleware pour valider l'âge minimum
patientSchema.pre('save', function(next) {
  if (this.isModified('dateNaissance')) {
    const age = this.age;
    if (age < 0) {
      next(new Error('La date de naissance ne peut pas être dans le futur'));
    }
  }
  next();
});

// Index pour la recherche
patientSchema.index({ prenom: 'text', nom: 'text' });
patientSchema.index({ telephone: 1 }, { unique: true, sparse: true });
patientSchema.index({ email: 1 }, { unique: true, sparse: true });
patientSchema.index({ 'adresse.ville': 1 });
patientSchema.index({ medecinTraitant: 1 });
patientSchema.index({ actif: 1 });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient; 