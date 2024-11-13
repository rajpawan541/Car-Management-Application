import axios from 'axios';

// Login function
export const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    return response.data.token; // Return the token if login is successful
  } catch (error) {
    throw new Error('Login failed. Please check your credentials.');
  }
};

// Signup function
export const signup = async (username, email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
    return response.data; // Return the response if signup is successful
  } catch (error) {
    throw new Error('Signup failed. Please try again later.');
  }
};

// Check if the user is logged in (check if token exists in localStorage)
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Logout function to clear the token from localStorage
export const logout = () => {
  localStorage.removeItem('token');
};
