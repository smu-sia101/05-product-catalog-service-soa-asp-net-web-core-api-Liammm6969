import React, { useState, useEffect } from 'react';
import '../CSS/Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Extract unique categories from products
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Function to display stock status with appropriate styling
  const renderStockStatus = (stock) => {
    if (stock > 10) {
      return <span className="stock-badge in-stock">In Stock</span>;
    } else if (stock > 0) {
      return <span className="stock-badge low-stock">Low Stock ({stock})</span>;
    } else {
      return <span className="stock-badge out-of-stock">Out of Stock</span>;
    }
  };

  return (
    <div className="product-browse">
      <div className="browse-header">
        <h1>Featured Products</h1>
        <p>Discover our collection of premium products</p>
      </div>
      
      <div className="search-filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="search-button">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div className="product-card" key={product.id}>
                <div className="product-img-container">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'} 
                    alt={product.name} 
                    className="product-img"
                  />
                  <div className="quick-actions">
                    <button className="action-btn view-btn">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button className="action-btn cart-btn">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">${product.price.toFixed(2)}</div>
                  <p className="product-desc">{product.description.length > 80 ? 
                    `${product.description.substring(0, 80)}...` : 
                    product.description}
                  </p>
                  <div className="product-footer">
                    {renderStockStatus(product.stock)}
                    <a href={`/product/${product.id}`} className="view-details">View Details</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="no-results">
              <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M12 14a2 2 0 100-4 2 2 0 000 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3>No products found</h3>
              <p>Try changing your search or filter criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;