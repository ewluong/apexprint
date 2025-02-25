import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, calculatePrice, addToCart } from '../../api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [size, setSize] = useState('');
  const [paperType, setPaperType] = useState('');
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load product:', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (quantity && size && paperType && product) {
      calculatePrice({ quantity, size, paperType })
        .then((response) => setPrice(response.data.price))
        .catch((error) => console.error('Failed to calculate price:', error));
    }
  }, [quantity, size, paperType, product]);

  const handleAddToCart = () => {
    if (!quantity || !size || !paperType || !file) {
      alert('Please select all options and upload a file.');
      return;
    }
    const formData = new FormData();
    formData.append('productId', id);
    formData.append('quantity', quantity);
    formData.append('size', size);
    formData.append('paperType', paperType);
    formData.append('file', file);
    addToCart(formData)
      .then(() => alert('Item added to cart!'))
      .catch((error) => console.error('Failed to add to cart:', error));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page">
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <form>
        <label>
          Quantity:
          <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
            <option value="">Select Quantity</option>
            {Object.keys(product.quantityOptions).map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </label>
        <label>
          Size:
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Select Size</option>
            {Object.keys(product.sizeOptions).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Paper Type:
          <select value={paperType} onChange={(e) => setPaperType(e.target.value)}>
            <option value="">Select Paper Type</option>
            {Object.keys(product.paperTypeOptions).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label>
          Upload File:
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/jpeg,image/png,image/gif,application/pdf,image/svg+xml"
          />
        </label>
        <p>Price: ${price.toFixed(2)}</p>
        <button type="button" onClick={handleAddToCart}>Add to Cart</button>
      </form>
    </div>
  );
};

export default ProductDetail;