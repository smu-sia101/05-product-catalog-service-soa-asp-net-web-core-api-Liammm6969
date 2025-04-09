import React, { useState, useEffect } from 'react';
import '../CSS/Topbar.css';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Topbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [currentPath, setCurrentPath] = useState('/');
    
    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Set current path on mount and when location changes
        setCurrentPath(window.location.pathname);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    return (
        <div className={`topbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="topbar-logo">
                <h1 className="logo-text">Prodcut Catalog</h1>
            </div>
            
            <div className="topbar-links">
                <a 
                    href="/" 
                    className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
                >
                    <HomeIcon className="icon" /> Home
                </a>
                <a 
                    href="/products" 
                    className={`nav-link ${currentPath === '/products' ? 'active' : ''}`}
                >
                    <CategoryIcon className="icon" /> Products
                </a>
            </div>
        </div>
    );
};

export default Topbar;