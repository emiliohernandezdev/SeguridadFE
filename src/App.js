import './App.css';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* Agrega más rutas según sea necesario */}
      </Routes>
    </Router>
  );
}

export default App;
