import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'https://your-app-name.herokuapp.com';

export const getProducts = () => axios.get(`${API_URL}/api/products`, { withCredentials: true });
export const getProduct = (id) => axios.get(`${API_URL}/api/products/${id}`, { withCredentials: true });
export const calculatePrice = (data) => axios.post(`${API_URL}/api/calculate-price`, data, { withCredentials: true });
export const addToCart = (formData) => axios.post(`${API_URL}/api/cart`, formData, { withCredentials: true });
export const getCart = () => axios.get(`${API_URL}/api/cart`, { withCredentials: true });
export const removeFromCart = (itemId) => axios.delete(`${API_URL}/api/cart/${itemId}`, { withCredentials: true });
export const submitOrder = (data) => axios.post(`${API_URL}/api/orders`, data, { withCredentials: true });