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

  // Obtener usuarios
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/auth/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('farmaciaToken')}`,
        },
      });
      setUsers(response.data['data']);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al obtener los usuarios');
      toast.error(error.response?.data?.message || 'Error al obtener los usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Obtener créditos
  const fetchCredits = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/credit/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('farmaciaToken')}`,
        },
      });
      setUserCredits(response.data['users']);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al obtener los créditos');
      toast.error(error.response?.data?.message || 'Error al obtener los créditos');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar crédito
  const handleEditUser = async (id, updatedCredit) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/v1/credit/update`, {
        id: id,
        limit: updatedCredit.limit,
        available: updatedCredit.available
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('farmaciaToken')}`,
        }
      });

      const data = await response.data;

      if (data['success'] === false) {
        toast.error(data['message']);
        return;
      } else {
        toast.success(data['message']);
        fetchCredits();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar el crédito');
    }
  };


  const handleCreditDelete = async (creditId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/credit/delete/${creditId._id}`,  {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('farmaciaToken')}`,
          'Content-Type': 'application/json',
        }
      });
      const data = await response.data;
      if (data['success'] === false) {
        toast.error(data['message']);
      } else {
        toast.success(data['message']);
        fetchCredits();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar el crédito');
    }
  }

  // Cambiar el valor del crédito
  const handleInputChange = (creditId, field, value) => {
    const updatedUserCredits = userCredits.map(credit =>
      credit._id === creditId ? { ...credit, [field]: value } : credit
    );
    setUserCredits(updatedUserCredits);
  };

  const handleSaveClick = (userCredit) => {
    handleEditUser(userCredit._id, {
      limit: userCredit.limit,
      available: userCredit.available
    });
  };

  // Agregar un nuevo crédito
  const handleAddUser = async () => {
    if (newUser.user && newUser.limit && newUser.available) {
      try {
        const response = await axios.post('http://localhost:3000/api/v1/credit/add', newUser);
        const data = await response.data;
        if (data['success'] === false) {
          toast.error(data['message']);
        } else {
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
              {userCredits && userCredits.map(userCredit => (
                <tr key={userCredit._id}>
                  <td>
                    <input
                      type="text"
                      readOnly
                      className="input-field"
                      disabled
                      value={userCredit.user.email}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="input-field"
                      value={userCredit.limit.toFixed(2)}
                      onChange={(e) => handleInputChange(userCredit._id, 'limit', parseFloat(e.target.value))}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="input-field"
                      value={userCredit.available.toFixed(2)}
                      onChange={(e) => handleInputChange(userCredit._id, 'available', parseFloat(e.target.value))}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSaveClick(userCredit)} >Guardar</button>
                    <button onClick={() => handleCreditDelete(userCredit)} >Eliminar</button>
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
            <button onClick={handleAddUser}>Agregar crédito</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Admin;
