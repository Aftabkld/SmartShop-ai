import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (category) params.set('category', category);
    const url = params.toString() ? `/api/products?${params}` : '/api/products';
    const { data } = await api.get(url);
    setProducts(data);
  };

  useEffect(() => { (async () => { try { const { data } = await api.get('/api/categories'); setCategories(data); } catch {} })(); }, []);
  useEffect(() => { (async () => { try { await fetchProducts(); } catch {} })(); }, []);

  return (
    <div>
      <div className="row" style={{ gap: 8, marginBottom: 16 }}>
        <input className="input" placeholder="Keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <button className="btn" onClick={fetchProducts}>Filter</button>
      </div>
      <div className="grid">
        {products.map((p) => (
          <Link key={p._id} to={`/products/${p._id}`} className="card">
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div>${p.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}