import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout"; // 🟢 Import the new Layout component
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from './pages/Register';
import Otp from './pages/Otp';
import Dashboard from './pages/Dashboard';
import Weather from "./pages/Weather";
import Contact from "./pages/Contact";

const App = () => {
  return (
    <BrowserRouter>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      
    </BrowserRouter>
  );
};

export default App;