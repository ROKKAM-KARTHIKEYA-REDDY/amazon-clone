import React, { useState, useEffect } from 'react';
import "./Vouchers.css";
import { useStateValue } from './StateProvider';

function Vouchers() {
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);
  const [{ ecoPulse }] = useStateValue();

  // Load redeemed vouchers from localStorage on component mount
  useEffect(() => {
    const savedVouchers = JSON.parse(localStorage.getItem('redeemedVouchers')) || [];
    setRedeemedVouchers(savedVouchers);
  }, []);

  // Save to localStorage whenever redeemedVouchers changes
  useEffect(() => {
    localStorage.setItem('redeemedVouchers', JSON.stringify(redeemedVouchers));
  }, [redeemedVouchers]);

  const toggleRedeem = (voucherId) => {
    // Check if voucher is eligible based on EcoPulse score
    if (!isVoucherEligible(voucherId)) return;

    if (redeemedVouchers.includes(voucherId)) {
      setRedeemedVouchers(redeemedVouchers.filter(id => id !== voucherId));
    } else {
      setRedeemedVouchers([...redeemedVouchers, voucherId]);
    }
  };

  const isVoucherEligible = (voucherId) => {
    if (!ecoPulse) return false;
    
    switch(voucherId) {
      case '5':
        return ecoPulse > 20;
      case '10':
        return ecoPulse > 35;
      case '15':
        return ecoPulse > 55;
      case '1.5':
        return ecoPulse > 10;
      case '2':
        return ecoPulse > 15;
      case 'free':
        return ecoPulse > 70;
      default:
        return false;
    }
  };

  const voucherData = [
    { id: '5', amount: '$5', img: '/5.png', discount: '5%' },
    { id: '10', amount: '$10', img: '/10.png', discount: '10%' },
    { id: '15', amount: '$15', img: '/15.png', discount: '15%' },
    { id: '1.5', amount: '$1.5', img: '/1.5.png', discount: '1.5X EcoPulse' },
    { id: '2', amount: '$2', img: '/2.png', discount: '2X EcoPulse' },
    { id: 'free', amount: 'Free', img: '/free.png', discount: 'Free Delivery' }
  ];

  return (
    <div className='vouchers'>
      <div className="vouchers-container">
        <h1 className="vouchers-title">Available Vouchers</h1>
        <div className="eco-pulse-display">
          Your current EcoPulse: <strong>{ecoPulse || 0}</strong>
        </div>
        
        <div className="vouchers-grid">
          {voucherData.map((voucher) => {
            const isRedeemed = redeemedVouchers.includes(voucher.id);
            const isEligible = isVoucherEligible(voucher.id);
            
            return (
              <div 
                className={`voucher-card ${isRedeemed ? 'redeemed' : ''} ${!isEligible ? 'ineligible' : ''}`} 
                key={voucher.id}
              >
                <div className={`voucher-image ${voucher.id}`}>
                  <img src={voucher.img} alt={`${voucher.amount} voucher`}/>
                  {!isEligible && (
                    <div className="eligibility-overlay">
                      EcoPulse {getRequiredScore(voucher.id)}+ required
                    </div>
                  )}
                </div>
                <div className="voucher-info">
                  <p>{voucher.discount} Discount</p>
                </div>
                <button 
                  className={`redeem-btn ${isRedeemed ? 'redeemed' : ''} ${!isEligible ? 'ineligible' : ''}`}
                  onClick={() => toggleRedeem(voucher.id)}
                  disabled={!isEligible}
                >
                  {isRedeemed ? 'Redeemed' : isEligible ? 'Redeem' : 'Not Eligible'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className='disclaimer'>
        <h3>*Voucher should be used in 90 days or on coming 5 orders else voucher will expire</h3>
      </div>
    </div>
  );
}

// Helper function to get required score for each voucher
function getRequiredScore(voucherId) {
  switch(voucherId) {
    case '5': return 20;
    case '10': return 35;
    case '15': return 55;
    case '1.5': return 10;
    case '2': return 15;
    case 'free': return 70;
    default: return 0;
  }
}

export default Vouchers;