// src/AuthGuard.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem('farmaciaToken');
  if (!token) {
    // Si no hay token, redirigir a la página de inicio o login
    return <Navigate to="/login" />;
  }
  return children; // Permitir el acceso a los hijos si hay token
};

export default AuthGuard;
