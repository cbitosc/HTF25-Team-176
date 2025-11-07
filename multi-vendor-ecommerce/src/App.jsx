import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginForm.jsx';
import SignUpPage from './pages/SignUpForm.jsx';
import ProfileLayout from './pages/profile/ProfileLayout.jsx';
import './styles/HalloweenTheme.css';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Landing/Home Page */}
        <Route 
          path="/" 
          element={
            <div className="landing-container min-h-screen bg-gradient-to-b from-[#2E003E] to-[#3D0052] text-[#FFF5E1] flex flex-col items-center justify-center p-8">
              <h1 className="text-5xl font-bold mb-8 text-[#E85D04]" style={{ fontFamily: 'Gloria Hallelujah, cursive' }}>
                Spooky E-Commerce 🎃
              </h1>
              <div className="auth-links space-x-6 mt-8">
                <Link 
                  to="/login"
                  className="px-6 py-3 bg-[#E85D04] text-[#2E003E] rounded-lg font-bold hover:bg-[#FFD60A] transition-colors duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="px-6 py-3 bg-[#386641] text-[#FFF5E1] rounded-lg font-bold hover:bg-[#FFD60A] hover:text-[#2E003E] transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          } 
        />

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Profile Section */}
        <Route path="/profile/*" element={<ProfileLayout />} />
      </Routes>
    </div>
  );
}

export default App;