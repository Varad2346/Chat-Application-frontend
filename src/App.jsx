import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import { useAuth } from '../src/store/auth.jsx'; // Import useAuth for authentication

import "./App.css";

const App = () => {
  const { isLoggedIn } = useAuth(); // Get authentication state

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login /> } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={  <Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
