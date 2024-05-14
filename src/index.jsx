import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/main.css';
import { WeatherDataProvider } from './providers/WeatherData';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WeatherDataProvider>
      <App />
    </WeatherDataProvider>
  </React.StrictMode>
);
