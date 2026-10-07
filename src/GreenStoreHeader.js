import React, { useState } from 'react';
import './GreenStoreHeader.css';
import './Header.css';
import './Waves.css'; 
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Link } from "react-router-dom";
import { useStateValue } from './StateProvider';
import { auth } from './firebase';

function Header() {
    const [{ basket, user,ecoPulse }, dispatch] = useStateValue();
    const [showWaves, setShowWaves] = useState(false);
    const [waveHeight, setWaveHeight] = useState(0); // from 0 to 100
    


    const handleEcoPulseHover = () => {
        const percentageElement = document.querySelector('.ecopulsepercentage');
        const percentage = parseInt(percentageElement?.textContent) || 0;

        if (!isNaN(percentage)) {
            setWaveHeight(100 - percentage);
            setShowWaves(true);
        }
    };

    const handleEcoPulseLeave = () => {
        setShowWaves(false);
    };

    const waveScaleY = 1 - (waveHeight / 100) * 0.8;

    return (
        <>
            <div className='greenstoreheader'>
                <Link to='/'> 
                    <img className='greenstoreheader_logo' src='/amazonclonewhite.png' alt="Logo" /> 
                </Link>
             
                <div className='greenstoreheader_search'>
                    <input className="greenstoreheader_searchInput" type='text' placeholder='Search for eco products' />
                    <SearchIcon className='greenstoreheader__searchicon' />
                </div>
                
                <div className='greenstoreheader_nav'> 
                    <div className='greenstoreheader_option'>
                        <span className='greenstoreheader__optionlineone'>
                            {user ? `Hello, ${user.email}` : 'Hello Guest'}
                        </span>
                    </div>
                    <Link to='/dashboard'> 
                    <div 
                        className='greenstoreheader_option ecopulse-container'
                        onMouseEnter={handleEcoPulseHover}
                        onMouseLeave={handleEcoPulseLeave}
                    >
                        <span className='greenstoreheader__optionlineone'>
                            EcoPulse  
                        </span>
                        <span className='greenstoreheader__optionlinetwo ecopulsepercentage'>
                            {ecoPulse}
                        </span>
                    </div>
                    </Link>
                    <Link to="/orders"> 
                    <div className='greenstoreheader_option'>
                        <span className='greenstoreheader__optionlineone'>
                            My Orders
                        </span>
                    </div> </Link>
                    
                    <Link to="/vouchers">
                    <div className='greenstoreheader_option'>
                        <span className='greenstoreheader__optionlineone'>
                            My Vouchers
                        </span>
                    </div> </Link>
                    
                    
                    <Link to="/checkout"> 
                        <div className='greenstoreheader_optionbasket'>
                            <ShoppingBasketIcon />
                            <span className='greenstoreheader__optionlinetwo greenstoreheader_basketcount'>
                                My Basket {basket?.length}
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
            
            {/* Waves Container: always rendered but fades in/out */}
            <div
                className="waves-container"
                style={{
                    height: `${100 - waveHeight}%`,
                    opacity: showWaves ? 1 : 0,
                    visibility: showWaves ? 'visible' : 'hidden',
                    transition: 'opacity 1.2s ease, visibility 1.7s ease',
                }}
            >
                <svg
                    className="waves"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none"
                    shapeRendering="auto"
                >
                    <defs>
                        <path
                            id="gentle-wave"
                            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                        />
                    </defs>
                    <g
                        className="parallax"
                        style={{ transformOrigin: 'center bottom', transform: `scaleY(${waveScaleY})` }}
                    >
                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(46, 139, 87, 0.2)" />
                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(46, 139, 87, 0.3)" />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(34, 139, 34, 0.1)" />
                    </g>
                </svg>
            </div>
        </>
    );
}

export default Header;