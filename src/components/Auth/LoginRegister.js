// src/pages/LoginRegister.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (password !== confirmpassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    const url = isRegistering
      ? "http://localhost:4000/api/register"
      : "http://localhost:4000/api/login";

    try {
      const { data } = await axios.post(url, {
        firstName,
        lastName,
        email,
        password,
      });
      // console.log("Login/Register success:", data);
      // navigate("/taskBoard");
      if (isRegistering) {
        // console.log('registered')
        // After successful registration, redirect to login
        navigate("/");
        setIsRegistering(false)
        setError("")
      } else {
        // After successful login, store the token and navigate to taskBoard
        // localStorage.setItem("token", data.token);
        navigate("/taskBoard");
      }
    } catch (err) {
      console.error("Login/Register error:", err);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };



  const handleGoogleLogin = () => {
    // Redirect the user to your backend's Google login route
    window.location.href = "http://localhost:4000/api/google-login";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-left text-blue-600 mb-6">
          {isRegistering ? "Signup" : "Login"}
        </h2>
        
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {isRegistering && (
            <div>
              
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 mb-2 "
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 mb-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 mb-2"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 mb-2"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 mb-2"
              />
            </div>
          )}
          {!isRegistering && (
            <div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 mb-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
          {error &&isRegistering&& (
          <div className="mb-1 text-red-500 text-center">{error}</div>
        )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            {isRegistering ? "Signup" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isRegistering
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>
          <button
            onClick={toggleMode}
            className="text-blue-500 hover:underline font-medium"
          >
            {isRegistering ? "Login" : "Signup"}
          </button>
        </div>

        <div className="mt-6">
      
          <div className="mt-4 flex justify-center">
          
            <button
              onClick={handleGoogleLogin}
              className="bg-blue-500 p-2 text-white rounded-md"
            >
              {isRegistering ? "Signup" : "Login"} with{" "}
              <text className="font-bold">Google</text>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
