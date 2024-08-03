import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from './UserProvider'

const PrivateRoute: React.FC = () => {
  const { username } = useUser();

  // If username is not set, redirect to login page
  if (!username) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Render the nested route components if authenticated
};

export default PrivateRoute;
