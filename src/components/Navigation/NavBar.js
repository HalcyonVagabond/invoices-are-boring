import React from 'react';
import logo from '../../assets/images/invoices-are-boring-logo-1.png'

const NavBar = () => {
    return (
        <nav className="w-full h-16 bg-blue-500 flex justify-between items-center px-4 sm:px-10 md:px-20 lg:px-40">
            <div className="flex items-center cursor-pointer">
                <img src={logo} alt="Logo" className="h-12 mr-2 rounded-md" />
                <span className="font-bold text-xl text-left">Invoices<br/> Boring</span>
                <span className="font-bold text-xl text-left ml-[-60px]">are</span>
            </div>
            <div className="mr-4">
                {/* Link that opens in a new tab */}
                <a className='shadow-lg font-semibold rounded-md py-3 px-4 bg-white cursor-pointer hover:bg-blue-400 hover:text-white transition-colors duration-500' href="https://www.buymeacoffee.com/jehrbear" target="_blank" rel="noopener noreferrer">Donate ❤️</a>
            </div>
        </nav>
    );
};

export default NavBar;
