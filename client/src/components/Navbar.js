import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">LouCare</span>
            </Link>
          </div>
          
          <div className="flex space-x-8">
            <Link 
              to="/dossiers-patients"
              className={`nav-link flex items-center ${location.pathname === '/dossiers-patients' ? 'active' : ''}`}
            >
              Dossiers Patients
            </Link>
            <Link 
              to="/rendez-vous"
              className={`nav-link flex items-center ${location.pathname === '/rendez-vous' ? 'active' : ''}`}
            >
              Rendez-vous
            </Link>
            <Link 
              to="/traitements"
              className={`nav-link flex items-center ${location.pathname === '/traitements' ? 'active' : ''}`}
            >
              Traitements
            </Link>
            <Link 
              to="/rapports"
              className={`nav-link flex items-center ${location.pathname === '/rapports' ? 'active' : ''}`}
            >
              Rapports
            </Link>
            <Link 
              to="/support"
              className={`nav-link flex items-center ${location.pathname === '/support' ? 'active' : ''}`}
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 