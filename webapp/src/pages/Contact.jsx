import React, { useState } from 'react';
import { Mail, Phone, MapPin, User, MessageCircle, Send } from 'lucide-react';

// Make sure these components are accessible from your main project.
// If not, you will need to copy them from your dashboard file.
const Button = ({ children, onClick, className = "", variant = "primary", size = "md" }) => {
  const baseClasses = "rounded-xl font-bold transition-all flex items-center justify-center";
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  const variantClasses = {
    primary: "text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600",
    secondary: "bg-white text-green-700 border border-green-300 hover:bg-green-50",
    danger: "bg-red-100 text-red-700 hover:bg-red-200"
  };
  
  return (
    <button 
      onClick={onClick} 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", title, action }) => (
  <div className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 ${className}`}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="font-semibold text-gray-800">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
);


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // You can add your form submission logic here, e.g., an API call
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="p-6 pt-20"> {/* The 'pt-20' class adds top padding to make space for the navbar */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Form */}
        <Card title="Send us a message">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-green-500">
                <User size={18} className="text-gray-400 ml-3" />
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 bg-transparent rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none"
                  placeholder="Your Name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-green-500">
                <Mail size={18} className="text-gray-400 ml-3" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 bg-transparent rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <div className="mt-1 flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-green-500">
                <MessageCircle size={18} className="text-gray-400 ml-3" />
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 bg-transparent rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none"
                  placeholder="Your message here..."
                ></textarea>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              <Send size={16} className="mr-2" />
              Send Message
            </Button>
          </form>
        </Card>
        
        {/* Contact Information */}
        <div className="space-y-6">
          <Card title="Our Information">
            <div className="flex items-center space-x-3 mb-4">
              <Mail size={24} className="text-green-600" />
              <div>
                <p className="font-semibold text-gray-800">Email Address</p>
                <p className="text-gray-600">contact@krishirakhak.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <Phone size={24} className="text-green-600" />
              <div>
                <p className="font-semibold text-gray-800">Phone Number</p>
                <p className="text-gray-600">+91 70048 51355</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin size={24} className="text-green-600" />
              <div>
                <p className="font-semibold text-gray-800">Our Location</p>
                <p className="text-gray-600">Motihari, Bihar, India</p>
              </div>
            </div>
          </Card>
          
          <Card title="Our Location" className="h-64 flex items-center justify-center">
            {/* Placeholder for an interactive map */}
            <div className="text-center text-gray-500">
              <p>Map Coming Soon...</p>
              <p className="text-sm">You can embed a Google Maps or Leaflet component here.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;