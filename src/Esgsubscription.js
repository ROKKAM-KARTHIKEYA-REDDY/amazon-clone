import React, { useEffect, useState } from 'react';
import './Esgsubscription.css';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import axios from './axios';

function Esgsubscription() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const fetchClientSecret = async () => {
      const response = await axios.post(`/payment/create?total=${100000}`); // ₹1000 = 100000 paise
      setClientSecret(response.data.clientSecret);
    };
    fetchClientSecret();
  }, []);

  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(payload.error.message);
      setProcessing(false);
    } else {
      setSucceeded(true);
      setError(null);
      setProcessing(false);
      // redirect with success flag
      navigate('/esgservices?subscribed=true');
    }
  };

  return (
    <div className="subscription-container">
      <h2>Subscribe to ESG Reports</h2>
      <p>Pay ₹1000 to unlock exclusive ESG report content.</p>
      <form onSubmit={handleSubmit} className="payment-form">
        <CardElement onChange={handleChange} />
        <button type="submit" disabled={processing || disabled || succeeded}>
          {processing ? 'Processing...' : 'Pay ₹1000'}
        </button>
        {error && <div className="card-error">{error}</div>}
      </form>
    </div>
  );
}

export default Esgsubscription;
