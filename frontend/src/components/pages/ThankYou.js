import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => (
  <div className="page">
    <h1>Thank You!</h1>
    <p>Your order has been received. We'll process it soon.</p>
    <Link to="/">Return to Home</Link>
  </div>
);

export default ThankYou;