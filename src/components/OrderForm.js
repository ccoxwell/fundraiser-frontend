import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load products' });
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    if (numQuantity > 0) {
      setOrderItems(prev => ({
        ...prev,
        [productId]: numQuantity
      }));
    } else {
      setOrderItems(prev => {
        const newItems = { ...prev };
        delete newItems[productId];
        return newItems;
      });
    }
  };

  const calculateSubtotal = (productId, price) => {
    const quantity = orderItems[productId] || 0;
    return quantity * price;
  };

  const calculateGrandTotal = () => {
    return products.reduce((total, product) => {
      return total + calculateSubtotal(product.id, product.price);
    }, 0);
  };

  const getOrderItemsArray = () => {
    return Object.entries(orderItems).map(([productId, quantity]) => {
      const product = products.find(p => p.id === parseInt(productId));
      return {
        productId: parseInt(productId),
        quantity: quantity,
        price: product.price
      };
    });
  };

  const onSubmit = async (data) => {
    const items = getOrderItemsArray();
    if (items.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one item to your order' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const orderData = {
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          address: data.address
        },
        items: items
      };

      await axios.post('/api/orderproducts', orderData);
      
      setMessage({ 
        type: 'success', 
        text: `Order placed successfully! Total: $${calculateGrandTotal().toFixed(2)}` 
      });
      
      // Reset form and order items
      reset();
      setOrderItems({});
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to place order';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const hasItems = Object.keys(orderItems).length > 0;
  const grandTotal = calculateGrandTotal();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1>🎯 Place Your Order</h1>
          <p>Let us know what you'd like and Rocket will hand-deliver it to your doorstep!</p>

          <p>Here are links to the product brochures for the <a href="https://www.centuryresources.com/wp-content/uploads/2025/08/WEB-2025-CENTURY-SWEETS.pdf" target="_blank" and rel="noopener noreferrer">sweets</a> and <a href="https://www.centuryresources.com/wp-content/uploads/2025/08/WEB-2025-CENTURY-PRIDE.pdf" target="_blank" and rel="noopener noreferrer">other things</a>.</p>
        </div>
        
        <div className="card-body">
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Customer Information */}
            <div className="form-group">
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>👤 Customer Information</h3>
              
              <div className="form-row">
                <div>
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    {...register('firstName', { 
                      required: 'First name is required',
                      minLength: { value: 2, message: 'First name must be at least 2 characters' }
                    })}
                  />
                  {errors.firstName && <div className="error-message">{errors.firstName.message}</div>}
                </div>
                
                <div>
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    {...register('lastName', { 
                      required: 'Last name is required',
                      minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                    })}
                  />
                  {errors.lastName && <div className="error-message">{errors.lastName.message}</div>}
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: { value: /^[\d\s\-()+]+$/, message: 'Invalid phone number format' }
                    })}
                  />
                  {errors.phone && <div className="error-message">{errors.phone.message}</div>}
                </div>
                
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { 
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                        message: 'Invalid email address' 
                      }
                    })}
                  />
                  {errors.email && <div className="error-message">{errors.email.message}</div>}
                </div>
              </div>

              <div>
                <label className="form-label">Address *</label>
                <input
                  type="text"
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  {...register('address', { 
                    required: 'Address is required',
                    minLength: { value: 10, message: 'Please enter a complete address' }
                  })}
                />
                {errors.address && <div className="error-message">{errors.address.message}</div>}
              </div>
            </div>

            {/* Products Table */}
            <div className="form-group">
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>🛍️ Select Products</h3>
              
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div>
                          <strong>{product.productDescription}</strong>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>
                            #{product.productNumber}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: '600', color: '#27ae60' }}>
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          className="quantity-input"
                          value={orderItems[product.id] || 0}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        />
                      </td>
                      <td style={{ fontWeight: '600', color: '#667eea' }}>
                        ${calculateSubtotal(product.id, product.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>

      {/* Sticky Footer */}
      {hasItems && (
        <div className="sticky-footer">
          <div className="footer-content">
            <div className="total-display">
              Grand Total: <span className="total-amount">${grandTotal.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              form="order-form"
              className="btn btn-primary btn-large"
              disabled={submitting || !hasItems}
              onClick={handleSubmit(onSubmit)}
            >
              {submitting ? '🔄 Placing Order...' : '✅ Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;