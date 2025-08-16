import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = async () => {
    try { const { data } = await api.get('/api/cart'); setCart(data); } catch {}
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (productId, quantity) => {
    await api.put('/api/cart/update', { productId, quantity });
    fetchCart();
  };

  const removeItem = async (productId) => {
    await api.delete(`/api/cart/remove/${productId}`);
    fetchCart();
  };

  const clear = async () => { await api.delete('/api/cart/clear'); fetchCart(); };

  const total = cart.items?.reduce((sum, i) => sum + i.quantity * (i.product?.price || 0), 0) || 0;

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.items?.length === 0 ? (
        <div>Cart is empty</div>
      ) : (
        <div>
          {cart.items.map((i) => (
            <div key={i.product._id} className="card" style={{ marginBottom: 8, padding: 12 }}>
              <div className="space-between">
                <div>
                  <div style={{ fontWeight: 600 }}>{i.product.name}</div>
                  <div>${i.product.price}</div>
                </div>
                <div className="row">
                  <input className="input" type="number" min={1} value={i.quantity} onChange={(e) => updateQty(i.product._id, Number(e.target.value))} style={{ width: 100 }} />
                  <button className="btn danger" onClick={() => removeItem(i.product._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}

          <div className="space-between" style={{ marginTop: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Total: ${total.toFixed(2)}</div>
            <button className="btn secondary" onClick={clear}>Clear Cart</button>
          </div>
        </div>
      )}
    </div>
  );
}