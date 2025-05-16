const Appointment = require('../models/Appointment');
const { validationResult } = require('express-validator');

// Créer un nouveau rendez-vous
exports.createAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = new Appointment({
      ...req.body,
      createdBy: req.user._id
    });

    const savedAppointment = await appointment.save();
    
    // Populate les références
    await savedAppointment
      .populate('patient', 'firstName lastName')
      .populate('practitioner', 'firstName lastName role')
      .execPopulate();

    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du rendez-vous', error: error.message });
  }
};

// Récupérer les rendez-vous d'un patient
exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, startDate, endDate } = req.query;

    const query = { patient: patientId };
    if (status) query.status = status;
    if (startDate || endDate) {
      query.dateTime = {};
      if (startDate) query.dateTime.$gte = new Date(startDate);
      if (endDate) query.dateTime.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(query)
      .sort({ dateTime: 1 })
      .populate('patient', 'firstName lastName')
      .populate('practitioner', 'firstName lastName role')
      .populate('createdBy', 'firstName lastName');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error: error.message });
  }
};

// Récupérer les rendez-vous d'un praticien
exports.getPractitionerAppointments = async (req, res) => {
  try {
    const { practitionerId } = req.params;
    const { status, startDate, endDate } = req.query;

    const query = { practitioner: practitionerId };
    if (status) query.status = status;
    if (startDate || endDate) {
      query.dateTime = {};
      if (startDate) query.dateTime.$gte = new Date(startDate);
      if (endDate) query.dateTime.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(query)
      .sort({ dateTime: 1 })
      .populate('patient', 'firstName lastName')
      .populate('practitioner', 'firstName lastName role');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error: error.message });
  }
};

// Mettre à jour un rendez-vous
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
    .populate('patient', 'firstName lastName')
    .populate('practitioner', 'firstName lastName role');

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du rendez-vous', error: error.message });
  }
};

// Annuler un rendez-vous
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'ANNULE',
          'cancellation.cancelledBy': req.user._id,
          'cancellation.reason': reason,
          'cancellation.cancelledAt': new Date()
        }
      },
      { new: true, runValidators: true }
    )
    .populate('patient', 'firstName lastName')
    .populate('practitioner', 'firstName lastName role');

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'annulation du rendez-vous', error: error.message });
  }
};

// Vérifier la disponibilité d'un praticien
exports.checkPractitionerAvailability = async (req, res) => {
  try {
    const { practitionerId, date } = req.query;
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      practitioner: practitionerId,
      dateTime: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $ne: 'ANNULE' }
    }).select('dateTime duration');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vérification de la disponibilité', error: error.message });
  }
}; 