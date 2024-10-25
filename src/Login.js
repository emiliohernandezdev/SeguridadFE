import './App.css';
import farmaciaLogo from './img/farmacia.png'; // Importa la imagen
import image1 from './img/farmacia3.jpg';
import image2 from './img/farmacia2.jpg';
import farmacia3 from './img/farmacia4.jpg';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importar axios
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 

function Login() {
  const [activeInput, setActiveInput] = useState(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [currentImage, setCurrentImage] = useState(1);

  const [loginData, setLoginData] = useState({ dpi: '', password: '' });
  const [registerData, setRegisterData] = useState({ dpi: '', email: '', password: '' });
  const [tokenVisible, setTokenVisible] = useState(false);
  const [token, setToken] = useState('');

  const [loginDisabled, setLoginDisabled] = useState(false);
  const navigate = useNavigate(); 

  // Manejadores de eventos para inputs
  const handleFocus = (index) => {
    setActiveInput(index);
  };

  const handleBlur = (index, value) => {
    if (value === "") setActiveInput(null);
  };

  // Función para cambiar entre modos (login/registro)
  const handleToggle = () => {
    setIsSignUpMode(!isSignUpMode);

    // Limpia los datos al cambiar de vista
    if (!isSignUpMode) {
      setRegisterData({
        username: '',
        email: '',
        password: '',
      });
      setLoginData({
        username: '',
        password: '',
      });
    }
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

  // Manejar cambio en los inputs de login
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para manejar el login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/login', loginData);
      const data = await response.data;
      if (response.data['success'] == true) {
        setTokenVisible(true);
        setLoginDisabled(true);
        toast.success(data['message'] ?? 'Token generado con exito');
        setLoginData({
          dpi: '',
          password: '',
        });
      } else {
        toast.error(`Error: ${data['message']}`);
      }
    } catch (error) {
      console.log(error);
      setTokenVisible(false);
      var errors = error.response.data.message;
      var message = "";
      if (errors.length > 0) {
        errors.forEach(element => {
          message += element + "\n";
        });
        toast.error(message);
      }
    }
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/validate', { token: token});
      const data = await response.data;
      if (response.data['success'] == true) {
        setTokenVisible(false);
        toast.success(data['message'] ?? 'Sesion iniciada con exito');
        setLoginData({
          dpi: '',
          password: '',
        });
        localStorage.setItem('farmaciaToken', data['data'])
        setTimeout(() => {
            navigate('/home');
        }, 2500);
      } else {
        toast.error(`Error: ${data['message']}`);
      }
    } catch (error) {
      console.log(error);
      var errors = error.response.data.message;
      var message = "";
      if (errors.length > 0) {
        errors.forEach(element => {
          message += element + "\n";
        });
        toast.error(message);
      }
    }
  };

  // Función para manejar el registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/register', registerData);
      const data = await response.data;
      if (data['success'] == true) {
        toast.success(data['message'] ?? 'Usuario registrado en el sistema con exito');

        setRegisterData({
          dpi: '',
          email: '',
          password: '',
        });

        setIsSignUpMode(false);
      } else {
        toast.error(`Error: ${data['message']}`);
      }
    } catch (error) {
      var errors = error.response.data.message;
      var message = "";
      if (errors.length > 0) {
        errors.forEach(element => {
          message += element + "\n";
        });
        toast.error(message);
      }
      // toast.error('Error en el registro:', error);
    }
  };

  return (

    <main className={isSignUpMode ? "sign-up-mode" : ""}>
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
        theme="dark" />
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            {/* Formulario de inicio de sesión */}
            <form className="sign-in-form" autoComplete="off" onSubmit={handleLoginSubmit}>
              <div className="logo">
                <img src={farmaciaLogo} alt="farmacia" />
                <h4>Farmacia</h4>
              </div>
              <div className="heading">
                <h2>Bienvenido a Don Drogo </h2>
                <h6>¿No estás registrado?</h6>
                <a href="#" className="toggle" onClick={handleToggle}>
                  Registrarse
                </a>
              </div>
              <div className="actual-form">
                <div className={`input-wrap ${activeInput === 1 ? "active" : ""}`}>
                  <input
                    type="number"
                    disabled={loginDisabled}
                    name="dpi"
                    className="input-field"
                    autoComplete="off"
                    required
                    onFocus={() => handleFocus(1)}
                    onBlur={(e) => handleBlur(1, e.target.value)}
                    onChange={handleLoginChange}
                  />
                  <label>Documento de identidad</label>
                </div>
                <div className={`input-wrap ${activeInput === 2 ? "active" : ""}`}>
                  <input
                    type="password"
                    name="password"
                    disabled={loginDisabled}
                    minLength="4"
                    className="input-field"
                    autoComplete="off"
                    required
                    onFocus={() => handleFocus(2)}
                    onBlur={(e) => handleBlur(2, e.target.value)}
                    onChange={handleLoginChange}
                  />
                  <label>Contraseña</label>
                </div>
                {
                  !loginDisabled && (
                    <button disabled={loginDisabled} type="submit" className="sign-btn" >
                      Enviar token de acceso
                    </button>
                  )
                }

                {/* Campo para ingresar el token, visible solo si se ha solicitado */}
                {tokenVisible && (
                  <div className={`input-wrap ${activeInput === 3 ? "active" : ""}`}>
                    <input
                      type="text"
                      name="token"
                      className="input-field"
                      autoComplete="off"
                      required
                      onFocus={() => handleFocus(3)}
                      onBlur={(e) => handleBlur(3, e.target.value)}
                      onChange={handleTokenChange}
                    />
                    <label>Ingrese su token</label>
                    <button type="button" onClick={handleTokenSubmit} className="sign-btn">
                      Validar token
                    </button>
                  </div>
                )}


                <p className="text">
                  Tu farmacia de confianza, siempre a tu lado.
                  <a href="#">¿Necesitas ayuda?</a> Inicia
                </p>
              </div>
            </form>

            {/* Formulario de registro */}
            <form className="sign-up-form" autoComplete="off" onSubmit={handleRegisterSubmit}>
              <div className="logo">
                <img src={farmaciaLogo} alt="farmacia" />
                <h4>Farmacia</h4>
              </div>
              <div className="heading">
                <h2>Regístrate en nuestra Farmacia</h2>
                <h6>¿Ya estás registrado con nosotros?</h6>
                <a href="#" className="toggle" onClick={handleToggle}>
                  Iniciar Sesión
                </a>
              </div>
              <div className="actual-form">
                <div className={`input-wrap ${activeInput === 3 ? "active" : ""}`}>
                  <input
                    type="number"
                    name="dpi"
                    minLength="4"
                    className="input-field"
                    autoComplete="off"
                    required
                    onFocus={() => handleFocus(3)}
                    onBlur={(e) => handleBlur(3, e.target.value)}
                    onChange={handleRegisterChange}
                  />
                  <label>Documento de identidad</label>
                </div>
                <div className={`input-wrap ${activeInput === 4 ? "active" : ""}`}>
                  <input
                    type="email"
                    name="email"
                    className="input-field"
                    autoComplete="off"
                    required
                    onFocus={() => handleFocus(4)}
                    onBlur={(e) => handleBlur(4, e.target.value)}
                    onChange={handleRegisterChange}
                  />
                  <label>Correo Electrónico</label>
                </div>
                <div className={`input-wrap ${activeInput === 5 ? "active" : ""}`}>
                  <input
                    type="password"
                    name="password"
                    minLength="4"
                    className="input-field"
                    autoComplete="off"
                    required
                    onFocus={() => handleFocus(5)}
                    onBlur={(e) => handleBlur(5, e.target.value)}
                    onChange={handleRegisterChange}
                  />
                  <label>Contraseña</label>
                </div>
                <input type="submit" value="Registrarse" className="sign-btn" />
              </div>
            </form>
          </div>

          {/* Slider de imágenes */}
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

export default Login;
