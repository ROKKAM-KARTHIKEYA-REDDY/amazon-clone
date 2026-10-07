import React, { useState, useEffect } from 'react';
import "./Return.css";
import { useStateValue } from './StateProvider';
import { db } from './firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  setDoc,
  addDoc
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import moment from "moment";
import axios from 'axios';

function Return() {
  const [{ user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState('');
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch user's orders
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

      return () => unsubscribe();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const checkPincode = async () => {
    if (!pincode || pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }

    setIsCheckingPincode(true);
    try {
      // Here you would call your actual pincode API
      // For demo purposes, we'll mock it
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      
      if (response.data && response.data[0].Status === 'Success') {
        const postOffice = response.data[0].PostOffice[0];
        setLocation(`${postOffice.District}, ${postOffice.State}`);
      } else {
        alert('Invalid pincode or service not available in this area');
        setLocation('');
      }
    } catch (error) {
      console.error('Error checking pincode:', error);
      alert('Error verifying pincode. Please try again.');
      setLocation('');
    }
    setIsCheckingPincode(false);
  };

  const toggleItemSelection = (item) => {
    setSelectedItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id);
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      alert('Please select at least one item to return');
      return;
    }
    
    if (!pincode || !location) {
      alert('Please enter a valid pincode and verify it');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create or update the pincode document
      const pincodeRef = doc(db, 'returnPincodes', pincode);
      const pincodeDoc = await getDoc(pincodeRef);
      
      const returnData = {
        userId: user.uid,
        orderId: selectedOrder.id,
        items: selectedItems,
        timestamp: new Date(),
        status: 'pending'
      };
      
      if (pincodeDoc.exists()) {
        // Update existing pincode document
        await updateDoc(pincodeRef, {
          returns: arrayUnion(returnData),
          count: pincodeDoc.data().count + 1
        });
        
        // Check if threshold is reached
        if (pincodeDoc.data().count + 1 >= 3) {
          await processPincodeThreshold(pincodeRef, pincodeDoc.data());
        }
      } else {
        // Create new pincode document
        await setDoc(pincodeRef, {
          pincode,
          location,
          returns: [returnData],
          count: 1,
          thresholdReached: false
        });
      }
      
      // Add notification for the user
      await addDoc(collection(db, 'notifications'), {
        userId: user.uid,
        title: 'Return Request Submitted',
        message: `Your return request for ${selectedItems.length} item(s) has been received.`,
        type: 'return_request',
        read: false,
        timestamp: new Date()
      });
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setSelectedOrder(null);
      setSelectedItems([]);
      setPincode('');
      setLocation('');
      
      dispatch({
        type: 'SET_ALERT',
        alert: {
          message: 'Return request submitted successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error submitting return:', error);
      setIsSubmitting(false);
      dispatch({
        type: 'SET_ALERT',
        alert: {
          message: 'Error submitting return. Please try again.',
          type: 'error'
        }
      });
    }
  };

  const processPincodeThreshold = async (pincodeRef, pincodeData) => {
    if (pincodeData.thresholdReached) return;
    
    // Mark threshold as reached
    await updateDoc(pincodeRef, {
      thresholdReached: true,
      pickupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    });
    
    // Notify all users in this pincode
    const batch = pincodeData.returns.map(async returnItem => {
      await addDoc(collection(db, 'notifications'), {
        userId: returnItem.userId,
        title: 'Return Pickup Scheduled',
        message: `Return pickup has been scheduled for your items in ${pincodeData.location}. Pickup date: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
        type: 'return_pickup',
        read: false,
        timestamp: new Date()
      });
    });
    
    await Promise.all(batch);
  };

  return (
    <div className='return'>
      <h1>Initiate Product Return/Product Package Return</h1>
      <p className="return__subtitle">Select items you want to return and provide your location</p>
      
      {submitSuccess ? (
        <div className="return__success">
          <h2>Return Request Submitted!</h2>
          <p>We've received your return request.</p>
          <p>You'll be notified when pickup is scheduled for your area.</p>
          <button 
            onClick={() => setSubmitSuccess(false)}
            className="return__successButton"
          >
            Initiate Another Return
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="return__form">
          <div className="return__section">
            <h2>Step 1: Select Your Order</h2>
            <div className="return__orderCards">
              {orders.length === 0 ? (
                <p className="return__noOrders">You don't have any recent orders</p>
              ) : (
                orders.map(order => (
                  <div 
                    key={order.id}
                    className={`return__orderCard ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedOrder(order);
                      setSelectedItems([]);
                    }}
                  >
                    <div className="return__orderDate">
                      {moment.unix(order.data.created).format("MMMM D, YYYY")}
                    </div>
                    <div className="return__orderTotal">
                      Total: ₹{(order.data.amount/100).toLocaleString()}
                    </div>
                    <div className="return__orderItems">
                      {order.data.basket.slice(0, 3).map(item => (
                        <div key={item.id} className="return__orderItem">
                          <img src={item.image} alt={item.title} />
                          <span>{item.title}</span>
                        </div>
                      ))}
                      {order.data.basket.length > 3 && (
                        <div className="return__moreItems">
                          +{order.data.basket.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedOrder && (
            <div className="return__section">
              <h2>Step 2: Select Items to Return</h2>
              <div className="return__productGrid">
                {selectedOrder.data.basket.map(item => (
                  <div 
                    key={item.id}
                    className={`return__productCard ${
                      selectedItems.some(i => i.id === item.id) ? 'selected' : ''
                    }`}
                    onClick={() => toggleItemSelection(item)}
                  >
                    <img src={item.image} alt={item.title} />
                    <div className="return__productInfo">
                      <h3>{item.title}</h3>
                      <p>₹{item.price}</p>
                      <div className="return__checkbox">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.some(i => i.id === item.id)}
                          onChange={() => toggleItemSelection(item)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedItems.length > 0 && (
            <div className="return__section">
              <h2>Step 3: Enter Pickup Location</h2>
              <div className="return__locationInput">
                <div className="return__pincodeGroup">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={checkPincode}
                    disabled={isCheckingPincode || pincode.length !== 6}
                  >
                    {isCheckingPincode ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                {location && (
                  <div className="return__locationDisplay">
                    <p>Pickup location: <strong>{location}</strong></p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedItems.length > 0 && location && (
            <div className="return__submitSection">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="return__submitButton"
              >
                {isSubmitting ? (
                  <>
                    <span className="return__spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Return Request'
                )}
              </button>
              <p className="return__thresholdNote">
                Note: Pickup will be scheduled when at least 3 returns are requested in your pincode area.
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default Return;