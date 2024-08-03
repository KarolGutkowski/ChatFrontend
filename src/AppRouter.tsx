// App.tsx or Routes.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import App from './App'; // Your messaging component

const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/messaging" element={<App />} />
      </Routes>
  );
};

export default AppRouter;
