import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

const InvoiceTitleInput = () => {
    const { invoiceTitle, setInvoiceTitle, titleAlignment, setTitleAlignment } = useContext(InvoiceContext);

    const handleChange = (event) => {
        setInvoiceTitle(event.target.value);
    };

    const handleAlignment = (alignment) => {
        setTitleAlignment(alignment);
    };

    return (
        <div className="shadow-lg p-6 rounded-lg bg-white mt-5 w-full max-w-[300px] h-[180px]">
            <h3 className="text-lg font-semibold mb-4">Invoice Title</h3>
            <input
                type="text"
                value={invoiceTitle}
                onChange={handleChange}
                placeholder="Invoice Title"
                className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300`}
            />
            <div className="flex justify-between mt-3 px-3">
                <button onClick={() => handleAlignment('left')} className={`px-3 py-1 rounded-md ${titleAlignment === 'left' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`}>Left</button>
                <button onClick={() => handleAlignment('center')} className={`px-3 py-1 rounded-md ${titleAlignment === 'center' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`} >Center</button>
                <button onClick={() => handleAlignment('right')} className={`px-3 py-1 rounded-md ${titleAlignment === 'right' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`}>Right</button>
            </div>
        </div>
    );
};

export default InvoiceTitleInput;