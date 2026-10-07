import React from 'react';
import { useLocation } from 'react-router-dom';
import './Esgservices.css';

function EsgServices() {
  const query = new URLSearchParams(useLocation().search);
  const isSubscribed = query.get('subscribed') === 'true';

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'ESG_Report_2025.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Image download failed:', error);
      alert('Failed to download the image.');
    }
  };

  return (
    <div className="esg-page">
      <div className="esg-container">
        <h1 className="esg-title">ESG Services</h1>

        {/* Locked content */}
        {!isSubscribed && (
          <div className="esg-locked-content">
            <div className="esg-image-wrapper">
              <img
                src="/blur.png"
                alt="Locked Report"
                className="esg-locked-image"
              />
              <button
                className="esg-button esg-button--unlock"
                onClick={() => window.location.href = '/esgsubscription'}
              >
                Unlock
              </button>
            </div>
          </div>
        )}

        {/* Unlocked content */}
        {isSubscribed && (
          <div className="esg-unlocked-content">
            <div className="esg-report-container">
              <img
                src="/report.png"
                alt="Unlocked Report"
                className="esg-report-image"
              />
            </div>
            <div className="esg-button-container">
              <button
                className="esg-button esg-button--download"
                onClick={() => downloadImage('/report.png')}
              >
                Download ESG Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EsgServices;