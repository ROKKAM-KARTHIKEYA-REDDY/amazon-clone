import React, { useEffect, useState } from 'react';
import './Orders.css';
import { Link } from "react-router-dom";
import { db } from './firebase';
import { useStateValue } from './StateProvider';
import Order from './Order';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import ReplayIcon from '@mui/icons-material/Replay'; // for Return
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'; // for AI

function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const ordersRef = collection(db, 'users', user.uid, 'orders');
      const q = query(ordersRef, orderBy('created', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

      return () => unsubscribe(); // Cleanup listener on unmount
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <div className='orders'>
      <div className="orders_header">
        <h1>Your Orders</h1>
        <div className="orders_buttons">
          <button onClick={() => navigate('/returns')} className="orders_button return_button">
            Return</button>
          <button 
  onClick={() => navigate('/fakeecoclaims')}
  className="orders_button eco_button"
>
  Eco Third Umpire
</button>
          
        </div>
      </div>

      <div className='orders_order'>
        {orders?.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default Orders;
