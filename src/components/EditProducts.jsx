import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setCategory(data.category);
        setSizes(data.sizes);
        setColors(data.colors);
        setImages(data.images);
      })
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      name,
      price,
      description,
      category,
      sizes,
      colors,
      images
    };

    fetch(`http://localhost:5000/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    })
      .then(res => {
        if (res.ok) {
          alert('Product updated successfully');
          navigate('/dashboard'); // redirect to dashboard
        } else {
          alert('Failed to update product');
        }
      })
      .catch(err => console.error('Error updating product:', err));
  };

  const handleAddSize = () => {
    const size = prompt('Enter new size:');
    if (size) setSizes([...sizes, size]);
  };

  const handleAddColor = () => {
    const color = prompt('Enter new color:');
    if (color) setColors([...colors, color]);
  };

  const handleAddImage = () => {
    const url = prompt('Enter image URL:');
    if (url) setImages([...images, url]);
  };

  if (!product) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading product...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        {/* Sizes */}
        <div>
          <strong>Sizes:</strong>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {sizes.map((size, idx) => (
              <div key={idx} style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px' }}>
                {size}
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddSize} style={{ marginTop: '5px' }}>Add Size</button>
        </div>

        {/* Colors */}
        <div>
          <strong>Colors:</strong>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {colors.map((color, idx) => (
              <div key={idx} style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px' }}>
                {color}
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddColor} style={{ marginTop: '5px' }}>Add Color</button>
        </div>

        {/* Images */}
        <div>
          <strong>Images:</strong>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`img-${idx}`} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
            ))}
          </div>
          <button type="button" onClick={handleAddImage} style={{ marginTop: '5px' }}>Add Image</button>
        </div>

        <button type="submit" style={{ backgroundColor: 'green', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
