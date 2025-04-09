import React, { useState, useEffect } from 'react';
import '../CSS/Products.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState({
    id: '',
    name: '',
    price: 0,
    description: '',
    category: '',
    stock: 0,
    imageUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://localhost:7264/api/Products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        await updateProduct(currentProduct);
        showNotification(`Product "${currentProduct.name}" updated successfully`, 'success');
      } else {
        await createProduct(currentProduct);
        showNotification(`Product "${currentProduct.name}" created successfully`, 'success');
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification('Failed to save product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (product) => {
    const response = await fetch('https://localhost:7264/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }
  };

  const updateProduct = async (product) => {
    const response = await fetch(`https://localhost:7264/api/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product');
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
    setIsEditing(true);
    setFormVisible(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setIsLoading(true);
      
      try {
        const response = await fetch(`https://localhost:7264/api/products/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        
        showNotification(`Product "${name}" deleted successfully`, 'success');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Failed to delete product', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      id: '',
      name: '',
      price: 0,
      description: '',
      category: '',
      stock: 0,
      imageUrl: '',
    });
    setIsEditing(false);
    setFormVisible(false);
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const toggleForm = () => {
    if (formVisible && isEditing) {
      // If we're closing the form and we were editing, reset
      resetForm();
    } else {
      setFormVisible(!formVisible);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="product-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Product Management</h1>
          <p>Add, edit, and manage your product inventory</p>
        </div>
        <button 
          className={`toggle-form-btn ${formVisible ? 'active' : ''}`} 
          onClick={toggleForm}
        >
          {formVisible ? 'Close Form' : 'Add New Product'}
        </button>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Product Form */}
      {formVisible && (
        <div className="product-form-container">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={currentProduct.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={currentProduct.category}
                  onChange={handleInputChange}
                  placeholder="Enter category"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={currentProduct.stock}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity"
                  min="0"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={currentProduct.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                {isEditing ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="products-list-container">
        <div className="list-header">
          <h2>Product Inventory</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="search-button">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            <div className="product-count">
              <p>{filteredProducts.length} products found</p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="responsive-table">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="product-image">
                          <img
                            src={product.imageUrl || 'https://via.placeholder.com/50x50?text=No+Image'}
                            alt={product.name}
                          />
                        </td>
                        <td>{product.id}</td>
                        <td className="product-name">{product.name}</td>
                        <td className="product-price">${parseFloat(product.price).toFixed(2)}</td>
                        <td>{product.category}</td>
                        <td>
                          <span className={`stock-pill ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="actions">
                          <button 
                            className="btn-edit" 
                            onClick={() => handleEdit(product)}
                            title="Edit product"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDelete(product.id, product.name)}
                            title="Delete product"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-results">
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M12 14a2 2 0 100-4 2 2 0 000 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3>No products found</h3>
                <p>Try a different search term or add new products</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Product;