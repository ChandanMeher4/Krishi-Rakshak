import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../Context/AppContext";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useContext(AppContext);

  // state for inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle register function
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // 🟢 CHANGE 1: Call the register function with only email and password
      await register(formData.email, formData.password);
      
      // 🟢 CHANGE 2: Redirect to the homepage or a protected route
      navigate("/"); // or a dashboard page, etc.
      
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-lime-100 relative overflow-hidden">
      {/* Animated agricultural elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-300/20 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl animate-pulse"></div>
      
      {/* Floating wheat icons */}
      <div className="absolute top-20 left-20 text-6xl animate-bounce opacity-30">🌾</div>
      <div className="absolute top-40 right-32 text-4xl animate-pulse opacity-40">🚜</div>
      <div className="absolute bottom-32 left-40 text-5xl animate-bounce opacity-30">🌱</div>
      <div className="absolute bottom-20 right-20 text-4xl animate-pulse opacity-40">🍃</div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-xl border border-green-200/50 shadow-2xl rounded-3xl p-10 max-w-md w-full z-10 relative"
      >
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛡️🌾</div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Krishi Rakshak</h1>
          <h2 className="text-xl font-semibold text-gray-700">
            Join Our Farming Community
          </h2>
          <p className="text-sm text-gray-600 mt-2">Protecting crops, empowering farmers</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="relative mb-4">
            <span className="absolute left-3 top-3 text-green-600">👨‍🌾</span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white/80"
              required
            />
          </div>

          <div className="relative mb-4">
            <span className="absolute left-3 top-3 text-green-600">📧</span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white/80"
              required
            />
          </div>
          
          <div className="relative mb-4">
            <span className="absolute left-3 top-3 text-green-600">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white/80"
              required
            />
          </div>

          <div className="relative mb-6">
            <span className="absolute left-3 top-3 text-green-600">🔐</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white/80"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-700 hover:to-emerald-700 transition duration-300 mb-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-2">🌱</span>
                Create Account
              </span>
            )}
          </button>
        </form>

        <div className="text-center">
          <span className="text-gray-600 text-sm">Already protecting your crops with us? </span>
          <button
            className="text-green-600 hover:text-green-700 font-semibold text-sm hover:underline ml-1 transition"
            onClick={() => navigate("/login")}
          >
            Sign In Here
          </button>
        </div>

        {/* Agricultural themed footer */}
        <div className="mt-6 text-center border-t border-green-200 pt-4">
          <p className="text-xs text-gray-500 mb-2">Trusted by farmers nationwide</p>
          <div className="flex justify-center space-x-4 text-2xl">
            <span title="Crop Protection">🌾</span>
            <span title="Weather Monitoring">⛅</span>
            <span title="Pest Control">🐛</span>
            <span title="Irrigation">💧</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;