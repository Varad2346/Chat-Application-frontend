import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../store/auth.jsx'; // Import useAuth for authentication

import "./Login.css";
const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth(); // Get authentication state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    if (!formData.username || !formData.password) {
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const username = formData.username;
      const password = formData.password;
      try {
        const response = await fetch("https://chat-application-dvs1.onrender.com/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token); // Store the token in localStorage
          setIsLoggedIn(true);
        } else {
          throw new Error("Invalid credentials");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error; // Propagate the error to the caller
      }
      navigate("/home"); // Redirect to home page
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault(); 
          handleLogin(); 
        }}
      >
        <div className="login-text-top">
          <p>Login Form</p>
        </div>
        <div className="login-input">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className="login-input">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="off"

          />
        </div>
        <div className="login-text-middle">
          <p>
            By signing up or logging in, you consent to our{" "}
            Terms of use and Privacy Policy{" "}
          </p>
        </div>
        <div className="login-button">
          <button type="submit">Log in</button>
        </div>
        <div className="login-options">
          <a href="">Forgot Password?</a>
          <a href="/signup">Sign Up</a>
        </div>
      </form>

      <div className="chat-logo">
        Chatify.
      </div>
    </div>
  );
};

export default Login;
