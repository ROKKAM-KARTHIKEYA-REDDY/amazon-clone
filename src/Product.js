import React from 'react';
import "./Product.css";
import { useNavigate } from "react-router-dom";
import { useStateValue } from './StateProvider';
import { Link } from "react-router-dom";

function Product({ id, title, image, price, rating, category = "non-eco-friendly" }) {
  const [{ basket }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id,
        title,
        image,
        price,
        rating,
        category
      },
    });
  };

  const handleImpactProduct = () => {
    navigate('/impactproduct', {
      state: {
        id,
        title,
        image,
        price,
        rating,
        category
      }
    });
  };

  return (
    <div className='product'>
      <div className='product_info'>
        <p>{title}</p>
        <p className='product_price'>
          <small>₹</small>
          <strong>{price}</strong>
        </p>
        <div className='product_rating_container'>
          <div className='product_rating'>
            {Array(rating).fill().map((_, i) => (
              <p key={i}>⭐</p>
            ))}
          </div>
          {category === "eco-friendly" && (
            <div className='eco-friendly-badge'>
              🌱 Eco Friendly
            </div>
          )}
        </div>
      </div>

      <img src={image} alt={title} />

      <div className="product_buttons">
        <button onClick={addToBasket} className="add-button">Add to Basket</button>
        
        {category === "eco-friendly" && (
          <div className="impact-product-section">
            <img src="/impactproduct.png" alt="Eco Icon" className="impact-icon" />
            <button onClick={handleImpactProduct} className="impact-button">
              Impact Product
            </button>
          </div>
        )}
      </div>
      
      <Link to="/esgservices">
        <button className="esg-button">ESG Services</button>
      </Link>
    </div>
  );
}

export default Product;