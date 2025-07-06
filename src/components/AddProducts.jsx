import React, { useState } from 'react';

const AddProduct = ({ username, role }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [category, setCategory] = useState('');

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('sizes', selectedSizes.join(','));
    formData.append('colors', selectedColors.join(','));
    formData.append('category',category );
    images.forEach((img) => formData.append('images', img));

    try {
      const res = await fetch('${process.env.BASE_URI}/add-product', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSuccessMessage('Product added successfully!');
        setName('');
        setPrice('');
        setDescription('');
        setCategory('');
        setImages([]);
        setSelectedSizes([]);
        setSelectedColors([]);
        setCategory();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to add product');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  if (role !== 'admin') return <div>Access Denied</div>;

  return (
    <div style={{ maxWidth: '550px', margin: '50px auto', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
      <h3 style={{ textAlign: 'center' }}>Add New Product</h3>
      {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Name */}
        <div style={{ marginBottom: '10px' }}>
          <label>Product Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '6px', marginTop: '4px' }}
          />
        </div>

        {/* Price */}
        <div style={{ marginBottom: '10px' }}>
          <label>Price (Rs.):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
            style={{ width: '100%', padding: '6px', marginTop: '4px' }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            style={{ width: '100%', padding: '6px', marginTop: '4px' }}
          />
        </div>

        {/* Sizes */}
        <div style={{ marginBottom: '10px' }}>
          <label>Available Sizes:</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            {['S', 'M', 'L', 'XL'].map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div style={{ marginBottom: '10px' }}>
          <label>Available Colors:</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            {['Red', 'Blue', 'Green', 'Black', 'White'].map((color) => (
              <label key={color}>
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => handleColorChange(color)}
                />
                {color}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={{ marginRight:'10px'}}>Select Category:</label>
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
        </div>
      

        {/* Image Upload */}
        <div style={{ marginBottom: '10px' }}>
          <label>Upload Product Images:</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          <p style={{ fontSize: '0.8rem', color: 'gray' }}>You can select multiple images (max 5).</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            marginTop: '10px',
            padding: '10px 16px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
