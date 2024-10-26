import './App.css';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Login';
import Admin from './Admin';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import AuthGuard from './guards/AuthGuard';
import AdminGuard from './guards/AdminGuard';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={
          <AuthGuard>
            <Home />
          </AuthGuard>
        } />
        <Route path="/admin" element={
          <AdminGuard>
            <Admin />
          </AdminGuard>
        } />
        {/* <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* Agrega más rutas según sea necesario */}
      </Routes>
    </Router>
  );
}

export default App;
