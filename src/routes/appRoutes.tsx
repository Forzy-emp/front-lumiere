import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Lazy load or import directly since they are page components
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import RecoverPassword from '../pages/auth/recoverPassword';
import Validation from '../pages/auth/validation';
import NewPassword from '../pages/auth/newPassword';
import Home from '../pages/dashboard/home';
import History from '../pages/dashboard/history';
import Profile from '../pages/user/profile';
import Settings from '../pages/user/settings';
import MySolarPlant from '../pages/dashboard/mySolarPlant';
import RegisterNewSolarPowerPlant from '../pages/dashboard/solarplants/registerNewSolarPowerPlant';
import SolarPlantInformation from '../pages/dashboard/solarplants/Information';

// Protected Route Guard Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Redirect to dashboard if logged in, otherwise go to login
const HomeRedirect = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRedirect />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/recover-password',
    element: <RecoverPassword />,
  },
  {
    path: '/validation',
    element: <Validation />,
  },
  {
    path: '/new-password',
    element: <NewPassword />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'history',
        element: <History />,
      },
      {
        path: 'usina',
        element: <MySolarPlant />,
      },
      {
        path: 'usina/new',
        element: <RegisterNewSolarPowerPlant />,
      },
      {
        path: 'usina/info/:id',
        element: <SolarPlantInformation />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  // Catch-all route redirecting to home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
