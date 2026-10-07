import React, { useState } from 'react';
import "./Greenproducts.css";
import { Link } from "react-router-dom";
import { useStateValue } from './StateProvider';

function Greenproducts({ id, title, image, price, rating, certifications = [] }) {
  const [{ basket }, dispatch] = useStateValue();
  const [showCertDialog, setShowCertDialog] = useState(false);

  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: { id, title, image, price, rating },
    });
  };

  const interpolateColor = (color1, color2, factor) => {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
  };

  const getEcoColor = (percentage) => {
    const p = Math.min(100, Math.max(0, percentage));
    if (p <= 50) {
      const ratio = p / 50;
      return interpolateColor([255, 87, 34], [255, 235, 59], ratio);
    } else {
      const ratio = (p - 50) / 50;
      return interpolateColor([255, 235, 59], [76, 175, 80], ratio);
    }
  };

  const ecoColor = getEcoColor(rating);

  return (
    <div className='Greenproduct'>
      <div className='Greenproduct_info'>
        <p>{title}</p>
        <p className='Greenproduct_price'>
          <small>₹</small>
          <strong>{price}</strong>
        </p>
      </div>

      <img src={image} alt={title} />

      <div className="EcoPulseContainer">
        <div
          className="EcoPulseBar"
          style={{
            width: `${rating}%`,
            backgroundColor: ecoColor,
            boxShadow: `0 0 8px ${ecoColor}AA`,
          }}
        ></div>
        <span className="EcoPulseLabel"><h3>{rating}% Eco Score</h3></span>
      </div>

      <div className="Greenproduct_buttons">
        <button onClick={addToBasket} className="add-button">Add to Basket</button>

        {certifications.length > 0 && (
          <div
            className="certification-section-wrapper"
            onMouseEnter={() => setShowCertDialog(true)}
            onMouseLeave={() => setShowCertDialog(false)}
          >
            {showCertDialog && (
              <div className="certification-dialog">
                <h4>Certifications</h4>
                <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                  {certifications.map((cert, index) => (
                    <li key={index} style={{ padding: "4px 0", color: "#2e7d32" }}>
                      ✅ {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="certification-section">
              <img src="/certification1.png" alt="Cert Icon" className="certification-icon" />
              <button className="certifications-btn">Certifications</button>
            </div>
          </div>
        )}
      </div>

      <Link to="/esgservices">
        <button className="esg-button">ESG Services</button>
      </Link>
    </div>
  );
}

export default Greenproducts;
