import React, { useState, useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReorderModal from '../General/ReorderModal';

const DiscountInput = () => {
    const { discounts, discountActions, invoiceItems } = useContext(InvoiceContext);
    const [target, setTarget] = useState('Total');
    const [type, setType] = useState('percentage');
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
        setAlignment('right');
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

    const alignmentOptions = [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
    ];

    const getTypeButtonClass = (buttonType, currentType) => {
        const base = 'flex-1 py-2.5 px-3 text-sm font-medium transition-all duration-200';
        return buttonType === currentType 
            ? base + ' bg-blue-500 text-white shadow-sm'
            : base + ' text-gray-600 hover:bg-gray-100';
    };

    const getAlignmentButtonClass = (optionValue, currentAlignment) => {
        const base = 'flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200';
        return optionValue === currentAlignment
            ? base + ' bg-blue-500 text-white shadow-sm'
            : base + ' bg-gray-100 text-gray-600 hover:bg-gray-200';
    };

    const getAccordionSummaryClass = (index) => {
        let classes = isEven(index) ? '!bg-blue-600' : '!bg-blue-500';
        if (index === 0) classes += ' !rounded-t-lg';
        classes += ' !text-white !min-h-0';
        return classes;
    };

    return (
        <div className="bg-white w-full overflow-auto h-full">
            <h3 className="text-base font-semibold mb-4 text-gray-700">Add Discount</h3>
            <form onSubmit={handleAddSection} className="flex flex-col space-y-3 mb-4">
                <div className="flex rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={() => setType('percentage')}
                        className={getTypeButtonClass('percentage', type)}
                    >
                        % Percentage
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('amount')}
                        className={getTypeButtonClass('amount', type)}
                    >
                        $ Amount
                    </button>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1 font-medium">Apply to</label>
                    <select
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm"
                    >
                        <option value="Total">Entire Invoice Total</option>
                        {invoiceItems.map(item => (
                            <option key={item.id} value={item.id}>{item.title}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1 font-medium">
                        {type === 'percentage' ? 'Discount %' : 'Discount Amount ($)'}
                    </label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={type === 'percentage' ? '10' : '25.00'}
                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1 font-medium">Reason (optional)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., Loyalty discount"
                        rows="2"
                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm resize-none"
                    />
                </div>

                <div className="flex gap-2">
                    {alignmentOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setAlignment(option.value)}
                            className={getAlignmentButtonClass(option.value, alignment)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <button
                    type="submit"
                    className="self-center p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </form>
            
            {discounts.length >= 2 && (
                <ReorderModal items={discounts} onReorder={discountActions.reorder} itemType={'Discounts'}/>
            )}

            <div className="space-y-2 mt-4">
                {discounts.map((discount, index) => (
                    <Accordion key={discount.id || index} className="!rounded-lg !shadow-sm border border-gray-100 before:hidden">
                        <AccordionSummary
                            className={getAccordionSummaryClass(index)}
                            expandIcon={<ExpandMoreIcon className="text-white" />}
                            aria-controls={'panel' + index + 'a-content'}
                            id={'panel' + index + 'a-header'}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                                    {discount.type === 'percentage' ? '%' : '$'}
                                </span>
                                <span className="font-medium">
                                    {discount.type === 'percentage' ? discount.value + '%' : '$' + discount.value} off
                                </span>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails className="!p-4 bg-gray-50">
                            <div className="flex flex-col space-y-3">
                                <div className="flex rounded-lg overflow-hidden border border-gray-200 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateSection(index, 'type', 'percentage')}
                                        className={getTypeButtonClass('percentage', discount.type)}
                                    >
                                        % Percentage
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateSection(index, 'type', 'amount')}
                                        className={getTypeButtonClass('amount', discount.type)}
                                    >
                                        $ Amount
                                    </button>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-500 mb-1 font-medium">Apply to</label>
                                    <select
                                        value={discount.target}
                                        onChange={(e) => handleUpdateSection(index, 'target', e.target.value)}
                                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                                    >
                                        <option value="Total">Entire Invoice Total</option>
                                        {invoiceItems.map(item => (
                                            <option key={item.id} value={item.id}>{item.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-500 mb-1 font-medium">
                                        {discount.type === 'percentage' ? 'Discount %' : 'Amount ($)'}
                                    </label>
                                    <input
                                        type="number"
                                        value={discount.value}
                                        onChange={(e) => handleUpdateSection(index, 'value', e.target.value)}
                                        placeholder={discount.type === 'percentage' ? '10' : '25.00'}
                                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-500 mb-1 font-medium">Reason</label>
                                    <textarea
                                        value={discount.description}
                                        onChange={(e) => handleUpdateSection(index, 'description', e.target.value)}
                                        placeholder="Reason for discount"
                                        rows="2"
                                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm resize-none"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    {alignmentOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleUpdateSection(index, 'alignment', option.value)}
                                            className={getAlignmentButtonClass(option.value, discount.alignment)}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this discount?')) {
                                            discountActions.remove(index);
                                        }
                                    }}
                                    className='mt-2 py-2 px-4 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors duration-200 self-center'
                                >
                                    Remove Discount
                                </button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </div>
    );
};

export default DiscountInput;
