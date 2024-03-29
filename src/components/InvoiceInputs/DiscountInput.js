import React, { useState, useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReorderModal from '../General/ReorderModal';

const DiscountInput = () => {
    const { discounts, discountActions, invoiceItems } = useContext(InvoiceContext);
    const [target, setTarget] = useState('Total'); // 'Total' or invoice item ID
    const [type, setType] = useState('percentage'); // 'percentage' or 'amount'
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [alignment, setAlignment] = useState('right');

    function isEven(number) {
        return number % 2 === 0;
    }

    const handleAddSection = (e) => {
        e.preventDefault();
        const id = Array.from(window.crypto.getRandomValues(new Uint8Array(5)), byte => byte.toString(16).padStart(2, '0')).join('');
        const targetItemTitle = target === 'Total' ? 'Total' : invoiceItems.find(item => item.id === target)?.title || 'Item';
        const discountTitle = type === 'amount'
            ? `-$${value} off ${targetItemTitle}`
            : `${value}% off ${targetItemTitle}`;
    
        discountActions.add({ type, value, description, alignment, target, id, title: discountTitle });
        setType('percentage');
        setValue('');
        setDescription('');
        setAlignment('left');
        setTarget('Total'); 
    };

    const handleUpdateSection = (index, key, updatedValue) => {
        const updatedDiscount = { ...discounts[index], [key]: updatedValue };
        
        if (['type', 'value', 'target'].includes(key)) {
            const targetItemTitle = updatedDiscount.target === 'Total' ? 'Total' : invoiceItems.find(item => item.id === updatedDiscount.target)?.title || 'Item';
            const discountTitle = updatedDiscount.type === 'amount'
                ? `-$${updatedDiscount.value} off ${targetItemTitle}`
                : `${updatedDiscount.value}% off ${targetItemTitle}`;
            updatedDiscount.title = discountTitle;
        }
        
        discountActions.update(index, updatedDiscount);
    };

    return (
        <div className="shadow-lg p-6 rounded-lg bg-white mt-5 w-full overflow-auto h-full">
            <h3 className="text-lg font-semibold mb-4">Add Discount Section</h3>
            <form onSubmit={handleAddSection} className="flex flex-col space-y-4 mb-4">
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                    <option value="percentage">Percentage</option>
                    <option value="amount">Amount</option>
                </select>
                <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                    <option value="Total">Total</option>
                    {invoiceItems.map(item => (
                        <option key={item.id} value={item.id}>{item.title}</option>
                    ))}
                </select>
                <input
                    type={type === 'percentage' ? 'number' : 'text'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    rows="3"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <select
                    value={alignment}
                    onChange={(e) => setAlignment(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
                <button
                    type="submit"
                    className="self-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                >
                     <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </form>
            
            {/* Accordion for editing discount sections */}
            { discounts.length >= 2 ? <ReorderModal items={discounts} onReorder={discountActions.reorder} itemType={'Discounts'}/> : null }
            {discounts.map((discount, index) => (
    <Accordion key={index}>
        <AccordionSummary
            className={`${isEven(index) ?  '!bg-blue-700' : '!bg-blue-500'} ${index === 0 && '!rounded-t-md'} !text-white`}
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
        >
            <div>Edit Discount: {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}</div>
        </AccordionSummary>
        <AccordionDetails>
            <div className="flex flex-col space-y-4">
                <select
                    value={discount.type}
                    onChange={(e) => handleUpdateSection(index, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                    <option value="percentage">Percentage</option>
                    <option value="amount">Amount</option>
                </select>
                <select
                    value={discount.target}
                    onChange={(e) => handleUpdateSection(index, 'target', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                    <option value="Total">Total</option>
                    {invoiceItems.map(item => (
                        <option key={item.id} value={item.id}>{item.title}</option>
                    ))}
                </select>
                <input
                    type={discount.type === 'percentage' ? 'number' : 'text'}
                    value={discount.value}
                    onChange={(e) => handleUpdateSection(index, 'value', e.target.value)}
                    placeholder={discount.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <textarea
                    value={discount.description}
                    onChange={(e) => handleUpdateSection(index, 'description', e.target.value)}
                    placeholder="Description"
                    rows="3"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                <div className="flex justify-between mt-3">
                    <button onClick={() => handleUpdateSection(index, 'alignment', 'left')} className={`px-3 py-1 rounded-md ${discount.alignment === 'left' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`}>Left</button>
                    <button onClick={() => handleUpdateSection(index, 'alignment', 'center')} className={`px-3 py-1 rounded-md ${discount.alignment === 'center' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`} >Center</button>
                    <button onClick={() => handleUpdateSection(index, 'alignment', 'right')} className={`px-3 py-1 rounded-md ${discount.alignment === 'right' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200 transition-colors duration-500'}`}>Right</button>
                </div>
                <button
                    onClick={() => window.confirm('Are you sure you want to delete this discount section?', discountActions.remove(index))}
                    className="border border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200 w-[80px] mx-auto cursor-pointer py-2 rounded-md"
                >
                    Remove
                </button>
            </div>
        </AccordionDetails>
    </Accordion>
))}
        </div>
    );
};

export default DiscountInput;
