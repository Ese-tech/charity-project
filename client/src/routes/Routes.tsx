// client/src/routes/Routes.tsx

import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Layout from '../components/Layout';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import Profile from '../components/Profile';
import Home from '../pages/Home';
import SponsorPage from '../pages/SponsorPage';
import ChildProfile from '../pages/ChildProfile';
import DonationHistory from '../pages/DonationHistory'; 
import ForgotPassword from '../pages/ForgotPassword'; 
import ResetPassword from '../pages/ResetPassword';  

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />     
      <Route path="/reset-password" element={<ResetPassword />} />  

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/children" element={<SponsorPage />} />
        <Route path="/children/:id" element={<ChildProfile />} />
        <Route path="/history" element={<PrivateRoute><DonationHistory /></PrivateRoute>} /> 
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;