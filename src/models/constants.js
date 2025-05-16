const ROLES = {
  ADMIN: 'ADMIN',
  MEDECIN: 'MEDECIN',
  SECRETAIRE: 'SECRETAIRE',
};

const SEXE = {
  MASCULIN: 'M',
  FEMININ: 'F',
};

const GROUPE_SANGUIN = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const TYPE_ANTECEDENT = {
  MALADIE: 'MALADIE',
  CHIRURGIE: 'CHIRURGIE',
  ALLERGIE: 'ALLERGIE',
  AUTRE: 'AUTRE',
};

const TYPE_RDV = {
  CONSULTATION: 'CONSULTATION',
  SUIVI: 'SUIVI',
  URGENCE: 'URGENCE',
  AUTRE: 'AUTRE',
};

const STATUT_RDV = {
  PLANIFIE: 'PLANIFIE',
  CONFIRME: 'CONFIRME',
  EN_COURS: 'EN_COURS',
  TERMINE: 'TERMINE',
  ANNULE: 'ANNULE',
};

const REGEX = {
  EMAIL: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
  TELEPHONE: /^(\+212|0)([ \-_/]*)(\d[ \-_/]*){9}$/,
  CODE_POSTAL: /^\d{5}$/,
};

module.exports = {
  ROLES,
  SEXE,
  GROUPE_SANGUIN,
  TYPE_ANTECEDENT,
  TYPE_RDV,
  STATUT_RDV,
  REGEX,
}; 