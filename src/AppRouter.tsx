// App.tsx or Routes.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import App from './App';
import PrivateRoute from './PrivateRoute'; 

const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
            <Route path="/messaging" element={<App />} />
        </Route>
      </Routes>
  );
};

export default AppRouter;
