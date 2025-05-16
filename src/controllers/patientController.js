const Patient = require('../models/Patient');

// Créer un nouveau patient
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({});
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un patient par son ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    res.json({ message: 'Patient supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rechercher des patients
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    const patients = await Patient.find({
      $or: [
        { nom: new RegExp(query, 'i') },
        { prenom: new RegExp(query, 'i') },
        { numeroSecuriteSociale: new RegExp(query, 'i') }
      ]
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un document médical
exports.addDocument = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    
    patient.documents.push(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 