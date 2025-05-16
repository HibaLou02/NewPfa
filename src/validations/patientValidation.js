const Joi = require('joi');

const patientSchema = Joi.object({
  nom: Joi.string().required().trim().min(2).max(50),
  prenom: Joi.string().required().trim().min(2).max(50),
  dateNaissance: Joi.date().required().max('now'),
  sexe: Joi.string().required().valid('M', 'F'),
  adresse: Joi.object({
    rue: Joi.string().trim(),
    ville: Joi.string().trim(),
    codePostal: Joi.string().trim(),
    pays: Joi.string().trim()
  }),
  telephone: Joi.string().required().pattern(/^[0-9+\-\s()]+$/),
  email: Joi.string().email().lowercase().trim(),
  numeroSecuriteSociale: Joi.string().trim(),
  antecedentsMedicaux: Joi.array().items(
    Joi.object({
      type: Joi.string().required(),
      description: Joi.string(),
      date: Joi.date()
    })
  ),
  allergies: Joi.array().items(
    Joi.object({
      nom: Joi.string().required(),
      severite: Joi.string().valid('Faible', 'Moyenne', 'Severe'),
      description: Joi.string()
    })
  )
});

const updatePatientSchema = patientSchema.fork(
  ['nom', 'prenom', 'dateNaissance', 'sexe', 'telephone'],
  (schema) => schema.optional()
);

module.exports = {
  patientSchema,
  updatePatientSchema
}; 