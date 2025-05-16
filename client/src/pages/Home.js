import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ title, description, icon, link }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="text-blue-600 text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link to={link} className="text-blue-600 hover:text-blue-800 font-medium">
      En savoir plus →
    </Link>
  </div>
);

const Home = () => {
  const features = [
    {
      title: "Gestion des Patients",
      description: "Gérez efficacement les dossiers médicaux et suivez l'historique des patients.",
      icon: "👥",
      link: "/dossiers-patients"
    },
    {
      title: "Rendez-vous",
      description: "Planifiez et gérez les rendez-vous en quelques clics.",
      icon: "📅",
      link: "/rendez-vous"
    },
    {
      title: "Traitements",
      description: "Suivez les traitements et prescriptions de vos patients.",
      icon: "💊",
      link: "/traitements"
    },
    {
      title: "Rapports & Analyses",
      description: "Générez des rapports détaillés et analysez vos données.",
      icon: "📊",
      link: "/rapports"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Le rythme de votre santé
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Une solution complète pour la gestion de votre établissement de santé.
              Simplifiez vos processus et améliorez la qualité des soins.
            </p>
            <Link
              to="/dossiers-patients"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300"
            >
              Commencer
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nos Fonctionnalités Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 