import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import App component
import './index.css'; // Import your CSS

ReactDOM.render(
  <React.StrictMode>
    <App /> {/* Render your App component */}
  </React.StrictMode>,
  document.getElementById('root')
);
