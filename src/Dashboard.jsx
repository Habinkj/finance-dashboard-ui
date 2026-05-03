import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  
  // 1. React Memory for the AI Data
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. The Auto-Trigger (Runs once when the page loads)
  useEffect(() => {
    fetchAIAnalysis();
  }, []);

  const fetchAIAnalysis = async () => {
    try {
      // Grab the key from the vault
      const token = localStorage.getItem('jwt_token');
      
      if (!token) {
        console.error("No token found. Security breach detected.");
        navigate('/'); // Kick them out
        return;
      }

      // 🔥 FIRE THE PAYLOAD TO JAVA (WITH THE BADGE)
      // NOTE: Update this URL to your exact Java endpoint for the analysis
      const response = await axios.get('http://localhost:8080/expenses/insights', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Save the AI's response into React Memory
      setAiData(response.data);
      setLoading(false);
      setAiData(response.data);
      console.log("🔥 FULL PIPELINE PAYLOAD:", response.data); // <-- ADD THIS LINE
      setLoading(false);

    } catch (err) {
      console.error("Failed to fetch AI data:", err);
      
      // 🔥 THE UPGRADE: Catch the 403 Security bounce
      if (err.response && err.response.status === 403) {
        console.warn("JWT Token Expired or Invalid. Kicking to Login.");
        localStorage.removeItem('jwt_token'); // Burn the dead token
        navigate('/'); // Auto-redirect to login
        return;
      }

      // These lines were accidentally deleted!
      setError("Backend connection failed. Check server logs.");
      setLoading(false);
    } // <--- This closes the catch block
  }; // <--- This closes the fetchAIAnalysis function

  const handleLogout = () => {
    localStorage.removeItem('jwt_token'); 
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center mb-12 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-emerald-400">AI Behavior Engine</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500/10 text-red-500 px-4 py-2 rounded border border-red-500 hover:bg-red-500 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="text-center text-gray-400 text-xl animate-pulse mt-20">
          Neural network analyzing behavior...
        </div>
      )}

      {/* Data State (When AI responds) */}
      {!loading && aiData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Real Risk Level */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="text-gray-400 mb-2">Current Risk Level</h3>
              <p className={`text-4xl font-bold ${aiData.riskLevel === 'HIGH' ? 'text-red-500' : 'text-emerald-500'}`}>
                {aiData.riskLevel}
              </p>
            </div>

            {/* Real Behavior Pattern */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="text-gray-400 mb-2">Behavior Pattern</h3>
              <p className="text-4xl font-bold text-blue-400">
                {aiData.behaviorPattern}
              </p>
            </div>
          </div>

          {/* 🔥 NEW: THE K-MEANS SCATTER PLOT 🔥 */}
          {aiData.clusterData && aiData.clusterData.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mt-6">
               <h3 className="text-gray-400 mb-4">Transaction Clustering (K-Means)</h3>
               <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                     <XAxis type="number" dataKey="spend" name="Amount" unit="₹" stroke="#9CA3AF" />
                     <YAxis type="number" dataKey="frequency" name="Frequency" stroke="#9CA3AF" />
                     <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                     <Scatter name="Transactions" data={aiData.clusterData}>
                       {aiData.clusterData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.cluster === 0 ? '#10B981' : entry.cluster === 1 ? '#3B82F6' : '#EF4444'} />
                       ))}
                     </Scatter>
                   </ScatterChart>
                 </ResponsiveContainer>
               </div>
            </div>
          )}

          {/* Gemini AI Human Advice */}
          <div className="bg-gray-800 p-8 rounded-xl border border-emerald-500/30 shadow-lg mt-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <h3 className="text-emerald-400 mb-4 font-bold tracking-wider text-sm">GEMINI 2.5 FLASH INSIGHT</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {aiData.humanAdvice}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;