import React, {useEffect} from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./Checkout";
import GreenStoreCheckout from "./GreenStoreCheckout"
import GreenStoreHeader from "./GreenStoreHeader";
import Login from "./Login";
import Payment from "./Payment"
import { useStateValue } from "./StateProvider";
import {auth} from "./firebase";
import { loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import Orders from "./Orders";
import Fakeclaims from "./Fakeclaims";
import Dashboard from "./Dashboard";
import Return from "./Return"
import Impactproduct from "./Impactproduct"
import Vouchers from "./Vouchers";
import Notifications from "./Notifications";
import Esgservices from "./Esgservices";
import Esgsubscription from "./Esgsubscription";
const promise= loadStripe("pk_test_51RXM5K01bTVtzeZIoG6BUPQTMXhPmpDZuZpFAcoADk1WVYtG6JSu6QGoOop1ruSIMp6v5YtPHGEvxRuqy3syjsHi00qIR1De5U");

function App() {
  const [{}, dispatch] = useStateValue();
  useEffect(()=>{
    
    auth.onAuthStateChanged(authUser =>{
      console.log('the user is >>>', authUser);
      if(authUser){
        //logged in 
        dispatch({
          type : 'SET_USER',
          user : authUser
        })
      }
      else{
        dispatch({
          type : 'SET_USER',
          user : null
        })

      }
    })
  }, [])
  return (
    // BEM
    
    <Router>
      <div className="app">
        
        <Routes>
          <Route path="/esgsubscription" element={
  <Elements stripe={promise}>
    <Esgsubscription />
  </Elements>
}/>
          <Route path="/impactproduct" element={[<Header />,<Impactproduct />]}/>
          <Route path="/returns" element={[<Return />]}/>
          <Route path="/esgservices" element={[<Esgservices />]}/>
          <Route path="/notifications" element={[<Notifications />]}/>
          <Route path="/fakeecoclaims" element={[<Fakeclaims />]}/>
          <Route path="/orders" element={[<Orders />]}/>
          <Route path="/vouchers" element={[<Vouchers />]}/>
          <Route path="/dashboard"  element={
    <div className="dashboard-bg">
      <Dashboard />
    </div>
  }/>
          <Route path="/greenstorecheckout" element={[<GreenStoreHeader />,<GreenStoreCheckout />]}/>
          <Route path="/login" element={[<Login />]}/>
          <Route path="/payment" element={[<Header />, <Elements stripe={promise}><Payment /></Elements>]}/>
          <Route path="/checkout" element={[<Header />, <Checkout />]}/>
          <Route path="/" element={[ <Header />,<Home />]}/>
          
        </Routes>
       
      </div>
    </Router>
    
  );
}

export default App;