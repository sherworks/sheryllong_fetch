import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Search from './pages/Search';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const stored = sessionStorage.getItem('loggedIn') === 'true';
    setIsLoggedIn(stored);
  }, [location.pathname]);

  if (isLoggedIn === null) return null;

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/search"
        element={isLoggedIn ? <Search /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;