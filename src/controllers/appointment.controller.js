const Appointment = require('../models/appointment.model');
const logger = require('../utils/logger');

// @desc    Obtenir tous les rendez-vous
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const {
      start,
      end,
      medecinId,
      patientId,
      statut,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Filtrer par période
    if (start || end) {
      query.dateHeure = {};
      if (start) query.dateHeure.$gte = new Date(start);
      if (end) query.dateHeure.$lte = new Date(end);
    }

    // Filtrer par médecin
    if (medecinId) {
      query.medecin = medecinId;
    }

    // Filtrer par patient
    if (patientId) {
      query.patient = patientId;
    }

    // Filtrer par statut
    if (statut) {
      query.statut = statut;
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { dateHeure: 1 },
      populate: [
        { path: 'patient', select: 'prenom nom telephone' },
        { path: 'medecin', select: 'prenom nom specialite' },
        { path: 'creePar', select: 'prenom nom' },
      ],
    };

    const appointments = await Appointment.paginate(query, options);

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des rendez-vous:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des rendez-vous',
      error: error.message,
    });
  }
};

// @desc    Obtenir un rendez-vous par ID
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'prenom nom telephone')
      .populate('medecin', 'prenom nom specialite')
      .populate('creePar', 'prenom nom');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Rendez-vous non trouvé',
      });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du rendez-vous:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du rendez-vous',
      error: error.message,
    });
  }
};

// @desc    Créer un nouveau rendez-vous
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    // Ajouter l'utilisateur qui crée le rendez-vous
    req.body.creePar = req.user.id;

    // Vérifier les conflits d'horaire
    const conflit = await Appointment.verifierConflit(
      req.body.medecin,
      req.body.dateHeure,
      req.body.duree
    );

    if (conflit) {
      return res.status(400).json({
        success: false,
        message: 'Il y a un conflit d\'horaire avec un autre rendez-vous',
      });
    }

    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    logger.error('Erreur lors de la création du rendez-vous:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du rendez-vous',
      error: error.message,
    });
  }
};

// @desc    Mettre à jour un rendez-vous
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Rendez-vous non trouvé',
      });
    }

    // Vérifier les conflits d'horaire si la date ou la durée change
    if (
      req.body.dateHeure !== appointment.dateHeure.toISOString() ||
      req.body.duree !== appointment.duree
    ) {
      const conflit = await Appointment.verifierConflit(
        req.body.medecin || appointment.medecin,
        req.body.dateHeure || appointment.dateHeure,
        req.body.duree || appointment.duree
      );

      if (conflit) {
        return res.status(400).json({
          success: false,
          message: 'Il y a un conflit d\'horaire avec un autre rendez-vous',
        });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: updatedAppointment,
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du rendez-vous:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du rendez-vous',
      error: error.message,
    });
  }
};

// @desc    Supprimer un rendez-vous
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Rendez-vous non trouvé',
      });
    }

    // Marquer comme annulé au lieu de supprimer
    appointment.statut = 'ANNULE';
    await appointment.save();

    res.json({
      success: true,
      data: {},
      message: 'Rendez-vous annulé avec succès',
    });
  } catch (error) {
    logger.error('Erreur lors de la suppression du rendez-vous:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du rendez-vous',
      error: error.message,
    });
  }
};

// @desc    Obtenir les statistiques des rendez-vous
// @route   GET /api/appointments/stats
// @access  Private
exports.getAppointmentStats = async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          planifies: {
            $sum: { $cond: [{ $eq: ['$statut', 'PLANIFIE'] }, 1, 0] },
          },
          confirmes: {
            $sum: { $cond: [{ $eq: ['$statut', 'CONFIRME'] }, 1, 0] },
          },
          termines: {
            $sum: { $cond: [{ $eq: ['$statut', 'TERMINE'] }, 1, 0] },
          },
          annules: {
            $sum: { $cond: [{ $eq: ['$statut', 'ANNULE'] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        total: 0,
        planifies: 0,
        confirmes: 0,
        termines: 0,
        annules: 0,
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