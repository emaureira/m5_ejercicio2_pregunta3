import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import {AuthProvider, useAuth } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*" element={<div>404 not found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute({ children }){
    const { auth } = useAuth();
    const navigate = useNavigate()

    if (!auth.isAuthenticated){
        navigate('/login')
        return null;
    }
    return children
}


export default App;