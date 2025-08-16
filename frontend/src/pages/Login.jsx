import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/auth/login', { email, password });
      navigate('/');
    } catch (e) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <div className="label">Email</div>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <div className="label">Password</div>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: '#ef4444', marginBottom: 8 }}>{error}</div>}
        <button className="btn" type="submit">Login</button>
      </form>
      <div style={{ marginTop: 8 }}>
        No account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}