import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import logo from '../assets/Fetch_Logo_Primary_Stacked.png';

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        console.log('Logging in with:', name, email);
      await axios.post(
        'https://frontend-take-home-service.fetch.com/auth/login',
        { name, email },
        { withCredentials: true }
      );

      sessionStorage.setItem('loggedIn', 'true');
      navigate('/search');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401 || err.response?.status === 400) {
        setError("Invalid name or email. Please use a valid test account.");
      } else {
        setError("Login failed. If you're using Incognito or Safari, make sure third-party cookies are enabled.");
      }
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="logo-wrapper">
          <img src={logo} alt="Fetch logo" className="logo" />
        </div>
        <h2 className="headline">Welcome to GoFetch!</h2>
        <p className="subtext">Shelter Dog Matching</p>
        <input
          className="login-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="login-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="login-button" type="submit">Log In</button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
