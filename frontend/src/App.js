import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import GameAnalysis from './GameAnalysis';
import ImportGames from './ImportGames';
import PredictMove from './components/PredictMove';
import ChessBooks from './components/ChessBooks';
import PlayAndLearn from './components/PlayAndLearn';
import GrandmasterGames from './components/GrandmasterGames';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    console.log('App state:', { isLoggedIn, username });
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setUsername(localStorage.getItem('username') || 'Guest');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    console.log('Login success:', user);
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem('username', user);
    localStorage.setItem('token', 'dummy-token'); // Replace with actual token
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard username={username} /> : <Navigate to="/login" />}
        >
          
          <Route path="import" element={<ImportGames username={username} />} />
          
          <Route index element={<div>Welcome to the Dashboard!</div>} />
        </Route>
        <Route path="/predict" element={<PredictMove />} />
        
        <Route
          path="/analysis/:analysisId"
          element={isLoggedIn ? <GameAnalysis username={username} /> : <Navigate to="/login" />}
        />
        <Route
          path="/analysis/new"
          element={isLoggedIn ? <GameAnalysis username={username} /> : <Navigate to="/login" />}
        />
        <Route
          path="/chess-books"
          element={isLoggedIn ? <ChessBooks /> : <Navigate to="/login" />}
        />
        <Route
          path="/find-learn"
          element={isLoggedIn ? <PlayAndLearn username={username} /> : <Navigate to="/login" />}
        />
        <Route path="learn-grandmaster" element={<GrandmasterGames username={username} />} />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;