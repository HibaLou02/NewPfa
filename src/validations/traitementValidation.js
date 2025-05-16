const Joi = require('joi');
const mongoose = require('mongoose');

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
});

const signesVitauxSchema = Joi.object({
  temperature: Joi.number().min(30).max(45),
  tensionArterielle: Joi.string().pattern(/^\d{2,3}\/\d{2,3}$/),
  frequenceCardiaque: Joi.number().integer().min(30).max(250),
  pouls: Joi.number().integer().min(30).max(250)
});

const prescriptionSchema = Joi.object({
  medicament: Joi.object({
    nom: Joi.string().required(),
    dosage: Joi.string().required(),
    frequence: Joi.string().required(),
    duree: Joi.number().integer().min(1)
  }).required(),
  instructions: Joi.string(),
  dateDebut: Joi.date().default(Date.now),
  dateFin: Joi.date().min(Joi.ref('dateDebut'))
});

const traitementSchema = Joi.object({
  patient: objectId.required(),
  medecin: objectId.required(),
  consultation: Joi.object({
    date: Joi.date().required(),
    notes: Joi.string(),
    signesVitaux: signesVitauxSchema
  }).required(),
  diagnostic: Joi.string().required(),
  planDeSoins: Joi.object({
    protocole: Joi.string(),
    duree: Joi.number().integer().min(1),
    instructions: Joi.string()
  }),
  prescriptions: Joi.array().items(prescriptionSchema),
  suiviProgression: Joi.array().items(
    Joi.object({
      date: Joi.date(),
      notes: Joi.string().required(),
      evaluation: Joi.string(),
      effectue: Joi.boolean().default(false)
    })
  ),
  alertesMedicaments: Joi.array().items(
    Joi.object({
      type: Joi.string().required(),
      niveau: Joi.string().valid('Faible', 'Moyen', 'Élevé').required(),
      description: Joi.string().required(),
      dateAlerte: Joi.date().default(Date.now)
    })
  ),
  statut: Joi.string()
    .valid('En cours', 'Terminé', 'Annulé')
    .default('En cours')
});

const updateTraitementSchema = traitementSchema.fork(
  ['patient', 'medecin', 'consultation', 'diagnostic'],
  (schema) => schema.optional()
);

const suiviSchema = Joi.object({
  notes: Joi.string().required(),
  evaluation: Joi.string(),
  effectue: Joi.boolean()
});

const alerteMedicamentSchema = Joi.object({
  type: Joi.string().required(),
  niveau: Joi.string().valid('Faible', 'Moyen', 'Élevé').required(),
  description: Joi.string().required()
});

module.exports = {
  traitementSchema,
  updateTraitementSchema,
  prescriptionSchema,
  suiviSchema,
  alerteMedicamentSchema
}; 