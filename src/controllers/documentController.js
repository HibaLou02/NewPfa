const Patient = require('../models/Patient');
const { deleteFile } = require('../utils/fileUpload');
const path = require('path');

// Télécharger un document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      await deleteFile(req.file.path);
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    const document = {
      type: req.body.type,
      nom: req.body.nom || req.file.originalname,
      chemin: req.file.path,
      dateUpload: new Date()
    };

    patient.documents.push(document);
    await patient.save();

    res.status(201).json(document);
  } catch (error) {
    if (req.file) {
      await deleteFile(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les documents d'un patient
exports.getDocuments = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    res.json(patient.documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un document spécifique
exports.getDocument = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    const document = patient.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    res.download(document.chemin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un document
exports.deleteDocument = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    const document = patient.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Supprimer le fichier physique
    await deleteFile(document.chemin);

    // Supprimer la référence dans la base de données
    patient.documents.pull(document);
    await patient.save();

    res.json({ message: 'Document supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour les informations d'un document
exports.updateDocument = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    const document = patient.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Mise à jour des champs autorisés
    if (req.body.type) document.type = req.body.type;
    if (req.body.nom) document.nom = req.body.nom;

    await patient.save();
    res.json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 