// src/Context/AppContext.js
import React from "react";
import { createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase"; // Assuming firebase.js is in your src folder

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Set to true to handle initial auth state check
  const [error, setError] = useState(null);

  // 🔹 Check authentication state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in. You can get user info here.
        console.log("✅ User is authenticated with Firebase:", firebaseUser);
        setUser(firebaseUser);
      } else {
        // User is signed out.
        console.log("⚠️ User is not authenticated.");
        setUser(null);
      }
      setLoading(false);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  // 🔹 REGISTER with Firebase
  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Use Firebase function to create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Registration successful with Firebase!");
      // The `onAuthStateChanged` listener above will handle setting the user state.
      return userCredential.user;
    } catch (err) {
      const msg = err.message || "Registration failed";
      setError(msg);
      console.error("❌ Firebase registration error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOGIN with Firebase
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Use Firebase function to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login successful with Firebase!");
      // The `onAuthStateChanged` listener above will handle setting the user state.
      return userCredential.user;
    } catch (err) {
      const msg = err.message || "Login failed";
      setError(msg);
      console.error("❌ Firebase login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOGOUT with Firebase
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      console.log("✅ Logout successful with Firebase!");
      // The `onAuthStateChanged` listener will handle setting user to null.
    } catch (err) {
      setError(err.message || "Logout failed");
      console.error("❌ Firebase logout error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Note: The `verifyOtp`, `verifyAuth`, and `userInfo` functions are no longer needed
  // as Firebase handles all authentication state and token management internally.

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};