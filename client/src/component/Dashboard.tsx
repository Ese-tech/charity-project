import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  if (!userInfo) {
    // This case should ideally be handled by a PrivateRoute component,
    // but for now, a simple redirect is fine.
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-800">Welcome, {userInfo.name}!</h2>
        <p className="mb-6 text-gray-600">This is your personalized dashboard.</p>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;