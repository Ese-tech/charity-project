// client/src/components/Header.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Header: React.FC = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-orange-500">
          Charity App
        </Link>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-orange-500">Home</Link>
          <Link to="/children" className="text-gray-600 hover:text-orange-500">Sponsor</Link>
          {userInfo && (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-orange-500">Dashboard</Link>
              <Link to="/profile" className="text-gray-600 hover:text-orange-500">Profile</Link>
              <Link to="/history" className="text-gray-600 hover:text-orange-500">History</Link> 
              <button onClick={handleLogout} className="text-gray-600 hover:text-orange-500">
                Logout
              </button>
            </>
          )}
          {!userInfo && (
            <>
              <Link to="/login" className="text-gray-600 hover:text-orange-500">Login</Link>
              <Link to="/register" className="text-gray-600 hover:text-orange-500">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;