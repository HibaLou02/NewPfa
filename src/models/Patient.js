const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  dateNaissance: {
    type: Date,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  numeroSecuriteSociale: {
    type: String,
    unique: true,
    sparse: true
  },
  actif: {
    type: Boolean,
    default: true
  },
  derniereConnexion: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
patientSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient; 