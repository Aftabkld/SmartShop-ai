import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/api/ai/search', { query });
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { (async () => {
    try { const { data } = await api.get('/api/products'); setProducts(data); } catch {}
  })(); }, []);

  return (
    <div>
      <form onSubmit={search} className="row" style={{ marginBottom: 16 }}>
        <input className="input" placeholder="Search with AI (e.g., red shoes under $50)" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
      </form>

      <div className="grid">
        {products.map((p) => (
          <Link key={p._id} to={`/products/${p._id}`} className="card">
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div>${p.price}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{p.category?.name || ''}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}