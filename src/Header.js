// Header.js
import React, { useEffect } from 'react'
import './Header.css'
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Link } from "react-router-dom";
import { useStateValue } from './StateProvider';
import { auth } from './firebase';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';

function Header() {
    const [{ basket, user, notifications }, dispatch] = useStateValue();

    const handleAuthentication = () => {
        if (user) {
            auth.signOut();
        }
    };

    return (
        <div className='header'>
            <Link to='/'>
                <img className='header_logo' src='/amazonclonewhite.png' alt='Logo' />
            </Link>

            <div className='header_search'>
                <select className="header_searchSelect">
                    <option value="all">All</option>
                    <option value="eco">Eco Products</option>
                </select>
                <input className="header_searchInput" type='text' />
                <SearchIcon className='header__searchicon' />
            </div>

            <div className='header_nav'>
                <Link to={!user && '/login'}>
                    <div onClick={handleAuthentication} className='header_option'>
                        <span className='header__optionlineone'>
                            {user ? `Hello, ${user?.email}` : 'Hello Guest'}
                        </span>
                        <span className='header__optionlinetwo'>
                            {user ? 'Sign Out' : 'Sign In'}
                        </span>
                    </div>
                </Link>

                <Link to='/orders'>
                    <div className='header_option'>
                        <span className='header__optionlineone'>Return</span>
                        <span className='header__optionlinetwo'>& Orders</span>
                    </div>
                </Link>

                <div className='header_option'>
                    <span className='header__optionlineone'>Your</span>
                    <span className='header__optionlinetwo'>Prime</span>
                </div>

                <Link to="/greenstorecheckout">
                    <div className='header_option green_store'>
                        <button className="greenStoreButton">Green Store</button>
                    </div>
                </Link>
                <Link to="/notifications">
                    <div className='header_option notifications'>
                        <Badge badgeContent={notifications?.length || 0} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </div>
                </Link>

                <Link to="/checkout">
                    <div className='header_optionbasket'>
                        <ShoppingBasketIcon />
                        <span className='header__optionlinetwo header_basketcount'>
                            {basket?.length}
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Header;