// client/src/routes/Routes.tsx

import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Layout from '../components/Layout';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import Profile from '../components/Profile';
import Home from '../pages/Home'; // Import the Home component
import SponsorPage from '../pages/SponsorPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* This is the new Layout Route */}
      <Route element={<Layout />}>
        {/* All nested routes will now be rendered inside the Layout */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/sponsor" element={<SponsorPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;