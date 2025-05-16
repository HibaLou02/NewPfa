# Plateforme de Gestion des Patients

Une application moderne de gestion des patients pour le secteur de la santé, construite avec le stack MERN (MongoDB, Express.js, React, Node.js) et Material-UI.

## Fonctionnalités

- 👥 Gestion complète des dossiers patients
- 📅 Système de rendez-vous
- 💊 Suivi des traitements
- 📊 Tableau de bord avec statistiques
- 🔔 Système de notifications en temps réel
- 🔐 Authentification et gestion des rôles
- 🎨 Interface utilisateur moderne et responsive

## Prérequis

- Node.js (v14 ou supérieur)
- MongoDB
- npm ou yarn

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/HibaLou02/PfaUp.git
cd PfaUp
```

2. Installer les dépendances du serveur :
```bash
npm install
```

3. Installer les dépendances du client :
```bash
cd client
npm install
```

4. Créer un fichier `.env` à la racine du projet :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthcare-db
JWT_SECRET=votre_secret_jwt
NODE_ENV=development
```

## Démarrage

1. Démarrer le serveur de développement :
```bash
npm run dev
```

2. Dans un autre terminal, démarrer le client :
```bash
npm run client
```

Ou démarrer les deux simultanément :
```bash
npm run dev:full
```

L'application sera accessible à :
- Frontend : http://localhost:3000
- Backend : http://localhost:5000
- API Documentation : http://localhost:5000/api-docs

## Structure du Projet

```
healthcare-platform/
├── client/                 # Frontend React
│   ├── public/
│   └── src/
│       ├── components/     # Composants React
│       ├── contexts/       # Contextes React
│       ├── pages/         # Pages de l'application
│       ├── services/      # Services API
│       └── theme/         # Configuration du thème
├── src/                   # Backend Node.js
│   ├── config/           # Configuration
│   ├── controllers/      # Contrôleurs
│   ├── middleware/       # Middleware
│   ├── models/          # Modèles Mongoose
│   ├── routes/          # Routes API
│   └── utils/           # Utilitaires
└── logs/                 # Logs de l'application
```

## Technologies Utilisées

- **Frontend**
  - React.js
  - Material-UI
  - React Router
  - Recharts
  - Date-fns

- **Backend**
  - Node.js
  - Express.js
  - MongoDB avec Mongoose
  - JWT pour l'authentification
  - Winston pour les logs

## Tests

Pour exécuter les tests :
```bash
npm test
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## Licence

ISC
