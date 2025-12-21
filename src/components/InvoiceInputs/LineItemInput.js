import React, { useState, useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReorderModal from '../General/ReorderModal';

function InvoiceItemEntry() {
    const { invoiceItems, invoiceItemActions } = useContext(InvoiceContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [billingType, setBillingType] = useState('hourly'); // 'hourly' or 'fixed'
    const [rate, setRate] = useState('');
    const [hours, setHours] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleRateChange = (event) => {
        setRate(event.target.value);
    };

    const handleHoursChange = (event) => {
        setHours(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = Array.from(window.crypto.getRandomValues(new Uint8Array(5)), byte => byte.toString(16).padStart(2, '0')).join('');
        
        if (billingType === 'hourly') {
            invoiceItemActions.add({ title, description, rate, hours, billingType, id });
        } else {
            invoiceItemActions.add({ title, description, price, quantity, billingType, id });
        }
        
        // Reset form
        setTitle('');
        setDescription('');
        setRate('');
        setHours('');
        setPrice('');
        setQuantity('');
    };

    const handleUpdateItem = (index, key, value) => {
        const updatedItem = { ...invoiceItems[index], [key]: value };
        invoiceItemActions.update(index, updatedItem);
    };

    const handleBillingTypeChange = (index, newBillingType) => {
        const item = invoiceItems[index];
        let updatedItem = { ...item, billingType: newBillingType };
        
        // Convert values when switching billing types
        if (newBillingType === 'hourly' && item.billingType === 'fixed') {
            updatedItem.rate = item.price || '';
            updatedItem.hours = item.quantity || '';
            delete updatedItem.price;
            delete updatedItem.quantity;
        } else if (newBillingType === 'fixed' && item.billingType === 'hourly') {
            updatedItem.price = item.rate || '';
            updatedItem.quantity = item.hours || '';
            delete updatedItem.rate;
            delete updatedItem.hours;
        }
        
        invoiceItemActions.update(index, updatedItem);
    };

    function isEven(number) {
        return number % 2 === 0;
    }

    // Determine item's billing type (for backwards compatibility with old items)
    const getItemBillingType = (item) => {
        if (item.billingType) return item.billingType;
        return item.quantity ? 'fixed' : 'hourly';
    };

    return (
        <div className="bg-white w-full overflow-auto h-full">
            
            <h3 className="text-base font-semibold mb-4 text-gray-700">Add Invoice Item</h3>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3 mb-4">
                {/* Billing Type Toggle */}
                <div className="flex rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={() => setBillingType('hourly')}
                        className={`flex-1 py-2.5 px-3 text-sm font-medium transition-all duration-200 ${
                            billingType === 'hourly'
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        ⏱️ Hourly
                    </button>
                    <button
                        type="button"
                        onClick={() => setBillingType('fixed')}
                        className={`flex-1 py-2.5 px-3 text-sm font-medium transition-all duration-200 ${
                            billingType === 'fixed'
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        📦 Fixed Price
                    </button>
                </div>

                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Item name"
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm"
                />
                <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Description (optional)"
                    rows="2"
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm resize-none"
                />
                
                {billingType === 'hourly' ? (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1 font-medium">Hourly Rate ($)</label>
                            <input
                                type="number"
                                value={rate}
                                onChange={handleRateChange}
                                placeholder="0.00"
                                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1 font-medium">Hours</label>
                            <input
                                type="number"
                                value={hours}
                                onChange={handleHoursChange}
                                placeholder="0"
                                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1 font-medium">Unit Price ($)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={handlePriceChange}
                                placeholder="0.00"
                                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1 font-medium">Quantity</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                placeholder="0"
                                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm"
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="self-center p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </form>

            {invoiceItems.length >= 2 && (
                <ReorderModal items={invoiceItems} onReorder={invoiceItemActions.reorder} itemType={'Invoice Items'}/>
            )}
            
            <div className="space-y-2 mt-4">
                {invoiceItems.map((item, index) => {
                    const itemBillingType = getItemBillingType(item);
                    return (
                        <Accordion key={item.id || index} className="!rounded-lg !shadow-sm border border-gray-100 before:hidden">
                            <AccordionSummary
                                className={`${isEven(index) ? '!bg-blue-600' : '!bg-blue-500'} ${index === 0 && '!rounded-t-lg'} !text-white !min-h-0`}
                                expandIcon={<ExpandMoreIcon className="text-white" />}
                                aria-controls={`panel${index}a-content`}
                                id={`panel${index}a-header`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                                        {itemBillingType === 'hourly' ? '⏱️' : '📦'}
                                    </span>
                                    <span className="font-medium">{item.title || 'Untitled Item'}</span>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails className="!p-4 bg-gray-50">
                                <div className="flex flex-col space-y-3">
                                    {/* Billing Type Toggle for Edit */}
                                    <div className="flex rounded-lg overflow-hidden border border-gray-200 bg-white">
                                        <button
                                            type="button"
                                            onClick={() => handleBillingTypeChange(index, 'hourly')}
                                            className={`flex-1 py-2 px-3 text-xs font-medium transition-all duration-200 ${
                                                itemBillingType === 'hourly'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            ⏱️ Hourly
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleBillingTypeChange(index, 'fixed')}
                                            className={`flex-1 py-2 px-3 text-xs font-medium transition-all duration-200 ${
                                                itemBillingType === 'fixed'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            📦 Fixed
                                        </button>
                                    </div>

                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                                        placeholder="Item name"
                                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                                    />
                                    <textarea
                                        value={item.description}
                                        onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                                        placeholder="Description"
                                        rows="2"
                                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm resize-none"
                                    />
                                    
                                    {itemBillingType === 'hourly' ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col">
                                                <label className="text-xs text-gray-500 mb-1 font-medium">Rate ($)</label>
                                                <input
                                                    type="number"
                                                    value={item.rate || ''}
                                                    onChange={(e) => handleUpdateItem(index, 'rate', e.target.value)}
                                                    placeholder="0.00"
                                                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs text-gray-500 mb-1 font-medium">Hours</label>
                                                <input
                                                    type="number"
                                                    value={item.hours || ''}
                                                    onChange={(e) => handleUpdateItem(index, 'hours', e.target.value)}
                                                    placeholder="0"
                                                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col">
                                                <label className="text-xs text-gray-500 mb-1 font-medium">Price ($)</label>
                                                <input
                                                    type="number"
                                                    value={item.price || ''}
                                                    onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                                                    placeholder="0.00"
                                                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs text-gray-500 mb-1 font-medium">Qty</label>
                                                <input
                                                    type="number"
                                                    value={item.quantity || ''}
                                                    onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                                                    placeholder="0"
                                                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    <button 
                                        className='mt-2 py-2 px-4 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors duration-200 self-center'
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this item?')) {
                                                invoiceItemActions.remove(index);
                                            }
                                        }}
                                    >
                                        Remove Item
                                    </button>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </div>
        </div>
    );
}

export default InvoiceItemEntry;