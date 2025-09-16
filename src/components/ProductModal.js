import React from 'react';
import { useForm } from 'react-hook-form';

const ProductModal = ({ product, onSave, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      productNumber: product?.productNumber || '',
      productDescription: product?.productDescription || '',
      price: product?.price || ''
    }
  });

  const onSubmit = (data) => {
    onSave({
      ...data,
      price: parseFloat(data.price)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Product Number *</label>
            <input
              type="text"
              className={`form-input ${errors.productNumber ? 'error' : ''}`}
              placeholder="e.g., FUN001"
              {...register('productNumber', { 
                required: 'Product number is required',
                pattern: {
                  value: /^[A-Z0-9]+$/,
                  message: 'Product number should only contain uppercase letters and numbers'
                }
              })}
            />
            {errors.productNumber && (
              <div className="error-message">{errors.productNumber.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Product Description *</label>
            <input
              type="text"
              className={`form-input ${errors.productDescription ? 'error' : ''}`}
              placeholder="e.g., Chocolate Candy Bar"
              {...register('productDescription', { 
                required: 'Product description is required',
                minLength: {
                  value: 3,
                  message: 'Description must be at least 3 characters'
                }
              })}
            />
            {errors.productDescription && (
              <div className="error-message">{errors.productDescription.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`form-input ${errors.price ? 'error' : ''}`}
              placeholder="0.00"
              {...register('price', { 
                required: 'Price is required',
                min: {
                  value: 0.01,
                  message: 'Price must be greater than $0.00'
                },
                max: {
                  value: 999.99,
                  message: 'Price must be less than $999.99'
                }
              })}
            />
            {errors.price && (
              <div className="error-message">{errors.price.message}</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {product ? '💾 Update Product' : '➕ Add Product'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;