import React from 'react';
import LoginFormComponent from '../components/forms/LoginForm';
import '../styles/HalloweenTheme.css';
import '../styles/WebAnimation.css';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#2E003E] to-[#3D0052]">
      <LoginFormComponent />
    </div>
  );
}