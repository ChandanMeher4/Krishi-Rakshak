import React from 'react';
import Navbar from './Navbar';
import { ChevronRight, Play, Leaf, Shield } from 'lucide-react'; // Make sure to import any icons you use in the layout

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center">
                <div className="relative">
                  <Leaf className="h-5 w-5 text-white" />
                  <Shield className="h-3 w-3 text-white absolute -bottom-1 -right-1" />
                </div>
              </div>
              <span className="text-2xl font-black">Krishi Rakhak</span>
            </div>

            <div className="flex gap-8 mb-6 md:mb-0">
              <a href="#" className="hover:text-green-400 transition-colors">About</a>
              <a href="#" className="hover:text-green-400 transition-colors">Help</a>
              <a href="#" className="hover:text-green-400 transition-colors">Contact</a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Krishi Rakhak. All rights reserved. Empowering farmers with AI technology.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;