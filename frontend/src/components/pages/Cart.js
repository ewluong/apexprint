import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart } from '../../api';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCart()
      .then((response) => {
        setCart(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load cart:', error);
        setLoading(false);
      });
  }, []);

  const handleRemove = (itemId) => {
    removeFromCart(itemId)
      .then(() => {
        setCart(cart.filter((item) => item.id !== itemId));
      })
      .catch((error) => console.error('Failed to remove item:', error));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <p>{item.productName} - Quantity: {item.quantity}, Size: {item.size}, Paper Type: {item.paperType}, Price: ${item.price.toFixed(2)}</p>
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </div>
          ))}
          <p>Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default Cart;