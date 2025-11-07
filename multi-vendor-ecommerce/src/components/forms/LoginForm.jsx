import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FormStyles.css';

// Import fonts
import '@fontsource/lobster-two';
import '@fontsource/nunito';
import '@fontsource/gloria-hallelujah';

/**
 * Login Form Component
 * Halloween themed login form with animations
 */
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Animation variants for form elements
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.03,
      boxShadow: "0 5px 15px rgba(232, 93, 4, 0.3)",
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.98 }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    // --- Authentication Logic Goes Here ---
    console.log('Logging in with:', { email, password });
    
    // On successful login:
    // 1. Save the auth token (e.g., in context or local storage)
    // 2. Redirect the user (e.g., to '/dashboard' or '/')
    
    // On failed login:
    // setError('Invalid email or password.');
  };

  return (
    <motion.div
      className="halloween-form-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Spooky Decorative Elements */}
      <div className="spooky-elements">
        <motion.div
          className="spider-web"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
        >
          <svg viewBox="0 0 100 100" fill="#FFF5E1">
            <path d="M0,0 L100,100 M0,100 L100,0 M50,0 L50,100 M0,50 L100,50" stroke="#FFF5E1" strokeWidth="1"/>
          </svg>
        </motion.div>
        <motion.div
          className="bats"
          animate={{ 
            y: [0, -10, 0],
            rotateY: [0, 180, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {/* Simple bat SVG shapes */}
          <svg viewBox="0 0 100 50" fill="#386641">
            <path d="M20,25 L10,15 L20,5 L30,15 L20,25 Z"/>
            <path d="M50,25 L40,15 L50,5 L60,15 L50,25 Z"/>
            <path d="M80,25 L70,15 L80,5 L90,15 L80,25 Z"/>
          </svg>
        </motion.div>
      </div>

      <h1 className="form-title">Welcome Back!</h1>
      <p className="form-subtitle">Enter if you dare...</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Email Input */}
        <motion.div variants={inputVariants}>
          <label htmlFor="email" className="halloween-label">
            Email address
          </label>
          <motion.input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="halloween-input"
            placeholder="you@example.com"
            whileFocus={{ scale: 1.01 }}
          />
        </motion.div>

        {/* Password Input */}
        <motion.div variants={inputVariants}>
          <label htmlFor="password" className="halloween-label">
            Password
          </label>
          <motion.input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="halloween-input"
            placeholder="••••••••"
            whileFocus={{ scale: 1.01 }}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="halloween-button"
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          Enter the Portal
        </motion.button>
      </form>
    </motion.div>
  );
}