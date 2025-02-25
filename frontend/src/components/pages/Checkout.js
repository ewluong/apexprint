import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitOrder } from '../../api';

const Checkout = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !address) {
      alert('Please fill in all fields.');
      return;
    }
    submitOrder({ name, email, address })
      .then(() => navigate('/thank-you'))
      .catch((error) => console.error('Failed to submit order:', error));
  };

  return (
    <div className="page">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Address:
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
};

export default Checkout;