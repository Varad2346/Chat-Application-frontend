import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
const Signup = () => {
    
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  console.log(formData);
  const navigate = useNavigate();

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
    if (!validate()) return; // Validate inputs before logging in

    // setIsLoading(true);
    try {
      console.log("hi", formData.username, formData.password);
      const username = formData.username;
      const password = formData.password;
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          localStorage.setItem("token", data.token); // Store the token in localStorage
        } else {
          throw new Error("Invalid credentials");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error; // Propagate the error to the caller
      }
      navigate("/"); // Redirect to home page
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
          e.preventDefault(); // Prevent the default form submission
          handleLogin(); // Call the login function
        }}
      >
        <div className="login-text-top">
          <p>SignUp Form</p>
        </div>
        <div className="login-input">
          {/* <label htmlFor="" ></label> */}
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
          <button type="submit">Sign Up</button>
        </div>
        <div className="signup-options">
          {/* <a href="">Forgot Password</a> */}
          <span>
            Already have an account? &nbsp;
            <a href="/">Login</a>
          </span>
        </div>
      </form>
      <div className="chat-logo">
        Chatify.
      </div>
    </div>
  );
};

export default Signup;
