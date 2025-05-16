const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Générer un token JWT pour le patient
const generateToken = (patientId) => {
  return jwt.sign(
    { patientId, type: 'patient' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Inscription d'un patient
exports.registerPatient = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      nom, 
      prenom, 
      dateNaissance, 
      sexe,  // Assurez-vous que le sexe est inclus
      telephone,
      adresse,
      numeroSecuriteSociale 
    } = req.body;

    // Vérifier si l'email existe déjà
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Un patient avec cet email existe déjà' });
    }

    // Validation du sexe
    if (!sexe || !['M', 'F'].includes(sexe)) {
      return res.status(400).json({ message: 'Le sexe doit être "M" ou "F"' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouveau patient
    const patient = new Patient({
      email,
      password: hashedPassword,
      nom,
      prenom,
      dateNaissance,
      sexe,  // Inclure le sexe dans la création
      telephone,
      adresse,
      numeroSecuriteSociale,
      hasPortalAccess: true
    });

    await patient.save();

    // Générer le token
    const token = generateToken(patient._id);

    res.status(201).json({
      patient: {
        id: patient._id,
        nom: patient.nom,
        prenom: patient.prenom,
        email: patient.email,
        sexe: patient.sexe
      },
      token
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Erreur de validation',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// Connexion d'un patient
exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si le patient existe
    const patient = await Patient.findOne({ email, hasPortalAccess: true }).select('+password');
    if (!patient) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, patient.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = generateToken(patient._id);

    res.json({
      patient: {
        id: patient._id,
        nom: patient.nom,
        prenom: patient.prenom,
        email: patient.email,
        sexe: patient.sexe
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer le profil du patient
exports.getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient.id).select('-password');
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 