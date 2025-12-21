import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/invoices-are-boring-logo-1.png';
import UserMenu from '../Auth/UserMenu';
import AuthModal from '../Auth/AuthModal';

const NavBar = () => {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    const openAuth = (mode) => {
        setAuthMode(mode);
        setAuthModalOpen(true);
    };

    return (
        <>
            <nav className="w-full h-16 bg-slate-700/50 border-b border-slate-700/50 flex justify-between items-center px-4 sm:px-10 md:px-20 lg:px-40">
                <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={logo} alt="Logo" className="h-10 mr-3 rounded-lg shadow-lg" />
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-white leading-tight">Invoices are</span>
                        <span className="font-bold text-lg text-blue-400 leading-tight">Boring</span>
                    </div>
                </Link>
                <div className="flex items-center gap-3">
                    <a 
                        className='hidden sm:flex shadow-lg font-semibold rounded-lg py-2.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white cursor-pointer hover:from-pink-600 hover:to-rose-600 transition-all duration-300 text-sm items-center gap-2' 
                        href="https://www.buymeacoffee.com/jehrbear" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <span>❤️</span> Donate
                    </a>
                    <UserMenu onOpenAuth={openAuth} />
                </div>
            </nav>
            <AuthModal 
                isOpen={authModalOpen} 
                onClose={() => setAuthModalOpen(false)} 
                initialMode={authMode}
            />
        </>
    );
};

export default NavBar;
