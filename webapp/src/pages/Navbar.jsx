import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import {
  Shield,
  Leaf,
  Menu,
  X,
} from "lucide-react";

// A reusable card component to maintain the design
const GlassCard = ({
  children,
  className = "",
  variant = "default",
  hover = true,
}) => {
  const baseClasses =
    "backdrop-blur-md border border-white/20 rounded-3xl transition-all duration-300";
  const variants = {
    default: "bg-white/10",
    elevated: "bg-white/20 shadow-2xl",
    solid: "bg-white/90 shadow-lg",
  };

  const hoverEffect = hover
    ? "hover:bg-white/20 hover:shadow-xl hover:scale-[1.02]"
    : "";

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${hoverEffect} ${className}`}
    >
      {children}
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 20;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  }, [isScrolled]);

  useEffect(() => {
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Weather", onClick: () => navigate("/weather") },
    { label: "Dashboard", onClick: () => navigate("/dashboard") },
    { label: "Contact", onClick: () => navigate("/contact") },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 animate-slide-down ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <GlassCard
          className={`px-6 py-4 transition-all duration-500 ${
            isScrolled
              ? "bg-white/25 backdrop-blur-3xl shadow-3xl"
              : "bg-white/10"
          }`}
          variant={isScrolled ? "elevated" : "default"}
          hover={false}
        >
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group hover:scale-105 transition-transform duration-300"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <Leaf className="h-6 w-6 text-white" />
                    <Shield className="h-4 w-4 text-white absolute -bottom-1 -right-1" />
                  </div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-300" />
              </div>
              <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
                Krishi Rakhak
              </span>
            </div>
            {/* Desktop Navigation */}
            {user && (
              <div className="hidden lg:flex items-center gap-8">
                {navItems.map((item, index) => (
                  <div
                    key={item.label}
                    className="relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <button
                      onClick={item.onClick}
                      className="font-medium transition-all duration-300 hover:scale-105 text-gray-800 hover:text-green-600"
                    >
                      {item.label}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <button
                    className="hidden md:block px-6 py-2 text-gray-800 hover:text-green-600 font-medium transition-all duration-300 hover:scale-105"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  className="px-6 py-3 rounded-2xl bg-green-500 text-white font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  onClick={async () => {
                    await logout();
                  }}
                >
                  Logout
                </button>
              )}
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/20 transition-all duration-300 mobile-menu-container hover:scale-105"
              >
                <div className="transition-transform duration-200">
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </div>
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          <div
            className={`lg:hidden overflow-hidden mobile-menu-container transition-all duration-300 ${
              isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="mt-4 py-4 border-t border-white/20">
              {navItems.map((item, index) => (
                <button
                  key={item.label}
                  className={`flex items-center justify-between w-full text-left py-3 px-4 rounded-xl transition-all duration-300 hover:bg-white/10`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;