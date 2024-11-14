import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css'; // Import custom styles

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form submission handler for Signup
  const handleSignup = async (e) => {
    e.preventDefault();
  
    // Simple client-side validation
    if (!username || !email || !password) {
      setError('Please fill in all the fields.');
      return;
    }
  
    // Convert email to lowercase
    const emailLowerCase = email.toLowerCase();
  
    setLoading(true); // Start loading
  
    try {
      // Make a POST request to the signup API
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { username, email: emailLowerCase, password });
      
      // On successful signup
      setLoading(false); // Stop loading
      setError(''); // Reset error state
      navigate('/'); // Redirect to login page after successful signup
    } catch (error) {
      setLoading(false); // Stop loading
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again later.'; // Handle backend error messages
      setError(errorMessage);
    }
  };
  
  return (
    <div className="container">
      <div className="screen">
        <h1>Car Management Application</h1>
        <div className="screen__content">
          <form className="signup" onSubmit={handleSignup}>
            {/* Username Input */}
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                className="login__input"
              />
            </div>

            {/* Email Input */}
            <div className="login__field">
              <i className="login__icon fas fa-envelope"></i>
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="login__input"
              />
            </div>

            {/* Password Input */}
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="login__input"
              />
            </div>

            {/* Submit Button */}
            <button className="button login__submit" type="submit" disabled={loading}>
              <span className="button__text">{loading ? 'Signing up...' : 'Sign Up'}</span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
          </form>

          {/* Error message */}
          {error && <p className="text-danger text-center error-message">{error}</p>}

          {/* Link to Login page */}
          <div className="login-link">
            <p><b>Already have an account?</b> <a href="/login">Login here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
