import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {userInfo?.name}!</h1>
        <p className="text-gray-600 mb-6">This is your personalized dashboard.</p>
        <div className="space-x-4">
          <button
            onClick={goToProfile}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <pre className="mt-6 text-left p-4 bg-gray-50 rounded-md text-sm text-gray-700">
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Dashboard;