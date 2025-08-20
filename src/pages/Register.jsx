import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleregister = async () => {
    setError("");

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (fullName.length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        fullName,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container register-logo">
        <NavLink to="/">
          <img src={Logo} alt="themchar ai" width="221" />
        </NavLink>
      </div>

      <div className="container">
        <div className="register-container">
          <h2>Create Account</h2>
          <p>Please enter your credentials to register.</p>
          <br className="mt-1" />

          {error && <p className="error">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button
            className="mt-2 btn-primary"
            onClick={handleregister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-1">
            Already have an account?{" "}
            <NavLink to="/login">
              <span className="link">Login</span>
            </NavLink>
          </p>
          <p className="caution mt-2">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
