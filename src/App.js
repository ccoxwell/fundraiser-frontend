import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OrderForm from './components/OrderForm';
import Dashboard from './components/Dashboard';
// import ProductManagement from './components/ProductManagement';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🚀 Rocket's School Fundraiser!
            </Link>
            {/* <div className="nav-menu"> */}
              {/* <Link to="/" className="nav-link">Place Order</Link> */}
              {/* <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/products" className="nav-link">Manage Products</Link> */}
            {/* </div> */}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<OrderForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/products" element={<ProductManagement />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;