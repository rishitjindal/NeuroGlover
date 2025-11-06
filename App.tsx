
import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      {isLoggedIn ? <Dashboard /> : <LoginPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;
