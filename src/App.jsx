import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Body from './components/Mybody';
import AddProduct from './components/AddProducts';
import CardDetails from './components/CardDetails';
import EditProducts from './components/EditProducts';
import Cart from './components/Cart';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userMode, setUserMode] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      setMessage("Passwords don't match!");
      return;
    }

    const endpoint = isLogin ? 'login' : 'signup';

    try {
      const res = await fetch(`${process.env.BASE_URI}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, userMode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Something went wrong');
      } else {
        setMessage(data.message);
        if (isLogin) {
          setIsLoggedIn(true);
          navigate('/');
        } else {
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
          setMessage('Signup successful! Please log in.');
        }
      }
    } catch (error) {
      setMessage('Server error. Try again later.');
      console.error(error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setMessage('');
    setUserMode('');
    setIsLogin(true);
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', textAlign: 'center', marginTop: '70px' }}>
        <h2>{isLogin ? 'Login Page' : 'Signup Page'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br /><br />

          {!isLogin && (
            <>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <br /><br />
            </>
          )}

          <select
            value={userMode}
            onChange={(e) => setUserMode(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <br /><br />

          <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
        </form>
        <br />
        <button
          className="switchLoginSignup"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
            setPassword('');
            setConfirmPassword('');
            setUserMode('');
          }}
        >
          {isLogin ? 'Switch to Signup' : 'Switch to Login'}
        </button>
        <p style={{ color: 'red' }}>{message}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar username={username} role={userMode} onLogout={handleLogout} cart={cart} />
      
      <Routes>
        <Route path="/" element={<Body role={userMode} />} />
        <Route path="/product/:id" element={<CardDetails cart={cart} setCart={setCart} />} />
        <Route path="/edit/:id" element={<EditProducts />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route
          path="/add-product"
          element={
            userMode === 'admin' ? (
              <AddProduct username={username} role={userMode} onLogout={handleLogout} />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>Access Denied</div>
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
