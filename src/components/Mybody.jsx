import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import Cards from './Cards';

const Body = ({ role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [category, setCategory] = useState('');

  return (
    <>
      <br />
      <h2 style={{ textAlign: 'center' }}>Welcome to PackNest!</h2>
      <br />

      {/* Main layout container */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '40px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Filters */}
        <div
          style={{
            flex: '1 1 250px',
            
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 5px rgba(0,0,0,0.1)',
            marginLeft:'-100px',
            marginTop: '60px'
          }}
        >
          {/* Search */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{display: 'block', marginBottom: '5px',fontSize:'18px', fontWeight: 'bold' }}>
              Search Items
            </label>
            <br></br>
            <input
              type="text"
              placeholder="Search products...."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '180px',
                padding: '8px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div><br></br><br></br><br></br>
          <div> 
              <strong><label style={{display: 'block', marginBottom: '5px',fontSize:'18px', fontWeight: 'bold' }}>Select Category:</label></strong> <br></br>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '6px 10px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          >
            <option value="">All category</option>
            <option value="Jacket">Jacket</option>
            <option value="Pants">Pants</option>
            <option value="Tshirt">Tshirt</option>
            <option value="Trousers">Trousers</option>



            
          </select>
             </div><br></br><br></br><br></br>

          {/* Price Range */}
          <div style={{display: 'block', marginBottom: '5px',fontSize:'18px', fontWeight: 'bold' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Price Range
            </label><br></br>
            <ReactSlider
              className="custom-slider"
              thumbClassName="custom-thumb"
              trackClassName="custom-track"
              value={priceRange}
              onChange={setPriceRange}
              min={0}
              max={5000}
              pearling
              minDistance={200}
            />
            <p style={{ marginTop: '8px' }}>
              Price: Rs.{priceRange[0]} – Rs.{priceRange[1]}
            </p>
          </div>
        </div>

        {/* Right: Cards */}
        <div style={{ flex: '1 1 900px' }}>
          <Cards role={role} searchTerm={searchTerm} priceRange={priceRange} category={category} />
          
        </div>
      </div>
    </>
  );
};

export default Body;
