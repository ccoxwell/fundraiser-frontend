import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductModal from './ProductModal';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      setMessage({ type: 'success', text: 'Product deleted successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete product' });
    }
  };

  const handleProductSave = async (productData) => {
    try {
      if (editingProduct) {
        // Update existing product
        const response = await axios.put(`/api/products/${editingProduct.id}`, productData);
        setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        // Create new product
        const response = await axios.post('/api/products', productData);
        setProducts([...products, response.data]);
        setMessage({ type: 'success', text: 'Product created successfully!' });
      }
      
      setShowModal(false);
      setEditingProduct(null);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to save product';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric'
  //   });
  // };

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
          <h1>🛍️ Product Management</h1>
          <p>Manage your fundraiser products and pricing</p>
        </div>
        
        <div className="card-body">
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#333', margin: 0 }}>Current Products ({products.length})</h3>
            <button
              className="btn btn-primary"
              onClick={handleAddProduct}
            >
              ➕ Add New Product
            </button>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No products found</p>
              <p>Click "Add New Product" to get started!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product #</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>
                        <span style={{ 
                          backgroundColor: '#f0f8ff', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px',
                          fontWeight: '600',
                          color: '#667eea'
                        }}>
                          {product.productNumber}
                        </span>
                      </td>
                      <td>
                        <strong>{product.productDescription}</strong>
                      </td>
                      <td style={{ fontWeight: '600', color: '#27ae60' }}>
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handleEditProduct(product)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onSave={handleProductSave}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;