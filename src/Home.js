import './App.css';
import farmaciaLogo from './img/farmacia.png';
import image1 from './img/farmacia4.jpg';
import image2 from './img/farmacia2.jpg';
import farmacia3 from './img/farmacia3.jpg';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'

function Home() {
  const [activeInput, setActiveInput] = useState(null);
  const [isFinancialMode, setIsFinancialMode] = useState(true);
  const [currentImage, setCurrentImage] = useState(1);
  const [creditLimit, setCreditLimit] = useState(0.00);
  const [availableBalance, setAvailableBalance] = useState(0.00);
  const [userData, setUserData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);

  // Manejadores de eventos para inputs
  const handleFocus = (index) => {
    setActiveInput(index);
  };

  const handleBlur = (index, value) => {
    if (value === "") setActiveInput(null);
  };

  // Función para cambiar entre modos (financieros/información de usuario)
  const handleToggle = () => {
    setIsFinancialMode(!isFinancialMode);
  };

  // Manejador para mover el slider
  const handleSlider = (index) => {
    setCurrentImage(index);
  };

  // Efecto para actualizar el slider de texto
  useEffect(() => {
    const textSlider = document.querySelector(".text-group");
    if (textSlider) {
      textSlider.style.transform = `translateY(${-(currentImage - 1) * 2.2}rem)`;
    }
  }, [currentImage]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/credit/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('farmaciaToken')}`
        }
      });

      if (!response.ok) {
        toast.error(`Error: ${response.statusText}`);
        return; // Salir de la función si hay un error
      }

      const data = await response.json();
      if (data['success'] === false) {
        toast.warning(`Aviso: ${data['message']}`);
        return; // Salir de la función si hay un error
      } else {
        toast.success('Credito obtenido con exito!');
      }

      setCreditLimit(data.credit);
      setAvailableBalance(data.remaining);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch data desde la API
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/auth/userInfo', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('farmaciaToken')}`
          }
        });

        if (!response.ok) {
          toast.error(`Error: ${response.statusText}`);
          return; // Salir de la función si hay un error
        }

        const data = await response.json();
        if (data['success'] === false) {
          toast.error(`Aviso: ${data['message']}`);
          return; // Salir de la función si hay un error
        } else {
          setUserData(data.user);
        }

      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, []);

  const generateTrx = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/credit/generateTrx', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('farmaciaToken')}`
        }
      });

      const data = await response.json();
      if (data['success'] === false) {
        toast.error(data['message']);
      } else {
        toast.success(data['message']);

        if (data['data']) {
          setTransactionData(data['data']);  // Guardar el JSON en el estado
          fetchData();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className={isFinancialMode ? "financial-mode" : ""}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
      />
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            {isFinancialMode ? (
              <section className="financial-details">
                <div className="logo">
                  <img src={farmaciaLogo} alt="Farmacia Logo" />
                  <h4>Farmacia</h4>
                </div>
                <div className="heading">
                  <h2>Detalles Financieros</h2>
                  <h6>¿Quieres ver tu información de usuario? </h6>
                  <a href="#" className="toggle" onClick={handleToggle}>
                    Ver Información del Usuario
                  </a>
                </div>
                <div className="financial-info">
                  <div className="info-item">
                    <h3>Límite de Crédito</h3>
                    <p>Q {creditLimit.toFixed(2)}</p>
                  </div>
                  <div className="info-item">
                    <h3>Saldo Disponible</h3>
                    <p>Q {availableBalance.toFixed(2)}</p>
                  </div>
                  <div className="info-item">
                    <h3>Generar compra</h3>
                    <button className="sign-btn" onClick={generateTrx}>Generar transacción</button>

                    {/* Asegura que JsonView tenga un contenedor responsivo */}
                    {transactionData && (
                      <div className="json-view">
                        <JsonView src={transactionData} />
                      </div>
                    )}
                  </div>

                </div>
              </section>
            ) : (
              <section className="user-info">
                <div className="logo">
                  <img src={farmaciaLogo} alt="Farmacia Logo" />
                  <h4>Farmacia</h4>
                </div>
                <div className="heading">
                  <h2>Información del Usuario</h2>
                  <h6>¿Quieres ver los detalles financieros?</h6>
                  <a href="#" className="toggle" onClick={handleToggle}>
                    Ver Detalles Financieros
                  </a>
                </div>
                <div className="user-details">
                  {userData ? ( // Verificar si hay datos del usuario
                    <>
                      <div className="info-item">
                        <h3>Correo Electrónico</h3>
                        <p>{userData.email}</p> {/* Mostrar el email, puedes mostrar otro campo si deseas */}
                      </div>
                      <div className="info-item">
                        <h3>Documento de Identidad</h3>
                        <p>{userData.dpi}</p>
                      </div>
                      <div className="info-item">
                        <h3>Rol</h3>
                        <p>{userData.role.name}</p>
                      </div>
                    </>
                  ) : (
                    <p>Cargando información del usuario...</p> // Mensaje de carga
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Slider de Imágenes */}
          <div className="carousel">
            <div className="images-wrapper">
              <img src={image1} className={`image img-1 ${currentImage === 1 ? "show" : ""}`} alt="carousel 1" />
              <img src={image2} className={`image img-2 ${currentImage === 2 ? "show" : ""}`} alt="carousel 2" />
              <img src={farmacia3} className={`image img-3 ${currentImage === 3 ? "show" : ""}`} alt="carousel 3" />
            </div>
            <div className="text-slider">
              <div className="text-wrap">
                <div className="text-group">
                  <h2>Tu salud en las mejores manos</h2>
                  <h2>Tu salud, nuestra familia.</h2>
                  <h2>Tu salud, nuestro mayor tesoro</h2>
                </div>
              </div>
              <div className="bullets">
                <span className={currentImage === 1 ? "active" : ""} onClick={() => handleSlider(1)}></span>
                <span className={currentImage === 2 ? "active" : ""} onClick={() => handleSlider(2)}></span>
                <span className={currentImage === 3 ? "active" : ""} onClick={() => handleSlider(3)}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
