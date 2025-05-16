const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Vérifier si l'utilisateur est un patient
    if (req.user?.type === 'patient') {
      // Liste des routes autorisées pour les patients
      const patientAllowedRoutes = {
        'GET': [
          '/api/patient-auth/profile',
          '/api/rendez-vous/patient',
          '/api/documents/patient',
          '/api/traitements/patient'
        ],
        'POST': [
          '/api/rendez-vous/request'
        ]
      };

      // Vérifier si la route est autorisée pour les patients
      const isAllowedRoute = patientAllowedRoutes[req.method]?.some(route => 
        req.path.startsWith(route)
      );

      if (!isAllowedRoute) {
        return res.status(403).json({ 
          message: 'Accès non autorisé pour les patients' 
        });
      }

      // Vérifier que le patient accède uniquement à ses propres données
      const patientId = req.params.patientId || req.query.patientId || req.body.patientId;
      
      // Vérification spécifique pour les routes de traitement
      if (req.path.startsWith('/api/traitements/patient')) {
        const traitementPatientId = req.params.patientId || req.query.patientId;
        if (!traitementPatientId || traitementPatientId !== req.user.patientId) {
          return res.status(403).json({
            message: 'Vous ne pouvez accéder qu\'à vos propres traitements'
          });
        }
      }
      
      // Vérification générale pour toutes les autres routes
      if (patientId && patientId !== req.user.patientId) {
        return res.status(403).json({ 
          message: 'Vous ne pouvez accéder qu\'à vos propres données' 
        });
      }
    } else {
      // Pour le personnel médical, vérifier les rôles autorisés
      if (!allowedRoles.includes(req.user?.role)) {
        return res.status(403).json({ 
          message: 'Accès non autorisé' 
        });
      }
    }

    next();
  };
};

module.exports = checkRole; 