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
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else if (error instanceof Error) {
      console.error('General error:', error.message);
    } else {
      console.error('Unknown error occurred');
    }

    setError(
      "Login failed. If you're using Incognito or Safari, make sure third-party cookies are enabled. In addition, please make sure you are using a valid test account."
    );
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
