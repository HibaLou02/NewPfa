const Joi = require('joi');
const mongoose = require('mongoose');

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
});

const rendezVousSchema = Joi.object({
  patient: objectId.required(),
  medecin: objectId.required(),
  date: Joi.date().required().min('now'),
  heure: Joi.string()
    .required()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  duree: Joi.number().integer().min(15).max(180).default(30),
  type: Joi.string()
    .required()
    .valid('Consultation', 'Suivi', 'Urgence', 'Diagnostic'),
  motif: Joi.string().required().min(3).max(500),
  statut: Joi.string()
    .valid('Planifié', 'Confirmé', 'Annulé', 'Terminé')
    .default('Planifié'),
  notes: Joi.string().max(1000)
});

const updateRendezVousSchema = rendezVousSchema.fork(
  ['patient', 'medecin', 'date', 'heure', 'type', 'motif'],
  (schema) => schema.optional()
);

module.exports = {
  rendezVousSchema,
  updateRendezVousSchema
}; 