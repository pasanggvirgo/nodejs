import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cards from './Cards';

const CardDetails = ({cart,setCart}) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p._id === id);
        setProduct(found);
      })
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

   const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    const existingItemIndex = cart.findIndex(
      (item) =>
        item._id === product._id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    let updatedCart = [...cart];

    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      updatedCart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity,
      });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert('✅ Added to cart successfully');
  };



  const prevImage = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex(prev =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const arrowStyle = (position) => ({
    position: 'absolute',
    top: '50%',
    [position]: '10px',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    cursor: 'pointer',
    userSelect: 'none',
  });

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer'
  };

  if (!product) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading product...</p>;

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto' }}>
      {/* Two-Column Layout: Image and Product Info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        {/* Image Section */}
        <div style={{ flex: '1 1 150px',marginLeft:'10px', position: 'relative' }}>
          <img
            src={product.images[currentImageIndex]}
            alt={`${product.name}-${currentImageIndex}`}
            style={{
              width: '100%',
              aspectRatio: '4 / 5',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
          <button onClick={prevImage} style={arrowStyle('left')}>‹</button>
          <button onClick={nextImage} style={arrowStyle('right')}>›</button>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#555' }}>
            {currentImageIndex + 1} / {product.images.length}
          </div>
        </div>

        {/* Product Details Section */}
        <div style={{ marginLeft:'250px',flex: '1 1 0px' }}>
          <h1>{product.name}</h1>
          <p style={{ color: 'red' }}><strong>Price:</strong> Rs. {product.price}</p>
          <p style={{ fontSize: '18px' }}><strong>Description:</strong> {product.description}</p>
          <p style={{ fontSize: '18px' }}><strong>Category:</strong> {product.category}</p>

          {/* Size Selection */}
          <div style={{ marginTop: '20px' }}>
            <strong style={{ fontSize: '18px' }}>Select Size:</strong>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {product.sizes.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '5px',
                    border: selectedSize === size ? '2px solid #333' : '1px solid gray',
                    backgroundColor: selectedSize === size ? '#333' : '#f0f0f0',
                    color: selectedSize === size ? 'white' : 'black',
                    cursor: 'pointer'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div style={{ marginTop: '20px' }}>
            <strong style={{ fontSize: '18px' }}>Select Color:</strong>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {product.colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '5px',
                    border: selectedColor === color ? '2px solid #333' : '1px solid gray',
                    backgroundColor: selectedColor === color ? '#333' : '#f0f0f0',
                    color: selectedColor === color ? 'white' : 'black',
                    cursor: 'pointer'
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div style={{ marginTop: '20px' }}>
            <strong style={{ fontSize: '18px' }}>Quantity:</strong>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {[1, 2, 3, 4, 5].map(qty => (
                <button
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    backgroundColor: quantity === qty ? '#444' : '#eee',
                    color: quantity === qty ? 'white' : 'black',
                    border: '1px solid #ccc',
                    cursor: 'pointer'
                  }}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button onClick={handleAddToCart} style={{ ...buttonStyle, marginTop: '20px' }}>
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {product?.category && (
  <div style={{ marginTop: '10px' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>You might also like</h2>
    <Cards searchTerm={product.category} />
  </div>
)}

    </div>
  );
};

export default CardDetails;
