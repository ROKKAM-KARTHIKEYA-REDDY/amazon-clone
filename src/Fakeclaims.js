import React, { useState, useEffect } from 'react';
import "./Fakeclaims.css"
import { useStateValue } from './StateProvider';
import { db } from './firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import moment from "moment";

function Fakeclaims() {
  const [{ user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert('You can upload maximum 5 images');
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      alert('Please select a product to claim');
      return;
    }
    
    if (images.length === 0) {
      alert('Please upload at least one image as proof');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add notification to Firestore
      await addDoc(collection(db, 'notifications'), {
        userId: user.uid,
        title: 'Eco Claim Submitted',
        message: `Your claim for "${selectedProduct.title}" has been received and is under review.`,
        type: 'eco_claim',
        read: false,
        timestamp: serverTimestamp(),
        claimData: {
          orderId: selectedOrder.id,
          productId: selectedProduct.id,
          description,
          imagesCount: images.length,
        }
      });
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setSelectedOrder(null);
      setSelectedProduct(null);
      setImages([]);
      setDescription('');
      
      // Show success message
      dispatch({
        type: 'SET_ALERT',
        alert: {
          message: 'Eco claim submitted successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error submitting claim:', error);
      setIsSubmitting(false);
      dispatch({
        type: 'SET_ALERT',
        alert: {
          message: 'Error submitting claim. Please try again.',
          type: 'error'
        }
      });
    }
  };

  return (
    <div className='fakeclaims'>
      <h1>Report Non-Eco-Friendly Product</h1>
      <p className="fakeclaims__subtitle">Help us maintain our eco-friendly standards by reporting any concerns</p>
      
      {submitSuccess ? (
        <div className="fakeclaims__success">
          <h2>Thank you for your report!</h2>
          <p>We've received your claim and will investigate it shortly.</p>
          <p>You'll receive updates in your notifications.</p>
          <button 
            onClick={() => setSubmitSuccess(false)}
            className="fakeclaims__successButton"
          >
            Report Another Product
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="fakeclaims__form">
          <div className="fakeclaims__section">
            <h2>Step 1: Select Your Order</h2>
            <div className="fakeclaims__orderCards">
              {orders.length === 0 ? (
                <p className="fakeclaims__noOrders">You don't have any recent orders</p>
              ) : (
                orders.map(order => (
                  <div 
                    key={order.id}
                    className={`fakeclaims__orderCard ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedOrder(order);
                      setSelectedProduct(null);
                    }}
                  >
                    <div className="fakeclaims__orderDate">
                      {moment.unix(order.data.created).format("MMMM D, YYYY")}
                    </div>
                    <div className="fakeclaims__orderTotal">
                      Total: ₹{(order.data.amount/100).toLocaleString()}
                    </div>
                    <div className="fakeclaims__orderItems">
                      {order.data.basket.slice(0, 3).map(item => (
                        <div key={item.id} className="fakeclaims__orderItem">
                          <img src={item.image} alt={item.title} />
                          <span>{item.title}</span>
                        </div>
                      ))}
                      {order.data.basket.length > 3 && (
                        <div className="fakeclaims__moreItems">
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
            <div className="fakeclaims__section">
              <h2>Step 2: Select Product to Report</h2>
              <div className="fakeclaims__productGrid">
                {selectedOrder.data.basket.map(item => (
                  <div 
                    key={item.id}
                    className={`fakeclaims__productCard ${selectedProduct?.id === item.id ? 'selected' : ''}`}
                    onClick={() => setSelectedProduct(item)}
                  >
                    <img src={item.image} alt={item.title} />
                    <div className="fakeclaims__productInfo">
                      <h3>{item.title}</h3>
                      <p>₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedProduct && (
            <>
              <div className="fakeclaims__section">
                <h2>Step 3: Upload Evidence</h2>
                <div className="fakeclaims__uploadArea">
                  <label className="fakeclaims__uploadLabel">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      disabled={images.length >= 5}
                    />
                    <div className="fakeclaims__uploadBox">
                      <span className="fakeclaims__uploadIcon">+</span>
                      <p>Click to upload images (max 5)</p>
                      <p className="fakeclaims__uploadHint">Upload clear photos showing the eco-friendly claim issue</p>
                    </div>
                  </label>
                  <div className="fakeclaims__imagePreview">
                    {images.map((image, index) => (
                      <div key={index} className="fakeclaims__imageItem">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Evidence ${index + 1}`} 
                        />
                        <button 
                          type="button" 
                          onClick={() => removeImage(index)}
                          className="fakeclaims__removeImage"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fakeclaims__section">
                <h2>Step 4: Describe the Issue</h2>
                <div className="fakeclaims__descriptionBox">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please describe why you believe this product isn't eco-friendly..."
                    rows={5}
                  />
                  <p className="fakeclaims__descriptionHint">
                    Example: "The product arrived wrapped in excessive non-recyclable plastic"
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="fakeclaims__submitButton"
              >
                {isSubmitting ? (
                  <>
                    <span className="fakeclaims__spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}

export default Fakeclaims;