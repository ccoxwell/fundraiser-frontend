import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
//   const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersResponse] = await Promise.all([
        axios.get('https://fundraiser-backend-uyse.onrender.com/api/orders')
      ]);
      
    //   setStats(statsResponse.data);
      setOrders(ordersResponse.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1>📊 Fundraiser Dashboard</h1>
          <p>Track your sales performance and order history</p>
        </div>
      </div>
      {/* Recent Orders */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2>📋 Recent Orders</h2>
        </div>
        <div className="card-body">
          {orders.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
              No orders yet. Start selling to see orders here!
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 20).map(order => (
                    <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customerId}</td>
                    </tr>
                  ))}
                    {/*<tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <div>
                          <strong>{order.firstName} {order.lastName}</strong>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>
                            {order.email}
                          </div>
                        </div>
                      </td>
                      <td>{order.productDescription}</td>
                      <td style={{ textAlign: 'center' }}>{order.quantity}</td>
                      <td style={{ fontWeight: '600', color: '#27ae60' }}>
                        ${order.total.toFixed(2)}
                      </td>
                      <td style={{ fontSize: '0.875rem' }}>
                        {formatDate(order.timestamp)}
                      </td>
                    </tr>
                  ))*/}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;