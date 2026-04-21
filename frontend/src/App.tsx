import { useState } from 'react';
import Login from './components/Login';
import Terminal from './components/Terminal';

export default function App() {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem('auth_token'),
  );

  const handleLogin = (t: string) => {
    sessionStorage.setItem('auth_token', t);
    setToken(t);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    setToken(null);
  };

  return token ? (
    <Terminal token={token} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
