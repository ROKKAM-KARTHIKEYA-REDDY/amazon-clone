import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
  e.preventDefault();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      
      console.log(userCredential);
      navigate('/');  
    })
    .catch((error) => {
      alert(error.message);
    });
};

 const register = (e) => {
  e.preventDefault();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential);
      
        navigate('/');
      
       
    })
    .catch((error) => alert(error.message));
};


  return (
    <div className="login">
      <Link to="/">
        <img className="login_logo" src="/amazonblack.png" alt="Amazon Logo" />
      </Link>

      <div className="login__container">
        <h1>Sign-in</h1>

        <form>
          <h5>E-mail</h5>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

          <h5>Password</h5>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" onClick={signIn} className="login_signInButton">
            Sign In Amazon Clone
          </button>
        </form>

        <p>
          By signing-in you agree to the AMAZON CLONE Conditions of Use & Sale. Please
          see our Privacy Notice, this is purely for educational purposes !!our Cookies Notice and our Interest-Based Ads Notice.
        </p>

        <button onClick={register} className="login_registerButton">
          Create your Amazon-Clone Account
        </button>
      </div>
      <footer style={{ fontSize: '12px', color: 'gray', textAlign: 'center', marginTop: '40px' }}>
        This is a fictional educational project. Not affiliated with Amazon or any real company.
      </footer>
    </div>
  );
}

export default Login;
