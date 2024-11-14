import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import your custom styles

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
  
    setLoading(true);
  
    // Convert the email to lowercase to make the login case-insensitive
    const emailLowerCase = email.toLowerCase();
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email: emailLowerCase, password });
      localStorage.setItem('token', response.data.token);
      setError('');
      navigate('/profile'); // Redirect to home or cars page
      window.location.reload();
    } catch (error) {
      setLoading(false);
      setError('Invalid email or password.');
    }
  };
  

  return (
    <div className="container">
      <div className="screen">
      <h1>Car Management Application</h1>
        <div className="screen__content">
        
          <form className="login" onSubmit={handleLogin}>
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input
                type="text"
                className="login__input"
                placeholder="User name / Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                className="login__input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="button login__submit" type="submit" disabled={loading}>
              <span className="button__text">{loading ? 'Logging in...' : 'Log In Now'}</span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
          </form>

          {error && <p className="text-danger text-center error-message">{error}</p>}

          <div className="signup-link">
            <p><b>Don't have an account?</b> <a href="/signup">Sign Up</a></p>
          </div>
        </div>
        {/* <div className="screen__background">
       
          <span className="screen__background__shape screen__background__shape1"></span>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
