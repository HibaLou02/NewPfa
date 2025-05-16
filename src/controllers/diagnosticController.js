const DiagnosticData = require('../models/DiagnosticData');
const { validationResult } = require('express-validator');

// Créer une nouvelle entrée de données diagnostiques
exports.createDiagnosticData = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const diagnosticData = new DiagnosticData({
      patient: req.body.patientId,
      type: req.body.type,
      data: req.body.data,
      device: req.body.device,
      metadata: {
        capturedBy: req.user._id,
        location: req.body.location,
        notes: req.body.notes
      }
    });

    const savedData = await diagnosticData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création des données de diagnostic', error: error.message });
  }
};

// Récupérer les données diagnostiques d'un patient
exports.getPatientDiagnosticData = async (req, res) => {
  try {
    const { patientId, type, startDate, endDate } = req.query;
    
    const query = { patient: patientId };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const data = await DiagnosticData.find(query)
      .sort({ timestamp: -1 })
      .populate('patient', 'firstName lastName')
      .populate('metadata.capturedBy', 'firstName lastName role');

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données', error: error.message });
  }
};

// Mettre à jour les données diagnostiques
exports.updateDiagnosticData = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      data: req.body.data,
      'metadata.notes': req.body.notes
    };

    const updatedData = await DiagnosticData.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: 'Données non trouvées' });
    }

    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// Supprimer des données diagnostiques
exports.deleteDiagnosticData = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await DiagnosticData.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ message: 'Données non trouvées' });
    }

    res.json({ message: 'Données supprimées avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

// Obtenir des statistiques sur les données diagnostiques
exports.getDiagnosticStats = async (req, res) => {
  try {
    const { patientId, type, timeframe } = req.query;
    
    const matchStage = { patient: patientId };
    if (type) matchStage.type = type;

    const stats = await DiagnosticData.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            type: '$type',
            day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          count: { $sum: 1 },
          avgHeartRate: { $avg: '$data.heartRate' },
          avgSystolic: { $avg: '$data.bloodPressure.systolic' },
          avgDiastolic: { $avg: '$data.bloodPressure.diastolic' }
        }
      },
      { $sort: { '_id.day': -1 } }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques', error: error.message });
  }
}; 