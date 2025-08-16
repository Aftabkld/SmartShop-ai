import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/auth/profile');
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
      } catch {}
    })();
  }, []);

  const save = async () => {
    setMsg('');
    try {
      const { data } = await api.put('/api/users/profile', { name, email, password: password || undefined });
      setMsg('Profile updated');
      setProfile(data);
      setPassword('');
    } catch {
      setMsg('Update failed');
    }
  };

  if (!profile) return <div>Login required</div>;

  return (
    <div className="card" style={{ maxWidth: 500 }}>
      <h2>Profile</h2>
      <div style={{ marginBottom: 8 }}>
        <div className="label">Name</div>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <div className="label">Email</div>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <div className="label">New Password</div>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {msg && <div style={{ marginBottom: 8 }}>{msg}</div>}
      <button className="btn" onClick={save}>Save</button>
    </div>
  );
}