import React from 'react';
import "./Impactproduct.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import { Link } from "react-router-dom";

function Impactproduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;
  const [{ basket }, dispatch] = useStateValue();

  // Redirect if no product data is available
  React.useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  if (!product) {
    return null; // or a loading spinner
  }

  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        rating: product.rating,
        category: product.category
      },
    });
  };

  return (
    <div className='impactproduct'>
      <div className="impactproduct_container">
        <div className="impactproduct_image">
          <img src={product.image} alt={product.title} />
        </div>
        
        <div className="impactproduct_info">
          <h1>{product.title}</h1>
          
          <div className="impactproduct_price">
            <small>₹</small>
            <strong>{product.price}</strong>
          </div>
          
          <div className="impactproduct_rating">
            {Array(product.rating).fill().map((_, i) => (
              <p key={i}>⭐</p>
            ))}
          </div>
          
          {product.category === "eco-friendly" && (
            <div className='eco-friendly-badge'>
              🌱 Eco Friendly
            </div>
          )}
          
          <div className="impactproduct_buttons">
            <button onClick={addToBasket} className="add-button">Add to Basket</button>
            
          </div>
          
          <div className="impactproduct_description">
            <h3>Product Impact Details:</h3>
            <p>This eco-friendly product helps reduce environmental impact by:</p>
            <ul>
              <li>Reducing carbon footprint by 20% compared to conventional products</li>
              <li>Using sustainable materials that are biodegradable</li>
              <li>Supporting fair trade practices</li>
            </ul>
          </div>
        </div>
      </div>
      
     
    </div>
  );
}

export default Impactproduct;