// src/AdminGuard.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminGuard = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('farmaciaToken');

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!token) {
        setIsLoading(false); // No token, terminar la carga
        return;
      }

      try {
        // Hacer la solicitud al endpoint para obtener el rol
        const response = await fetch(`http://localhost:3000/api/v1/auth/role`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener el rol');
        }

        const data = await response.json();
        if (data['success'] == true) {
          if (data['data']['name'] == 'admin') {
            console.log('si es admin')
            setIsAdmin(true);
          } else {
            console.log('no es admin')
            setIsAdmin(false);
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [token]);

  // Manejo de estado de carga y error
  if (isLoading) {
    return <div>Cargando...</div>; // O un componente de carga
  }

  if (error) {
    return <Navigate to="/login" />; // Redirigir en caso de error
  }

  if (!isAdmin) {
    return <Navigate to="/home" />; // Redirigir si no es admin
  }

  return children; // Permitir el acceso si es admin
};

export default AdminGuard;
