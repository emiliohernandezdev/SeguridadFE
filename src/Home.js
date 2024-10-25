import './Home.css';
import farmaciaLogo from './img/farmacia.png'; // Importa la imagen del logo
import avatar from './img/farmacia.png'; // Imagen de usuario
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [activeInput, setActiveInput] = useState(null);

  // Manejadores de eventos para inputs
  const handleFocus = (index) => {
    setActiveInput(index);
  };

  const handleBlur = (index, value) => {
    if (value === "") setActiveInput(null);
  };

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
      <div className="dashboard-container">
        {/* SideBar */}
        <section className="full-box cover dashboard-sideBar">
          <div className="full-box dashboard-sideBar-ct">
            {/* SideBar Title */}
            <div className="full-box text-uppercase text-center text-titles dashboard-sideBar-title">
              FarmaciaDonDrogo <i className="zmdi zmdi-close btn-menu-dashboard visible-xs"></i>
            </div>

            {/* SideBar User info */}
            <div className="full-box dashboard-sideBar-UserInfo">
              <figure className="full-box">
                <img src={avatar} alt="UserIcon" />
                <figcaption className="text-center text-titles">usuario</figcaption>
              </figure>
              <ul className="full-box list-unstyled text-center">
                <li>
                  <a href="#!">
                    <i className="zmdi zmdi-settings"></i>
                  </a>
                </li>
                <li>
                  <a href="#!" className="btn-exit-system">
                    <i className="zmdi zmdi-power"></i>
                  </a>
                </li>
              </ul>
            </div>

            {/* SideBar Menu */}
            <ul className="list-unstyled full-box dashboard-sideBar-Menu">
              <li>
                <a href="#!">
                  <i className="zmdi zmdi-view-dashboard zmdi-hc-fw"></i> Dashboard
                </a>
              </li>
              <li>
                
                <ul className="list-unstyled full-box">
                  <li>
                    <a href="#!">
                      <i className="zmdi zmdi-timer zmdi-hc-fw"></i> Limite Crédito 
                    </a>
                  </li>
                  <li>
                    <a href="#!">
                      <i className="zmdi zmdi-book zmdi-hc-fw"></i> Saldo
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#!" className="btn-sideBar-SubMenu">
                  <i className="zmdi zmdi-account-add zmdi-hc-fw"></i> Usuarios
                  <i className="zmdi zmdi-caret-down pull-right"></i>
                </a>
                
              </li>
              
            </ul>
          </div>
        </section>

        {/* Content page */}
        <section className="full-box dashboard-contentPage">
          {/* NavBar */}
          <nav className="full-box dashboard-Navbar">
            <ul className="full-box list-unstyled text-right">
              <li className="pull-left">
                <a href="#!" className="btn-menu-dashboard">
                  <i className="zmdi zmdi-more-vert"></i>
                </a>
              </li>
              <li>
                <a href="#!" className="btn-Notifications-area">
                  <i className="zmdi zmdi-notifications-none"></i>
                  <span className="badge">7</span>
                </a>
              </li>
              <li>
                <a href="#!" className="btn-search">
                  <i className="zmdi zmdi-search"></i>
                </a>
              </li>
              <li>
                <a href="#!" className="btn-modal-help">
                  <i className="zmdi zmdi-help-outline"></i>
                </a>
              </li>
            </ul>
          </nav>

          {/* Content page */}
          <div className="container-fluid">
            <div className="page-header">
              <h1 className="text-titles">Sistema de Farmacia <small></small></h1>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="full-box text-center" style={{ padding: '30px 10px' }}>
            <article className="full-box tile">
              <div className="full-box tile-title text-center text-titles text-uppercase">Administrador</div>
              <div className="full-box tile-icon text-center">
                <i className="zmdi zmdi-account"></i>
              </div>
              <div className="full-box tile-number text-titles">
                <p className="full-box">1</p>
                <small>Registro</small>
              </div>
            </article>
            <article className="full-box tile">
              <div className="full-box tile-title text-center text-titles text-uppercase">Clientes</div>
              <div className="full-box tile-icon text-center">
                <i className="zmdi zmdi-male-alt"></i>
              </div>
              <div className="full-box tile-number text-titles">
                <p className="full-box">10</p>
                <small>Registro</small>
              </div>
            </article>
            <article className="full-box tile">
              <div className="full-box tile-title text-center text-titles text-uppercase">Compras</div>
              <div className="full-box tile-icon text-center">
                <i className="zmdi zmdi-face"></i>
              </div>
              <div className="full-box tile-number text-titles">
                <p className="full-box">100</p>
                <small>Registro</small>
              </div>
            </article>
           
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
