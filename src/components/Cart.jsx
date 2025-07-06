const Cart = ({ cart, setCart }) => {
  console.log('Cart content:', cart);

  if (!Array.isArray(cart)) {
    return <h2>❌ Cart data invalid: {JSON.stringify(cart)}</h2>;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    alert('✅ Checkout Successful!');
    setCart([]); // Clear cart after checkout
  };

  const handleRemove = (id, size, color) => {
    const updated = cart.filter(
      (item) => !(item._id === id && item.size === size && item.color === color)
    );
    setCart(updated);
  };

  if (cart.length === 0) return <h2 style={{ textAlign: 'center' }}>🛒 Cart is empty</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h2>🛒 Your Cart</h2>
      {cart.map((item, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '10px',
            display: 'flex',
            gap: '20px',
          }}
        >
          <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
          <div>
            <h4>{item.name}</h4>
            <p>Size: {item.size} | Color: {item.color}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: Rs. {item.price * item.quantity}</p>
            <button onClick={() => handleRemove(item._id, item.size, item.color)}>❌ Remove</button>
          </div>
        </div>
      ))}
      <h3>Total: Rs. {total}</h3>
      <button onClick={handleCheckout} style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white' }}>
        ✅ Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
