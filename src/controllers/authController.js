const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Un utilisateur avec cet email existe déjà' 
      });
    }

    const user = new User(req.body);
    await user.save();

    // Générer le token
    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.active) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Mettre à jour la dernière connexion
    user.derniereConnexion = new Date();
    await user.save();

    // Générer le token
    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        specialite: user.specialite
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour le profil de l'utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    // Empêcher la modification du rôle via cette route
    delete updates.role;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Changer le mot de passe
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Vérifier l'ancien mot de passe
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 