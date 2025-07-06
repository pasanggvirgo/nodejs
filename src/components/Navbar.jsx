import { useNavigate } from 'react-router-dom';

const Navbar = ({ username, role, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '10px 20px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <strong
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          {role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
        </strong>
      </div>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        {role === 'admin' && (
          <span
            style={{
              cursor: 'pointer',
              border: '1px solid white',
              padding: '6px 10px',
              borderRadius: '4px'
            }}
            onClick={() => navigate('/add-product')}
          >
            ➕ Add Products
          </span>
        )}
        <span className='cart-button' 
        onClick={()=> navigate('/cart')}> 🛒 Cart</span>
        <span style={{ marginRight: '10px' }}>Hi, {username}</span>
        <button onClick={onLogout} className='Logout-button'>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
