import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Cards from './pages/Cards';
import View from './pages/View';
import Collections from './pages/Collections';
import Layout from './components/Layout';

const App = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/upload" element={isAuthenticated ? <Layout><Upload /></Layout> : <Navigate to="/login" />} />
        <Route path="/cards" element={isAuthenticated ? <Layout><Cards /></Layout> : <Navigate to="/login" />} />
        <Route path="/view" element={isAuthenticated ? <Layout><View /></Layout> : <Navigate to="/login" />} />
        <Route path="/collections" element={isAuthenticated ? <Layout><Collections /></Layout> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
