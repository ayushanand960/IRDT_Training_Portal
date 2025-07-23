  import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider } from "./components/AuthContext"; // or correct path

import 'animate.css';

ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
    <AuthProvider> {/* ✅ Wrap App */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
