const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  return {
    'Content-Type': 'application/json',
    ...(user.token ? { Authorization: `Bearer ${user.token}` } : {})
  };
};

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/products?${query}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const fetchFeaturedProducts = async () => {
  const response = await fetch(`${API_URL}/products/featured`);
  if (!response.ok) throw new Error('Failed to fetch featured products');
  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  return response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  return response.json();
};

// ─── Order APIs ────────────────────────────────────────────────────────────────

export const createRazorpayOrder = async ({ items, shippingAddress }) => {
  const response = await fetch(`${API_URL}/orders/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ items, shippingAddress })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }
  return response.json();
};

export const verifyRazorpayPayment = async (data) => {
  const response = await fetch(`${API_URL}/orders/verify-payment`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Payment verification failed');
  }
  return response.json();
};

export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/orders/my-orders`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch orders');
  }
  return response.json();
};

// ─── Custom Order APIs ────────────────────────────────────────────────────────

export const submitCustomOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/custom-orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit custom order');
  }
  return response.json();
};

export const getMyCustomOrders = async () => {
  const response = await fetch(`${API_URL}/custom-orders/my-orders`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch custom orders');
  }
  return response.json();
};

export const getAllCustomOrdersAdmin = async () => {
  const response = await fetch(`${API_URL}/custom-orders/admin/all`, {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch all custom orders');
  }
  return response.json();
};

export const updateCustomOrderAdmin = async (id, updateData) => {
  const response = await fetch(`${API_URL}/custom-orders/admin/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update custom order');
  }
  return response.json();
};

export const createCustomRazorpayOrder = async (id) => {
  const response = await fetch(`${API_URL}/custom-orders/${id}/pay`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create payment order');
  }
  return response.json();
};

export const verifyCustomRazorpayPayment = async (id, data) => {
  const response = await fetch(`${API_URL}/custom-orders/${id}/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Payment verification failed');
  }
  return response.json();
};

