import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cards = ({ searchTerm = '', priceRange = [0, Infinity], category = '', role = 'user' }) => {
  const [items, setItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');
  const navigate = useNavigate();
  

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      fetch(`http://localhost:5000/products/${id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            setItems(items.filter((item) => item._id !== id));
            alert('Product deleted');
          } else {
            alert('Failed to delete');
          }
        })
        .catch((err) => console.error('Error deleting product:', err));
    }
  };

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const withinPriceRange = item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesCategory = !category || item.category === category;
    return matchesSearch && withinPriceRange && matchesCategory;
  });

  // Sort logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === 'lowToHigh') return a.price - b.price;
    if (sortOrder === 'highToLow') return b.price - a.price;
    return 0;
  });

  return (
    <div style={{ padding: '20px', margin: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Products</h2>

        {/* Sort Dropdown */}
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold' }}>Sort:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: '6px 10px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          >
            <option value="default">Default</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '50px',
          marginTop: '30px',
        }}
      >
        {sortedItems.map((item) => (
          <div
            key={item._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '20px',
              width: '220px',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              position: 'relative',
            }}
          >
            <div onClick={() => navigate(`/product/${item._id}`)} style={{ cursor: 'pointer' }}>
              {/* Main Image */}
              {item.images.length > 0 && (
                <img
                  src={item.images[0]}
                  alt={`${item.name} main`}
                  style={{
                    width: '100%',
                    height: '220px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    marginBottom: '5px',
                  }}
                />
              )}

              {/* Thumbnail Images */}
              {item.images.length > 1 && (
                <div
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '5px',
                    marginBottom: '10px',
                  }}
                >
                  {item.images.slice(1).map((imgSrc, idx) => (
                    <img
                      key={idx}
                      src={imgSrc}
                      alt={`${item.name} ${idx + 2}`}
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Product Name */}
              <h3>{item.name}</h3>
            </div>

            {/* Price + Admin Buttons in same row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '-10px',
              }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rs. {item.price}</span>

              {role === 'admin' && (
                <div
                  style={{ display: 'flex', gap: '5px' }}
                  onClick={(e) => e.stopPropagation()} // Prevent navigating when clicking buttons
                >
                  <button
                    onClick={() => navigate(`/edit/${item._id}`)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;