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
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
    ];

    return (
        <div className="bg-slate-700/50 rounded-xl border border-slate-600/50 p-4 mb-3">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">✏️</span>
                <h3 className="font-medium text-slate-200 text-sm">Invoice Title</h3>
            </div>
            <input
                type="text"
                value={invoiceTitle.title}
                onChange={handleChange}
                placeholder="Enter invoice title..."
                className="w-full px-3 py-2.5 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-slate-800 text-slate-200 placeholder-slate-500 text-sm transition-all"
            />
            <div className="flex gap-2 mt-3">
                {alignmentOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleAlignment(option.value)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                            invoiceTitle.alignment === option.value
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300'
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