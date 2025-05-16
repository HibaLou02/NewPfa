const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

exports.patientAuth = async (req, res, next) => {
  try {
    // Vérifier si le token est présent
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier que c'est bien un token patient
    if (decoded.type !== 'patient') {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Récupérer le patient
    const patient = await Patient.findOne({ 
      _id: decoded.patientId,
      hasPortalAccess: true 
    });

    if (!patient) {
      return res.status(401).json({ message: 'Patient non trouvé ou accès non autorisé' });
    }

    // Mettre à jour la dernière connexion
    patient.derniereConnexion = new Date();
    await patient.save();

    // Ajouter le patient à la requête
    req.patient = patient;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
}; 