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

    const alignmentOptions = [
        { value: 'left', icon: '⬅️', label: 'Left' },
        { value: 'center', icon: '↔️', label: 'Center' },
        { value: 'right', icon: '➡️', label: 'Right' },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">✏️</span>
                <h3 className="font-medium text-gray-700 text-sm">Invoice Title</h3>
            </div>
            <input
                type="text"
                value={invoiceTitle.title}
                onChange={handleChange}
                placeholder="Enter invoice title..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm transition-all"
            />
            <div className="flex gap-2 mt-3">
                {alignmentOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleAlignment(option.value)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                            invoiceTitle.alignment === option.value
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default InvoiceTitleInput;