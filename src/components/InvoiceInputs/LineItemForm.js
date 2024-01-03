import React, { useState, useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';

function InvoiceItemEntry() {
    const { addInvoiceItem } = useContext(InvoiceContext);
    const [description, setDescription] = useState('');
    const [rate, setRate] = useState('');
    const [hours, setHours] = useState('');

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleRateChange = (event) => {
        setRate(event.target.value);
    };

    const handleHoursChange = (event) => {
        setHours(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addInvoiceItem({ description, rate, hours });
        setDescription('');
        setRate('');
        setHours('');
    };

    return (
        <div className="shadow-lg p-6 rounded-lg bg-white mt-5 w-full overflow-auto max-w-[300px] h-full">
            <h3 className="text-lg font-semibold mb-4">Add Invoice Item</h3>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Description"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <input
                    type="number"
                    value={rate}
                    onChange={handleRateChange}
                    placeholder="Rate per Hour"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <input
                    type="number"
                    value={hours}
                    onChange={handleHoursChange}
                    placeholder="Hours"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                    type="submit"
                    className="self-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                >
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </form>
        </div>
    );
}

export default InvoiceItemEntry;