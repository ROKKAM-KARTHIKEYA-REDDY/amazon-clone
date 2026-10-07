import React, { useState, useEffect } from 'react';
import './Payment.css';
import axios from './axios';
import { db } from './firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import CheckoutProduct from './CheckoutProduct';
import { useStateValue } from './StateProvider';
import { Link, useNavigate } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [availableVouchers, setAvailableVouchers] = useState([]);

  useEffect(() => {
    const redeemedVouchers = JSON.parse(localStorage.getItem('redeemedVouchers')) || [];
    const supportedVouchers = redeemedVouchers.filter(id => ['5', '10', '15'].includes(id));
    setAvailableVouchers(supportedVouchers);
  }, []);

  useEffect(() => {
    const getClientSecret = async () => {
      const totalAmount = Math.round(calculateTotal() * 100);
      const response = await axios.post(`/payment/create?total=${totalAmount}`);
      setClientSecret(response.data.clientSecret);
    };

    if (basket.length > 0) {
      getClientSecret();
    }
  }, [basket, selectedVoucher]);

  const calculateSubtotal = () => {
    return getBasketTotal(basket);
  };

  const calculateDiscount = () => {
    if (!selectedVoucher) return 0;
    
    const subtotal = calculateSubtotal();
    switch(selectedVoucher) {
      case '5':
        return subtotal * 0.05;
      case '10':
        return subtotal * 0.10;
      case '15':
        return subtotal * 0.15;
      default:
        return 0;
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return subtotal - discount;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    const paymentIntent = payload.paymentIntent;

    await setDoc(
      doc(collection(db, 'users', user?.uid, 'orders'), paymentIntent.id),
      {
        basket: basket,
        amount: paymentIntent.amount,
        created: paymentIntent.created,
        voucherUsed: selectedVoucher,
        discountApplied: calculateDiscount(),
      }
    );

    if (selectedVoucher) {
      const updatedVouchers = availableVouchers.filter(id => id !== selectedVoucher);
      setAvailableVouchers(updatedVouchers);
      localStorage.setItem('redeemedVouchers', JSON.stringify(updatedVouchers));
    }

    setSucceeded(true);
    setError(null);
    setProcessing(false);

    dispatch({
      type: 'EMPTY_BASKET',
    });

    navigate('/orders', { replace: true });
  };

  const handleChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  return (
    <div className='payment'>
      <div className='payment_container'>
        <h1>
          Checkout (<Link to='/checkout'>{basket?.length} items</Link>)
        </h1>

        <div className='payment_section'>
          <div className='payment_title'>
            <h3>Delivery Address</h3>
          </div>
          <div className='payment_address'>
            <p>{user?.email}</p>
            <p>Palasa, Srikakulam</p>
            <p>Andhra Pradesh</p>
          </div>
        </div>

        <div className='payment_section'>
          <div className='payment_title'>
            <h3>Review items and delivery</h3>
          </div>
          <div className='payment_items'>
            {basket.map((item, index) => (
              <CheckoutProduct
                key={index}
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={(item.rating<5?item.rating :Math.round(item.rating/20))}
              />
            ))}
          </div>
        </div>

        {availableVouchers.length > 0 && (
          <div className='payment_section'>
            <div className='payment_title'>
              <h3>Apply Voucher</h3>
            </div>
            <div className='payment_vouchers'>
              <div className='vouchers_container'>
                <h4 className='vouchers_header'>Your Available Vouchers</h4>
                <div className='vouchers_grid'>
                  {availableVouchers.map(voucherId => (
                    <div 
                      key={voucherId} 
                      className={`voucher_card ${selectedVoucher === voucherId ? 'selected' : ''}`}
                      onClick={() => setSelectedVoucher(selectedVoucher === voucherId ? null : voucherId)}
                    >
                      <div className='voucher_content'>
                        <div className='voucher_percentage'>
                          {voucherId}%
                        </div>
                        <div className='voucher_details'>
                          <span className='voucher_title'>Discount Voucher</span>
                          <span className='voucher_desc'>{voucherId}% off on your order</span>
                        </div>
                      </div>
                      <div className='voucher_radio'>
                        <input
                          type='radio'
                          id={`voucher-${voucherId}`}
                          name='voucher'
                          checked={selectedVoucher === voucherId}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {selectedVoucher && (
                  <div className='voucher_selected_info'>
                    <span>{selectedVoucher}% discount will be applied</span>
                    <button 
                      className='remove_voucher'
                      onClick={() => setSelectedVoucher(null)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className='payment_section'>
          <div className='payment_title'>
            <h3>Payment Method</h3>
          </div>
          <div className='payment_details'>
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className='payment_priceContainer'>
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <p>
                        Subtotal ({basket.length} items): <strong>{value}</strong>
                      </p>
                      {selectedVoucher && (
                        <p>
                          Discount ({selectedVoucher === '5' ? '5%' : selectedVoucher === '10' ? '10%' : '15%'}): 
                          <strong style={{ color: 'green' }}> -₹{calculateDiscount().toFixed(2)}</strong>
                        </p>
                      )}
                      <p>
                        Total: <strong>₹{calculateTotal().toFixed(2)}</strong>
                      </p>
                      <small className='subtotal__gift'>
                        <input type='checkbox' /> This order contains a gift
                      </small>
                    </>
                  )}
                  decimalScale={2}
                  value={calculateSubtotal()}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'₹'}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : 'Buy Now'}</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;