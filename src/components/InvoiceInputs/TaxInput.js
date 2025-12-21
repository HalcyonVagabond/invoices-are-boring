import React, { useState, useContext } from 'react';
import InvoiceContext from '../../context/InvoiceContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TaxInput = () => {
    const { taxes, taxActions } = useContext(InvoiceContext);
    const [name, setName] = useState('');
    const [type, setType] = useState('percentage');
    const [value, setValue] = useState('');
    const [alignment, setAlignment] = useState('right');

    const alignmentOptions = [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
    ];

    function isEven(number) {
        return number % 2 === 0;
    }

    const handleAddTax = (e) => {
        e.preventDefault();
        if (!name || !value) return;
        
        const id = Array.from(window.crypto.getRandomValues(new Uint8Array(5)), byte => byte.toString(16).padStart(2, '0')).join('');
        taxActions.add({ name, type, value, alignment, id });
        setName('');
        setType('percentage');
        setValue('');
        setAlignment('right');
    };

    const handleUpdateTax = (index, key, updatedValue) => {
        const updatedTax = { ...taxes[index], [key]: updatedValue };
        taxActions.update(index, updatedTax);
    };

    const getTypeButtonClass = (buttonType, currentType) => {
        const base = 'flex-1 py-2.5 px-3 text-sm font-medium transition-all duration-200';
        return buttonType === currentType 
            ? base + ' bg-green-500 text-white shadow-sm'
            : base + ' text-gray-600 hover:bg-gray-100';
    };

    const getAccordionSummaryClass = (index) => {
        let classes = isEven(index) ? '!bg-green-600' : '!bg-green-500';
        if (index === 0) classes += ' !rounded-t-lg';
        classes += ' !text-white !min-h-0';
        return classes;
    };

    // Common tax presets
    const taxPresets = [
        { name: 'Sales Tax', value: '8.25' },
        { name: 'VAT', value: '20' },
        { name: 'GST', value: '5' },
    ];

    return (
        <div className="bg-white w-full overflow-auto h-full">
            <h3 className="text-base font-semibold mb-4 text-gray-700">Add Tax</h3>
            
            {/* Quick presets */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {taxPresets.map((preset) => (
                    <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                            setName(preset.name);
                            setValue(preset.value);
                            setType('percentage');
                        }}
                        className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                    >
                        {preset.name} ({preset.value}%)
                    </button>
                ))}
            </div>

            <form onSubmit={handleAddTax} className="flex flex-col space-y-3 mb-4">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1 font-medium">Tax Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Sales Tax, VAT"
                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-50 text-sm"
                    />
                </div>

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
                        $ Fixed Amount
                    </button>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1 font-medium">
                        {type === 'percentage' ? 'Tax Rate (%)' : 'Tax Amount ($)'}
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={type === 'percentage' ? '8.25' : '50.00'}
                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-50 text-sm"
                    />
                </div>

                <div className="flex gap-2">
                    {alignmentOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setAlignment(option.value)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                                alignment === option.value
                                    ? 'bg-green-500 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <button
                    type="submit"
                    className="self-center p-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </form>

            <div className="space-y-2 mt-4">
                {taxes.map((tax, index) => (
                    <Accordion key={tax.id || index} className="!rounded-lg !shadow-sm border border-gray-100 before:hidden">
                        <AccordionSummary
                            className={getAccordionSummaryClass(index)}
                            expandIcon={<ExpandMoreIcon className="text-white" />}
                            aria-controls={'panel' + index + 'a-content'}
                            id={'panel' + index + 'a-header'}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                                    {tax.type === 'percentage' ? '%' : '$'}
                                </span>
                                <span className="font-medium">
                                    {tax.name}: {tax.type === 'percentage' ? tax.value + '%' : '$' + tax.value}
                                </span>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails className="!p-4 bg-gray-50">
                            <div className="flex flex-col space-y-3">
                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-500 mb-1 font-medium">Tax Name</label>
                                    <input
                                        type="text"
                                        value={tax.name}
                                        onChange={(e) => handleUpdateTax(index, 'name', e.target.value)}
                                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-sm"
                                    />
                                </div>

                                <div className="flex rounded-lg overflow-hidden border border-gray-200 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateTax(index, 'type', 'percentage')}
                                        className={getTypeButtonClass('percentage', tax.type)}
                                    >
                                        % Percentage
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateTax(index, 'type', 'amount')}
                                        className={getTypeButtonClass('amount', tax.type)}
                                    >
                                        $ Fixed
                                    </button>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-500 mb-1 font-medium">
                                        {tax.type === 'percentage' ? 'Rate (%)' : 'Amount ($)'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={tax.value}
                                        onChange={(e) => handleUpdateTax(index, 'value', e.target.value)}
                                        className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-sm"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    {alignmentOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleUpdateTax(index, 'alignment', option.value)}
                                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                                                tax.alignment === option.value
                                                    ? 'bg-green-500 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this tax?')) {
                                            taxActions.remove(index);
                                        }
                                    }}
                                    className='mt-2 py-2 px-4 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors duration-200 self-center'
                                >
                                    Remove Tax
                                </button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </div>
    );
};

export default TaxInput;
