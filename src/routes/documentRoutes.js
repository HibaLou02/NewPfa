const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const { upload } = require('../utils/fileUpload');
const documentController = require('../controllers/documentController');

// Routes protégées nécessitant une authentification
router.use(auth);

// Routes pour la gestion des documents
router.post('/patient/:patientId/documents',
  checkRole(['admin', 'medecin']),
  upload.single('document'),
  documentController.uploadDocument
);

router.get('/patient/:patientId/documents',
  checkRole(['admin', 'medecin', 'infirmier']),
  documentController.getDocuments
);

router.get('/patient/:patientId/documents/:documentId',
  checkRole(['admin', 'medecin', 'infirmier']),
  documentController.getDocument
);

router.put('/patient/:patientId/documents/:documentId',
  checkRole(['admin', 'medecin']),
  documentController.updateDocument
);

router.delete('/patient/:patientId/documents/:documentId',
  checkRole(['admin', 'medecin']),
  documentController.deleteDocument
);

module.exports = router; 