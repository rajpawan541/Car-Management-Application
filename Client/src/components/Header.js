import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css'; // Ensure you have the required styles
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  // Check login status based on localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // If token exists, user is logged in, else not
  }, []); // Runs once on mount

  // Handle Logout
  const handleLogout = () => {
    logout(); // Clear the token from localStorage
    localStorage.removeItem('token'); // Remove the token
    setIsLoggedIn(false); // Update the login state
    navigate('/'); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid px-3">
        {/* Logo */}
        <Link to="/profile" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <h1>Home</h1>
        </Link>


      
        {/* Conditional rendering for logged-in user */}
        {isLoggedIn ? (
            <div className="d-flex align-items-center">
              {/* Add Car Button */}
              <Link to="Add-Car" className="btn btn-outline-light me-2">
                <i className="bi bi-car-front"></i> Add Car
              </Link>

              {/* Profile Button */}

              {/* Logout Button */}
              <button onClick={handleLogout} className="btn btn-outline-light ms-2">
                Logout
              </button>
            </div>
          ) : (
            <div className="text-end">
              {/* Login and Sign-up Buttons for guest users */}
              <Link to="/login" className="btn btn-outline-light me-2">
                Login
              </Link>
              <Link to="/signup" className="btn btn-warning">
                Sign-up
              </Link>
            </div>
          )}
      </div>
    </nav>
  );
};

export default Header;
