const Patient = require('../models/patient.model');
const logger = require('../utils/logger');

// @desc    Obtenir tous les patients
// @route   GET /api/patients
// @access  Private
exports.getPatients = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, medecinId } = req.query;
    const query = {};

    // Filtre par médecin traitant si spécifié
    if (medecinId) {
      query.medecinTraitant = medecinId;
    }

    // Recherche par nom ou prénom
    if (search) {
      query.$or = [
        { prenom: { $regex: search, $options: 'i' } },
        { nom: { $regex: search, $options: 'i' } },
      ];
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: {
        path: 'medecinTraitant',
        select: 'prenom nom specialite',
      },
    };

    const patients = await Patient.paginate(query, options);

    res.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des patients:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des patients',
      error: error.message,
    });
  }
};

// @desc    Obtenir un patient par ID
// @route   GET /api/patients/:id
// @access  Private
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('medecinTraitant', 'prenom nom specialite');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient non trouvé',
      });
    }

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du patient:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du patient',
      error: error.message,
    });
  }
};

// @desc    Créer un nouveau patient
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);

    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    logger.error('Erreur lors de la création du patient:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du patient',
      error: error.message,
    });
  }
};

// @desc    Mettre à jour un patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient non trouvé',
      });
    }

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du patient:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du patient',
      error: error.message,
    });
  }
};

// @desc    Supprimer un patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient non trouvé',
      });
    }

    // Soft delete - marquer comme inactif au lieu de supprimer
    patient.actif = false;
    await patient.save();

    res.json({
      success: true,
      data: {},
      message: 'Patient désactivé avec succès',
    });
  } catch (error) {
    logger.error('Erreur lors de la suppression du patient:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du patient',
      error: error.message,
    });
  }
};

// @desc    Ajouter un antécédent médical
// @route   POST /api/patients/:id/antecedents
// @access  Private
exports.addAntecedent = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient non trouvé',
      });
    }

    patient.antecedentsMedicaux.push(req.body);
    await patient.save();

    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    logger.error('Erreur lors de l\'ajout de l\'antécédent:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'antécédent',
      error: error.message,
    });
  }
};

// @desc    Obtenir les statistiques des patients
// @route   GET /api/patients/stats
// @access  Private
exports.getPatientStats = async (req, res) => {
  try {
    const stats = await Patient.aggregate([
      {
        $group: {
          _id: null,
          totalPatients: { $sum: 1 },
          patientsActifs: {
            $sum: { $cond: [{ $eq: ['$actif', true] }, 1, 0] },
          },
          hommes: {
            $sum: { $cond: [{ $eq: ['$sexe', 'M'] }, 1, 0] },
          },
          femmes: {
            $sum: { $cond: [{ $eq: ['$sexe', 'F'] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalPatients: 0,
        patientsActifs: 0,
        hommes: 0,
        femmes: 0,
      },
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message,
    });
  }
}; 