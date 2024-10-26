import './App.css';
import farmaciaLogo from './img/farmacia.png';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
function Admin() {
  const [users, setUsers] = useState([]);
  const [userCredits, setUserCredits] = useState([]);
  const [newUser, setNewUser] = useState({ user: '', limit: '', available: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener usuarios desde el API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/auth/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('farmaciaToken')}`,
        },
      });
      const data = await response.data;
      setUsers(data['data']); // Ajusta la estructura según tu API
    } catch (error) {
      setError(error.response?.data?.message || 'Error al obtener los usuarios');
      toast.error(error.response?.data?.message || 'Error al obtener los usuarios');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para obtener créditos
  const fetchCredits = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/credit/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('farmaciaToken')}`,
        },
      });

      const data = await response.data;
      setUserCredits(data['users']); // Ajusta la estructura según tu API
      console.log(userCredits)
    } catch (error) {
      setError(error.response?.data?.message || 'Error al obtener los créditos');
      toast.error(error.response?.data?.message || 'Error al obtener los créditos');
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un nuevo usuario
  const handleAddUser = async () => {
    if (newUser.user && newUser.limit && newUser.available) {
      try {
        const response = await axios.post('http://localhost:3000/api/v1/credit/add', newUser);
        
        const data = await response.data;
        if(data['success'] === false) {
          toast.error(data['message']);
        }else{
          toast.success(data['message']);
          setNewUser({ user: '', limit: '', available: '' });
          fetchCredits();
        }    
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error al agregar el usuario');
      }
    } else {
      toast.error('Por favor completa todos los campos');
    }
  };

  // Función para editar un usuario
  const handleEditUser = async (id, field, value) => {
    // Encontrar el objeto de crédito con el usuario correspondiente y obtener el valor actual (before)
    const updatedUserCredits = userCredits.map((credit) => 
      credit.user._id === id ? { ...credit, [field]: value } : credit
    );
  
    const selectedCredit = userCredits.find(credit => credit.user._id === id);

    console.log(selectedCredit)
    const beforeValue = selectedCredit ? selectedCredit[field] : null;
    const afterValue = value;
  
    try {
      // Realizar el PATCH con axios y enviar solo el ID y los valores `before` y `after`
      const response = await axios.patch(
        'http://localhost:3000/api/v1/credit/update',
        {
          id: id,
          limit: beforeValue, // valor actual antes de la actualización
          available: afterValue     // nuevo valor que se desea establecer
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      if (response.status !== 200) {
        throw new Error('Error al actualizar el crédito');
      }
  
      // Actualizar el estado de userCredits con los nuevos valores tras el éxito del request
      setUserCredits(updatedUserCredits);
      toast.success('Crédito actualizado exitosamente');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar el crédito');
    }
  };
  

  useEffect(() => {
    fetchUsers();
    fetchCredits();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="box">
        <div className="inner-box">
          <div className="admin-header">
            <div className="logo">
              <img src={farmaciaLogo} alt="Farmacia Logo" />
              <h4>Admin - Farmacia</h4>
            </div>
            <h2>Registro de Creditos</h2>
          </div>

          {/* Tabla de Registros */}
          <table className="user-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Límite de Crédito</th>
                <th>Saldo Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>

              {userCredits && userCredits.map(user => (
                <tr key={user.user._id}>
                  <td>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={user.user.email}
                      onChange={(e) => handleEditUser(user.user._id, 'user', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={user.limit.toFixed(2)}
                      onChange={(e) => handleEditUser(user.user._id, 'creditLimit', parseFloat(e.target.value).toFixed(2))}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={user.available.toFixed(2)}
                      onChange={(e) => handleEditUser(user.user._id, 'availableBalance', parseFloat(e.target.value).toFixed(2))}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditUser(user.user._id)}>Guardar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Formulario para agregar un nuevo usuario */}
          <div className="add-user-form">
            <h3>Agregar Nuevo Credito</h3>
            <select
              value={newUser.user}
              onChange={(e) => setNewUser({ ...newUser, user: e.target.value })}
            >
              <option value="" disabled>Seleccionar Usuario</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.email}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Límite de Crédito"
              value={newUser.limit}
              onChange={(e) => setNewUser({ ...newUser, limit: parseFloat(e.target.value).toFixed(2) })}
            />
            <input
              type="number"
              placeholder="Saldo Disponible"
              value={newUser.available}
              onChange={(e) => setNewUser({ ...newUser, available: parseFloat(e.target.value).toFixed(2) })}
            />
            <button onClick={handleAddUser}>Agregar credito</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Admin;
