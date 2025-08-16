import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get(`/api/products/${id}`); setProduct(data); } catch {}
    })();
  }, [id]);

  const addToCart = async () => {
    try {
      await api.post('/api/cart/add', { productId: id, quantity: qty });
      alert('Added to cart');
    } catch (e) {
      alert('Login required');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="card" style={{ padding: 16 }}>
      <h2>{product.name}</h2>
      <div>${product.price}</div>
      <p>{product.description}</p>
      <div className="row" style={{ gap: 8 }}>
        <input className="input" type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: 120 }} />
        <button className="btn" onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}