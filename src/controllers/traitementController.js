const Traitement = require('../models/Traitement');
const Patient = require('../models/Patient');

// Créer un nouveau traitement
exports.createTraitement = async (req, res) => {
  try {
    const traitement = new Traitement({
      ...req.body,
      medecin: req.user._id // Utilise l'ID du médecin connecté
    });
    
    await traitement.save();
    
    // Populate les références
    await traitement.populate([
      { path: 'patient', select: 'nom prenom' },
      { path: 'medecin', select: 'nom prenom specialite' }
    ]);

    res.status(201).json(traitement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les traitements d'un patient
exports.getTraitementsPatient = async (req, res) => {
  try {
    let patientId;

    // Si c'est un patient qui accède à ses propres traitements
    if (req.user?.type === 'patient') {
      patientId = req.user.patientId;
    } 
    // Si c'est le personnel médical qui accède aux traitements d'un patient
    else {
      patientId = req.params.patientId;
      if (!patientId) {
        return res.status(400).json({
          message: 'ID du patient requis'
        });
      }
    }

    const traitements = await Traitement.find({ patient: patientId })
      .populate('medecin', 'nom prenom specialite')
      .sort({ createdAt: -1 });

    res.json(traitements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un traitement spécifique
exports.getTraitement = async (req, res) => {
  try {
    const traitement = await Traitement.findById(req.params.id)
      .populate('patient', 'nom prenom')
      .populate('medecin', 'nom prenom specialite');

    if (!traitement) {
      return res.status(404).json({ message: 'Traitement non trouvé' });
    }

    // Vérifier si l'utilisateur est un patient et accède à ses propres données
    if (req.user?.type === 'patient' && traitement.patient._id.toString() !== req.user.patientId) {
      return res.status(403).json({
        message: 'Vous ne pouvez accéder qu\'à vos propres traitements'
      });
    }

    res.json(traitement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un traitement
exports.updateTraitement = async (req, res) => {
  try {
    const traitement = await Traitement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('patient', 'nom prenom')
    .populate('medecin', 'nom prenom specialite');

    if (!traitement) {
      return res.status(404).json({ message: 'Traitement non trouvé' });
    }

    res.json(traitement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ajouter une prescription à un traitement
exports.ajouterPrescription = async (req, res) => {
  try {
    const traitement = await Traitement.findById(req.params.id);
    
    if (!traitement) {
      return res.status(404).json({ message: 'Traitement non trouvé' });
    }

    traitement.prescriptions.push(req.body);
    await traitement.save();

    res.json(traitement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ajouter un suivi de progression
exports.ajouterSuivi = async (req, res) => {
  try {
    const traitement = await Traitement.findById(req.params.id);
    
    if (!traitement) {
      return res.status(404).json({ message: 'Traitement non trouvé' });
    }

    traitement.suiviProgression.push({
      ...req.body,
      date: new Date()
    });
    
    await traitement.save();

    res.json(traitement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ajouter une alerte médicament
exports.ajouterAlerteMedicament = async (req, res) => {
  try {
    const traitement = await Traitement.findById(req.params.id);
    
    if (!traitement) {
      return res.status(404).json({ message: 'Traitement non trouvé' });
    }

    traitement.alertesMedicaments.push({
      ...req.body,
      dateAlerte: new Date()
    });
    
    await traitement.save();

    res.json(traitement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Terminer un traitement
exports.terminerTraitement = async (req, res) => {
  try {
    const traitement = await Traitement.findByIdAndUpdate(
      req.params.id,
      { 
        statut: 'Terminé',
        'suiviProgression.$[].effectue': true
      },
      { new: true }
    );

    if (!traitement) {
      return res.status(404).json({ message: 'Traitement non trouvé' });
    }

    res.json(traitement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir les statistiques de traitement pour un patient
exports.getStatistiquesPatient = async (req, res) => {
  try {
    const stats = await Traitement.aggregate([
      { $match: { patient: req.params.patientId } },
      { $group: {
        _id: '$statut',
        count: { $sum: 1 },
        prescriptionsMoyennes: { $avg: { $size: '$prescriptions' } }
      }}
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 