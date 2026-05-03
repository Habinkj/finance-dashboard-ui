import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setErrorMessage(''); // Clear old errors

    try {
      // 1. Fire the payload at the Java server
      const response = await axios.post('http://localhost:8080/users/login', {
        email: email,
        password: password
      });

      // 2. Java approved. Grab the JWT token it sent back.
      const token = response.data;
      console.log("🔥 BRIDGE CONNECTED. JWT TOKEN SECURED:", token);

      // 3. Lock the token in the browser's vault
      localStorage.setItem('jwt_token', token);
      
      navigate('/dashboard');

    } catch (err) {
      // Java rejected the credentials or the server is offline
      console.error("Network Crash:", err);
      setErrorMessage("Access Denied. Invalid credentials or backend offline.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
        
        <h2 className="text-3xl font-bold text-white mb-6 text-center">AI Finance</h2>

        {/* Dynamic Error Box */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Email</label>
          <input 
            type="email" 
            className="w-full p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Password</label>
          <input 
            type="password" 
            className="w-full p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded transition-colors"
        >
          Secure Login
        </button>

      </form>
    </div>
  );
}

export default Login;