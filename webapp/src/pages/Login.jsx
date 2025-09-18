import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../Context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Your AppContext login function now handles Firebase login
      await login(email, password);
      console.log("Logged in successfully with Firebase!");
      
      // 🟢 CHANGE: Remove the redirect to the OTP page.
      // Redirect the user to your main application dashboard or home page.
      navigate("/");
      
    } catch (err) {
      // The AppContext already sets the error state, which will be displayed below.
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-teal-100 relative overflow-hidden">
      {/* Animated agricultural elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-300/20 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-300/20 blur-3xl animate-pulse"></div>
      
      {/* Floating farm icons */}
      <div className="absolute top-20 left-20 text-6xl animate-bounce opacity-30">🚜</div>
      <div className="absolute top-40 right-32 text-4xl animate-pulse opacity-40">🌽</div>
      <div className="absolute bottom-32 left-40 text-5xl animate-bounce opacity-30">🐄</div>
      <div className="absolute bottom-20 right-20 text-4xl animate-pulse opacity-40">🏡</div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-xl border border-green-200/50 shadow-2xl rounded-3xl p-10 max-w-md w-full z-10 relative"
      >
        {/* Header with logo and branding */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛡️🌾</div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Welcome Back to <span className="text-emerald-600">Krishi Rakshak</span>
          </h1>
          <p className="text-sm text-gray-600">Securing your agricultural future</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <span className="absolute left-3 top-3 text-green-600">📧</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white/80"
              required
            />
          </div>

          <div className="relative mb-6">
            <span className="absolute left-3 top-3 text-green-600">🔒</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white/80"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-700 hover:to-emerald-700 transition duration-300 mb-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Signing In...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-2">🚪</span>
                Sign In
              </span>
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-center text-sm text-red-600 flex items-center justify-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </div>
        )}

        <div className="flex justify-between mb-6 text-sm">
          {/* 🟢 CHANGE: The "Forgot Password" logic needs to be updated for Firebase. */}
          <button
            type="button"
            className="text-green-600 hover:text-green-700 hover:underline transition flex items-center"
            // You'll need to create a new page for Firebase password reset.
            onClick={() => navigate("/forgot-password")} 
          >
            <span className="mr-1">🔑</span>
            Forgot Password?
          </button>
          <button
            type="button"
            className="text-green-600 hover:text-green-700 hover:underline transition flex items-center"
            onClick={() => navigate("/register")}
          >
            <span className="mr-1">🌱</span>
            Join Us
          </button>
        </div>

        <div className="flex items-center justify-center mb-6">
          <span className="border-b border-green-300 w-1/3"></span>
          <span className="mx-3 text-gray-500 text-sm">or connect with</span>
          <span className="border-b border-green-300 w-1/3"></span>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center w-12 h-12"
            title="Continue with Google"
          >
            <span className="text-lg">G</span>
          </button>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center w-12 h-12"
            title="Continue with Facebook"
          >
            <span className="text-lg">f</span>
          </button>
        </div>

        {/* Agricultural themed footer */}
        <div className="text-center border-t border-green-200 pt-4">
          <p className="text-xs text-gray-500 mb-2">Empowering farmers since 2020</p>
          <div className="flex justify-center space-x-4 text-2xl">
            <span title="Smart Farming">🤖</span>
            <span title="Crop Monitoring">📊</span>
            <span title="Weather Alerts">🌦️</span>
            <span title="Market Prices">💰</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;