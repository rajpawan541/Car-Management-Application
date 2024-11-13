import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignUpPage/SignupPage';
import CarListPage from './pages/CarListPage/CarListPage';
import CarDetailPage from './pages/CarDetailPage/CarDetailPage';
import ProductCreationPage from './pages/AddCarPage/ProductCreationPage';
import EditCarPage from './pages/EditCarPage/EditCarPage';
import Header from './components/Header';
import './App.css';

const App = () => {
  return (
    <Router>
      {/* Conditional Header Rendering */}
      <HeaderWrapper />

      <div>
        <Routes>
          {/* Redirect root URL to login page */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route path="/profile" element={<CarListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cars" element={<CarListPage />} />
          <Route path="/car/:id" element={<CarDetailPage />} />
          <Route path="/Add-Car" element={<ProductCreationPage />} />
          <Route path="/edit-car/:id" element={<EditCarPage />} />
        </Routes>
      </div>
    </Router>
  );
};

// HeaderWrapper component to conditionally render the Header based on location
const HeaderWrapper = () => {
  const location = useLocation();

  // Define routes where you don't want to show the header
  const noHeaderRoutes = ['/login', '/signup'];

  return (
    <>
      {/* Render Header only on routes other than /login and /signup */}
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
    </>
  );
};

export default App;
