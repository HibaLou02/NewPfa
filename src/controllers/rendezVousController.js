const RendezVous = require('../models/RendezVous');
const Patient = require('../models/Patient');
const User = require('../models/User');
const logger = require('../config/logger');

// Créer un nouveau rendez-vous
exports.createRendezVous = async (req, res) => {
  try {
    // Vérifier la disponibilité du médecin
    const existingRdv = await RendezVous.findOne({
      medecin: req.body.medecin,
      date: req.body.date,
      heure: req.body.heure,
      statut: { $ne: 'Annulé' }
    });

    if (existingRdv) {
      return res.status(400).json({ 
        message: 'Le médecin a déjà un rendez-vous à cette heure' 
      });
    }

    const rendezVous = new RendezVous(req.body);
    await rendezVous.save();

    // Populate les informations du patient et du médecin
    await rendezVous.populate('patient medecin');
    
    res.status(201).json(rendezVous);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer un rendez-vous par son ID
exports.getRendezVousById = async (req, res) => {
  try {
    const rendezVous = await RendezVous.findById(req.params.id)
      .populate('patient', 'nom prenom telephone')
      .populate('medecin', 'nom prenom specialite');

    if (!rendezVous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Si c'est un patient, vérifier qu'il accède à son propre rendez-vous
    if (req.user?.type === 'patient' && rendezVous.patient._id.toString() !== req.user.patientId) {
      return res.status(403).json({
        message: 'Vous ne pouvez accéder qu\'à vos propres rendez-vous'
      });
    }

    res.json(rendezVous);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les rendez-vous (alias de getAllRendezVous)
exports.getRendezVous = async (req, res) => {
  try {
    const { status, date, medecin } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) filter.date = new Date(date);
    if (medecin) filter.medecin = medecin;

    const rendezVous = await RendezVous.find(filter)
      .populate('patient', 'nom prenom telephone')
      .populate('medecin', 'nom prenom specialite')
      .sort({ date: 1 });

    res.json(rendezVous);
  } catch (error) {
    logger.error('Erreur lors de la récupération des rendez-vous:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des rendez-vous'
    });
  }
};

// Récupérer les rendez-vous d'un médecin
exports.getMedecinRendezVous = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { 
      medecin: req.params.medecinId 
    };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const rendezVous = await RendezVous.find(query)
      .populate('patient', 'nom prenom telephone')
      .sort({ date: 1, heure: 1 });

    res.json(rendezVous);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les rendez-vous d'un patient
exports.getPatientRendezVous = async (req, res) => {
  try {
    const patientId = req.patient.id;

    const rendezVous = await RendezVous.find({ patient: patientId })
      .populate('medecin', 'nom prenom specialite')
      .sort({ date: 1 });

    res.json(rendezVous);
  } catch (error) {
    logger.error('Erreur lors de la récupération des rendez-vous:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des rendez-vous'
    });
  }
};

// Mettre à jour un rendez-vous
exports.updateRendezVous = async (req, res) => {
  try {
    const rendezVous = await RendezVous.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('patient', 'nom prenom telephone')
    .populate('medecin', 'nom prenom specialite');

    if (!rendezVous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    res.json(rendezVous);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Annuler un rendez-vous
exports.cancelRendezVous = async (req, res) => {
  try {
    const rendezVous = await RendezVous.findByIdAndUpdate(
      req.params.id,
      { statut: 'Annulé' },
      { new: true }
    )
    .populate('patient', 'nom prenom telephone')
    .populate('medecin', 'nom prenom specialite');

    if (!rendezVous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    res.json(rendezVous);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Vérifier la disponibilité d'un médecin
exports.checkMedecinDisponibilite = async (req, res) => {
  try {
    const { date, heure } = req.query;
    const medecinId = req.params.medecinId;

    // Vérifier si le médecin existe et est actif
    const medecin = await User.findOne({ 
      _id: medecinId, 
      role: 'medecin',
      actif: true 
    });

    if (!medecin) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }

    // Vérifier les rendez-vous existants
    const rendezVousExistant = await RendezVous.findOne({
      medecin: medecinId,
      date: new Date(date),
      heure: heure,
      statut: { $ne: 'Annulé' }
    });

    res.json({ 
      disponible: !rendezVousExistant,
      medecin: {
        nom: medecin.nom,
        prenom: medecin.prenom,
        specialite: medecin.specialite
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Demande de rendez-vous par un patient
exports.requestRendezVous = async (req, res) => {
  try {
    const { date, motif, medecinId } = req.body;
    const patientId = req.patient.id;

    // Vérifier la disponibilité du médecin
    const existingRdv = await RendezVous.findOne({
      medecin: medecinId,
      date,
      status: { $ne: 'annule' }
    });

    if (existingRdv) {
      return res.status(400).json({
        message: 'Ce créneau n\'est pas disponible'
      });
    }

    // Créer la demande de rendez-vous
    const rendezVous = new RendezVous({
      patient: patientId,
      medecin: medecinId,
      date,
      motif,
      status: 'en_attente'
    });

    await rendezVous.save();

    res.status(201).json({
      message: 'Demande de rendez-vous envoyée avec succès',
      rendezVous
    });
  } catch (error) {
    logger.error('Erreur lors de la demande de rendez-vous:', error);
    res.status(500).json({
      message: 'Erreur lors de la demande de rendez-vous'
    });
  }
};

// Confirmer un rendez-vous
exports.confirmRendezVous = async (req, res) => {
  try {
    const rendezVous = await RendezVous.findById(req.params.id);
    
    if (!rendezVous) {
      return res.status(404).json({
        message: 'Rendez-vous non trouvé'
      });
    }

    rendezVous.status = 'confirme';
    await rendezVous.save();

    res.json({
      message: 'Rendez-vous confirmé avec succès',
      rendezVous
    });
  } catch (error) {
    logger.error('Erreur lors de la confirmation du rendez-vous:', error);
    res.status(500).json({
      message: 'Erreur lors de la confirmation du rendez-vous'
    });
  }
};

// Supprimer un rendez-vous
exports.deleteRendezVous = async (req, res) => {
  try {
    const rendezVous = await RendezVous.findByIdAndDelete(req.params.id);

    if (!rendezVous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    res.json({ message: 'Rendez-vous supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 