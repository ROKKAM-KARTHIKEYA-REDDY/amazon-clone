import React from 'react'
import "./Checkout.css";
import Subtotal from './Subtotal';
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
function Checkout() {
    const [{basket,user},dispatch] = useStateValue();
  return (
    <div className='checkout'>
        <div className='Checkout_left'>
            <img className='checkout_ad' src='/bannercheckout.png'/>
            <div>
                <h3>Hello, {user?.email}</h3>
                <h2 className='checkout_title'> Your Shopping Basket </h2>
                {basket.map(item => (
                    <CheckoutProduct
                     id = {item.id}
                     title = {item.title}
                     image = {item.image}
                     price = {item.price}
                     rating = {(item.rating<5?item.rating :Math.round(item.rating/20))}
                    />
                ))}
            </div>
        </div>
        <div className='Checkout_right'>
           <Subtotal />
            
        </div>
        <footer style={{ fontSize: '12px', color: 'gray', textAlign: 'center', marginTop: '40px' }}>
        This is a fictional educational project. Not affiliated with Amazon or any real company.
      </footer>
    </div>
  )
}

export default Checkout
