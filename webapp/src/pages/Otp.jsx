import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AppContext } from '../Context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Otp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, verifyOtp } = useContext(AppContext);

  // Get email from location.state or localStorage
  const [email, setEmail] = useState(
    location.state?.email || localStorage.getItem('otpEmail') || ''
  );

  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Save email to localStorage if coming from previous page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      localStorage.setItem('otpEmail', location.state.email);
    }
  }, [location.state?.email]);

  // Redirect to login if email is missing
  useEffect(() => {
    if (!email) {
      console.log(location);
      navigate('/login');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setMessage('');
      const otpCode = otp.join('');

      if (otpCode.length < 6) {
        setMessage('Please enter the complete 6-digit verification code');
        setLoading(false);
        return;
      }

      const response = await verifyOtp(email, otpCode);
      setMessage(`✅ ${response.message || 'Verification Successful! Welcome to Krishi Rakshak!'}`);
      
      localStorage.removeItem('otpEmail'); // Clean up email

      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Invalid verification code. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setMessage('');
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/otp/resend`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessage(`🔄 ${data.message || 'Verification code sent successfully to your email'}`);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Error sending verification code'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-lime-100 relative overflow-hidden">
      {/* Animated agricultural elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-300/20 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl animate-pulse"></div>
      
      {/* Floating farm icons */}
      <div className="absolute top-20 left-20 text-6xl animate-bounce opacity-30">📱</div>
      <div className="absolute top-40 right-32 text-4xl animate-pulse opacity-40">🔐</div>
      <div className="absolute bottom-32 left-40 text-5xl animate-bounce opacity-30">📧</div>
      <div className="absolute bottom-20 right-20 text-4xl animate-pulse opacity-40">✉️</div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-xl border border-green-200/50 shadow-2xl rounded-3xl p-10 max-w-md w-full z-10 flex flex-col items-center relative"
      >
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛡️📨</div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Krishi Rakshak</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Verify Your Account
          </h2>
          <p className="text-sm text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-sm font-medium text-green-600 break-all">
            {email}
          </p>
        </div>

        {/* OTP Input Fields */}
        <div className="flex justify-between w-full mb-6 gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleBackspace(index, e)}
              className="w-12 h-14 text-center border-2 border-green-300 rounded-xl text-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white/80 hover:border-green-400"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-700 hover:to-emerald-700 transition duration-300 mb-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⏳</span>
              Verifying...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <span className="mr-2">🔍</span>
              Verify Code
            </span>
          )}
        </button>

        <div className="text-center text-sm text-gray-600 mb-4">
          <span>Didn't receive the code? </span>
          <button
            onClick={handleResend}
            className="text-green-600 hover:text-green-700 font-semibold hover:underline transition"
            disabled={loading}
          >
            <span className="inline-flex items-center">
              <span className="mr-1">🔄</span>
              Resend Code
            </span>
          </button>
        </div>

        {message && (
          <div className={`w-full p-3 rounded-lg mb-4 text-center text-sm ${
            message.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : message.includes('🔄')
              ? 'bg-blue-50 border border-blue-200 text-blue-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Security note */}
        <div className="w-full bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-green-700 text-center flex items-center justify-center">
            <span className="mr-2">🔒</span>
            This verification helps us protect your farming data and ensure account security
          </p>
        </div>

        {/* Agricultural themed footer */}
        <div className="text-center border-t border-green-200 pt-4 w-full">
          <p className="text-xs text-gray-500 mb-2">Securing agricultural technology</p>
          <div className="flex justify-center space-x-4 text-2xl">
            <span title="Data Security">🔐</span>
            <span title="Farm Protection">🛡️</span>
            <span title="Verified Farmers">✅</span>
            <span title="Trust Network">🤝</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Otp;