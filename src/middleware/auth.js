const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId, actif: true });

    if (!user) {
      throw new Error();
    }

    // Mettre à jour la dernière connexion
    user.derniereConnexion = new Date();
    await user.save();

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Veuillez vous authentifier.' });
  }
};

// Middleware pour vérifier les rôles
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès non autorisé pour ce rôle.' 
      });
    }
    next();
  };
};

module.exports = {
  auth,
  checkRole
}; 