import React, { useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

const InvoiceTitleInput = () => {
    const { invoiceTitle, setInvoiceTitle } = useContext(InvoiceContext);

    const handleChange = (event) => {
        setInvoiceTitle({ ...invoiceTitle, title: event.target.value });
    };

    const handleAlignment = (alignment) => {
        setInvoiceTitle({ ...invoiceTitle, alignment });
    };

    return (
        <div className="shadow-md md:shadow-lg p-6 rounded-lg bg-white mt-5 w-full md:max-w-[320px] h-[180px] mx-auto">
            <h3 className="text-lg font-semibold mb-4">Invoice Title</h3>
            <input
                type="text"
                value={invoiceTitle.title}
                onChange={handleChange}
                placeholder="Invoice Title"
                className={`w-full mx-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300`}
            />
            <div className="flex justify-between mt-3 px-3">
                <button onClick={() => handleAlignment('left')} className={`px-3 py-1 rounded-md ${invoiceTitle.alignment === 'left' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`}>Left</button>
                <button onClick={() => handleAlignment('center')} className={`px-3 py-1 rounded-md ${invoiceTitle.alignment === 'center' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`} >Center</button>
                <button onClick={() => handleAlignment('right')} className={`px-3 py-1 rounded-md ${invoiceTitle.alignment === 'right' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`}>Right</button>
            </div>
        </div>
    );
};

export default InvoiceTitleInput;